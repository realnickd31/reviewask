import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/session";
import { stripe, baseUrl } from "@/lib/stripe";
export async function POST(req: NextRequest) {
  const origin = baseUrl(req.nextUrl.origin);
  const u = await currentUser();
  if (!u) return NextResponse.redirect(origin + "/login", 303);
  if (!stripe || !u.stripe_customer_id) return NextResponse.redirect(origin + "/settings?portal=unavailable", 303);
  try {
    const s = await stripe.billingPortal.sessions.create({ customer: u.stripe_customer_id, return_url: origin + "/settings" });
    return NextResponse.redirect(s.url, 303);
  } catch (e: any) {
    console.error("[stripe/portal] failed", { userId: u.id, customer: u.stripe_customer_id, code: e?.code, message: e?.message });
    if (e?.code === "resource_missing" && e?.param === "customer") {
      // Stored customer id doesn't exist in this Stripe account/mode (stale or test-mode id). Clear it so checkout recreates one.
      db.prepare("UPDATE users SET stripe_customer_id=NULL WHERE id=?").run(u.id);
    }
    return NextResponse.redirect(origin + "/settings?portal=unavailable", 303);
  }
}
