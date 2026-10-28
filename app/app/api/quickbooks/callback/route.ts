import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { currentUser } from "@/lib/session";
import { exchangeCode, saveTokens } from "@/lib/quickbooks";
import { baseUrl } from "@/lib/base";
export const dynamic = "force-dynamic";
// Intuit redirects with ?code=...&state=...&realmId=... (or ?error=access_denied).
export async function GET(req: NextRequest) {
  const base = baseUrl();
  const u = await currentUser();
  if (!u) return NextResponse.redirect(`${base}/login`);
  const sp = req.nextUrl.searchParams;
  const code = sp.get("code"), state = sp.get("state"), realmId = sp.get("realmId");
  const st = cookies().get("qbo_state")?.value; cookies().delete("qbo_state");
  if (!code || !realmId || !state || state !== st) return NextResponse.redirect(`${base}/settings?quickbooks=error#automatic`);
  try {
    const t = await exchangeCode(code, base);
    saveTokens(u.id, t, realmId);
    return NextResponse.redirect(`${base}/settings?quickbooks=connected#automatic`);
  } catch (e) {
    console.error("QuickBooks connect failed:", (e as Error).message);
    return NextResponse.redirect(`${base}/settings?quickbooks=error#automatic`);
  }
}
