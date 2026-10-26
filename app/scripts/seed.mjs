import Database from "better-sqlite3";
import bcrypt from "bcryptjs";
import fs from "fs";
fs.mkdirSync("data", { recursive: true });
const db = new Database((process.env.DATABASE_URL || "file:./data/reviewask.db").replace(/^file:/, ""));
db.exec(`CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL, business_name TEXT, review_url TEXT, stripe_customer_id TEXT, stripe_subscription_id TEXT, subscription_status TEXT NOT NULL DEFAULT 'none', created_at TEXT NOT NULL DEFAULT (datetime('now')));`);
db.prepare("INSERT OR IGNORE INTO users (email,password_hash,business_name,review_url,subscription_status) VALUES (?,?,?,?,?)")
  .run("demo@reviewask.local", bcrypt.hashSync("demo12345", 10), "Demo Plumbing Co.", "https://g.page/r/demo/review", "trialing");
console.log("Seeded demo@reviewask.local / demo12345 (trialing)");
