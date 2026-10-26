"use client";
import { useState } from "react";
export default function QuickAsk({ disabled }: { disabled: boolean }) {
  const [name, setName] = useState(""); const [contact, setContact] = useState("");
  const [busy, setBusy] = useState(false); const [sent, setSent] = useState(""); const [err, setErr] = useState("");
  async function send(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setErr(""); setSent("");
    const c = contact.trim(); const isEmail = c.includes("@");
    const res = await fetch("/api/requests", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ name, email: isEmail ? c : "", phone: isEmail ? "" : c }) });
    const j = await res.json().catch(() => ({})); setBusy(false);
    if (!res.ok) { setErr(j.error || "Didn't send. Try again."); return; }
    setSent(name); setName(""); setContact("");
  }
  return <form onSubmit={send} className="mt-8 space-y-5">
    {sent && <div className="rounded-lg bg-lime-50 p-4 text-lg font-semibold text-lime-800 ring-1 ring-lime-100">Sent to {sent}. Next customer.</div>}
    <div><label className="label text-base">Customer name</label><input className="input h-14 text-lg" value={name} onChange={(e) => setName(e.target.value)} required autoComplete="off" placeholder="Jamie Rivera" /></div>
    <div><label className="label text-base">Phone or email</label><input className="input h-14 text-lg" value={contact} onChange={(e) => setContact(e.target.value)} required inputMode="tel" autoComplete="off" placeholder="(555) 123-4567" /></div>
    {err && <p className="text-red-600">{err}</p>}
    <button className="btn-navy h-16 w-full text-xl" disabled={busy || disabled}>{busy ? "Sending…" : "Send"}</button>
  </form>;
}
