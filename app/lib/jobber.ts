import crypto from "crypto";
import { db, type User } from "./db";

// Jobber Developer Center: https://developer.getjobber.com
const AUTH_URL = "https://api.getjobber.com/api/oauth/authorize";
const TOKEN_URL = "https://api.getjobber.com/api/oauth/token";
const GQL_URL = "https://api.getjobber.com/api/graphql";
const GQL_VERSION = process.env.JOBBER_API_VERSION || "2025-01-20";

export const jobberConfigured = () => !!(process.env.JOBBER_CLIENT_ID && process.env.JOBBER_CLIENT_SECRET);
export const redirectUri = (base: string) => process.env.JOBBER_REDIRECT_URI || `${base.replace(/\/$/, "")}/api/jobber/callback`;

export function pkce() {
  const verifier = crypto.randomBytes(32).toString("base64url");
  const challenge = crypto.createHash("sha256").update(verifier).digest("base64url");
  return { verifier, challenge };
}
export function authUrl(base: string, state: string, challenge: string) {
  const q = new URLSearchParams({ response_type: "code", client_id: process.env.JOBBER_CLIENT_ID!, redirect_uri: redirectUri(base), state, code_challenge: challenge, code_challenge_method: "S256" });
  return `${AUTH_URL}?${q}`;
}
type Tok = { access_token: string; refresh_token?: string; expires_in?: number };
async function tokenReq(body: Record<string, string>): Promise<Tok> {
  const r = await fetch(TOKEN_URL, { method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ client_id: process.env.JOBBER_CLIENT_ID!, client_secret: process.env.JOBBER_CLIENT_SECRET!, ...body }) });
  if (!r.ok) throw new Error(`Jobber token error ${r.status}`); // never log the body (may contain tokens)
  return r.json();
}
/** verifier is omitted when Jobber's App Marketplace starts the flow (no state/PKCE). */
export const exchangeCode = (code: string, base: string, verifier?: string) =>
  tokenReq({ grant_type: "authorization_code", code, redirect_uri: redirectUri(base), ...(verifier ? { code_verifier: verifier } : {}) });

/** Access-token expiry: expires_in if given, else the JWT exp claim, else 60 min (Jobber default). */
function expiryIso(t: Tok): string {
  if (t.expires_in) return new Date(Date.now() + t.expires_in * 1000).toISOString();
  try { const p = JSON.parse(Buffer.from(t.access_token.split(".")[1], "base64url").toString()); if (p.exp) return new Date(p.exp * 1000).toISOString(); } catch { /* not a JWT */ }
  return new Date(Date.now() + 3600_000).toISOString();
}
/** Clear all Jobber tokens for a user (local side of a disconnect). */
export function clearJobber(userId: number) {
  db.prepare(`UPDATE users SET jobber_connected=0, jobber_access_token=NULL, jobber_refresh_token=NULL, jobber_token_expires_at=NULL, jobber_account_id=NULL WHERE id=?`).run(userId);
}

/** Pass connect=true (with a non-null accountId) only on initial connect; refreshes just update tokens. */
export function saveTokens(userId: number, t: Tok, accountId?: string | null, connect = false) {
  const exp0 = expiryIso(t);
  if (!connect) {
    db.prepare(`UPDATE users SET jobber_access_token=?, jobber_refresh_token=COALESCE(?, jobber_refresh_token), jobber_token_expires_at=?,
      jobber_account_id=COALESCE(?, jobber_account_id) WHERE id=?`).run(t.access_token, t.refresh_token ?? null, exp0, accountId ?? null, userId);
    return;
  }
  if (!accountId) throw new Error("saveTokens: refusing to connect without a Jobber account id");
  const exp = expiryIso(t);
  db.prepare(`UPDATE users SET jobber_access_token=?, jobber_refresh_token=COALESCE(?, jobber_refresh_token), jobber_token_expires_at=?,
    jobber_account_id=?, jobber_connected=1, auto_provider=CASE WHEN auto_provider='housecall' THEN auto_provider ELSE 'jobber' END, auto_enabled=1 WHERE id=?`)
    .run(t.access_token, t.refresh_token ?? null, exp, accountId, userId);
}
/** Refresh if expired. With Refresh Token Rotation ON, Jobber returns a new refresh token each time; saveTokens persists it.
 *  Always re-reads the row first so a concurrent refresh's rotated token is used. Unknown expiry => refresh (safe). */
