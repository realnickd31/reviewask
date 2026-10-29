// Google rating + review-count snapshots, so owners can watch their review count climb while using ReviewAsk.
// Uses Google Places API (New) Place Details with a field mask of rating,userRatingCount (cheap "Pro" SKU).
// Needs GOOGLE_PLACES_API_KEY (falls back to GOOGLE_MAPS_API_KEY). Without a key, everything here is a no-op.
import { db } from "@/lib/db";
import { extractPlaceId, SHORT_LINK } from "@/lib/placeId";

db.exec(`CREATE TABLE IF NOT EXISTS review_snapshots (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id),
  place_id TEXT NOT NULL,
  rating REAL,
  review_count INTEGER,
  reason TEXT NOT NULL DEFAULT 'cron',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
)`);
db.exec("CREATE INDEX IF NOT EXISTS idx_review_snapshots_user ON review_snapshots(user_id, created_at)");
try { db.exec("ALTER TABLE users ADD COLUMN place_id TEXT"); } catch { /* exists */ }

export type Snapshot = { rating: number | null; review_count: number | null; created_at: string; place_id: string };
const apiKey = () => process.env.GOOGLE_PLACES_API_KEY || process.env.GOOGLE_MAPS_API_KEY || "";
export const placesConfigured = () => !!apiKey();

const ALLOWED = /(^|\.)(goo\.gl|g\.page|g\.co|share\.google|google\.[a-z.]+)$/i;
/** Place ID from a review link, following Google short/share links server-side if needed. */
export async function resolvePlaceId(reviewUrl: string): Promise<string | null> {
  const direct = extractPlaceId(reviewUrl); if (direct) return direct;
  let url = reviewUrl.trim(); if (!/^https?:\/\//i.test(url)) url = "https://" + url;
  if (!SHORT_LINK.test(url) && !/google\./i.test(url)) return null;
  try {
    for (let i = 0; i < 6; i++) {
      if (!ALLOWED.test(new URL(url).hostname)) return null;
      const pid = extractPlaceId(url); if (pid) return pid;
      const r = await fetch(url, { redirect: "manual", headers: { "User-Agent": "Mozilla/5.0 (compatible; ReviewAsk)", "Accept-Language": "en" }, signal: AbortSignal.timeout(6000) });
      const loc = r.headers.get("location");
      if (loc) { url = new URL(loc, url).toString(); continue; }
      const html = (await r.text()).slice(0, 600000);
      return extractPlaceId(html.replace(/\\u003d/g, "=").replace(/\\u0026/g, "&"));
    }
  } catch { /* unresolvable */ }
  return null;
}

export async function fetchPlaceStats(placeId: string): Promise<{ rating: number | null; review_count: number | null } | null> {
  const key = apiKey(); if (!key) return null;
  try {
    const r = await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`, {
      headers: { "X-Goog-Api-Key": key, "X-Goog-FieldMask": "rating,userRatingCount" }, signal: AbortSignal.timeout(8000),
    });
    if (!r.ok) { console.error("places", r.status, (await r.text()).slice(0, 300)); return null; }
    const j = await r.json() as { rating?: number; userRatingCount?: number };
    return { rating: j.rating ?? null, review_count: j.userRatingCount ?? 0 };
  } catch (e) { console.error("places", e); return null; }
}

/** Take a snapshot for one user. `reason`: 'link_saved' | 'cron'. Skips if the cron already ran today for this place. */
export async function snapshotUser(userId: number, reason: "link_saved" | "cron" = "cron"): Promise<boolean> {
  if (!placesConfigured()) return false;
  const u = db.prepare("SELECT id, review_url, place_id FROM users WHERE id=?").get(userId) as { id: number; review_url: string | null; place_id: string | null } | undefined;
  if (!u?.review_url) return false;
  let pid = u.place_id;
  if (reason === "link_saved" || !pid) {
    pid = await resolvePlaceId(u.review_url);
    db.prepare("UPDATE users SET place_id=? WHERE id=?").run(pid, u.id);
  }
  if (!pid) return false;
  if (reason === "cron" && db.prepare("SELECT 1 FROM review_snapshots WHERE user_id=? AND place_id=? AND created_at >= datetime('now','-20 hours')").get(u.id, pid)) return false;
  const s = await fetchPlaceStats(pid); if (!s) return false;
  db.prepare("INSERT INTO review_snapshots (user_id, place_id, rating, review_count, reason) VALUES (?,?,?,?,?)").run(u.id, pid, s.rating, s.review_count, reason);
  return true;
}

/** Daily cron: snapshot every account with a review link that's active or trialing. */
export async function snapshotAll(limit = 500): Promise<{ snapshotted: number; skipped: number; configured: boolean }> {
  if (!placesConfigured()) return { snapshotted: 0, skipped: 0, configured: false };
  const ids = db.prepare("SELECT id FROM users WHERE review_url IS NOT NULL AND review_url != '' AND subscription_status IN ('active','trialing') ORDER BY id LIMIT ?").all(limit) as { id: number }[];
  let n = 0;
  for (const { id } of ids) { if (await snapshotUser(id, "cron")) n++; }
  return { snapshotted: n, skipped: ids.length - n, configured: true };
}

/** Baseline = first snapshot for the user's current place; latest = most recent. */
export function reviewProgress(userId: number): { first: Snapshot; latest: Snapshot; history: Snapshot[] } | null {
  const u = db.prepare("SELECT place_id FROM users WHERE id=?").get(userId) as { place_id: string | null } | undefined;
  if (!u?.place_id) return null;
  const history = db.prepare("SELECT rating, review_count, created_at, place_id FROM review_snapshots WHERE user_id=? AND place_id=? ORDER BY created_at, id").all(userId, u.place_id) as Snapshot[];
  if (!history.length) return null;
  return { first: history[0], latest: history[history.length - 1], history };
}
