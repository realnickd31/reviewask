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
  const go = (id: string) => { setTab(id); history.replaceState(null, "", `#${id}`); document.getElementById("settings-tabs")?.scrollIntoView({ block: "nearest" }); };
  return <>
    <div role="tablist" aria-label="Settings sections" id="settings-tabs" className="-mx-4 mt-6 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:gap-1 sm:rounded-xl sm:bg-slate-100 sm:p-1 sm:pb-1">
      {panels.map((p) => <button key={p.id} role="tab" type="button" id={`tab-${p.id}`} aria-selected={tab === p.id} aria-controls={`panel-${p.id}`} onClick={() => go(p.id)}
        className={`min-h-[40px] shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition sm:flex-1 sm:rounded-lg ${tab === p.id ? "bg-navy-900 text-white sm:bg-white sm:text-navy-900 sm:shadow-sm sm:ring-1 sm:ring-slate-200" : "bg-slate-100 text-slate-700 hover:text-navy-900 sm:bg-transparent"}`}>{p.label}</button>)}
    </div>
    {panels.map((p) => <div key={p.id} role="tabpanel" id={`panel-${p.id}`} data-tab={p.id} aria-labelledby={`tab-${p.id}`} hidden={tab !== p.id}>{p.node}</div>)}
  </>;
}
