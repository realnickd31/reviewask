"use client";

import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, LabelList, Legend, Line, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis, ComposedChart,
} from "recharts";

const NAVY = "#101b33";
const LIME = "#7fa53f";
const PALETTE = ["#101b33", "#7fa53f", "#3b5b9a", "#a9cf6a", "#6b7a99", "#c7d2e3", "#5a7a2a", "#94a3b8"];
const fmt = (n: number) => n.toLocaleString();
const pctStr = (n: number, d: number) => (d ? `${Math.round((n / d) * 1000) / 10}%` : "—");

function Tip({ active, payload, label, total }: { active?: boolean; payload?: { name: string; value: number; color?: string; payload?: Record<string, unknown> }[]; label?: string; total?: number }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-lg">
      {label != null && <p className="mb-1 font-semibold text-navy-900">{label}</p>}
      {payload.map((p) => (
        <p key={p.name} className="flex items-center gap-2 text-slate-600">
          <span className="h-2 w-2 rounded-full" style={{ background: p.color || NAVY }} />
          {p.name}: <span className="font-semibold tabular-nums text-navy-900">{fmt(Number(p.value))}</span>
          {total ? <span className="text-slate-400">({pctStr(Number(p.value), total)})</span> : null}
        </p>
      ))}
    </div>
  );
}

const Empty = ({ text = "No data in this range yet." }: { text?: string }) => (
  <div className="flex h-40 items-center justify-center text-sm text-slate-400">{text}</div>
);

/** Funnel: horizontal bars sized vs the first step, labelled with step conversion; biggest drop-off highlighted. */
export function FunnelChart({ steps }: { steps: { label: string; value: number }[] }) {
  const top = Math.max(1, ...steps.map((s) => s.value));
  const conv = steps.map((s, i) => (i > 0 && steps[i - 1].value ? s.value / steps[i - 1].value : null));
  let worst = -1;
  conv.forEach((c, i) => { if (c != null && steps[i - 1].value > 0 && (worst < 0 || c < (conv[worst] ?? 1))) worst = i; });
  return (
    <div className="space-y-1.5 px-4 py-4">
      {steps.map((s, i) => {
        const w = Math.max(1.5, (s.value / top) * 100);
        const c = conv[i];
        const isWorst = i === worst;
        return (
          <div key={s.label} className="group grid grid-cols-[minmax(90px,150px)_1fr_auto] items-center gap-3" title={`${s.label}: ${fmt(s.value)}${c != null ? ` · ${pctStr(s.value, steps[i - 1].value)} of previous step` : ""} · ${pctStr(s.value, steps[0].value)} of top`}>
            <span className="truncate text-xs text-slate-600">{s.label}</span>
            <div className="h-6 rounded bg-slate-100">
              <div className="flex h-6 items-center rounded px-2 text-[11px] font-semibold tabular-nums text-white transition-all group-hover:opacity-90" style={{ width: `${w}%`, background: isWorst ? "#b45309" : i === 0 ? NAVY : `color-mix(in srgb, ${NAVY} ${100 - i * 7}%, ${LIME})` }}>
                {w > 12 ? fmt(s.value) : ""}
              </div>
            </div>
            <span className={`w-28 text-right text-xs tabular-nums ${isWorst ? "font-semibold text-amber-700" : "text-slate-500"}`}>
              {w <= 12 && <span className="mr-1 font-semibold text-navy-900">{fmt(s.value)}</span>}
              {c != null ? `${pctStr(s.value, steps[i - 1].value)} ↓` : ""}
            </span>
          </div>
        );
      })}
      {worst > 0 && (
        <p className="pt-2 text-xs text-amber-700">
          Biggest drop-off: <b>{steps[worst - 1].label} → {steps[worst].label}</b> ({pctStr(steps[worst].value, steps[worst - 1].value)} convert). Focus here first.
        </p>
      )}
    </div>
  );
}

type Day = { d: string; visitors: number; pageviews: number; signups: number; checkouts: number; trials: number; ctas: number };

function trend(data: Day[], key: keyof Day) {
  if (data.length < 2) return null;
  const h = Math.floor(data.length / 2);
  const sum = (a: Day[]) => a.reduce((s, r) => s + Number(r[key] || 0), 0);
  const a = sum(data.slice(0, h)) / h, b = sum(data.slice(data.length - h)) / h;
  if (!a && !b) return null;
  return a ? ((b - a) / a) * 100 : 100;
}

