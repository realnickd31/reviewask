"use client";
import { useState } from "react";
import Link from "next/link";

function Copy({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  return (
    <button type="button" className="btn-outline px-3 py-1.5 text-xs" onClick={async () => {
      await navigator.clipboard.writeText(text); setDone(true); setTimeout(() => setDone(false), 1500);
    }}>{done ? "Copied" : "Copy"}</button>
  );
}

export default function ApiAccessCard({
  initialToken, callbackUrl, secretSet,
}: { initialToken: string | null; callbackUrl: string | null; secretSet: boolean }) {
  const [token, setToken] = useState(initialToken);
  const [url, setUrl] = useState(callbackUrl || "");
  const [savedUrl, setSavedUrl] = useState(callbackUrl);
  const [secret, setSecret] = useState<string | null>(null);
  const [hasSecret, setHasSecret] = useState(secretSet);
  const [busy, setBusy] = useState<"key" | "url" | "clear" | "clearKey" | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function rotateKey() {
    const warn = token
      ? "Make a new API key? This is the same key Zapier uses — your Zap will stop until you paste the new key. This does not change automatic asks."
      : "Create an API key? This is the same key Zapier uses. This does not turn on automatic asks.";
    if (!confirm(warn)) return;
    setBusy("key"); setErr(null); setMsg(null);
    const r = await fetch("/api/v1/keys", { method: "POST" });
    const j = await r.json().catch(() => ({}));
    setBusy(null);
    if (!r.ok) { setErr(j.error || "Couldn’t create the key."); return; }
    setToken(j.token);
    setMsg("New key ready — copy it now. It won’t be shown again after you leave this page.");
  }

  async function clearKey() {
    if (!confirm("Remove your API key? Zapier and any API clients will stop working until you create a new one.")) return;
    setBusy("clearKey"); setErr(null); setMsg(null);
    const r = await fetch("/api/v1/keys", { method: "DELETE" });
    setBusy(null);
    if (!r.ok) { setErr("Couldn’t remove the key."); return; }
    setToken(null); setMsg("API key removed.");
  }

  async function saveUrl(rotateSecret = false) {
    setBusy("url"); setErr(null); setMsg(null);
    const r = await fetch("/api/v1/endpoints", {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, rotate_secret: rotateSecret }),
    });
    const j = await r.json().catch(() => ({}));
    setBusy(null);
    if (!r.ok) { setErr(j.error || "Couldn’t save that URL."); return; }
    setSavedUrl(j.url || url);
    if (j.secret) { setSecret(j.secret); setHasSecret(true); setMsg("Callback URL saved. Copy the signing secret now — we only show it once."); }
    else { setMsg("Callback URL saved."); }
  }

  async function clearUrl() {
    if (!confirm("Remove your callback URL and signing secret?")) return;
    setBusy("clear"); setErr(null); setMsg(null);
    const r = await fetch("/api/v1/endpoints", { method: "DELETE" });
    setBusy(null);
    if (!r.ok) { setErr("Couldn’t clear the URL."); return; }
    setUrl(""); setSavedUrl(null); setSecret(null); setHasSecret(false); setMsg("Callbacks removed.");
  }

  return (
    <div className="space-y-6 text-sm">
      <p className="text-slate-700">
        Build on ReviewAsk with a REST API and optional outbound callbacks.{" "}
        <Link href="/docs/api" className="underline">API docs</Link>
        {" · "}
        <a href="/openapi.json" className="underline" target="_blank" rel="noreferrer">OpenAPI</a>.
      </p>

      <div>
        <h3 className="font-semibold text-navy-900">API key</h3>
        <p className="mt-1 text-slate-600">Send as <code className="text-xs">Authorization: Bearer ra_…</code> or <code className="text-xs">X-Api-Token</code>.</p>
        <p className="mt-2 rounded-md bg-amber-50 px-3 py-2 text-amber-900 ring-1 ring-amber-100">
          Same key as Zapier. Rotating it breaks an existing Zap until you update it. Disconnecting Zapier clears this key too. Creating a key here does <b>not</b> turn on automatic asks.
        </p>
        {token ? (
          <div className="mt-3 flex gap-2">
            <code className="input flex-1 overflow-x-auto whitespace-nowrap font-mono text-xs">{token}</code>
            <Copy text={token} />
          </div>
        ) : (
          <p className="mt-3 text-slate-500">No key yet.</p>
        )}
        <div className="mt-3 flex flex-wrap gap-2">
          <button type="button" className="btn-navy" onClick={rotateKey} disabled={!!busy}>
            {busy === "key" ? "Working…" : token ? "Make a new key" : "Create API key"}
          </button>
          {token && (
            <button type="button" className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-semibold text-navy-900 hover:bg-slate-50"
              onClick={clearKey} disabled={!!busy}>
              {busy === "clearKey" ? "…" : "Remove key"}
            </button>
          )}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-navy-900">Outbound callbacks</h3>
        <p className="mt-1 text-slate-600">
          We POST signed JSON to your HTTPS URL for <code className="text-xs">request.created</code>,{" "}
          <code className="text-xs">request.sent</code>, <code className="text-xs">request.reminded</code>,{" "}
          <code className="text-xs">request.cancelled</code>, and <code className="text-xs">followup.cancelled</code>.
          Verify with header <code className="text-xs">X-ReviewAsk-Signature</code> (<code className="text-xs">sha256=…</code> HMAC of the raw body).
        </p>
        <label className="label mt-3">Callback URL</label>
        <input className="input mt-1 w-full font-mono text-xs" placeholder="https://example.com/hooks/reviewask"
          value={url} onChange={(e) => setUrl(e.target.value)} />
        {secret && (
          <div className="mt-3">
            <label className="label">Signing secret (copy now)</label>
            <div className="mt-1 flex gap-2">
              <code className="input flex-1 overflow-x-auto whitespace-nowrap font-mono text-xs">{secret}</code>
              <Copy text={secret} />
            </div>
          </div>
        )}
        {!secret && hasSecret && <p className="mt-2 text-slate-500">Signing secret is set. Save again with “Rotate secret” to get a new one.</p>}
        <div className="mt-3 flex flex-wrap gap-2">
          <button type="button" className="btn-navy" onClick={() => saveUrl(false)} disabled={!!busy || !url.trim()}>
            {busy === "url" ? "Saving…" : "Save URL"}
          </button>
          {savedUrl && (
            <>
              <button type="button" className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-semibold text-navy-900 hover:bg-slate-50"
                onClick={() => saveUrl(true)} disabled={!!busy || !url.trim()}>
                Rotate secret
              </button>
              <button type="button" className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-semibold text-navy-900 hover:bg-slate-50"
                onClick={clearUrl} disabled={!!busy}>
                {busy === "clear" ? "…" : "Remove"}
              </button>
            </>
          )}
        </div>
      </div>

      {msg && <p className="rounded-md bg-lime-50 px-3 py-2 text-lime-800">{msg}</p>}
      {err && <p className="rounded-md bg-red-50 px-3 py-2 text-red-700">{err}</p>}
    </div>
  );
}
