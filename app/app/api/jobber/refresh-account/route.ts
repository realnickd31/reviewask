import { NextResponse } from "next/server";
import { currentUser } from "@/lib/session";
import { accessToken, fetchAccountId, saveAccountId } from "@/lib/jobber";
export const dynamic = "force-dynamic";
// Re-fetch the Jobber account id using stored tokens (fixes connected-but-null-account without reconnecting).
export async function POST() {
  const u = await currentUser();
  if (!u) return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  try {
    const t = await accessToken(u);
    if (!t) return NextResponse.json({ ok: false, error: "not connected" }, { status: 400 });
    const id = await fetchAccountId(t);
    if (!id) return NextResponse.json({ ok: false, error: "could not fetch account id; disconnect and reconnect" }, { status: 502 });
    saveAccountId(u.id, id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Jobber refresh-account failed:", (e as Error).message);
    return NextResponse.json({ ok: false, error: "refresh failed" }, { status: 502 });
  }
}
