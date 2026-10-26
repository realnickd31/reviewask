import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { currentUser } from "@/lib/session";
import { exchangeCode, fetchAccountId, saveTokens } from "@/lib/jobber";
import { baseUrl } from "@/lib/base";
export const dynamic = "force-dynamic";
export async function GET(req: NextRequest) {
  const base = baseUrl();
  const c = cookies();
  const u = await currentUser();
  let code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");
  // Started from Jobber's App Marketplace "Connect": no state/PKCE. If not logged in to ReviewAsk yet,
  // park the code (expires in 10 min) and finish after login/signup (see actions.ts).
  if (!u) {
    if (code && !state) {
      c.set("jb_mkt_code", code, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", maxAge: 600, path: "/" });
      return NextResponse.redirect(`${base}/signup?from=jobber`);
    }
    return NextResponse.redirect(`${base}/login`);
  }
  if (!code && req.nextUrl.searchParams.get("resume")) code = c.get("jb_mkt_code")?.value || null;
  c.delete("jb_mkt_code");
  const st = c.get("jb_state")?.value, ver = c.get("jb_verifier")?.value;
  c.delete("jb_state"); c.delete("jb_verifier");
  const marketplace = !state; // Marketplace flow: no state/PKCE to check
  if (!code || (!marketplace && (state !== st || !ver))) return NextResponse.redirect(`${base}/settings?jobber=error#automatic`);
  try {
    const t = await exchangeCode(code, base, marketplace ? undefined : ver);
    const accountId = await fetchAccountId(t.access_token);
    if (!accountId) {
      console.error("Jobber connect failed: could not fetch Jobber account id; not marking connected");
      return NextResponse.redirect(`${base}/settings?jobber=error#automatic`);
    }
    saveTokens(u.id, t, accountId, true);
    return NextResponse.redirect(`${base}/settings?jobber=connected#automatic`);
  } catch (e) {
    console.error("Jobber connect failed:", (e as Error).message);
    return NextResponse.redirect(`${base}/settings?jobber=error#automatic`);
  }
}
