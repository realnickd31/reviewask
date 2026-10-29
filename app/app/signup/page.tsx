import Link from "next/link";
import { redirect } from "next/navigation";
import { currentUser } from "@/lib/session";
import Logo from "@/components/Logo";
import AuthForm from "@/components/AuthForm";
import { signup } from "../actions";
import { isAdminUser } from "@/lib/admin";
export const dynamic = "force-dynamic";
export const metadata = { title: "Start your free trial", alternates: { canonical: "/signup" } };
export default async function Page() {
  const u = await currentUser();
  if (u) redirect(isAdminUser(u) ? "/admin" : u.business_name && u.review_url ? "/dashboard" : "/onboarding");
  return <main id="main" className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 py-12"><div className="w-full max-w-sm">
    <div className="mb-8 flex justify-center"><Logo dark /></div>
    <div className="card p-8"><h1 className="text-xl font-semibold">Create your account</h1><p className="mb-6 mt-1.5 text-sm text-slate-500">7-day free trial, then $39/month. Cancel anytime.</p>
      <ul className="mb-6 space-y-1.5 text-sm text-slate-700"><li>✓ Automatic review requests when a job is done or a customer pays</li><li>✓ One polite day-3 follow-up</li><li>✓ 200 requests/month by text or email</li><li>✓ No contract · cancel before day 7 and pay nothing</li></ul>
      <AuthForm action={signup} label="Create account" /><p className="mt-4 text-xs text-slate-600">Card required at checkout; you won’t be charged until the 7-day trial ends. Questions? support@getreviewask.com</p></div>
    <p className="mt-6 text-center text-sm text-slate-600">Already have an account? <Link href="/login" className="font-medium text-navy-900 underline underline-offset-4">Log in</Link></p>
    <p className="mt-3 text-center text-xs leading-relaxed text-slate-600">By creating an account you agree to the <Link href="/terms" className="underline underline-offset-2">Terms of Service</Link> and <Link href="/privacy" className="underline underline-offset-2">Privacy Policy</Link>.</p>
  </div></main>;
}
