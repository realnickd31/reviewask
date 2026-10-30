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
  const [reveal, setReveal] = useState(false);
  const [url, setUrl] = useState(callbackUrl || "");
  const [savedUrl, setSavedUrl] = useState(callbackUrl);
  const [secret, setSecret] = useState<string | null>(null);
  const [hasSecret, setHasSecret] = useState(secretSet);
  const [busy, setBusy] = useState<"key" | "url" | "clear" | "clearKey" | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [ask, setAsk] = useState<null | "key" | "clearKey" | "clear">(null);

  async function rotateKey() {
    setBusy("key"); setErr(null); setMsg(null);
    const r = await fetch("/api/v1/keys", { method: "POST" });
    const j = await r.json().catch(() => ({}));
    setBusy(null);
    if (!r.ok) { setErr(j.error || "Couldn’t create the key."); return; }
    setToken(j.token);
    setMsg("New key ready — copy it now. It won’t be shown again after you leave this page.");
  }

  async function clearKey() {
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
    setBusy("clear"); setErr(null); setMsg(null);
    const r = await fetch("/api/v1/endpoints", { method: "DELETE" });
    setBusy(null);
    if (!r.ok) { setErr("Couldn’t clear the URL."); return; }
    setUrl(""); setSavedUrl(null); setSecret(null); setHasSecret(false); setMsg("Callbacks removed.");
  }

  const ASK_TEXT = {
    key: "The old key stops working right away. If you use Zapier or any other app with this key, paste the new one there. Your automatic asks settings won’t change.",
    clearKey: "Anything using this key (Zapier, other apps) stops working. A new key is created the next time you open Settings.",
    clear: "This removes your callback URL and signing secret.",
  } as const;
  const Confirm = ({ which, label, run }: { which: "key" | "clearKey" | "clear"; label: string; run: () => void }) => ask === which ? (
    <div className="mt-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-amber-900">
      <p>{ASK_TEXT[which]}</p>
      <div className="mt-2 flex gap-2">
        <button type="button" className="btn-navy px-3 py-1.5 text-xs" onClick={() => { setAsk(null); run(); }}>{label}</button>
        <button type="button" className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-navy-900 hover:bg-slate-50" onClick={() => setAsk(null)}>Cancel</button>
      </div>
    </div>
  ) : null;

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
        <p className="mt-1 text-slate-600">
          Your account has one private key. It lets other apps — Zapier, or anything a developer builds — send review asks for you. Keep it secret, like a password.
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-600">
          <li>The same key works for the API and for Zapier. You don’t need Zapier to have one.</li>
          <li>Make a new key any time. The old one stops working right away, so paste the new key anywhere you used the old one.</li>
          <li>Disconnecting Zapier does <b>not</b> change or remove this key.</li>
        </ul>
        <p className="mt-2 text-xs text-slate-500">For developers: send it as <code>Authorization: Bearer ra_…</code> or <code>X-Api-Token</code>.</p>
        {token ? (
          <div className="mt-3 flex gap-2">
            <code className="input flex-1 overflow-x-auto whitespace-nowrap font-mono text-xs">{reveal ? token : `${token.slice(0, 6)}${"•".repeat(20)}${token.slice(-4)}`}</code>
            <button type="button" className="btn-outline min-h-[40px]" onClick={() => setReveal(!reveal)}>{reveal ? "Hide" : "Reveal"}</button>
            <Copy text={token} />
          </div>
        ) : (
          <p className="mt-3 text-slate-500">No key yet.</p>
        )}
        <div className="mt-3 flex flex-wrap gap-2">
          <button type="button" className="btn-navy" onClick={() => (token ? setAsk("key") : rotateKey())} disabled={!!busy}>
            {busy === "key" ? "Working…" : token ? "Make a new key" : "Create API key"}
          </button>
          {token && (
            <button type="button" className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-semibold text-navy-900 hover:bg-slate-50"
              onClick={() => setAsk("clearKey")} disabled={!!busy}>
              {busy === "clearKey" ? "…" : "Remove key"}
            </button>
          )}
        </div>
        <Confirm which="key" label="Yes, make a new key" run={rotateKey} />
        <Confirm which="clearKey" label="Yes, remove key" run={clearKey} />
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
                onClick={() => setAsk("clear")} disabled={!!busy}>
                {busy === "clear" ? "…" : "Remove"}
              </button>
            </>
          )}
        </div>
        <Confirm which="clear" label="Yes, remove" run={clearUrl} />
      </div>

      {msg && <p className="rounded-md bg-lime-50 px-3 py-2 text-lime-800">{msg}</p>}
      {err && <p className="rounded-md bg-red-50 px-3 py-2 text-red-700">{err}</p>}
    </div>
  );
}
