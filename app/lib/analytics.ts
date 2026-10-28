import { db } from "./db";

export type AnalyticsEventName =
  | "pageview"
  | "cta_click"
  | "signup"
  | "onboarding_completed"
  | "checkout_started"
  | "checkout_completed"
  | "trial_started"
  | "subscription_active"
  | "subscription_canceled"
  | "first_ask"
  | "connector_connected";

export type TrackInput = {
  event: AnalyticsEventName | string;
  path?: string | null;
  referrer?: string | null;
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  utm_content?: string | null;
  utm_term?: string | null;
  visitor_id?: string | null;
  user_id?: number | null;
  meta?: Record<string, unknown> | string | null;
};

const insert = db.prepare(`INSERT INTO analytics_events
  (event, path, referrer, utm_source, utm_medium, utm_campaign, utm_content, utm_term, visitor_id, user_id, meta)
  VALUES (@event, @path, @referrer, @utm_source, @utm_medium, @utm_campaign, @utm_content, @utm_term, @visitor_id, @user_id, @meta)`);

export function trackServer(input: TrackInput) {
  try {
    const meta =
      input.meta == null
        ? null
        : typeof input.meta === "string"
          ? input.meta
          : JSON.stringify(input.meta);
    insert.run({
      event: String(input.event).slice(0, 64),
      path: input.path ? String(input.path).slice(0, 500) : null,
      referrer: input.referrer ? String(input.referrer).slice(0, 500) : null,
      utm_source: input.utm_source ? String(input.utm_source).slice(0, 120) : null,
      utm_medium: input.utm_medium ? String(input.utm_medium).slice(0, 120) : null,
      utm_campaign: input.utm_campaign ? String(input.utm_campaign).slice(0, 120) : null,
      utm_content: input.utm_content ? String(input.utm_content).slice(0, 120) : null,
      utm_term: input.utm_term ? String(input.utm_term).slice(0, 120) : null,
      visitor_id: input.visitor_id ? String(input.visitor_id).slice(0, 64) : null,
      user_id: input.user_id ?? null,
      meta,
    });
  } catch (e) {
    console.error("analytics track failed", e);
  }
}

export function trackFirstAskIfNeeded(userId: number, requestId: number) {
  try {
    const prior = db
      .prepare(
        "SELECT COUNT(*) c FROM review_requests WHERE user_id=? AND id<>? AND status != 'cancelled'"
      )
      .get(userId, requestId) as { c: number };
    if (prior.c === 0) trackServer({ event: "first_ask", user_id: userId, meta: { requestId } });
  } catch (e) {
    console.error("analytics first_ask failed", e);
  }
}

export function deviceFromUa(ua: string | null | undefined): "mobile" | "tablet" | "desktop" | "bot" | "unknown" {
  const s = (ua || "").toLowerCase();
  if (!s) return "unknown";
  if (/bot|crawl|spider|slurp|facebookexternalhit|preview/.test(s)) return "bot";
  if (/ipad|tablet|kindle|silk/.test(s)) return "tablet";
  if (/mobi|iphone|android.*mobile|opera mini/.test(s)) return "mobile";
  return "desktop";
}

export function isBotUa(ua: string | null | undefined) {
  return deviceFromUa(ua) === "bot";
}
