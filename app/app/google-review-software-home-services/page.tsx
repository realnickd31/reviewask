import Link from "next/link";
import Legal from "@/components/Legal";
export const metadata = {
  title: { absolute: "Google review software for home services: automatic review requests, $39/mo" },
  description: "Automatic Google review requests for home-service and field-service businesses. What to look for, how it works, and pricing.",
  alternates: { canonical: "/google-review-software-home-services" },
};
export default function Page() { return <Legal title="Google review software for home-service businesses">
  <p>If you run a home-service or field-service business, most new customers check your Google reviews before they call. Review software makes sure every finished job gets a request, so the count keeps growing without anyone remembering to ask.</p>
  <h2>What to look for</h2>
  <ul className="list-disc space-y-1 pl-5"><li><strong>It triggers from your job software.</strong> The ask should go out when a job closes in Jobber or Housecall Pro, not when someone remembers.</li><li><strong>One direct link</strong> to your Google review form, with at most one reminder.</li><li><strong>Policy-safe:</strong> every customer gets the same ask, with no review gating and no incentives.</li><li><strong>A way to catch up:</strong> upload past customers from a spreadsheet.</li><li><strong>Clear pricing</strong> with no contract.</li></ul>
  <h2>How ReviewAsk works</h2>
  <ol className="list-decimal space-y-1 pl-5"><li>Paste your Google review link (or build one with the <Link href="/tools/review-link">review link generator</Link>).</li><li>Connect Jobber or <Link href="/for-housecall-pro">Housecall Pro</Link> once.</li><li>Each completed job sends the customer an email request, with one follow-up on day 3. SMS is rolling out.</li><li>Optional: paste or upload last season&apos;s customers to catch up on your backlog.</li></ol>
  <p>Not on either platform? You can still send asks from the dashboard or your phone. Need wording? Use our <Link href="/templates/review-request">review request templates</Link>.</p>
  <h2>How many reviews do you need?</h2>
  <p>More than you get by asking when you remember. Volume comes from asking every customer after every job. <Link href="/tools/review-link">Get your Google review link</Link> free, then <Link href="/signup">start asking automatically</Link>.</p>
  <p className="pt-2"><Link href="/signup" className="btn-navy px-5 py-3 !text-white no-underline">Start your 7-day free trial</Link></p>
  <p className="text-sm text-slate-500">$39/month or $390/year after the trial · No contract · Cancel anytime from Settings.</p>
</Legal>; }
