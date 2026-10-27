import twilio from "twilio";
import { suppressPhone, unsuppressPhone } from "@/lib/db";
import { toE164 } from "@/lib/email";

export const dynamic = "force-dynamic";

const STOP = new Set(["STOP", "STOPALL", "UNSUBSCRIBE", "CANCEL", "END", "QUIT", "REVOKE", "OPTOUT"]);
const START = new Set(["START", "UNSTOP", "YES"]);
const HELP = new Set(["HELP", "INFO"]);

const xml = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" }[c]!));
const twiml = (msg?: string) => new Response(
  `<?xml version="1.0" encoding="UTF-8"?><Response>${msg ? `<Message>${xml(msg)}</Message>` : ""}</Response>`,
  { headers: { "Content-Type": "text/xml" } });

/** Twilio inbound SMS webhook. Configure on the number: POST https://getreviewask.com/api/twilio/incoming */
export async function POST(req: Request) {
  const raw = await req.text();
  const params = Object.fromEntries(new URLSearchParams(raw)) as Record<string, string>;
  const token = process.env.TWILIO_AUTH_TOKEN;
  if (token) {
    const base = process.env.APP_URL || "https://getreviewask.com";
    const url = new URL(new URL(req.url).pathname + new URL(req.url).search, base).toString();
    const sig = req.headers.get("x-twilio-signature") || "";
    if (!twilio.validateRequest(token, sig, url, params)) return new Response("Invalid signature", { status: 403 });
  }
  const from = toE164(params.From || "");
  const word = (params.Body || "").trim().toUpperCase().replace(/[^A-Z]/g, "");
  if (from && STOP.has(word)) {
    suppressPhone(from);
    return twiml("ReviewAsk: You're unsubscribed and will receive no more messages. Reply START to resubscribe.");
  }
  if (from && START.has(word)) {
    unsuppressPhone(from);
    return twiml("ReviewAsk: You're resubscribed. Reply STOP to opt out, HELP for help.");
  }
  if (HELP.has(word)) return twiml("ReviewAsk: Review request messages from local businesses. Help: support@getreviewask.com. Msg&data rates may apply. Reply STOP to opt out.");
  return twiml();
}
