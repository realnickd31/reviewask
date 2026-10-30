import { NextRequest, NextResponse } from "next/server";
import { db, newApiToken } from "@/lib/db";
import { requireApiOrSession, requireSameOrigin } from "@/lib/apiAuth";

/** Owner-initiated only. Create or rotate the API token without enabling Zapier auto-asks. */
export async function POST(req: NextRequest) {
  if (!(req.headers.get("authorization") || req.headers.get("x-api-token"))) {
    const bad = requireSameOrigin(req); if (bad) return bad;
  }
  const u = await requireApiOrSession(req); if (u instanceof NextResponse) return u;
  const token = newApiToken();
  db.prepare("UPDATE users SET api_token=? WHERE id=?").run(token, u.id);
  return NextResponse.json({ ok: true, token });
}

export async function DELETE(req: NextRequest) {
  if (!(req.headers.get("authorization") || req.headers.get("x-api-token"))) {
    const bad = requireSameOrigin(req); if (bad) return bad;
  }
  const u = await requireApiOrSession(req); if (u instanceof NextResponse) return u;
  db.prepare("UPDATE users SET api_token=NULL WHERE id=?").run(u.id);
  return NextResponse.json({ ok: true });
}
