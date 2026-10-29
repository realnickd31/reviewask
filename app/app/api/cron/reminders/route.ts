import { NextRequest, NextResponse } from "next/server";
import { processDueReminders, processDueScheduledAsks } from "@/lib/send";
import { snapshotAll } from "@/lib/reviewStats";

export const dynamic = "force-dynamic";
async function handle(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return NextResponse.json({ error: "CRON_SECRET not configured." }, { status: 503 });
  const auth = req.headers.get("authorization") || "";
  const given = auth.startsWith("Bearer ") ? auth.slice(7) : req.nextUrl.searchParams.get("secret");
  if (given !== secret) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const asks = await processDueScheduledAsks();
  const reminders = await processDueReminders();
  // Daily Google rating/review-count snapshot (no-op without GOOGLE_PLACES_API_KEY; skips places already checked in the last 20h).
  let reviews: unknown; try { reviews = await snapshotAll(); } catch (e) { console.error("review snapshots", e); reviews = { error: true }; }
  return NextResponse.json({ ok: true, ...reminders, scheduled: asks, reviews });
}
export const POST = handle;
export const GET = handle; // Vercel Cron issues GET with Bearer CRON_SECRET
