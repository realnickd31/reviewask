import Link from "next/link";
import Legal from "@/components/Legal";
import ReviewLinkTool from "@/components/ReviewLinkTool";
export const metadata = {
  title: { absolute: "Free Google review link generator: turn your Place ID into a direct review link" },
  description: "Create a direct Google review link from your Place ID. Free, no signup. Customers land straight on the review form.",
  alternates: { canonical: "/tools/review-link" },
};
export default function Page() { return <Legal title="Free Google review link generator">
  <p>A direct review link opens your Google review form in one tap, so customers don&apos;t have to search for you on Maps. Paste your Place ID below to build one. It runs in your browser, with no signup.</p>
  <ReviewLinkTool />
  <h2>Where to find your Place ID</h2>
  <ol className="list-decimal space-y-1 pl-5"><li>Open Google&apos;s Place ID Finder: <a href="https://developers.google.com/maps/documentation/places/web-service/place-id" target="_blank" rel="noopener noreferrer">developers.google.com/maps/documentation/places/web-service/place-id</a>.</li><li>Search for your business name and pick it on the map.</li><li>Copy the ID (it usually starts with &ldquo;ChIJ&rdquo;) and paste it above.</li></ol>
  <p className="text-sm text-slate-600">Easier option: in your Google Business Profile, click &ldquo;Ask for reviews&rdquo; (or &ldquo;Get more reviews&rdquo;) and copy the short link Google gives you. Either link works.</p>
  <h2>Send it after every job, automatically</h2>
  <p>Having the link is step one; remembering to send it is the hard part. <Link href="/">ReviewAsk</Link> emails it to each customer when a job closes in Jobber or Housecall Pro, with one follow-up on day 3. SMS is rolling out. Need wording? Use our <Link href="/templates/review-request">review request templates</Link>.</p>
  <p className="pt-2"><Link href="/signup" className="btn-navy px-5 py-3 !text-white no-underline">Start your 7-day free trial</Link></p>
  <p className="text-sm text-slate-500">$39/month or $390/year after the trial. ReviewAsk is not affiliated with Google.</p>
</Legal>; }
