import Link from "next/link";
import { redirect } from "next/navigation";
import { currentUser } from "@/lib/session";
import Logo from "@/components/Logo";
import AuthForm from "@/components/AuthForm";
import { login } from "../actions";
export const dynamic = "force-dynamic";
export const metadata = { title: "Log in", alternates: { canonical: "/login" } };
export default async function Page() {
  const u = await currentUser();
  if (u) redirect(u.business_name && u.review_url ? "/dashboard" : "/onboarding");
  return <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 py-12"><div className="w-full max-w-sm">
    <div className="mb-8 flex justify-center"><Logo dark /></div>
    <div className="card p-8"><h1 className="text-xl font-semibold">Log in to ReviewAsk</h1><p className="mb-6 mt-1.5 text-sm text-slate-500">Enter your email and password.</p>
      <AuthForm action={login} label="Log in" /></div>
    <p className="mt-6 text-center text-sm text-slate-600">New to ReviewAsk? <Link href="/signup" className="font-medium text-navy-900 underline underline-offset-4">Start a free trial</Link></p>
    <p className="mt-3 text-center text-xs text-slate-600"><Link href="/terms" className="hover:underline">Terms</Link> · <Link href="/privacy" className="hover:underline">Privacy</Link></p>
  </div></main>;
}
