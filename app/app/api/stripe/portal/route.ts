import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/session";
import { stripe, baseUrl } from "@/lib/stripe";
// Ensure a portal configuration exists that lets customers (including trialing ones) update their card,
// see invoices, and cancel. Without one, Stripe rejects portal sessions and trial users bounced to "unavailable".
let cachedConfig: string | null = null;
async function portalConfig(origin: string): Promise<string | undefined> {
  if (!stripe) return undefined;
  if (cachedConfig) return cachedConfig;
  const list = await stripe.billingPortal.configurations.list({ active: true, limit: 100 });
  const ok = list.data.find((c) => c.metadata?.app === "reviewask" && c.features.payment_method_update.enabled);
  if (ok) return (cachedConfig = ok.id);
  const created = await stripe.billingPortal.configurations.create({
    business_profile: { headline: "Manage your ReviewAsk billing" },
    default_return_url: origin + "/settings",
    features: {
      payment_method_update: { enabled: true },
      invoice_history: { enabled: true },
      customer_update: { enabled: true, allowed_updates: ["email", "address", "name"] },
      subscription_cancel: { enabled: true, mode: "at_period_end" },
    },
    metadata: { app: "reviewask" },
  });
  return (cachedConfig = created.id);
}

export async function POST(req: NextRequest) {
  const origin = baseUrl(req.nextUrl.origin);
  const u = await currentUser();
  if (!u) return NextResponse.redirect(origin + "/login", 303);
  if (!stripe || !u.stripe_customer_id) return NextResponse.redirect(origin + "/settings?portal=unavailable", 303);
  const view = req.nextUrl.searchParams.get("view"); // "payment_methods" | "invoices" | null
  const back = req.nextUrl.searchParams.get("from") === "dashboard" ? "/dashboard" : "/settings";
  const params: any = { customer: u.stripe_customer_id, return_url: origin + back };
  // Stripe only supports flow_data for payment_method_update (no invoice flow); invoice history lives on the portal home.
  if (view === "payment_methods") params.flow_data = { type: "payment_method_update", after_completion: { type: "redirect", redirect: { return_url: origin + back } } };
  try {
    try { params.configuration = await portalConfig(origin); } catch (e: any) { console.error("[stripe/portal] config", e?.message); }
    let s;
    try { s = await stripe.billingPortal.sessions.create(params); }
    catch (e: any) { if (!params.flow_data || e?.param === "customer") throw e; delete params.flow_data; s = await stripe.billingPortal.sessions.create(params); }
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
