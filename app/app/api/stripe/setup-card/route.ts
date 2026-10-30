import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/session";
import { stripe, baseUrl } from "@/lib/stripe";
// Reconnect billing for an account that is already trialing/active but has no customer in this Stripe account.
// Uses Checkout in setup mode: saves a card only. No new subscription, no new trial, no charge.
export async function POST(req: NextRequest) {
  const origin = baseUrl(req.nextUrl.origin);
  const u = await currentUser();
  if (!u) return NextResponse.redirect(origin + "/login", 303);
  if (!stripe) return NextResponse.redirect(origin + "/settings?portal=unavailable", 303);
  try {
    let customer = u.stripe_customer_id;
    if (customer) {
      const ok = await stripe.customers.retrieve(customer).then((c) => !(c as any).deleted, (e: any) => (e?.code === "resource_missing" ? false : true));
      if (!ok) customer = null;
    }
    if (!customer) {
      customer = (await stripe.customers.create({ email: u.email, name: u.business_name ?? undefined, metadata: { userId: String(u.id) } })).id;
      db.prepare("UPDATE users SET stripe_customer_id=? WHERE id=?").run(customer, u.id);
    }
    const s = await stripe.checkout.sessions.create({
      mode: "setup", customer, currency: "usd", payment_method_types: ["card"], client_reference_id: String(u.id),
      setup_intent_data: { metadata: { userId: String(u.id), purpose: "billing_reconnect" } },
      success_url: origin + "/api/stripe/setup-complete?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: origin + "/onboarding?step=pay&billing=reconnect&canceled=1",
    });
    return NextResponse.redirect(s.url!, 303);
  } catch (e: any) {
    console.error("[stripe/setup-card] failed", { userId: u.id, message: e?.message });
    return NextResponse.redirect(origin + "/settings?portal=unavailable", 303);
  }
}
