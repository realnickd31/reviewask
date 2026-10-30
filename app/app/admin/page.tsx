import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { db } from "@/lib/db";
import AppNav from "@/components/AppNav";
import { excludeAdminSql, excludeExemptUsersSql, excludeExemptUserIdSql } from "@/lib/analytics";
import { MetricSection, MetricTable, type Col, type Row } from "@/components/admin/MetricSection";
import { FunnelChart, TrendChart } from "@/components/admin/AdminCharts";

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
  const ur0 = rangeClause(range);
  const rr0 = rangeClause(range);
  const UX = excludeExemptUsersSql();
  const ur = { ...ur0, sql: `${ur0.sql} AND ${UX}` };
  const rr = { ...rr0, sql: `${rr0.sql} AND ${excludeExemptUserIdSql()}` };

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
    `SELECT subscription_status s, COUNT(*) c FROM users WHERE ${UX} GROUP BY subscription_status`
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
    SUM(CASE WHEN auto_provider='zapier' THEN 1 ELSE 0 END) zapier
    FROM users WHERE ${UX}`).get() as Record<string, number>;

  const recentUsers = db.prepare(
    `SELECT email, business_name, subscription_status, created_at FROM users WHERE ${UX} ORDER BY created_at DESC LIMIT 20`
  ).all() as { email: string; business_name: string | null; subscription_status: string; created_at: string }[];

  const recentEvents = db.prepare(
    `SELECT event, path, utm_source, created_at FROM analytics_events WHERE ${excludeAdminSql()} ORDER BY id DESC LIMIT 20`
  ).all() as { event: string; path: string | null; utm_source: string | null; created_at: string }[];

  const ranges: { id: Range; label: string }[] = [
    { id: "7", label: "Last 7 days" },
    { id: "30", label: "Last 30 days" },
    { id: "all", label: "All time" },
  ];

  const kpiCols: Col[] = [{ key: "metric", label: "Metric" }, { key: "value", label: "Value", align: "right" }, { key: "rate", label: "Step conversion", align: "right" }];
  const funnelRows: Row[] = funnel.map((f, i) => ({ metric: f.label, value: f.value, rate: i > 0 ? pct(f.value, funnel[i - 1].value) : "" }));
  const healthRows: Row[] = [
    { metric: "Total accounts", value: totalUsers },
    { metric: "Trialing", value: trialing },
    { metric: "Paid active", value: active },
    { metric: "Activated (sent an ask)", value: activatedUsers },
    { metric: "Don't-ask cancels in range", value: cancelled },
  ];
  const connectorRows: Row[] = Object.entries(connectors || {}).map(([k, v]) => ({ s: k, c: Number(v) || 0 }));
  const two = (label: string): Col[] => [{ key: "s", label }, { key: "c", label: "Count", align: "right", width: 96 }];
  const rk = range === "all" ? "all" : `${range}d`;

  return (
    <div className="min-h-screen bg-slate-50">
      <AppNav />
      <main id="main" className="mx-auto max-w-6xl px-3 py-8 sm:px-6">
        <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">Founder</p>
            <h1 className="mt-1 text-2xl font-semibold text-navy-900">Admin analytics</h1>
            <p className="mt-1 text-sm text-slate-600">Funnel, traffic, product health and recent activity. Internal &amp; test accounts are excluded.</p>
          </div>
          <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5 shadow-sm">
            {ranges.map((r) => (
              <Link
                key={r.id}
                href={`/admin?range=${r.id}`}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                  range === r.id ? "bg-navy-900 text-white" : "text-slate-600 hover:bg-slate-50 hover:text-navy-900"
                }`}
              >
                {r.label}
              </Link>
            ))}
          </div>
        </div>

        {/* 1. Funnel */}
        <Group n={1} title="Acquisition funnel">
          <MetricTable
            id={`funnel-${rk}`}
            title="Funnel"
            hint={`Visit → signup ${pct(signups, uniqueVisitors)} · Signup → checkout ${pct(checkoutStarted, signups)} · ${ctaClicks.toLocaleString()} CTA clicks · % = conversion from previous step`}
            lead={<FunnelChart steps={funnel} />}
            columns={kpiCols}
            rows={funnelRows}
          />
          <MetricTable
            id={`daily-trend-${rk}`}
            title="Daily trend"
            hint="Traffic on left axis, conversions on right. ▲▼ = second half of range vs first half."
            lead={<TrendChart daily={daily} />}
            className="mt-4"
            empty="No events in this range yet."
            columns={[
              { key: "d", label: "Day", width: 128 },
              { key: "visitors", label: "Visitors", align: "right" },
              { key: "pageviews", label: "Views", align: "right" },
              { key: "ctas", label: "CTAs", align: "right" },
              { key: "signups", label: "Signups", align: "right" },
              { key: "checkouts", label: "Checkouts", align: "right" },
              { key: "trials", label: "Trials", align: "right" },
            ]}
            rows={daily as unknown as Row[]}
          />
        </Group>

        {/* 2. Traffic */}
        <Group n={2} title="Traffic">
          <div className="grid gap-4 lg:grid-cols-2">
            <MetricTable id={`top-pages-${rk}`} chart="bar" title="Top pages" columns={two("Page")} rows={topPages.map((r) => ({ s: r.p || "/", c: r.c }))} empty="No pageviews yet." />
            <MetricTable id={`top-referrers-${rk}`} chart="bar" title="Top referrers" columns={two("Referrer")} rows={topRefs.map((r) => ({ s: hostOf(r.r), c: r.c }))} empty="No referrers yet." />
            <MetricTable id={`utm-sources-${rk}`} chart="bar" title="UTM sources" columns={two("Source")} rows={utmSources.map((r) => ({ s: r.s, c: r.c }))} empty="Add ?utm_source=… to campaign links." />
            <MetricTable id={`utm-campaigns-${rk}`} chart="bar" title="UTM campaigns" columns={two("Campaign")} rows={utmCampaigns.map((r) => ({ s: r.s, c: r.c }))} empty="No campaign tags yet." />
            <MetricTable id={`top-ctas-${rk}`} chart="bar" title="Top CTAs clicked" columns={two("CTA")} rows={topCtas.map((r) => ({ s: r.l, c: r.c }))} empty="No CTA clicks yet." />
            <MetricTable id={`devices-${rk}`} chart="donut" title="Devices" columns={two("Device")} rows={devices.map((d) => ({ s: d.d, c: d.c }))} empty="No device data yet." />
          </div>
        </Group>

        {/* 3. Product health */}
        <Group n={3} title="Product health">
          <MetricSection title="Accounts" hint="All time, excluding internal & test accounts where tracked" csvName={`product-health-${rk}`} csv={{ columns: kpiCols.slice(0, 2), rows: healthRows }}>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 lg:divide-x divide-slate-100">
              {healthRows.map((r) => (
                <div key={String(r.metric)} className="px-4 py-4">
                  <p className="truncate text-[11px] font-medium uppercase tracking-wide text-slate-500">{r.metric}</p>
                  <p className="mt-1 text-2xl font-semibold tabular-nums text-navy-900">{Number(r.value).toLocaleString()}</p>
                </div>
              ))}
            </div>
          </MetricSection>
          <div className="mt-4 grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
            <MetricTable id={`asks-status-${rk}`} chart="donut" title="Asks by status" columns={two("Status")} rows={askStatus.map((r) => ({ s: r.s, c: r.c }))} empty="None" />
            <MetricTable id={`asks-channel-${rk}`} chart="donut" title="Asks by channel" columns={two("Channel")} rows={askChannel.map((r) => ({ s: r.s, c: r.c }))} empty="None" />
            <MetricTable id={`asks-source-${rk}`} chart="donut" title="Asks by source" columns={two("Source")} rows={askSource.map((r) => ({ s: r.s, c: r.c }))} empty="None" />
            <MetricTable id="connectors" chart="bar" title="Connectors" hint="All accounts" columns={two("Connector")} rows={connectorRows} empty="None" />
          </div>
        </Group>

        {/* 4. Recent activity */}
        <Group n={4} title="Recent activity">
          <div className="grid gap-4 lg:grid-cols-2">
            <MetricTable
              id="recent-signups"
              title="Recent signups"
              columns={[
                { key: "email", label: "Email" },
                { key: "business_name", label: "Business" },
                { key: "subscription_status", label: "Status", width: 104 },
                { key: "created_at", label: "When", width: 156, mono: true },
              ]}
              rows={recentUsers as unknown as Row[]}
              empty="No signups yet."
            />
            <MetricTable
              id="recent-events"
              title="Recent events"
              columns={[
                { key: "event", label: "Event", width: 140 },
                { key: "path", label: "Path" },
                { key: "utm_source", label: "UTM", width: 96 },
                { key: "created_at", label: "When", width: 156, mono: true },
              ]}
              rows={recentEvents as unknown as Row[]}
              empty="Waiting for traffic."
            />
          </div>
        </Group>

        <p className="mt-12 border-t border-slate-200 pt-4 text-xs text-slate-500">
          Tip: tag outreach links like <code className="rounded bg-slate-100 px-1">https://getreviewask.com/?utm_source=email&amp;utm_campaign=top15</code> so sources show up here. Drag column edges to resize (double-click to reset).
        </p>
      </main>
    </div>
  );
}

function Group({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-navy-900 text-[10px] text-white">{n}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}
