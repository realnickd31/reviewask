import type Stripe from "stripe";
import { db, getUser } from "./db";
import { trackServer } from "./analytics";

export function applySubscription(sub: Stripe.Subscription, userId?: number) {
  const cust = typeof sub.customer === "string" ? sub.customer : sub.customer.id;
  const uid = userId ?? (Number(sub.metadata?.userId) || undefined);
  const prev = uid ? getUser(uid)?.subscription_status : undefined;
  if (uid) db.prepare("UPDATE users SET stripe_customer_id=?, stripe_subscription_id=?, subscription_status=? WHERE id=?").run(cust, sub.id, sub.status, uid);
  else db.prepare("UPDATE users SET stripe_subscription_id=?, subscription_status=? WHERE stripe_customer_id=?").run(sub.id, sub.status, cust);
  const te = sub.trial_end ? new Date(sub.trial_end * 1000).toISOString() : null;
  if (uid) db.prepare("UPDATE users SET trial_end=? WHERE id=?").run(te, uid);
  else db.prepare("UPDATE users SET trial_end=? WHERE stripe_customer_id=?").run(te, cust);
  if (!uid || prev === sub.status) return;
  if (sub.status === "trialing") {
    trackServer({ event: "checkout_completed", user_id: uid, meta: { status: sub.status } });
    trackServer({ event: "trial_started", user_id: uid });
  } else if (sub.status === "active") {
    trackServer({ event: "subscription_active", user_id: uid, meta: { status: sub.status } });
  } else if (sub.status === "canceled") {
    trackServer({ event: "subscription_canceled", user_id: uid });
  }
}

/** Backfill users.trial_end from Stripe when a trialing account is missing it. Never throws. */
export async function ensureTrialEnd(u: { id: number; subscription_status?: string | null; trial_end?: string | null; stripe_subscription_id?: string | null }): Promise<string | null> {
  if (u.trial_end) return u.trial_end;
  if (u.subscription_status !== "trialing" || !u.stripe_subscription_id) return null;
  try {
    const { stripe } = await import("./stripe");
    if (!stripe) return null;
    const s = await stripe.subscriptions.retrieve(u.stripe_subscription_id);
    if (!s.trial_end) return null;
    const te = new Date(s.trial_end * 1000).toISOString();
    db.prepare("UPDATE users SET trial_end=? WHERE id=?").run(te, u.id);
    u.trial_end = te;
    return te;
  } catch (e) { console.error("ensureTrialEnd", u.id, (e as Error)?.message); return null; }
}
