import { NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/session";

export async function POST() {
  const u = await currentUser();
  if (!u) return NextResponse.json({ error: "Please log in." }, { status: 401 });
  const token = "ra_" + crypto.randomBytes(24).toString("hex");
  db.prepare("UPDATE users SET api_token=? WHERE id=?").run(token, u.id);
  return NextResponse.json({ ok: true, token });
}
