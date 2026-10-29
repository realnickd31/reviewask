"use client";
import { useState, useTransition } from "react";
import DelayPicker from "./DelayPicker";
import { delayLabel } from "@/lib/delay";
export default function SendDelaySetting({ initial, save }: { initial: number; save: (h: number) => Promise<{ ok?: string; error?: string }> }) {
  const [v, setV] = useState(initial); const [saved, setSaved] = useState(initial);
  const [pending, start] = useTransition(); const [msg, setMsg] = useState<string | null>(null);
  function pick(h: number) {
    setV(h); setMsg(null);
    start(async () => { const r = await save(h); if (r.error) { setV(saved); setMsg(r.error); } else { setSaved(h); setMsg("Saved"); } });
  }
  return <div className="space-y-2">
    <DelayPicker value={v} onChange={pick} disabled={pending} label="Wait before sending automatic asks" />
    <p className="text-sm text-slate-500" aria-live="polite">
      {v === 0 ? "Asks go out the moment a job is marked complete." : <>Asks wait <b>{delayLabel(v)}</b> after a job is completed. Spot a bad job? Hit <b>Don&apos;t ask</b> on your dashboard before it sends.</>}
      {msg && <span className={`ml-2 font-medium ${msg === "Saved" ? "text-lime-700" : "text-red-600"}`}>{pending ? "Saving…" : msg === "Saved" ? "✓ Saved" : msg}</span>}
    </p>
  </div>;
}