const inflight = new Map<number, Promise<string | null>>();
export async function accessToken(u0: User): Promise<string | null> {
  const u = (db.prepare("SELECT * FROM users WHERE id=?").get(u0.id) as User | undefined) || u0;
  if (!u.jobber_access_token) return null;
  const exp = u.jobber_token_expires_at ? Date.parse(u.jobber_token_expires_at) : 0;
  if (exp - Date.now() > 60_000 || !u.jobber_refresh_token) return u.jobber_access_token;
  const running = inflight.get(u.id); if (running) return running;
  const p = (async () => {
    try {
      const t = await tokenReq({ grant_type: "refresh_token", refresh_token: u.jobber_refresh_token! });
      saveTokens(u.id, t);
      return t.access_token;
    } catch (e) {
      // 400/401 = refresh token revoked (disconnected in Jobber, secret regenerated, etc.): mark disconnected so the user sees "Connect Jobber" again.
      if (/ (400|401)$/.test((e as Error).message)) { console.warn("jobber: refresh token rejected; marking disconnected"); clearJobber(u.id); return null; }
      throw e;
    } finally { inflight.delete(u.id); }
  })();
  inflight.set(u.id, p); return p;
}
/** Tell Jobber the user disconnected from inside ReviewAsk (required for Marketplace apps). Best effort. */
export async function appDisconnect(u: User): Promise<void> {
  try {
    const t = await accessToken(u); if (!t) return;
    const d = await gql<{ appDisconnect: { userErrors: { message: string }[] } }>(t, "mutation { appDisconnect { app { name } userErrors { message } } }");
    if (d.appDisconnect?.userErrors?.length) console.warn("jobber appDisconnect userErrors:", d.appDisconnect.userErrors[0].message);
  } catch (e) { console.error("jobber appDisconnect failed:", (e as Error).message); }
}
export async function gql<T = unknown>(token: string, query: string, variables: Record<string, unknown> = {}): Promise<T> {
  const r = await fetch(GQL_URL, { method: "POST", headers: { authorization: `Bearer ${token}`, "content-type": "application/json", "X-JOBBER-GRAPHQL-VERSION": GQL_VERSION },
    body: JSON.stringify({ query, variables }) });
  if (!r.ok) throw new Error(`Jobber GraphQL ${r.status}`);
  const j = await r.json();
  if (j.errors?.length) throw new Error("Jobber GraphQL error: " + j.errors[0].message);
  return j.data as T;
}
/** Returns the Jobber account id, or null (errors are logged without tokens). */
export async function fetchAccountId(token: string): Promise<string | null> {
  try {
    const d = await gql<{ account: { id: string } | null }>(token, "query { account { id } }");
    if (d?.account?.id) return d.account.id;
    console.error("Jobber fetchAccountId: response had no account.id");
  } catch (e) { console.error("Jobber fetchAccountId failed:", (e as Error).message); }
  return null;
}
/** Store a freshly fetched account id for a user. */
export function saveAccountId(userId: number, accountId: string) {
  db.prepare("UPDATE users SET jobber_account_id=? WHERE id=?").run(accountId, userId);
}
/** Job → client contact. TODO: verify field names against current Jobber schema once the dev app exists. */
export async function jobClient(token: string, jobId: string) {
  const d = await gql<{ job: { client: { name: string; emails: { address: string; primary: boolean }[]; phones: { number: string; primary: boolean }[] } } | null }>(token,
    `query($id: EncodedId!) { job(id: $id) { client { name emails { address primary } phones { number primary } } } }`, { id: jobId });
  const c = d.job?.client; if (!c) return null;
  const pick = <X extends { primary: boolean }>(a: X[]) => a.find(x => x.primary) || a[0];
  return { name: c.name, email: pick(c.emails || [])?.address || "", phone: pick(c.phones || [])?.number || "" };
}
export const verifyWebhook = (raw: string, sig: string | null) => {
  if (!process.env.JOBBER_CLIENT_SECRET || !sig) return false;
  const h = crypto.createHmac("sha256", process.env.JOBBER_CLIENT_SECRET).update(raw).digest("base64");
  return h.length === sig.length && crypto.timingSafeEqual(Buffer.from(h), Buffer.from(sig));
};
