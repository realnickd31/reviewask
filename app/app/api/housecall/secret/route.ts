import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@/lib/session";
import { saveSecret } from "@/lib/housecall";
export const dynamic = "force-dynamic";
export async function POST(req: NextRequest) {
  const u = await currentUser();
  if (!u) return NextResponse.json({ error: "Please log in." }, { status: 401 });
  if (!u.housecall_api_key) return NextResponse.json({ error: "Please add your connection key first." }, { status: 400 });
  const secret = String((await req.json().catch(() => ({}))).webhookSecret || "").trim();
  if (!secret) return NextResponse.json({ error: "Please paste the secret from Housecall Pro." }, { status: 400 });
  saveSecret(u.id, secret);
  return NextResponse.json({ ok: true });
}
