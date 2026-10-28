import Link from "next/link";
import LocalTime from "@/components/LocalTime";
import { redirect } from "next/navigation";
import AppNav from "@/components/AppNav";
import QuickAsk from "@/components/QuickAsk";
import BulkUpload from "@/components/BulkUpload";
import { processDueReminders, processDueScheduledAsks, SEND_DELAY_HOURS } from "@/lib/send";
import { dontAsk, cancelFollowUp } from "@/app/actions";
import { requireUser } from "@/lib/session";
import { db, isActive, usedThisMonth, MONTHLY_QUOTA, getUser, type ReviewRequest } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import LiveRefresh from "@/components/LiveRefresh";
import { applySubscription } from "@/lib/billing";
export const dynamic = "force-dynamic";

export default async function Page({ searchParams }: { searchParams: { session_id?: string; dev_unlocked?: string } }) {
  let u = await requireUser();
  if (!u.business_name || !u.review_url) redirect("/onboarding");
  const provName = u.auto_provider === "housecall" ? "Housecall Pro" : "Jobber";
  const autoLabel = !u.auto_enabled ? "Turn on automatic asks" : u.jobber_connected ? (u.auto_provider === "housecall" && u.auto_setup_requested_at ? "On · Jobber (Housecall Pro requested)" : "On · Jobber") : u.auto_setup_requested_at ? "Setup requested" : "Finish connecting";
  const autoSub = !u.auto_enabled ? "One switch. Every customer gets asked." : u.jobber_connected ? "Asking every customer automatically." : u.auto_setup_requested_at ? `We’re connecting ${provName} for you.` : "Connect the tools you already use in Settings.";
  // Sync right after Checkout so it works even before the webhook arrives.
  if (searchParams.session_id && stripe && !isActive(u)) {
    try {
      const s = await stripe.checkout.sessions.retrieve(searchParams.session_id, { expand: ["subscription"] });
      if (s.client_reference_id === String(u.id) && s.subscription && typeof s.subscription !== "string") { applySubscription(s.subscription, u.id); u = getUser(u.id)!; }
    } catch (e) { console.error(e); }
  }
  const active = isActive(u);
  // Best-effort: send this account's due follow-ups so it works without an external cron.
  if (active) { try { await processDueScheduledAsks(u.id, 50); await processDueReminders(u.id, 50); } catch (e) { console.error("reminders", e); } }
  const used = usedThisMonth(u.id);
  const stats = db.prepare(`SELECT
    SUM(CASE WHEN reminded_at IS NOT NULL THEN 1 ELSE 0 END) reminded,
    SUM(CASE WHEN status='failed' THEN 1 ELSE 0 END) failed,
    SUM(CASE WHEN source='webhook' THEN 1 ELSE 0 END) auto,
    SUM(CASE WHEN remind_at IS NOT NULL AND reminded_at IS NULL AND status='sent' THEN 1 ELSE 0 END) pending
    FROM review_requests WHERE user_id=? AND created_at >= datetime('now','start of month')`).get(u.id) as Record<string, number | null>;
  const remaining = Math.max(0, MONTHLY_QUOTA - used);
  const rows = db.prepare("SELECT * FROM review_requests WHERE user_id=? AND status != 'scheduled' ORDER BY id DESC LIMIT 100").all(u.id) as ReviewRequest[];
  const scheduled = db.prepare("SELECT * FROM review_requests WHERE user_id=? AND status='scheduled' ORDER BY send_at").all(u.id) as ReviewRequest[];
  const pct = Math.min(100, (used / MONTHLY_QUOTA) * 100);
  return <div><AppNav /><main id="main" className="mx-auto max-w-5xl space-y-6 px-4 py-6 sm:py-8">
    {searchParams.dev_unlocked && <p className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">Dev mode: Stripe isn&apos;t configured, so your account was unlocked as a trial.</p>}
    {!active && <div className="flex flex-col items-start justify-between gap-3 rounded-lg border border-slate-200 bg-white p-5 sm:flex-row sm:items-center">
      <div><p className="font-semibold">Your account isn&apos;t active yet.</p><p className="text-sm text-slate-500">Start your 7-day free trial to send review requests.</p></div>
      <Link href="/onboarding?step=pay" className="btn-lime">Start free trial</Link></div>}
    {active && rows.length === 0 && <section className="card" id="get-started"><h2 className="text-lg font-semibold">Get started in 3 steps</h2>
      <p className="mt-1 text-sm text-slate-500">Requests go out by email today. Text messages are rolling out.</p>
      <ol className="mt-4 space-y-3 text-sm">
        <li className="flex gap-3"><span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${u.jobber_connected ? "bg-lime-50 text-lime-700 ring-1 ring-lime-100" : "bg-navy-900 text-white"}`}>{u.jobber_connected ? "✓" : "1"}</span><div><p className="font-medium text-navy-900">Connect Jobber or Housecall Pro</p><p className="text-slate-500">{u.jobber_connected ? "Connected. Every customer gets asked automatically." : <>Do this once and every customer gets asked. <Link href="/settings#automatic" className="font-medium text-navy-900 underline underline-offset-4">Connect now</Link></>}</p></div></li>
        <li className="flex gap-3"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-navy-900 text-xs font-semibold text-white">2</span><div><p className="font-medium text-navy-900">Send your first ask</p><p className="text-slate-500">Send one to yourself first to see what customers get. Use <Link href="/quick" className="font-medium text-navy-900 underline underline-offset-4">Quick ask</Link>.</p></div></li>
        <li className="flex gap-3"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">3</span><div><p className="font-medium text-navy-900">Optional: ask past customers</p><p className="text-slate-500">Paste recent customers from a spreadsheet to ask them too. <a href="#bulk" className="font-medium text-navy-900 underline underline-offset-4">Paste a spreadsheet</a></p></div></li>
      </ol></section>}
    <section className="card" id="quick"><div className="flex flex-wrap items-baseline justify-between gap-2"><h2 className="text-lg font-semibold">Ask a customer for a review</h2><Link href="/settings#automatic" className="text-sm text-slate-500 underline underline-offset-4">{autoLabel}: {autoSub}</Link></div>
      <p className="mb-4 mt-1 text-sm text-slate-500">Name + email (or phone), tap Send.</p>
      <QuickAsk disabled={!active || used >= MONTHLY_QUOTA} /></section>
    <section className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-slate-200 bg-slate-200 md:grid-cols-4">
      {[["Requests this month", used, `${pct.toFixed(0)}% of plan`], ["Follow-ups sent", stats.reminded ?? 0, `${stats.pending ?? 0} scheduled`], ["Sent automatically", stats.auto ?? 0, "from your connected tools"], ["Requests left", remaining, `of ${MONTHLY_QUOTA} this month · ${u.subscription_status === "active" ? "Active" : u.subscription_status === "trialing" ? "Trial" : "Not active"}`]].map(([l, v, sub]) =>
        <div key={String(l)} className="bg-white p-4 sm:p-5"><p className="text-[11px] font-medium uppercase leading-snug tracking-wider text-slate-500 sm:text-xs">{l}</p>
          <p className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight text-navy-900">{v}</p><p className="mt-1 text-xs text-slate-500">{sub}</p></div>)}
    </section>
    <div className="h-1.5 rounded-full bg-slate-100"><div className="h-1.5 rounded-full bg-navy-900" style={{ width: `${pct}%` }} /></div>
      <details className="card" id="bulk"><summary className="cursor-pointer text-sm font-semibold text-slate-600">Have a list? Send to many customers at once</summary>
        <p className="mb-5 mt-1 text-sm text-slate-500">Copy customer rows from Excel or Google Sheets and paste — no exporting. <a href="/sample-customers.csv" download className="font-medium text-navy-900 underline underline-offset-4">Download sample spreadsheet</a></p>
        <BulkUpload disabled={!active || used >= MONTHLY_QUOTA} remaining={remaining} /></details>
    <p className="text-sm text-slate-500">Tired of typing customers in? <Link href="/settings#automatic" className="font-medium text-navy-900 underline underline-offset-4">Turn on automatic asks</Link> once, and every customer gets asked automatically.</p>
    <section className="card" id="scheduled"><h2 className="text-lg font-semibold">Scheduled asks</h2>
      <p className="mb-4 mt-1 text-sm text-slate-500">Automatic asks from your connected tools wait {SEND_DELAY_HOURS} hours before sending, so you can stop one if something went wrong. Asks you type in or paste send right away. Every customer still gets asked unless you stop it.</p>
      {scheduled.length === 0 ? <p className="text-sm text-slate-500">Nothing waiting to send.</p> :
      <ul className="divide-y divide-slate-100">{scheduled.map((r) => <li key={r.id} className="flex flex-col gap-3 py-3.5 text-sm sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="min-w-0"><p className="font-semibold text-navy-900">{r.customer_name}</p><p className="truncate text-slate-500">{[r.customer_email, r.customer_phone].filter(Boolean).join(" · ")}</p><p className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-800 ring-1 ring-amber-100">Sends {fmt(r.send_at!)}</p></div>
        <form action={dontAsk} className="shrink-0"><input type="hidden" name="id" value={r.id} /><button className="min-h-[44px] w-full rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 sm:w-auto">Don&apos;t ask</button></form></li>)}</ul>}
    </section>
    <section className="flex flex-wrap items-center gap-2 text-sm"><span className="text-slate-500">Billing:</span><form action="/api/stripe/portal?view=invoices&from=dashboard" method="post"><button className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-semibold text-navy-900 hover:bg-slate-50">Invoices</button></form><form action="/api/stripe/portal?view=payment_methods&from=dashboard" method="post"><button className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-semibold text-navy-900 hover:bg-slate-50">Payment methods</button></form></section>
    <LiveRefresh /><section className="card px-4 sm:px-6" id="history"><div className="mb-4 flex items-baseline justify-between gap-3"><h2 className="text-lg font-semibold">History</h2><div className="flex items-baseline gap-3">{rows.length > 0 && <p className="text-xs text-slate-500">{rows.length} most recent</p>}<a href="/api/requests/export" download className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-semibold text-navy-900 hover:bg-slate-50">Download CSV</a></div></div>
      {rows.length === 0 ? <div className="rounded-md border border-dashed border-slate-300 px-6 py-10 text-center"><p className="text-sm font-medium text-navy-900">No review requests yet</p><p className="mt-1 text-sm text-slate-500">Ask a customer above, or connect the tools you already use. Every request and follow-up will show here with its status.</p></div> : <>
      <ul className="-mx-1 space-y-2.5 md:hidden">{rows.map((r) => { const ch = chip(r); const fu = followUp(r); return <li key={r.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="truncate text-[15px] font-semibold text-navy-900">{r.customer_name}</p>
          {r.customer_email && <p className="mt-0.5 truncate text-sm text-slate-500">{r.customer_email}</p>}{r.customer_phone && <p className="text-sm text-slate-500">{r.customer_phone}</p>}</div>
          <span title={queuedTip(r)} className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${ch.cls}`}>{ch.label}</span></div>
        <div className="mt-3 flex flex-wrap gap-1.5 text-xs"><span className="rounded-md bg-slate-50 px-2 py-1 font-medium text-slate-600 ring-1 ring-slate-100">{channel(r)}</span><span className="rounded-md bg-slate-50 px-2 py-1 font-medium text-slate-600 ring-1 ring-slate-100">{source(r)}</span></div>
        <dl className="mt-3 grid grid-cols-2 gap-3 border-t border-slate-100 pt-3 text-xs"><div><dt className="text-slate-400">Sent</dt><dd className="mt-0.5 font-medium text-slate-700">{fmt(r.created_at)}</dd></div>
          <div><dt className="text-slate-400">Follow-up</dt><dd className="mt-0.5 font-medium text-slate-700">{fu}</dd>{canCancel(r) && <CancelFU id={r.id} />}</div></dl></li>; })}</ul>
      <div className="hidden md:block"><table className="w-full text-left text-sm"><thead className="text-xs uppercase tracking-wider text-slate-500"><tr><th className="py-2 pr-3 font-medium">Customer</th><th className="pr-3 font-medium">Channel</th><th className="pr-3 font-medium">Source</th><th className="pr-3 font-medium">Status</th><th className="pr-3 font-medium">Sent</th><th className="font-medium">Follow-up</th></tr></thead>
        <tbody>{rows.map((r) => { const ch = chip(r); return <tr key={r.id} className="border-t border-slate-100 align-top"><td className="py-3 pr-3"><p className="font-medium text-navy-900">{r.customer_name}</p><p className="max-w-[16rem] truncate text-xs text-slate-500 lg:max-w-xs">{[r.customer_email, r.customer_phone].filter(Boolean).join(" · ")}</p></td>
          <td className="py-3 pr-3 text-slate-600">{channel(r)}</td><td className="py-3 pr-3 text-slate-500">{source(r)}</td>
          <td className="py-3 pr-3"><span title={queuedTip(r)} className={`whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-semibold ${ch.cls}`}>{ch.label}</span></td>
          <td className="whitespace-nowrap py-3 pr-3 text-slate-500">{fmt(r.created_at)}</td>
          <td className="whitespace-nowrap py-3 text-slate-500">{followUp(r)}{canCancel(r) && <CancelFU id={r.id} />}</td></tr>; })}</tbody></table></div></>}
      {rows.some((r) => r.status === "queued") && <p className="mt-3 text-xs text-slate-500"><strong>Queued</strong> means saved but not sent yet. Text messages are still rolling out, so phone-only asks wait here. Add the customer&apos;s email to send now.</p>}
    </section>
  </main></div>;
}

