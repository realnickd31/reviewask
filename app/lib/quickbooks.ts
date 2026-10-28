import crypto from "crypto";
import { db, type User } from "./db";

// QuickBooks Online OAuth 2.0 + Webhooks.
// OAuth: https://developer.intuit.com/app/developer/qbo/docs/develop/authentication-and-authorization/oauth-2.0
// Webhooks (CloudEvents): https://developer.intuit.com/app/developer/qbo/docs/develop/webhooks
const sandbox = () => (process.env.INTUIT_ENVIRONMENT || "sandbox").toLowerCase() !== "production";
const AUTH = "https://appcenter.intuit.com/connect/oauth2";
const TOKEN = "https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer";
const REVOKE = "https://developer.api.intuit.com/v2/oauth2/tokens/revoke";
const API = () => (sandbox() ? "https://sandbox-quickbooks.api.intuit.com" : "https://quickbooks.api.intuit.com");
const MINOR = process.env.INTUIT_MINOR_VERSION || "75";
// Read-only accounting data. No payments/payroll/write scopes.
export const SCOPES = ["com.intuit.quickbooks.accounting"];

export const qboConfigured = () => !!(process.env.INTUIT_CLIENT_ID && process.env.INTUIT_CLIENT_SECRET);
export const redirectUri = (base: string) => process.env.INTUIT_REDIRECT_URI || `${base.replace(/\/$/, "")}/api/quickbooks/callback`;

export function authUrl(base: string, state: string) {
  const q = new URLSearchParams({ client_id: process.env.INTUIT_CLIENT_ID!, response_type: "code", scope: SCOPES.join(" "), redirect_uri: redirectUri(base), state });
  return `${AUTH}?${q}`;
}
const basic = () => "Basic " + Buffer.from(`${process.env.INTUIT_CLIENT_ID}:${process.env.INTUIT_CLIENT_SECRET}`).toString("base64");
type Tok = { access_token: string; refresh_token: string; expires_in: number; x_refresh_token_expires_in?: number };
async function tokenReq(body: Record<string, string>): Promise<Tok> {
  const r = await fetch(TOKEN, { method: "POST", headers: { authorization: basic(), accept: "application/json", "content-type": "application/x-www-form-urlencoded" }, body: new URLSearchParams(body) });
  if (!r.ok) throw new Error(`Intuit token error ${r.status}`); // never log the body
  return r.json();
}
export const exchangeCode = (code: string, base: string) => tokenReq({ grant_type: "authorization_code", code, redirect_uri: redirectUri(base) });

const CLEAR = "qbo_connected=0, qbo_access_token=NULL, qbo_refresh_token=NULL, qbo_token_expires_at=NULL, qbo_realm_id=NULL";
export const clearQbo = (userId: number) => db.prepare(`UPDATE users SET ${CLEAR} WHERE id=?`).run(userId);
export const clearRealm = (realmId: string) => db.prepare(`UPDATE users SET ${CLEAR} WHERE qbo_realm_id=?`).run(realmId);

export function saveTokens(userId: number, t: Tok, realmId?: string) {
  // Access tokens live ~1h; refresh tokens rotate and must be stored every refresh.
  const exp = new Date(Date.now() + (t.expires_in || 3600) * 1000).toISOString();
  if (!realmId) {
    db.prepare(`UPDATE users SET qbo_access_token=?, qbo_refresh_token=COALESCE(?, qbo_refresh_token), qbo_token_expires_at=? WHERE id=?`).run(t.access_token, t.refresh_token ?? null, exp, userId);
    return;
  }
  // One ReviewAsk account per QuickBooks company (realmId).
  db.prepare(`UPDATE users SET ${CLEAR} WHERE qbo_realm_id=? AND id<>?`).run(realmId, userId);
  db.prepare(`UPDATE users SET qbo_access_token=?, qbo_refresh_token=?, qbo_token_expires_at=?, qbo_realm_id=?, qbo_connected=1,
    auto_provider=CASE WHEN auto_provider IN ('jobber','housecall') THEN auto_provider ELSE 'quickbooks' END, auto_enabled=1 WHERE id=?`)
    .run(t.access_token, t.refresh_token, exp, realmId, userId);
}
const inflight = new Map<number, Promise<string | null>>();
/** Valid access token, refreshing when within 5 minutes of expiry. */
export async function accessToken(u0: User): Promise<string | null> {
  const u = (db.prepare("SELECT * FROM users WHERE id=?").get(u0.id) as User | undefined) || u0;
  if (!u.qbo_access_token) return null;
  const exp = u.qbo_token_expires_at ? Date.parse(u.qbo_token_expires_at) : 0;
  if (exp - Date.now() > 5 * 60e3 || !u.qbo_refresh_token) return u.qbo_access_token;
  const running = inflight.get(u.id); if (running) return running;
  const p = (async () => {
    try { const t = await tokenReq({ grant_type: "refresh_token", refresh_token: u.qbo_refresh_token! }); saveTokens(u.id, t); return t.access_token; }
    catch (e) {
      if (/ (400|401)$/.test((e as Error).message)) { console.warn("qbo: refresh rejected; marking disconnected"); clearQbo(u.id); return null; }
      throw e;
    } finally { inflight.delete(u.id); }
  })();
  inflight.set(u.id, p); return p;
}
/** Revoke on Intuit's side (revoking the refresh token kills both). Best effort. */
export async function revoke(u: User) {
  const token = u.qbo_refresh_token || u.qbo_access_token;
  if (!token || !qboConfigured()) return;
  try {
    const r = await fetch(REVOKE, { method: "POST", headers: { authorization: basic(), accept: "application/json", "content-type": "application/json" }, body: JSON.stringify({ token }) });
    if (!r.ok) console.warn("qbo revoke status", r.status);
  } catch (e) { console.error("qbo revoke failed:", (e as Error).message); }
}
async function api<T>(token: string, realm: string, path: string): Promise<T> {
  const r = await fetch(`${API()}/v3/company/${encodeURIComponent(realm)}${path}?minorversion=${MINOR}`, { headers: { authorization: `Bearer ${token}`, accept: "application/json" } });
  if (!r.ok) throw new Error(`QBO API ${path.split("/")[1]} ${r.status}`);
  return r.json();
}
type Ref = { value: string; name?: string };
export type QboInvoice = { Id: string; Balance: number; TotalAmt: number; CustomerRef?: Ref; BillEmail?: { Address?: string } };
export type QboPayment = { Id: string; TotalAmt: number; CustomerRef?: Ref; Line?: { LinkedTxn?: { TxnId: string; TxnType: string }[] }[] };
type QboCustomer = { DisplayName?: string; GivenName?: string; FamilyName?: string; CompanyName?: string; Active?: boolean;
  PrimaryEmailAddr?: { Address?: string }; PrimaryPhone?: { FreeFormNumber?: string }; Mobile?: { FreeFormNumber?: string } };
