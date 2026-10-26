import Link from "next/link";
import Logo from "@/components/Logo";
import AuthForm from "@/components/AuthForm";
import { signup } from "../actions";
export default function Page() {
  return <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 py-12"><div className="w-full max-w-sm">
    <div className="mb-8 flex justify-center"><Logo dark /></div>
    <div className="card p-8"><h1 className="text-xl font-semibold">Create your account</h1><p className="mb-6 mt-1.5 text-sm text-slate-500">7-day free trial, then $39/month. Cancel anytime.</p>
      <AuthForm action={signup} label="Create account" /></div>
    <p className="mt-6 text-center text-sm text-slate-600">Already have an account? <Link href="/login" className="font-medium text-navy-900 underline underline-offset-4">Log in</Link></p>
    <p className="mt-3 text-center text-xs leading-relaxed text-slate-400">By creating an account you agree to the <Link href="/terms" className="underline underline-offset-2">Terms of Service</Link> and <Link href="/privacy" className="underline underline-offset-2">Privacy Policy</Link>.</p>
  </div></main>;
}
