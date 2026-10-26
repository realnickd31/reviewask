"use client";
import { useFormState, useFormStatus } from "react-dom";
import type { FormState } from "@/app/actions";
function Submit({ label }: { label: string }) { const { pending } = useFormStatus(); return <button className="btn-lime w-full" disabled={pending}>{pending ? "Working…" : label}</button>; }
export default function AuthForm({ action, label }: { action: (s: FormState, f: FormData) => Promise<FormState>; label: string }) {
  const [state, act] = useFormState(action, undefined);
  return <form action={act} className="space-y-4">
    <div><label className="label">Email</label><input className="input" name="email" type="email" required autoComplete="email" /></div>
    <div><label className="label">Password</label><input className="input" name="password" type="password" required minLength={8} autoComplete="current-password" /></div>
    {state?.error && <p role="alert" className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>}
    <Submit label={label} />
  </form>;
}
