import crypto from "crypto";
import { db, type User } from "./db";

// Square OAuth + Webhooks: https://developer.squareup.com/docs/oauth-api/overview
const sandbox = () => (process.env.SQUARE_ENVIRONMENT || "sandbox").toLowerCase() !== "production";
const HOST = () => (sandbox() ? "https://connect.squareupsandbox.com" : "https://connect.squareup.com");
const VERSION = process.env.SQUARE_API_VERSION || "2025-10-16";
export const SCOPES = ["MERCHANT_PROFILE_READ", "PAYMENTS_READ", "CUSTOMERS_READ", "APPOINTMENTS_READ"];

export const squareConfigured = () => !!(process.env.SQUARE_APPLICATION_ID && process.env.SQUARE_APPLICATION_SECRET);
export const redirectUri = (base: string) => process.env.SQUARE_REDIRECT_URI || `${base.replace(/\/$/, "")}/api/square/callback`;
export const webhookUrl = (base: string) => process.env.SQUARE_WEBHOOK_URL || `${base.replace(/\/$/, "")}/api/square/webhook`;

export function authUrl(base: string, state: string) {
  const q = new URLSearchParams({ client_id: process.env.SQUARE_APPLICATION_ID!, scope: SCOPES.join(" "), session: "false", state, redirect_uri: redirectUri(base) });
  return `${HOST()}/oauth2/authorize?${q}`;
}
type Tok = { access_token: string; refresh_token?: string; expires_at?: string; merchant_id?: string };
async function tokenReq(body: Record<string, string>): Promise<Tok> {
  const r = await fetch(`${HOST()}/oauth2/token`, { method: "POST", headers: { "content-type": "application/json", "Square-Version": VERSION },
    body: JSON.stringify({ client_id: process.env.SQUARE_APPLICATION_ID, client_secret: process.env.SQUARE_APPLICATION_SECRET, ...body }) });
  if (!r.ok) throw new Error(`Square token error ${r.status}`); // never log the body
  return r.json();
}
export const exchangeCode = (code: string, base: string) => tokenReq({ grant_type: "authorization_code", code, redirect_uri: redirectUri(base) });

