import { NextResponse } from "next/server";
import { currentUser } from "@/lib/session";
import { db } from "@/lib/db";
import { channelLabel, sourceLabel, statusLabel } from "@/lib/activityLabels";
export const dynamic = "force-dynamic";
const esc = (v: unknown) => { const s = v == null ? "" : String(v); const t = /^[=+\-@]/.test(s) ? "'" + s : s; return /[",\n\r]/.test(t) ? `"${t.replace(/"/g, '""')}"` : t; };
export async function GET() {
  const u = await currentUser();
  if (!u) return NextResponse.json({ error: "Please log in." }, { status: 401 });
  const rows = db.prepare("SELECT customer_name, customer_email, customer_phone, channel, source, status, created_at, send_at, remind_at, reminded_at, fail_reason FROM review_requests WHERE user_id=? ORDER BY id DESC").all(u.id) as Record<string, unknown>[];
  const cols = ["customer_name", "customer_email", "customer_phone", "channel", "source", "status", "created_at", "send_at", "remind_at", "reminded_at"];
  const head = ["Customer", "Email", "Phone", "Channel", "Source", "Status", "Sent (UTC)", "Scheduled send (UTC)", "Follow-up due (UTC)", "Follow-up sent (UTC)"];
  const csv = [head.join(","), ...rows.map((r) => { const v: Record<string, unknown> = { ...r, channel: channelLabel(r), source: sourceLabel(r), status: statusLabel(r) }; return cols.map((c) => esc(v[c])).join(","); })].join("\r\n") + "\r\n";
  const d = new Date().toISOString().slice(0, 10);
  return new NextResponse(csv, { headers: { "content-type": "text/csv; charset=utf-8", "content-disposition": `attachment; filename="reviewask-history-${d}.csv"`, "cache-control": "no-store" } });
}
