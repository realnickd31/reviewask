import Logo from "@/components/Logo";
import BizForm from "@/components/BizForm";
import { requireUser } from "@/lib/session";
import { isActive } from "@/lib/db";
import { redirect } from "next/navigation";
import { saveOnboarding } from "../actions";
import { isAdminUser } from "@/lib/admin";
export const dynamic = "force-dynamic";
export default async function Page({ searchParams }: { searchParams: { step?: string; canceled?: string } }) {
  const u = await requireUser();
  if (isAdminUser(u)) redirect("/admin");
  const pay = searchParams.step === "pay" && u.business_name;
  if (pay && isActive(u)) redirect("/dashboard");
  return <main id="main" className="min-h-screen bg-slate-50 px-4 py-12"><div className="mx-auto max-w-lg">
    <div className="mb-8 flex justify-center"><Logo dark /></div>
    <p className="mb-3 text-center text-sm text-slate-500">Step {pay ? 2 : 1} of 2</p>
    {!pay ? <div className="card"><h1 className="text-xl font-semibold">Tell us about your business</h1><p className="mb-6 mt-1 text-sm text-slate-600">This is what customers will see in the email.</p>
      <BizForm action={saveOnboarding} label="Continue" name={u.business_name} url={u.review_url} /></div>
    : <div className="card"><h1 className="text-xl font-semibold">Start your 7-day free trial</h1>
      <p className="mt-1 text-sm text-slate-600">Unlock sending for <b>{u.business_name}</b>. You won&apos;t be charged until the trial ends.</p>
      {searchParams.canceled && <p className="mt-3 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">Checkout was canceled. You can try again anytime.</p>}
      <form action="/api/stripe/checkout" method="post" className="mt-6 space-y-3">
        <label className="flex cursor-pointer items-center justify-between rounded-md border border-slate-200 bg-white p-4 text-sm has-[:checked]:border-navy-900 has-[:checked]:ring-1 has-[:checked]:ring-navy-900"><span><input type="radio" name="plan" value="monthly" defaultChecked className="mr-2" />Monthly</span><b>$39/mo</b></label>
        <label className="flex cursor-pointer items-center justify-between rounded-md border border-slate-200 bg-white p-4 text-sm has-[:checked]:border-navy-900 has-[:checked]:ring-1 has-[:checked]:ring-navy-900"><span><input type="radio" name="plan" value="annual" className="mr-2" />Annual <span className="ml-1 rounded-full bg-lime-50 px-2 py-0.5 text-xs font-medium text-lime-700">2 months free</span></span><b>$390/yr</b></label>
        <button className="btn-lime w-full">Continue to secure checkout</button>
        <p className="text-center text-xs text-slate-500">You’ll be redirected to Stripe to enter payment details.</p>
      </form>
      <a href="/onboarding" className="mt-4 block text-center text-sm text-slate-500 underline">Edit business details</a></div>}
  </div></main>;
}
