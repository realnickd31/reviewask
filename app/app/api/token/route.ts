import { NextRequest, NextResponse } from "next/server";
import { db, ensureApiToken, newApiToken } from "@/lib/db";
import { currentUser } from "@/lib/session";
import { disconnectZapier } from "@/lib/zapier";

/** Zapier connect. Marks Zapier as the auto-ask provider and returns the account's existing API key.
 *  Only rotates the key when the owner explicitly asks ({ rotate: true }). */
export async function POST(req: NextRequest) {
  const u = await currentUser();
  if (!u) return NextResponse.json({ error: "Please log in." }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  let token: string;
  if (body?.rotate === true) { token = newApiToken(); db.prepare("UPDATE users SET api_token=? WHERE id=?").run(token, u.id); }
  else token = ensureApiToken(u.id);
  db.prepare("UPDATE users SET auto_enabled=1, auto_provider='zapier' WHERE id=?").run(u.id);
  return NextResponse.json({ ok: true, token });
}

// Back-compat: prefer POST /api/zapier/disconnect. Does NOT touch the API key.
export async function DELETE() {
  const u = await currentUser();
  if (!u) return NextResponse.json({ error: "Please log in." }, { status: 401 });
  disconnectZapier(u.id);
  return NextResponse.json({ ok: true });
}
