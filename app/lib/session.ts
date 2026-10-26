import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getUser } from "./db";

type S = { userId?: number };
const password = process.env.NEXTAUTH_SECRET && process.env.NEXTAUTH_SECRET.length >= 32
  ? process.env.NEXTAUTH_SECRET : "dev-only-insecure-secret-change-me-please-32+chars";

export const getSession = () => getIronSession<S>(cookies(), {
  password, cookieName: "reviewask_session",
  ttl: 60 * 60 * 24 * 30,
  cookieOptions: { path: "/", secure: process.env.NODE_ENV === "production", httpOnly: true, sameSite: "lax", maxAge: 60 * 60 * 24 * 30 - 60 },
});
export async function currentUser() {
  const s = await getSession();
  return s.userId ? getUser(s.userId) : undefined;
}
export async function requireUser() {
  const u = await currentUser();
  if (!u) redirect("/login");
  return u;
}
