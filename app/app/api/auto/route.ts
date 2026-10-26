import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/session";
export async function POST(req: NextRequest) {
  const u = await currentUser();
  if (!u) return NextResponse.json({ error: "Please log in." }, { status: 401 });
  const b = await req.json().catch(() => ({}));
  if (typeof b.enabled === "boolean") db.prepare("UPDATE users SET auto_enabled=? WHERE id=?").run(b.enabled ? 1 : 0, u.id);
  if (["jobber", "housecall", "none"].includes(b.provider)) {
    db.prepare("UPDATE users SET auto_provider=? WHERE id=?").run(b.provider, u.id);
    if (b.clearSetup) db.prepare("UPDATE users SET auto_setup_email=NULL, auto_setup_requested_at=NULL WHERE id=?").run(u.id);
  }
  if (b.requestSetup) {
    // Record which service the setup request is for. Never touches the Jobber connection.
    if (["jobber", "housecall"].includes(b.provider)) db.prepare("UPDATE users SET auto_provider=? WHERE id=?").run(b.provider, u.id);
    const email = String(b.email || "").trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(email)) return NextResponse.json({ error: "That email looks wrong." }, { status: 400 });
    db.prepare("UPDATE users SET auto_setup_email=?, auto_setup_requested_at=datetime('now') WHERE id=?").run(email, u.id);
  }
  return NextResponse.json({ ok: true });
}
