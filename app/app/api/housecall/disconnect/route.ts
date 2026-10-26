import { NextResponse } from "next/server";
import { currentUser } from "@/lib/session";
import { clearConnection } from "@/lib/housecall";
export async function POST() {
  const u = await currentUser();
  if (!u) return NextResponse.json({ error: "Please log in." }, { status: 401 });
  clearConnection(u.id);
  return NextResponse.json({ ok: true });
}
