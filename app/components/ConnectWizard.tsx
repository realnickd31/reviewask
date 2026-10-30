"use client";
import { useEffect, useRef, useState } from "react";

type Last = { customer_name: string; source: string; created_at: string } | null;

function BigCopy({ label, text }: { label: string; text: string }) {
  const [done, setDone] = useState(false);
  return <button type="button" className="btn-navy w-full py-4 text-base" onClick={async () => { await navigator.clipboard.writeText(text); setDone(true); setTimeout(() => setDone(false), 1800); }}>{done ? "Copied ✓" : label}</button>;
}

export default function ConnectWizard({ initial, url, business, onConnected, onFirstRequest }: { initial: string | null; url: string; business: string; onConnected?: () => void; onFirstRequest?: () => void }) {
  const [token, setToken] = useState(initial);
  const [step, setStep] = useState(initial ? 2 : 1);
  const [busy, setBusy] = useState(false);
  const [test, setTest] = useState<{ t: "ok" | "err"; m: string } | null>(null);
  const [last, setLast] = useState<Last>(null);
  const baseline = useRef<string | null | undefined>(undefined);

  async function regen() {
    if (!confirm("Make a new API key? The old key stops working right away — anywhere using it (an existing Zap, other apps) needs the new one.")) return;
    setBusy(true);
    const r = await fetch("/api/token", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ rotate: true }) }); const j = await r.json(); setBusy(false);
    if (r.ok) { setToken(j.token); setStep(2); onConnected?.(); }
  }
  const [copied, setCopied] = useState(false);
  async function copyKey() {
    setBusy(true);
    const r = await fetch("/api/token", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ rotate: false }) });
    const j = await r.json().catch(() => ({})); setBusy(false);
    if (!r.ok || !j.token) return;
    setToken(j.token); onConnected?.();
    try { await navigator.clipboard.writeText(j.token); setCopied(true); } catch { /* still shown in step 3 */ }
    setTimeout(() => setStep(2), 700);
  }
  async function sendTest() {
    setBusy(true); setTest(null);
    const r = await fetch("/api/hooks/test", { method: "POST" }); const j = await r.json().catch(() => ({})); setBusy(false);
    setTest(r.ok ? { t: "ok", m: "Preview sent to your email. This checks your message only — it does not test Zapier. Your Zap is connected once a real customer shows up above." } : { t: "err", m: j.error || "Test failed." });
  }
  // Step 4: poll for a real request from Zapier.
  useEffect(() => {
    if (step !== 4) return;
    let stop = false;
    const tick = async () => {
      const r = await fetch("/api/hooks/test").catch(() => null); if (!r?.ok || stop) return;
      const j = await r.json(); const key = j.last ? j.last.created_at + j.last.customer_name : null;
      if (baseline.current === undefined) baseline.current = key;
      else if (key !== baseline.current && j.last?.source === "webhook") { setLast(j.last); onFirstRequest?.(); }
    };
    tick(); const id = setInterval(tick, 5000);
    return () => { stop = true; clearInterval(id); };
  }, [step]);


  const steps = ["Copy key", "Open Zapier", "Copy & paste", "Test"];
  return <div className="space-y-5">
    <ol className="grid grid-cols-4 gap-2 text-xs">{steps.map((s, i) =>
      <li key={s}><button type="button" onClick={() => (i === 0 || token) && setStep(i + 1)} className={`w-full rounded-md border px-2 py-2 text-left ${step === i + 1 ? "border-navy-900 bg-navy-900 text-white" : step > i + 1 ? "border-slate-200 bg-slate-50 text-navy-900" : "border-slate-200 text-slate-500"}`}>
        <span className="block font-semibold">Step {i + 1}</span>{s}</button></li>)}</ol>

    <div className="rounded-md border border-slate-200 p-5">
      {step === 1 && <div className="space-y-3"><p className="text-lg font-semibold">Copy your API key</p>
        <p className="text-sm text-slate-600">This is like a password that lets Zapier talk to ReviewAsk. It&apos;s the same key shown under API in Settings.</p>
        <button type="button" className="btn-navy w-full py-4 text-base" onClick={copyKey} disabled={busy}>{busy ? "Working…" : copied ? "Copied ✓ — next" : "Copy my API key"}</button>
        <button type="button" className="text-sm text-slate-500 underline" onClick={regen} disabled={busy}>Make a new key instead</button></div>}

      {step === 2 && <div className="space-y-3"><p className="text-lg font-semibold">Open Zapier</p>
        <p className="text-sm text-slate-600">You&apos;ll sign in or make a free account. Keep this page open.</p>
        <a href="https://zapier.com/app/zaps" target="_blank" rel="noopener noreferrer" onClick={() => setStep(3)} className="btn-navy block w-full py-4 text-center text-base">Open Zapier ↗</a></div>}

      {step === 3 && <div className="space-y-3"><p className="text-lg font-semibold">Copy these into Zapier</p>
        <BigCopy label="Copy connection link" text={url} />
        {token && <BigCopy label="Copy secret key" text={token} />}
        <p className="text-xs text-slate-500">In Zapier: create a Zap → pick the app you use and a trigger like <b>Invoice paid</b>, <b>Payment received</b> or <b>Job completed</b> → action <b>Webhooks by Zapier</b> → <b>POST</b> → paste link → add header <code>Authorization</code> = <code>Bearer &lt;secret key&gt;</code> → map customer name, email, phone.</p></div>}

      {step === 4 && <div className="space-y-3"><p className="text-lg font-semibold">Test the connection</p>
        <p className="text-sm text-slate-600">Mark a test invoice paid (or job completed) in your app, or use <b>Test step</b> in Zapier. We show “Connected” only when that real request reaches ReviewAsk.</p>
        {last ? <p className="rounded-md bg-lime-50 p-3 text-sm font-medium text-lime-800">Connected — we just got “{last.customer_name}” through Zapier. You&apos;re done.</p>
          : <p className="text-sm text-slate-500">Waiting for your first customer from Zapier… (checks every 5 seconds)</p>}
        <button type="button" className="btn-navy w-full py-4 text-base" onClick={sendTest} disabled={busy}>{busy ? "Sending…" : "Email me a preview of the message"}</button>
        {test && <p className={`text-sm ${test.t === "ok" ? "text-green-700" : "text-red-600"}`}>{test.m}</p>}
        <p className="text-xs text-slate-500">The preview goes to your login email and counts as one request this month.</p></div>}
    </div>

    <details className="text-sm text-slate-600"><summary className="cursor-pointer font-medium text-navy-900">Setup details</summary>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-xs">
        <li>Webhooks by Zapier → POST, payload type JSON, to <code className="break-all">{url}</code>.</li>
        <li>Fields: <code>customer_name</code>, <code>email</code>, <code>phone</code> (first/last name also accepted).</li>
        <li>Header: <code>Authorization: Bearer &lt;Secret key&gt;</code> (or <code>X-Api-Token</code>).</li>
        <li>Make.com works the same with an HTTP module. Each request counts toward the monthly quota; day-3 reminder is automatic.</li>
      </ul></details>
  </div>;
}
