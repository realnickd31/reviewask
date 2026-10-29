/** Lightweight SVG charts for the dashboard (server-rendered, no deps). */
export function AsksBars({ days }: { days: { label: string; n: number }[] }) {
  const max = Math.max(1, ...days.map((d) => d.n));
  const thisWeek = days.slice(-7).reduce((a, d) => a + d.n, 0), lastWeek = days.slice(0, 7).reduce((a, d) => a + d.n, 0);
  const diff = thisWeek - lastWeek;
  return <section className="card" aria-label="Asks sent, last 14 days">
    <div className="flex flex-wrap items-baseline justify-between gap-2"><h2 className="text-lg font-semibold">Asks sent</h2>
      <p className="text-sm text-slate-500"><strong className="text-navy-900">{thisWeek}</strong> this week · {lastWeek} last week{lastWeek || thisWeek ? <span className={`ml-2 rounded-full px-2 py-0.5 text-xs font-semibold ${diff >= 0 ? "bg-lime-50 text-lime-700" : "bg-slate-100 text-slate-500"}`}>{diff >= 0 ? "+" : ""}{diff}</span> : null}</p></div>
    <div className="mt-4 flex h-32 items-end gap-1 sm:gap-1.5" role="img" aria-label={`Daily asks over the last 14 days. ${thisWeek} this week, ${lastWeek} last week.`}>
      {days.map((d, i) => <div key={i} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1" title={`${d.label}: ${d.n}`}>
        {d.n > 0 && <span className="text-[10px] text-slate-500">{d.n}</span>}
        <div className={`w-full rounded-t ${i >= 7 ? "bg-navy-900" : "bg-slate-300"}`} style={{ height: `${d.n ? Math.max(4, (d.n / max) * 100) : 2}%` }} /></div>)}
    </div>
    <div className="mt-1 flex gap-1 text-[10px] text-slate-400 sm:gap-1.5">{days.map((d, i) => <span key={i} className="min-w-0 flex-1 truncate text-center">{i % 2 === 1 || days.length <= 7 ? d.label : ""}</span>)}</div>
    <p className="mt-2 text-xs text-slate-400"><span className="mr-1 inline-block h-2 w-2 rounded-sm bg-slate-300" />Last week <span className="ml-3 mr-1 inline-block h-2 w-2 rounded-sm bg-navy-900" />This week</p>
  </section>;
}

export function ReviewLine({ points }: { points: { t: string; n: number }[] }) {
  if (points.length < 2) return null;
  const W = 300, H = 60, ns = points.map((p) => p.n), lo = Math.min(...ns), hi = Math.max(...ns), span = Math.max(1, hi - lo);
  const xy = points.map((p, i) => [(i / (points.length - 1)) * W, H - 4 - ((p.n - lo) / span) * (H - 8)]);
  const d = xy.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  return <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="mt-4 h-16 w-full" role="img" aria-label={`Google review count from ${lo} to ${points[points.length - 1].n}`}>
    <path d={`${d} L${W},${H} L0,${H} Z`} className="fill-lime-100/70" /><path d={d} fill="none" strokeWidth="2" vectorEffect="non-scaling-stroke" className="stroke-lime-600" /></svg>;
}
