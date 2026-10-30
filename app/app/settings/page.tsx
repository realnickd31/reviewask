import TrialSubscribe from "@/components/TrialSubscribe";
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
import SettingsTabs from "@/components/SettingsTabs";
import ApiAccessCard from "@/components/ApiAccessCard";
import { clampDelay } from "@/lib/delay";
import { stripe } from "@/lib/stripe";
import { db, ensureApiToken } from "@/lib/db";
export const dynamic = "force-dynamic";
export default async function Page({ searchParams }: { searchParams: { portal?: string; jobber?: string; square?: string; stripe?: string; quickbooks?: string; subscribed?: string } }) {
  const u = await requireUser();
  u.api_token = ensureApiToken(u.id); // every account always has a key
  const h = headers();
  const base = process.env.APP_URL || `${h.get("x-forwarded-proto") || "http"}://${h.get("host")}`;
  const hookUrl = `${base.replace(/\/$/, "")}/api/zapier/webhook`;
  const apiBase = `${base.replace(/\/$/, "")}/api/v1`;
  let trialEnd = u.trial_end || null;
  if (u.subscription_status === "trialing" && !trialEnd && stripe && u.stripe_subscription_id) {
    try { const s = await stripe.subscriptions.retrieve(u.stripe_subscription_id); if (s.trial_end) { trialEnd = new Date(s.trial_end * 1000).toISOString(); db.prepare("UPDATE users SET trial_end=? WHERE id=?").run(trialEnd, u.id); } } catch (e) { console.error("trial_end", e); }
  }
  const plan = planBadge(u.subscription_status, trialEnd);
  const trial = u.subscription_status === "trialing" || !isActive(u);
  const connected = !!(u.jobber_connected || u.housecall_connected || u.square_connected || u.stripe_connect_connected || u.qbo_connected);
  const initialTab = searchParams.portal || searchParams.subscribed ? "billing" : (searchParams.jobber || searchParams.square || searchParams.stripe || searchParams.quickbooks) ? "integrations" : "account";
  return <div className="min-h-screen bg-slate-50/60"><AppNav /><main id="main" className="mx-auto max-w-4xl px-4 py-8 text-[15px] sm:py-10">
    <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div><h1 className="text-2xl font-bold tracking-tight text-navy-900 sm:text-3xl">Settings</h1><p className="mt-1 text-sm text-slate-600">Your business, the tools you connect, and your plan.</p></div>
      <div className="flex items-center gap-2"><span className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-sm font-semibold ${plan.cls}`}>{plan.label}</span></div></header>
    {trial && !connected && <div className="mt-6 flex flex-col items-start justify-between gap-3 rounded-xl border border-lime-200 bg-lime-50 p-4 sm:flex-row sm:items-center">
      <div><p className="text-xs font-semibold uppercase tracking-wider text-lime-700">Finish setup</p><p className="mt-0.5 font-semibold text-navy-900">Connect your job tool so every customer gets asked automatically</p></div>
      <a href="#automatic" className="btn-lime shrink-0">Connect a tool</a></div>}

    <SettingsTabs initial={initialTab} panels={[
      { id: "account", label: "Account", node: <>
    <Group id="account" title="Account" sub="Your business name and the Google review link customers land on.">
      <section className="card"><h3 className="mb-4 text-base font-semibold text-navy-900">Business</h3><BizForm action={saveSettings} label="Save changes" name={u.business_name} url={u.review_url} /></section>
      <section className="card flex flex-wrap items-center justify-between gap-3"><div className="min-w-0"><h3 className="text-base font-semibold text-navy-900">Login email</h3><p className="break-all text-sm text-slate-600">{u.email}</p></div>
        <a href="#billing" className="text-sm font-medium text-navy-900 underline underline-offset-4">{plan.label}</a></section>
    </Group>

      </> },
      { id: "integrations", label: "Integrations", node: <>
    <Group id="integrations" title="Integrations" sub="Connect the tool you already use and every finished job gets a review ask. No copying names around.">
      <section className="card" id="automatic"><h3 className="mb-4 text-base font-semibold text-navy-900">Ask every customer automatically</h3><AutoToggle enabled={!!u.auto_enabled} provider={u.auto_provider} jobberConnected={!!u.jobber_connected} jobberReady={jobberConfigured()}
        housecallConnected={!!u.housecall_connected} housecallReady={!!u.housecall_connected && !!u.housecall_webhook_secret} housecallStarted={!!u.housecall_api_key}
        setupEmail={u.auto_setup_email} setupRequested={!!u.auto_setup_requested_at} quickUrl={`${base.replace(/\/$/, "")}/quick`} flash={searchParams.jobber}
        squareConnected={!!u.square_connected} squareReady={squareConfigured()} squareFlash={searchParams.square}
        stripeConnected={!!u.stripe_connect_connected} stripeReady={stripeConnectConfigured()} stripeFlash={searchParams.stripe}
        qboConnected={!!u.qbo_connected} qboReady={qboConfigured()} qboFlash={searchParams.quickbooks}
        zapierConnected={!!u.zapier_connected_at} zapierPending={!u.zapier_connected_at && !!u.zapier_setup_at} zapierToken={u.api_token} zapierUrl={hookUrl} business={u.business_name || "my business"} /></section>
      <section className="card" id="timing"><h3 className="text-base font-semibold text-navy-900">Send timing</h3>
        <p className="mb-4 mt-1 text-sm text-slate-600">How long automatic asks wait before going out, so you can stop one if needed.</p>
        <SendDelaySetting initial={clampDelay(u.send_delay_hours)} save={saveSendDelay} /></section>
      {isActive(u) && <section className="card"><ConnectorRequest /></section>}
    </Group>

      </> },
      { id: "api", label: "API & webhooks", node: <>
    <Group id="api" title="API & webhooks" sub="Optional. For a developer or tools like Zapier and Make. You can skip this if a connector above covers you.">
      <section className="card"><p className="mb-4 text-sm text-slate-600">Base URL <code className="break-all rounded bg-slate-100 px-1.5 py-0.5 text-xs">{apiBase}</code></p>
        <ApiAccessCard initialToken={u.api_token} callbackUrl={(u as { callback_url?: string | null }).callback_url || null} secretSet={!!(u as { callback_secret?: string | null }).callback_secret} />
        <p className="mt-5 border-t border-slate-100 pt-4 text-xs text-slate-500">Incoming webhook: Zapier, Make, or any tool can POST to <code className="break-all">{hookUrl}</code>.</p></section>
    </Group>

      </> },
      { id: "billing", label: "Billing", node: <>
    <Group id="billing" title="Billing" sub="Your plan, card, and invoices.">
      {(u.subscription_status === "trialing" || searchParams.subscribed === "1") && <TrialSubscribe from="settings" trialEnd={trialEnd} status={searchParams.subscribed} />}
      <section className="card"><div className="flex flex-wrap items-center gap-3"><span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${plan.cls}`}>{plan.label}</span><span className="text-sm text-slate-700">Starter · $39/month · 200 requests/month</span></div>
        <p className="mt-3 text-sm text-slate-700">{plan.note} Update your card, switch plans, or cancel below.</p>
        {searchParams.portal && <p className="mt-3 text-sm text-amber-700">Billing portal is available after you subscribe through Stripe.</p>}
        <div className="mt-4 flex flex-wrap items-center gap-2">{!isActive(u) ? <a href="/onboarding?step=pay" className="btn-lime">Start free trial</a> : <form action="/api/stripe/portal" method="post"><button className="btn-navy">Manage billing</button></form>}<form action="/api/stripe/portal?view=invoices&from=settings" method="post"><button className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-navy-900 hover:bg-slate-50">Invoices</button></form><form action="/api/stripe/portal?view=payment_methods&from=settings" method="post"><button className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-navy-900 hover:bg-slate-50">Payment methods</button></form></div></section>
    </Group>
      </> },
    ]} />
  </main></div>;
}

function Group({ id, title, sub, children }: { id: string; title: string; sub: string; children: React.ReactNode }) {
  return <section id={id} className="scroll-mt-16 pt-8" aria-labelledby={`${id}-h`}>
    <div className="mb-4"><h2 id={`${id}-h`} className="text-lg font-bold tracking-tight text-navy-900">{title}</h2><p className="mt-0.5 text-sm text-slate-600">{sub}</p></div>
    <div className="space-y-4">{children}</div></section>;
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
