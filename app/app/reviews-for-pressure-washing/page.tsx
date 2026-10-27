import Link from "next/link";
import Legal from "@/components/Legal";
export const metadata = {
  title: { absolute: "How to get more Google reviews for your pressure washing business | ReviewAsk" },
  description: "When to ask, what to say, and how to catch up on past customers. A simple Google review routine for pressure washing and soft washing companies, and every other field-service business.",
  openGraph: { title: "How to get more Google reviews for your pressure washing business | ReviewAsk", description: "When to ask, what to say, and how to catch up on past customers. A simple Google review routine for pressure washing and soft washing companies, and every other field-service business.", url: "/reviews-for-pressure-washing" },
  twitter: { title: "How to get more Google reviews for your pressure washing business | ReviewAsk", description: "When to ask, what to say, and how to catch up on past customers. A simple Google review routine for pressure washing and soft washing companies, and every other field-service business." },
  alternates: { canonical: "/reviews-for-pressure-washing" },
};
export default function Page() { return <Legal title="How to get more Google reviews for your pressure washing business">
  <p>Pressure washing sells itself with before-and-after. The moment a customer sees their driveway or siding come back to life is the best time to ask for a review, but most crews pack up and leave without asking.</p>
  <h2>When to ask</h2>
  <ul className="list-disc space-y-1 pl-5">
    <li><strong>Right after the reveal:</strong> a house wash, roof soft wash, driveway or deck, when the difference is obvious.</li>
    <li><strong>The same day:</strong> send the ask when the job is closed, while the customer is still looking at the result.</li>
    <li><strong>Once per customer:</strong> one request and one reminder is plenty, even for repeat seasonal customers.</li>
  </ul>
  <h2>What to say</h2>
  <p className="rounded-md border border-slate-200 bg-slate-50 p-4 text-sm">{"Hi {first name}, thanks for having us out today! If you love how everything turned out, would you leave us a quick Google review? It really helps a small local crew. {review link} \u2013 {your name}"}</p>
  <p>Use the direct link to your Google review form so customers don&apos;t have to search for you. Build one free with the <Link href="/tools/review-link">review link generator</Link>, and find more wording in our <Link href="/templates/review-request">review request templates</Link>.</p>
  <h2>Catch up on past customers</h2>
  <p>Off-season is a good time to ask everyone you washed for this year who hasn&apos;t reviewed you yet. Export or paste your customer list and send the same short message once.</p>
  <h2>Keep it policy-safe</h2>
  <p>Ask every customer the same way. Don&apos;t offer discounts for reviews, and don&apos;t only ask the customers you expect to be happy. Reply to every review, good or bad.</p>
  <h2>How many reviews do you need?</h2>
  <p>Compare your count with the top local competitors and work out how many asks a month closes the gap. The <Link href="/tools/review-gap">review gap calculator</Link> does the math for free.</p>
  <h2>Doing it automatically</h2>
  <p>ReviewAsk connects to <Link href="/for-jobber">Jobber</Link> or <Link href="/for-housecall-pro">Housecall Pro</Link> and emails each customer a one-tap Google review link when a job closes, with one reminder on day 3. SMS is rolling out. You can also paste past customers from a spreadsheet. It works the same way for any field-service business, not just pressure washing.</p>
  <p className="text-sm">More guides: <Link href="/reviews-for-lawn-care">Lawn care</Link> · <Link href="/reviews-for-cleaning">Cleaning</Link> · <Link href="/reviews-for-hvac">HVAC</Link> · <Link href="/reviews-for-pool-service">Pool service</Link> · <Link href="/reviews-for-pest-control">Pest control</Link> · <Link href="/guides">All guides</Link></p>
  <p className="pt-2"><Link href="/signup" className="btn-navy px-5 py-3 !text-white no-underline">Start your 7-day free trial</Link></p>
  <p className="text-sm text-slate-500">$39/month or $390/year after the trial · No contract · Cancel anytime from Settings.</p>
</Legal>; }
