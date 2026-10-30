import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@/lib/session";
import { stripe, baseUrl } from "@/lib/stripe";
// After setup-mode Checkout: make the saved card the customer's default for invoices.
export async function GET(req: NextRequest) {
  const origin = baseUrl(req.nextUrl.origin);
  const u = await currentUser();
  if (!u) return NextResponse.redirect(origin + "/login", 303);
  const id = req.nextUrl.searchParams.get("session_id");
  if (!stripe || !id) return NextResponse.redirect(origin + "/settings", 303);
  try {
    const s = await stripe.checkout.sessions.retrieve(id, { expand: ["setup_intent"] });
    const si = s.setup_intent as any;
    const pm = typeof si?.payment_method === "string" ? si.payment_method : si?.payment_method?.id;
    if (s.client_reference_id === String(u.id) && s.customer && pm) {
      await stripe.customers.update(s.customer as string, { invoice_settings: { default_payment_method: pm } });
    }
    return NextResponse.redirect(origin + "/settings?billing=card_saved", 303);
  } catch (e: any) {
    console.error("[stripe/setup-complete] failed", { userId: u.id, message: e?.message });
    return NextResponse.redirect(origin + "/settings?portal=unavailable", 303);
  }
}
