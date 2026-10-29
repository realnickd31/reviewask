"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import DelayPicker from "./DelayPicker";
import { delayLabel } from "@/lib/delay";
export default function QuickAsk({ disabled, accountDelay }: { disabled: boolean; accountDelay?: number }) {
  const [delay, setDelay] = useState(0);
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ t: "ok" | "err"; m: string } | null>(null);
  async function send(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setBusy(true); setMsg(null);
    const form = e.currentTarget; const fd = new FormData(form);
    const name = String(fd.get("name") || "").trim();
    const c = String(fd.get("contact") || "").trim(); const isEmail = c.includes("@");
    try {
      const res = await fetch("/api/requests", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ name, email: isEmail ? c : "", phone: isEmail ? "" : c, delayHours: delay }) });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) { setMsg({ t: "err", m: j.error || "Didn't send. Try again." }); return; }
      form.reset(); router.refresh();
      setMsg({ t: "ok", m: j.mode === "scheduled" ? `✓ Scheduled for ${name} in ${delayLabel(delay)}. Change your mind? Hit Don't ask below.` : j.mode === "sms_pending" ? `Saved for ${name}. We couldn't text this number yet, so it's queued. Add an email to send it now.` : j.mode === "outbox" ? `Logged for ${name} (dev mode). Next customer.` : `✓ Sent to ${name}. Next customer.` });
    } catch { setMsg({ t: "err", m: "Network error. Try again." }); }
    finally { setBusy(false); }
  }
  return <form onSubmit={send} className="mt-8 space-y-5">
    {msg?.t === "ok" && <div role="status" className="rounded-lg bg-lime-50 p-4 text-lg font-semibold text-lime-800 ring-1 ring-lime-200">{msg.m}</div>}
    <div><label className="label text-base" htmlFor="qa-name">Customer name</label><input id="qa-name" className="input h-14 text-lg" name="name" required autoComplete="off" placeholder="Jamie Rivera" /></div>
    <div><label className="label text-base" htmlFor="qa-contact">Phone or email</label><input id="qa-contact" className="input h-14 text-lg" name="contact" required autoComplete="off" placeholder="jamie@example.com or (555) 123-4567" /><p className="mt-1 text-sm text-slate-500">We'll text phone numbers and email addresses.</p></div>
    <div><DelayPicker value={delay} onChange={setDelay} accountDefault={accountDelay} disabled={busy || disabled} />
      <p className="mt-1.5 text-sm text-slate-500">{delay === 0 ? "Sends the moment you tap Send." : `Waits ${delayLabel(delay)}. You can stop it from Scheduled asks until then.`}</p></div>
    {msg?.t === "err" && <div role="alert" className="rounded-lg bg-red-50 p-4 text-base font-semibold text-red-700 ring-1 ring-red-200">{msg.m}</div>}
    <button className="btn-navy h-16 w-full text-xl" disabled={busy || disabled}>{busy ? (delay ? "Scheduling…" : "Sending…") : delay ? `Send in ${delayLabel(delay)}` : "Send now"}</button>
  </form>;
}
