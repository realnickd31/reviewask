import { NextResponse } from "next/server";
import { currentUser } from "@/lib/session";
import { appDisconnect, clearJobber } from "@/lib/jobber";
export const dynamic = "force-dynamic";
export async function POST() {
  const u = await currentUser();
  if (!u) return NextResponse.json({ error: "Please log in." }, { status: 401 });
  await appDisconnect(u); // notify Jobber first (needs the token), then clear locally regardless
  clearJobber(u.id);
  return NextResponse.json({ ok: true });
}
