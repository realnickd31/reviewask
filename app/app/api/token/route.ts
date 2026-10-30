import { NextRequest, NextResponse } from "next/server";
import { db, ensureApiToken, newApiToken } from "@/lib/db";
import { currentUser } from "@/lib/session";
import { disconnectZapier } from "@/lib/zapier";

/** Zapier setup. Does NOT mark Zapier connected (first inbound webhook does). Returns the account's existing API key.
 *  Only rotates the key when the owner explicitly asks ({ rotate: true }). */
export async function POST(req: NextRequest) {
  const u = await currentUser();
  if (!u) return NextResponse.json({ error: "Please log in." }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  let token: string;
  if (body?.rotate === true) { token = newApiToken(); db.prepare("UPDATE users SET api_token=? WHERE id=?").run(token, u.id); }
  else token = ensureApiToken(u.id);
  // Starting/continuing setup only lifts a prior Disconnect. "Connected" is set by the first real webhook.
  db.prepare("UPDATE users SET zapier_disconnected_at=NULL, zapier_setup_at=COALESCE(zapier_setup_at, datetime('now')) WHERE id=?").run(u.id);
  return NextResponse.json({ ok: true, token });
}

// Back-compat: prefer POST /api/zapier/disconnect. Does NOT touch the API key.
export async function DELETE() {
  const u = await currentUser();
  if (!u) return NextResponse.json({ error: "Please log in." }, { status: 401 });
  disconnectZapier(u.id);
  return NextResponse.json({ ok: true });
}
