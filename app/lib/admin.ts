import { redirect } from "next/navigation";
import { currentUser } from "./session";
import type { User } from "./db";

import { adminEmails, isAdminEmail } from "./admin-emails";
export { adminEmails, isAdminEmail };

export function isAdminUser(u: User | null | undefined) {
  return !!u && isAdminEmail(u.email);
}

export async function requireAdmin() {
  const u = await currentUser();
  if (!u) redirect("/login?next=/admin");
  if (!isAdminUser(u)) redirect("/dashboard");
  return u;
}
