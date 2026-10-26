import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
export const dynamic = "force-dynamic";
/** One-shot owner dump. Remove after use. */
export async function GET(req: NextRequest) {
  const key = process.env.ADMIN_LIST_KEY;
  if (!key || req.headers.get("authorization") !== `Bearer ${key}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const rows = db.prepare("SELECT id, email, business_name, subscription_status, jobber_connected, created_at FROM users ORDER BY id").all();
  return NextResponse.json({ users: rows });
}
