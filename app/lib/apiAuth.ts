import { NextRequest, NextResponse } from "next/server";
import { getUserByToken, isActive, needsPayment, type User } from "./db";
import { currentUser } from "./session";

export function jsonError(error: string, status: number) {
  return NextResponse.json({ error }, { status });
}

export function readApiToken(req: NextRequest) {
  const auth = req.headers.get("authorization") || "";
  if (auth.startsWith("Bearer ")) return auth.slice(7).trim();
  return (req.headers.get("x-api-token") || "").trim();
}

export function requireApiUser(req: NextRequest): User | NextResponse {
  const token = readApiToken(req);
  const u = token ? getUserByToken(token) : undefined;
  if (!u) return jsonError("Invalid or missing API token.", 401);
  if (!isActive(u)) return jsonError(inactiveMsg(u), 402);
  return u;
}

export async function requireApiOrSession(req: NextRequest): Promise<User | NextResponse> {
  const token = readApiToken(req);
  if (token) return requireApiUser(req);
  const u = await currentUser();
  if (!u) return jsonError("Please log in or provide an API token.", 401);
  if (!isActive(u)) return jsonError(inactiveMsg(u), 402);
  return u;
}

export async function readJson(req: NextRequest) {
  return (await req.json().catch(() => ({}))) as Record<string, unknown>;
}


/** Session writes from Settings must be same-origin. */
export function requireSameOrigin(req: NextRequest): NextResponse | null {
  const origin = req.headers.get("origin");
  if (!origin) return null;
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "";
  const proto = req.headers.get("x-forwarded-proto") || "https";
  const expected = `${proto}://${host}`.replace(/\/$/, "");
  try {
    if (new URL(origin).origin !== new URL(expected).origin) {
      return jsonError("Cross-origin session writes are not allowed.", 403);
    }
  } catch {
    return jsonError("Invalid origin.", 403);
  }
  return null;
}

function inactiveMsg(u: User) { return needsPayment(u) ? "Your last payment didn’t go through. Update your card in Settings → Billing to resume API access." : u.subscription_status === "canceled" ? "Your plan is canceled. Resubscribe in Settings → Billing to use the API." : "Start your free trial to use the API."; }
