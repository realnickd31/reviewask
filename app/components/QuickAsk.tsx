"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
export default function QuickAsk({ disabled }: { disabled: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ t: "ok" | "err"; m: string } | null>(null);
  async function send(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setBusy(true); setMsg(null);
    const form = e.currentTarget; const fd = new FormData(form);
    const name = String(fd.get("name") || "").trim();
    const c = String(fd.get("contact") || "").trim(); const isEmail = c.includes("@");
    try {
      const res = await fetch("/api/requests", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ name, email: isEmail ? c : "", phone: isEmail ? "" : c }) });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) { setMsg({ t: "err", m: j.error || "Didn't send. Try again." }); return; }
      form.reset(); router.refresh();
      setMsg({ t: "ok", m: j.mode === "sms_pending" ? `Saved for ${name}. Text messages are still rolling out, so this ask is queued. Use an email address to send it now.` : j.mode === "outbox" ? `Logged for ${name} (dev mode). Next customer.` : `✓ Sent to ${name}. Next customer.` });
    } catch { setMsg({ t: "err", m: "Network error. Try again." }); }
    finally { setBusy(false); }
  }
  return <form onSubmit={send} className="mt-8 space-y-5">
    {msg?.t === "ok" && <div role="status" className="rounded-lg bg-lime-50 p-4 text-lg font-semibold text-lime-800 ring-1 ring-lime-200">{msg.m}</div>}
    <div><label className="label text-base" htmlFor="qa-name">Customer name</label><input id="qa-name" className="input h-14 text-lg" name="name" required autoComplete="off" placeholder="Jamie Rivera" /></div>
    <div><label className="label text-base" htmlFor="qa-contact">Phone or email</label><input id="qa-contact" className="input h-14 text-lg" name="contact" required autoComplete="off" placeholder="jamie@example.com or (555) 123-4567" /><p className="mt-1 text-sm text-slate-500">Email sends right away. Text messages are rolling out.</p></div>
    {msg?.t === "err" && <div role="alert" className="rounded-lg bg-red-50 p-4 text-base font-semibold text-red-700 ring-1 ring-red-200">{msg.m}</div>}
    <button className="btn-navy h-16 w-full text-xl" disabled={busy || disabled}>{busy ? "Sending…" : "Send"}</button>
  </form>;
}
