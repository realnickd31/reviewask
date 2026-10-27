import Link from "next/link";
import Legal from "@/components/Legal";
export const metadata = {
  title: { absolute: "Birdeye alternative for Google review requests — ReviewAsk, $39/mo" },
  description: "Comparing Birdeye and ReviewAsk: Birdeye is a broad reputation and customer-experience platform with pricing by number of locations; ReviewAsk is $39/month and asks for Google reviews after every Jobber or Housecall Pro job.",
  alternates: { canonical: "/birdeye-alternative" },
};
const rows = [
  ["Price", "$39/month or $390/year, listed publicly", "No list price on its pricing page — priced by number of locations through Birdeye"],
  ["Free trial", "7 days (card required)", "Ask Birdeye"],
  ["Contract", "None — cancel anytime", "Birdeye describes “one platform, one contract”"],
  ["Review requests", "Email today; SMS rolling out · one day-3 follow-up", "Review requests as part of its reputation platform"],
  ["Automatic after each job", "Jobber and Housecall Pro", "Via Birdeye’s integrations"],
  ["Scope", "Review requests only, plus bulk upload of past customers and Quick ask from a phone", "Reputation management, listings, social publishing and other modules, built for 1 to 1,000+ locations"],
];
const faq = [
  ["Does Birdeye publish its price?", "Its pricing page groups plans by number of locations (1–3 up to 1,000+) and doesn't show a list price, so you'll need to ask Birdeye for a quote."],
  ["What does ReviewAsk cost?", "$39 a month or $390 a year after a 7-day free trial. A card is required to start the trial, and you can cancel anytime."],
  ["Does ReviewAsk work with Jobber?", "Yes. When a job is finished in Jobber or Housecall Pro, ReviewAsk sends that customer a Google review request and one follow-up on day 3. Email works today; SMS is rolling out."],
];
const ld = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) };
export default function Page() { return <Legal title="A $39 Birdeye alternative for Google review requests">
  <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
  <p>Birdeye is a broad reputation and customer-experience platform used by single shops and by brands with hundreds of locations. ReviewAsk does one job: after each finished Jobber or Housecall Pro job, it asks that customer for a Google review and follows up once.</p>
  <div className="overflow-x-auto rounded-lg border border-slate-200"><table className="w-full min-w-[520px] text-left text-sm">
    <thead className="bg-slate-50"><tr><th scope="col" className="p-3"></th><th scope="col" className="p-3">ReviewAsk</th><th scope="col" className="p-3">Birdeye</th></tr></thead>
    <tbody className="divide-y divide-slate-200">{rows.map(([k, a, b]) => <tr key={k}><th scope="row" className="p-3 font-medium">{k}</th><td className="p-3">{a}</td><td className="p-3">{b}</td></tr>)}</tbody></table></div>
  <h2>Choose Birdeye if…</h2><p>You manage several locations, or you want listings management, social publishing and a full reputation dashboard alongside review requests, and you&apos;re fine getting a quote from sales.</p>
  <h2>Choose ReviewAsk if…</h2><p>You run your business in Jobber or Housecall Pro and mainly want every finished job to become a Google review request, at a published $39/month price with no sales call.</p>
  <h2>Same rules either way</h2><p>Ask every customer, don&apos;t offer incentives, and don&apos;t filter out unhappy customers — that&apos;s what Google&apos;s review policies expect. ReviewAsk sends the same request to everyone.</p>
  <h2>Questions</h2>{faq.map(([q, a]) => <div key={q}><h3 className="font-semibold">{q}</h3><p>{a}</p></div>)}
  <p className="pt-4"><Link href="/signup" className="btn-navy px-5 py-3 !text-white no-underline">Start your 7-day free trial</Link></p>
  <p className="text-sm text-slate-600">Not ready yet? <Link href="/tools/review-gap" className="font-medium text-navy-900 underline underline-offset-4">See how many Google reviews you are behind your top local competitors</Link>, free and with no signup.</p>
  <p className="text-sm text-slate-500">Birdeye plans from <a href="https://birdeye.com/pricing/" rel="noopener" target="_blank">birdeye.com/pricing</a>, checked October 27, 2026; may change. ReviewAsk is not affiliated with Birdeye. Also see <Link href="/podium-alternative">Podium alternative</Link>, <Link href="/nicejob-alternative">NiceJob alternative</Link> and <Link href="/compare/jobber-marketing-suite">ReviewAsk vs. Jobber Marketing Suite</Link>.</p>
</Legal>; }
