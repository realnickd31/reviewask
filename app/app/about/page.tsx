import Legal from "@/components/Legal";
import { COMPANY } from "@/lib/company";
export const metadata = { title: "About & Contact", description: "Who runs ReviewAsk (getreviewask.com), what it does, how billing works, and how to reach a real person.", alternates: { canonical: "/about" } };
export default function Page() { return <Legal title="About ReviewAsk">
  <p>ReviewAsk (getreviewask.com) is a small, independent software company, not affiliated with GetReviews or other similarly named review tools. We do one thing: send every one of your customers a short, polite Google review request from your business name, with one follow-up on day 3, and then stop.</p>
  <h2>Why we built it</h2><p>The businesses doing the best work often have the fewest reviews. Not because customers are unhappy, but because nobody has time to ask every one. ReviewAsk makes sure every customer gets asked, without gating, incentives, or spam.</p>
  <h2>How billing works</h2><p>One plan: $39/month (or $390/year) with a 7-day free trial. A card is required to start, and you are not charged if you cancel before the trial ends. No contract and no setup fees. Cancel anytime from Settings. Payments are processed by Stripe; we never see or store your full card number.</p>
  <h2>Your customers&apos; data</h2><p>We use customer contact details only to send the review requests you ask us to send. We never sell them. Customers can opt out at any time, and you can export or delete your data. See our <a href="/privacy" className="underline">Privacy Policy</a>, <a href="/terms" className="underline">Terms</a>, and <a href="/sms" className="underline">SMS terms</a>.</p>
  <h2>Contact</h2>
  <p>Email <a href={`mailto:${COMPANY.supportEmail}`} className="underline">{COMPANY.supportEmail}</a>. A real person reads every message, usually within one business day.</p>
  {(COMPANY.legalName || COMPANY.mailingAddress || COMPANY.founder) && <p className="text-sm text-slate-500">
    {COMPANY.founder && <>Founded by {COMPANY.founder}. </>}{COMPANY.legalName && <>{COMPANY.brand} is operated by {COMPANY.legalName}. </>}{COMPANY.mailingAddress && <>Mailing address: {COMPANY.mailingAddress}.</>}</p>}
  <p className="text-sm text-slate-500">ReviewAsk is not affiliated with or endorsed by Google LLC, Jobber, Housecall Pro, Square, Stripe, QuickBooks, or Zapier.</p>
</Legal>; }
