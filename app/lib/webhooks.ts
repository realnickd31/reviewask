import crypto from "crypto";
import { db, getUser, type User, type ReviewRequest } from "./db";
import { publicRequest } from "./apiRequests";

export const WEBHOOK_EVENTS = ["request.created", "request.sent", "request.reminded", "request.cancelled", "followup.cancelled"] as const;
export type WebhookEvent = (typeof WEBHOOK_EVENTS)[number];

export const newWebhookSecret = () => "whsec_" + crypto.randomBytes(24).toString("hex");
export const signPayload = (secret: string, body: string) => "sha256=" + crypto.createHmac("sha256", secret).update(body).digest("hex");

export function validWebhookUrl(raw: unknown): string | null {
  const s = String(raw ?? "").trim();
  if (!s || s.length > 500) return null;
  try {
    const u = new URL(s);
    const prod = process.env.NODE_ENV === "production";
    if (u.protocol !== "https:" && !(!prod && u.protocol === "http:")) return null;
    if (prod && /^(localhost|127\.|10\.|192\.168\.|169\.254\.|0\.0\.0\.0|\[::1\])/i.test(u.hostname)) return null;
    return u.toString();
  } catch { return null; }
}

