import Link from "next/link";
import Legal from "@/components/Legal";
export const metadata = {
  title: { absolute: "Housecall Pro Google reviews: send every customer to Google" },
  description: "Why some Housecall Pro review requests don't reach Google, and how to send every customer — not just Gmail users — to your Google review form.",
  alternates: { canonical: "/housecall-pro-google-reviews" },
};
export default function Page() { return <Legal title="Housecall Pro Google reviews: get every customer to Google">
  <p>If you run jobs in Housecall Pro and your Google review count isn&apos;t growing as fast as your job count, the routing of your review requests may be part of the reason.</p>
  <h2>Where Housecall Pro sends reviewers by default</h2>
  <p>According to Housecall Pro&apos;s own Reviews FAQ, by default only customers with @gmail.com addresses are directed to Google. Customers with other email addresses are directed to leave a Housecall Pro review instead. If many of your customers use Yahoo, Outlook, iCloud, or work emails, those reviews won&apos;t show up on your Google profile, which is what people see when they search for you.</p>
  <p className="text-sm text-slate-500">Source: <a href="https://help.housecallpro.com/en/articles/11481139-reviews-faqs" rel="noopener" target="_blank">Housecall Pro Reviews FAQs</a>. Settings and plan options may change; check your account.</p>
  <h2>What to do about it</h2>
  <ol className="list-decimal space-y-1 pl-5"><li>Check your Housecall Pro review settings and plan to see where non-Gmail customers are sent.</li><li>Get your direct Google review link from your Google Business Profile (&ldquo;Ask for reviews&rdquo;).</li><li>Make sure every customer gets that link after the job, plus one polite reminder.</li></ol>
  <h2>Automating it with ReviewAsk</h2>
  <p>ReviewAsk connects to Housecall Pro and sends every customer, whatever email they use, a request with one link to your Google review form when the job is done, plus one follow-up on day 3. It&apos;s $39/month after a 7-day free trial, with no contract. <Link href="/for-housecall-pro">How ReviewAsk works with Housecall Pro</Link>.</p>
  <h2>Keep it policy-safe</h2><p>Ask every customer the same way. Don&apos;t offer incentives and don&apos;t screen out unhappy customers; Google&apos;s policies prohibit both.</p>
  <p className="pt-4"><Link href="/signup" className="btn-navy px-5 py-3 !text-white no-underline">Start your 7-day free trial</Link></p>
  <p className="text-sm text-slate-500">ReviewAsk is not affiliated with Housecall Pro or Google.</p>
</Legal>; }
