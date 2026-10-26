import { NextRequest, NextResponse } from "next/server";
import { processDueReminders } from "@/lib/send";

export const dynamic = "force-dynamic";
async function handle(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return NextResponse.json({ error: "CRON_SECRET not configured." }, { status: 503 });
  const auth = req.headers.get("authorization") || "";
  const given = auth.startsWith("Bearer ") ? auth.slice(7) : req.nextUrl.searchParams.get("secret");
  if (given !== secret) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ ok: true, ...(await processDueReminders()) });
}
export const POST = handle;
export const GET = handle; // Vercel Cron issues GET with Bearer CRON_SECRET
