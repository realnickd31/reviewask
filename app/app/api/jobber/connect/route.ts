import { NextResponse } from "next/server";
import crypto from "crypto";
import { cookies } from "next/headers";
import { currentUser } from "@/lib/session";
import { authUrl, jobberConfigured, pkce } from "@/lib/jobber";
import { baseUrl } from "@/lib/base";
export const dynamic = "force-dynamic";
export async function GET() {
  const base = baseUrl();
  const u = await currentUser();
  if (!u) return NextResponse.redirect(`${base}/login`);
  if (!jobberConfigured()) return NextResponse.redirect(`${base}/settings?jobber=setup#automatic`);
  const { verifier, challenge } = pkce();
  const state = crypto.randomBytes(16).toString("hex");
  const opts = { httpOnly: true, sameSite: "lax" as const, secure: process.env.NODE_ENV === "production", maxAge: 600, path: "/" };
  cookies().set("jb_state", state, opts); cookies().set("jb_verifier", verifier, opts);
  return NextResponse.redirect(authUrl(base, state, challenge));
}
