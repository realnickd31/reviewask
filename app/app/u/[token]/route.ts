import { suppressByToken } from "@/lib/db";

export const dynamic = "force-dynamic";

const page = (ok: boolean) => new Response(`<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Unsubscribe — ReviewAsk</title></head>
<body style="font-family:system-ui,Arial,sans-serif;max-width:520px;margin:64px auto;padding:24px;color:#0b1631">
<h1>${ok ? "You're unsubscribed" : "Link not found"}</h1>
<p>${ok ? "You won't receive any more review request emails sent through ReviewAsk at this address." : "This unsubscribe link is invalid or expired. Email support@getreviewask.com and we'll remove you."}</p>
<p style="font-size:13px;color:#6b7280">Questions? <a href="mailto:support@getreviewask.com">support@getreviewask.com</a></p></body></html>`,
  { status: ok ? 200 : 404, headers: { "content-type": "text/html; charset=utf-8" } });

type Ctx = { params: Promise<{ token: string }> };
export async function GET(_req: Request, { params }: Ctx) { const { token } = await params; return page(!!suppressByToken(token)); }
// RFC 8058 one-click (List-Unsubscribe-Post) sends POST.
export async function POST(_req: Request, { params }: Ctx) { const { token } = await params; return page(!!suppressByToken(token)); }
