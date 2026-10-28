import { NextResponse } from "next/server";
import { currentUser } from "@/lib/session";
import { clearQbo, revoke } from "@/lib/quickbooks";
export const dynamic = "force-dynamic";
export async function POST() {
  const u = await currentUser();
  if (!u) return NextResponse.json({ error: "Please log in." }, { status: 401 });
  await revoke(u);
  clearQbo(u.id);
  return NextResponse.json({ ok: true });
}
