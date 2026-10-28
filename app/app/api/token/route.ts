import { NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/session";

export async function POST() {
  const u = await currentUser();
  if (!u) return NextResponse.json({ error: "Please log in." }, { status: 401 });
  const token = "ra_" + crypto.randomBytes(24).toString("hex");
  db.prepare("UPDATE users SET api_token=?, auto_enabled=1, auto_provider='zapier' WHERE id=?").run(token, u.id);
  return NextResponse.json({ ok: true, token });
}

// Disconnect Zapier: clear the secret key so old Zaps stop working.
export async function DELETE() {
  const u = await currentUser();
  if (!u) return NextResponse.json({ error: "Please log in." }, { status: 401 });
  db.prepare("UPDATE users SET api_token=NULL, auto_provider=CASE WHEN auto_provider='zapier' THEN NULL ELSE auto_provider END WHERE id=?").run(u.id);
  return NextResponse.json({ ok: true });
}
