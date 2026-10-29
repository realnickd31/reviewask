"use client";
import { useState } from "react";

export default function ConnectorRequest() {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [err, setErr] = useState("");
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setErr(""); setState("sending");
    const f = Object.fromEntries(new FormData(e.currentTarget));
    const r = await fetch("/api/connector-request", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(f) }).catch(() => null);
    if (r?.ok) return setState("done");
    setErr((await r?.json().catch(() => null))?.error || "Something went wrong. Email support@getreviewask.com instead.");
    setState("idle");
  }
  if (state === "done") return <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"><b>Thanks — request received.</b> We review every request to decide which connectors to build next, and we may follow up by email.</div>;
  if (!open) return <p className="mt-4 text-sm text-slate-600">Don’t see your tool? <button type="button" onClick={() => setOpen(true)} className="font-medium underline">Request a connector</button></p>;
  return (
    <form onSubmit={submit} className="mt-4 space-y-3 rounded-lg border border-slate-200 p-4 text-sm">
      <p className="font-medium">Don’t see your tool? Tell us what you use.</p>
      <input name="tool" required maxLength={100} placeholder="Tool name (e.g. ServiceTitan)" className="w-full rounded-md border px-3 py-2" />
      <input name="website" maxLength={300} placeholder="Website (optional)" className="w-full rounded-md border px-3 py-2" />
      <textarea name="notes" maxLength={2000} rows={2} placeholder="Anything we should know? (optional)" className="w-full rounded-md border px-3 py-2" />
      <input name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
      {err && <p className="text-red-600">{err}</p>}
      <div className="flex gap-3"><button disabled={state === "sending"} className="btn-lime">{state === "sending" ? "Sending…" : "Send request"}</button>
        <button type="button" onClick={() => setOpen(false)} className="text-slate-500 underline">Cancel</button></div>
    </form>
  );
}
