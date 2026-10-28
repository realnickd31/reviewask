"use client";
import { useState } from "react";
import Link from "next/link";

type Props = { enabled: boolean; provider: string | null; jobberConnected: boolean; jobberReady: boolean;
  housecallConnected?: boolean; housecallReady?: boolean; housecallStarted?: boolean;
  squareConnected?: boolean; squareReady?: boolean; squareFlash?: string;
  setupEmail: string | null; setupRequested: boolean; quickUrl: string; flash?: string };

export default function AutoToggle(p: Props) {
  const [on, setOn] = useState(p.enabled);
  const [connected, setConnected] = useState(p.jobberConnected);
  const [sq, setSq] = useState(!!p.squareConnected);
  // Setup requests are tracked per service, so Jobber and Housecall Pro never hide each other.
  const [reqFor, setReqFor] = useState<string | null>(p.setupRequested ? p.provider : null);
  const [open, setOpen] = useState<string | null>(p.flash === "setup" ? (p.provider === "jobber" ? "jobber" : "housecall") : p.squareFlash === "setup" ? "square" : null);
  const [email, setEmail] = useState(p.setupEmail || "");
  const [err, setErr] = useState(""); const [busy, setBusy] = useState(false); const [copied, setCopied] = useState(false);
  const post = (b: object) => fetch("/api/auto", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(b) });

  const toggle = async () => { const v = !on; setOn(v); await post({ enabled: v }); };
  const request = async (svc: string) => {
    setBusy(true); setErr("");
    const domEmail = (document.getElementById(`setup-email-${svc}`) as HTMLInputElement | null)?.value.trim() || email;
    if (domEmail !== email) setEmail(domEmail);
    let r: Response;
    try { r = await post({ requestSetup: true, email: domEmail, provider: svc }); } catch { setBusy(false); setErr("Network error. Try again."); return; }
    setBusy(false);
    if (r.ok) { setReqFor(svc); setOpen(null); } else setErr((await r.json().catch(() => ({}))).error || "Something went wrong.");
  };
  const [hc, setHc] = useState<"none" | "key" | "link" | "done">(p.housecallReady ? "done" : p.housecallStarted ? "link" : "none");
  const [hcKey, setHcKey] = useState(""); const [hcSecret, setHcSecret] = useState(""); const [hcErr, setHcErr] = useState("");
  const [hcBusy, setHcBusy] = useState(false); const [hcCopied, setHcCopied] = useState(false);
  const hcLink = p.quickUrl.replace(/\/quick$/, "") + "/api/housecall/webhook";
  const hcPost = async (url: string, body: object, next: typeof hc) => {
    setHcBusy(true); setHcErr("");
    let r: Response;
    try { r = await fetch(url, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) }); }
    catch { setHcBusy(false); setHcErr("Network error. Try again."); return; }
    setHcBusy(false);
    if (r.ok) { setHc(next); if (next !== "none") setOn(true); } else setHcErr((await r.json().catch(() => ({}))).error || "Something went wrong.");
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
  const help = <button type="button" className="text-sm text-slate-500 underline" onClick={() => { setOpen("housecall"); setErr(""); }}>Need help? We’ll connect it for you</button>;
  const hcSteps = hc === "key" ? <div className="mt-3 space-y-3 rounded-md border border-slate-200 bg-slate-50 p-4">
      <p className="text-sm font-semibold text-navy-900">Step 1 of 2 — Your connection key</p>
      <ol className="list-decimal space-y-1 pl-5 text-sm text-navy-900">
        <li>In Housecall Pro, open <b>My Apps</b> → <b>App Store</b> → <b>API Key Management</b>.</li>
        <li>Tap <b>Generate</b> (Read-only is fine) and copy the key.</li>
        <li>Paste it below.</li></ol>
      <input id="hc-key" name="apiKey" className="input" value={hcKey} onChange={e => setHcKey(e.target.value)} placeholder="Paste connection key" aria-label="Connection key" />
      {hcErr && <p className="text-sm text-red-700">{hcErr}</p>}
      <button type="button" className="btn-navy" disabled={hcBusy} onClick={() => hcPost("/api/housecall/connect", { apiKey: ((document.getElementById("hc-key") as HTMLInputElement | null)?.value ?? hcKey).trim() }, "link")}>{hcBusy ? "Checking…" : "Save & continue"}</button>
    </div>
    : <div className="mt-3 space-y-3 rounded-md border border-slate-200 bg-slate-50 p-4">
      <p className="text-sm font-semibold text-navy-900">Step 2 of 2 — Tell Housecall when a job is done</p>
      <ol className="list-decimal space-y-1 pl-5 text-sm text-navy-900">
        <li>Copy this link:</li></ol>
      <div className="flex flex-wrap gap-2"><input className="input flex-1" readOnly value={hcLink} aria-label="Your ReviewAsk link" />
        <button type="button" className="btn-outline" onClick={() => { navigator.clipboard?.writeText(hcLink); setHcCopied(true); }}>{hcCopied ? "Copied!" : "Copy"}</button></div>
      <ol start={2} className="list-decimal space-y-1 pl-5 text-sm text-navy-900">
        <li>In Housecall Pro, open <b>My Apps</b> → <b>Webhooks</b> and turn it on.</li>
        <li>Paste the link, and check <b>Job completed</b>. Save.</li>
        <li>Housecall shows a secret code — copy it and paste it here.</li></ol>
      <input id="hc-secret" name="webhookSecret" className="input" value={hcSecret} onChange={e => setHcSecret(e.target.value)} placeholder="Paste the secret from Housecall" aria-label="Secret from Housecall" />
      {hcErr && <p className="text-sm text-red-700">{hcErr}</p>}
      <button type="button" className="btn-navy" disabled={hcBusy} onClick={() => hcPost("/api/housecall/secret", { webhookSecret: ((document.getElementById("hc-secret") as HTMLInputElement | null)?.value ?? hcSecret).trim() }, "done")}>{hcBusy ? "Saving…" : "Finish"}</button>
    </div>;
  const hcDisconnect = async () => { await fetch("/api/housecall/disconnect", { method: "POST" }); setHc("none"); setHcKey(""); setHcSecret(""); };
  const housecall = hc === "done"
    ? <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-semibold text-green-800">● Connected · Asking automatically</p>
        <button type="button" className="btn-ghost" onClick={hcDisconnect}>Disconnect</button>
      </div>
    : hc !== "none" ? <div>{hcSteps}<div className="mt-2 flex gap-4">{hc === "link" && <button type="button" className="btn-ghost" onClick={hcDisconnect}>Start over</button>}</div></div>
    : <div className="space-y-2">
        <button type="button" className="btn-navy" onClick={() => { setHc("key"); setHcErr(""); }}>Connect Housecall Pro</button>
        <p className="text-xs text-slate-500">Needs the Housecall Pro MAX plan.</p>
        {reqFor === "housecall" ? requestedNote("Housecall Pro") : open === "housecall" ? requestPanel("housecall", "Housecall Pro") : help}
      </div>;

  const sqDisconnect = async () => { await fetch("/api/square/disconnect", { method: "POST" }); setSq(false); };
  const square = sq
    ? <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-semibold text-green-800">● Connected · Asking after each completed payment</p>
        <button type="button" className="btn-ghost" onClick={sqDisconnect}>Disconnect</button>
      </div>
    : p.squareReady ? <a href="/api/square/connect" className="btn-navy inline-block">Connect Square</a>
    : reqFor === "square" ? requestedNote("Square")
    : open === "square" ? requestPanel("square", "Square")
    : <button type="button" className="btn-navy" onClick={() => { setOpen("square"); setErr(""); }}>Connect Square</button>;

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
      {p.squareFlash === "error" && <p className="text-sm text-red-700">Square didn’t finish connecting. Please try again.</p>}
      <p className="text-sm font-medium text-slate-600">Connect any job software you use — you can connect more than one.</p>
      <div className="space-y-3">
        {card("Jobber", jobber)}
        {card("Housecall Pro", housecall)}
        {card("Square", square)}
        {card("Quick ask (no job software)", <div className="space-y-3">
          <p className="text-sm text-navy-900">Send an ask from your phone after any job — name, phone, tap Send.</p>
          <div className="flex flex-wrap gap-2"><Link href="/quick" className="btn-outline">Open Quick ask</Link>
            <button type="button" className="btn-ghost" onClick={() => { navigator.clipboard?.writeText(p.quickUrl); setCopied(true); }}>{copied ? "Copied!" : "Copy link for your techs"}</button></div>
        </div>)}
      </div>
    </>}
  </div>;
}
