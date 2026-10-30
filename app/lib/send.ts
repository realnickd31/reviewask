import crypto from "crypto";
import { db, isSuppressed, unsubscribeUrl, getUser, isActive, needsPayment, usedThisMonth, MONTHLY_QUOTA, type User } from "./db";
import { buildReviewEmail, buildReminderEmail, buildReviewSms, buildReminderSms, sendEmail, sendSms } from "./email";
import { trackFirstAskIfNeeded } from "./analytics";
import { clampDelay } from "./delay";
import { emitRequestEvent } from "./notifyOutbox";

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
  if (!isActive(u)) return { error: needsPayment(u) ? "Your last payment didn’t go through. Update your card to resume sending." : u.subscription_status === "canceled" ? "Your plan is canceled. Resubscribe to resume sending." : "Start your free trial to send requests.", code: 402 };
  if (!u.business_name || !u.review_url) return { error: "Finish onboarding first.", code: 400 };
  if (usedThisMonth(u.id) >= MONTHLY_QUOTA) return { error: `Monthly limit of ${MONTHLY_QUOTA} reached.`, code: 429 };
  return null;
}

/** Account's wait for automatic asks (job software / webhooks), so the owner can hit "Don't ask" after a bad job. */
export const accountDelayHours = (u: User) => clampDelay(u.send_delay_hours);

/** Single shared send path used by the UI, bulk upload and the webhooks. */
/** Webhooks use the account default delay. Typed-in and spreadsheet asks pass the owner's pick (default: instant). */
export async function sendReviewRequest(u: User, raw: SendInput, source = "manual", opts: { delayHours?: number } = {}): Promise<SendResult> {
  const blocked = canSend(u);
  if (blocked) return { ok: false, ...blocked };
  const i = normalize(raw);
  const err = validate(i);
  if (err) return { ok: false, error: err, code: 400 };
  // Every ask gets a token for email unsubscribe (/u/). Review links go straight to Google (no /r/ hop).
  const token = crypto.randomBytes(24).toString("base64url");
  const delay = opts.delayHours !== undefined ? clampDelay(opts.delayHours, 0) : source === "webhook" ? accountDelayHours(u) : 0;
  if (delay > 0) {
    const r = db.prepare(`INSERT INTO review_requests (user_id, customer_name, customer_email, customer_phone, channel, status, source, send_at, unsubscribe_token)
      VALUES (?,?,?,?,?,'scheduled',?, datetime('now', ?), ?)`)
      .run(u.id, i.name, i.email || null, i.phone || null, [i.email && "email", i.phone && "sms"].filter(Boolean).join("+"), source, `+${delay} hours`, token);
    const sid = Number(r.lastInsertRowid);
    trackFirstAskIfNeeded(u.id, sid);
    emitRequestEvent(u, "request.created", sid);
    return { ok: true, id: sid, mode: "scheduled", used: usedThisMonth(u.id) };
  }
  const r = db.prepare(`INSERT INTO review_requests (user_id, customer_name, customer_email, customer_phone, channel, status, source, unsubscribe_token)
    VALUES (?,?,?,?,?,'sending',?,?)`).run(u.id, i.name, i.email || null, i.phone || null, "email", source, token);
  const id = Number(r.lastInsertRowid);
  trackFirstAskIfNeeded(u.id, id);
  const d = await deliver(u, id, i, token);
  if (d.status === "failed") return { ok: false, error: "Email provider rejected the send. Check RESEND settings.", code: 502, id };
  emitRequestEvent(u, "request.sent", id);
  return { ok: true, id, mode: d.mode, used: usedThisMonth(u.id) };
}

