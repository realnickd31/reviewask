import { NextResponse } from "next/server";
import { currentUser } from "@/lib/session";
import { clearSquare, revoke } from "@/lib/square";
export const dynamic = "force-dynamic";
export async function POST() {
  const u = await currentUser();
  if (!u) return NextResponse.json({ error: "Please log in." }, { status: 401 });
  await revoke(u);
  clearSquare(u.id);
  return NextResponse.json({ ok: true });
}
