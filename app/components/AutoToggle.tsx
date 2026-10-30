"use client";
import { useState } from "react";
import Link from "next/link";
import ConnectWizard from "@/components/ConnectWizard";

type Props = { enabled: boolean; provider: string | null; jobberConnected: boolean; jobberReady: boolean;
  housecallConnected?: boolean; housecallReady?: boolean; housecallStarted?: boolean;
  squareConnected?: boolean; squareReady?: boolean; squareFlash?: string;
  stripeConnected?: boolean; stripeReady?: boolean; stripeFlash?: string;
  qboConnected?: boolean; qboReady?: boolean; qboFlash?: string;
  zapierConnected?: boolean; zapierPending?: boolean; zapierToken?: string | null; zapierUrl?: string; business?: string;
  setupEmail: string | null; setupRequested: boolean; quickUrl: string; flash?: string };

export default function AutoToggle(p: Props) {
  const [on, setOn] = useState(p.enabled);
  const [connected, setConnected] = useState(p.jobberConnected);
  const [sq, setSq] = useState(!!p.squareConnected);
  const [st, setSt] = useState(!!p.stripeConnected);
  const [qb, setQb] = useState(!!p.qboConnected);
  const [zap, setZap] = useState(!!p.zapierConnected); const [zapWait, setZapWait] = useState(!!p.zapierPending); const [zapOpen, setZapOpen] = useState(false);
  // Setup requests are tracked per service, so Jobber and Housecall Pro never hide each other.
  const [reqFor, setReqFor] = useState<string | null>(p.setupRequested ? p.provider : null);
  const [open, setOpen] = useState<string | null>(p.flash === "setup" ? (p.provider === "jobber" ? "jobber" : "housecall") : p.squareFlash === "setup" ? "square" : p.stripeFlash === "setup" ? "stripe" : p.qboFlash === "setup" ? "quickbooks" : null);
  const [email, setEmail] = useState(p.setupEmail || "");
  const [err, setErr] = useState(""); const [busy, setBusy] = useState(false); const [copied, setCopied] = useState(false);
  const [discErr, setDiscErr] = useState("");
  // Shared disconnect: only flips the UI to disconnected when the server confirms.
  const disc = async (url: string, name: string): Promise<boolean> => {
    setDiscErr("");
    try { const r = await fetch(url, { method: "POST" }); if (r.ok) return true;
      setDiscErr((await r.json().catch(() => ({}))).error || `Couldn’t disconnect ${name}. Please try again.`); }
    catch { setDiscErr(`Network error disconnecting ${name}. Please try again.`); }
    return false;
  };
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
  const disconnect = async () => { if (!confirm("Disconnect Jobber? We’ll stop asking for reviews from Jobber until you connect again.")) return; if (await disc("/api/jobber/disconnect", "Jobber")) setConnected(false); };

  const requestPanel = (svc: string, name: string) => <div className="mt-3 space-y-3 rounded-md border border-slate-200 bg-slate-50 p-4">
    <p className="text-sm font-semibold text-navy-900">Connect {name}</p>
    <label className="label" htmlFor={`setup-email-${svc}`}>{name} login email</label>
    <input id={`setup-email-${svc}`} className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@yourshop.com" />
    {err && <p className="text-sm text-red-700">{err}</p>}
    <button type="button" className="btn-navy" disabled={busy} onClick={() => request(svc)}>{busy ? "Sending…" : "Request connect"}</button>
  </div>;
  const requestedNote = (name: string) => <p className="text-sm font-medium text-amber-700">● Setup requested — we’ll email you when {name} is on.</p>;
  const card = (title: string, body: React.ReactNode, status?: boolean) => <div className={`rounded-lg border bg-white p-4 ${status ? "border-green-300" : "border-slate-200"}`}>
    <div className="mb-2 flex items-center justify-between gap-2"><p className="text-base font-semibold text-navy-900">{title}</p>
      {status !== undefined && (status
        ? <span className="shrink-0 whitespace-nowrap rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-800">{on ? "● Connected" : "● Connected · paused"}</span>
        : <span className="shrink-0 whitespace-nowrap rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">○ Not connected</span>)}</div>{body}</div>;
  const offBtn = "rounded-md border border-red-300 bg-white px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50";

  const jobber = connected
    ? <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-semibold text-green-800">● Connected · Asking automatically</p>
        <button type="button" className={offBtn} onClick={disconnect}>Turn off &amp; disconnect</button>
      </div>
    : p.jobberReady ? <a href="/api/jobber/connect" className="btn-navy inline-block">Connect Jobber</a>
    : reqFor === "jobber" ? requestedNote("Jobber")
    : open === "jobber" ? requestPanel("jobber", "Jobber")
    : <button type="button" className="btn-navy" onClick={() => { setOpen("jobber"); setErr(""); }}>Connect Jobber</button>;
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
  const hcDisconnect = async () => { if (!confirm("Disconnect Housecall Pro? We’ll stop asking for reviews from Housecall Pro until you connect again.")) return; if (!(await disc("/api/housecall/disconnect", "Housecall Pro"))) return; setHc("none"); setHcKey(""); setHcSecret(""); };
  const housecall = hc === "done"
    ? <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-semibold text-green-800">● Connected · Asking automatically</p>
        <button type="button" className={offBtn} onClick={hcDisconnect}>Turn off &amp; disconnect</button>
      </div>
    : hc !== "none" ? <div>{hcSteps}<div className="mt-2 flex gap-4">{hc === "link" && <button type="button" className="btn-ghost" onClick={hcDisconnect}>Start over</button>}</div></div>
    : <div className="space-y-2">
        <button type="button" className="btn-navy" onClick={() => { setHc("key"); setHcErr(""); }}>Connect Housecall Pro</button>
        <p className="text-xs text-slate-500">Needs the Housecall Pro MAX plan.</p>
        {reqFor === "housecall" ? requestedNote("Housecall Pro") : open === "housecall" ? requestPanel("housecall", "Housecall Pro") : null}
      </div>;

  const sqDisconnect = async () => { if (!confirm("Disconnect Square? We’ll stop asking for reviews from Square until you connect again.")) return; if (await disc("/api/square/disconnect", "Square")) setSq(false); };
  const square = sq
    ? <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-semibold text-green-800">● Connected · Asking after each completed payment</p>
        <button type="button" className={offBtn} onClick={sqDisconnect}>Turn off &amp; disconnect</button>
      </div>
    : p.squareReady ? <a href="/api/square/connect" className="btn-navy inline-block">Connect Square</a>
    : reqFor === "square" ? requestedNote("Square")
    : open === "square" ? requestPanel("square", "Square")
    : <button type="button" className="btn-navy" onClick={() => { setOpen("square"); setErr(""); }}>Connect Square</button>;

  const qbDisconnect = async () => { if (!confirm("Disconnect QuickBooks? We’ll stop asking for reviews from QuickBooks until you connect again.")) return; if (await disc("/api/quickbooks/disconnect", "QuickBooks")) setQb(false); };
  const qboCard = qb
    ? <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-semibold text-green-800">● Connected · Asking when an invoice is paid</p>
        <button type="button" className={offBtn} onClick={qbDisconnect}>Turn off &amp; disconnect</button>
      </div>
    : p.qboReady ? <a href="/api/quickbooks/connect" className="btn-navy inline-block">Connect QuickBooks</a>
    : reqFor === "quickbooks" ? requestedNote("QuickBooks")
    : open === "quickbooks" ? requestPanel("quickbooks", "QuickBooks")
    : <button type="button" className="btn-navy" onClick={() => { setOpen("quickbooks"); setErr(""); }}>Connect QuickBooks</button>;

  const stDisconnect = async () => { if (!confirm("Disconnect Stripe? We’ll stop asking for reviews from Stripe until you connect again.")) return; if (await disc("/api/stripe-connect/disconnect", "Stripe")) setSt(false); };
  const stripeCard = st
    ? <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-semibold text-green-800">● Connected · Asking after each successful payment</p>
        <button type="button" className={offBtn} onClick={stDisconnect}>Turn off &amp; disconnect</button>
      </div>
    : p.stripeReady ? <a href="/api/stripe-connect/connect" className="btn-navy inline-block">Connect Stripe</a>
    : reqFor === "stripe" ? requestedNote("Stripe")
    : open === "stripe" ? requestPanel("stripe", "Stripe")
    : <button type="button" className="btn-navy" onClick={() => { setOpen("stripe"); setErr(""); }}>Connect Stripe</button>;

  const zapDisconnect = async () => {
    if (!confirm("Disconnect Zapier? We’ll ignore anything your Zap sends until you connect again. Your API key stays the same.")) return;
    if (await disc("/api/zapier/disconnect", "Zapier")) { setZap(false); setZapWait(false); setZapOpen(false); }
  };
  const zapWizard = <div className="mt-3"><ConnectWizard initial={zap || zapWait ? p.zapierToken ?? null : null} url={p.zapierUrl || ""} business={p.business || "my business"} onConnected={() => setZapWait(true)} onFirstRequest={() => { setZap(true); setZapWait(false); setOn(true); }} /></div>;
  const zapierCard = <div id="zapier" className="space-y-2">
    <p className="text-sm text-navy-900">Use any other app (invoicing, payments, booking, CRM). Zapier or Make tells us when a customer pays or a job is completed, and we ask that customer for a Google review.</p>
    {zap
      ? <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="font-semibold text-green-800">● Connected · Asking when Zapier tells us a customer paid</p>
          <div className="flex gap-2"><button type="button" className="btn-ghost" onClick={() => setZapOpen(!zapOpen)}>{zapOpen ? "Hide setup" : "Manage"}</button>
            <button type="button" className={offBtn} onClick={zapDisconnect}>Turn off &amp; disconnect</button></div>
        </div>
      : zapWait
      ? <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="font-semibold text-amber-700">● Waiting for first request from Zapier</p>
          <div className="flex gap-2"><button type="button" className="btn-ghost" onClick={() => setZapOpen(!zapOpen)}>{zapOpen ? "Hide setup" : "Finish setup"}</button>
            <button type="button" className={offBtn} onClick={zapDisconnect}>Cancel</button></div>
        </div>
      : !zapOpen && <button type="button" className="btn-navy" onClick={() => setZapOpen(true)}>Connect Zapier</button>}
    {zapOpen && zapWizard}
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
    {discErr && <p role="alert" className="text-sm text-red-700">{discErr}</p>}
    {!on && <p className="rounded-md bg-amber-50 p-3 text-sm text-amber-800">Automatic asks are <b>off</b>. Nothing will be sent. Your connections below are saved — turn the switch back on to resume, or disconnect any you don’t want.</p>}
    <>
      {p.flash === "error" && <p className="text-sm text-red-700">Jobber didn’t finish connecting. Please try again.</p>}
      {p.squareFlash === "error" && <p className="text-sm text-red-700">Square didn’t finish connecting. Please try again.</p>}
      {p.qboFlash === "error" && <p className="text-sm text-red-700">QuickBooks didn’t finish connecting. Please try again.</p>}
      {p.stripeFlash === "error" && <p className="text-sm text-red-700">Stripe didn’t finish connecting. Please try again.</p>}
      <p className="text-sm font-medium text-slate-600">Connect any tools you already use — you can connect more than one.</p>
      <div className="space-y-3">
        {card("Jobber", jobber, connected)}
        {card("Housecall Pro", housecall, hc === "done")}
        {card("Square", square, sq)}
        {card("Stripe", stripeCard, st)}
        {card("QuickBooks", qboCard, qb)}
        {card("Zapier (any other app)", zapierCard, zap)}
        {card("Quick ask (no connection needed)", <div className="space-y-3">
          <p className="text-sm text-navy-900">Send an ask from your phone after any job — name, phone, tap Send.</p>
          <div className="flex flex-wrap gap-2"><Link href="/quick" className="btn-outline">Open Quick ask</Link>
            <button type="button" className="btn-ghost" onClick={() => { navigator.clipboard?.writeText(p.quickUrl); setCopied(true); }}>{copied ? "Copied!" : "Copy link for your team"}</button></div>
        </div>)}
      </div>
    </>
  </div>;
}
