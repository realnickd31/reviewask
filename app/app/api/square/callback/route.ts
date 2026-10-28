import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { currentUser } from "@/lib/session";
import { exchangeCode, saveTokens } from "@/lib/square";
import { baseUrl } from "@/lib/base";
export const dynamic = "force-dynamic";
export async function GET(req: NextRequest) {
  const base = baseUrl();
  const u = await currentUser();
  if (!u) return NextResponse.redirect(`${base}/login`);
  const code = req.nextUrl.searchParams.get("code"), state = req.nextUrl.searchParams.get("state");
  const st = cookies().get("sq_state")?.value; cookies().delete("sq_state");
  if (!code || !state || state !== st) return NextResponse.redirect(`${base}/settings?square=error#automatic`);
  try {
    const t = await exchangeCode(code, base);
    saveTokens(u.id, t, true);
    return NextResponse.redirect(`${base}/settings?square=connected#automatic`);
  } catch (e) {
    console.error("Square connect failed:", (e as Error).message);
    return NextResponse.redirect(`${base}/settings?square=error#automatic`);
  }
}