export function clearSquare(userId: number) {
  db.prepare(`UPDATE users SET square_connected=0, square_access_token=NULL, square_refresh_token=NULL, square_token_expires_at=NULL, square_merchant_id=NULL WHERE id=?`).run(userId);
}
export function saveTokens(userId: number, t: Tok, connect = false) {
  const exp = t.expires_at || new Date(Date.now() + 30 * 864e5).toISOString();
  if (!connect) {
    db.prepare(`UPDATE users SET square_access_token=?, square_refresh_token=COALESCE(?, square_refresh_token), square_token_expires_at=? WHERE id=?`)
      .run(t.access_token, t.refresh_token ?? null, exp, userId);
    return;
  }
  if (!t.merchant_id) throw new Error("saveTokens: Square response had no merchant_id");
  // One ReviewAsk account per Square merchant: detach any other user holding this merchant.
  db.prepare(`UPDATE users SET square_connected=0, square_access_token=NULL, square_refresh_token=NULL, square_token_expires_at=NULL, square_merchant_id=NULL WHERE square_merchant_id=? AND id<>?`).run(t.merchant_id, userId);
  db.prepare(`UPDATE users SET square_access_token=?, square_refresh_token=COALESCE(?, square_refresh_token), square_token_expires_at=?, square_merchant_id=?, square_connected=1,
    auto_provider=CASE WHEN auto_provider IN ('jobber','housecall') THEN auto_provider ELSE 'square' END, auto_enabled=1 WHERE id=?`)
    .run(t.access_token, t.refresh_token ?? null, exp, t.merchant_id, userId);
}
const inflight = new Map<number, Promise<string | null>>();
/** Returns a valid access token, refreshing when within 1 day of expiry (Square tokens last 30 days). */
export async function accessToken(u0: User): Promise<string | null> {
  const u = (db.prepare("SELECT * FROM users WHERE id=?").get(u0.id) as User | undefined) || u0;
  if (!u.square_access_token) return null;
  const exp = u.square_token_expires_at ? Date.parse(u.square_token_expires_at) : 0;
  if (exp - Date.now() > 864e5 || !u.square_refresh_token) return u.square_access_token;
  const running = inflight.get(u.id); if (running) return running;
  const p = (async () => {
    try { const t = await tokenReq({ grant_type: "refresh_token", refresh_token: u.square_refresh_token! }); saveTokens(u.id, t); return t.access_token; }
    catch (e) {
      if (/ (400|401)$/.test((e as Error).message)) { console.warn("square: refresh rejected; marking disconnected"); clearSquare(u.id); return null; }
      throw e;
    } finally { inflight.delete(u.id); }
  })();
  inflight.set(u.id, p); return p;
}
/** Revoke our access on Square's side. Best effort. */
export async function revoke(u: User) {
  if (!u.square_access_token || !squareConfigured()) return;
  try {
    const r = await fetch(`${HOST()}/oauth2/revoke`, { method: "POST", headers: { "content-type": "application/json", "Square-Version": VERSION, authorization: `Client ${process.env.SQUARE_APPLICATION_SECRET}` },
      body: JSON.stringify({ client_id: process.env.SQUARE_APPLICATION_ID, access_token: u.square_access_token }) });
    if (!r.ok) console.warn("square revoke status", r.status);
  } catch (e) { console.error("square revoke failed:", (e as Error).message); }
}
async function api<T>(token: string, path: string): Promise<T> {
  const r = await fetch(`${HOST()}${path}`, { headers: { authorization: `Bearer ${token}`, "Square-Version": VERSION, accept: "application/json" } });
  if (!r.ok) throw new Error(`Square API ${path.split("/").slice(0, 3).join("/")} ${r.status}`);
  return r.json();
}
export type SqPayment = { id: string; status: string; customer_id?: string; buyer_email_address?: string; refunded_money?: { amount: number };
  billing_address?: { first_name?: string; last_name?: string }; shipping_address?: { first_name?: string; last_name?: string } };
export const getPayment = async (t: string, id: string) => (await api<{ payment: SqPayment }>(t, `/v2/payments/${encodeURIComponent(id)}`)).payment;
type SqCustomer = { given_name?: string; family_name?: string; company_name?: string; email_address?: string; phone_number?: string };
export const getCustomer = async (t: string, id: string) => (await api<{ customer: SqCustomer }>(t, `/v2/customers/${encodeURIComponent(id)}`)).customer;

/** Payment → contact. Customer record first, falling back to the buyer email on the payment. */
export async function paymentContact(t: string, p: SqPayment) {
  let name = "", email = p.buyer_email_address || "", phone = "";
  if (p.customer_id) {
    try { const c = await getCustomer(t, p.customer_id);
      name = [c.given_name, c.family_name].filter(Boolean).join(" ") || c.company_name || "";
      email = c.email_address || email; phone = c.phone_number || "";
    } catch (e) { console.warn("square: customer lookup failed:", (e as Error).message); }
  }
  if (!name) { const a = p.billing_address || p.shipping_address; name = [a?.first_name, a?.last_name].filter(Boolean).join(" "); }
  if (!email && !phone) return null;
  return { name: name || "there", email, phone };
}
/** Square signs notificationUrl + rawBody with HMAC-SHA256 (base64) in x-square-hmacsha256-signature. */
export function verifyWebhook(raw: string, sig: string | null, url: string) {
  const key = process.env.SQUARE_WEBHOOK_SIGNATURE_KEY;
  if (!key || !sig) return false;
  const h = crypto.createHmac("sha256", key).update(url + raw).digest("base64");
  return h.length === sig.length && crypto.timingSafeEqual(Buffer.from(h), Buffer.from(sig));
}
/** Atomically claim a payment id; false if already processed. */
export const claimPayment = (paymentId: string, userId: number) =>
  db.prepare("INSERT OR IGNORE INTO square_events (payment_id, user_id) VALUES (?,?)").run(paymentId, userId).changes > 0;
export const releasePayment = (paymentId: string) => db.prepare("DELETE FROM square_events WHERE payment_id=?").run(paymentId);
