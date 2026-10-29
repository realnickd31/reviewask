export const DEFAULT_ADMINS = ["nd310901@gmail.com"];

export function adminEmails(): string[] {
  const raw = process.env.ADMIN_EMAILS;
  if (!raw || !raw.trim()) return DEFAULT_ADMINS;
  return raw.split(",").map((e) => e.trim().toLowerCase()).filter(Boolean);
}

export function isAdminEmail(email: string | null | undefined) {
  if (!email) return false;
  return adminEmails().includes(email.trim().toLowerCase());
}


// Accounts whose activity never counts toward analytics metrics.
// Superset of admins + internal/test accounts. Does NOT grant admin access.
export const METRICS_EXEMPT_EXTRA = [
  "nd310901@gmail.com",
  "test1234@gmail.com",
  "jobber-review@getreviewask.com", // Jobber App Review test account
];

export function metricsExcludeEmails(): string[] {
  const env = (process.env.METRICS_EXCLUDE_EMAILS || "").split(",").map((e) => e.trim().toLowerCase()).filter(Boolean);
  return Array.from(new Set([...adminEmails(), ...METRICS_EXEMPT_EXTRA, ...env]));
}

export function isMetricsExemptEmail(email: string | null | undefined) {
  if (!email) return false;
  return metricsExcludeEmails().includes(email.trim().toLowerCase());
}

// Persistent marker for founder/test browsers; collect route drops all events carrying it.
export const INTERNAL_COOKIE = "ra_internal";
export const INTERNAL_COOKIE_OPTS = {
  path: "/",
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  maxAge: 60 * 60 * 24 * 365 * 5,
};
