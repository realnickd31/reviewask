import type Stripe from "stripe";
import { db, getUser } from "./db";
import { trackServer } from "./analytics";

export function applySubscription(sub: Stripe.Subscription, userId?: number) {
  const cust = typeof sub.customer === "string" ? sub.customer : sub.customer.id;
  const uid = userId ?? (Number(sub.metadata?.userId) || undefined);
  const prev = uid ? getUser(uid)?.subscription_status : undefined;
  if (uid) db.prepare("UPDATE users SET stripe_customer_id=?, stripe_subscription_id=?, subscription_status=? WHERE id=?").run(cust, sub.id, sub.status, uid);
  else db.prepare("UPDATE users SET stripe_subscription_id=?, subscription_status=? WHERE stripe_customer_id=?").run(sub.id, sub.status, cust);
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
