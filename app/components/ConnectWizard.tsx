"use client";
import { useEffect, useRef, useState } from "react";

type Last = { customer_name: string; source: string; created_at: string } | null;

function BigCopy({ label, text }: { label: string; text: string }) {
  const [done, setDone] = useState(false);
  return <button type="button" className="btn-navy w-full py-4 text-base" onClick={async () => { await navigator.clipboard.writeText(text); setDone(true); setTimeout(() => setDone(false), 1800); }}>{done ? "Copied ✓" : label}</button>;
}

export default function ConnectWizard({ initial, url, business, onConnected }: { initial: string | null; url: string; business: string; onConnected?: () => void }) {
  const [token, setToken] = useState(initial);
  const [step, setStep] = useState(initial ? 2 : 1);
  const [busy, setBusy] = useState(false);
  const [test, setTest] = useState<{ t: "ok" | "err"; m: string } | null>(null);
  const [last, setLast] = useState<Last>(null);
  const baseline = useRef<string | null | undefined>(undefined);

  async function regen() {
    if (token && !confirm("Make a new secret key? Your existing Zap will stop working until you paste the new key into it.")) return;
    setBusy(true);
    const r = await fetch("/api/token", { method: "POST" }); const j = await r.json(); setBusy(false);
    if (r.ok) { setToken(j.token); setStep(2); onConnected?.(); }
  }
  async function sendTest() {
    setBusy(true); setTest(null);
    const r = await fetch("/api/hooks/test", { method: "POST" }); const j = await r.json().catch(() => ({})); setBusy(false);
    setTest(r.ok ? { t: "ok", m: "It worked — check History on your Dashboard (a test email went to your account address)." } : { t: "err", m: j.error || "Test failed." });
  }
  // Step 4: poll for a real request from Zapier.
  useEffect(() => {
    if (step !== 4) return;
    let stop = false;
    const tick = async () => {
      const r = await fetch("/api/hooks/test").catch(() => null); if (!r?.ok || stop) return;
      const j = await r.json(); const key = j.last ? j.last.created_at + j.last.customer_name : null;
      if (baseline.current === undefined) baseline.current = key;
      else if (key !== baseline.current && j.last?.source === "webhook") setLast(j.last);
    };
    tick(); const id = setInterval(tick, 5000);
    return () => { stop = true; clearInterval(id); };
  }, [step]);

  const help = `mailto:?subject=${encodeURIComponent(`Help connecting Zapier to ReviewAsk for ${business}`)}&body=${encodeURIComponent(
    `Hi,\n\nCould you help me connect our software to ReviewAsk through Zapier, so customers get a Google review request when they pay or a job is completed? It takes about 10 minutes in Zapier.\n\nConnection link: ${url}\nSecret key: (I'll send this separately)\n\nIn Zapier: Create Zap → trigger from our app (e.g. "Invoice paid", "Payment received" or "Job completed") → Webhooks by Zapier → POST → paste the link → add header Authorization: Bearer <secret key> → map customer name, email, phone.\n\nThanks!`)}`;

  const steps = ["Create key", "Open Zapier", "Copy & paste", "Test"];
  return <div className="space-y-5">
    <ol className="grid grid-cols-4 gap-2 text-xs">{steps.map((s, i) =>
      <li key={s}><button type="button" onClick={() => (i === 0 || token) && setStep(i + 1)} className={`w-full rounded-md border px-2 py-2 text-left ${step === i + 1 ? "border-navy-900 bg-navy-900 text-white" : step > i + 1 ? "border-slate-200 bg-slate-50 text-navy-900" : "border-slate-200 text-slate-500"}`}>
        <span className="block font-semibold">Step {i + 1}</span>{s}</button></li>)}</ol>

    <div className="rounded-md border border-slate-200 p-5">
      {step === 1 && <div className="space-y-3"><p className="text-lg font-semibold">Create your secret key</p>
        <p className="text-sm text-slate-600">This is like a password that lets Zapier talk to ReviewAsk.</p>
        <button type="button" className="btn-navy w-full py-4 text-base" onClick={regen} disabled={busy}>{busy ? "Working…" : token ? "Make a new secret key" : "Create secret key"}</button>
        {token && <button type="button" className="text-sm underline" onClick={() => setStep(2)}>Keep my current key → next</button>}</div>}

      {step === 2 && <div className="space-y-3"><p className="text-lg font-semibold">Open Zapier</p>
        <p className="text-sm text-slate-600">You&apos;ll sign in or make a free account. Keep this page open.</p>
        <a href="https://zapier.com/app/zaps" target="_blank" rel="noopener noreferrer" onClick={() => setStep(3)} className="btn-navy block w-full py-4 text-center text-base">Open Zapier ↗</a>
        <button type="button" className="text-sm underline" onClick={() => setStep(3)}>Already open → next</button></div>}

      {step === 3 && <div className="space-y-3"><p className="text-lg font-semibold">Copy these into Zapier</p>
        <BigCopy label="Copy connection link" text={url} />
        {token && <BigCopy label="Copy secret key" text={token} />}
        <p className="text-xs text-slate-500">In Zapier: create a Zap → pick the app you use and a trigger like <b>Invoice paid</b>, <b>Payment received</b> or <b>Job completed</b> → action <b>Webhooks by Zapier</b> → <b>POST</b> → paste link → add header <code>Authorization</code> = <code>Bearer &lt;secret key&gt;</code> → map customer name, email, phone.</p>
        <button type="button" className="text-sm underline" onClick={() => setStep(4)}>Done → test it</button></div>}

      {step === 4 && <div className="space-y-3"><p className="text-lg font-semibold">Test the connection</p>
        <p className="text-sm text-slate-600">Mark a test invoice paid (or job completed) in your app, or click <b>Send a test request</b> below.</p>
        {last ? <p className="rounded-md bg-lime-50 p-3 text-sm font-medium text-lime-800">Connected — we just got “{last.customer_name}” through Zapier. You&apos;re done.</p>
          : <p className="text-sm text-slate-500">Waiting for your first customer from Zapier… (checks every 5 seconds)</p>}
        <button type="button" className="btn-navy w-full py-4 text-base" onClick={sendTest} disabled={busy}>{busy ? "Sending…" : "Send a test request"}</button>
        {test && <p className={`text-sm ${test.t === "ok" ? "text-green-700" : "text-red-600"}`}>{test.m}</p>}
        <p className="text-xs text-slate-500">The test counts as one request this month.</p></div>}
    </div>

    <div className="flex flex-col gap-2 rounded-md bg-slate-50 p-4 text-sm sm:flex-row sm:items-center sm:justify-between">
      <p className="text-slate-600"><b className="text-navy-900">Want someone to connect it for you?</b> Send the details to your bookkeeper or tech person.</p>
      <a href={help} className="btn-outline whitespace-nowrap px-3 py-2 text-center">Email instructions</a>
    </div>

    <details className="text-sm text-slate-600"><summary className="cursor-pointer font-medium text-navy-900">For your tech person</summary>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-xs">
        <li>Webhooks by Zapier → POST, payload type JSON, to <code className="break-all">{url}</code>.</li>
        <li>Fields: <code>customer_name</code>, <code>email</code>, <code>phone</code> (first/last name also accepted).</li>
        <li>Header: <code>Authorization: Bearer &lt;Secret key&gt;</code> (or <code>X-Api-Token</code>).</li>
        <li>Make.com works the same with an HTTP module. Each request counts toward the monthly quota; day-3 reminder is automatic.</li>
      </ul></details>
  </div>;
}
