import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { db, type User } from "@/lib/db";
import { chargeContact, claimCharge, clearByAccount, getCharge, releaseCharge, verifyWebhook } from "@/lib/stripe-connect";
import { sendReviewRequest } from "@/lib/send";
export const dynamic = "force-dynamic";
// Connect webhook (events on Connected accounts). Primary trigger: charge.succeeded (carries billing_details/receipt_email).
// Also: account.application.deauthorized. Billing webhook (/api/stripe/webhook) is separate and untouched.
export async function POST(req: NextRequest) {
  const raw = await req.text();
  const ev = verifyWebhook(raw, req.headers.get("stripe-signature"));
  if (!ev) { console.warn("stripe-connect webhook: unverified signature"); return NextResponse.json({ error: "invalid signature" }, { status: 400 }); }
  console.info("stripe-connect webhook:", ev.type);
  const acct = ev.account;
  if (!acct) return NextResponse.json({ ok: true });
  if (ev.type === "account.application.deauthorized") { clearByAccount(acct); return NextResponse.json({ ok: true }); }
  if (ev.type !== "charge.succeeded") return NextResponse.json({ ok: true });
  const c0 = ev.data.object as Stripe.Charge;
  if (!c0?.id || c0.status !== "succeeded") return NextResponse.json({ ok: true });
  const u = db.prepare("SELECT * FROM users WHERE stripe_connect_account_id=? AND stripe_connect_connected=1 AND auto_enabled=1").get(acct) as User | undefined;
  if (!u) return NextResponse.json({ ok: true });
  if (!claimCharge(c0.id, u.id)) return NextResponse.json({ ok: true, duplicate: true });
  void (async () => {
    try {
      const c = await getCharge(acct, c0.id); // re-read: authoritative status, refunds, expanded customer
      if (c.status !== "succeeded" || !c.paid || c.refunded || c.amount_refunded > 0) { console.info("stripe-connect webhook: skip (not paid or refunded)"); return; }
      const ct = chargeContact(c); if (!ct) { console.info("stripe-connect webhook: skip (no customer contact)"); return; }
      const r = await sendReviewRequest(u, ct, "webhook");
      console.info("stripe-connect webhook:", r.ok ? "review ask sent" : `not sent (${r.error})`);
    } catch (e) { releaseCharge(c0.id); console.error("Stripe Connect webhook handling failed:", (e as Error).message); }
  })();
  return NextResponse.json({ ok: true });
}
