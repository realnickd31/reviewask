"use client";
import { useState } from "react";

// Two-step subscribe: first click reveals a confirmation; only Confirm POSTs the charge.
export default function SubscribeConfirm({ from, end }: { from: "dashboard" | "settings"; end: string | null }) {
  const [open, setOpen] = useState(false);
  if (!open) return <button type="button" onClick={() => setOpen(true)} className="w-full rounded-lg bg-lime-400 px-5 py-2.5 text-sm font-bold text-navy-900 shadow hover:bg-lime-300 sm:w-auto">Subscribe now — $39/mo</button>;
  return <div role="alertdialog" aria-labelledby="sub-confirm-title" className="w-full rounded-lg bg-white p-4 text-navy-900 shadow-lg sm:w-80">
    <p id="sub-confirm-title" className="text-sm font-semibold">Confirm your subscription</p>
    <p className="mt-1 text-sm text-slate-600">Your plan starts today at <span className="font-semibold text-navy-900">$39/mo</span> (card on file).</p>
    <div className="mt-3 flex justify-end gap-2">
      <button type="button" autoFocus onClick={() => setOpen(false)} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50">Cancel</button>
      <form action={`/api/stripe/subscribe-now?from=${from}`} method="post"><button className="rounded-lg bg-lime-500 px-4 py-2 text-sm font-bold text-navy-900 hover:bg-lime-400">Confirm — charge $39</button></form>
    </div>
  </div>;
}
