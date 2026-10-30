import { headers } from "next/headers";
import AppNav from "@/components/AppNav";
import BizForm from "@/components/BizForm";
import AutoToggle from "@/components/AutoToggle";
import { jobberConfigured } from "@/lib/jobber";
import { squareConfigured } from "@/lib/square";
import { qboConfigured } from "@/lib/quickbooks";
import { stripeConnectConfigured } from "@/lib/stripe-connect";
import { requireUser } from "@/lib/session";
import { isActive } from "@/lib/db";
import { saveSettings, saveSendDelay } from "../actions";
import ConnectorRequest from "@/components/ConnectorRequest";
import SendDelaySetting from "@/components/SendDelaySetting";
import ApiAccessCard from "@/components/ApiAccessCard";
import { clampDelay } from "@/lib/delay";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
export const dynamic = "force-dynamic";
export default async function Page({ searchParams }: { searchParams: { portal?: string; jobber?: string; square?: string; stripe?: string; quickbooks?: string } }) {
  const u = await requireUser();
  const h = headers();
  const base = process.env.APP_URL || `${h.get("x-forwarded-proto") || "http"}://${h.get("host")}`;
  const hookUrl = `${base.replace(/\/$/, "")}/api/zapier/webhook`;
  const apiBase = `${base.replace(/\/$/, "")}/api/v1`;
  let trialEnd = u.trial_end || null;
  if (u.subscription_status === "trialing" && !trialEnd && stripe && u.stripe_subscription_id) {
    try { const s = await stripe.subscriptions.retrieve(u.stripe_subscription_id); if (s.trial_end) { trialEnd = new Date(s.trial_end * 1000).toISOString(); db.prepare("UPDATE users SET trial_end=? WHERE id=?").run(trialEnd, u.id); } } catch (e) { console.error("trial_end", e); }
  }
  const plan = planBadge(u.subscription_status, trialEnd);
  return <div><AppNav /><main id="main" className="mx-auto max-w-4xl space-y-6 px-4 py-8 text-[15px] sm:py-10">
    <section className="card"><h1 className="mb-5 text-2xl font-bold text-navy-900">Business</h1><BizForm action={saveSettings} label="Save changes" name={u.business_name} url={u.review_url} /></section>
    <section className="card" id="automatic"><h2 className="mb-4 text-xl font-bold text-navy-900">Ask every customer automatically</h2>
      <AutoToggle enabled={!!u.auto_enabled} provider={u.auto_provider} jobberConnected={!!u.jobber_connected} jobberReady={jobberConfigured()}
        housecallConnected={!!u.housecall_connected} housecallReady={!!u.housecall_connected && !!u.housecall_webhook_secret} housecallStarted={!!u.housecall_api_key}
        setupEmail={u.auto_setup_email} setupRequested={!!u.auto_setup_requested_at} quickUrl={`${base.replace(/\/$/, "")}/quick`} flash={searchParams.jobber}
        squareConnected={!!u.square_connected} squareReady={squareConfigured()} squareFlash={searchParams.square}
        stripeConnected={!!u.stripe_connect_connected} stripeReady={stripeConnectConfigured()} stripeFlash={searchParams.stripe}
        qboConnected={!!u.qbo_connected} qboReady={qboConfigured()} qboFlash={searchParams.quickbooks}
        zapierToken={u.api_token} zapierUrl={hookUrl} business={u.business_name || "my business"} />
      {isActive(u) && <ConnectorRequest />}</section>
    <section className="card" id="timing"><h2 className="text-xl font-bold text-navy-900">Send timing</h2>
      <p className="mb-4 mt-1 text-sm text-slate-700">How long automatic asks from your connected tools wait before going out. Quick asks and spreadsheet sends let you choose each time.</p>
      <SendDelaySetting initial={clampDelay(u.send_delay_hours)} save={saveSendDelay} /></section>
    <section className="card" id="api"><h2 className="mb-4 text-xl font-bold text-navy-900">API &amp; callbacks</h2>
      <p className="mb-4 text-sm text-slate-600">Base URL <code className="break-all text-xs">{apiBase}</code></p>
      <ApiAccessCard initialToken={u.api_token} callbackUrl={(u as { callback_url?: string | null }).callback_url || null} secretSet={!!(u as { callback_secret?: string | null }).callback_secret} /></section>
    <section className="card"><h2 className="text-xl font-bold text-navy-900">Billing</h2><div className="mt-3 flex flex-wrap items-center gap-3"><span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${plan.cls}`}>{plan.label}</span><span className="text-sm text-slate-700">Starter · $39/month · 200 requests/month</span></div>
      <p className="mt-3 text-sm text-slate-700">{plan.note} Update your card, switch plans, or cancel below.</p>
      {searchParams.portal && <p className="mt-3 text-sm text-amber-700">Billing portal is available after you subscribe through Stripe.</p>}
      <div className="mt-4 flex flex-wrap items-center gap-2"><form action="/api/stripe/portal" method="post"><button className="btn-navy">Manage billing</button></form><form action="/api/stripe/portal?view=invoices&from=settings" method="post"><button className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-semibold text-navy-900 hover:bg-slate-50">Invoices</button></form><form action="/api/stripe/portal?view=payment_methods&from=settings" method="post"><button className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-semibold text-navy-900 hover:bg-slate-50">Payment methods</button></form></div></section>
    <section className="card"><div className="min-w-0"><h2 className="text-xl font-bold text-navy-900">Account</h2><p className="break-all text-sm text-slate-700">{u.email}</p></div></section>
    <details className="card"><summary className="cursor-pointer text-sm font-semibold text-slate-700">Advanced setup</summary>
      <p className="mt-3 text-sm text-slate-700">Webhook setup now lives on the <a href="#zapier" className="underline">Zapier card</a> under “Ask every customer automatically.” Zapier, Make, or any tool can POST to <code className="break-all">{hookUrl}</code>.</p></details>
  </main></div>;
}

function planBadge(status: string, trialEnd: string | null) {
  if (status === "trialing") {
    const days = trialEnd ? Math.max(0, Math.ceil((new Date(trialEnd).getTime() - Date.now()) / 864e5)) : null;
    const end = trialEnd ? new Date(trialEnd).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" }) : null;
    return { label: days == null ? "Free trial" : `Trial — ${days} day${days === 1 ? "" : "s"} left`, cls: "bg-lime-100 text-lime-800 ring-1 ring-lime-200", note: end ? `Your trial ends ${end}; billing starts then unless you cancel.` : "You won’t be charged until the trial ends." };
  }
  if (status === "active") return { label: "Active", cls: "bg-navy-900 text-white", note: "Your plan is active." };
  if (status === "past_due" || status === "unpaid") return { label: "Payment issue", cls: "bg-red-50 text-red-700 ring-1 ring-red-200", note: "Your last payment didn’t go through. Update your card to keep sending." };
  if (status === "canceled") return { label: "Canceled", cls: "bg-slate-200 text-slate-800", note: "Your plan is canceled. Start again any time." };
  return { label: "No plan yet", cls: "bg-amber-50 text-amber-800 ring-1 ring-amber-200", note: "Start your 7-day free trial to send review requests." };
}
