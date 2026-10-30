import { getUser, type User } from "./db";
import { getRequest, publicRequest } from "./apiRequests";
import { signPayload } from "./webhooks";

export type NotifyEvent =
  | "request.created"
  | "request.sent"
  | "request.reminded"
  | "request.cancelled"
  | "followup.cancelled";

/** Fire-and-forget outbound HTTPS callback for API customers. */
export function emitRequestEvent(user: User | number, type: NotifyEvent, requestId: number) {
  const u = typeof user === "number" ? getUser(user) : user;
  if (!u) return;
  const url = (u as User & { callback_url?: string | null }).callback_url;
  const secret = (u as User & { callback_secret?: string | null }).callback_secret;
  if (!url || !secret) return;
  const row = getRequest(u.id, requestId);
  if (!row) return;
  const payload = {
    id: `evt_${Date.now().toString(36)}_${requestId}`,
    type,
    created: Math.floor(Date.now() / 1000),
    data: publicRequest(row),
  };
  const body = JSON.stringify(payload);
  const sig = signPayload(secret, body);
  void fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "ReviewAsk-Callbacks/1.0",
      "X-ReviewAsk-Signature": sig,
      "X-ReviewAsk-Event": type,
    },
    body,
    signal: AbortSignal.timeout(8_000),
  }).catch((e) => console.error("callback delivery failed", type, requestId, e));
}
