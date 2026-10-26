import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@/lib/session";
import { canSend, sendReviewRequest } from "@/lib/send";
import { MONTHLY_QUOTA, usedThisMonth } from "@/lib/db";

export const maxDuration = 300;
export async function POST(req: NextRequest) {
  const u = await currentUser();
  if (!u) return NextResponse.json({ error: "Please log in." }, { status: 401 });
  const b = await req.json().catch(() => ({}));
  const rows: unknown[] = Array.isArray(b.rows) ? b.rows.slice(0, 1000) : [];
  if (!rows.length) return NextResponse.json({ error: "No rows to send." }, { status: 400 });
  const pre = canSend(u);
  if (pre) return NextResponse.json({ error: pre.error }, { status: pre.code });
  let sent = 0, failed = 0, invalid = 0, quotaSkipped = 0;
  const errors: { row: number; error: string }[] = [];
  for (let i = 0; i < rows.length; i++) {
    if (usedThisMonth(u.id) >= MONTHLY_QUOTA) { quotaSkipped = rows.length - i; break; }
    const r = await sendReviewRequest(u, (rows[i] ?? {}) as object, "bulk");
    if (r.ok) sent++;
    else if (r.code === 400) { invalid++; errors.push({ row: i + 1, error: r.error }); }
    else if (r.code === 429) { quotaSkipped = rows.length - i; break; }
    else { failed++; errors.push({ row: i + 1, error: r.error }); }
  }
  return NextResponse.json({ ok: true, total: rows.length, sent, failed, invalid, quotaSkipped, errors: errors.slice(0, 20), used: usedThisMonth(u.id) });
}
