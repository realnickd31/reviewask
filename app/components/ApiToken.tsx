"use client";
import { useState } from "react";

function Copy({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  return <button type="button" className="btn-outline px-3 py-1.5 text-xs" onClick={async () => { await navigator.clipboard.writeText(text); setDone(true); setTimeout(() => setDone(false), 1500); }}>{done ? "Copied" : "Copy"}</button>;
}

export default function ApiToken({ initial, url }: { initial: string | null; url: string }) {
  const [token, setToken] = useState(initial);
  const [busy, setBusy] = useState(false);
  async function regen() {
    if (token && !confirm("Make a new secret key? Connections using the old key will stop working until you paste the new one into Zapier.")) return;
    setBusy(true);
    const r = await fetch("/api/token", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ rotate: !!token }) }); const j = await r.json(); setBusy(false);
    if (r.ok) setToken(j.token);
  }
  return <div className="space-y-4 text-sm">
    <div><label className="label">Connection link</label>
      <div className="flex gap-2"><code className="input flex-1 overflow-x-auto whitespace-nowrap font-mono text-xs">{url}</code><Copy text={url} /></div></div>
    <div><label className="label">Secret key</label>
      {token ? <div className="flex gap-2"><code className="input flex-1 overflow-x-auto whitespace-nowrap font-mono text-xs">{token}</code><Copy text={token} /></div>
        : <p className="text-slate-500">No secret key yet. Click below to make one.</p>}
      <button type="button" className="btn-navy mt-3" onClick={regen} disabled={busy}>{busy ? "Working…" : token ? "Make a new secret key" : "Create secret key"}</button></div>
  </div>;
}
