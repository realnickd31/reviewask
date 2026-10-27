import Link from "next/link";
import Legal from "@/components/Legal";
export const metadata = {
  title: { absolute: "Jobber Marketing Suite alternative for Google reviews — ReviewAsk, $39/mo" },
  description: "Want Google review requests after every Jobber job without the $99/month Marketing Suite add-on? ReviewAsk does review asks for $39/month.",
  alternates: { canonical: "/compare/jobber-marketing-suite" },
};
export default function Page() { return <Legal title="ReviewAsk vs. Jobber Marketing Suite">
  <p>If you run your business in Jobber and want more Google reviews, you have two straightforward options: Jobber&apos;s own Marketing Suite, or a focused tool like ReviewAsk. Here&apos;s an honest look at both.</p>
  <h2>The short version</h2>
  <p>Jobber&apos;s Marketing Suite is a <strong>$99/month add-on</strong> that includes review requests along with other marketing tools. ReviewAsk is <strong>$39/month</strong> and does one job: send a Google review request after every finished job, follow up once on day 3, and show you what went out.</p>
  <div className="overflow-x-auto rounded-lg border border-slate-200"><table className="w-full min-w-[480px] text-left text-sm">
    <thead className="bg-slate-50"><tr><th scope="col" className="p-3"></th><th scope="col" className="p-3">ReviewAsk</th><th scope="col" className="p-3">Jobber Marketing Suite</th></tr></thead>
    <tbody className="divide-y divide-slate-200">
      <tr><th scope="row" className="p-3 font-medium">Price</th><td className="p-3">$39/month or $390/year</td><td className="p-3">$99/month add-on</td></tr>
      <tr><th scope="row" className="p-3 font-medium">What it covers</th><td className="p-3">Review requests, day-3 follow-up, request history</td><td className="p-3">Reviews plus a broader marketing bundle</td></tr>
      <tr><th scope="row" className="p-3 font-medium">Free trial</th><td className="p-3">7 days</td><td className="p-3">See Jobber</td></tr>
      <tr><th scope="row" className="p-3 font-medium">Contract</th><td className="p-3">None — cancel anytime</td><td className="p-3">Per Jobber&apos;s plan terms</td></tr>
      <tr><th scope="row" className="p-3 font-medium">Not on Jobber?</th><td className="p-3">Also works with Housecall Pro, Quick ask on your phone, or a spreadsheet upload</td><td className="p-3">Jobber only</td></tr>
    </tbody></table></div>
  <h2>Choose the Marketing Suite if…</h2><p>You want Jobber&apos;s full marketing bundle, not just reviews, and you&apos;d rather keep everything inside one product.</p>
  <h2>Choose ReviewAsk if…</h2><p>Reviews are the thing you care about. You want every finished job to trigger a polite ask automatically, without paying for marketing tools you won&apos;t use. ReviewAsk sends the same request to every customer — no gating, no incentives — in line with Google&apos;s review policies.</p>
  <h2>How setup works</h2><p>Create an account, paste your Google review link, connect Jobber once, and turn on &ldquo;Ask after every job.&rdquo; Have past customers? Upload a spreadsheet to catch up on your backlog.</p>
  <p>More on using ReviewAsk with Jobber: <Link href="/for-jobber">ReviewAsk for Jobber</Link> and <Link href="/jobber-google-reviews">how to get more Google reviews from Jobber jobs</Link>.</p>
  <p className="pt-4"><Link href="/signup" className="btn-navy px-5 py-3 no-underline">Start your 7-day free trial</Link></p>
  <p className="text-sm text-slate-500">Pricing for Jobber&apos;s Marketing Suite is as listed by Jobber and may change; check Jobber for current details. ReviewAsk is not affiliated with Jobber. Questions? <a href="mailto:support@getreviewask.com" className="underline">support@getreviewask.com</a>.</p>
</Legal>; }
