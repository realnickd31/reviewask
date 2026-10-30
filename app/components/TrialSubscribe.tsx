import SubscribeConfirm from "./SubscribeConfirm";

// Conversion CTA for trial users: after a confirmation step, ends the trial and starts the paid plan with the card on file.
export function trialDaysLeft(trialEnd: string | null | undefined) {
  return trialEnd ? Math.max(0, Math.ceil((new Date(trialEnd).getTime() - Date.now()) / 864e5)) : null;
}

export default function TrialSubscribe({ trialEnd, from, status }: { trialEnd?: string | null; from: "dashboard" | "settings"; status?: string }) {
  const days = trialDaysLeft(trialEnd);
  const end = trialEnd ? new Date(trialEnd).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" }) : null;
  if (status === "1") return <div role="status" className="flex items-center gap-3 rounded-xl border border-lime-200 bg-lime-50 p-4 text-sm text-navy-900"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-lime-500 font-bold text-white">✓</span><p><span className="font-semibold">You’re subscribed.</span> Your Starter plan is active — thanks for keeping ReviewAsk.</p></div>;
  return <div className="overflow-hidden rounded-xl border border-navy-900/10 bg-gradient-to-r from-navy-900 to-[#1e3a5f] p-5 text-white shadow-sm sm:p-6">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-lime-400/20 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-lime-300 ring-1 ring-lime-300/30">Free trial{days != null ? ` · ${days} day${days === 1 ? "" : "s"} left` : ""}</span>
        <p className="mt-2 text-lg font-semibold">More Google reviews mean more customers. Stay on ReviewAsk for $39/mo.</p>
        <p className="mt-0.5 text-sm text-slate-300">{days != null ? `${days === 0 ? "Ends today" : `${days} day${days === 1 ? "" : "s"} left`} · cancel anytime.` : "Cancel anytime."}</p>
        {status === "failed" && <p className="mt-2 text-sm font-medium text-amber-300">We couldn’t charge your card. Update your payment method and try again.</p>}
      </div>
      <div className="flex shrink-0 flex-col items-stretch gap-2 sm:items-end">
        <SubscribeConfirm from={from} end={end} />
        <form action={`/api/stripe/portal?view=payment_methods&from=${from}`} method="post"><button className="text-xs text-slate-300 underline underline-offset-4 hover:text-white">Use a different card</button></form>
      </div>
    </div>
  </div>;
}
