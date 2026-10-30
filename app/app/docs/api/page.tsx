import type { Metadata } from "next";
import Link from "next/link";
import Legal from "@/components/Legal";

export const metadata: Metadata = {
  title: { absolute: "API · ReviewAsk" },
  description: "Create, list, edit, and cancel Google review asks with the ReviewAsk REST API.",
  alternates: { canonical: "/docs/api" },
};

const base = "https://getreviewask.com";

export default function ApiDocsPage() {
  return (
    <Legal title="ReviewAsk API">
      <p className="text-lg">
        A simple HTTPS API for tech-savvy owners and integrators. Create review asks, list them, edit scheduled ones, and cancel — with the same secret key you already use for Zapier.
      </p>
      <p>
        Machine-readable spec: <a href="/openapi.json">openapi.json</a>. Manage your key and callbacks in{" "}
        <Link href="/settings#api">Settings → API &amp; callbacks</Link> (same key as Zapier).
      </p>

      <h2>Auth</h2>
      <p>Every request needs a Bearer token (or <code>X-Api-Token</code>). Keys start with <code>ra_</code>.</p>
      <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm text-slate-100">{`Authorization: Bearer ra_…`}</pre>
      <p>Your account must be on an active trial or paid plan. One key is shared with Zapier: rotating it breaks an existing Zap, and disconnecting Zapier clears the key.</p>

      <h2>Base URL</h2>
      <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm text-slate-100">{base}/api/v1</pre>

      <h2>Account</h2>
      <p><code>GET /account</code> — business name, plan status, monthly usage and quota.</p>

      <h2>Requests</h2>
      <ul className="list-disc space-y-2 pl-5">
        <li><code>GET /requests</code> — list asks (newest first). Query: <code>limit</code> (1–100), <code>cursor</code> (id), <code>status</code>.</li>
        <li><code>POST /requests</code> — create an ask. Body: <code>name</code> (required), <code>email</code> and/or <code>phone</code>, optional <code>delay_hours</code> (0 = send now).</li>
        <li><code>GET /requests/:id</code> — one ask.</li>
        <li><code>PATCH /requests/:id</code> — edit a <code>scheduled</code> ask only (name, email, phone, delay_hours).</li>
        <li><code>DELETE /requests/:id</code> — cancel a scheduled ask, or cancel the day-3 follow-up on a sent ask.</li>
      </ul>

      <h2>Example: create an ask</h2>
      <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm text-slate-100">{`curl -X POST ${base}/api/v1/requests \\
  -H "Authorization: Bearer ra_…" \\
  -H "Content-Type: application/json" \\
  -d '{"name":"Alex","email":"alex@example.com"}'`}</pre>

      <h2>Statuses</h2>
      <p><code>scheduled</code>, <code>sending</code>, <code>sent</code>, <code>queued</code>, <code>failed</code>, <code>cancelled</code>, <code>suppressed</code>.</p>

      <h2>Outbound callbacks</h2>
      <p>
        Save an HTTPS URL with <code>PUT /endpoints</code> (or in Settings). We POST JSON for{" "}
        <code>request.created</code>, <code>request.sent</code>, <code>request.reminded</code>,{" "}
        <code>request.cancelled</code>, and <code>followup.cancelled</code>. Headers:{" "}
        <code>X-ReviewAsk-Event</code>, <code>X-ReviewAsk-Signature</code> (<code>sha256=</code> hex HMAC-SHA256 of the raw body with your signing secret).
        The secret is shown once when you first save (or rotate).
      </p>
      <h2>API key (no Zapier flip)</h2>
      <p>
        <code>POST /keys</code> creates or rotates the Bearer token without turning on automatic Zapier asks.
        The key is still shared with Zapier — rotating it breaks an existing Zap; disconnecting Zapier clears it.
        Prefer Settings → API &amp; callbacks for day-to-day use.
      </p>

      <h2>Zapier / Make</h2>
      <p>
        The existing job-complete hook stays at <code>/api/hooks/job-complete</code> (and the Zapier wizard URL). Prefer{" "}
        <code>POST /api/v1/requests</code> for new integrations.
      </p>

      <div className="mt-8 rounded-xl bg-slate-50 p-6">
        <p className="font-semibold text-navy-900">Need a hand?</p>
        <p className="mt-1 text-sm">Email <a href="mailto:support@getreviewask.com">support@getreviewask.com</a> — we read every message.</p>
      </div>
    </Legal>
  );
}
