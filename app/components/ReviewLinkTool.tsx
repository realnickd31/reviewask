"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { extractPlaceId, SHORT_LINK } from "@/lib/placeId";
export default function ReviewLinkTool() {
  const [input, setInput] = useState(""); const [copied, setCopied] = useState(false);
  const [resolved, setResolved] = useState<string | null>(null); const [loading, setLoading] = useState(false);
  const [advanced, setAdvanced] = useState(false);
  const local = input.trim() ? extractPlaceId(input) : null;
  const isShort = SHORT_LINK.test(input.trim());
  useEffect(() => {
    setResolved(null);
    if (local || !input.trim() || !(isShort || /google\./i.test(input))) return;
    setLoading(true); const ctl = new AbortController();
    const t = setTimeout(() => fetch(`/api/tools/resolve-place?url=${encodeURIComponent(input.trim())}`, { signal: ctl.signal })
      .then((r) => r.json()).then((d) => setResolved(d.placeId || "")).catch(() => setResolved("")).finally(() => setLoading(false)), 300);
    return () => { clearTimeout(t); ctl.abort(); };
  }, [input, local, isShort]);
  const pid = local || resolved || null;
  const url = pid ? `https://search.google.com/local/writereview?placeid=${pid}` : "";
  const failed = input.trim() && !pid && !loading && (resolved === "" || !(isShort || /google\./i.test(input)));
  return <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-6">
    <label className="label" htmlFor="maplink">{advanced ? "Your Google Place ID" : "Paste your Google Maps link"}</label>
    <input id="maplink" className="input text-sm" placeholder={advanced ? "ChIJ..." : "https://maps.app.goo.gl/... or a google.com/maps link"} value={input} onChange={(e) => { setInput(e.target.value); setCopied(false); }} />
    <p className="text-xs text-slate-500">Don&apos;t have it? Open Google Maps, search your business, tap <b>Share</b>, then <b>Copy link</b>. {advanced ? <button type="button" className="underline" onClick={() => setAdvanced(false)}>Use a Maps link instead</button> : <button type="button" className="underline" onClick={() => setAdvanced(true)}>Already have a Place ID?</button>}</p>
    {loading && <p className="text-sm text-slate-600">Looking up your business&hellip;</p>}
    {failed && <div className="rounded-md bg-amber-50 p-3 text-sm text-amber-900"><p className="font-medium">We couldn&apos;t find your business in that link. Try this:</p>
      <ol className="mt-1 list-decimal space-y-0.5 pl-5"><li>Open <a href="https://www.google.com/maps" target="_blank" rel="noopener noreferrer" className="underline">Google Maps</a> (website or app).</li><li>Search your business name and click it so its profile opens.</li><li>Tap <b>Share</b>, then <b>Copy link</b>.</li><li>Paste that link here.</li></ol>
      <p className="mt-1">On a computer you can also just copy the address bar while your business is open on Google Maps.</p></div>}
    {pid && <div className="space-y-3"><p className="text-sm font-medium text-slate-700">Your direct Google review link:</p><p className="break-all rounded-md bg-slate-50 p-3 font-mono text-sm">{url}</p>
      <div className="flex flex-wrap gap-3"><button className="btn-navy px-4 py-2" onClick={() => { navigator.clipboard?.writeText(url); setCopied(true); }}>{copied ? "Copied" : "Copy link"}</button>
      <a href={url} target="_blank" rel="noopener noreferrer" className="btn-ghost px-4 py-2 !text-navy-900 ring-1 ring-slate-300">Test it (opens your review form)</a></div>
      <p className="text-xs text-slate-500">Check that the test opens a review box for <i>your</i> business. Place ID: <span className="font-mono">{pid}</span></p>
      <p className="rounded-md bg-sky-50 p-3 text-sm text-slate-700">Next step: send this link to customers right after you finish the work, when they&apos;re happiest. <Link href="/signup" className="font-medium underline underline-offset-4">ReviewAsk can send it for you automatically</Link>, with one polite follow-up.</p></div>}
  </div>;
}
