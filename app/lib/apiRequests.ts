import { db, type ReviewRequest } from "./db";

const iso = (v: string | null | undefined) => (v ? new Date(v.includes("T") ? v : v.replace(" ", "T") + "Z").toISOString() : null);

export type PublicRequest = ReturnType<typeof publicRequest>;
/** The only fields the API ever returns (no unsubscribe tokens or provider ids). */
export function publicRequest(r: ReviewRequest) {
  return {
    id: r.id, object: "review_request" as const,
    customer_name: r.customer_name, customer_email: r.customer_email, customer_phone: r.customer_phone,
    channel: r.channel, status: r.status, source: r.source,
    created_at: iso(r.created_at), send_at: iso(r.send_at), follow_up_at: iso(r.remind_at),
    followed_up_at: iso(r.reminded_at), follow_up_cancelled_at: iso(r.followup_cancelled_at ?? null),
  };
}
export const getRequest = (userId: number, id: number) =>
  db.prepare("SELECT * FROM review_requests WHERE id=? AND user_id=?").get(id, userId) as ReviewRequest | undefined;
