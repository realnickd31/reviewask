import Link from "next/link";
import Legal from "@/components/Legal";
import ReviewLinkTool from "@/components/ReviewLinkTool";
const faqs = [
  { q: "What is a Google review link?", a: "A direct URL that opens your business's Google review form, so customers can leave a review in one tap instead of searching for you on Maps." },
  { q: "Is this review link generator free?", a: "Yes. It runs in your browser, needs no signup, and the link never expires as long as your Google Business Profile exists." },
  { q: "Where do I find my Google Place ID?", a: "Use Google's Place ID Finder, search your business name, and copy the ID shown (it usually starts with ChIJ)." },
  { q: "Can I share the link by text, email, or QR code?", a: "Yes. The link works anywhere: text messages, emails, invoices, receipts, your website, or a QR code." },
];
export const metadata = {
  title: { absolute: "Free Google Review Link Generator (No Signup) | ReviewAsk" },
  description: "Create a direct Google review link from your Place ID in seconds. Free, no signup. Customers land straight on your review form.",
  alternates: { canonical: "/tools/review-link" },
  openGraph: { title: "Free Google Review Link Generator", description: "Make a one-tap Google review link for your business. Free, no signup.", url: "https://getreviewask.com/tools/review-link" },
};
export default function Page() { return <Legal title="Free Google review link generator">
  <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([{ "@context": "https://schema.org", "@type": "WebApplication", name: "Google Review Link Generator", url: "https://getreviewask.com/tools/review-link", applicationCategory: "BusinessApplication", operatingSystem: "Web", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } }, { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }]) }} />
  <p>A direct review link opens your Google review form in one tap, so customers don&apos;t have to search for you on Maps. Paste your Place ID below to build one. It runs in your browser, with no signup.</p>
  <ReviewLinkTool />
  <h2>How to find your Google Place ID</h2>
  <ol className="list-decimal space-y-1 pl-5"><li>Open Google&apos;s <a href="https://developers.google.com/maps/documentation/places/web-service/place-id" target="_blank" rel="noopener noreferrer">Place ID Finder</a>.</li><li>Type your business name and pick it on the map.</li><li>Copy the ID (it usually starts with &ldquo;ChIJ&rdquo;) and paste it above.</li></ol>
  <p className="text-sm text-slate-600">Alternative: in your Google Business Profile, click &ldquo;Ask for reviews&rdquo; (or &ldquo;Get more reviews&rdquo;) and copy the short link Google gives you. Either link works.</p>
  <h2>Where to use your review link</h2>
  <ul className="list-disc space-y-1 pl-5"><li>A text or email right after the job or visit</li><li>Invoices, receipts, and email signatures</li><li>A QR code on the counter, a business card, or a leave-behind</li><li>Your website&apos;s contact or thank-you page</li></ul>
  <h2>Send it after every customer, automatically</h2>
  <p>Having the link is step one; remembering to send it is the hard part. <Link href="/">ReviewAsk</Link> emails it to each customer for you, from a spreadsheet, with one tap from your phone, or (optionally) when a job closes in a tool you already use. One polite follow-up on day 3, then it stops.</p>
  <p className="pt-2"><Link href="/signup" className="btn-navy px-5 py-3 !text-white no-underline">Start your 7-day free trial</Link></p>
  <p className="text-sm text-slate-500">$39/month after the trial, cancel anytime. ReviewAsk is not affiliated with Google.</p>
  <h2>FAQ</h2>
  {faqs.map((f) => <div key={f.q}><h3 className="font-semibold">{f.q}</h3><p>{f.a}</p></div>)}
</Legal>; }
