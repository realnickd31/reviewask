import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@/lib/session";
import { getCompany, saveConnection, webhookUrl } from "@/lib/housecall";
export const dynamic = "force-dynamic";
export async function POST(req: NextRequest) {
  const u = await currentUser();
  if (!u) return NextResponse.json({ error: "Please log in." }, { status: 401 });
  const b = await req.json().catch(() => ({}));
  const apiKey = String(b.apiKey || "").trim(); const secret = String(b.webhookSecret || "").trim() || null;
  if (!apiKey) return NextResponse.json({ error: "Please paste your connection key." }, { status: 400 });
  const companyId = await getCompany(apiKey);
  if (!companyId) return NextResponse.json({ error: "Housecall Pro didn’t accept that key. Copy it again and paste the whole thing." }, { status: 400 });
  saveConnection(u.id, apiKey, String(companyId), secret);
  console.info("housecall connect: saved for user", u.id);
  return NextResponse.json({ ok: true, companyId, webhookUrl: webhookUrl() });
}
