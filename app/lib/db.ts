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
  addCol("review_requests", "reminded_at TEXT");
  addCol("review_requests", "source TEXT NOT NULL DEFAULT 'manual'");
  addCol("users", "api_token TEXT");
  addCol("users", "auto_enabled INTEGER NOT NULL DEFAULT 0");
  addCol("users", "auto_provider TEXT");
  addCol("users", "auto_setup_email TEXT");
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
  db.exec("CREATE UNIQUE INDEX IF NOT EXISTS idx_users_api_token ON users(api_token)");
  db.exec("CREATE INDEX IF NOT EXISTS idx_rr_remind ON review_requests(remind_at, reminded_at)");
  g._db = db;
}

export type User = {
  id: number; email: string; password_hash: string; business_name: string | null; review_url: string | null;
  stripe_customer_id: string | null; stripe_subscription_id: string | null; subscription_status: string; created_at: string; api_token: string | null;
  auto_enabled: number; auto_provider: string | null; auto_setup_email: string | null; auto_setup_requested_at: string | null;
  jobber_connected: number; jobber_access_token: string | null; jobber_refresh_token: string | null;
  jobber_token_expires_at: string | null; jobber_account_id: string | null;
  housecall_connected: number; housecall_api_key: string | null; housecall_company_id: string | null; housecall_webhook_secret: string | null;
};
export type ReviewRequest = {
  id: number; user_id: number; customer_name: string; customer_email: string | null; customer_phone: string | null;
  channel: string; status: string; provider_id: string | null; created_at: string;
  remind_at: string | null; reminded_at: string | null; source: string;
};

export const MONTHLY_QUOTA = 200;
export const getUser = (id: number) => db.prepare("SELECT * FROM users WHERE id=?").get(id) as User | undefined;
export const getUserByEmail = (e: string) => db.prepare("SELECT * FROM users WHERE email=?").get(e.toLowerCase()) as User | undefined;
export const isActive = (u: User) => u.subscription_status === "active" || u.subscription_status === "trialing";
export function usedThisMonth(userId: number) {
  const r = db.prepare("SELECT COUNT(*) c FROM review_requests WHERE user_id=? AND created_at >= datetime('now','start of month')").get(userId) as { c: number };
  return r.c;
}
export const getUserByToken = (t: string) => db.prepare("SELECT * FROM users WHERE api_token=?").get(t) as User | undefined;
