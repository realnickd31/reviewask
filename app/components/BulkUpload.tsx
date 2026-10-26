"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Row = { name: string; email: string; phone: string };

function parseCsv(text: string): string[][] {
  const first = text.split(/\r?\n/).find((l) => l.trim()) || "";
  const sep = first.includes("\t") ? "\t" : first.includes(",") ? "," : first.includes(";") ? ";" : "\t";
  const out: string[][] = []; let row: string[] = []; let cur = ""; let q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) { if (c === '"') { if (text[i + 1] === '"') { cur += '"'; i++; } else q = false; } else cur += c; }
    else if (c === '"') q = true;
    else if (c === sep) { row.push(cur); cur = ""; }
    else if (c === "\n" || c === "\r") { if (c === "\r" && text[i + 1] === "\n") i++; row.push(cur); out.push(row); row = []; cur = ""; }
    else cur += c;
  }
  if (cur || row.length) { row.push(cur); out.push(row); }
  return out.map((r) => r.map((x) => x.trim())).filter((r) => r.some(Boolean));
}

const norm = (h: string) => h.toLowerCase().replace(/[^a-z]/g, "");
function toRows(grid: string[][]): Row[] {
  if (!grid.length) return [];
  const h = grid[0].map(norm);
  const find = (...keys: string[]) => h.findIndex((x) => keys.some((k) => x === k || x.includes(k)));
  let ni = find("customername", "fullname", "name"), ei = find("email", "mail"), pi = find("phone", "mobile", "cell", "tel");
  const fi = find("firstname", "first"), li = find("lastname", "last");
  let body = grid.slice(1);
  if (ni < 0 && ei < 0 && pi < 0 && fi < 0) { // no header: assume name,email,phone
    ni = 0; ei = 1; pi = 2; body = grid;
  }
  return body.map((r) => ({
    name: ni >= 0 && !(fi >= 0 && ni === fi) ? r[ni] || "" : [r[fi] || "", li >= 0 ? r[li] || "" : ""].join(" ").trim(),
    email: ei >= 0 ? r[ei] || "" : "",
    phone: pi >= 0 ? r[pi] || "" : "",
  }));
}
const valid = (r: Row) => !!r.name && (!!r.phone || /^\S+@\S+\.\S+$/.test(r.email)) && (!r.email || /^\S+@\S+\.\S+$/.test(r.email));

export default function BulkUpload({ disabled, remaining }: { disabled: boolean; remaining: number }) {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [file, setFile] = useState("");
  const [paste, setPaste] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ t: "ok" | "err"; m: string } | null>(null);
  const router = useRouter();
  const taRef = useRef<HTMLTextAreaElement>(null);
  const good = rows?.filter(valid) ?? [];
  const bad = (rows?.length ?? 0) - good.length;
  const willSend = Math.min(good.length, remaining);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    setMsg(null); const f = e.target.files?.[0]; if (!f) return;
    setFile(f.name); setPaste(""); setRows(toRows(parseCsv(await f.text())));
  }
  function onPaste(v: string) {
    setMsg(null); setPaste(v); setFile("");
    setRows(v.trim() ? toRows(parseCsv(v)) : null);
  }
  async function send() {
    // Read the textarea from the DOM so pastes/autofill that skipped onChange aren't dropped.
    const dom = taRef.current?.value ?? "";
    let cur = rows;
    if (dom.trim() && dom !== paste) { cur = toRows(parseCsv(dom)); setPaste(dom); setFile(""); setRows(cur); }
    const g = cur?.filter(valid) ?? []; const b = (cur?.length ?? 0) - g.length; const n = Math.min(g.length, remaining);
    if (!g.length) { setMsg({ t: "err", m: cur ? "No valid rows — each needs a name and an email or phone." : "Paste rows or choose a CSV file first." }); return; }
    if (n === 0) { setMsg({ t: "err", m: "Monthly limit reached." }); return; }
    if (!confirm(`Send ${n} review request${n === 1 ? "" : "s"} now?`)) return;
    setBusy(true); setMsg(null);
    let res: Response; let j: any = {};
    try { res = await fetch("/api/requests/bulk", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ rows: g }) }); j = await res.json().catch(() => ({})); }
    catch { setBusy(false); setMsg({ t: "err", m: "Network error. Try again." }); return; }
    setBusy(false);
    if (!res.ok) { setMsg({ t: "err", m: j.error || "Bulk send failed." }); return; }
    const parts = [`${j.sent} sent`];
    if (j.quotaSkipped) parts.push(`${j.quotaSkipped} skipped (monthly limit reached)`);
    if (j.invalid) parts.push(`${j.invalid} invalid`);
    if (j.failed) parts.push(`${j.failed} failed`);
    if (b) parts.push(`${b} rows skipped before upload`);
    setMsg({ t: j.failed ? "err" : "ok", m: parts.join(" · ") + "." });
    setRows(null); setFile(""); setPaste(""); router.refresh();
  }

  return <div className="space-y-4">
    <div><label className="label text-base" htmlFor="bulk-paste">Paste from Excel or Google Sheets</label>
      <p className="mb-2 text-xs text-slate-500">Select your customer rows (name, email, phone) in the spreadsheet, copy, and paste here. Headers are optional.</p>
      <textarea id="bulk-paste" ref={taRef} name="paste" className="input h-40 font-mono text-xs" value={paste} onChange={(e) => onPaste(e.target.value)} disabled={disabled}
        placeholder={"Jamie Rivera\tjamie@example.com\t(555) 123-4567\nSam Lee\t\t(555) 987-6543"} /></div>
    <label className={`inline-flex cursor-pointer items-center gap-2 text-sm text-slate-600 ${disabled ? "pointer-events-none opacity-50" : ""}`}>
      <input type="file" accept=".csv,.tsv,.txt,text/csv" className="sr-only" onChange={onFile} disabled={disabled} />
      <span className="underline underline-offset-4 hover:text-navy-900">{file ? `File: ${file}` : "or choose a file (CSV)"}</span>
    </label>
    {rows && <div className="rounded-md bg-slate-50 p-4 text-sm">
      <p><b>{good.length}</b> ready to send{bad > 0 && <> · <span className="text-amber-700">{bad} skipped (missing name or contact)</span></>}</p>
      {good.length > remaining && <p className="mt-1 text-amber-700">Only {remaining} left this month — the rest will be skipped.</p>}
      {good.length > 0 && <ul className="mt-3 space-y-1 text-slate-600">{good.slice(0, 5).map((r, i) => <li key={i}>{r.name} · {r.email || r.phone}</li>)}{good.length > 5 && <li className="text-slate-400">…and {good.length - 5} more</li>}</ul>}
    </div>}
    <div className="flex flex-wrap items-center gap-3">
      <button className="btn-navy" onClick={send} disabled={busy || disabled}>{busy ? "Sending…" : rows ? `Send ${willSend} requests` : "Send all"}</button>
      {msg && <p className={`text-sm ${msg.t === "ok" ? "text-green-700" : "text-red-600"}`}>{msg.m}</p>}
    </div>
  </div>;
}
