"use client";
import { useState } from "react";
import Link from "next/link";

type Props = { enabled: boolean; provider: string | null; jobberConnected: boolean; jobberReady: boolean;
  setupEmail: string | null; setupRequested: boolean; quickUrl: string; flash?: string };
const NAMES: Record<string, string> = { jobber: "Jobber", housecall: "Housecall Pro" };

export default function AutoToggle(p: Props) {
  const [on, setOn] = useState(p.enabled);
  const [prov, setProv] = useState<string | null>(p.provider);
  const [connected, setConnected] = useState(p.jobberConnected);
  const [requested, setRequested] = useState(p.setupRequested);
  const [showReq, setShowReq] = useState(p.flash === "setup");
  const [email, setEmail] = useState(p.setupEmail || "");
  const [err, setErr] = useState(""); const [busy, setBusy] = useState(false); const [copied, setCopied] = useState(false);
  const post = (b: object) => fetch("/api/auto", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(b) });

  const toggle = async () => { const v = !on; setOn(v); await post({ enabled: v }); };
  const pick = async (v: string) => { setProv(v); setShowReq(false); setErr(""); setRequested(false); await post({ provider: v, clearSetup: true }); };
  const request = async () => {
    setBusy(true); setErr("");
    const r = await post({ requestSetup: true, email, provider: prov });
    setBusy(false);
    if (r.ok) setRequested(true); else setErr((await r.json().catch(() => ({}))).error || "Something went wrong.");
  };
  const disconnect = async () => { await fetch("/api/jobber/disconnect", { method: "POST" }); setConnected(false); };

  const big = (v: string, label: string) => <button type="button" onClick={() => pick(v)}
    className={`rounded-lg border p-4 text-left text-base font-semibold ${prov === v ? "border-navy-900 bg-navy-900 text-white" : "border-slate-200 bg-white text-navy-900 hover:border-navy-900"}`}>{label}</button>;

  const name = prov ? NAMES[prov] : "";
  const requestPanel = requested
    ? <p className="rounded-md border border-slate-200 bg-slate-50 p-4 text-sm text-navy-900">Got it — we’ll finish {name} setup for your account. You’ll get an email when it’s on.</p>
    : <div className="space-y-3 rounded-md border border-slate-200 bg-slate-50 p-4">
        <p className="text-sm font-semibold text-navy-900">We’ll connect it for you</p>
        <label className="label" htmlFor="setup-email">{name} login email</label>
        <input id="setup-email" className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@yourshop.com" />
        {err && <p className="text-sm text-red-700">{err}</p>}
        <button type="button" className="btn-navy" disabled={busy} onClick={request}>{busy ? "Sending…" : "Request connect"}</button>
      </div>;

  return <div className="space-y-5">
    <div className="flex items-start justify-between gap-4">
      <p className="text-base text-navy-900">Automatically ask customers for a Google review when a job is finished.</p>
      <button type="button" role="switch" aria-checked={on} onClick={toggle}
        className={`relative h-9 w-16 shrink-0 rounded-full transition ${on ? "bg-navy-900" : "bg-slate-300"}`}>
        <span className={`absolute top-1 h-7 w-7 rounded-full bg-white shadow transition-all ${on ? "left-8" : "left-1"}`} />
        <span className="sr-only">{on ? "On" : "Off"}</span>
      </button>
    </div>
    {!on && <p className="text-sm text-slate-500">Turn this on, then connect your job software once.</p>}
    {on && <>
      {p.flash === "error" && <p className="text-sm text-red-700">Jobber didn’t finish connecting. Please try again.</p>}
      {connected && prov === "jobber" ? <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-green-200 bg-green-50 p-4">
          <p className="font-semibold text-green-800">● Connected to Jobber · Asking automatically</p>
          <div className="flex gap-2"><button type="button" className="btn-outline" onClick={toggle}>Turn off</button><button type="button" className="btn-ghost" onClick={disconnect}>Disconnect</button></div>
        </div> : <>
        <p className="text-sm font-medium text-slate-600">What do you use to run jobs?</p>
        <div className="grid gap-3 sm:grid-cols-3">{big("jobber", "I use Jobber")}{big("housecall", "I use Housecall Pro")}{big("none", "Neither / not sure")}</div>
        {prov === "jobber" && (p.jobberReady
          ? <a href="/api/jobber/connect" className="btn-navy inline-block">Connect Jobber</a>
          : requested || showReq ? requestPanel : <button type="button" className="btn-navy" onClick={() => setShowReq(true)}>Connect Jobber</button>)}
        {prov === "housecall" && (requested || showReq ? requestPanel : <button type="button" className="btn-navy" onClick={() => setShowReq(true)}>Connect Housecall Pro</button>)}
        {prov === "none" && <div className="space-y-3 rounded-md border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm text-navy-900">Use Quick ask on your phone after each job — name, phone, tap Send.</p>
          <div className="flex flex-wrap gap-2"><Link href="/quick" className="btn-navy">Open Quick ask</Link>
            <button type="button" className="btn-outline" onClick={() => { navigator.clipboard?.writeText(p.quickUrl); setCopied(true); }}>{copied ? "Copied!" : "Copy link for your techs"}</button></div>
        </div>}
      </>}
    </>}
  </div>;
}
