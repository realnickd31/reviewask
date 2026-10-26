import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@/lib/session";
import { stripe, baseUrl } from "@/lib/stripe";
export async function POST(req: NextRequest) {
  const u = await currentUser();
  if (!u) return NextResponse.redirect(baseUrl(req.nextUrl.origin) + "/login", 303);
  if (!stripe || !u.stripe_customer_id) return NextResponse.redirect(baseUrl(req.nextUrl.origin) + "/settings?portal=unavailable", 303);
  const s = await stripe.billingPortal.sessions.create({ customer: u.stripe_customer_id, return_url: baseUrl(req.nextUrl.origin) + "/settings" });
  return NextResponse.redirect(s.url, 303);
}
