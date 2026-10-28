import { NextResponse } from "next/server";
import { currentUser } from "@/lib/session";
import { clearStripeConnect, deauthorize } from "@/lib/stripe-connect";
export const dynamic = "force-dynamic";
export async function POST() {
  const u = await currentUser();
  if (!u) return NextResponse.json({ error: "Please log in." }, { status: 401 });
  await deauthorize(u);
  clearStripeConnect(u.id);
  return NextResponse.json({ ok: true });
}
