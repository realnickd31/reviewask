"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
export default function SendForm({ disabled }: { disabled: boolean }) {
  const [msg, setMsg] = useState<{ t: "ok" | "err"; m: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setBusy(true); setMsg(null);
    const form = e.currentTarget; const fd = new FormData(form);
    let res: Response; let j: any = {};
    try { res = await fetch("/api/requests", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(Object.fromEntries(fd)) }); j = await res.json().catch(() => ({})); }
    catch { setBusy(false); setMsg({ t: "err", m: "Network error — nothing was sent. Try again." }); return; }
    setBusy(false);
    if (res.ok) { form.reset(); setMsg({ t: "ok", m: j.mode === "outbox" ? "Sent (dev mode: logged to data/outbox.json)." : "Review request sent!" }); router.refresh(); }
    else setMsg({ t: "err", m: j.error || `Didn't send (error ${res.status}). Try again.` });
  }
  return <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
    <div className="sm:col-span-2"><label className="label">Customer name</label><input className="input" name="name" required placeholder="Jamie Rivera" /></div>
    <div><label className="label">Email</label><input className="input" name="email" type="email" placeholder="jamie@example.com" /></div>
    <div><label className="label">Phone <span className="text-slate-400">(optional)</span></label><input className="input" name="phone" type="tel" placeholder="(555) 123-4567" /></div>
    <div className="sm:col-span-2 flex flex-wrap items-center gap-3">
      <button className="btn-lime" disabled={busy || disabled}>{busy ? "Sending…" : "Send review request"}</button>
      {msg && <p className={`text-sm ${msg.t === "ok" ? "text-green-700" : "text-red-600"}`}>{msg.m}</p>}
    </div>
  </form>;
}
