"use server";
import { snapshotUser } from "@/lib/reviewStats";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
// A pending Jobber Marketplace connect (parked by /api/jobber/callback) resumes right after login/signup.
const jobberResume = () => cookies().get("jb_mkt_code") ? "/api/jobber/callback?resume=1" : null;
import { db, getUserByEmail } from "@/lib/db";
import { getSession, requireUser } from "@/lib/session";
import { trackServer } from "@/lib/analytics";
import { isAdminEmail } from "@/lib/admin";
import { isMetricsExemptEmail, INTERNAL_COOKIE, INTERNAL_COOKIE_OPTS } from "@/lib/admin-emails";

export type FormState = { error?: string; ok?: string } | undefined;
const validUrl = (s: string) => { try { const u = new URL(s); return u.protocol === "https:" || u.protocol === "http:"; } catch { return false; } };

export async function signup(_: FormState, fd: FormData): Promise<FormState> {
  const email = String(fd.get("email") || "").trim().toLowerCase();
  const password = String(fd.get("password") || "");
  if (!/^\S+@\S+\.\S+$/.test(email)) return { error: "Enter a valid email." };
  if (password.length < 8) return { error: "Password must be at least 8 characters." };
  if (getUserByEmail(email)) return { error: "An account with that email already exists. Log in instead." };
  const r = db.prepare("INSERT INTO users (email, password_hash) VALUES (?, ?)").run(email, await bcrypt.hash(password, 10));
  const userId = Number(r.lastInsertRowid);
  const s = await getSession(); s.userId = userId; await s.save();
  trackServer({ event: "signup", user_id: userId, path: "/signup" });
  redirect(jobberResume() || "/onboarding");
}

export async function login(_: FormState, fd: FormData): Promise<FormState> {
  const u = getUserByEmail(String(fd.get("email") || "").trim());
  if (!u || !(await bcrypt.compare(String(fd.get("password") || ""), u.password_hash))) return { error: "Wrong email or password." };
  const s = await getSession(); s.userId = u.id; await s.save();
  if (isMetricsExemptEmail(u.email)) cookies().set(INTERNAL_COOKIE, "1", INTERNAL_COOKIE_OPTS);
  redirect(jobberResume() || (isAdminEmail(u.email) ? "/admin" : u.business_name ? "/dashboard" : "/onboarding"));
}

export async function logout() {
  const s = await getSession(); s.destroy(); redirect("/");
}

function readBiz(fd: FormData) {
  const name = String(fd.get("business_name") || "").trim();
  const url = String(fd.get("review_url") || "").trim();
  if (!name) return { error: "Business name is required." };
  if (!validUrl(url)) return { error: "Enter a full review link starting with https://" };
  return { name, url };
}

export async function saveOnboarding(_: FormState, fd: FormData): Promise<FormState> {
  const u = await requireUser(); const b = readBiz(fd);
  if ("error" in b) return b;
  db.prepare("UPDATE users SET business_name=?, review_url=? WHERE id=?").run(b.name, b.url, u.id);
  if (b.url !== u.review_url) await snapshotUser(u.id, "link_saved").catch((e) => console.error("snapshot", e));
  trackServer({ event: "onboarding_completed", user_id: u.id, path: "/onboarding" });
  redirect(u.subscription_status === "active" || u.subscription_status === "trialing" ? "/dashboard" : "/onboarding?step=pay");
}

export async function saveSettings(_: FormState, fd: FormData): Promise<FormState> {
  const u = await requireUser(); const b = readBiz(fd);
  if ("error" in b) return b;
  db.prepare("UPDATE users SET business_name=?, review_url=? WHERE id=?").run(b.name, b.url, u.id);
  if (b.url !== u.review_url) await snapshotUser(u.id, "link_saved").catch((e) => console.error("snapshot", e));
  return { ok: "Saved." };
}

export async function saveSendDelay(hours: number): Promise<{ ok?: string; error?: string }> {
  const u = await requireUser();
  const { clampDelay } = await import("@/lib/delay");
  const h = clampDelay(hours, -1);
  if (h < 0) return { error: "Pick a delay." };
  db.prepare("UPDATE users SET send_delay_hours=? WHERE id=?").run(h, u.id);
  const { revalidatePath } = await import("next/cache");
  revalidatePath("/dashboard"); revalidatePath("/settings");
  return { ok: "Saved." };
}

export async function dontAsk(fd: FormData) {
  const u = await requireUser();
  const { cancelScheduledAsk } = await import("@/lib/send");
  cancelScheduledAsk(u.id, Number(fd.get("id")));
  const { revalidatePath } = await import("next/cache");
  revalidatePath("/dashboard");
}

export async function cancelFollowUp(fd: FormData) {
  const u = await requireUser();
  const { db } = await import("@/lib/db");
  const id = Number(fd.get("id"));
  const ch = db.prepare("UPDATE review_requests SET remind_at = NULL, followup_cancelled_at = datetime('now') WHERE id=? AND user_id=? AND reminded_at IS NULL").run(id, u.id);
  if (ch.changes > 0) {
    const { emitRequestEvent } = await import("@/lib/notifyOutbox");
    emitRequestEvent(u.id, "followup.cancelled", id);
  }
  const { revalidatePath } = await import("next/cache");
  revalidatePath("/dashboard");
}
