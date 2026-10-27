"use client";
import { useState } from "react";
export default function ReviewLinkTool() {
  const [id, setId] = useState(""); const [copied, setCopied] = useState(false);
  const pid = id.trim().replace(/^.*placeid=/i, "").replace(/[&#].*$/, "");
  const ok = /^[A-Za-z0-9_-]{10,}$/.test(pid);
  const url = ok ? `https://search.google.com/local/writereview?placeid=${pid}` : "";
  return <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-6">
    <label className="label" htmlFor="pid">Your Google Place ID</label>
    <input id="pid" className="input font-mono text-sm" placeholder="ChIJ..." value={id} onChange={(e) => { setId(e.target.value); setCopied(false); }} />
    {id && !ok && <p className="text-sm text-amber-700">That doesn&apos;t look like a Place ID. They usually start with &ldquo;ChIJ&rdquo;.</p>}
    {ok && <div className="space-y-3"><p className="break-all rounded-md bg-slate-50 p-3 font-mono text-sm">{url}</p>
      <div className="flex flex-wrap gap-3"><button className="btn-navy px-4 py-2" onClick={() => { navigator.clipboard?.writeText(url); setCopied(true); }}>{copied ? "Copied" : "Copy link"}</button>
      <a href={url} target="_blank" rel="noopener noreferrer" className="btn-ghost px-4 py-2 !text-navy-900 ring-1 ring-slate-300">Test it</a></div></div>}
  </div>;
}
