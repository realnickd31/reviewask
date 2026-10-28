import Link from "next/link";
import { redirect } from "next/navigation";
import AppNav from "@/components/AppNav";
import SendForm from "@/components/SendForm";
import BulkUpload from "@/components/BulkUpload";
import { processDueReminders, processDueScheduledAsks, SEND_DELAY_HOURS } from "@/lib/send";
import { dontAsk } from "@/app/actions";
import { requireUser } from "@/lib/session";
import { db, isActive, usedThisMonth, MONTHLY_QUOTA, getUser, type ReviewRequest } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { applySubscription } from "@/lib/billing";
export const dynamic = "force-dynamic";

export default async function Page({ searchParams }: { searchParams: { session_id?: string; dev_unlocked?: string } }) {
  let u = await requireUser();
  if (!u.business_name || !u.review_url) redirect("/onboarding");
  const provName = u.auto_provider === "housecall" ? "Housecall Pro" : "Jobber";
  const autoLabel = !u.auto_enabled ? "Turn on automatic asks" : u.jobber_connected ? (u.auto_provider === "housecall" && u.auto_setup_requested_at ? "On · Jobber (Housecall Pro requested)" : "On · Jobber") : u.auto_setup_requested_at ? "Setup requested" : "Finish connecting";
  const autoSub = !u.auto_enabled ? "One switch. Every finished job gets asked." : u.jobber_connected ? "Asking automatically after every job." : u.auto_setup_requested_at ? `We’re connecting ${provName} for you.` : "Connect your job software in Settings.";
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
  return <div><AppNav /><main id="main" className="mx-auto max-w-5xl space-y-6 px-4 py-8">
    {searchParams.dev_unlocked && <p className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">Dev mode: Stripe isn&apos;t configured, so your account was unlocked as a trial.</p>}
    {!active && <div className="flex flex-col items-start justify-between gap-3 rounded-lg border border-slate-200 bg-white p-5 sm:flex-row sm:items-center">
      <div><p className="font-semibold">Your account isn&apos;t active yet.</p><p className="text-sm text-slate-500">Start your 7-day free trial to send review requests.</p></div>
      <Link href="/onboarding?step=pay" className="btn-lime">Start free trial</Link></div>}
    {active && rows.length === 0 && <section className="card" id="get-started"><h2 className="text-lg font-semibold">Get started in 3 steps</h2>
      <p className="mt-1 text-sm text-slate-500">Requests go out by email today. Text messages are rolling out.</p>
      <ol className="mt-4 space-y-3 text-sm">
        <li className="flex gap-3"><span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${u.jobber_connected ? "bg-lime-50 text-lime-700 ring-1 ring-lime-100" : "bg-navy-900 text-white"}`}>{u.jobber_connected ? "✓" : "1"}</span><div><p className="font-medium text-navy-900">Connect Jobber or Housecall Pro</p><p className="text-slate-500">{u.jobber_connected ? "Connected. Every finished job gets asked automatically." : <>Do this once and every finished job gets asked. <Link href="/settings#automatic" className="font-medium text-navy-900 underline underline-offset-4">Connect now</Link></>}</p></div></li>
        <li className="flex gap-3"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-navy-900 text-xs font-semibold text-white">2</span><div><p className="font-medium text-navy-900">Send your first ask</p><p className="text-slate-500">Send one to yourself first to see what customers get. Use <a href="#send" className="font-medium text-navy-900 underline underline-offset-4">Send one request</a> below or <Link href="/quick" className="font-medium text-navy-900 underline underline-offset-4">Quick ask</Link>.</p></div></li>
        <li className="flex gap-3"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">3</span><div><p className="font-medium text-navy-900">Optional: ask past customers</p><p className="text-slate-500">Paste recent customers from a spreadsheet to ask them too. <a href="#bulk" className="font-medium text-navy-900 underline underline-offset-4">Paste a spreadsheet</a></p></div></li>
      </ol></section>}
    <section className="grid gap-3 sm:grid-cols-3">
      <Link href="/quick" className="rounded-lg border border-navy-900 bg-navy-900 p-5 text-white hover:opacity-95"><p className="text-lg font-semibold">Quick ask →</p><p className="mt-1 text-sm text-slate-200">Name + email (or phone), tap Send. Built for techs on the go.</p></Link>
      <a href="#bulk" className="rounded-lg border border-slate-200 bg-white p-5 hover:border-navy-900"><p className="text-lg font-semibold text-navy-900">Paste a spreadsheet</p><p className="mt-1 text-sm text-slate-500">Copy rows from Excel or Sheets, paste, send.</p></a>
      <Link href="/settings#automatic" className="rounded-lg border border-slate-200 bg-white p-5 hover:border-navy-900"><p className="text-lg font-semibold text-navy-900">{autoLabel}</p><p className="mt-1 text-sm text-slate-500">{autoSub}</p></Link>
    </section>
    <section className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-slate-200 bg-slate-200 md:grid-cols-4">
      {[["Requests this month", used, `${pct.toFixed(0)}% of plan`], ["Follow-ups sent", stats.reminded ?? 0, `${stats.pending ?? 0} scheduled`], ["Sent automatically", stats.auto ?? 0, "from your job software"], ["Requests left", remaining, `of ${MONTHLY_QUOTA} this month · ${u.subscription_status === "active" ? "Active" : u.subscription_status === "trialing" ? "Trial" : "Not active"}`]].map(([l, v, sub]) =>
        <div key={String(l)} className="bg-white p-5"><p className="text-xs font-medium uppercase tracking-wider text-slate-500">{l}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-navy-900">{v}</p><p className="mt-1 text-xs text-slate-500">{sub}</p></div>)}
    </section>
    <div className="h-1.5 rounded-full bg-slate-100"><div className="h-1.5 rounded-full bg-navy-900" style={{ width: `${pct}%` }} /></div>
    <div className="grid gap-6 md:grid-cols-2">
      <section className="card" id="send"><h1 className="text-lg font-semibold">Send one request</h1>
        <p className="mb-5 mt-1 text-sm text-slate-500">From <b>{u.business_name}</b> · day-3 follow-up included</p>
        <SendForm disabled={!active || used >= MONTHLY_QUOTA} /></section>
      <section className="card" id="bulk"><h2 className="text-lg font-semibold">Paste a spreadsheet</h2>
        <p className="mb-5 mt-1 text-sm text-slate-500">Copy customer rows from Excel or Google Sheets and paste — no exporting. <a href="/sample-customers.csv" download className="font-medium text-navy-900 underline underline-offset-4">Download sample spreadsheet</a></p>
        <BulkUpload disabled={!active || used >= MONTHLY_QUOTA} remaining={remaining} /></section>
    </div>
    <p className="text-sm text-slate-500">Tired of typing customers in? <Link href="/settings#automatic" className="font-medium text-navy-900 underline underline-offset-4">Turn on automatic asks</Link> once, and every finished job gets asked automatically.</p>
    <section className="card" id="scheduled"><h2 className="text-lg font-semibold">Scheduled asks</h2>
      <p className="mb-4 mt-1 text-sm text-slate-500">Automatic asks from your job software wait {SEND_DELAY_HOURS} hours before sending, so you can stop one after a job that went wrong. Asks you type in or paste send right away. Every customer still gets asked unless you stop it.</p>
      {scheduled.length === 0 ? <p className="text-sm text-slate-500">Nothing waiting to send.</p> :
      <ul className="divide-y">{scheduled.map((r) => <li key={r.id} className="flex items-center justify-between gap-4 py-3 text-sm">
        <div><p className="font-medium">{r.customer_name}</p><p className="text-slate-500">{[r.customer_email, r.customer_phone].filter(Boolean).join(" · ")} · sends {fmt(r.send_at!)}</p></div>
        <form action={dontAsk}><input type="hidden" name="id" value={r.id} /><button className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium hover:bg-slate-50">Don&apos;t ask</button></form></li>)}</ul>}
    </section>
    <section className="card overflow-x-auto"><h2 className="mb-4 text-lg font-semibold">History</h2>
      {rows.length === 0 ? <div className="rounded-md border border-dashed border-slate-300 px-6 py-10 text-center"><p className="text-sm font-medium text-navy-900">No review requests yet</p><p className="mt-1 text-sm text-slate-500">Send one above, upload a spreadsheet, or connect your job software. Every request and follow-up will show here with its status.</p></div> :
      <table className="w-full min-w-[720px] text-left text-sm"><thead className="text-xs uppercase tracking-wider text-slate-500"><tr><th className="py-2">Customer</th><th>Contact</th><th>Channel</th><th>Source</th><th>Status</th><th>Sent</th><th>Follow-up</th></tr></thead>
        <tbody>{rows.map((r) => { const ch = chip(r); return <tr key={r.id} className="border-t"><td className="py-3 font-medium">{r.customer_name}</td>
          <td className="text-slate-600">{[r.customer_email, r.customer_phone].filter(Boolean).join(" · ")}</td><td>{r.channel.replace("+", " + ")}</td>
          <td className="text-slate-500">{({ manual: "Typed in", bulk: "Spreadsheet", webhook: "Job software", test: "Test" } as Record<string, string>)[r.source || "manual"] || "Typed in"}</td>
          <td><span title={r.status === "queued" ? "Saved, not sent yet. Text messages are rolling out; add an email to send now." : undefined} className={`rounded-full px-2 py-0.5 text-xs font-semibold ${ch.cls}`}>{ch.label}</span></td>
          <td className="text-slate-500">{fmt(r.created_at)}</td>
          <td className="text-slate-500">{r.reminded_at ? fmt(r.reminded_at) : r.remind_at && r.status === "sent" ? `Due ${fmt(r.remind_at)}` : "—"}</td></tr>; })}</tbody></table>}
      {rows.some((r) => r.status === "queued") && <p className="mt-3 text-xs text-slate-500"><strong>Queued</strong> means saved but not sent yet. Text messages are still rolling out, so phone-only asks wait here. Add the customer&apos;s email to send now.</p>}
    </section>
  </main></div>;
}

function fmt(t: string) { return new Date(t.replace(" ", "T") + "Z").toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }); }
function chip(r: ReviewRequest) {
  if (r.status === "failed") return { label: "Failed", cls: "bg-red-50 text-red-700 ring-1 ring-red-100" };
  if (r.status === "cancelled") return { label: "Not asked", cls: "bg-slate-100 text-slate-500" };
  if (r.status === "sending") return { label: "Sending", cls: "bg-slate-100 text-slate-600" };
  if (r.status === "suppressed") return { label: "Unsubscribed", cls: "bg-slate-100 text-slate-500" };
  if (r.status === "queued") return { label: "Queued", cls: "bg-slate-100 text-slate-600" };
  if (r.reminded_at) return { label: "Reminded", cls: "bg-navy-900 text-white" };
  return { label: "Sent", cls: "bg-lime-50 text-lime-700 ring-1 ring-lime-100" };
}
