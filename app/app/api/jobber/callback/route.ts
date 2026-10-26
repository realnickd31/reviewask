import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { currentUser } from "@/lib/session";
import { exchangeCode, fetchAccountId, saveTokens } from "@/lib/jobber";
import { baseUrl } from "@/lib/base";
export const dynamic = "force-dynamic";
export async function GET(req: NextRequest) {
  const base = baseUrl();
  const u = await currentUser();
  if (!u) return NextResponse.redirect(`${base}/login`);
  const code = req.nextUrl.searchParams.get("code"), state = req.nextUrl.searchParams.get("state");
  const c = cookies(); const st = c.get("jb_state")?.value, ver = c.get("jb_verifier")?.value;
  c.delete("jb_state"); c.delete("jb_verifier");
  if (!code || !state || state !== st || !ver) return NextResponse.redirect(`${base}/settings?jobber=error#automatic`);
  try {
    const t = await exchangeCode(code, base, ver);
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
