import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@/lib/session";
import { sendReviewRequest } from "@/lib/send";

export async function POST(req: NextRequest) {
  const u = await currentUser();
  if (!u) return NextResponse.json({ error: "Please log in." }, { status: 401 });
  const b = await req.json().catch(() => ({}));
  const r = await sendReviewRequest(u, b, "manual");
  if (!r.ok) return NextResponse.json({ error: r.error, id: r.id }, { status: r.code });
  return NextResponse.json(r);
}
