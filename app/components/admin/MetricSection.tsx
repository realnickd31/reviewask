"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Donut, RankBar } from "./AdminCharts";

export type Col = { key: string; label: string; align?: "left" | "right"; width?: number; mono?: boolean };
export type Row = Record<string, string | number | null | undefined>;
export type CsvData = { columns: Col[]; rows: Row[] };

function toCsv({ columns, rows }: CsvData) {
  const esc = (v: unknown) => {
    const s = v == null ? "" : String(v);
    return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [columns.map((c) => esc(c.label)).join(","), ...rows.map((r) => columns.map((c) => esc(r[c.key])).join(","))].join("\r\n");
}

function DownloadButton({ name, data }: { name: string; data: CsvData }) {
  const onClick = () => {
    const blob = new Blob(["\ufeff" + toCsv(data)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `reviewask-${name}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!data.rows.length}
      title={data.rows.length ? `Download ${data.rows.length} rows as CSV` : "Nothing to download"}
      className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-navy-900 disabled:cursor-not-allowed disabled:opacity-40"
    >
      <svg aria-hidden viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M8 2.5v8M4.5 7 8 10.5 11.5 7M3 13.5h10" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      CSV
    </button>
  );
}

/** Consistent section card: title, optional hint, CSV download, body. */
export function MetricSection({
  title, hint, csvName, csv, children, className = "",
}: { title: string; hint?: string; csvName: string; csv: CsvData; children: React.ReactNode; className?: string }) {
  return (
    <section className={`card !p-0 overflow-hidden ${className}`}>
      <header className="flex items-start justify-between gap-3 border-b border-slate-100 px-4 py-3">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-navy-900">{title}</h3>
          {hint && <p className="mt-0.5 text-xs text-slate-500">{hint}</p>}
        </div>
        <DownloadButton name={csvName} data={csv} />
      </header>
      {children}
    </section>
  );
}

const MIN_W = 64;

/** Table with drag-to-resize columns (persisted per table) + CSV export. */
export function MetricTable({
  id, title, hint, columns, rows, empty = "No data yet.", className = "", chart, lead,
}: { id: string; title: string; hint?: string; columns: Col[]; rows: Row[]; empty?: string; className?: string;
  /** Render a chart above the table from columns[0] (label) / columns[1] (value). */
  chart?: "bar" | "donut";
  /** Custom visual to lead the card (table becomes collapsible detail). */
  lead?: React.ReactNode }) {
  const [showTable, setShowTable] = useState(!chart && !lead);
  const storeKey = `ra-admin-cols:${id}`;
  const [widths, setWidths] = useState<(number | undefined)[]>(() => columns.map((c) => c.width));
  const tableRef = useRef<HTMLTableElement>(null);
  const drag = useRef<{ i: number; x: number; w: number; next?: number; nw?: number } | null>(null);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(storeKey) || "null");
      if (Array.isArray(saved) && saved.length === columns.length) setWidths(saved);
    } catch {}
  }, [storeKey, columns.length]);

  const measure = useCallback(() => {
    const ths = tableRef.current?.querySelectorAll("thead th");
    return ths ? Array.from(ths).map((th) => (th as HTMLElement).getBoundingClientRect().width) : [];
  }, []);

  const onDown = (i: number) => (e: React.PointerEvent) => {
    e.preventDefault();
    const cur = measure();
    setWidths(cur); // freeze layout so only the dragged boundary moves
    drag.current = { i, x: e.clientX, w: cur[i], next: cur[i + 1] };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  };
  const onMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    let dx = e.clientX - d.x;
    // Trade width with the neighbor column so the table never overflows the card.
    if (d.next != null) dx = Math.max(MIN_W - d.w, Math.min(dx, d.next - MIN_W));
    else dx = Math.max(MIN_W - d.w, dx);
    setWidths((w) => {
      const n = [...w];
      n[d.i] = d.w + dx;
      if (d.next != null) n[d.i + 1] = d.next - dx;
      return n;
    });
  };
  const onUp = () => {
    if (!drag.current) return;
    drag.current = null;
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
    setWidths((w) => { try { localStorage.setItem(storeKey, JSON.stringify(w)); } catch {} return w; });
  };
  const reset = () => {
    try { localStorage.removeItem(storeKey); } catch {}
    setWidths(columns.map((c) => c.width));
  };
  const sized = widths.some((w) => w != null);

  return (
    <MetricSection title={title} hint={hint} csvName={id} csv={{ columns, rows }} className={className}>
      {lead}
      {chart && (() => {
        const pairs = rows.map((r) => ({ name: String(r[columns[0].key] ?? "—"), value: Number(r[columns[1].key]) || 0 }));
        return chart === "donut" ? <Donut data={pairs} /> : <RankBar data={pairs} />;
      })()}
      {(chart || lead) && (
        <button type="button" onClick={() => setShowTable((v) => !v)} aria-expanded={showTable}
          className="flex w-full items-center justify-center gap-1 border-t border-slate-100 py-1.5 text-[11px] font-medium text-slate-500 hover:bg-slate-50 hover:text-navy-900">
          {showTable ? "Hide table" : `Show table (${rows.length} rows)`} <span aria-hidden>{showTable ? "▴" : "▾"}</span>
        </button>
      )}
      <div className="overflow-x-auto" hidden={!showTable}>
        <table ref={tableRef} className="w-full text-sm" style={{ tableLayout: sized ? "fixed" : "auto" }}>
          <colgroup>{columns.map((c, i) => <col key={c.key} style={widths[i] != null ? { width: widths[i] } : undefined} />)}</colgroup>
          <thead className="bg-slate-50/70 text-[11px] font-medium uppercase tracking-wide text-slate-500">
            <tr>
              {columns.map((c, i) => (
                <th key={c.key} className={`group relative px-4 py-2 ${c.align === "right" ? "text-right" : "text-left"}`}>
                  <span className="block truncate">{c.label}</span>
                  {i < columns.length - 1 && (
                    <span
                      role="separator"
                      aria-orientation="vertical"
                      aria-label={`Resize ${c.label} column`}
                      title="Drag to resize · double-click to reset"
                      onPointerDown={onDown(i)}
                      onPointerMove={onMove}
                      onPointerUp={onUp}
                      onPointerCancel={onUp}
                      onDoubleClick={reset}
                      className="absolute -right-1.5 top-0 z-10 flex h-full w-3 cursor-col-resize touch-none justify-center"
                    >
                      <span className="my-1.5 w-px bg-slate-200 transition-colors group-hover:bg-slate-300 hover:!bg-navy-900 active:!bg-navy-900" />
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, ri) => (
              <tr key={ri} className="border-t border-slate-100 hover:bg-slate-50/60">
                {columns.map((c, ci) => (
                  <td
                    key={c.key}
                    title={r[c.key] == null ? undefined : String(r[c.key])}
                    className={`truncate px-4 py-2 ${c.align === "right" ? "text-right tabular-nums" : "text-left"} ${ci === 0 ? "text-slate-800" : "text-slate-600"} ${c.mono ? "font-mono text-xs" : ""}`}
                  >
                    {r[c.key] == null || r[c.key] === "" ? "—" : typeof r[c.key] === "number" ? (r[c.key] as number).toLocaleString() : r[c.key]}
                  </td>
                ))}
              </tr>
            ))}
            {!rows.length && (
              <tr><td colSpan={columns.length} className="px-4 py-6 text-center text-sm text-slate-500">{empty}</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </MetricSection>
  );
}
