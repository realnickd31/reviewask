"use client";
import { useFormState, useFormStatus } from "react-dom";
import type { FormState } from "@/app/actions";
function Submit({ label }: { label: string }) { const { pending } = useFormStatus(); return <button className="btn-navy w-full sm:w-auto" disabled={pending}>{pending ? "Saving…" : label}</button>; }
export default function BizForm({ action, label, name, url }: { action: (s: FormState, f: FormData) => Promise<FormState>; label: string; name?: string | null; url?: string | null }) {
  const [state, act] = useFormState(action, undefined);
  return <form action={act} className="space-y-4">
    <div><label className="label">Business name</label><input className="input" name="business_name" defaultValue={name ?? ""} placeholder="Acme Co." required /></div>
    <div><label className="label">Google review link</label><input className="input" name="review_url" type="url" defaultValue={url ?? ""} placeholder="https://g.page/r/XXXX/review" required />
      <p className="mt-1 text-xs text-slate-500">In Google Business Profile, click <b>Ask for reviews</b> and copy the link. Any Google Maps place URL works too.</p></div>
    {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
    {state?.ok && <p className="text-sm text-green-700">{state.ok}</p>}
    <Submit label={label} />
  </form>;
}
