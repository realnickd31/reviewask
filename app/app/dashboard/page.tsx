import Link from "next/link";
import { channelLabel, sourceLabel, statusLabel } from "@/lib/activityLabels";
import LocalTime from "@/components/LocalTime";
import { redirect } from "next/navigation";
import AppNav from "@/components/AppNav";
import QuickAsk from "@/components/QuickAsk";
import BulkUpload from "@/components/BulkUpload";
import { processDueReminders, processDueScheduledAsks, accountDelayHours } from "@/lib/send";
import { delayLabel } from "@/lib/delay";
import { dontAsk, cancelFollowUp } from "@/app/actions";
import { requireUser } from "@/lib/session";
import { db, isActive, needsPayment, usedThisMonth, MONTHLY_QUOTA, getUser, unsubscribeUrl, appUrl, legacyTrackedWindow, type ReviewRequest, type User } from "@/lib/db";
import { buildReviewEmail, buildReminderEmail, buildReviewSms, buildReminderSms } from "@/lib/email";
import { stripe } from "@/lib/stripe";
import { AsksBars, ReviewLine } from "@/components/DashCharts";
import LiveRefresh from "@/components/LiveRefresh";
import TrialSubscribe from "@/components/TrialSubscribe";
import { applySubscription, ensureTrialEnd } from "@/lib/billing";
import { isAdminUser } from "@/lib/admin";
import { reviewProgress, snapshotUser, placesConfigured } from "@/lib/reviewStats";
export const dynamic = "force-dynamic";

