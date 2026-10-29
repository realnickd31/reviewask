"use client";
import { useEffect } from "react";
// Route-level error boundary: replaces Next's bare "Application error: a client-side exception has occurred".
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Stale HTML after a deploy can reference JS chunks that no longer exist. Reload once to fetch the new build.
    if (/ChunkLoadError|Loading chunk|Failed to fetch dynamically imported module/i.test(`${error?.name} ${error?.message}`)) {
      try { if (!sessionStorage.getItem("ra_chunk_reload")) { sessionStorage.setItem("ra_chunk_reload", "1"); location.reload(); } } catch { /* ignore */ }
    }
  }, [error]);
  return <main id="main" className="mx-auto max-w-xl px-6 py-24 text-center">
    <h1 className="text-2xl font-semibold text-navy-900">Something didn&apos;t load right</h1>
    <p className="mt-3 text-slate-600">Please try again. If it keeps happening, email <a className="underline" href="mailto:support@getreviewask.com">support@getreviewask.com</a>.</p>
    <div className="mt-8 flex justify-center gap-3"><button onClick={() => reset()} className="btn-navy px-4 py-2">Try again</button><a href="/" className="btn px-4 py-2 ring-1 ring-slate-300">Go to homepage</a></div>
  </main>;
}
