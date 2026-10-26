import { db, getUser, isActive, usedThisMonth, MONTHLY_QUOTA, type User } from "./db";
import { buildReviewEmail, buildReminderEmail, sendEmail, sendSms } from "./email";

export type SendInput = { name?: unknown; email?: unknown; phone?: unknown };
export type SendResult =
  | { ok: true; id: number; mode: string; used: number }
  | { ok: false; error: string; code: number; id?: number };

export function normalize(b: SendInput) {
  return {
    name: String(b.name ?? "").trim().slice(0, 100),
    email: String(b.email ?? "").trim().toLowerCase(),
    phone: String(b.phone ?? "").trim(),
  };
}
export function validate(i: ReturnType<typeof normalize>): string | null {
  if (!i.name) return "Customer name is required.";
  if (!i.email && !i.phone) return "Add an email or phone.";
  if (i.email && !/^\S+@\S+\.\S+$/.test(i.email)) return "That email looks wrong.";
  return null;
}
export function canSend(u: User): { error: string; code: number } | null {
  if (!isActive(u)) return { error: "Start your subscription to send requests.", code: 402 };
  if (!u.business_name || !u.review_url) return { error: "Finish onboarding first.", code: 400 };
  if (usedThisMonth(u.id) >= MONTHLY_QUOTA) return { error: `Monthly limit of ${MONTHLY_QUOTA} reached.`, code: 429 };
  return null;
}

/** Single shared send path used by the UI, bulk upload and the webhook. */
export async function sendReviewRequest(u: User, raw: SendInput, source = "manual"): Promise<SendResult> {
  const blocked = canSend(u);
  if (blocked) return { ok: false, ...blocked };
  const i = normalize(raw);
  const err = validate(i);
  if (err) return { ok: false, error: err, code: 400 };
  const biz = u.business_name!, url = u.review_url!;
  const channels: string[] = []; let status = "sent"; let providerId: string | null = null; let mode = "";
  try {
    if (i.email) { const r = await sendEmail(i.email, buildReviewEmail(biz, i.name, url)); providerId = r.id; mode = r.mode; channels.push("email"); }
    if (i.phone) { const r = await sendSms(i.phone, `Hi ${i.name.split(" ")[0]}, thanks for choosing ${biz}! Mind leaving a quick review? ${url}`); mode ||= r.mode; channels.push("sms"); }
  } catch (e) { status = "failed"; console.error("send failed", e); }
  const r = db.prepare(`INSERT INTO review_requests (user_id, customer_name, customer_email, customer_phone, channel, status, provider_id, source, remind_at)
    VALUES (?,?,?,?,?,?,?,?, ${status === "sent" ? "datetime('now','+3 days')" : "NULL"})`)
    .run(u.id, i.name, i.email || null, i.phone || null, channels.join("+") || (i.email ? "email" : "sms"), status, providerId, source);
  const id = Number(r.lastInsertRowid);
  if (status === "failed") return { ok: false, error: "Email provider rejected the send. Check RESEND settings.", code: 502, id };
  return { ok: true, id, mode, used: usedThisMonth(u.id) };
}

type DueRow = { id: number; user_id: number; customer_name: string; customer_email: string | null; customer_phone: string | null };

/** Send day-3 follow-ups that are due. Pass userId to scope to one account. */
export async function processDueReminders(userId?: number, limit = 200) {
  const rows = db.prepare(`SELECT id, user_id, customer_name, customer_email, customer_phone FROM review_requests
    WHERE remind_at IS NOT NULL AND remind_at <= datetime('now') AND reminded_at IS NULL AND status = 'sent'
    ${userId ? "AND user_id = ?" : ""} ORDER BY remind_at LIMIT ${limit}`).all(...(userId ? [userId] : [])) as DueRow[];
  let sent = 0, failed = 0, skipped = 0;
  const users = new Map<number, User | undefined>();
  for (const r of rows) {
    if (!users.has(r.user_id)) users.set(r.user_id, getUser(r.user_id));
    const u = users.get(r.user_id);
    if (!u || !isActive(u) || !u.business_name || !u.review_url) { skipped++; continue; }
    // Claim the row first so concurrent runs (cron + dashboard) never double-send.
    const claim = db.prepare("UPDATE review_requests SET reminded_at = datetime('now') WHERE id=? AND reminded_at IS NULL").run(r.id);
    if (claim.changes === 0) { skipped++; continue; }
    try {
      if (r.customer_email) await sendEmail(r.customer_email, buildReminderEmail(u.business_name, r.customer_name, u.review_url));
      if (r.customer_phone) await sendSms(r.customer_phone, `Hi ${r.customer_name.split(" ")[0]}, a quick reminder from ${u.business_name}: if you have a moment, we'd love a short review. ${u.review_url}`);
      sent++;
    } catch (e) {
      console.error("reminder failed", e);
      db.prepare("UPDATE review_requests SET reminded_at = NULL, remind_at = NULL, status = 'failed' WHERE id=?").run(r.id);
      failed++;
    }
  }
  return { due: rows.length, sent, failed, skipped };
}
