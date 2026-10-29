import { NextResponse } from "next/server";
import { extractPlaceId, SHORT_LINK } from "@/lib/placeId";
const ALLOWED = /(^|\.)(goo\.gl|g\.page|g\.co|share\.google|google\.[a-z.]+)$/i;
// Follows Google short/share links (maps.app.goo.gl, share.google, g.page) server-side,
// since browsers can't read cross-origin redirects, then extracts the Place ID.
export async function GET(req: Request) {
  const raw = new URL(req.url).searchParams.get("url") || "";
  let url = raw.trim(); if (!/^https?:\/\//i.test(url)) url = "https://" + url;
  if (!SHORT_LINK.test(url) && !/google\./i.test(url)) return NextResponse.json({ placeId: null }, { status: 400 });
  const seen: string[] = [];
  try {
    for (let i = 0; i < 6; i++) {
      const host = new URL(url).hostname; if (!ALLOWED.test(host)) break;
      seen.push(url);
      const pid = extractPlaceId(url); if (pid && i > 0) return NextResponse.json({ placeId: pid });
      const r = await fetch(url, { redirect: "manual", headers: { "User-Agent": "Mozilla/5.0 (compatible; ReviewAsk link tool)", "Accept-Language": "en" }, signal: AbortSignal.timeout(6000) });
      const loc = r.headers.get("location");
      if (loc) { url = new URL(loc, url).toString(); continue; }
      const html = (await r.text()).slice(0, 600000);
      const found = extractPlaceId(html.replace(/\\u003d/g, "=").replace(/\\u0026/g, "&"));
      return NextResponse.json({ placeId: found });
    }
    return NextResponse.json({ placeId: extractPlaceId(url) });
  } catch { return NextResponse.json({ placeId: null }); }
}
