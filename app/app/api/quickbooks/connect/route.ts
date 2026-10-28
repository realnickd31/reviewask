import { NextResponse } from "next/server";
import crypto from "crypto";
import { cookies } from "next/headers";
import { currentUser } from "@/lib/session";
import { authUrl, qboConfigured } from "@/lib/quickbooks";
import { baseUrl } from "@/lib/base";
export const dynamic = "force-dynamic";
export async function GET() {
  const base = baseUrl();
  const u = await currentUser();
  if (!u) return NextResponse.redirect(`${base}/login`);
  if (!qboConfigured()) return NextResponse.redirect(`${base}/settings?quickbooks=setup#automatic`);
  const state = crypto.randomBytes(16).toString("hex");
  cookies().set("qbo_state", state, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", maxAge: 600, path: "/" });
  return NextResponse.redirect(authUrl(base, state));
}
