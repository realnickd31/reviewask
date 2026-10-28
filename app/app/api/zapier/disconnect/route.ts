import { NextResponse } from "next/server";
import { currentUser } from "@/lib/session";
import { disconnectZapier } from "@/lib/zapier";

export async function POST() {
  const u = await currentUser();
  if (!u) return NextResponse.json({ error: "Please log in." }, { status: 401 });
  disconnectZapier(u.id);
  return NextResponse.json({ ok: true });
}
