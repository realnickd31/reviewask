import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/session";
import { stripe, baseUrl } from "@/lib/stripe";
import { trackServer } from "@/lib/analytics";

export async function POST(req: NextRequest) {
  const u = await currentUser();
  if (!u) return NextResponse.redirect(baseUrl(req.nextUrl.origin) + "/signup", 303);
  const form = await req.formData().catch(() => null);
  const plan = form?.get("plan");
  const reconnect = form?.get("reconnect") === "1";
  const price = plan === "annual" && process.env.STRIPE_PRICE_ID_ANNUAL ? process.env.STRIPE_PRICE_ID_ANNUAL : process.env.STRIPE_PRICE_ID;
  if (!stripe || !price) {
    // Dev fallback so the app is usable without Stripe keys. Disabled in production.
    if (process.env.NODE_ENV !== "production") {
      db.prepare("UPDATE users SET subscription_status='trialing' WHERE id=?").run(u.id);
      return NextResponse.redirect(baseUrl(req.nextUrl.origin) + "/dashboard?dev_unlocked=1", 303);
    }
    return NextResponse.json({ error: "Stripe is not configured" }, { status: 500 });
  }
  let customer = u.stripe_customer_id;
  if (customer) {
    // Drop stale ids (e.g. test-mode customer against live key) instead of 500ing.
    const ok = await stripe.customers.retrieve(customer).then((c) => !(c as any).deleted, (e: any) => { if (e?.code === "resource_missing") return false; throw e; });
    if (!ok) customer = null;
  }
  if (!customer) {
    customer = (await stripe.customers.create({ email: u.email, name: u.business_name ?? undefined, metadata: { userId: String(u.id) } })).id;
    db.prepare("UPDATE users SET stripe_customer_id=? WHERE id=?").run(customer, u.id);
  }
  const session = await stripe.checkout.sessions.create({
    mode: "subscription", customer, line_items: [{ price, quantity: 1 }], client_reference_id: String(u.id),
    subscription_data: { ...(reconnect || u.stripe_subscription_id || (u.subscription_status && u.subscription_status !== "none") ? {} : { trial_period_days: 7 }), metadata: { userId: String(u.id) } }, allow_promotion_codes: true,
    success_url: baseUrl(req.nextUrl.origin) + "/dashboard?session_id={CHECKOUT_SESSION_ID}", cancel_url: baseUrl(req.nextUrl.origin) + (reconnect ? "/onboarding?step=pay&billing=reconnect&canceled=1" : "/onboarding?step=pay&canceled=1"),
  });
  trackServer({ event: "checkout_started", user_id: u.id, path: "/onboarding", meta: { plan: String(plan || "monthly") } });
  return NextResponse.redirect(session.url!, 303);
}
