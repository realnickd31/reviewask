import { NextRequest, NextResponse } from "next/server";
import { db, type User } from "@/lib/db";
import { customerFrom, getJobCustomer, verifySignature } from "@/lib/housecall";
import { sendReviewRequest } from "@/lib/send";
export const dynamic = "force-dynamic";
// Housecall Pro webhook. Payload: { event, company_id, event_occurred_at, job: {...customer} }
export async function POST(req: NextRequest) {
  const raw = await req.text();
  let ev: any = {};
  try { ev = JSON.parse(raw) || {}; } catch { /* ignore */ }
  const companyId = ev.company_id ? String(ev.company_id) : "";
  console.info("housecall webhook:", ev.event || "unknown", "company=", !!companyId);
  if (!companyId) return NextResponse.json({ ok: true }); // HCP sends a test ping on save
  const u = db.prepare("SELECT * FROM users WHERE housecall_company_id=? AND housecall_connected=1 AND auto_enabled=1").get(companyId) as User | undefined;
  if (!u) { console.warn("housecall webhook: no matching connected user for company"); return NextResponse.json({ ok: true }); }
  if (!verifySignature(raw, req.headers.get("api-timestamp"), req.headers.get("api-signature"), u.housecall_webhook_secret)) {
    console.warn("housecall webhook: unverified signature", "hasSecret=", !!u.housecall_webhook_secret);
    return NextResponse.json({ ok: true, ignored: "unverified" });
  }
  if (ev.event !== "job.completed") return NextResponse.json({ ok: true });
  const job = ev.job || ev.data?.job || ev.data || {};
  void (async () => {
    try {
      let c = customerFrom(job.customer);
      if (!c && job.id && u.housecall_api_key) c = await getJobCustomer(u.housecall_api_key, String(job.id));
      if (!c) { console.warn("housecall webhook: no customer contact on job"); return; }
      await sendReviewRequest(u, c, "webhook");
      console.info("housecall webhook: review ask sent");
    } catch (e) { console.error("Housecall webhook handling failed:", (e as Error).message); }
  })();
  return NextResponse.json({ ok: true });
}
