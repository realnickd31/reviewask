import Stripe from "stripe";
import { db, type User } from "./db";
import { stripe } from "./stripe";

// Stripe Connect (Standard) OAuth for sellers: https://docs.stripe.com/connect/oauth-reference
// Separate from ReviewAsk's own billing (lib/stripe.ts, /api/stripe/*). We reuse the platform STRIPE_SECRET_KEY
// as the OAuth client_secret and act on connected accounts via the Stripe-Account header (no per-seller tokens stored).
const AUTH = "https://connect.stripe.com/oauth/authorize";
export const stripeConnectConfigured = () => !!(process.env.STRIPE_CONNECT_CLIENT_ID && process.env.STRIPE_SECRET_KEY);
export const redirectUri = (base: string) => process.env.STRIPE_CONNECT_REDIRECT_URI || `${base.replace(/\/$/, "")}/api/stripe-connect/callback`;

export function authUrl(base: string, state: string) {
  const q = new URLSearchParams({ response_type: "code", client_id: process.env.STRIPE_CONNECT_CLIENT_ID!, scope: "read_write", state, redirect_uri: redirectUri(base) });
  return `${AUTH}?${q}`;
}
export async function exchangeCode(code: string) {
  if (!stripe) throw new Error("STRIPE_SECRET_KEY missing");
  const t = await stripe.oauth.token({ grant_type: "authorization_code", code });
  if (!t.stripe_user_id) throw new Error("Stripe OAuth: no stripe_user_id");
  return t.stripe_user_id;
}
export function saveAccount(userId: number, acct: string) {
  // One ReviewAsk account per Stripe account.
  db.prepare(`UPDATE users SET stripe_connect_connected=0, stripe_connect_account_id=NULL WHERE stripe_connect_account_id=? AND id<>?`).run(acct, userId);
  db.prepare(`UPDATE users SET stripe_connect_account_id=?, stripe_connect_connected=1,
    auto_provider=CASE WHEN auto_provider IN ('jobber','housecall','square') THEN auto_provider ELSE 'stripe' END, auto_enabled=1 WHERE id=?`).run(acct, userId);
}
export const clearStripeConnect = (userId: number) =>
  db.prepare(`UPDATE users SET stripe_connect_connected=0, stripe_connect_account_id=NULL WHERE id=?`).run(userId);
export const clearByAccount = (acct: string) =>
  db.prepare(`UPDATE users SET stripe_connect_connected=0, stripe_connect_account_id=NULL WHERE stripe_connect_account_id=?`).run(acct);

/** Revoke platform access on Stripe's side. Best effort. */
export async function deauthorize(u: User) {
  if (!stripe || !u.stripe_connect_account_id || !process.env.STRIPE_CONNECT_CLIENT_ID) return;
  try { await stripe.oauth.deauthorize({ client_id: process.env.STRIPE_CONNECT_CLIENT_ID, stripe_user_id: u.stripe_connect_account_id }); }
  catch (e) { console.warn("stripe-connect deauthorize failed:", (e as Error).message); }
}
export function verifyWebhook(raw: string, sig: string | null): Stripe.Event | null {
  const secret = process.env.STRIPE_CONNECT_WEBHOOK_SECRET;
  if (!stripe || !secret || !sig) return null;
  try { return stripe.webhooks.constructEvent(raw, sig, secret); } catch { return null; }
}
export const getCharge = (acct: string, id: string) => stripe!.charges.retrieve(id, { expand: ["customer"] }, { stripeAccount: acct });

/** Charge → contact: Customer record first, then billing_details, then receipt_email. */
export function chargeContact(c: Stripe.Charge) {
  const cu = c.customer && typeof c.customer === "object" && !("deleted" in c.customer && c.customer.deleted) ? (c.customer as Stripe.Customer) : null;
  const b = c.billing_details || ({} as Stripe.Charge.BillingDetails);
  const name = cu?.name || b.name || c.shipping?.name || "";
  const email = cu?.email || b.email || c.receipt_email || "";
  const phone = cu?.phone || b.phone || c.shipping?.phone || "";
  if (!email && !phone) return null;
  return { name: name || "there", email, phone };
}
export const claimCharge = (id: string, userId: number) =>
  db.prepare("INSERT OR IGNORE INTO stripe_connect_events (object_id, user_id) VALUES (?,?)").run(id, userId).changes > 0;
export const releaseCharge = (id: string) => db.prepare("DELETE FROM stripe_connect_events WHERE object_id=?").run(id);
