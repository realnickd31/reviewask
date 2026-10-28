import { redirect } from "next/navigation";
import { currentUser } from "./session";
import type { User } from "./db";

const DEFAULT_ADMINS = ["nd310901@gmail.com"];

export function adminEmails(): string[] {
  const raw = process.env.ADMIN_EMAILS;
  if (!raw || !raw.trim()) return DEFAULT_ADMINS;
  return raw.split(",").map((e) => e.trim().toLowerCase()).filter(Boolean);
}

export function isAdminEmail(email: string | null | undefined) {
  if (!email) return false;
  return adminEmails().includes(email.trim().toLowerCase());
}

export function isAdminUser(u: User | null | undefined) {
  return !!u && isAdminEmail(u.email);
}

export async function requireAdmin() {
  const u = await currentUser();
  if (!u) redirect("/login?next=/admin");
  if (!isAdminUser(u)) redirect("/dashboard");
  return u;
}
