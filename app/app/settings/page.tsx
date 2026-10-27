import { headers } from "next/headers";
import AppNav from "@/components/AppNav";
import BizForm from "@/components/BizForm";
import ConnectWizard from "@/components/ConnectWizard";
import AutoToggle from "@/components/AutoToggle";
import { jobberConfigured } from "@/lib/jobber";
import { requireUser } from "@/lib/session";
import { saveSettings } from "../actions";
export const dynamic = "force-dynamic";
export default async function Page({ searchParams }: { searchParams: { portal?: string; jobber?: string } }) {
  const u = await requireUser();
  const h = headers();
  const base = process.env.APP_URL || `${h.get("x-forwarded-proto") || "http"}://${h.get("host")}`;
  const hookUrl = `${base.replace(/\/$/, "")}/api/hooks/job-complete`;
  return <div><AppNav /><main id="main" className="mx-auto max-w-2xl space-y-6 px-4 py-8">
    <section className="card"><h1 className="mb-5 text-xl font-bold">Business</h1><BizForm action={saveSettings} label="Save changes" name={u.business_name} url={u.review_url} /></section>
    <section className="card" id="automatic"><h2 className="mb-4 text-xl font-bold">Ask after every job</h2>
      <AutoToggle enabled={!!u.auto_enabled} provider={u.auto_provider} jobberConnected={!!u.jobber_connected} jobberReady={jobberConfigured()}
        housecallConnected={!!u.housecall_connected} housecallReady={!!u.housecall_connected && !!u.housecall_webhook_secret} housecallStarted={!!u.housecall_api_key}
        setupEmail={u.auto_setup_email} setupRequested={!!u.auto_setup_requested_at} quickUrl={`${base.replace(/\/$/, "")}/quick`} flash={searchParams.jobber} /></section>
    <section className="card"><h2 className="text-xl font-bold">Billing</h2><p className="mt-1 text-sm text-slate-600">Status: <b>{u.subscription_status === "active" ? "Active" : u.subscription_status === "trialing" ? "Free trial" : "Not active"}</b>. Update your card, switch plans, or cancel.</p>
      {searchParams.portal && <p className="mt-3 text-sm text-amber-700">Billing portal is available after you subscribe through Stripe.</p>}
      <form action="/api/stripe/portal" method="post" className="mt-4"><button className="btn-navy">Manage billing</button></form></section>
    <section className="card flex items-center justify-between"><div><h2 className="font-bold">Account</h2><p className="text-sm text-slate-600">{u.email}</p></div></section>
    <details className="card"><summary className="cursor-pointer text-sm font-semibold text-slate-600">Advanced (for a tech person)</summary>
      <p className="mb-5 mt-3 text-sm text-slate-600">Connect other software yourself using Zapier and a webhook. Most shops don’t need this.</p>
      <ConnectWizard initial={u.api_token} url={hookUrl} business={u.business_name || "my business"} /></details>
  </main></div>;
}
