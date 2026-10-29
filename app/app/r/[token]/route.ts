import { recordReviewClick } from "@/lib/db";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ token: string }> };
/** Tracked review link from customer emails/texts: record the click on that ask, then 302 to the owner's Google review URL. */
export async function GET(_req: Request, { params }: Ctx) {
  const { token } = await params;
  let dest: string | null = null;
  try { dest = recordReviewClick(token); } catch (e) { console.error("review click", e); }
  if (!dest) return new Response("This review link is no longer valid.", { status: 404, headers: { "content-type": "text/plain; charset=utf-8" } });
  return new Response(null, { status: 302, headers: { Location: dest, "Cache-Control": "no-store", "Referrer-Policy": "no-referrer" } });
}
// Some link scanners send HEAD; don't count those as clicks.
export async function HEAD() { return new Response(null, { status: 204 }); }
