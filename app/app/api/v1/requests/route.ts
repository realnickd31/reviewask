import { NextRequest, NextResponse } from "next/server";
import { db, MONTHLY_QUOTA, type ReviewRequest } from "@/lib/db";
import { requireApiUser, readJson } from "@/lib/apiAuth";
import { sendReviewRequest } from "@/lib/send";
import { clampDelay } from "@/lib/delay";
import { publicRequest } from "@/lib/apiRequests";

export async function GET(req: NextRequest) {
  const u = requireApiUser(req); if (u instanceof NextResponse) return u;
  const sp = req.nextUrl.searchParams;
  const limit = Math.min(100, Math.max(1, Number(sp.get("limit") || 50) || 50));
  const cursor = Number(sp.get("cursor") || 0) || 0;
  const status = (sp.get("status") || "").trim();
  const rows = (status
    ? db.prepare(`SELECT * FROM review_requests WHERE user_id=? AND status=? AND (? = 0 OR id < ?) ORDER BY id DESC LIMIT ?`).all(u.id, status, cursor, cursor || 999999999, limit)
    : db.prepare(`SELECT * FROM review_requests WHERE user_id=? AND (? = 0 OR id < ?) ORDER BY id DESC LIMIT ?`).all(u.id, cursor, cursor || 999999999, limit)
  ) as ReviewRequest[];
  const data = rows.map(publicRequest);
  return NextResponse.json({ data, next_cursor: data.length === limit ? data[data.length - 1].id : null });
}

export async function POST(req: NextRequest) {
  const u = requireApiUser(req); if (u instanceof NextResponse) return u;
  const b = await readJson(req);
  const delayHours = b.delay_hours !== undefined ? clampDelay(b.delay_hours, 0) : 0;
  const r = await sendReviewRequest(u, { name: b.name, email: b.email, phone: b.phone }, "api", { delayHours });
  if (!r.ok) return NextResponse.json({ error: r.error, id: r.id }, { status: r.code });
  const row = db.prepare("SELECT * FROM review_requests WHERE id=?").get(r.id) as ReviewRequest;
  return NextResponse.json({ ok: true, id: r.id, mode: r.mode, used: r.used, quota: MONTHLY_QUOTA, data: publicRequest(row) }, { status: 201 });
}
