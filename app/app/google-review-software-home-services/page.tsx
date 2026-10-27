import Link from "next/link";
import Legal from "@/components/Legal";
export const metadata = {
  title: { absolute: "Google review software for home services: automatic review requests, $39/mo" },
  description: "Automatic Google review requests for home-service and field-service businesses. Compare ReviewAsk with Jobber Marketing Suite, NiceJob, Podium and Birdeye, and see when each one fits.",
  alternates: { canonical: "/google-review-software-home-services" },
};
export default function Page() { return <Legal title="Google review software for home-service businesses">
  <p>If you run a home-service or field-service business, most new customers check your Google reviews before they call. Review software makes sure every finished job gets a request, so the count keeps growing without anyone remembering to ask.</p>
  <h2>What to look for</h2>
  <ul className="list-disc space-y-1 pl-5"><li><strong>It triggers from your job software.</strong> The ask should go out when a job closes in Jobber or Housecall Pro, not when someone remembers.</li><li><strong>One direct link</strong> to your Google review form, with at most one reminder.</li><li><strong>Policy-safe:</strong> every customer gets the same ask, with no review gating and no incentives.</li><li><strong>A way to catch up:</strong> upload past customers from a spreadsheet.</li><li><strong>Clear pricing</strong> with no contract.</li></ul>
  <h2>Your options, honestly</h2>
  <div className="overflow-x-auto rounded-lg border border-slate-200"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-slate-500"><tr><th className="p-3 font-medium">Option</th><th className="p-3 font-medium">Price (checked Oct 27, 2026)</th><th className="p-3 font-medium">Best when</th></tr></thead><tbody className="divide-y divide-slate-200">
    <tr className="bg-lime-50"><td className="p-3 font-semibold">ReviewAsk</td><td className="p-3 font-semibold">$39/month</td><td className="p-3">You want review requests after every Jobber or Housecall Pro job, and nothing else to manage.</td></tr>
    <tr><td className="p-3">Jobber Marketing Suite</td><td className="p-3">$99/month add-on</td><td className="p-3">You also want Jobber&apos;s campaigns and referrals in one place. <Link href="/compare/jobber-marketing-suite">Compare</Link></td></tr>
    <tr><td className="p-3">NiceJob</td><td className="p-3">$75/month Starter · $125/month Pro</td><td className="p-3">You want review widgets and social sharing too. <Link href="/nicejob-alternative">Compare</Link></td></tr>
    <tr><td className="p-3">Podium</td><td className="p-3">Quoted by sales</td><td className="p-3">You want an all-in-one messaging and lead platform. <Link href="/podium-alternative">Compare</Link></td></tr>
    <tr><td className="p-3">Birdeye</td><td className="p-3">Quoted, priced by locations</td><td className="p-3">You manage reputation across many locations. <Link href="/birdeye-alternative">Compare</Link></td></tr>
  </tbody></table></div>
  <p className="text-xs text-slate-500">Prices are vendors&apos; public list prices on the date shown and may change. ReviewAsk is not affiliated with any of them.</p>
  <h2>How ReviewAsk works</h2>
  <ol className="list-decimal space-y-1 pl-5"><li>Paste your Google review link (or build one with the <Link href="/tools/review-link">review link generator</Link>).</li><li>Connect <Link href="/for-jobber">Jobber</Link> or <Link href="/for-housecall-pro">Housecall Pro</Link> once.</li><li>Each completed job sends the customer an email request, with one follow-up on day 3. SMS is rolling out.</li><li>Optional: paste or upload last season&apos;s customers to catch up on your backlog.</li></ol>
  <p>Not on either platform? You can still send asks from the dashboard or your phone. Need wording? Use our <Link href="/templates/review-request">review request templates</Link>.</p>
  <h2>How many reviews do you need?</h2>
  <p>Compare your count with the top three local competitors, then work out how many asks a month closes the gap. The <Link href="/tools/review-gap">review gap calculator</Link> does the math for free.</p>
  <p className="pt-2"><Link href="/signup" className="btn-navy px-5 py-3 !text-white no-underline">Start your 7-day free trial</Link></p>
  <p className="text-sm text-slate-500">$39/month or $390/year after the trial · No contract · Cancel anytime from Settings.</p>
</Legal>; }
