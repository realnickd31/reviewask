import { NextRequest, NextResponse } from "next/server";
import { db, type User } from "@/lib/db";
import { accessToken, claim, customerContact, getInvoice, getPayment, linkedInvoices, parseEvents, release, verifyWebhook, type QboEvent } from "@/lib/quickbooks";
import { sendReviewRequest } from "@/lib/send";
export const dynamic = "force-dynamic";
// QuickBooks Online webhook. Subscribe to Invoice (Update) and Payment (Create).
// Intuit requires a 200 within ~3s, so we verify, ack, and process in the background.
export async function POST(req: NextRequest) {
  const raw = await req.text();
  if (!verifyWebhook(raw, req.headers.get("intuit-signature"))) {
    console.warn("qbo webhook: unverified signature");
    return NextResponse.json({ error: "invalid signature" }, { status: 401 });
  }
  let body: unknown; try { body = JSON.parse(raw); } catch { return NextResponse.json({ ok: true }); }
  const events = parseEvents(body).filter((e) => (e.entity === "invoice" && e.op === "updated") || (e.entity === "payment" && e.op === "created"));
  console.info("qbo webhook:", events.length, "relevant event(s)");
  for (const e of events) void handle(e);
  return NextResponse.json({ ok: true });
}

async function handle(e: QboEvent) {
  const u = db.prepare("SELECT * FROM users WHERE qbo_realm_id=? AND qbo_connected=1 AND auto_enabled=1").get(e.realmId) as User | undefined;
  if (!u) return;
  let key = "";
  try {
    const t = await accessToken(u); if (!t) return;
    let customerId: string | undefined, email = "", name = "";
    if (e.entity === "invoice") {
      const inv = await getInvoice(t, e.realmId, e.id); // re-read: authoritative balance
      if (!(inv.TotalAmt > 0 && Number(inv.Balance) === 0)) return;
      key = `invoice:${inv.Id}@${e.realmId}`;
      customerId = inv.CustomerRef?.value; email = inv.BillEmail?.Address || ""; name = inv.CustomerRef?.name || "";
    } else {
      const p = await getPayment(t, e.realmId, e.id);
      // A payment that pays off an invoice also fires Invoice Update; dedupe on the invoice so we ask once.
      const inv = linkedInvoices(p)[0];
      key = inv ? `invoice:${inv}@${e.realmId}` : `payment:${p.Id}@${e.realmId}`;
      customerId = p.CustomerRef?.value; name = p.CustomerRef?.name || "";
    }
    if (!claim(key, u.id)) return;
    const c = await customerContact(t, e.realmId, customerId, email, name);
    if (!c) { console.info("qbo webhook: skip (no customer contact)"); return; }
    const r = await sendReviewRequest(u, c, "webhook");
    console.info("qbo webhook:", r.ok ? "review ask sent" : `not sent (${r.error})`);
  } catch (err) { if (key) release(key); console.error("QuickBooks webhook handling failed:", (err as Error).message); }
}
