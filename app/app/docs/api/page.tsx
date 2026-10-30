import type { Metadata } from "next";
import Link from "next/link";
import Logo from "@/components/Logo";

export const metadata: Metadata = {
  title: { absolute: "API Reference · ReviewAsk" },
  description: "ReviewAsk REST API reference: authentication, review requests, callbacks with HMAC signatures, and the OpenAPI spec.",
  alternates: { canonical: "/docs/api" },
};

const BASE = "https://getreviewask.com/api/v1";
const M: Record<string, string> = { GET: "bg-sky-100 text-sky-800", POST: "bg-emerald-100 text-emerald-800", PATCH: "bg-amber-100 text-amber-800", PUT: "bg-violet-100 text-violet-800", DELETE: "bg-rose-100 text-rose-800" };

const reqObj = `{
  "id": 4821,
  "object": "review_request",
  "customer_name": "Alex Rivera",
  "customer_email": "alex@example.com",
  "customer_phone": null,
  "channel": "email",
  "status": "scheduled",
  "source": "api",
  "created_at": "2026-10-29T18:02:11Z",
  "send_at": "2026-10-29T20:02:11Z",
  "follow_up_at": null,
  "followed_up_at": null,
  "follow_up_cancelled_at": null
}`;

type Ep = { id: string; method: string; path: string; title: string; desc: React.ReactNode; params?: [string, string, string][]; req?: string; res: string };
const ENDPOINTS: { group: string; items: Ep[] }[] = [
  { group: "Account", items: [
    { id: "get-account", method: "GET", path: "/account", title: "Retrieve account", desc: "Business name, plan status, and this month's usage against your quota.", req: `curl ${BASE}/account \\\n  -H "Authorization: Bearer $REVIEWASK_KEY"`, res: `{
  "object": "account",
  "business_name": "Rivera Plumbing",
  "review_url_set": true,
  "subscription_status": "active",
  "used_this_month": 37,
  "monthly_quota": 200,
  "send_delay_hours": 2,
  "callback_url_set": true
}` },
  ] },
  { group: "Review requests", items: [
    { id: "create-request", method: "POST", path: "/requests", title: "Create a request", desc: "Queue a review ask for one customer. Provide an email, a phone, or both.", params: [["name", "string · required", "Customer's name, used in the greeting."], ["email", "string", "Customer email address."], ["phone", "string", "Mobile number for SMS (E.164 preferred)."], ["delay_hours", "integer", "Hours to wait before sending. 0 sends now. Defaults to your account delay."]], req: `curl -X POST ${BASE}/requests \\\n  -H "Authorization: Bearer $REVIEWASK_KEY" \\\n  -H "Content-Type: application/json" \\\n  -d '{"name":"Alex Rivera","email":"alex@example.com","delay_hours":2}'`, res: `{\n  "ok": true,\n  "id": 4821,\n  "mode": "scheduled",\n  "used": 38,\n  "quota": 200,\n  "data": { "object": "review_request", "id": 4821, "status": "scheduled", … }\n}` },
    { id: "list-requests", method: "GET", path: "/requests", title: "List requests", desc: "Newest first, cursor-paginated.", params: [["limit", "integer", "1–100. Default 50."], ["cursor", "integer", "Pass next_cursor from the previous page."], ["status", "string", "Filter by status (see Statuses)."]], req: `curl "${BASE}/requests?limit=10&status=sent" \\\n  -H "Authorization: Bearer $REVIEWASK_KEY"`, res: `{\n  "data": [ { "object": "review_request", "id": 4821, … } ],\n  "next_cursor": 4811\n}` },
    { id: "get-request", method: "GET", path: "/requests/{id}", title: "Retrieve a request", desc: "Fetch a single review request by id.", req: `curl ${BASE}/requests/4821 \\\n  -H "Authorization: Bearer $REVIEWASK_KEY"`, res: `{\n  "data": ${reqObj.replace(/\n/g, "\n  ")}\n}` },
    { id: "update-request", method: "PATCH", path: "/requests/{id}", title: "Update a request", desc: <>Only <code>scheduled</code> requests can be edited. Accepts <code>name</code>, <code>email</code>, <code>phone</code>, <code>delay_hours</code>.</>, req: `curl -X PATCH ${BASE}/requests/4821 \\\n  -H "Authorization: Bearer $REVIEWASK_KEY" \\\n  -H "Content-Type: application/json" \\\n  -d '{"delay_hours":24}'`, res: `{\n  "data": { "id": 4821, "status": "scheduled", "send_at": "2026-10-30T18:02:11Z", … }\n}` },
    { id: "cancel-request", method: "DELETE", path: "/requests/{id}", title: "Cancel a request", desc: "Cancels a scheduled ask. On an already-sent ask, cancels the pending day-3 follow-up.", req: `curl -X DELETE ${BASE}/requests/4821 \\\n  -H "Authorization: Bearer $REVIEWASK_KEY"`, res: `{ "ok": true, "action": "cancelled_ask" }\n// or: { "ok": true, "action": "cancelled_followup" }` },
  ] },
  { group: "Callbacks", items: [
    { id: "put-endpoint", method: "PUT", path: "/endpoints", title: "Set callback URL", desc: "Save the HTTPS URL we POST events to. The signing secret is returned only when first created or rotated — store it.", params: [["url", "string · required", "HTTPS URL that accepts POST."]], req: `curl -X PUT ${BASE}/endpoints \\\n  -H "Authorization: Bearer $REVIEWASK_KEY" \\\n  -H "Content-Type: application/json" \\\n  -d '{"url":"https://example.com/hooks/reviewask"}'`, res: `{\n  "ok": true,\n  "url": "https://example.com/hooks/reviewask",\n  "secret": "whsec_3f9a…"\n}` },
    { id: "get-endpoint", method: "GET", path: "/endpoints", title: "Retrieve callback URL", desc: "Current URL and whether a secret is set. The secret itself is never returned.", req: `curl ${BASE}/endpoints \\\n  -H "Authorization: Bearer $REVIEWASK_KEY"`, res: `{ "url": "https://example.com/hooks/reviewask", "secret_set": true }` },
    { id: "delete-endpoint", method: "DELETE", path: "/endpoints", title: "Remove callback URL", desc: "Stop sending events.", req: `curl -X DELETE ${BASE}/endpoints \\\n  -H "Authorization: Bearer $REVIEWASK_KEY"`, res: `{ "ok": true }` },
  ] },
  { group: "Keys", items: [
    { id: "rotate-key", method: "POST", path: "/keys", title: "Create or rotate key", desc: "Issues a new key and invalidates the old one. The key is shared with Zapier — rotating breaks an existing Zap until you paste the new key.", req: `curl -X POST ${BASE}/keys \\\n  -H "Authorization: Bearer $REVIEWASK_KEY"`, res: `{ "ok": true, "token": "ra_7c1e…" }` },
    { id: "delete-key", method: "DELETE", path: "/keys", title: "Revoke key", desc: "Clears the key. All API and Zapier calls return 401 until a new one is created.", req: `curl -X DELETE ${BASE}/keys \\\n  -H "Authorization: Bearer $REVIEWASK_KEY"`, res: `{ "ok": true }` },
  ] },
];

