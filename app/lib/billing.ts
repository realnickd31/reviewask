import type Stripe from "stripe";
import { db } from "./db";
export function applySubscription(sub: Stripe.Subscription, userId?: number) {
  const cust = typeof sub.customer === "string" ? sub.customer : sub.customer.id;
  const uid = userId ?? (Number(sub.metadata?.userId) || undefined);
  if (uid) db.prepare("UPDATE users SET stripe_customer_id=?, stripe_subscription_id=?, subscription_status=? WHERE id=?").run(cust, sub.id, sub.status, uid);
  else db.prepare("UPDATE users SET stripe_subscription_id=?, subscription_status=? WHERE stripe_customer_id=?").run(sub.id, sub.status, cust);
}
