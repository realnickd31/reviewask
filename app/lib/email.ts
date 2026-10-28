import fs from "fs";
import path from "path";
import { Resend } from "resend";

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));

function ctaBlock(url: string) {
  return `<p style="text-align:center;margin:32px 0"><a href="${esc(url)}" style="background:#b6f13a;color:#0b1631;padding:16px 32px;border-radius:10px;font-weight:700;font-size:18px;text-decoration:none;display:inline-block">Leave a Google review</a></p>
<p style="text-align:center;font-size:13px;color:#6b7280;word-break:break-all"><a href="${esc(url)}" style="color:#6b7280">${esc(url)}</a></p>`;
}

export function buildReviewEmail(business: string, customer: string, url: string, unsubscribeUrl: string) {
  const subject = `${customer.split(" ")[0]}, thanks again from ${business}`;
  const first = customer.split(" ")[0];
  const dot = business.trim().endsWith(".") ? "" : ".";
  const html = `<div style="font-family:system-ui,Arial,sans-serif;max-width:520px;margin:0 auto;padding:24px;color:#0b1631">
<p>Hi ${esc(first)},</p>
<p>Thanks again for choosing <b>${esc(business)}</b>${dot} If you're happy with how things went, would you leave us a quick Google review? It takes about 30 seconds and helps other people find us.</p>
${ctaBlock(url)}
<p>Grateful for your business,<br/>— ${esc(business)}</p>
<hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0"/>
<p style="font-size:12px;color:#6b7280">Don't want these emails? <a href="${esc(unsubscribeUrl)}">Unsubscribe</a>.</p></div>`;
  const text = `Hi ${first},\n\nThanks again for choosing ${business}${dot} If you're happy with how things went, would you leave us a quick Google review? It takes about 30 seconds and helps other people find us.\n\n${url}\n\nGrateful for your business,\n— ${business}\n\nUnsubscribe: ${unsubscribeUrl}`;
  return { subject, html, text, unsubscribeUrl };
}

export function buildReminderEmail(business: string, customer: string, url: string, unsubscribeUrl: string) {
  const subject = `Quick follow-up from ${business}`;
  const first = customer.split(" ")[0];
  const html = `<div style="font-family:system-ui,Arial,sans-serif;max-width:520px;margin:0 auto;padding:24px;color:#0b1631">
<p>Hi ${esc(first)},</p>
<p>Just following up from <b>${esc(business)}</b>. If you have a minute, we'd really appreciate a Google review.</p>
${ctaBlock(url)}
<p>Thank you,<br/>— ${esc(business)}</p>
<hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0"/>
<p style="font-size:12px;color:#6b7280">This is the only reminder we'll send. <a href="${esc(unsubscribeUrl)}">Unsubscribe</a>.</p></div>`;
  const text = `Hi ${first},\n\nJust following up from ${business}. If you have a minute, we'd really appreciate a Google review.\n\n${url}\n\nThank you,\n— ${business}\n\nUnsubscribe: ${unsubscribeUrl}`;
  return { subject, html, text, unsubscribeUrl };
}

/** First-ask SMS body (STOP line is appended by sendSms). */
export function buildReviewSms(business: string, customer: string, url: string) {
  const first = customer.split(" ")[0];
  return `Hi ${first}, thanks for choosing ${business}. Mind leaving a quick Google review? ${url}`;
}

/** Day-3 reminder SMS body (STOP line is appended by sendSms). */
export function buildReminderSms(business: string, customer: string, url: string) {
  const first = customer.split(" ")[0];
  return `Hi ${first}, quick follow-up from ${business} — if you have a minute, we'd appreciate a Google review: ${url}`;
}

function appendOutbox(entry: object) {
  const f = path.join(process.cwd(), "data", "outbox.json");
  let arr: object[] = [];
  try { arr = JSON.parse(fs.readFileSync(f, "utf8")); } catch {}
  arr.push({ ...entry, at: new Date().toISOString() });
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, JSON.stringify(arr, null, 2));
}

export async function sendEmail(to: string, m: { subject: string; html: string; text: string; unsubscribeUrl?: string }) {
  if (process.env.RESEND_API_KEY) {
    const r = new Resend(process.env.RESEND_API_KEY);
    const { data, error } = await r.emails.send({ from: process.env.RESEND_FROM || "ReviewAsk <onboarding@resend.dev>", to, subject: m.subject, html: m.html, text: m.text,
      ...(m.unsubscribeUrl ? { headers: { "List-Unsubscribe": `<${m.unsubscribeUrl}>`, "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" } } : {}) });
    if (error) throw new Error(error.message);
    return { id: data?.id ?? null, mode: "resend" as const };
  }
  appendOutbox({ type: "email", to, subject: m.subject, text: m.text });
  return { id: null, mode: "outbox" as const };
}

/** Normalize to E.164. 10 digits => US +1; 11 digits starting with 1 => +1. Returns null if unusable. */
export function toE164(raw: string): string | null {
  const t = String(raw || "").trim();
  const d = t.replace(/\D/g, "");
  if (t.startsWith("+") && d.length >= 8 && d.length <= 15) return "+" + d;
  if (d.length === 10) return "+1" + d;
  if (d.length === 11 && d.startsWith("1")) return "+" + d;
  return null;
}

export async function sendSms(to: string, body: string): Promise<{ id: string | null; mode: "twilio" | "outbox" | "suppressed" }> {
  const e164 = toE164(to);
  if (!e164) throw new Error(`Invalid phone number: ${to}`);
  const { isPhoneSuppressed } = await import("./db");
  if (isPhoneSuppressed(e164)) return { id: null, mode: "suppressed" };
  const sid = process.env.TWILIO_ACCOUNT_SID, token = process.env.TWILIO_AUTH_TOKEN, from = process.env.TWILIO_FROM_NUMBER;
  if (sid && token && from) {
    const twilio = (await import("twilio")).default;
    const msg = await twilio(sid, token).messages.create({ to: e164, from, body: `${body}\nReply STOP to opt out.` });
    return { id: msg.sid, mode: "twilio" };
  }
  appendOutbox({ type: "sms", to: e164, body });
  return { id: null, mode: "outbox" };
}