const Badge = ({ m }: { m: string }) => <span className={`inline-flex w-14 shrink-0 justify-center rounded px-1.5 py-0.5 font-mono text-[11px] font-bold ${M[m]}`}>{m}</span>;
const Code = ({ label, children }: { label: string; children: string }) => <div className="overflow-hidden rounded-lg bg-[#0b1220] ring-1 ring-white/10">
  <div className="flex items-center justify-between border-b border-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400"><span>{label}</span><span className="flex gap-1.5"><i className="h-2 w-2 rounded-full bg-slate-600" /><i className="h-2 w-2 rounded-full bg-slate-600" /><i className="h-2 w-2 rounded-full bg-slate-600" /></span></div>
  <pre className="overflow-x-auto p-4 font-mono text-[12.5px] leading-relaxed text-slate-100">{children}</pre></div>;
const H = ({ id, children }: { id: string; children: React.ReactNode }) => <h2 id={id} className="scroll-mt-20 text-2xl font-bold tracking-tight text-navy-900">{children}</h2>;
const ic = "rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[13px] text-navy-900";

export default function ApiDocsPage() {
  const nav: [string, [string, string, string?][]][] = [
    ["Getting started", [["introduction", "Introduction"], ["authentication", "Authentication"], ["errors", "Errors"], ["statuses", "Statuses"]]],
    ...ENDPOINTS.map((g) => [g.group, g.items.map((e) => [e.id, e.title, e.method])] as [string, [string, string, string?][]]),
    ["Webhooks", [["webhooks", "Events & payload"], ["signatures", "Verifying signatures"]]],
    ["More", [["zapier", "Zapier / Make"], ["openapi", "OpenAPI spec"]]],
  ];
  return <div className="min-h-screen bg-white text-[15px] text-slate-700">
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-4 px-4">
        <Logo dark /><span className="hidden rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600 sm:inline">API Reference</span>
        <span className="hidden rounded-full bg-emerald-50 px-2 py-0.5 font-mono text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-200 sm:inline">v1</span>
        <nav className="ml-auto flex items-center gap-4 text-sm"><a href="/openapi.json" className="hidden text-slate-600 hover:text-navy-900 sm:inline">openapi.json</a><Link href="/settings#api" className="text-slate-600 hover:text-navy-900">Get your API key</Link><Link href="/dashboard" className="btn-navy px-3 py-1.5">Dashboard</Link></nav>
      </div>
    </header>
    <div className="mx-auto flex max-w-7xl">
      <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-64 shrink-0 overflow-y-auto border-r border-slate-200 px-4 py-6 lg:block">
        {nav.map(([g, items]) => <div key={g} className="mb-5"><p className="mb-1.5 px-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">{g}</p>
          <ul>{items.map(([id, t, m]) => <li key={id}><a href={`#${id}`} className="flex items-center gap-2 rounded-md px-2 py-1 text-sm text-slate-700 hover:bg-slate-100 hover:text-navy-900">{m && <span className={`w-11 font-mono text-[10px] font-bold ${M[m].split(" ")[1]}`}>{m}</span>}{t}</a></li>)}</ul></div>)}
      </aside>
      <main id="main" className="min-w-0 flex-1 px-5 py-10 sm:px-10">
        <section id="introduction" className="scroll-mt-20 grid gap-8 border-b border-slate-200 pb-12 xl:grid-cols-2">
          <div><p className="text-sm font-semibold text-lime-700">ReviewAsk API</p><h1 className="mt-1 text-4xl font-bold tracking-tight text-navy-900">API Reference</h1>
            <p className="mt-4 text-lg leading-relaxed">Create, schedule, edit, and cancel Google review asks from your own software — and get signed callbacks when they go out. JSON over HTTPS, predictable resource URLs, standard HTTP status codes.</p>
            <div className="mt-6 flex flex-wrap gap-3"><Link href="/settings#api" className="btn-navy px-4 py-2">Get your API key</Link><a href="/openapi.json" className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-navy-900 hover:bg-slate-50">Download OpenAPI spec</a></div></div>
          <div className="space-y-3"><Code label="Base URL">{BASE}</Code><Code label="Quickstart">{`curl -X POST ${BASE}/requests \\\n  -H "Authorization: Bearer $REVIEWASK_KEY" \\\n  -H "Content-Type: application/json" \\\n  -d '{"name":"Alex","email":"alex@example.com"}'`}</Code></div>
        </section>

        <section className="grid gap-8 border-b border-slate-200 py-12 xl:grid-cols-2">
          <div><H id="authentication">Authentication</H>
            <p className="mt-3">Authenticate with your secret key as a Bearer token. Keys start with <code className={ic}>ra_</code>. <code className={ic}>X-Api-Token</code> is also accepted.</p>
            <p className="mt-3">Your account must be on an active trial or paid plan. Keep keys server-side — never ship them in browser or mobile code.</p>
            <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"><b>One key, shared with Zapier.</b> Rotating it breaks an existing Zap until you paste the new key.</div></div>
          <div><Code label="Header">{`Authorization: Bearer ra_••••••••••••••••`}</Code></div>
        </section>

        <section className="grid gap-8 border-b border-slate-200 py-12 xl:grid-cols-2">
          <div><H id="errors">Errors</H><p className="mt-3">Errors return a non-2xx status and a JSON body with an <code className={ic}>error</code> message.</p>
            <table className="mt-4 w-full text-sm"><tbody className="divide-y divide-slate-100">{[["400", "Invalid parameters"], ["401", "Missing or invalid key"], ["402", "Plan inactive or monthly quota reached"], ["403", "Zapier hook disconnected (legacy hook only)"], ["404", "Request not found"], ["409", "Request can't be changed in its current status"], ["429", "Too many requests"]].map(([c, d]) => <tr key={c}><td className="py-2 pr-4 font-mono font-semibold text-navy-900">{c}</td><td className="py-2">{d}</td></tr>)}</tbody></table></div>
          <div><Code label="Error response">{`HTTP/1.1 401 Unauthorized\n\n{ "error": "Invalid or missing API token." }`}</Code></div>
        </section>

        <section className="grid gap-8 border-b border-slate-200 py-12 xl:grid-cols-2">
          <div><H id="statuses">Statuses</H><p className="mt-3">A review request moves through these states:</p>
            <dl className="mt-4 space-y-2 text-sm">{[["scheduled", "Waiting for send_at. Editable and cancellable."], ["sending", "Being delivered right now."], ["sent", "Delivered. A day-3 follow-up may be pending."], ["queued", "Accepted by the carrier/mail provider."], ["failed", "Delivery failed."], ["cancelled", "Cancelled before sending."], ["suppressed", "Customer opted out or was already asked."]].map(([s, d]) => <div key={s} className="flex gap-3"><dt className="w-24 shrink-0"><code className={ic}>{s}</code></dt><dd>{d}</dd></div>)}</dl></div>
          <div><Code label="The review_request object">{reqObj}</Code></div>
        </section>

        {ENDPOINTS.map((g) => g.items.map((e) => <section key={e.id} className="grid gap-8 border-b border-slate-200 py-12 xl:grid-cols-2">
          <div><H id={e.id}>{e.title}</H>
            <div className="mt-3 flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-sm"><Badge m={e.method} /><span className="text-navy-900">/v1{e.path}</span></div>
            <p className="mt-4">{e.desc}</p>
            {e.params && <><p className="mt-6 text-xs font-semibold uppercase tracking-wider text-slate-500">Parameters</p>
              <ul className="mt-2 divide-y divide-slate-100 border-y border-slate-100">{e.params.map(([n, t, d]) => <li key={n} className="py-3"><p><code className="font-mono text-sm font-semibold text-navy-900">{n}</code> <span className="ml-1 text-xs text-slate-500">{t}</span></p><p className="mt-0.5 text-sm">{d}</p></li>)}</ul></>}</div>
          <div className="space-y-3 xl:sticky xl:top-20 xl:self-start">{e.req && <Code label="Request">{e.req}</Code>}<Code label="Response">{e.res}</Code></div>
        </section>))}

        <section className="grid gap-8 border-b border-slate-200 py-12 xl:grid-cols-2">
          <div><H id="webhooks">Webhooks</H>
            <p className="mt-3">After you set a callback URL, we POST a JSON event for each change. Respond with any 2xx within 8 seconds.</p>
            <ul className="mt-4 space-y-1.5 text-sm">{["request.created", "request.sent", "request.reminded", "request.cancelled", "followup.cancelled"].map((x) => <li key={x}><code className={ic}>{x}</code></li>)}</ul>
            <p className="mt-4 text-sm">Headers: <code className={ic}>X-ReviewAsk-Event</code>, <code className={ic}>X-ReviewAsk-Signature</code>.</p></div>
          <div><Code label="Event payload">{`POST /hooks/reviewask\nX-ReviewAsk-Event: request.sent\nX-ReviewAsk-Signature: sha256=5d1c…\n\n{\n  "id": "evt_m2x9k1_4821",\n  "type": "request.sent",\n  "created": 1793311331,\n  "data": { "object": "review_request", "id": 4821, "status": "sent", … }\n}`}</Code></div>
        </section>

        <section className="grid gap-8 border-b border-slate-200 py-12 xl:grid-cols-2">
          <div><H id="signatures">Verifying signatures</H>
            <p className="mt-3"><code className={ic}>X-ReviewAsk-Signature</code> is <code className={ic}>sha256=</code> followed by the hex HMAC-SHA256 of the <b>raw request body</b>, keyed with your <code className={ic}>whsec_</code> signing secret.</p>
            <ol className="mt-4 list-decimal space-y-1.5 pl-5 text-sm"><li>Read the raw body before JSON parsing.</li><li>Compute the HMAC with your secret.</li><li>Compare with a constant-time equality check.</li><li>Reject on mismatch with 400.</li></ol></div>
          <div className="space-y-3"><Code label="Node.js">{`import crypto from "crypto";\n\nfunction verify(rawBody, header, secret) {\n  const expected = "sha256=" +\n    crypto.createHmac("sha256", secret).update(rawBody).digest("hex");\n  return header.length === expected.length &&\n    crypto.timingSafeEqual(Buffer.from(header), Buffer.from(expected));\n}`}</Code>
            <Code label="Python">{`import hmac, hashlib\n\ndef verify(raw_body: bytes, header: str, secret: str) -> bool:\n    expected = "sha256=" + hmac.new(secret.encode(), raw_body, hashlib.sha256).hexdigest()\n    return hmac.compare_digest(header, expected)`}</Code></div>
        </section>

        <section className="grid gap-8 border-b border-slate-200 py-12 xl:grid-cols-2">
          <div><H id="zapier">Zapier / Make</H><p className="mt-3">No code? Use the Zapier wizard in <Link href="/settings#automatic" className="font-medium text-navy-900 underline underline-offset-4">Settings</Link>. The legacy hook <code className={ic}>POST /api/hooks/job-complete</code> keeps working; new integrations should use <code className={ic}>POST /v1/requests</code>.</p>
            <p className="mt-3 text-sm">If Zapier is disconnected in Settings, inbound hook calls return <code className={ic}>403</code> until you reconnect.</p></div>
          <div><Code label="Legacy hook">{`curl -X POST https://getreviewask.com/api/hooks/job-complete \\\n  -H "Authorization: Bearer $REVIEWASK_KEY" \\\n  -d "name=Alex Rivera" -d "email=alex@example.com"`}</Code></div>
        </section>

        <section className="py-12"><H id="openapi">OpenAPI spec</H>
          <p className="mt-3">Import <a href="/openapi.json" className="font-medium text-navy-900 underline underline-offset-4">/openapi.json</a> (OpenAPI 3) into Postman, Insomnia, or your code generator.</p>
          <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-6"><p className="font-semibold text-navy-900">Need a hand?</p><p className="mt-1 text-sm">Email <a href="mailto:support@getreviewask.com" className="underline underline-offset-4">support@getreviewask.com</a> — a human reads every message.</p></div>
        </section>
      </main>
    </div>
  </div>;
}