export const getInvoice = async (t: string, realm: string, id: string) => (await api<{ Invoice: QboInvoice }>(t, realm, `/invoice/${encodeURIComponent(id)}`)).Invoice;
export const getPayment = async (t: string, realm: string, id: string) => (await api<{ Payment: QboPayment }>(t, realm, `/payment/${encodeURIComponent(id)}`)).Payment;
export const getCustomer = async (t: string, realm: string, id: string) => (await api<{ Customer: QboCustomer }>(t, realm, `/customer/${encodeURIComponent(id)}`)).Customer;

/** Invoice ids a payment was applied to. */
export const linkedInvoices = (p: QboPayment) => (p.Line || []).flatMap((l) => l.LinkedTxn || []).filter((x) => x.TxnType === "Invoice").map((x) => x.TxnId);

/** Customer → contact. Mobile preferred for SMS; invoice BillEmail as email fallback. */
export async function customerContact(t: string, realm: string, customerId?: string, fallbackEmail = "", fallbackName = "") {
  let name = fallbackName, email = fallbackEmail, phone = "";
  if (customerId) {
    try { const c = await getCustomer(t, realm, customerId);
      name = [c.GivenName, c.FamilyName].filter(Boolean).join(" ") || c.DisplayName || c.CompanyName || name;
      email = c.PrimaryEmailAddr?.Address || email; phone = c.Mobile?.FreeFormNumber || c.PrimaryPhone?.FreeFormNumber || "";
    } catch (e) { console.warn("qbo: customer lookup failed:", (e as Error).message); }
  }
  if (!email && !phone) return null;
  return { name: name || "there", email, phone };
}

/** Intuit signs the raw body: base64(HMAC-SHA256(verifierToken, body)) in the `intuit-signature` header. */
export function verifyWebhook(raw: string, sig: string | null) {
  const key = process.env.INTUIT_WEBHOOK_VERIFIER_TOKEN;
  if (!key || !sig) return false;
  const h = crypto.createHmac("sha256", key).update(raw).digest("base64");
  return h.length === sig.length && crypto.timingSafeEqual(Buffer.from(h), Buffer.from(sig));
}

export type QboEvent = { realmId: string; entity: string; id: string; op: string };
/** Normalize both the CloudEvents array format and the legacy eventNotifications format. */
export function parseEvents(body: unknown): QboEvent[] {
  const out: QboEvent[] = [];
  if (Array.isArray(body)) {
    for (const e of body as { type?: string; intuitentityid?: string; intuitaccountid?: string }[]) {
      const m = /^qbo\.([a-z]+)\.([a-z]+)\.v\d+$/i.exec(e?.type || ""); // qbo.invoice.updated.v1
      if (m && e.intuitentityid && e.intuitaccountid) out.push({ realmId: String(e.intuitaccountid), entity: m[1].toLowerCase(), id: String(e.intuitentityid), op: m[2].toLowerCase() });
    }
  } else if (body && typeof body === "object") {
    const n = (body as { eventNotifications?: { realmId?: string; dataChangeEvent?: { entities?: { name?: string; id?: string; operation?: string }[] } }[] }).eventNotifications || [];
    for (const x of n) for (const e of x.dataChangeEvent?.entities || [])
      if (x.realmId && e.id && e.name) out.push({ realmId: String(x.realmId), entity: e.name.toLowerCase(), id: String(e.id), op: ({ create: "created", update: "updated" } as Record<string, string>)[(e.operation || "").toLowerCase()] || (e.operation || "").toLowerCase() });
  }
  return out;
}
/** Atomically claim a key like "invoice:123@realm"; false if already processed. */
export const claim = (key: string, userId: number) => db.prepare("INSERT OR IGNORE INTO qbo_events (event_key, user_id) VALUES (?,?)").run(key, userId).changes > 0;
export const release = (key: string) => db.prepare("DELETE FROM qbo_events WHERE event_key=?").run(key);
