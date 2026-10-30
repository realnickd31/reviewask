import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@/lib/session";
import { stripe, baseUrl } from "@/lib/stripe";
import { applySubscription } from "@/lib/billing";

// Trial user clicks "Subscribe now": end the trial immediately so the card on file is charged and the plan goes Active.
export async function POST(req: NextRequest) {
  const origin = baseUrl(req.nextUrl.origin);
  const u = await currentUser();
  if (!u) return NextResponse.redirect(origin + "/login", 303);
  const back = req.nextUrl.searchParams.get("from") === "dashboard" ? "/dashboard" : "/settings";
  if (u.subscription_status !== "trialing" || !u.stripe_subscription_id) return NextResponse.redirect(origin + (u.subscription_status === "active" ? back : "/onboarding?step=pay"), 303);
  if (!stripe) return NextResponse.redirect(origin + back + "?subscribed=unavailable", 303);
  try {
    const sub = await stripe.subscriptions.update(u.stripe_subscription_id, { trial_end: "now", cancel_at_period_end: false, proration_behavior: "none" });
    applySubscription(sub, u.id);
    return NextResponse.redirect(origin + back + "?subscribed=1", 303);
  } catch (e: any) {
    console.error("[stripe/subscribe-now] failed", { userId: u.id, code: e?.code, message: e?.message });
    // Card declined / needs action: send them to update the card in the Stripe portal.
    return NextResponse.redirect(origin + back + "?subscribed=failed", 303);
  }
}