export default async function Page({ searchParams }: { searchParams: { session_id?: string; dev_unlocked?: string; page?: string; subscribed?: string } }) {
  let u = await requireUser();
  if (isAdminUser(u)) redirect("/admin");
  if (!u.business_name || !u.review_url) redirect("/onboarding");
  const anyToolConnected = hasConnectedTool(u);
  const autoLink = anyToolConnected ? "Automatic asks: On" : u.auto_setup_requested_at ? "Automatic asks: Setup requested" : !u.auto_enabled ? "Turn on automatic asks: One switch. Every customer gets asked." : "Automate this in Settings";
  // Sync right after Checkout so it works even before the webhook arrives.
  if (searchParams.session_id && stripe && !isActive(u)) {
    try {
      const s = await stripe.checkout.sessions.retrieve(searchParams.session_id, { expand: ["subscription"] });
      if (s.client_reference_id === String(u.id) && s.subscription && typeof s.subscription !== "string") { applySubscription(s.subscription, u.id); u = getUser(u.id)!; }
    } catch (e) { console.error(e); }
  }
  const trialEnd = await ensureTrialEnd(u);
  const active = isActive(u);
  // Best-effort: send this account's due follow-ups so it works without an external cron.
  if (active) { try { await processDueScheduledAsks(u.id, 50); await processDueReminders(u.id, 50); } catch (e) { console.error("reminders", e); } }
  // First visit after this ships (or key added): take a baseline so progress starts counting.
  if (placesConfigured() && !reviewProgress(u.id)) { try { await snapshotUser(u.id, "link_saved"); } catch (e) { console.error("snapshot", e); } }
  const progress = reviewProgress(u.id);
  const sinceAsks = progress ? db.prepare("SELECT SUM(CASE WHEN status='sent' THEN 1 ELSE 0 END) sent FROM review_requests WHERE user_id=? AND created_at >= ?").get(u.id, progress.first.created_at) as { sent: number | null } : null;
  const used = usedThisMonth(u.id);
  const stats = db.prepare(`SELECT
    SUM(CASE WHEN reminded_at IS NOT NULL THEN 1 ELSE 0 END) reminded,
    SUM(CASE WHEN status='failed' THEN 1 ELSE 0 END) failed,
    SUM(CASE WHEN status='sent' AND created_at >= datetime('now','-7 days') THEN 1 ELSE 0 END) week,
    SUM(CASE WHEN remind_at IS NOT NULL AND reminded_at IS NULL AND status='sent' THEN 1 ELSE 0 END) pending
    FROM review_requests WHERE user_id=? AND created_at >= datetime('now','start of month')`).get(u.id) as Record<string, number | null>;
  const remaining = Math.max(0, MONTHLY_QUOTA - used);
  const activityTotal = (db.prepare("SELECT COUNT(*) AS n FROM review_requests WHERE user_id=? AND status != 'scheduled'").get(u.id) as { n: number }).n;
  const PAGE_SIZE = 10;
  const pageCount = Math.max(1, Math.ceil(activityTotal / PAGE_SIZE));
  const page = Math.min(pageCount, Math.max(1, Number(searchParams.page) || 1));
  const rows = db.prepare("SELECT * FROM review_requests WHERE user_id=? AND status != 'scheduled' ORDER BY id DESC LIMIT ? OFFSET ?").all(u.id, PAGE_SIZE, (page - 1) * PAGE_SIZE) as ReviewRequest[];
  const hasActivity = activityTotal > 0;
  const scheduled = db.prepare("SELECT * FROM review_requests WHERE user_id=? AND status='scheduled' ORDER BY send_at").all(u.id) as ReviewRequest[];
  const dayRows = db.prepare("SELECT date(created_at) d, COUNT(*) n FROM review_requests WHERE user_id=? AND status IN ('sent','queued') AND created_at >= date('now','-13 days') GROUP BY d").all(u.id) as { d: string; n: number }[];
  const days = Array.from({ length: 14 }, (_, i) => { const t = new Date(Date.now() - (13 - i) * 864e5); const k = t.toISOString().slice(0, 10); return { label: t.toLocaleDateString("en-US", { month: "numeric", day: "numeric", timeZone: "UTC" }), n: dayRows.find((x) => x.d === k)?.n ?? 0 }; });
  const pct = Math.min(100, (used / MONTHLY_QUOTA) * 100);
  const pager = (cls: string) =><nav className={`flex flex-wrap items-center justify-between gap-3 ${cls}`} aria-label="Activity pages">
          <p className="text-xs text-slate-500">Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, activityTotal)} of {activityTotal}</p>
          <div className="flex flex-wrap gap-1.5">
            {pageArrow("«", 1, page > 1, "First page")}{pageArrow("‹", page - 1, page > 1, "Previous page")}
            {pageNums(page, pageCount).map((n, k) => n === 0
              ? <span key={`gap${k}`} className="px-1.5 py-1.5 text-sm text-slate-400">…</span>
              : n === page
                ? <span key={n} aria-current="page" className="min-w-[2.25rem] rounded-md bg-navy-900 px-3 py-1.5 text-center text-sm font-semibold text-white">{n}</span>
                : <Link key={n} href={`/dashboard?page=${n}#history`} aria-label={`Page ${n}`} className="min-w-[2.25rem] rounded-md border border-slate-300 px-3 py-1.5 text-center text-sm font-semibold text-navy-900 hover:bg-slate-50">{n}</Link>)}
            {pageArrow("›", page + 1, page < pageCount, "Next page")}{pageArrow("»", pageCount, page < pageCount, "Last page")}
          </div>
        </nav>;
  return <div><AppNav /><main id="main" className="mx-auto max-w-5xl space-y-5 px-4 py-6 sm:py-8">
    {searchParams.dev_unlocked && <p className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">Dev mode: Stripe isn&apos;t configured, so your account was unlocked as a trial.</p>}
    {(u.subscription_status === "trialing" || searchParams.subscribed === "1") && <TrialSubscribe from="dashboard" trialEnd={trialEnd} status={searchParams.subscribed} />}
    {!active && needsPayment(u) && <div className="flex flex-col items-start justify-between gap-3 rounded-lg border border-red-200 bg-red-50 p-5 sm:flex-row sm:items-center">
      <div><p className="font-semibold text-red-800">Your last payment didn&apos;t go through.</p><p className="text-sm text-red-700">Sending is paused. Update your card to resume — no new trial, nothing lost.</p></div>
      <form action="/api/stripe/portal?view=payment_methods&from=dashboard" method="post" className="w-full sm:w-auto"><button className="btn-navy w-full sm:w-auto">Update payment method</button></form></div>}
    {!active && u.subscription_status === "canceled" && <div className="flex flex-col items-start justify-between gap-3 rounded-lg border border-slate-200 bg-white p-5 sm:flex-row sm:items-center">
      <div><p className="font-semibold">Your plan is canceled.</p><p className="text-sm text-slate-500">Resubscribe to resume sending — your history and settings are still here.</p></div>
      <Link href="/onboarding?step=pay&billing=reconnect" className="btn-navy w-full text-center sm:w-auto">Resubscribe</Link></div>}
    {!active && !needsPayment(u) && u.subscription_status !== "canceled" && <div className="flex flex-col items-start justify-between gap-3 rounded-lg border border-slate-200 bg-white p-5 sm:flex-row sm:items-center">
      <div><p className="font-semibold">Your account isn&apos;t active yet.</p><p className="text-sm text-slate-500">Start your 7-day free trial to send review requests.</p></div>
      <Link href="/onboarding?step=pay" className="btn-lime">Start free trial</Link></div>}
    {active && !hasActivity && <section className="card" id="get-started"><h2 className="text-lg font-semibold">Get started in 3 steps</h2>
      <p className="mt-1 text-sm text-slate-500">Requests go out by text or email.</p>
      <ol className="mt-4 space-y-3 text-sm">
        <li className="flex gap-3"><span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${anyToolConnected ? "bg-lime-50 text-lime-700 ring-1 ring-lime-100" : "bg-navy-900 text-white"}`}>{anyToolConnected ? "✓" : "1"}</span><div><p className="font-medium text-navy-900">Connect your tool</p><p className="text-slate-500">{anyToolConnected ? "Connected. Every customer gets asked automatically." : <>Do this once and every customer gets asked. <Link href="/settings#automatic" className="font-medium text-navy-900 underline underline-offset-4">Connect now</Link></>}</p></div></li>
        <li className="flex gap-3"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-navy-900 text-xs font-semibold text-white">2</span><div><p className="font-medium text-navy-900">Send your first ask</p><p className="text-slate-500">Send one to yourself first using the form below to see what customers get.</p></div></li>
        <li className="flex gap-3"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">3</span><div><p className="font-medium text-navy-900">Optional: ask past customers</p><p className="text-slate-500">Have a list? Open “Send to many customers at once” below.</p></div></li>
      </ol></section>}
    <ReviewGrowth p={progress} sent={sinceAsks?.sent || 0} />
    {active && hasActivity && <NextAction u={u} recentWeek={Number(stats.week ?? 0)} remaining={remaining} />}
    {hasActivity && <AsksBars days={days} />}
    <section aria-label="This month" className="space-y-2">
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-slate-200 bg-slate-200 md:grid-cols-4">
      {[["Asked this week", stats.week ?? 0, "last 7 days"], ["Asked this month", used, `${pct.toFixed(0)}% of your monthly plan`], ["Follow-ups sent", stats.reminded ?? 0, `${stats.pending ?? 0} more scheduled`], ["Asks left", remaining, `of ${MONTHLY_QUOTA} this month · ${u.subscription_status === "active" ? "Active" : u.subscription_status === "trialing" ? "Trial" : "Not active"}`]].map(([l, v, sub]) =>
        <div key={String(l)} className="bg-white p-4 sm:p-5"><p className="text-[11px] font-semibold uppercase leading-snug tracking-wider text-slate-600 sm:text-xs">{l}</p>
          <p className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight text-navy-900">{v}</p><p className="mt-1 text-xs text-slate-600">{sub}</p></div>)}
      </div>
      <div className="h-1.5 rounded-full bg-slate-100"><div className="h-1.5 rounded-full bg-navy-900" style={{ width: `${pct}%` }} /></div>
    </section>
    <section className="card" id="quick"><div className="flex flex-wrap items-baseline justify-between gap-2"><h2 className="text-lg font-semibold">Ask a customer for a review</h2><Link href="/settings#automatic" className="text-sm text-slate-500 underline underline-offset-4">{autoLink}</Link></div>
      <p className="mb-4 mt-1 text-sm text-slate-600">Name + phone (text) or email, tap Send.</p>
      <QuickAsk disabled={!active || used >= MONTHLY_QUOTA} accountDelay={accountDelayHours(u)} /></section>
      <details className="card" id="bulk"><summary className="cursor-pointer text-sm font-semibold text-navy-900">Have a list? Send to many customers at once</summary>
        <p className="mb-5 mt-1 text-sm text-slate-500">Copy customer rows from Excel or Google Sheets and paste — no exporting. <a href="/sample-customers.csv" download className="font-medium text-navy-900 underline underline-offset-4">Download sample spreadsheet</a></p>
        <BulkUpload disabled={!active || used >= MONTHLY_QUOTA} remaining={remaining} accountDelay={accountDelayHours(u)} /></details>
    {scheduled.length === 0 ? <section id="scheduled" className="card"><h2 className="text-lg font-semibold">Scheduled asks</h2><p className="mt-1 text-sm text-slate-600">Nothing scheduled yet. When you pick a later send time below, or a connected tool finishes a job, the review ask waits here until it goes out — so you can still stop it if needed.</p><p className="mt-3 text-sm"><a href="#quick" className="font-medium text-navy-900 underline underline-offset-4">Send your first ask</a><span className="text-slate-400"> · </span><Link href="/settings#automatic" className="font-medium text-navy-900 underline underline-offset-4">Connect a tool</Link></p></section> : <section className="card" id="scheduled"><h2 className="text-lg font-semibold">Scheduled asks</h2>
      <p className="mb-4 mt-1 text-sm text-slate-500">{accountDelayHours(u) > 0 ? <>Automatic asks from your connected tools wait {delayLabel(accountDelayHours(u))} before sending, so you can stop one if something went wrong.</> : <>Automatic asks from your connected tools send right away.</>} Typed-in and spreadsheet asks you schedule show here too. Every customer still gets asked unless you stop it. <Link href="/settings#timing" className="underline underline-offset-4">Change timing</Link></p>
      {scheduled.length === 0 ? <p className="text-sm text-slate-500">Nothing waiting to send.</p> :
      <ul className="divide-y divide-slate-100">{scheduled.map((r) => <li key={r.id} className="flex flex-col gap-3 py-3.5 text-sm sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="min-w-0"><p className="font-semibold text-navy-900">{r.customer_name}</p><p className="truncate text-slate-500">{[r.customer_email, r.customer_phone].filter(Boolean).join(" · ")}</p><p className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-800 ring-1 ring-amber-100">Sends {fmt(r.send_at!)}</p></div>
        <form action={dontAsk} className="shrink-0"><input type="hidden" name="id" value={r.id} /><button className="min-h-[44px] w-full rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 sm:w-auto">Don&apos;t ask</button></form></li>)}</ul>}
    </section>}
    <LiveRefresh /><section className="card px-4 sm:px-6" id="history"><div className="mb-4 flex flex-wrap items-baseline justify-between gap-3"><div><h2 className="text-lg font-semibold">Recent activity</h2><p className="mt-0.5 text-sm text-slate-500">Everyone you&apos;ve asked, how, and when. Tap “What they got” to see the exact message.</p></div><div className="flex items-baseline gap-3">{activityTotal > 0 && <p className="text-xs text-slate-500">{activityTotal} total · page {page} of {pageCount}</p>}<a href="/api/requests/export" download className="inline-flex min-h-[40px] items-center rounded-md border border-slate-300 px-3 py-1.5 text-sm font-semibold text-navy-900 hover:bg-slate-50">Download CSV</a></div></div>
      {activityTotal === 0 ? <div className="rounded-md border border-dashed border-slate-300 px-6 py-10 text-center"><p className="text-sm font-medium text-navy-900">No review requests yet</p><p className="mt-1 text-sm text-slate-500">Ask a customer above, or connect the tools you already use. Every request and follow-up will show here with its status.</p></div> : <>
      {pageCount > 1 && pager("mb-4 border-b border-slate-100 pb-4")}
      <ul className="-mx-1 space-y-2.5 md:hidden">{rows.map((r) => { const ch = chip(r); const fu = followUp(r); return <li key={r.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="truncate text-[15px] font-semibold text-navy-900">{r.customer_name}</p>
          {r.customer_email && <p className="mt-0.5 truncate text-sm text-slate-500">{r.customer_email}</p>}{r.customer_phone && <p className="text-sm text-slate-500">{r.customer_phone}</p>}</div>
          <span className="flex shrink-0 flex-col items-end gap-1"><span title={queuedTip(r)} className={`rounded-full px-2.5 py-1 text-xs font-semibold ${ch.cls}`}>{ch.label}</span></span></div>
        <div className="mt-3 flex flex-wrap gap-1.5 text-xs"><span className="rounded-md bg-slate-50 px-2 py-1 font-medium text-slate-600 ring-1 ring-slate-100">{channel(r)}</span><span className="rounded-md bg-slate-50 px-2 py-1 font-medium text-slate-600 ring-1 ring-slate-100">{source(r)}</span></div>
        <dl className="mt-3 grid grid-cols-2 gap-3 border-t border-slate-100 pt-3 text-xs"><div><dt className="text-slate-400">Sent</dt><dd className="mt-0.5 font-medium text-slate-700">{fmt(r.created_at)}</dd></div>
          <div><dt className="text-slate-400">Follow-up</dt><dd className="mt-0.5 font-medium text-slate-700">{fu}</dd>{canCancel(r) && <CancelFU id={r.id} />}</div></dl><WhatTheyGot r={r} u={u} /></li>; })}</ul>
      <div className="hidden md:block"><table className="w-full table-fixed text-left text-sm"><colgroup><col className="w-[28%]" /><col className="w-[11%]" /><col className="w-[11%]" /><col className="w-[10%]" /><col className="w-[20%]" /><col className="w-[20%]" /></colgroup><thead className="text-xs uppercase tracking-wider text-slate-500"><tr><th className="py-2 pr-3 font-medium">Customer</th><th className="pr-3 font-medium">Channel</th><th className="pr-3 font-medium">Source</th><th className="pr-3 font-medium">Status</th><th className="pr-3 font-medium">Sent</th><th className="font-medium">Follow-up</th></tr></thead>
        <tbody>{rows.map((r) => { const ch = chip(r); return <tr key={r.id} className="border-t border-slate-100 align-top"><td className="min-w-0 py-3 pr-3"><p className="truncate font-medium text-navy-900">{r.customer_name}</p><p className="truncate text-xs text-slate-500 lg:max-w-xs">{[r.customer_email, r.customer_phone].filter(Boolean).join(" · ")}</p><WhatTheyGot r={r} u={u} /></td>
          <td className="py-3 pr-3 text-slate-600">{channel(r)}</td><td className="py-3 pr-3 text-slate-500">{source(r)}</td>
          <td className="py-3 pr-3"><span title={queuedTip(r)} className={`whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-semibold ${ch.cls}`}>{ch.label}</span></td>
          <td className="whitespace-nowrap py-3 pr-3 text-slate-500">{fmt(r.created_at)}</td>
          <td className="whitespace-nowrap py-3 text-slate-500">{followUp(r)}{canCancel(r) && <CancelFU id={r.id} />}</td></tr>; })}</tbody></table></div></>}
      {pageCount > 1 && pager("mt-4 border-t border-slate-100 pt-4")}
      {rows.some((r) => r.status === "queued") && <p className="mt-3 text-xs text-slate-500"><strong>Queued</strong> means saved but not sent yet, for example a text that couldn&apos;t be delivered. Add the customer&apos;s email to send now.</p>}
    </section>
  </main></div>;
}

function ReviewGrowth({ p, sent }: { p: ReturnType<typeof reviewProgress>; sent: number }) {
  if (!p) return <section className="card"><h2 className="text-lg font-semibold">Your Google reviews</h2><p className="mt-1 text-sm text-slate-500">We&apos;ll save today&apos;s review count as your starting point and check it daily, so you can see your reviews grow.</p></section>;
  const before = p.first.review_count ?? 0, now = p.latest.review_count ?? 0, gained = now - before;
  const r = (x: number | null) => x == null ? "—" : x.toFixed(1);
  return <section className="card" aria-label="Your Google reviews">
    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
      <div><h2 className="text-lg font-semibold">Your Google reviews</h2><p className="mt-1 text-sm text-slate-600">Since you started with ReviewAsk on {fmt(p.first.created_at)}</p></div>
      <div className="flex items-center gap-4 sm:gap-6">
        <div className="text-center"><p className="text-xs font-medium uppercase tracking-wider text-slate-500">When you started</p><p className="mt-1 text-3xl font-semibold text-slate-500">{before}</p><p className="text-xs text-slate-400">{r(p.first.rating)}★</p></div>
        <span className="text-2xl text-slate-300" aria-hidden>→</span>
        <div className="text-center"><p className="text-xs font-medium uppercase tracking-wider text-slate-500">Now</p><p className="mt-1 text-5xl font-bold tracking-tight text-navy-900">{now}</p><p className="text-xs text-slate-500">{r(p.latest.rating)}★</p></div>
        <span className={`rounded-full px-3 py-1 text-sm font-semibold ${gained > 0 ? "bg-lime-50 text-lime-700 ring-1 ring-lime-100" : "bg-slate-100 text-slate-500"}`}>{gained > 0 ? "+" : ""}{gained} new</span>
      </div></div>
    <ReviewLine points={p.history.map((h) => ({ t: h.created_at, n: h.review_count ?? 0 }))} />
    <p className="mt-4 border-t border-slate-100 pt-3 text-xs text-slate-500">{sent} ask{sent === 1 ? "" : "s"} sent since you started. Counts come from Google and update about once a day (last checked {fmt(p.latest.created_at)}). Google doesn&apos;t say which customer left which review, so we show total growth.</p></section>;
}

// True when any integration that can trigger asks is connected (Housecall counts once its webhook secret is set, matching Settings).
function hasConnectedTool(u: User) {
  return !!(u.jobber_connected || (u.housecall_connected && u.housecall_webhook_secret) || u.square_connected || u.stripe_connect_connected || u.qbo_connected || u.zapier_connected_at);
}

function NextAction({ u, recentWeek, remaining }: { u: User; recentWeek: number; remaining: number }) {
  const a = remaining === 0 ? { t: "You've used this month's asks", d: "Your plan resets at the start of next month.", href: "/settings", cta: "See plan" }
    : !hasConnectedTool(u) && !u.auto_setup_requested_at ? { t: "Ask every customer without lifting a finger", d: "Connect your tool once and each finished job gets a review ask automatically.", href: "/settings#automatic", cta: "Connect your tool" }
    : recentWeek === 0 ? { t: "No one asked this week", d: "Paste last month's customers from a spreadsheet — it takes a minute.", href: "#bulk", cta: "Import customers" }
    : { t: "Keep it going", d: "Just finished a job? Ask that customer while it's fresh.", href: "#quick", cta: "Ask a customer" };
  return <section className="flex flex-col items-start justify-between gap-3 rounded-xl border border-lime-200 bg-lime-50 p-5 shadow-sm sm:flex-row sm:items-center">
    <div><p className="text-xs font-semibold uppercase tracking-wider text-lime-700">Next step</p><p className="mt-1 font-semibold text-navy-900">{a.t}</p><p className="text-sm text-slate-600">{a.d}</p></div>
    <Link href={a.href} className="btn-lime shrink-0">{a.cta}</Link></section>;
}

/** The exact message content this customer was sent, rebuilt from the same templates the sender uses. */
function WhatTheyGot({ r, u }: { r: ReviewRequest; u: User }) {
  if (!u.business_name || !u.review_url || !["sent", "queued", "suppressed"].includes(r.status)) return null;
  // Asks created while the old /r/ hop was live were sent that link; everything else links straight to Google.
  const w = legacyTrackedWindow();
  const legacy = !!(r.unsubscribe_token && w.from && r.created_at >= w.from && (!w.to || r.created_at < w.to));
  const link = legacy ? `${appUrl()}/r/${r.unsubscribe_token}` : u.review_url;
  const parts: { title: string; body: string }[] = [];
  if (r.channel.includes("email")) { const m = buildReviewEmail(u.business_name, r.customer_name, link, unsubscribeUrl(r.unsubscribe_token || "")); parts.push({ title: `Email · Subject: ${m.subject}`, body: m.text }); }
  if (r.channel.includes("sms")) parts.push({ title: "Text message", body: `${buildReviewSms(u.business_name, r.customer_name, link)}\nReply STOP to opt out.` });
  if (r.reminded_at) {
    if (r.channel.includes("email")) { const m = buildReminderEmail(u.business_name, r.customer_name, link, unsubscribeUrl(r.unsubscribe_token || "")); parts.push({ title: `Follow-up email · Subject: ${m.subject}`, body: m.text }); }
    if (r.channel.includes("sms")) parts.push({ title: "Follow-up text", body: `${buildReminderSms(u.business_name, r.customer_name, link)}\nReply STOP to opt out.` });
  }
  if (!parts.length) return null;
  return <details className="group mt-2 min-w-0 text-xs"><summary className="inline-flex cursor-pointer list-none items-center gap-1 font-semibold text-slate-600 underline underline-offset-4 [&::-webkit-details-marker]:hidden"><span className="inline-block transition-transform group-open:rotate-90" aria-hidden>›</span>What they got</summary>
    <div className="mt-2 max-h-80 space-y-2 overflow-y-auto rounded-md">{parts.map((p) => <div key={p.title} className="min-w-0 rounded-md border border-slate-200 bg-slate-50 p-3"><p className="mb-1 break-words font-semibold text-slate-700">{p.title}</p><pre className="whitespace-pre-wrap break-words font-sans leading-relaxed text-slate-600 [overflow-wrap:anywhere]">{p.body}</pre></div>)}</div></details>;
}

const fmt = (t: string, prefix = "") => <LocalTime t={t} prefix={prefix} />;
function channel(r: ReviewRequest) { return channelLabel(r); }
function source(r: ReviewRequest) { return sourceLabel(r); }
function canCancel(r: ReviewRequest) { return !!r.remind_at && !r.reminded_at && r.status === "sent"; }
function CancelFU({ id }: { id: number }) { return <form action={cancelFollowUp} className="mt-1"><input type="hidden" name="id" value={id} /><button className="min-h-[40px] rounded-md border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Cancel follow-up</button></form>; }
function followUp(r: ReviewRequest) { return r.followup_cancelled_at ? "Cancelled" : r.reminded_at ? fmt(r.reminded_at) : r.remind_at && r.status === "sent" ? fmt(r.remind_at, "Due ") : "—"; }
function queuedTip(r: ReviewRequest) { return r.status === "queued" ? "Saved, not sent yet. Add an email to send now." : undefined; }
function chip(r: ReviewRequest) {
  if (r.status === "failed") return { label: statusLabel(r), cls: "bg-red-50 text-red-700 ring-1 ring-red-100" };
  if (r.status === "cancelled") return { label: statusLabel(r), cls: "bg-slate-100 text-slate-500" };
  if (r.status === "sending") return { label: statusLabel(r), cls: "bg-slate-100 text-slate-600" };
  if (r.status === "suppressed") return { label: statusLabel(r), cls: "bg-slate-100 text-slate-500" };
  if (r.status === "queued") return { label: statusLabel(r), cls: "bg-slate-100 text-slate-600" };
  if (r.reminded_at) return { label: statusLabel(r), cls: "bg-navy-900 text-white" };
  return { label: statusLabel(r), cls: "bg-lime-50 text-lime-700 ring-1 ring-lime-100" };
}

/** Page numbers with gaps (0 = ellipsis): first, last, and current ±1. */
function pageNums(page: number, count: number): number[] {
  const keep = new Set([1, count, page - 1, page, page + 1].filter((n) => n >= 1 && n <= count));
  const out: number[] = []; let prev = 0;
  for (const n of Array.from(keep).sort((a, b) => a - b)) { if (n - prev > 1) out.push(0); out.push(n); prev = n; }
  return out;
}

function pageArrow(label: string, n: number, enabled: boolean, aria: string) {
  return enabled
    ? <Link key={aria} href={`/dashboard?page=${n}#history`} aria-label={aria} className="min-w-[2.25rem] rounded-md border border-slate-300 px-2.5 py-1.5 text-center text-sm font-semibold text-navy-900 hover:bg-slate-50">{label}</Link>
    : <span key={aria} aria-hidden="true" className="min-w-[2.25rem] rounded-md border border-slate-200 px-2.5 py-1.5 text-center text-sm text-slate-300">{label}</span>;
}
