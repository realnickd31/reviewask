"use client";
import { useState } from "react";
import Link from "next/link";
export default function ReviewGapCalc() {
  const [you, setYou] = useState(20);
  const [c1, setC1] = useState(150); const [c2, setC2] = useState(90); const [c3, setC3] = useState(60);
  const [months, setMonths] = useState(6); const [rate, setRate] = useState(15); const [jobs, setJobs] = useState(40);
  const comps = [c1, c2, c3].filter((n) => n > 0);
  const avg = comps.length ? Math.round(comps.reduce((a, b) => a + b, 0) / comps.length) : 0;
  const leader = comps.length ? Math.max(...comps) : 0;
  const gap = Math.max(avg - you, 0); const gapLead = Math.max(leader - you, 0);
  const perMo = months > 0 ? Math.ceil(gap / months) : 0;
  const asks = rate > 0 ? Math.ceil(perMo / (rate / 100)) : 0;
  const fromJobs = Math.round(jobs * (rate / 100));
  const num = (v: number, set: (n: number) => void, label: string, min = 0) => <div><label className="label" htmlFor={"rg-" + label.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}>{label}</label><input id={"rg-" + label.replace(/[^a-z0-9]+/gi, "-").toLowerCase()} className="input" type="number" min={min} inputMode="numeric" value={v} onChange={(e) => set(Math.max(min, Number(e.target.value) || 0))} /></div>;
  return <div className="space-y-6">
    <div className="grid gap-4 sm:grid-cols-2">{num(you, setYou, "Your Google reviews")}{num(jobs, setJobs, "Jobs you finish per month")}</div>
    <div className="grid gap-4 sm:grid-cols-3">{num(c1, setC1, "Competitor #1 reviews")}{num(c2, setC2, "Competitor #2 reviews")}{num(c3, setC3, "Competitor #3 reviews")}</div>
    <div className="grid gap-4 sm:grid-cols-2">{num(months, setMonths, "Months to close the gap", 1)}{num(rate, setRate, "Assumed response rate (%)", 1)}</div>
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-5 text-sm" aria-live="polite">
      <p><strong className="text-navy-900">Gap to the top-3 average ({avg}):</strong> {gap} reviews · gap to the leader: {gapLead}</p>
      <p className="mt-2"><strong className="text-navy-900">To close it in {months} months:</strong> about {perMo} new reviews a month, or roughly {asks} review requests a month at a {rate}% response rate.</p>
      <p className="mt-2"><strong className="text-navy-900">If you ask every customer:</strong> {jobs} jobs a month at {rate}% is about {fromJobs} new reviews a month{perMo > 0 ? (fromJobs >= perMo ? ", enough to close the gap on that timeline." : ". Add your backlog of past customers to close it faster.") : "."}</p>
      <p className="mt-3 text-xs text-slate-500">The response rate is an assumption you set, not a promise. Real rates vary by trade and customer. Look up your competitors&apos; counts on Google Maps.</p>
    </div>
    <p><Link href="/signup" className="btn-navy px-5 py-3 !text-white no-underline">Ask every customer automatically — start a 7-day free trial</Link></p>
  </div>;
}
