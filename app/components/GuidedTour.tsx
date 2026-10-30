"use client";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { markWalkthroughDone } from "@/app/actions";

// First-login guided tour: spotlights real dashboard UI. Marked done ONLY on Skip tour, Done (last step), or Esc. Next/Back only change the step index (marking done mid-tour revalidates the dashboard and unmounts the tour).
type Step = { target: string[]; title: string; body: React.ReactNode; extra?: React.ReactNode };

export default function GuidedTour({ reviewUrl, hasReviewData }: { reviewUrl?: string | null; hasReviewData: boolean }) {
  const hasLink = !!reviewUrl?.trim();
  const linkStep: Step = hasLink ? { target: ["tour-review-link"], title: "1. Your Google review link (required)",
      body: <>Every review request sends customers straight to this link. It&apos;s required: nothing sends without it (typed in, automatic, API, or spreadsheet). Yours is set to <span className="break-all font-medium">{shortUrl(reviewUrl!)}</span>. Change it anytime in Settings → Account.</>,
      extra: <Link href="/settings#account" className="text-sm font-medium text-navy-900 underline underline-offset-4">Open Settings → Account</Link> }
    : { target: ["tour-review-link"], title: "1. Add your Google review link first",
      body: <>Every review request sends customers straight to your Google review link, so nothing can send until it&apos;s added. Paste it in Settings → Account, save, and come back here to continue the tour.</>,
      extra: <Link href="/settings#account" className="btn-navy inline-flex min-h-[40px] items-center text-sm">Add my review link in Settings → Account</Link> };
  // Without a link, only step 1 exists: later steps stay hidden until the link is saved (prop updates on return and unlocks Next).
  const steps: Step[] = !hasLink ? [linkStep] : [
    linkStep,
    { target: ["quick"], title: "2. Send yourself a test review request",
      body: <>Put your own name and phone or email here and tap Send now. You&apos;ll see exactly what your customers get. This is all you need to start getting reviews.</> },
    { target: ["tour-connect", "tour-connect-link"], title: "3. Optional: go automatic",
      body: <>Want this on autopilot? Connect the tool you already use. When a customer’s work is finished and paid, we send them a review request using only their name and phone or email. We don’t see your books or the rest of your account. Fine to skip and type names in for now.</>,
      extra: <Link href="/settings#integrations" className="text-sm text-slate-600 underline underline-offset-4">See tools</Link> },
    { target: ["tour-reviews"], title: "4. Your Google reviews, tracked",
      body: hasReviewData ? <>We check your Google review count daily and show how it grows from the day you started.</> : <>No review data yet. We&apos;ll save today&apos;s count as your starting point and check daily, so this fills in as reviews come in.</> },
  ];
  const [i, setI] = useState(0);
  const [open, setOpen] = useState(true);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const step = steps[Math.min(i, steps.length - 1)];
  // Stable primitive key: `steps` is rebuilt every render, so never depend on the step object.
  const targetKey = step.target.join(",");

  const marked = useRef(false);
  const markDone = useCallback(() => {
    if (marked.current) return;
    marked.current = true;
    markWalkthroughDone().catch(() => { marked.current = false; });
  }, []);
  const close = useCallback(() => { markDone(); setOpen(false); }, [markDone]);
  const go = (n: number) => setI(n);

  const measure = useCallback(() => {
    const el = targetKey.split(",").map((id) => document.getElementById(id)).find((e) => e && e.offsetParent !== null) ?? null;
    const r = el ? el.getBoundingClientRect() : null;
    // Only update when geometry actually changed, so measure can never loop renders.
    setRect((prev) => {
      if (!r) return prev === null ? prev : null;
      if (prev && prev.top === r.top && prev.left === r.left && prev.width === r.width && prev.height === r.height) return prev;
      return r;
    });
  }, [targetKey]);
  useLayoutEffect(() => {
    if (!open) return;
    const el = targetKey.split(",").map((id) => document.getElementById(id)).find((e) => e && e.offsetParent !== null);
    el?.scrollIntoView({ block: "center", behavior: "instant" as ScrollBehavior });
    measure();
    window.addEventListener("resize", measure); window.addEventListener("scroll", measure, true);
    return () => { window.removeEventListener("resize", measure); window.removeEventListener("scroll", measure, true); };
  }, [measure, targetKey, open]);
  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", k); return () => window.removeEventListener("keydown", k);
  }, [close]);
  if (!open) return null;

  const last = i === steps.length - 1;
  const pad = 8;
  const hole = rect && { top: rect.top - pad, left: rect.left - pad, width: rect.width + pad * 2, height: rect.height + pad * 2 };
  const vh = typeof window !== "undefined" ? window.innerHeight : 800;
  const below = !hole || hole.top + hole.height + 260 < vh;
  const popTop = !hole ? vh / 2 - 120 : below ? Math.min(hole.top + hole.height + 12, vh - 260) : Math.max(12, hole.top - 12 - 240);
  const isConnect = step.target[0] === "tour-connect";

  return <div className="fixed inset-0 z-[100]" role="dialog" aria-modal="true" aria-labelledby="tour-title">
    {hole ? <div className="pointer-events-none fixed rounded-xl ring-4 ring-lime-400 transition-all duration-200"
      style={{ ...hole, boxShadow: "0 0 0 9999px rgba(16,27,51,0.6)" }} />
      : <div className="fixed inset-0 bg-[rgba(16,27,51,0.6)]" />}
    <div className="fixed left-1/2 w-[min(92vw,26rem)] -translate-x-1/2 rounded-xl bg-white p-5 shadow-2xl" style={{ top: popTop }}>
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{hasLink ? <>Quick tour · {i + 1} of {steps.length}</> : "Quick tour · Step 1"}</p>
      <h2 id="tour-title" className="mt-1 text-lg font-semibold text-navy-900">{step.title}</h2>
      <p className="mt-2 text-sm text-slate-700">{step.body}</p>
      {step.extra && <div className="mt-3">{step.extra}</div>}
      {!hasLink && <p className="mt-3 text-xs text-slate-500">Next unlocks once your review link is saved.</p>}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-2">
        <button type="button" onClick={close} className="text-sm text-slate-500 underline underline-offset-4">Skip tour</button>
        <div className="flex gap-2">
          {i > 0 && <button type="button" onClick={() => go(i - 1)} className="min-h-[40px] rounded-md border border-slate-300 px-3 text-sm font-semibold text-navy-900">Back</button>}
          {hasLink
            ? <button type="button" autoFocus onClick={() => last ? close() : go(i + 1)} className="btn-navy min-h-[40px]">{last ? "Done" : isConnect ? "Skip for now" : "Next"}</button>
            : <button type="button" disabled aria-disabled="true" title="Add your Google review link to continue" className="btn-navy min-h-[40px] cursor-not-allowed opacity-50">Next</button>}
        </div>
      </div>
    </div>
  </div>;
}

function shortUrl(u: string) { return u.replace(/^https?:\/\//, "").slice(0, 48) + (u.replace(/^https?:\/\//, "").length > 48 ? "…" : ""); }
