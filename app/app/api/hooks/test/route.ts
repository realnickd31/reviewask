import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/session";
import { sendReviewRequest } from "@/lib/send";

/** Logged-in "Send a test request": runs the same send path as the Zapier hook, to the owner's own email. */
export async function POST() {
  const u = await currentUser();
  if (!u) return NextResponse.json({ error: "Please log in." }, { status: 401 });
  if (!u.api_token) return NextResponse.json({ error: "Create your secret key first (step 1)." }, { status: 400 });
  const r = await sendReviewRequest(u, { name: "Test Customer", email: u.email }, "test");
  if (!r.ok) return NextResponse.json({ error: r.error }, { status: r.code });
  return NextResponse.json(r);
}

/** Step 4 polling: has a real job-software request (or test) arrived yet? */
export async function GET() {
  const u = await currentUser();
  if (!u) return NextResponse.json({ error: "Please log in." }, { status: 401 });
  const row = db.prepare("SELECT customer_name, source, created_at FROM review_requests WHERE user_id=? AND source IN ('webhook','test') ORDER BY id DESC LIMIT 1").get(u.id);
  return NextResponse.json({ last: row ?? null });
}
