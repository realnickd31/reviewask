import { NextRequest, NextResponse } from "next/server";
import { getUserByToken } from "@/lib/db";
import { sendReviewRequest } from "@/lib/send";

const pick = (o: Record<string, unknown>, keys: string[]) => {
  const lower = Object.fromEntries(Object.entries(o).map(([k, v]) => [k.toLowerCase().replace(/[^a-z]/g, ""), v]));
  for (const k of keys) { const v = lower[k]; if (v != null && String(v).trim()) return String(v); }
  return "";
};

export async function POST(req: NextRequest) {
  const auth = req.headers.get("authorization") || "";
  const token = (auth.startsWith("Bearer ") ? auth.slice(7) : req.headers.get("x-api-token") || req.nextUrl.searchParams.get("token") || "").trim();
  const u = token ? getUserByToken(token) : undefined;
  if (!u) return NextResponse.json({ error: "Invalid or missing API token." }, { status: 401 });
  const ct = req.headers.get("content-type") || "";
  let b: Record<string, unknown> = {};
  if (ct.includes("application/json")) b = await req.json().catch(() => ({}));
  else { const fd = await req.formData().catch(() => null); if (fd) b = Object.fromEntries(fd) as Record<string, unknown>; }
  let name = pick(b, ["customername", "name", "fullname", "clientname", "client"]);
  if (!name) name = [pick(b, ["firstname", "first"]), pick(b, ["lastname", "last"])].filter(Boolean).join(" ");
  const email = pick(b, ["email", "customeremail", "clientemail", "emailaddress"]);
  const phone = pick(b, ["phone", "customerphone", "clientphone", "phonenumber", "mobile"]);
  const r = await sendReviewRequest(u, { name, email, phone }, "webhook");
  if (!r.ok) return NextResponse.json({ error: r.error, id: r.id }, { status: r.code });
  return NextResponse.json(r);
}