const fmt = (t: string, prefix = "") => <LocalTime t={t} prefix={prefix} />;
function channel(r: ReviewRequest) { return ({ email: "Email", sms: "Text", "email+sms": "Email + text" } as Record<string, string>)[r.channel] || r.channel.replace("+", " + "); }
function source(r: ReviewRequest) { return ({ manual: "Typed in", bulk: "Spreadsheet", webhook: "Automatic", test: "Test" } as Record<string, string>)[r.source || "manual"] || "Typed in"; }
function canCancel(r: ReviewRequest) { return !!r.remind_at && !r.reminded_at && r.status === "sent"; }
function CancelFU({ id }: { id: number }) { return <form action={cancelFollowUp} className="mt-1"><input type="hidden" name="id" value={id} /><button className="rounded-md border border-slate-300 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50">Cancel follow-up</button></form>; }
function followUp(r: ReviewRequest) { return r.followup_cancelled_at ? "Cancelled" : r.reminded_at ? fmt(r.reminded_at) : r.remind_at && r.status === "sent" ? fmt(r.remind_at, "Due ") : "—"; }
function queuedTip(r: ReviewRequest) { return r.status === "queued" ? "Saved, not sent yet. Text messages are rolling out; add an email to send now." : undefined; }
function chip(r: ReviewRequest) {
  if (r.status === "failed") return { label: "Failed", cls: "bg-red-50 text-red-700 ring-1 ring-red-100" };
  if (r.status === "cancelled") return { label: "Not asked", cls: "bg-slate-100 text-slate-500" };
  if (r.status === "sending") return { label: "Sending", cls: "bg-slate-100 text-slate-600" };
  if (r.status === "suppressed") return { label: "Unsubscribed", cls: "bg-slate-100 text-slate-500" };
  if (r.status === "queued") return { label: "Queued", cls: "bg-slate-100 text-slate-600" };
  if (r.reminded_at) return { label: "Reminded", cls: "bg-navy-900 text-white" };
  return { label: "Sent", cls: "bg-lime-50 text-lime-700 ring-1 ring-lime-100" };
}
