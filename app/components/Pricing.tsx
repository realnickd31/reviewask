import Link from "next/link";

const features = ["200 review requests per month", "Automatic requests after every job (Jobber, Housecall Pro)", "Quick ask for techs + paste from Excel/Sheets", "Day-3 follow-up reminders", "Status history & monthly proof", "Cancel anytime"];

export function Check() { return <svg viewBox="0 0 16 16" className="mt-0.5 h-4 w-4 flex-none fill-lime-600" aria-hidden><path d="M6.2 11.3L2.9 8l1-1 2.3 2.3 5.9-5.9 1 1z" /></svg>; }

export default function Pricing() {
  return <section id="pricing" className="border-t border-slate-200 bg-white py-24"><div className="mx-auto max-w-5xl px-6">
    <div className="max-w-2xl"><p className="eyebrow">Pricing</p>
      <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">One plan. No setup fees.</h2>
      <p className="mt-4 text-slate-600">Everything included, with a 7-day free trial on either billing option.</p></div>
    <div className="mt-12 grid gap-6 md:grid-cols-2">
      {[{ name: "Monthly", price: "$39", per: "per month", note: "Billed monthly" }, { name: "Annual", price: "$390", per: "per year", note: "Save $78 vs. monthly — two months free" }].map((p, i) => (
        <div key={p.name} className={`rounded-lg border bg-white p-8 ${i === 1 ? "border-navy-900 ring-1 ring-navy-900" : "border-slate-200"}`}>
          <div className="flex items-center justify-between"><p className="text-sm font-medium text-slate-600">Starter · {p.name}</p>
            {i === 1 && <span className="rounded-full bg-lime-50 px-2.5 py-0.5 text-xs font-medium text-lime-700 ring-1 ring-lime-100">Best value</span>}</div>
          <p className="mt-4 flex items-baseline gap-2"><span className="text-4xl font-semibold tracking-tight">{p.price}</span><span className="text-sm text-slate-500">{p.per}</span></p>
          <p className="mt-1 text-sm text-slate-500">{p.note}</p>
          <ul className="mt-8 space-y-3 text-sm text-slate-700">{features.map((f) => <li key={f} className="flex gap-2.5"><Check />{f}</li>)}</ul>
          <Link href="/signup" className={`${i === 1 ? "btn-navy" : "btn-outline"} mt-8 w-full`}>Start free trial</Link>
        </div>))}
    </div>
    <p className="mt-6 text-sm text-slate-500">7-day free trial: a card is required at checkout and you won’t be charged until the trial ends. Cancel before then and you pay nothing. Prices in USD. Taxes may apply. Payments processed securely by Stripe.</p>
  </div></section>;
}

