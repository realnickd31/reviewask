"use client";
import { useEffect, useState, type ReactNode } from "react";

type Panel = { id: string; label: string; node: ReactNode };
// Old deep links that live inside a tab.
const ALIAS: Record<string, string> = { automatic: "integrations", timing: "integrations", zapier: "integrations", connectors: "integrations", callbacks: "api", webhooks: "api", plan: "billing" };

export default function SettingsTabs({ panels, initial }: { panels: Panel[]; initial: string }) {
  const [tab, setTab] = useState(initial);
  useEffect(() => {
    const sync = () => {
      const h = decodeURIComponent(location.hash.slice(1));
      if (!h) return;
      const t = panels.some((p) => p.id === h) ? h : ALIAS[h] || (document.getElementById(h)?.closest("[data-tab]") as HTMLElement | null)?.dataset.tab;
      if (t) { setTab(t); if (t !== h) requestAnimationFrame(() => document.getElementById(h)?.scrollIntoView({ block: "start" })); }
    };
    sync(); window.addEventListener("hashchange", sync); return () => window.removeEventListener("hashchange", sync);
  }, [panels]);
  const go = (id: string) => { setTab(id); history.replaceState(null, "", `#${id}`); window.scrollTo({ top: 0 }); };
  return <>
    <div role="tablist" aria-label="Settings sections" className="mt-6 grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1 sm:flex">
      {panels.map((p) => <button key={p.id} role="tab" type="button" id={`tab-${p.id}`} aria-selected={tab === p.id} aria-controls={`panel-${p.id}`} onClick={() => go(p.id)}
        className={`flex-1 whitespace-nowrap rounded-lg px-3 sm:px-4 py-2 text-sm font-semibold transition ${tab === p.id ? "bg-white text-navy-900 shadow-sm ring-1 ring-slate-200" : "text-slate-600 hover:text-navy-900"}`}>{p.label}</button>)}
    </div>
    {panels.map((p) => <div key={p.id} role="tabpanel" id={`panel-${p.id}`} data-tab={p.id} aria-labelledby={`tab-${p.id}`} hidden={tab !== p.id}>{p.node}</div>)}
  </>;
}