/** Deliver the first ask for an existing row and record the outcome. */
async function deliver(u: User, id: number, i: { name: string; email: string; phone: string }, token: string | null) {
  const biz = u.business_name!;
  if (!token) { token = crypto.randomBytes(24).toString("base64url"); db.prepare("UPDATE review_requests SET unsubscribe_token=? WHERE id=?").run(token, id); }
  const url = u.review_url!;
  const channels: string[] = []; let status = "sent"; let providerId: string | null = null; let mode = ""; let smsMode = "";
  const suppressed = !!i.email && isSuppressed(i.email);
  try {
    if (i.email && !suppressed) { const r = await sendEmail(i.email, buildReviewEmail(biz, i.name, url, unsubscribeUrl(token))); providerId = r.id; mode = r.mode; channels.push("email"); }
    if (i.phone) { const r = await sendSms(i.phone, buildReviewSms(biz, i.name, url)); smsMode = r.mode; mode ||= r.mode; channels.push("sms"); }
  } catch (e) { status = "failed"; console.error("send failed", e); }
  // Fallback: if the SMS provider is unavailable in production, a phone-only ask isn't delivered, so mark it queued instead of sent.
  if (status === "sent" && smsMode === "outbox" && !channels.includes("email") && process.env.RESEND_API_KEY) { status = "queued"; mode = "sms_pending"; }
  if (suppressed && !i.phone && status === "sent") status = "suppressed";
  db.prepare(`UPDATE review_requests SET status=?, provider_id=?, channel=?, created_at=datetime('now'),
    remind_at=${status === "sent" ? "datetime('now','+3 days')" : "NULL"} WHERE id=?`)
    .run(status, providerId, channels.join("+") || (i.email ? "email" : "sms"), id);
  return { status, mode };
}

/** Send scheduled automatic asks whose cancel window has passed. Claims each row first (scheduled -> sending) so runs never double-send. */
export async function processDueScheduledAsks(userId?: number, limit = 200) {
  const rows = db.prepare(`SELECT id, user_id, customer_name, customer_email, customer_phone, unsubscribe_token FROM review_requests
    WHERE status = 'scheduled' AND send_at <= datetime('now') ${userId ? "AND user_id = ?" : ""} ORDER BY send_at LIMIT ${limit}`)
    .all(...(userId ? [userId] : [])) as DueRow[];
  let sent = 0, skipped = 0;
  const users = new Map<number, User | undefined>();
  for (const r of rows) {
    if (!users.has(r.user_id)) users.set(r.user_id, getUser(r.user_id));
    const u = users.get(r.user_id);
    if (!u || !isActive(u) || !u.business_name || !u.review_url) { skipped++; continue; }
    const claim = db.prepare("UPDATE review_requests SET status='sending' WHERE id=? AND status='scheduled'").run(r.id);
    if (claim.changes === 0) { skipped++; continue; }
    const d = await deliver(u, r.id, { name: r.customer_name, email: r.customer_email || "", phone: r.customer_phone || "" }, r.unsubscribe_token);
    if (d.status !== "failed") { emitRequestEvent(u, "request.sent", r.id); sent++; }
  }
  return { due: rows.length, sent, skipped };
}

/** Owner's "Don't ask": cancel a scheduled ask before it sends. */
export function cancelScheduledAsk(userId: number, id: number) {
  const ok = db.prepare("UPDATE review_requests SET status='cancelled', send_at=NULL WHERE id=? AND user_id=? AND status='scheduled'").run(id, userId).changes > 0;
  if (ok) emitRequestEvent(userId, "request.cancelled", id);
  return ok;
}

type DueRow = { id: number; user_id: number; customer_name: string; customer_email: string | null; customer_phone: string | null; unsubscribe_token: string | null };

/** Send day-3 follow-ups that are due. Pass userId to scope to one account. */
export async function processDueReminders(userId?: number, limit = 200) {
  const rows = db.prepare(`SELECT id, user_id, customer_name, customer_email, customer_phone, unsubscribe_token FROM review_requests
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
      let tok = r.unsubscribe_token;
      if (!tok) { tok = crypto.randomBytes(24).toString("base64url"); db.prepare("UPDATE review_requests SET unsubscribe_token=? WHERE id=?").run(tok, r.id); }
      const link = u.review_url;
      if (r.customer_email && !isSuppressed(r.customer_email)) await sendEmail(r.customer_email, buildReminderEmail(u.business_name, r.customer_name, link, unsubscribeUrl(tok)));
      if (r.customer_phone) await sendSms(r.customer_phone, buildReminderSms(u.business_name, r.customer_name, link));
      emitRequestEvent(u, "request.reminded", r.id);
      sent++;
    } catch (e) {
      console.error("reminder failed", e);
      db.prepare("UPDATE review_requests SET reminded_at = NULL, remind_at = NULL, status = 'failed' WHERE id=?").run(r.id);
      failed++;
    }
  }
  return { due: rows.length, sent, failed, skipped };
}
