import { redirect } from "next/navigation";
import AppNav from "@/components/AppNav";
import QuickAsk from "@/components/QuickAsk";
import { requireUser } from "@/lib/session";
import { isActive, needsPayment, usedThisMonth, MONTHLY_QUOTA } from "@/lib/db";
export const dynamic = "force-dynamic";
export default async function Page() {
  const u = await requireUser();
  if (!u.business_name || !u.review_url) redirect("/onboarding");
  const blocked = !isActive(u) ? (needsPayment(u) ? "Your last payment didn’t go through — update your card from the Dashboard to resume sending." : u.subscription_status === "canceled" ? "Your plan is canceled — resubscribe from Settings to resume sending." : "Your account isn't active yet — start your trial from the Dashboard.") : usedThisMonth(u.id) >= MONTHLY_QUOTA ? "Monthly limit reached." : "";
  return <div><AppNav /><main id="main" className="mx-auto max-w-md px-4 py-8">
    <h1 className="text-4xl font-bold tracking-tight text-navy-900">Ask for a review</h1>
    <p className="mt-2 text-slate-500">For {u.business_name}. Customer gets a text or email with your Google review link.</p>
    {blocked && <p className="mt-4 rounded-md bg-amber-50 p-3 text-sm text-amber-800">{blocked}</p>}
    <QuickAsk disabled={!!blocked} />
  </main></div>;
}
