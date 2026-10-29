import Link from "next/link";
import Logo from "./Logo";
import { COMPANY } from "@/lib/company";
export default function Footer() {
  const col = "space-y-2.5 text-sm";
  return <footer className="border-t border-slate-200 bg-white text-slate-600"><div className="mx-auto max-w-6xl px-6 py-14">
    <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
      <div className="sm:col-span-2 lg:col-span-2"><Logo dark /><p className="mt-3 max-w-xs text-sm leading-relaxed text-slate-500">Automatic Google review requests for any business that wants more reviews. Simple, policy-safe, month-to-month.</p><p className="mt-3 text-sm text-slate-500">Questions? <a href={`mailto:${COMPANY.supportEmail}`} className="font-medium text-navy-900 hover:underline">{COMPANY.supportEmail}</a></p></div>
      <div><p className="eyebrow mb-3">Product</p><ul className={col}><li><Link href="/#how" className="hover:text-navy-900">How it works</Link></li><li><Link href="/pricing" className="hover:text-navy-900">Pricing</Link></li><li><Link href="/#faq" className="hover:text-navy-900">FAQ</Link></li><li><Link href="/login" className="hover:text-navy-900">Log in</Link></li></ul></div>
      <div><p className="eyebrow mb-3">Company</p><ul className={col}><li><Link href="/about" className="hover:text-navy-900">About &amp; contact</Link></li><li><a href="mailto:support@getreviewask.com" className="hover:text-navy-900">Email support</a></li><li><Link href="/terms" className="hover:text-navy-900">Terms of Service</Link></li><li><Link href="/privacy" className="hover:text-navy-900">Privacy Policy</Link></li><li><Link href="/sms" className="hover:text-navy-900">SMS terms &amp; opt-in</Link></li></ul></div>
    </div>
    <div className="mt-12 flex flex-col justify-between gap-2 border-t border-slate-200 pt-6 text-xs text-slate-500 sm:flex-row">
      <p>© {new Date().getFullYear()} {COMPANY.legalName ?? COMPANY.brand}. All rights reserved.{COMPANY.mailingAddress && <> · {COMPANY.mailingAddress}</>}</p>
      <p>Payments processed securely by Stripe. ReviewAsk is not affiliated with or endorsed by Google LLC or Jobber.</p>
    </div></div></footer>;
}
