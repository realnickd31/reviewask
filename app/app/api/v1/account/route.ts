import { NextRequest, NextResponse } from "next/server";
import { usedThisMonth, MONTHLY_QUOTA } from "@/lib/db";
import { requireApiUser } from "@/lib/apiAuth";

export async function GET(req: NextRequest) {
  const u = requireApiUser(req); if (u instanceof NextResponse) return u;
  return NextResponse.json({
    object: "account",
    business_name: u.business_name,
    review_url_set: !!(u.review_url && u.review_url.trim()),
    subscription_status: u.subscription_status,
    used_this_month: usedThisMonth(u.id),
    monthly_quota: MONTHLY_QUOTA,
    send_delay_hours: u.send_delay_hours ?? 0,
    callback_url_set: !!(u as { callback_url?: string | null }).callback_url,
  });
}
