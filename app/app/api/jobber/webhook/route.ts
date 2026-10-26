import { NextRequest, NextResponse } from "next/server";
import { db, type User } from "@/lib/db";
import { accessToken, jobClient, verifyWebhook } from "@/lib/jobber";
import { sendReviewRequest } from "@/lib/send";
export const dynamic = "force-dynamic";
// Jobber webhook (subscribe to JOB_CLOSED in the Developer Center). Payload:
// { data: { webHookEvent: { topic, appId, accountId, itemId, occurredAt } } }
export async function POST(req: NextRequest) {
  const raw = await req.text();
  if (!verifyWebhook(raw, req.headers.get("x-jobber-hmac-sha256"))) return NextResponse.json({ ok: true, ignored: "unverified" });
  let ev: { topic?: string; accountId?: string; itemId?: string } = {};
  try { ev = JSON.parse(raw)?.data?.webHookEvent || {}; } catch { /* ignore */ }
  if (ev.topic === "APP_DISCONNECT" && ev.accountId) {
    db.prepare(`UPDATE users SET jobber_connected=0, jobber_access_token=NULL, jobber_refresh_token=NULL, jobber_token_expires_at=NULL, jobber_account_id=NULL WHERE jobber_account_id=?`).run(ev.accountId);
    return NextResponse.json({ ok: true });
  }
  if (ev.topic !== "JOB_CLOSED" || !ev.accountId || !ev.itemId) return NextResponse.json({ ok: true });
  const u = db.prepare("SELECT * FROM users WHERE jobber_account_id=? AND jobber_connected=1 AND auto_enabled=1").get(ev.accountId) as User | undefined;
  if (!u) return NextResponse.json({ ok: true });
  const itemId = ev.itemId;
  // Ack fast; do the lookup + send without blocking the response.
  void (async () => {
    try {
      const t = await accessToken(u); if (!t) return;
      const c = await jobClient(t, itemId); if (!c) return;
      await sendReviewRequest(u, c, "webhook");
    } catch (e) { console.error("Jobber webhook handling failed:", (e as Error).message); }
  })();
  return NextResponse.json({ ok: true });
}
