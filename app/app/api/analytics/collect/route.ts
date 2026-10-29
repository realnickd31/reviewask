import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { randomUUID } from "crypto";
import { trackServer, deviceFromUa, isBotUa, isAdminPath } from "@/lib/analytics";
import { currentUser } from "@/lib/session";
import { isMetricsExemptEmail, INTERNAL_COOKIE, INTERNAL_COOKIE_OPTS } from "@/lib/admin-emails";

export const dynamic = "force-dynamic";

const ALLOWED = new Set(["pageview", "cta_click"]);
const SKIP_PREFIX = ["/admin", "/api", "/dashboard", "/settings", "/quick", "/u/"];

function shouldSkipPath(path: string) {
  const p = path.split("?")[0] || "/";
  return SKIP_PREFIX.some((s) => p === s || p.startsWith(s + "/"));
}

export async function POST(req: NextRequest) {
  const ua = req.headers.get("user-agent");
  if (isBotUa(ua)) return NextResponse.json({ ok: true, skipped: "bot" });

  let body: Record<string, unknown> = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad json" }, { status: 400 });
  }

  const event = String(body.event || "").slice(0, 64);
  if (!ALLOWED.has(event)) return NextResponse.json({ error: "event" }, { status: 400 });

  const path = String(body.path || "/").slice(0, 500);
  const jar = cookies();

  // Internal traffic exclusion: a browser that has ever been signed in as a metrics-exempt
  // account gets a persistent ra_internal=1 cookie (set at login and here), and every later
  // event from it is dropped -- even anonymous visits to / or /login after logout.
  if (jar.get(INTERNAL_COOKIE)?.value === "1") return NextResponse.json({ ok: true, skipped: "internal" });
  const u = await currentUser().catch(() => undefined);
  if (u && isMetricsExemptEmail(u.email)) {
    const r = NextResponse.json({ ok: true, skipped: "internal" });
    r.cookies.set(INTERNAL_COOKIE, "1", INTERNAL_COOKIE_OPTS);
    return r;
  }
  // /login?next=/admin is only ever hit by us.
  if (/^\/login\?(.*&)?next=%2Fadmin|^\/login\?(.*&)?next=\/admin/i.test(path)) {
    return NextResponse.json({ ok: true, skipped: "internal" });
  }

  if (event === "pageview" && shouldSkipPath(path)) {
    return NextResponse.json({ ok: true, skipped: "path" });
  }
  // Never record admin pages (any event type).
  if (isAdminPath(path)) return NextResponse.json({ ok: true, skipped: "admin" });

  let vid = jar.get("ra_vid")?.value;
  const res = NextResponse.json({ ok: true });
  if (!vid || vid.length < 8) {
    vid = randomUUID();
    res.cookies.set("ra_vid", vid, {
      path: "/",
      httpOnly: false,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 365,
    });
  }

  const device = deviceFromUa(ua);
  const metaIn = body.meta && typeof body.meta === "object" ? (body.meta as Record<string, unknown>) : {};
  trackServer({
    event,
    path,
    referrer: body.referrer ? String(body.referrer).slice(0, 500) : req.headers.get("referer"),
    utm_source: body.utm_source ? String(body.utm_source) : null,
    utm_medium: body.utm_medium ? String(body.utm_medium) : null,
    utm_campaign: body.utm_campaign ? String(body.utm_campaign) : null,
    utm_content: body.utm_content ? String(body.utm_content) : null,
    utm_term: body.utm_term ? String(body.utm_term) : null,
    visitor_id: vid,
    user_id: u?.id ?? null,
    meta: { ...metaIn, device, cta: body.cta || metaIn.cta },
  });

  return res;
}
