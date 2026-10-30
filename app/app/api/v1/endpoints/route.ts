import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireApiOrSession, requireSameOrigin, jsonError, readJson } from "@/lib/apiAuth";
import { validWebhookUrl, newWebhookSecret } from "@/lib/webhooks";

export async function GET(req: NextRequest) {
  const u = await requireApiOrSession(req); if (u instanceof NextResponse) return u;
  const row = db.prepare("SELECT callback_url AS url, callback_secret AS secret FROM users WHERE id=?").get(u.id) as { url: string | null; secret: string | null };
  return NextResponse.json({ url: row?.url || null, secret_set: !!row?.secret });
}

export async function PUT(req: NextRequest) {
  if (!(req.headers.get("authorization") || req.headers.get("x-api-token"))) {
    const bad = requireSameOrigin(req); if (bad) return bad;
  }
  const u = await requireApiOrSession(req); if (u instanceof NextResponse) return u;
  const b = await readJson(req);
  const url = validWebhookUrl(b.url);
  if (!url) return jsonError("Enter an https URL we can reach.", 400);
  const existing = db.prepare("SELECT callback_secret AS secret FROM users WHERE id=?").get(u.id) as { secret: string | null };
  let secret = existing?.secret || null;
  let shown: string | null = null;
  if (!secret || b.rotate_secret) {
    secret = newWebhookSecret();
    shown = secret;
  }
  db.prepare("UPDATE users SET callback_url=?, callback_secret=? WHERE id=?").run(url, secret, u.id);
  return NextResponse.json({ ok: true, url, ...(shown ? { secret: shown } : { secret_set: true }) });
}

export async function DELETE(req: NextRequest) {
  if (!(req.headers.get("authorization") || req.headers.get("x-api-token"))) {
    const bad = requireSameOrigin(req); if (bad) return bad;
  }
  const u = await requireApiOrSession(req); if (u instanceof NextResponse) return u;
  db.prepare("UPDATE users SET callback_url=NULL, callback_secret=NULL WHERE id=?").run(u.id);
  return NextResponse.json({ ok: true });
}
