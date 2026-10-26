import fs from "fs";
import path from "path";
import { Resend } from "resend";

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));

export function buildReviewEmail(business: string, customer: string, url: string, unsubscribeUrl: string) {
  const subject = `How was your experience with ${business}?`;
  const first = customer.split(" ")[0];
  const html = `<div style="font-family:system-ui,Arial,sans-serif;max-width:520px;margin:0 auto;padding:24px;color:#0b1631">
<p>Hi ${esc(first)},</p>
<p>Thanks for choosing <b>${esc(business)}</b>. Would you take 30 seconds to leave us a Google review? It really helps a local business like ours.</p>
<p style="text-align:center;margin:32px 0"><a href="${esc(url)}" style="background:#b6f13a;color:#0b1631;padding:16px 32px;border-radius:10px;font-weight:700;font-size:18px;text-decoration:none;display:inline-block">Leave a review ⭐</a></p>
<p>Thank you!<br/>— ${esc(business)}</p>
<hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0"/>
<p style="font-size:12px;color:#6b7280">Don't want these emails? <a href="${esc(unsubscribeUrl)}">Unsubscribe</a>.</p></div>`;
  const text = `Hi ${first},\n\nThanks for choosing ${business}. Would you take 30 seconds to leave us a Google review?\n\n${url}\n\nThank you!\n— ${business}\n\nUnsubscribe: ${unsubscribeUrl}`;
  return { subject, html, text, unsubscribeUrl };
}

export function buildReminderEmail(business: string, customer: string, url: string, unsubscribeUrl: string) {
  const subject = `A quick reminder from ${business}`;
  const first = customer.split(" ")[0];
  const html = `<div style="font-family:system-ui,Arial,sans-serif;max-width:520px;margin:0 auto;padding:24px;color:#0b1631">
<p>Hi ${esc(first)},</p>
<p>Just a friendly follow-up from <b>${esc(business)}</b>. If you have a moment, a short Google review would mean a lot to us. No worries if not — thanks again for your business.</p>
<p style="text-align:center;margin:32px 0"><a href="${esc(url)}" style="background:#b6f13a;color:#0b1631;padding:16px 32px;border-radius:10px;font-weight:700;font-size:18px;text-decoration:none;display:inline-block">Leave a review ⭐</a></p>
<p>Thank you!<br/>— ${esc(business)}</p>
<hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0"/>
<p style="font-size:12px;color:#6b7280">This is the only reminder we'll send. <a href="${esc(unsubscribeUrl)}">Unsubscribe</a>.</p></div>`;
  const text = `Hi ${first},\n\nJust a friendly follow-up from ${business}. If you have a moment, a short Google review would mean a lot:\n\n${url}\n\nThank you!\n— ${business}\n\nUnsubscribe: ${unsubscribeUrl}`;
  return { subject, html, text, unsubscribeUrl };
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

export async function sendSms(to: string, body: string) {
  // Twilio not wired in MVP: stub to outbox.
  appendOutbox({ type: "sms", to, body });
  return { id: null, mode: "outbox" as const };
}
