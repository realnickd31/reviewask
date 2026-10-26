import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { applySubscription } from "@/lib/billing";

export async function POST(req: NextRequest) {
  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) return NextResponse.json({ error: "not configured" }, { status: 500 });
  const body = await req.text();
  let event: Stripe.Event;
  try { event = stripe.webhooks.constructEvent(body, req.headers.get("stripe-signature") || "", process.env.STRIPE_WEBHOOK_SECRET); }
  catch (e) { return NextResponse.json({ error: `Bad signature: ${(e as Error).message}` }, { status: 400 }); }
  switch (event.type) {
    case "checkout.session.completed": {
      const s = event.data.object as Stripe.Checkout.Session;
      if (s.subscription) applySubscription(await stripe.subscriptions.retrieve(s.subscription as string), Number(s.client_reference_id) || undefined);
      break;
    }
    case "customer.subscription.created": case "customer.subscription.updated": case "customer.subscription.deleted":
      applySubscription(event.data.object as Stripe.Subscription); break;
  }
  return NextResponse.json({ received: true });
}
