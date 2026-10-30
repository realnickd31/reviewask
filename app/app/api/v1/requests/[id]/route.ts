import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireApiUser, jsonError, readJson } from "@/lib/apiAuth";
import { getRequest, publicRequest } from "@/lib/apiRequests";
import { cancelScheduledAsk, normalize, validate } from "@/lib/send";
import { emitRequestEvent } from "@/lib/notifyOutbox";
import { clampDelay } from "@/lib/delay";

type Ctx = { params: { id: string } };

export async function GET(req: NextRequest, { params }: Ctx) {
  const u = requireApiUser(req); if (u instanceof NextResponse) return u;
  const id = Number(params.id); if (!id) return jsonError("Not found.", 404);
  const row = getRequest(u.id, id); if (!row) return jsonError("Not found.", 404);
  return NextResponse.json({ data: publicRequest(row) });
}

export async function PATCH(req: NextRequest, { params }: Ctx) {
  const u = requireApiUser(req); if (u instanceof NextResponse) return u;
  const id = Number(params.id); if (!id) return jsonError("Not found.", 404);
  const row = getRequest(u.id, id); if (!row) return jsonError("Not found.", 404);
  if (row.status !== "scheduled") return jsonError("Only scheduled asks can be edited.", 409);
  const b = await readJson(req);
  const merged = normalize({
    name: b.name ?? row.customer_name,
    email: b.email !== undefined ? b.email : row.customer_email,
    phone: b.phone !== undefined ? b.phone : row.customer_phone,
  });
  const err = validate(merged); if (err) return jsonError(err, 400);
  const channel = [merged.email && "email", merged.phone && "sms"].filter(Boolean).join("+");
  if (b.delay_hours !== undefined) {
    const h = clampDelay(b.delay_hours, 0);
    db.prepare(`UPDATE review_requests SET customer_name=?, customer_email=?, customer_phone=?, channel=?, send_at=datetime('now', ?)
      WHERE id=? AND user_id=? AND status='scheduled'`).run(merged.name, merged.email || null, merged.phone || null, channel, `+${h} hours`, id, u.id);
  } else {
    db.prepare(`UPDATE review_requests SET customer_name=?, customer_email=?, customer_phone=?, channel=?
      WHERE id=? AND user_id=? AND status='scheduled'`).run(merged.name, merged.email || null, merged.phone || null, channel, id, u.id);
  }
  return NextResponse.json({ data: publicRequest(getRequest(u.id, id)!) });
}

export async function DELETE(req: NextRequest, { params }: Ctx) {
  const u = requireApiUser(req); if (u instanceof NextResponse) return u;
  const id = Number(params.id); if (!id) return jsonError("Not found.", 404);
  const row = getRequest(u.id, id); if (!row) return jsonError("Not found.", 404);
  if (row.status === "scheduled") {
    cancelScheduledAsk(u.id, id);
    return NextResponse.json({ ok: true, action: "cancelled_ask" });
  }
  if (row.status === "sent" && row.remind_at && !row.reminded_at && !row.followup_cancelled_at) {
    db.prepare("UPDATE review_requests SET remind_at=NULL, followup_cancelled_at=datetime('now') WHERE id=? AND user_id=? AND reminded_at IS NULL").run(id, u.id);
    emitRequestEvent(u.id, "followup.cancelled", id);
    return NextResponse.json({ ok: true, action: "cancelled_followup" });
  }
  return jsonError("Nothing left to cancel on this request.", 409);
}
