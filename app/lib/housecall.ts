import crypto from "crypto";
import { db } from "./db";

// Housecall Pro public API (MAX plan). Auth: "Authorization: Token <key>".
const API = "https://api.housecallpro.com";
export const webhookUrl = () => `${(process.env.APP_URL || "https://getreviewask.com").replace(/\/$/, "")}/api/housecall/webhook`;

async function hcp<T = any>(apiKey: string, path: string): Promise<T> {
  const r = await fetch(API + path, { headers: { authorization: `Token ${apiKey}`, accept: "application/json" }, cache: "no-store" });
  if (!r.ok) throw new Error(`Housecall API ${path} ${r.status}`); // never log key/body
  return r.json();
}

/** HMAC-SHA256(secret, timestamp + "." + raw) hex, compared to Api-Signature. */
export function verifySignature(raw: string, timestamp: string | null, signature: string | null, secret: string | null) {
  if (!timestamp || !signature || !secret) return false;
  const h = crypto.createHmac("sha256", secret).update(`${timestamp}.${raw}`).digest("hex");
  const sig = signature.trim().replace(/^sha256=/, "").toLowerCase();
  return h.length === sig.length && crypto.timingSafeEqual(Buffer.from(h), Buffer.from(sig));
}

/** Returns company id if the key works, else null. */
export async function getCompany(apiKey: string): Promise<string | null> {
  try {
    const c = await hcp<{ id?: string; company?: { id?: string } }>(apiKey, "/company");
    return (c?.id || c?.company?.id || null) as string | null;
  } catch (e) { console.error("housecall getCompany failed:", (e as Error).message); return null; }
}

type Contact = { name: string; email: string; phone: string };
export function customerFrom(c: any): Contact | null {
  if (!c) return null;
  const name = [c.first_name, c.last_name].filter(Boolean).join(" ") || c.name || c.company || "";
  const email = c.email || "";
  const phone = c.mobile_number || c.mobile_phone || c.home_number || c.work_number || c.phone || "";
  return email || phone ? { name, email, phone } : null;
}
export async function getJobCustomer(apiKey: string, jobId: string): Promise<Contact | null> {
  const j = await hcp<any>(apiKey, `/jobs/${encodeURIComponent(jobId)}`);
  return customerFrom(j?.customer || j?.job?.customer);
}

export function saveConnection(userId: number, apiKey: string, companyId: string, secret?: string | null) {
  db.prepare(`UPDATE users SET housecall_api_key=?, housecall_company_id=?, housecall_webhook_secret=COALESCE(?, housecall_webhook_secret),
    housecall_connected=1, auto_enabled=1, auto_provider=CASE WHEN auto_provider='jobber' THEN auto_provider ELSE 'housecall' END WHERE id=?`)
    .run(apiKey, companyId, secret || null, userId);
}
export function saveSecret(userId: number, secret: string) {
  db.prepare("UPDATE users SET housecall_webhook_secret=? WHERE id=?").run(secret, userId);
}
export function clearConnection(userId: number) {
  db.prepare(`UPDATE users SET housecall_connected=0, housecall_api_key=NULL, housecall_company_id=NULL, housecall_webhook_secret=NULL WHERE id=?`).run(userId);
}
