import { NextRequest, NextResponse } from "next/server";
import { db, getUserByEmail } from "@/lib/db";
export const dynamic = "force-dynamic";

/** One-off-ish unlock for reviewer / support accounts. Auth: Bearer CRON_SECRET or UNLOCK_SECRET. */
export async function POST(req: NextRequest) {
  const secret = process.env.UNLOCK_SECRET || process.env.CRON_SECRET;
  if (!secret) return NextResponse.json({ error: "UNLOCK_SECRET not configured." }, { status: 503 });
  const auth = req.headers.get("authorization") || "";
  const q = req.nextUrl.searchParams.get("secret");
  const ok = auth === `Bearer ${secret}` || q === secret;
  if (!ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let email = "";
  try {
    const body = await req.json();
    email = String(body?.email || "").trim().toLowerCase();
  } catch {
    email = String(req.nextUrl.searchParams.get("email") || "").trim().toLowerCase();
  }
  if (!email) return NextResponse.json({ error: "email required" }, { status: 400 });
  const u = getUserByEmail(email);
  if (!u) return NextResponse.json({ error: "user not found" }, { status: 404 });
  db.prepare(
    `UPDATE users SET subscription_status='trialing',
      jobber_connected=0, jobber_access_token=NULL, jobber_refresh_token=NULL,
      jobber_token_expires_at=NULL, jobber_account_id=NULL WHERE id=?`
  ).run(u.id);
  return NextResponse.json({ ok: true, email, subscription_status: "trialing", jobber_connected: 0 });
}
