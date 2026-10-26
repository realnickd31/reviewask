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
export const exchangeCode = (code: string, base: string, verifier: string) =>
  tokenReq({ grant_type: "authorization_code", code, redirect_uri: redirectUri(base), code_verifier: verifier });

export function saveTokens(userId: number, t: Tok, accountId?: string | null) {
  const exp = t.expires_in ? new Date(Date.now() + t.expires_in * 1000).toISOString() : null;
  db.prepare(`UPDATE users SET jobber_access_token=?, jobber_refresh_token=COALESCE(?, jobber_refresh_token), jobber_token_expires_at=?,
    jobber_account_id=COALESCE(?, jobber_account_id), jobber_connected=1, auto_provider='jobber', auto_enabled=1 WHERE id=?`)
    .run(t.access_token, t.refresh_token ?? null, exp, accountId ?? null, userId);
}
/** Refresh if expired (Jobber rotates refresh tokens). */
export async function accessToken(u: User): Promise<string | null> {
  if (!u.jobber_access_token) return null;
  const exp = u.jobber_token_expires_at ? Date.parse(u.jobber_token_expires_at) : Infinity;
  if (exp - Date.now() > 60_000 || !u.jobber_refresh_token) return u.jobber_access_token;
  const t = await tokenReq({ grant_type: "refresh_token", refresh_token: u.jobber_refresh_token });
  saveTokens(u.id, t);
  return t.access_token;
}
export async function gql<T = unknown>(token: string, query: string, variables: Record<string, unknown> = {}): Promise<T> {
  const r = await fetch(GQL_URL, { method: "POST", headers: { authorization: `Bearer ${token}`, "content-type": "application/json", "X-JOBBER-GRAPHQL-VERSION": GQL_VERSION },
    body: JSON.stringify({ query, variables }) });
  if (!r.ok) throw new Error(`Jobber GraphQL ${r.status}`);
  const j = await r.json();
  if (j.errors?.length) throw new Error("Jobber GraphQL error: " + j.errors[0].message);
  return j.data as T;
}
export async function fetchAccountId(token: string) {
  try { const d = await gql<{ account: { id: string } }>(token, "query { account { id } }"); return d.account.id; } catch { return null; }
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
