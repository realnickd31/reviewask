import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { baseUrl } from "@/lib/stripe";
export async function POST(req: NextRequest) { const s = await getSession(); s.destroy(); return NextResponse.redirect(baseUrl(req.nextUrl.origin) + "/", 303); }
