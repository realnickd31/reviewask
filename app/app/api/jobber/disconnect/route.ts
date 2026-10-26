import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/session";
export async function POST() {
  const u = await currentUser();
  if (!u) return NextResponse.json({ error: "Please log in." }, { status: 401 });
  db.prepare(`UPDATE users SET jobber_connected=0, jobber_access_token=NULL, jobber_refresh_token=NULL, jobber_token_expires_at=NULL, jobber_account_id=NULL WHERE id=?`).run(u.id);
  return NextResponse.json({ ok: true });
}