/** Daily trend: traffic areas (left axis) + conversions lines (right axis), with period-over-period direction chips. */
export function TrendChart({ daily }: { daily: Day[] }) {
  const data = [...daily].sort((a, b) => a.d.localeCompare(b.d));
  if (!data.length) return <Empty text="No events in this range yet." />;
  const chips: { k: keyof Day; label: string }[] = [
    { k: "visitors", label: "Visitors" }, { k: "ctas", label: "CTA clicks" }, { k: "signups", label: "Signups" }, { k: "trials", label: "Trials" },
  ];
  return (
    <div className="px-2 pb-3 pt-3 sm:px-4">
      <div className="mb-2 flex flex-wrap gap-2 px-2">
        {chips.map(({ k, label }) => {
          const t = trend(data, k);
          const tot = data.reduce((s, r) => s + Number(r[k] || 0), 0);
          const up = t != null && t >= 0;
          return (
            <span key={k} className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-600" title="Second half of range vs first half (daily average)">
              {label} <b className="tabular-nums text-navy-900">{fmt(tot)}</b>
              {t != null && <span className={up ? "text-lime-700" : "text-rose-600"}>{up ? "▲" : "▼"} {Math.abs(Math.round(t))}%</span>}
            </span>
          );
        })}
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <ComposedChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
          <defs>
            <linearGradient id="gv" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={NAVY} stopOpacity={0.25} /><stop offset="100%" stopColor={NAVY} stopOpacity={0} /></linearGradient>
          </defs>
          <CartesianGrid stroke="#eef2f7" vertical={false} />
          <XAxis dataKey="d" tickFormatter={(d: string) => d.slice(5)} tick={{ fontSize: 11, fill: "#64748b" }} tickLine={false} axisLine={{ stroke: "#e2e8f0" }} minTickGap={16} />
          <YAxis yAxisId="l" allowDecimals={false} tick={{ fontSize: 11, fill: "#64748b" }} tickLine={false} axisLine={false} />
          <YAxis yAxisId="r" orientation="right" allowDecimals={false} tick={{ fontSize: 11, fill: "#64748b" }} tickLine={false} axisLine={false} />
          <Tooltip content={<Tip />} />
          <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
          <Area yAxisId="l" type="monotone" dataKey="visitors" name="Visitors" stroke={NAVY} strokeWidth={2} fill="url(#gv)" />
          <Line yAxisId="l" type="monotone" dataKey="ctas" name="CTA clicks" stroke="#3b5b9a" strokeWidth={1.5} strokeDasharray="4 3" dot={false} />
          <Line yAxisId="r" type="monotone" dataKey="signups" name="Signups (right)" stroke={LIME} strokeWidth={2.5} dot={{ r: 2.5 }} />
          <Line yAxisId="r" type="monotone" dataKey="trials" name="Trials (right)" stroke="#b45309" strokeWidth={2} dot={{ r: 2 }} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

export type Pair = { name: string; value: number };

/** Ranked horizontal bars with share-of-total labels. */
export function RankBar({ data, max = 8 }: { data: Pair[]; max?: number }) {
  const rows = data.filter((d) => d.value > 0).slice(0, max);
  if (!rows.length) return <Empty />;
  const total = data.reduce((s, d) => s + d.value, 0);
  return (
    <div className="px-2 pt-3 sm:px-3">
      <ResponsiveContainer width="100%" height={Math.max(120, rows.length * 30 + 16)}>
        <BarChart data={rows} layout="vertical" margin={{ top: 0, right: 56, left: 0, bottom: 0 }} barCategoryGap={6}>
          <XAxis type="number" hide />
          <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 11, fill: "#475569" }} tickLine={false} axisLine={false}
            tickFormatter={(v: string) => (v.length > 18 ? v.slice(0, 17) + "…" : v)} />
          <Tooltip cursor={{ fill: "#f1f5f9" }} content={<Tip total={total} />} />
          <Bar dataKey="value" name="Count" radius={[0, 4, 4, 0]}>
            {rows.map((_, i) => <Cell key={i} fill={i === 0 ? NAVY : "#3b5b9a"} fillOpacity={i === 0 ? 1 : 0.75 - i * 0.05} />)}
            <LabelList dataKey="value" position="right" formatter={(v: number) => `${fmt(v)} · ${pctStr(v, total)}`} style={{ fontSize: 11, fill: "#475569" }} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/** Donut for small categorical mixes. */
export function Donut({ data }: { data: Pair[] }) {
  const rows = data.filter((d) => d.value > 0);
  if (!rows.length) return <Empty />;
  const total = rows.reduce((s, d) => s + d.value, 0);
  return (
    <div className="flex items-center gap-3 px-3 py-3">
      <div className="relative h-32 w-32 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip content={<Tip total={total} />} />
            <Pie data={rows} dataKey="value" nameKey="name" innerRadius="62%" outerRadius="100%" paddingAngle={rows.length > 1 ? 2 : 0} stroke="none">
              {rows.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-semibold tabular-nums text-navy-900">{fmt(total)}</span>
          <span className="text-[10px] uppercase tracking-wide text-slate-400">total</span>
        </div>
      </div>
      <ul className="min-w-0 flex-1 space-y-1 text-xs">
        {rows.slice(0, 6).map((r, i) => (
          <li key={r.name} className="flex items-center gap-2">
            <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: PALETTE[i % PALETTE.length] }} />
            <span className="truncate text-slate-600">{r.name}</span>
            <span className="ml-auto tabular-nums text-navy-900">{pctStr(r.value, total)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

