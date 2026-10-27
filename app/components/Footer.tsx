import Link from "next/link";
import Logo from "./Logo";
export default function Footer() {
  const col = "space-y-2.5 text-sm";
  return <footer className="border-t border-slate-200 bg-white text-slate-600"><div className="mx-auto max-w-6xl px-6 py-14">
    <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
      <div className="sm:col-span-2 lg:col-span-2"><Logo dark /><p className="mt-3 max-w-xs text-sm leading-relaxed text-slate-500">Automatic Google review requests for Jobber and field-service businesses. Simple, policy-safe, month-to-month.</p></div>
      <div><p className="eyebrow mb-3">Product</p><ul className={col}><li><Link href="/#how" className="hover:text-navy-900">How it works</Link></li><li><Link href="/pricing" className="hover:text-navy-900">Pricing</Link></li><li><Link href="/#faq" className="hover:text-navy-900">FAQ</Link></li><li><Link href="/login" className="hover:text-navy-900">Log in</Link></li></ul></div>
      <div><p className="eyebrow mb-3">Guides</p><ul className={col}><li><Link href="/for-jobber" className="hover:text-navy-900">For Jobber</Link></li><li><Link href="/tools/review-gap" className="hover:text-navy-900">Review gap calculator</Link></li><li><Link href="/for-housecall-pro" className="hover:text-navy-900">For Housecall Pro</Link></li><li><Link href="/tools/review-link" className="hover:text-navy-900">Review link generator</Link></li><li><Link href="/templates/review-request" className="hover:text-navy-900">Review request templates</Link></li><li><Link href="/jobber-google-reviews" className="hover:text-navy-900">Jobber Google reviews</Link></li><li><Link href="/housecall-pro-google-reviews" className="hover:text-navy-900">Housecall Pro Google reviews</Link></li><li><Link href="/compare/jobber-marketing-suite" className="hover:text-navy-900">vs. Jobber Marketing Suite</Link></li><li><Link href="/nicejob-alternative" className="hover:text-navy-900">NiceJob alternative</Link></li><li><Link href="/podium-alternative" className="hover:text-navy-900">Podium alternative</Link></li><li><Link href="/birdeye-alternative" className="hover:text-navy-900">Birdeye alternative</Link></li></ul></div>
      <div><p className="eyebrow mb-3">Company</p><ul className={col}><li><a href="mailto:support@getreviewask.com" className="hover:text-navy-900">Contact support</a></li><li><Link href="/terms" className="hover:text-navy-900">Terms of Service</Link></li><li><Link href="/privacy" className="hover:text-navy-900">Privacy Policy</Link></li><li><Link href="/sms" className="hover:text-navy-900">SMS terms &amp; opt-in</Link></li></ul></div>
    </div>
    <div className="mt-12 flex flex-col justify-between gap-2 border-t border-slate-200 pt-6 text-xs text-slate-500 sm:flex-row">
      <p>© {new Date().getFullYear()} ReviewAsk. All rights reserved.</p>
      <p>Payments processed securely by Stripe. ReviewAsk is not affiliated with Google LLC or Jobber.</p>
    </div></div></footer>;
}
