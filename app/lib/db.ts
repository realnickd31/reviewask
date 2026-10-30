import crypto from "crypto";
import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

// During `next build` the Render persistent disk is not mounted, so use a local
// throwaway DB at build time and the configured DATABASE_URL at runtime.
const isBuild = process.env.NEXT_PHASE === "phase-production-build";
const url = (!isBuild && process.env.DATABASE_URL) || "file:./data/reviewask.db";
const file = path.resolve(process.cwd(), url.replace(/^file:/, ""));
fs.mkdirSync(path.dirname(file), { recursive: true });

const g = globalThis as unknown as { _db?: Database.Database };
export const db = g._db ?? new Database(file);
if (!g._db) {
  db.pragma("journal_mode = WAL");
  db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    business_name TEXT,
    review_url TEXT,
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    subscription_status TEXT NOT NULL DEFAULT 'none',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS review_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id),
    customer_name TEXT NOT NULL,
    customer_email TEXT,
    customer_phone TEXT,
    channel TEXT NOT NULL,
    status TEXT NOT NULL,
    provider_id TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );`);
  // Safe additive migrations for existing databases.
  const addCol = (t: string, c: string) => { try { db.exec(`ALTER TABLE ${t} ADD COLUMN ${c}`); } catch { /* exists */ } };
  addCol("review_requests", "remind_at TEXT");
  addCol("review_requests", "fail_reason TEXT");
  addCol("review_requests", "reminded_at TEXT");
  addCol("review_requests", "source TEXT NOT NULL DEFAULT 'manual'");
  addCol("users", "api_token TEXT");
  addCol("users", "auto_enabled INTEGER NOT NULL DEFAULT 0");
  addCol("users", "auto_provider TEXT");
  addCol("users", "auto_setup_email TEXT");
  addCol("users", "zapier_setup_at TEXT"); // owner started Zapier setup (waiting for first hook)
  addCol("users", "zapier_connected_at TEXT"); // set by first real inbound webhook
  addCol("users", "zapier_disconnected_at TEXT"); // owner hit Disconnect; inbound hooks ignored until they reconnect
  addCol("users", "auto_setup_requested_at TEXT");
  addCol("users", "jobber_connected INTEGER NOT NULL DEFAULT 0");
  addCol("users", "jobber_access_token TEXT");
  addCol("users", "jobber_refresh_token TEXT");
  addCol("users", "jobber_token_expires_at TEXT");
  addCol("users", "jobber_account_id TEXT");
  addCol("users", "housecall_connected INTEGER NOT NULL DEFAULT 0");
  addCol("users", "housecall_api_key TEXT");
  addCol("users", "housecall_company_id TEXT");
  addCol("users", "housecall_webhook_secret TEXT");
  addCol("review_requests", "unsubscribe_token TEXT");
  addCol("review_requests", "send_at TEXT");
  addCol("review_requests", "followup_cancelled_at TEXT"); // set only for status='scheduled' (delayed asks wait so owners can cancel)
  addCol("users", "send_delay_hours INTEGER NOT NULL DEFAULT 2"); // per-account wait for automatic asks (0 = instant)
  addCol("users", "square_connected INTEGER NOT NULL DEFAULT 0");
  addCol("users", "square_access_token TEXT");
  addCol("users", "square_refresh_token TEXT");
  addCol("users", "square_token_expires_at TEXT");
  addCol("users", "square_merchant_id TEXT");
  addCol("users", "stripe_connect_connected INTEGER NOT NULL DEFAULT 0");
  addCol("users", "stripe_connect_account_id TEXT");
  db.exec("CREATE TABLE IF NOT EXISTS stripe_connect_events (object_id TEXT PRIMARY KEY, user_id INTEGER, created_at TEXT NOT NULL DEFAULT (datetime('now')))");
  addCol("users", "qbo_connected INTEGER NOT NULL DEFAULT 0");
  addCol("users", "qbo_access_token TEXT");
  addCol("users", "qbo_refresh_token TEXT");
  addCol("users", "qbo_token_expires_at TEXT");
  addCol("users", "qbo_realm_id TEXT");
  addCol("users", "trial_end TEXT");
  addCol("users", "callback_url TEXT"); // outbound HTTPS callbacks (API v1)
  addCol("users", "callback_secret TEXT");
  addCol("users", "walkthrough_done_at TEXT"); // first-login guided tour seen/skipped (shown once after first post-checkout dashboard)
  db.exec("CREATE TABLE IF NOT EXISTS qbo_events (event_key TEXT PRIMARY KEY, user_id INTEGER, created_at TEXT NOT NULL DEFAULT (datetime('now')))");
  db.exec("CREATE TABLE IF NOT EXISTS square_events (payment_id TEXT PRIMARY KEY, user_id INTEGER, created_at TEXT NOT NULL DEFAULT (datetime('now')))");
  db.exec("CREATE UNIQUE INDEX IF NOT EXISTS idx_rr_unsub ON review_requests(unsubscribe_token)");
  db.exec(`CREATE TABLE IF NOT EXISTS connector_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tool TEXT NOT NULL, website TEXT, notes TEXT, email TEXT, user_id INTEGER NULL, ip TEXT,
    emailed INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`);
  db.exec(`CREATE TABLE IF NOT EXISTS suppressions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL,
    user_id INTEGER NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`);
  db.exec("CREATE UNIQUE INDEX IF NOT EXISTS idx_supp_email ON suppressions(lower(email))");
  db.exec(`CREATE TABLE IF NOT EXISTS sms_suppressions (
    phone TEXT PRIMARY KEY,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`);
  db.exec("CREATE UNIQUE INDEX IF NOT EXISTS idx_users_api_token ON users(api_token)");
  db.exec("CREATE INDEX IF NOT EXISTS idx_rr_remind ON review_requests(remind_at, reminded_at)");
  db.exec("CREATE INDEX IF NOT EXISTS idx_rr_send ON review_requests(status, send_at)");
  db.exec(`CREATE TABLE IF NOT EXISTS analytics_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event TEXT NOT NULL,
    path TEXT,
    referrer TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    utm_content TEXT,
    utm_term TEXT,
    visitor_id TEXT,
    user_id INTEGER,
    meta TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`);
  db.exec("CREATE INDEX IF NOT EXISTS idx_ae_event_created ON analytics_events(event, created_at)");
  db.exec("CREATE INDEX IF NOT EXISTS idx_ae_visitor_created ON analytics_events(visitor_id, created_at)");
  db.exec("CREATE INDEX IF NOT EXISTS idx_ae_path_created ON analytics_events(path, created_at)");
  // One-time analytics reset (2026-10-29): history was polluted by founder/test browsing before
  // internal-traffic exclusion shipped. Wipes ONLY analytics_events; users/asks/billing untouched.
  db.exec("CREATE TABLE IF NOT EXISTS app_migrations (name TEXT PRIMARY KEY, ran_at TEXT NOT NULL DEFAULT (datetime('now')))");
  // INSERT OR IGNORE: next build can init DB from multiple routes in parallel.
  if (!db.prepare("SELECT 1 FROM app_migrations WHERE name='analytics_reset_2026_10_29'").get()) {
    db.transaction(() => {
      db.exec("DELETE FROM analytics_events");
      db.prepare("INSERT OR IGNORE INTO app_migrations (name) VALUES ('analytics_reset_2026_10_29')").run();
    })();
  }
  // Accounts that already got past checkout before the guided tour shipped never see it.
  if (!db.prepare("SELECT 1 FROM app_migrations WHERE name='walkthrough_backfill_2026_10_30'").get()) {
    db.transaction(() => {
      db.exec("UPDATE users SET walkthrough_done_at=datetime('now') WHERE walkthrough_done_at IS NULL AND subscription_status != 'none'");
      db.prepare("INSERT OR IGNORE INTO app_migrations (name) VALUES ('walkthrough_backfill_2026_10_30')").run();
    })();
  }
  // Marks when tracked review links went live; asks sent earlier linked straight to Google (used by the "What they got" preview).
  db.prepare("INSERT OR IGNORE INTO app_migrations (name) VALUES ('review_click_tracking')").run();
  // Marks when the /r/ hop was removed; asks created after this link straight to Google again.
  db.prepare("INSERT OR IGNORE INTO app_migrations (name) VALUES ('review_click_tracking_removed')").run();
  g._db = db;
}

export type User = {
  id: number; email: string; password_hash: string; business_name: string | null; review_url: string | null;
  stripe_customer_id: string | null; stripe_subscription_id: string | null; subscription_status: string; trial_end?: string | null; created_at: string; api_token: string | null;
  auto_enabled: number; auto_provider: string | null; zapier_setup_at?: string | null; zapier_connected_at?: string | null; zapier_disconnected_at?: string | null; auto_setup_email: string | null; auto_setup_requested_at: string | null;
  jobber_connected: number; jobber_access_token: string | null; jobber_refresh_token: string | null;
  jobber_token_expires_at: string | null; jobber_account_id: string | null;
  housecall_connected: number; housecall_api_key: string | null; housecall_company_id: string | null; housecall_webhook_secret: string | null;
  square_connected: number; square_access_token: string | null; square_refresh_token: string | null;
  square_token_expires_at: string | null; square_merchant_id: string | null;
  stripe_connect_connected: number; stripe_connect_account_id: string | null;
  qbo_connected: number; qbo_access_token: string | null; qbo_refresh_token: string | null;
  qbo_token_expires_at: string | null; qbo_realm_id: string | null;
  send_delay_hours: number;
  callback_url?: string | null; callback_secret?: string | null;
  walkthrough_done_at?: string | null;
};
export type ReviewRequest = {
  id: number; user_id: number; customer_name: string; customer_email: string | null; customer_phone: string | null;
  channel: string; status: string; provider_id: string | null; created_at: string;
  remind_at: string | null; reminded_at: string | null; send_at: string | null; followup_cancelled_at?: string | null; fail_reason?: string | null; source: string; unsubscribe_token: string | null;
};

export const MONTHLY_QUOTA = 200;
export const getUser = (id: number) => db.prepare("SELECT * FROM users WHERE id=?").get(id) as User | undefined;
export const getUserByEmail = (e: string) => db.prepare("SELECT * FROM users WHERE email=?").get(e.toLowerCase()) as User | undefined;
export const needsPayment = (u: User) => u.subscription_status === "past_due" || u.subscription_status === "unpaid";
export const isActive = (u: User) => u.subscription_status === "active" || u.subscription_status === "trialing";
export function usedThisMonth(userId: number) {
  const r = db.prepare("SELECT COUNT(*) c FROM review_requests WHERE user_id=? AND status != 'cancelled' AND created_at >= datetime('now','start of month')").get(userId) as { c: number };
  return r.c;
}
export const newApiToken = () => "ra_" + crypto.randomBytes(24).toString("hex");
/** Every account has an API key. Mints one only if missing; never replaces an existing key. */
export function ensureApiToken(userId: number): string {
  const row = db.prepare("SELECT api_token FROM users WHERE id=?").get(userId) as { api_token: string | null } | undefined;
  if (row?.api_token) return row.api_token;
  const t = newApiToken();
  db.prepare("UPDATE users SET api_token=? WHERE id=? AND (api_token IS NULL OR api_token='')").run(t, userId);
  return (db.prepare("SELECT api_token FROM users WHERE id=?").get(userId) as { api_token: string }).api_token;
}
export const getUserByToken = (t: string) => db.prepare("SELECT * FROM users WHERE api_token=?").get(t) as User | undefined;

export const isSuppressed = (email: string) => !!db.prepare("SELECT 1 FROM suppressions WHERE lower(email)=lower(?)").get(email);
export const isPhoneSuppressed = (e164: string) => !!db.prepare("SELECT 1 FROM sms_suppressions WHERE phone=?").get(e164);
export const suppressPhone = (e164: string) => { db.prepare("INSERT OR IGNORE INTO sms_suppressions (phone) VALUES (?)").run(e164); };
export const unsuppressPhone = (e164: string) => { db.prepare("DELETE FROM sms_suppressions WHERE phone=?").run(e164); };
export function suppressByToken(token: string): { email: string } | null {
  const r = db.prepare("SELECT customer_email, user_id FROM review_requests WHERE unsubscribe_token=?").get(token) as { customer_email: string | null; user_id: number } | undefined;
  if (!r?.customer_email) return null;
  db.prepare("INSERT OR IGNORE INTO suppressions (email, user_id) VALUES (lower(?), ?)").run(r.customer_email, r.user_id);
  return { email: r.customer_email };
}
export const appUrl = () => (process.env.APP_URL || "https://getreviewask.com").replace(/\/$/, "");
export const unsubscribeUrl = (token: string) => `${appUrl()}/u/${token}`;
/** Legacy only: resolve an old /r/<token> link (sent before the hop was removed) to the owner's review URL. No click is recorded. */
export function legacyReviewUrlForToken(token: string): string | null {
  const r = db.prepare("SELECT u.review_url FROM review_requests rr JOIN users u ON u.id = rr.user_id WHERE rr.unsubscribe_token=?").get(token) as { review_url: string | null } | undefined;
  return r?.review_url || null;
}

/** Window (UTC, sqlite datetime) when first asks went out via the /r/ hop. Outside it, asks linked straight to Google. Used only by the "What they got" preview. */
export function legacyTrackedWindow(): { from: string | null; to: string | null } {
  const at = (n: string) => (db.prepare("SELECT ran_at FROM app_migrations WHERE name=?").get(n) as { ran_at: string } | undefined)?.ran_at ?? null;
  return { from: at("review_click_tracking"), to: at("review_click_tracking_removed") };
}
