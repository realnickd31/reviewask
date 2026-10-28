import Link from "next/link";
import Legal from "@/components/Legal";
const title = "How to get more Google reviews for your pest control business | ReviewAsk";
const description = "When to ask, what to say, and how to catch up on past customers. A simple Google review routine for pest control companies, and every other field-service business.";
export const metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/reviews-for-pest-control" },
  openGraph: { title, description, url: "/reviews-for-pest-control" },
  twitter: { title, description },
};
export default function Page() { return <Legal title="How to get more Google reviews for your pest control business">
  <p>Pest control customers are relieved when the problem is handled. The visit where you solve it is the best time to ask for a review.</p>
  <h2>When to ask</h2>
  <ul className="list-disc space-y-1 pl-5">
    <li><strong>After the problem is solved:</strong> a first treatment that worked, a rodent exclusion, or a wasp nest removal.</li>
    <li><strong>The same day:</strong> send the ask when the job is closed, while the relief is fresh.</li>
    <li><strong>Once per customer:</strong> for quarterly-plan customers, one request and one reminder is plenty.</li>
  </ul>
  <h2>What to say</h2>
  <p className="rounded-md border border-slate-200 bg-slate-50 p-4 text-sm">{"Hi {first name}, thanks for having us out today! If you're happy with the service, would you leave us a quick Google review? It really helps a local business. {review link} \u2013 {your name}"}</p>
  <p>Use the direct link to your Google review form so customers don&apos;t have to search for you. Build one free with the <Link href="/tools/review-link">review link generator</Link>, and find more wording in our <Link href="/templates/review-request">review request templates</Link>.</p>
  <h2>Catch up on past customers</h2>
  <p>A slow month is a good time to ask everyone you served this year who hasn&apos;t reviewed you yet. Export or paste your customer list and send the same short message once.</p>
  <h2>Keep it policy-safe</h2>
  <p>Ask every customer the same way. Don&apos;t offer discounts for reviews, and don&apos;t only ask the customers you expect to be happy. Reply to every review, good or bad.</p>
  <h2>How many reviews do you need?</h2>
  <p>More than you get by asking when you remember. Volume comes from asking every customer after every job. <Link href="/tools/review-link">Get your Google review link</Link> free, then <Link href="/signup">start asking automatically</Link>.</p>
  <h2>Doing it automatically</h2>
  <p>ReviewAsk connects to Jobber or <Link href="/for-housecall-pro">Housecall Pro</Link> and emails each customer a one-tap Google review link when a job closes, with one reminder on day 3. SMS is rolling out. You can also paste past customers from a spreadsheet. It works the same way for any field-service business, not just pest control.</p>
  <p className="text-sm">More guides: <Link href="/reviews-for-lawn-care">Lawn care</Link> · <Link href="/reviews-for-cleaning">Cleaning</Link> · <Link href="/reviews-for-pressure-washing">Pressure washing</Link> · <Link href="/reviews-for-hvac">HVAC</Link> · <Link href="/reviews-for-pool-service">Pool service</Link> · <Link href="/guides">All guides</Link></p>
  <p className="pt-2"><Link href="/signup" className="btn-navy px-5 py-3 !text-white no-underline">Start your 7-day free trial</Link></p>
  <p className="text-sm text-slate-500">$39/month or $390/year after the trial · No contract · Cancel anytime from Settings.</p>
</Legal>; }
