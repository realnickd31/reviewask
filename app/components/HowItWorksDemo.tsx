"use client";
import { useEffect, useState } from "react";

const scenes = [
  { k: "paid", cap: "A job wraps up. You mark it done, or your invoice gets paid." },
  { k: "wait", cap: "ReviewAsk waits about 2 hours so the ask lands at a good moment. Changed your mind? Tap Don’t ask." },
  { k: "email", cap: "Your customer gets a short thank-you from your business, by email or text." },
  { k: "google", cap: "One tap opens your Google review form. No app, no login." },
  { k: "remind", cap: "No review yet? One polite follow-up goes out on day 3. Then it stops." },
  { k: "done", cap: "Your dashboard shows every ask, reminder, and status. You just do great work." },
];
const DUR = 11000;

export default function HowItWorksDemo() {
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(true);
  useEffect(() => {
    if (!playing) return;
    const t = setTimeout(() => setI((n) => (n + 1) % scenes.length), DUR);
    return () => clearTimeout(t);
  }, [i, playing]);
  const s = scenes[i];
  return (
    <div className="mx-auto max-w-3xl">
      <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50 shadow-sm">
        <div className="flex items-center gap-1.5 border-b border-slate-200 bg-white px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-slate-300" /><span className="h-2.5 w-2.5 rounded-full bg-slate-300" /><span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
          <span className="ml-3 text-xs text-slate-400">Bright Harbor Co. · ReviewAsk</span>
        </div>
        <div key={s.k} className="ra-fade flex min-h-[300px] items-center justify-center p-6 sm:p-10">
          {s.k === "paid" && <Card><Row a="Invoice #1042 · Sam Rivera" b={<Pill c="lime">Paid</Pill>} /><Row a="Deck wash + seal" b="$480.00" /><p className="mt-4 text-xs text-slate-500">ReviewAsk noticed. A review ask is lined up.</p></Card>}
          {s.k === "wait" && <Card><p className="text-xs font-medium uppercase tracking-wide text-slate-400">Scheduled</p><Row a="Sam Rivera · text + email" b={<Pill c="slate">Sends in 2h</Pill>} /><div className="mt-3 h-1.5 overflow-hidden rounded bg-slate-200"><div className="ra-bar h-full bg-lime-500" /></div><button className="mt-4 rounded-md border border-slate-300 px-3 py-1.5 text-xs text-slate-600">Don’t ask</button></Card>}
          {s.k === "email" && <Card><p className="text-xs text-slate-400">From: Bright Harbor Co.</p><p className="mt-1 text-sm font-semibold text-navy-900">Sam, thanks again from Bright Harbor Co.</p><p className="mt-3 text-sm text-navy-900">Hi Sam,</p><p className="mt-2 text-sm leading-relaxed text-slate-700">Thanks again for choosing <b>Bright Harbor Co.</b> We really appreciate you.</p><p className="mt-2 text-sm leading-relaxed text-slate-700">If you’re happy with how things went, we’d be so grateful if you’d share a quick Google review — about 30 seconds, and it helps neighbors find a business they can trust.</p><span className="ra-pulse mt-4 inline-block rounded-md bg-[#b6f13a] px-4 py-2 text-sm font-semibold text-navy-900">Leave a Google review</span><p className="mt-4 text-sm text-slate-700">Grateful for your business,<br />— Bright Harbor Co.</p></Card>}
          {s.k === "email" && <div className="ml-4 hidden w-56 shrink-0 self-center sm:block"><p className="mb-1 text-[11px] font-medium uppercase tracking-wide text-slate-500">Or by text</p><div className="rounded-2xl rounded-bl-sm bg-white px-3 py-2 text-xs leading-relaxed text-navy-900 shadow ring-1 ring-slate-200">Hi Sam - thanks again for choosing Bright Harbor Co. If you’re happy with how things went, a quick Google review would mean a lot: <span className="text-blue-700 underline">g.page/r/…</span><br /><span className="text-slate-500">Reply STOP to opt out.</span></div></div>}
          {s.k === "google" && <Card><p className="text-sm font-semibold text-navy-900">Bright Harbor Co.</p><p className="mt-1 text-xs text-slate-400">Google review</p><p className="ra-stars mt-3 text-2xl tracking-wider text-amber-400">★★★★★</p><p className="mt-3 rounded-md border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">Showed up on time and the deck looks brand new. Would hire again!</p><span className="mt-3 inline-block rounded-md bg-blue-600 px-4 py-1.5 text-xs font-medium text-white">Post</span></Card>}
          {s.k === "remind" && <Card><p className="text-xs text-slate-400">Day 3 · From: Bright Harbor Co.</p><p className="mt-1 text-sm font-semibold text-navy-900">One more thank-you from Bright Harbor Co.</p><p className="mt-3 text-sm text-navy-900">Hi Sam,</p><p className="mt-2 text-sm leading-relaxed text-slate-700">Just a gentle follow-up from <b>Bright Harbor Co.</b> If you haven’t had a chance yet and you’re happy with how things went, a quick Google review would mean a lot to us.</p><span className="mt-4 inline-block rounded-md bg-[#b6f13a] px-4 py-2 text-sm font-semibold text-navy-900">Leave a Google review</span><p className="mt-4 text-sm text-slate-700">Thank you,<br />— Bright Harbor Co.</p></Card>}
          {s.k === "done" && <Card><p className="text-xs font-medium uppercase tracking-wide text-slate-400">This month</p><div className="mt-3 grid grid-cols-3 gap-3 text-center"><Stat n="38" l="Asked" /><Stat n="11" l="Reminded" /><Stat n="0" l="Failed" /></div><Row a="Sam Rivera" b={<Pill c="lime">Sent · Reminded</Pill>} /></Card>}
        </div>
        <div className="h-1 bg-slate-200"><div key={`p${i}${playing}`} className={playing ? "ra-prog h-full bg-lime-500" : "h-full w-0"} /></div>
      </div>
      <p aria-live="polite" className="mt-4 min-h-[3rem] text-center text-base text-navy-900">{s.cap}</p>
      <div className="mt-2 flex items-center justify-center gap-2">
        {scenes.map((x, n) => <button key={x.k} aria-label={`Step ${n + 1}`} onClick={() => setI(n)} className={`h-2 rounded-full transition-all ${n === i ? "w-6 bg-navy-900" : "w-2 bg-slate-300"}`} />)}
        <button onClick={() => setPlaying((p) => !p)} className="ml-3 text-xs text-slate-500 underline">{playing ? "Pause" : "Play"}</button>
      </div>
      <style>{`.ra-fade{animation:raf .5s ease}@keyframes raf{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
.ra-prog{animation:rap ${DUR}ms linear forwards}@keyframes rap{from{width:0}to{width:100%}}
.ra-bar{animation:rap 9s linear forwards}.ra-pulse{animation:rpu 1.6s ease-in-out 1s infinite}@keyframes rpu{50%{transform:scale(1.05)}}
.ra-stars{animation:raf .8s ease .6s both}@media (prefers-reduced-motion:reduce){.ra-fade,.ra-pulse,.ra-stars,.ra-bar{animation:none}}`}</style>
    </div>
  );
}
function Card({ children }: { children: React.ReactNode }) { return <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-md ring-1 ring-slate-200">{children}</div>; }
function Row({ a, b }: { a: React.ReactNode; b: React.ReactNode }) { return <div className="mt-3 flex items-center justify-between text-sm"><span className="text-navy-900">{a}</span><span className="text-slate-600">{b}</span></div>; }
function Pill({ c, children }: { c: "lime" | "slate"; children: React.ReactNode }) { return <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${c === "lime" ? "bg-lime-100 text-lime-700" : "bg-slate-100 text-slate-600"}`}>{children}</span>; }
function Stat({ n, l }: { n: string; l: string }) { return <div className="rounded-md bg-slate-50 p-3"><p className="text-xl font-semibold text-navy-900">{n}</p><p className="text-xs text-slate-500">{l}</p></div>; }
