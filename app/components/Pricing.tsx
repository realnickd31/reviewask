"use client";
import Link from "next/link";
import { useState } from "react";

const features = ["200 review requests per month", "Automatic requests after every finished job (or upload a list)", "Quick ask for techs + paste from Excel/Sheets", "Day-3 follow-up reminders", "Status history & monthly proof", "Cancel anytime"];

export function Check() { return <svg viewBox="0 0 16 16" className="mt-0.5 h-4 w-4 flex-none fill-lime-600" aria-hidden><path d="M6.2 11.3L2.9 8l1-1 2.3 2.3 5.9-5.9 1 1z" /></svg>; }

export default function Pricing() {
  const [annual, setAnnual] = useState(true);
  const tab = (on: boolean) => `min-h-[44px] rounded-md px-4 text-sm font-medium transition ${on ? "bg-white text-navy-900 shadow-sm" : "text-slate-600 hover:text-navy-900"}`;
  return <section id="pricing" className="scroll-mt-4 border-t border-slate-200 bg-white py-24"><div className="mx-auto max-w-3xl px-6 text-center">
    <p className="eyebrow">Pricing</p>
    <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">One plan. No setup fees.</h2>
    <p className="mt-4 text-slate-600">Everything included, with a 7-day free trial on either billing option.</p>
    <div role="group" aria-label="Billing period" className="mt-8 inline-flex rounded-lg bg-slate-100 p-1">
      <button type="button" aria-pressed={!annual} onClick={() => setAnnual(false)} className={tab(!annual)}>Monthly</button>
      <button type="button" aria-pressed={annual} onClick={() => setAnnual(true)} className={tab(annual)}>Annual <span className="ml-1 rounded-full bg-lime-50 px-2 py-0.5 text-xs text-lime-700 ring-1 ring-lime-100">Save $78</span></button>
    </div>
    <div className="mx-auto mt-8 max-w-md rounded-lg border border-navy-900 bg-white p-8 text-left ring-1 ring-navy-900">
      <div className="flex items-center justify-between"><p className="text-sm font-medium text-slate-600">Starter · {annual ? "Annual" : "Monthly"}</p>
        {annual && <span className="rounded-full bg-lime-50 px-2.5 py-0.5 text-xs font-medium text-lime-700 ring-1 ring-lime-100">Best value</span>}</div>
      <p className="mt-4 flex items-baseline gap-2"><span className="text-4xl font-semibold tracking-tight">{annual ? "$390" : "$39"}</span><span className="text-sm text-slate-500">{annual ? "per year" : "per month"}</span></p>
      <p className="mt-1 text-sm text-slate-500">{annual ? "Save $78 vs. monthly — two months free" : "Billed monthly · cancel anytime"}</p>
      <ul className="mt-8 space-y-3 text-sm text-slate-700">{features.map((f) => <li key={f} className="flex gap-2.5"><Check />{f}</li>)}</ul>
      <Link href="/signup" className="btn-navy mt-8 w-full py-3">Start 7-day free trial</Link>
      <p className="mt-3 text-center text-xs text-slate-500">Card required at checkout · not charged until the trial ends · 200 requests/month, sent by email today (SMS rolling out)</p>
    </div>
    <p className="mt-6 text-sm text-slate-500">Cancel before the trial ends and you pay nothing. Prices in USD. Taxes may apply. Payments processed securely by Stripe.</p>
  </div></section>;
}
