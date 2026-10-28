"use client";
import { Suspense, useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;

function readUtms(search: URLSearchParams) {
  const out: Record<string, string> = {};
  let found = false;
  for (const k of UTM_KEYS) {
    const v = search.get(k);
    if (v) {
      out[k] = v;
      found = true;
    }
  }
  if (typeof sessionStorage !== "undefined") {
    if (found) sessionStorage.setItem("ra_utm", JSON.stringify(out));
    try {
      const saved = JSON.parse(sessionStorage.getItem("ra_utm") || "{}") as Record<string, string>;
      return { ...saved, ...out };
    } catch {
      return out;
    }
  }
  return out;
}

function send(payload: Record<string, unknown>) {
  const body = JSON.stringify(payload);
  if (typeof navigator !== "undefined" && navigator.sendBeacon) {
    navigator.sendBeacon("/api/analytics/collect", new Blob([body], { type: "application/json" }));
    return;
  }
  fetch("/api/analytics/collect", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => {});
}

function BeaconInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastPath = useRef("");

  useEffect(() => {
    const utms = readUtms(searchParams);
    if (pathname && pathname !== lastPath.current) {
      lastPath.current = pathname;
      const qs = searchParams.toString();
      send({
        event: "pageview",
        path: pathname + (qs ? `?${qs}` : ""),
        referrer: typeof document !== "undefined" ? document.referrer : "",
        ...utms,
      });
    }
  }, [pathname, searchParams]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t) return;
      const el = t.closest("a,button,[data-analytics]") as HTMLElement | null;
      if (!el) return;
      const href = (el as HTMLAnchorElement).href || el.getAttribute("href") || "";
      const label =
        el.getAttribute("data-analytics-label") ||
        el.getAttribute("data-analytics") ||
        (el.textContent || "").trim().slice(0, 80);
      const isCta =
        el.hasAttribute("data-analytics") ||
        /\/signup/.test(href) ||
        /free trial|start free|start 7-day|get started/i.test(label);
      if (!isCta) return;
      let utms: Record<string, string> = {};
      try {
        utms = JSON.parse(sessionStorage.getItem("ra_utm") || "{}");
      } catch { /* ignore */ }
      send({
        event: "cta_click",
        path: typeof window !== "undefined" ? window.location.pathname : "/",
        referrer: typeof document !== "undefined" ? document.referrer : "",
        cta: label,
        meta: { href: href.slice(0, 300), label },
        ...utms,
      });
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}

export default function AnalyticsBeacon() {
  return (
    <Suspense fallback={null}>
      <BeaconInner />
    </Suspense>
  );
}
