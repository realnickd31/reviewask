import { NextRequest, NextResponse } from "next/server";
import { db, type User } from "@/lib/db";
import { accessToken, claimPayment, getPayment, paymentContact, releasePayment, verifyWebhook, webhookUrl } from "@/lib/square";
import { sendReviewRequest } from "@/lib/send";
import { baseUrl } from "@/lib/base";
export const dynamic = "force-dynamic";
// Square webhook. Subscribe to payment.updated and oauth.authorization.revoked.
// Payload: { merchant_id, type, event_id, data: { type, id, object: { payment: {...} } } }
export async function POST(req: NextRequest) {
  const raw = await req.text();
  if (!verifyWebhook(raw, req.headers.get("x-square-hmacsha256-signature"), webhookUrl(baseUrl()))) {
    console.warn("square webhook: unverified signature");
    return NextResponse.json({ error: "invalid signature" }, { status: 403 });
  }
  let ev: { type?: string; merchant_id?: string; data?: { id?: string; object?: { payment?: { id?: string; status?: string } } } } = {};
  try { ev = JSON.parse(raw); } catch { return NextResponse.json({ ok: true }); }
  console.info("square webhook:", ev.type || "unknown");
  if (ev.type === "oauth.authorization.revoked" && ev.merchant_id) {
    db.prepare(`UPDATE users SET square_connected=0, square_access_token=NULL, square_refresh_token=NULL, square_token_expires_at=NULL, square_merchant_id=NULL WHERE square_merchant_id=?`).run(ev.merchant_id);
    return NextResponse.json({ ok: true });
  }
  if (ev.type !== "payment.updated" || !ev.merchant_id) return NextResponse.json({ ok: true });
  const p0 = ev.data?.object?.payment; const pid = p0?.id || ev.data?.id;
  if (!pid || p0?.status !== "COMPLETED") return NextResponse.json({ ok: true });
  const u = db.prepare("SELECT * FROM users WHERE square_merchant_id=? AND square_connected=1 AND auto_enabled=1").get(ev.merchant_id) as User | undefined;
  if (!u) return NextResponse.json({ ok: true });
  if (!claimPayment(pid, u.id)) return NextResponse.json({ ok: true, duplicate: true });
  void (async () => {
    try {
      const t = await accessToken(u); if (!t) { releasePayment(pid); return; }
      const p = await getPayment(t, pid); // re-read: authoritative status, refunds
      if (p.status !== "COMPLETED" || (p.refunded_money?.amount ?? 0) > 0) { console.info("square webhook: skip (not completed or refunded)"); return; }
      const c = await paymentContact(t, p); if (!c) { console.info("square webhook: skip (no customer contact)"); return; }
      const r = await sendReviewRequest(u, c, "webhook");
      console.info("square webhook:", r.ok ? "review ask sent" : `not sent (${r.error})`);
    } catch (e) { releasePayment(pid); console.error("Square webhook handling failed:", (e as Error).message); }
  })();
  return NextResponse.json({ ok: true });
}
