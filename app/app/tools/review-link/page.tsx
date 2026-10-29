import Link from "next/link";
import Legal from "@/components/Legal";
import ReviewLinkTool from "@/components/ReviewLinkTool";
import { OG_IMAGES } from "@/lib/og";
const faqs = [
  { q: "What is a Google review link?", a: "A direct URL that opens your business's Google review form, so customers can leave a review in one tap instead of searching for you on Maps." },
  { q: "Is this review link generator free?", a: "Yes. It runs in your browser, needs no signup, and the link never expires as long as your Google Business Profile exists." },
  { q: "Do I need my Google Place ID?", a: "No. Paste the link you get from Google Maps (Share, then Copy link) and the tool finds the Place ID for you. If you already have a Place ID, you can paste that instead." },
  { q: "Can I share the link by text, email, or QR code?", a: "Yes. The link works anywhere: text messages, emails, invoices, receipts, your website, or a QR code." },
];
export const metadata = {
  title: { absolute: "Free Google Review Link Generator: Paste Your Google Maps Link | ReviewAsk" },
  description: "Paste your Google Maps link and get a direct Google review link in seconds. No Place ID needed. Free, no signup. Customers land straight on your review form.",
  alternates: { canonical: "/tools/review-link" },
  openGraph: { title: "Free Google Review Link Generator", description: "Make a one-tap Google review link for your business. Free, no signup.", url: "https://getreviewask.com/tools/review-link", images: OG_IMAGES },
};
export default function Page() { return <Legal title="Free Google review link generator">
  <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([{ "@context": "https://schema.org", "@type": "WebApplication", name: "Google Review Link Generator", url: "https://getreviewask.com/tools/review-link", applicationCategory: "BusinessApplication", operatingSystem: "Web", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } }, { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }]) }} />
  <p>A direct review link opens your Google review form in one tap, so customers don&apos;t have to search for you on Maps. Paste your Google Maps link below and we&apos;ll build it. No Place ID hunting, no signup.</p>
  <ReviewLinkTool />
  <h2>How to get your Google Maps link</h2>
  <ol className="list-decimal space-y-1 pl-5"><li>Open Google Maps on your phone or computer.</li><li>Search your business name and tap it so your business profile opens.</li><li>Tap <strong>Share</strong>, then <strong>Copy link</strong>.</li><li>Paste it in the box above. That&apos;s it.</li></ol>
  <p className="text-sm text-slate-600">On a computer, copying the address bar while your business is open on Google Maps works too. Have a Place ID already (starts with &ldquo;ChIJ&rdquo;)? Paste that instead.</p>
  <h2>Where to use your review link</h2>
  <ul className="list-disc space-y-1 pl-5"><li>A text or email right after the job or visit</li><li>Invoices, receipts, and email signatures</li><li>A QR code on the counter, a business card, or a leave-behind</li><li>Your website&apos;s contact or thank-you page</li></ul>
  <h2>Send it after every customer, automatically</h2>
  <p>Having the link is step one; remembering to send it is the hard part. <Link href="/">ReviewAsk</Link> emails it to each customer for you, from a spreadsheet, with one tap from your phone, or (optionally) when a job closes in a tool you already use. One polite follow-up on day 3, then it stops. Comparing tools? See ReviewAsk vs <Link href="/vs/reviewask-vs-nicejob">NiceJob</Link>, <Link href="/vs/reviewask-vs-gatherup">GatherUp</Link>, or <Link href="/vs/reviewask-vs-jobber-reviews">Jobber Reviews</Link>.</p>
  <p className="pt-2"><Link href="/signup" className="btn-navy px-5 py-3 !text-white no-underline">Start your 7-day free trial</Link></p>
  <p className="text-sm text-slate-500">$39/month after the trial, cancel anytime. ReviewAsk is not affiliated with Google.</p>
  <h2>FAQ</h2>
  {faqs.map((f) => <div key={f.q}><h3 className="font-semibold">{f.q}</h3><p>{f.a}</p></div>)}
</Legal>; }
