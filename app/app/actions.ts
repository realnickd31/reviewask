"use server";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
// A pending Jobber Marketplace connect (parked by /api/jobber/callback) resumes right after login/signup.
const jobberResume = () => cookies().get("jb_mkt_code") ? "/api/jobber/callback?resume=1" : null;
import { db, getUserByEmail } from "@/lib/db";
import { getSession, requireUser } from "@/lib/session";

export type FormState = { error?: string; ok?: string } | undefined;
const validUrl = (s: string) => { try { const u = new URL(s); return u.protocol === "https:" || u.protocol === "http:"; } catch { return false; } };

export async function signup(_: FormState, fd: FormData): Promise<FormState> {
  const email = String(fd.get("email") || "").trim().toLowerCase();
  const password = String(fd.get("password") || "");
  if (!/^\S+@\S+\.\S+$/.test(email)) return { error: "Enter a valid email." };
  if (password.length < 8) return { error: "Password must be at least 8 characters." };
  if (getUserByEmail(email)) return { error: "An account with that email already exists. Log in instead." };
  const r = db.prepare("INSERT INTO users (email, password_hash) VALUES (?, ?)").run(email, await bcrypt.hash(password, 10));
  const s = await getSession(); s.userId = Number(r.lastInsertRowid); await s.save();
  redirect(jobberResume() || "/onboarding");
}

export async function login(_: FormState, fd: FormData): Promise<FormState> {
  const u = getUserByEmail(String(fd.get("email") || "").trim());
  if (!u || !(await bcrypt.compare(String(fd.get("password") || ""), u.password_hash))) return { error: "Wrong email or password." };
  const s = await getSession(); s.userId = u.id; await s.save();
  redirect(jobberResume() || (u.business_name ? "/dashboard" : "/onboarding"));
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
  redirect(u.subscription_status === "active" || u.subscription_status === "trialing" ? "/dashboard" : "/onboarding?step=pay");
}

export async function saveSettings(_: FormState, fd: FormData): Promise<FormState> {
  const u = await requireUser(); const b = readBiz(fd);
  if ("error" in b) return b;
  db.prepare("UPDATE users SET business_name=?, review_url=? WHERE id=?").run(b.name, b.url, u.id);
  return { ok: "Saved." };
}
