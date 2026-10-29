import { legacyReviewUrlForToken } from "@/lib/db";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ token: string }> };
/**
 * Legacy only. New asks link straight to Google; this thin redirect keeps /r/<token> links in
 * already-sent emails/texts working. It records nothing (no click tracking).
 */
export async function GET(_req: Request, { params }: Ctx) {
  const { token } = await params;
  let dest: string | null = null;
  try { dest = legacyReviewUrlForToken(token); } catch (e) { console.error("legacy review link", e); }
  if (!dest) return new Response("This review link is no longer valid.", { status: 404, headers: { "content-type": "text/plain; charset=utf-8" } });
  return new Response(null, { status: 302, headers: { Location: dest, "Cache-Control": "no-store", "Referrer-Policy": "no-referrer" } });
}
export async function HEAD() { return new Response(null, { status: 204 }); }
