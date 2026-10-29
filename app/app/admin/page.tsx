import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { db } from "@/lib/db";
import AppNav from "@/components/AppNav";
import { excludeAdminSql } from "@/lib/analytics";

export const dynamic = "force-dynamic";

type Range = "7" | "30" | "all";

function rangeClause(range: Range, col = "created_at") {
  if (range === "all") return { sql: "1=1", params: [] as (string | number)[] };
  const days = range === "7" ? 7 : 30;
  return { sql: `${col} >= datetime('now', ?)`, params: [`-${days} days`] };
}

function pct(num: number, den: number) {
  if (!den) return "—";
  return `${Math.round((num / den) * 1000) / 10}%`;
}

function hostOf(ref: string | null) {
  if (!ref) return "(direct)";
  try {
    const u = new URL(ref);
    return u.host || ref.slice(0, 60);
  } catch {
    return ref.slice(0, 60) || "(direct)";
  }
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: { range?: string };
}) {
  await requireAdmin();
  const range = (["7", "30", "all"].includes(searchParams.range || "")
    ? searchParams.range
    : "30") as Range;
  const ae0 = rangeClause(range);
  const ae = { ...ae0, sql: `${ae0.sql} AND ${excludeAdminSql()}` };
  const ur = rangeClause(range);
  const rr = rangeClause(range);

  const countEvent = (event: string) =>
    (db.prepare(`SELECT COUNT(*) c FROM analytics_events WHERE event=? AND ${ae.sql}`).get(event, ...ae.params) as { c: number }).c;

  const uniqueVisitors = (db.prepare(
    `SELECT COUNT(DISTINCT visitor_id) c FROM analytics_events WHERE event='pageview' AND visitor_id IS NOT NULL AND ${ae.sql}`
  ).get(...ae.params) as { c: number }).c;

  const pageviews = countEvent("pageview");
  const ctaClicks = countEvent("cta_click");
  const signupEvents = countEvent("signup");
  const onboardingEvents = countEvent("onboarding_completed");
  const checkoutStarted = countEvent("checkout_started");
  const checkoutCompleted = countEvent("checkout_completed");
  const trialStarted = countEvent("trial_started");
  const firstAsks = countEvent("first_ask");

  const signupPageviews = (db.prepare(
    `SELECT COUNT(*) c FROM analytics_events WHERE event='pageview' AND path LIKE '/signup%' AND ${ae.sql}`
  ).get(...ae.params) as { c: number }).c;

  const usersCreated = (db.prepare(`SELECT COUNT(*) c FROM users WHERE ${ur.sql}`).get(...ur.params) as { c: number }).c;
  const signups = Math.max(signupEvents, usersCreated);

  const statusCounts = db.prepare(
    `SELECT subscription_status s, COUNT(*) c FROM users GROUP BY subscription_status`
  ).all() as { s: string; c: number }[];
  const statusMap = Object.fromEntries(statusCounts.map((r) => [r.s, r.c]));
  const trialing = statusMap["trialing"] || 0;
  const active = statusMap["active"] || 0;
  const totalUsers = statusCounts.reduce((a, r) => a + r.c, 0);

  const funnel = [
    { label: "Unique visitors", value: uniqueVisitors },
    { label: "Pageviews", value: pageviews },
    { label: "Signup page views", value: signupPageviews },
    { label: "Signups", value: signups },
    { label: "Onboarding done", value: onboardingEvents },
    { label: "Checkout started", value: checkoutStarted },
    { label: "Trials / checkout done", value: Math.max(checkoutCompleted, trialStarted, trialing) },
    { label: "Paid active (all-time)", value: active },
    { label: "First ask sent", value: firstAsks },
  ];

  const topPages = db.prepare(
    `SELECT path p, COUNT(*) c FROM analytics_events WHERE event='pageview' AND ${ae.sql} GROUP BY path ORDER BY c DESC LIMIT 12`
  ).all(...ae.params) as { p: string; c: number }[];

  const topRefs = db.prepare(
    `SELECT referrer r, COUNT(*) c FROM analytics_events WHERE event='pageview' AND ${ae.sql} GROUP BY referrer ORDER BY c DESC LIMIT 12`
  ).all(...ae.params) as { r: string | null; c: number }[];

  const utmSources = db.prepare(
    `SELECT COALESCE(utm_source,'(none)') s, COUNT(*) c FROM analytics_events WHERE event='pageview' AND ${ae.sql} GROUP BY utm_source ORDER BY c DESC LIMIT 12`
  ).all(...ae.params) as { s: string; c: number }[];

  const utmCampaigns = db.prepare(
    `SELECT COALESCE(utm_campaign,'(none)') s, COUNT(*) c FROM analytics_events WHERE event='pageview' AND ${ae.sql} GROUP BY utm_campaign ORDER BY c DESC LIMIT 12`
  ).all(...ae.params) as { s: string; c: number }[];

  const devices = db.prepare(
    `SELECT COALESCE(json_extract(meta,'$.device'),'unknown') d, COUNT(*) c FROM analytics_events WHERE event='pageview' AND ${ae.sql} GROUP BY d ORDER BY c DESC`
  ).all(...ae.params) as { d: string; c: number }[];

  const topCtas = db.prepare(
    `SELECT COALESCE(json_extract(meta,'$.label'), json_extract(meta,'$.cta'), '(unknown)') l, COUNT(*) c
     FROM analytics_events WHERE event='cta_click' AND ${ae.sql} GROUP BY l ORDER BY c DESC LIMIT 10`
  ).all(...ae.params) as { l: string; c: number }[];

  const daily = db.prepare(
    `SELECT date(created_at) d,
       SUM(CASE WHEN event='pageview' THEN 1 ELSE 0 END) pageviews,
       COUNT(DISTINCT CASE WHEN event='pageview' THEN visitor_id END) visitors,
       SUM(CASE WHEN event='signup' THEN 1 ELSE 0 END) signups,
       SUM(CASE WHEN event='checkout_started' THEN 1 ELSE 0 END) checkouts,
       SUM(CASE WHEN event='trial_started' OR event='checkout_completed' THEN 1 ELSE 0 END) trials,
       SUM(CASE WHEN event='cta_click' THEN 1 ELSE 0 END) ctas
     FROM analytics_events WHERE ${ae.sql}
     GROUP BY date(created_at) ORDER BY d DESC LIMIT 31`
  ).all(...ae.params) as { d: string; pageviews: number; visitors: number; signups: number; checkouts: number; trials: number; ctas: number }[];

  const askStatus = db.prepare(
    `SELECT status s, COUNT(*) c FROM review_requests WHERE ${rr.sql} GROUP BY status ORDER BY c DESC`
  ).all(...rr.params) as { s: string; c: number }[];

  const askChannel = db.prepare(
    `SELECT channel s, COUNT(*) c FROM review_requests WHERE ${rr.sql} GROUP BY channel ORDER BY c DESC`
  ).all(...rr.params) as { s: string; c: number }[];

  const askSource = db.prepare(
    `SELECT source s, COUNT(*) c FROM review_requests WHERE ${rr.sql} GROUP BY source ORDER BY c DESC`
  ).all(...rr.params) as { s: string; c: number }[];

  const cancelled = (db.prepare(
    `SELECT COUNT(*) c FROM review_requests WHERE status='cancelled' AND ${rr.sql}`
  ).get(...rr.params) as { c: number }).c;

  const activatedUsers = (db.prepare(
    `SELECT COUNT(DISTINCT user_id) c FROM review_requests WHERE status != 'cancelled' AND ${rr.sql}`
  ).get(...rr.params) as { c: number }).c;

  const connectors = db.prepare(`SELECT
    SUM(jobber_connected) jobber,
    SUM(housecall_connected) housecall,
    SUM(square_connected) square,
    SUM(stripe_connect_connected) stripe_connect,
    SUM(qbo_connected) qbo,
    SUM(CASE WHEN api_token IS NOT NULL AND length(api_token)>0 THEN 1 ELSE 0 END) zapier
    FROM users`).get() as Record<string, number>;

  const recentUsers = db.prepare(
    `SELECT email, business_name, subscription_status, created_at FROM users ORDER BY created_at DESC LIMIT 20`
  ).all() as { email: string; business_name: string | null; subscription_status: string; created_at: string }[];

  const recentEvents = db.prepare(
    `SELECT event, path, utm_source, created_at FROM analytics_events WHERE ${excludeAdminSql()} ORDER BY id DESC LIMIT 20`
  ).all() as { event: string; path: string | null; utm_source: string | null; created_at: string }[];

  const ranges: { id: Range; label: string }[] = [
    { id: "7", label: "Last 7 days" },
    { id: "30", label: "Last 30 days" },
    { id: "all", label: "All time" },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <AppNav />
      <main id="main" className="mx-auto max-w-5xl px-3 py-8 sm:px-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">Founder</p>
            <h1 className="mt-1 text-2xl font-semibold text-navy-900">Admin analytics</h1>
            <p className="mt-1 text-sm text-slate-600">Shopify-style funnel plus traffic and product health. Only you can open this page.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {ranges.map((r) => (
              <Link
                key={r.id}
                href={`/admin?range=${r.id}`}
                className={`rounded-md px-3 py-1.5 text-sm font-medium ${
                  range === r.id ? "bg-navy-900 text-white" : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                {r.label}
              </Link>
            ))}
          </div>
        </div>

        <section className="mt-8">
          <h2 className="text-sm font-semibold text-navy-900">Acquisition funnel</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {funnel.map((step, i) => {
              const prev = i > 0 ? funnel[i - 1].value : 0;
              return (
                <div key={step.label} className="card !p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{step.label}</p>
                  <p className="mt-1 text-2xl font-semibold text-navy-900">{step.value.toLocaleString()}</p>
                  {i > 0 && (
                    <p className="mt-1 text-xs text-slate-500">
                      {pct(step.value, prev)} of previous step
                    </p>
                  )}
                </div>
              );
            })}
          </div>
          <div className="card mt-3 !p-4 text-sm text-slate-600">
            Visit → signup conversion: <span className="font-semibold text-navy-900">{pct(signups, uniqueVisitors)}</span>
            {" · "}
            Signup → checkout: <span className="font-semibold text-navy-900">{pct(checkoutStarted, signups)}</span>
            {" · "}
            CTA clicks: <span className="font-semibold text-navy-900">{ctaClicks.toLocaleString()}</span>
          </div>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-2">
          <div>
            <h2 className="text-sm font-semibold text-navy-900">Top pages</h2>
            <div className="card mt-3 !p-0 overflow-hidden">
              <table className="w-full text-sm">
                <tbody>
                  {topPages.map((r) => (
                    <tr key={r.p} className="border-b border-slate-100 last:border-0">
                      <td className="px-4 py-2.5 text-slate-700 truncate max-w-[14rem]">{r.p || "/"}</td>
                      <td className="px-4 py-2.5 text-right font-medium text-navy-900">{r.c}</td>
                    </tr>
                  ))}
                  {!topPages.length && <tr><td className="px-4 py-6 text-slate-500">No pageviews yet — open the homepage after deploy.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-navy-900">Top referrers</h2>
            <div className="card mt-3 !p-0 overflow-hidden">
              <table className="w-full text-sm">
                <tbody>
                  {topRefs.map((r, i) => (
                    <tr key={i} className="border-b border-slate-100 last:border-0">
                      <td className="px-4 py-2.5 text-slate-700 truncate max-w-[14rem]">{hostOf(r.r)}</td>
                      <td className="px-4 py-2.5 text-right font-medium text-navy-900">{r.c}</td>
                    </tr>
                  ))}
                  {!topRefs.length && <tr><td className="px-4 py-6 text-slate-500">No referrers yet.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-navy-900">UTM sources</h2>
            <div className="card mt-3 !p-0 overflow-hidden">
              <table className="w-full text-sm">
                <tbody>
                  {utmSources.map((r) => (
                    <tr key={r.s} className="border-b border-slate-100 last:border-0">
                      <td className="px-4 py-2.5 text-slate-700">{r.s}</td>
                      <td className="px-4 py-2.5 text-right font-medium text-navy-900">{r.c}</td>
                    </tr>
                  ))}
                  {!utmSources.length && <tr><td className="px-4 py-6 text-slate-500">Add ?utm_source=… to campaign links.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-navy-900">UTM campaigns</h2>
            <div className="card mt-3 !p-0 overflow-hidden">
              <table className="w-full text-sm">
                <tbody>
                  {utmCampaigns.map((r) => (
                    <tr key={r.s} className="border-b border-slate-100 last:border-0">
                      <td className="px-4 py-2.5 text-slate-700">{r.s}</td>
                      <td className="px-4 py-2.5 text-right font-medium text-navy-900">{r.c}</td>
                    </tr>
                  ))}
                  {!utmCampaigns.length && <tr><td className="px-4 py-6 text-slate-500">No campaign tags yet.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-2">
          <div>
            <h2 className="text-sm font-semibold text-navy-900">Devices</h2>
            <div className="card mt-3 !p-4 flex flex-wrap gap-3">
              {devices.map((d) => (
                <div key={d.d} className="rounded-md bg-slate-50 px-3 py-2 text-sm">
                  <span className="text-slate-500">{d.d}</span>{" "}
                  <span className="font-semibold text-navy-900">{d.c}</span>
                </div>
              ))}
              {!devices.length && <p className="text-sm text-slate-500">No device data yet.</p>}
            </div>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-navy-900">Top CTAs clicked</h2>
            <div className="card mt-3 !p-0 overflow-hidden">
              <table className="w-full text-sm">
                <tbody>
                  {topCtas.map((r) => (
                    <tr key={r.l} className="border-b border-slate-100 last:border-0">
                      <td className="px-4 py-2.5 text-slate-700 truncate max-w-[14rem]">{r.l}</td>
                      <td className="px-4 py-2.5 text-right font-medium text-navy-900">{r.c}</td>
                    </tr>
                  ))}
                  {!topCtas.length && <tr><td className="px-4 py-6 text-slate-500">No CTA clicks yet.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-sm font-semibold text-navy-900">Daily trend</h2>
          <div className="card mt-3 !p-0 overflow-x-auto">
            <table className="w-full min-w-[36rem] text-sm">
              <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-2.5">Day</th>
                  <th className="px-4 py-2.5 text-right">Visitors</th>
                  <th className="px-4 py-2.5 text-right">Views</th>
                  <th className="px-4 py-2.5 text-right">CTAs</th>
                  <th className="px-4 py-2.5 text-right">Signups</th>
                  <th className="px-4 py-2.5 text-right">Checkouts</th>
                  <th className="px-4 py-2.5 text-right">Trials</th>
                </tr>
              </thead>
              <tbody>
                {daily.map((r) => (
                  <tr key={r.d} className="border-t border-slate-100">
                    <td className="px-4 py-2.5 text-slate-700">{r.d}</td>
                    <td className="px-4 py-2.5 text-right font-medium">{r.visitors}</td>
                    <td className="px-4 py-2.5 text-right">{r.pageviews}</td>
                    <td className="px-4 py-2.5 text-right">{r.ctas}</td>
                    <td className="px-4 py-2.5 text-right">{r.signups}</td>
                    <td className="px-4 py-2.5 text-right">{r.checkouts}</td>
                    <td className="px-4 py-2.5 text-right">{r.trials}</td>
                  </tr>
                ))}
                {!daily.length && (
                  <tr><td colSpan={7} className="px-4 py-6 text-slate-500">No events in this range yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-sm font-semibold text-navy-900">Product health</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="card !p-4"><p className="text-xs text-slate-500">Total accounts</p><p className="mt-1 text-2xl font-semibold">{totalUsers}</p></div>
            <div className="card !p-4"><p className="text-xs text-slate-500">Trialing</p><p className="mt-1 text-2xl font-semibold">{trialing}</p></div>
            <div className="card !p-4"><p className="text-xs text-slate-500">Paid active</p><p className="mt-1 text-2xl font-semibold">{active}</p></div>
            <div className="card !p-4"><p className="text-xs text-slate-500">Activated (sent an ask)</p><p className="mt-1 text-2xl font-semibold">{activatedUsers}</p></div>
          </div>
          <div className="mt-3 grid gap-6 lg:grid-cols-3">
            <div>
              <p className="mt-2 text-xs font-semibold uppercase text-slate-500">Asks by status</p>
              <div className="card mt-2 !p-0 overflow-hidden">
                <table className="w-full text-sm"><tbody>
                  {askStatus.map((r) => (<tr key={r.s} className="border-b border-slate-100 last:border-0"><td className="px-4 py-2">{r.s}</td><td className="px-4 py-2 text-right font-medium">{r.c}</td></tr>))}
                  {!askStatus.length && <tr><td className="px-4 py-4 text-slate-500">None</td></tr>}
                </tbody></table>
              </div>
              <p className="mt-2 text-xs text-slate-500">Don&apos;t ask cancels in range: <span className="font-medium text-navy-900">{cancelled}</span></p>
            </div>
            <div>
              <p className="mt-2 text-xs font-semibold uppercase text-slate-500">Asks by channel</p>
              <div className="card mt-2 !p-0 overflow-hidden">
                <table className="w-full text-sm"><tbody>
                  {askChannel.map((r) => (<tr key={r.s} className="border-b border-slate-100 last:border-0"><td className="px-4 py-2">{r.s}</td><td className="px-4 py-2 text-right font-medium">{r.c}</td></tr>))}
                  {!askChannel.length && <tr><td className="px-4 py-4 text-slate-500">None</td></tr>}
                </tbody></table>
              </div>
            </div>
            <div>
              <p className="mt-2 text-xs font-semibold uppercase text-slate-500">Asks by source</p>
              <div className="card mt-2 !p-0 overflow-hidden">
                <table className="w-full text-sm"><tbody>
                  {askSource.map((r) => (<tr key={r.s} className="border-b border-slate-100 last:border-0"><td className="px-4 py-2">{r.s}</td><td className="px-4 py-2 text-right font-medium">{r.c}</td></tr>))}
                  {!askSource.length && <tr><td className="px-4 py-4 text-slate-500">None</td></tr>}
                </tbody></table>
              </div>
            </div>
          </div>
          <div className="card mt-3 !p-4">
            <p className="text-xs font-semibold uppercase text-slate-500">Connectors connected (all accounts)</p>
            <div className="mt-3 flex flex-wrap gap-3 text-sm">
              {Object.entries(connectors || {}).map(([k, v]) => (
                <div key={k} className="rounded-md bg-slate-50 px-3 py-2"><span className="text-slate-500">{k}</span>{" "}<span className="font-semibold text-navy-900">{v || 0}</span></div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-2">
          <div>
            <h2 className="text-sm font-semibold text-navy-900">Recent signups</h2>
            <div className="card mt-3 !p-0 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
                  <tr><th className="px-4 py-2">Email</th><th className="px-4 py-2">Status</th><th className="px-4 py-2">When</th></tr>
                </thead>
                <tbody>
                  {recentUsers.map((u) => (
                    <tr key={u.email} className="border-t border-slate-100">
                      <td className="px-4 py-2.5">
                        <div className="font-medium text-navy-900 truncate max-w-[12rem]">{u.email}</div>
                        <div className="text-xs text-slate-500 truncate">{u.business_name || "—"}</div>
                      </td>
                      <td className="px-4 py-2.5 text-slate-600">{u.subscription_status}</td>
                      <td className="px-4 py-2.5 text-slate-500 whitespace-nowrap">{u.created_at}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-navy-900">Recent events</h2>
            <div className="card mt-3 !p-0 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
                  <tr><th className="px-4 py-2">Event</th><th className="px-4 py-2">Path / UTM</th><th className="px-4 py-2">When</th></tr>
                </thead>
                <tbody>
                  {recentEvents.map((e, i) => (
                    <tr key={i} className="border-t border-slate-100">
                      <td className="px-4 py-2.5 font-medium text-navy-900">{e.event}</td>
                      <td className="px-4 py-2.5 text-slate-600 truncate max-w-[12rem]">{e.path || "—"}{e.utm_source ? ` · ${e.utm_source}` : ""}</td>
                      <td className="px-4 py-2.5 text-slate-500 whitespace-nowrap">{e.created_at}</td>
                    </tr>
                  ))}
                  {!recentEvents.length && <tr><td colSpan={3} className="px-4 py-6 text-slate-500">Waiting for traffic.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <p className="mt-10 text-xs text-slate-500">
          Tip: tag outreach links like <code className="rounded bg-slate-100 px-1">https://getreviewask.com/?utm_source=email&amp;utm_campaign=top15</code> so sources show up here.
        </p>
      </main>
    </div>
  );
}
