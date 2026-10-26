"use client";
import { useState } from "react";
import Link from "next/link";

type Props = { enabled: boolean; provider: string | null; jobberConnected: boolean; jobberReady: boolean;
  setupEmail: string | null; setupRequested: boolean; quickUrl: string; flash?: string };

export default function AutoToggle(p: Props) {
  const [on, setOn] = useState(p.enabled);
  const [connected, setConnected] = useState(p.jobberConnected);
  // Setup requests are tracked per service, so Jobber and Housecall Pro never hide each other.
  const [reqFor, setReqFor] = useState<string | null>(p.setupRequested ? p.provider : null);
  const [open, setOpen] = useState<string | null>(p.flash === "setup" ? (p.provider === "jobber" ? "jobber" : "housecall") : null);
  const [email, setEmail] = useState(p.setupEmail || "");
  const [err, setErr] = useState(""); const [busy, setBusy] = useState(false); const [copied, setCopied] = useState(false);
  const post = (b: object) => fetch("/api/auto", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(b) });

  const toggle = async () => { const v = !on; setOn(v); await post({ enabled: v }); };
  const request = async (svc: string) => {
    setBusy(true); setErr("");
    const r = await post({ requestSetup: true, email, provider: svc });
    setBusy(false);
    if (r.ok) { setReqFor(svc); setOpen(null); } else setErr((await r.json().catch(() => ({}))).error || "Something went wrong.");
  };
  const disconnect = async () => { await fetch("/api/jobber/disconnect", { method: "POST" }); setConnected(false); };

  const requestPanel = (svc: string, name: string) => <div className="mt-3 space-y-3 rounded-md border border-slate-200 bg-slate-50 p-4">
    <p className="text-sm font-semibold text-navy-900">We’ll connect it for you</p>
    <label className="label" htmlFor={`setup-email-${svc}`}>{name} login email</label>
    <input id={`setup-email-${svc}`} className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@yourshop.com" />
    {err && <p className="text-sm text-red-700">{err}</p>}
    <button type="button" className="btn-navy" disabled={busy} onClick={() => request(svc)}>{busy ? "Sending…" : "Request connect"}</button>
  </div>;
  const requestedNote = (name: string) => <p className="text-sm font-medium text-amber-700">● Setup requested — we’ll email you when {name} is on.</p>;
  const card = (title: string, body: React.ReactNode) => <div className="rounded-lg border border-slate-200 bg-white p-4">
    <p className="mb-2 text-base font-semibold text-navy-900">{title}</p>{body}</div>;

  const jobber = connected
    ? <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-semibold text-green-800">● Connected · Asking automatically</p>
        <button type="button" className="btn-ghost" onClick={disconnect}>Disconnect</button>
      </div>
    : p.jobberReady ? <a href="/api/jobber/connect" className="btn-navy inline-block">Connect Jobber</a>
    : reqFor === "jobber" ? requestedNote("Jobber")
    : open === "jobber" ? requestPanel("jobber", "Jobber")
    : <button type="button" className="btn-navy" onClick={() => { setOpen("jobber"); setErr(""); }}>Connect Jobber</button>;
  const housecall = reqFor === "housecall" ? requestedNote("Housecall Pro")
    : open === "housecall" ? requestPanel("housecall", "Housecall Pro")
    : <button type="button" className="btn-navy" onClick={() => { setOpen("housecall"); setErr(""); }}>Connect Housecall Pro</button>;

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
      <p className="text-sm font-medium text-slate-600">Connect any job software you use — you can connect more than one.</p>
      <div className="space-y-3">
        {card("Jobber", jobber)}
        {card("Housecall Pro", housecall)}
        {card("Quick ask (no job software)", <div className="space-y-3">
          <p className="text-sm text-navy-900">Send an ask from your phone after any job — name, phone, tap Send.</p>
          <div className="flex flex-wrap gap-2"><Link href="/quick" className="btn-outline">Open Quick ask</Link>
            <button type="button" className="btn-ghost" onClick={() => { navigator.clipboard?.writeText(p.quickUrl); setCopied(true); }}>{copied ? "Copied!" : "Copy link for your techs"}</button></div>
        </div>)}
      </div>
    </>}
  </div>;
}
