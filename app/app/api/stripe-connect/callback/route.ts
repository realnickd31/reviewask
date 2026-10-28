import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { currentUser } from "@/lib/session";
import { exchangeCode, saveAccount } from "@/lib/stripe-connect";
import { baseUrl } from "@/lib/base";
export const dynamic = "force-dynamic";
export async function GET(req: NextRequest) {
  const base = baseUrl();
  const u = await currentUser();
  if (!u) return NextResponse.redirect(`${base}/login`);
  const code = req.nextUrl.searchParams.get("code"), state = req.nextUrl.searchParams.get("state");
  const st = cookies().get("sc_state")?.value; cookies().delete("sc_state");
  if (!code || !state || state !== st) return NextResponse.redirect(`${base}/settings?stripe=error#automatic`);
  try {
    saveAccount(u.id, await exchangeCode(code));
    return NextResponse.redirect(`${base}/settings?stripe=connected#automatic`);
  } catch (e) {
    console.error("Stripe connect failed:", (e as Error).message);
    return NextResponse.redirect(`${base}/settings?stripe=error#automatic`);
  }
}
