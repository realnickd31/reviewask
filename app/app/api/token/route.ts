import { NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/session";
import { disconnectZapier } from "@/lib/zapier";

export async function POST() {
  const u = await currentUser();
  if (!u) return NextResponse.json({ error: "Please log in." }, { status: 401 });
  const token = "ra_" + crypto.randomBytes(24).toString("hex");
  db.prepare("UPDATE users SET api_token=?, auto_enabled=1, auto_provider='zapier' WHERE id=?").run(token, u.id);
  return NextResponse.json({ ok: true, token });
}

// Back-compat: prefer POST /api/zapier/disconnect. Clear the secret key so old Zaps stop working.
export async function DELETE() {
  const u = await currentUser();
  if (!u) return NextResponse.json({ error: "Please log in." }, { status: 401 });
  disconnectZapier(u.id);
  return NextResponse.json({ ok: true });
}
