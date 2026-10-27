import Link from "next/link";
import Legal from "@/components/Legal";
export const metadata = {
  title: { absolute: "Google review request templates: 10 copy-paste texts and emails for service businesses" },
  description: "Free copy-paste Google review request templates (SMS and email) for field-service businesses: same-day, follow-up, past customers, repeat clients and more. Policy-safe wording.",
  alternates: { canonical: "/templates/review-request" },
};
const T: { h: string; kind: "Text" | "Email"; body: string }[] = [
  { h: "1. Same-day text (the default)", kind: "Text", body: "Hi [first name], thanks for choosing [business] today! If you have a minute, would you leave us a quick Google review? It really helps a small local business. [review link]" },
  { h: "2. Same-day email", kind: "Email", body: "Subject: How did we do, [first name]?\n\nHi [first name],\n\nThanks for having [business] out today. Would you take 30 seconds to leave us a Google review? It helps neighbors find a business they can trust.\n\n[review link]\n\nThank you!\n[your name], [business]" },
  { h: "3. One polite reminder (2–3 days later)", kind: "Text", body: "Hi [first name], just a quick follow-up from [business]. If you have a moment, a short Google review would mean a lot. No worries if not, and thanks again! [review link]" },
  { h: "4. Owner-signed, personal", kind: "Email", body: "Subject: A quick favor from [your name]\n\nHi [first name],\n\nI'm [your name], the owner of [business]. We're a small team, and most of our new customers find us through Google. If you were happy with the work, would you share a few words there?\n\n[review link]\n\nI read every review. Thank you,\n[your name]" },
  { h: "5. Past customers / last season's list", kind: "Email", body: "Subject: Thanks for being a [business] customer\n\nHi [first name],\n\nThanks for trusting [business] this year. We never asked at the time, but if you have a minute, a Google review would really help us.\n\n[review link]\n\nThanks,\n[your name]" },
  { h: "6. Repeat / recurring clients", kind: "Text", body: "Hi [first name], thanks for sticking with [business]! If you've been happy with the service, would you mind leaving us a Google review? [review link]" },
  { h: "7. After fixing a problem", kind: "Text", body: "Hi [first name], thanks for your patience while we made things right. We'd value your honest feedback on Google, whatever it is. [review link]" },
  { h: "8. Short and mobile-first", kind: "Text", body: "Thanks from [business]! Mind leaving a quick Google review? [review link]" },
  { h: "9. Commercial / property-manager clients", kind: "Email", body: "Subject: Feedback on [business]\n\nHi [first name],\n\nThanks for working with [business] at [property]. If you're comfortable sharing, a brief Google review helps other managers evaluate us.\n\n[review link]\n\nBest,\n[your name]" },
  { h: "10. In-person handoff, then a text", kind: "Text", body: "Great meeting you today, [first name]! As mentioned, here's the link for a quick Google review. Thanks for choosing [business]. [review link]" },
];
export default function Page() { return <Legal title="Google review request templates for service businesses">
  <p>Ten copy-paste review requests you can send by text or email after a job, written for any field-service business. Replace the [brackets], paste your direct Google review link, and send soon after the work is done.</p>
  <p className="text-sm text-slate-600">Find your direct review link in your Google Business Profile under &ldquo;Ask for reviews&rdquo; (or &ldquo;Get more reviews&rdquo;). Only text customers who have agreed to receive texts from you.</p>
  {T.map((t) => <section key={t.h}><h2>{t.h} <span className="ml-1 rounded bg-slate-100 px-2 py-0.5 align-middle text-xs font-medium text-slate-600">{t.kind}</span></h2>
    <pre className="whitespace-pre-wrap rounded-lg border border-slate-200 bg-slate-50 p-4 font-sans text-sm">{t.body}</pre></section>)}
  <h2>Rules that keep you safe with Google</h2>
  <ul className="list-disc space-y-1 pl-5"><li>Ask every customer, not just the ones you think are happy. Asking selectively (&ldquo;review gating&rdquo;) is against Google&apos;s policies.</li><li>Don&apos;t offer discounts, gifts or anything else in exchange for a review.</li><li>Send at most one reminder.</li><li>Reply to reviews, good or bad. Future customers read the replies.</li></ul>
  <h2>Send it automatically instead</h2>
  <p>The template is the easy part; remembering to send it after every job is the hard part. <Link href="/">ReviewAsk</Link> emails your customer a one-tap Google review request when a job closes in Jobber or Housecall Pro, follows up once on day 3, and lets you upload a spreadsheet of past customers. SMS is rolling out.</p>
  <p className="pt-2"><Link href="/signup" className="btn-navy px-5 py-3 !text-white no-underline">Start your 7-day free trial</Link></p>
  <p className="text-sm text-slate-600">Want to know how many reviews you need? <Link href="/tools/review-gap" className="font-medium text-navy-900 underline underline-offset-4">Try the free review gap calculator</Link>. No signup needed.</p>
  <p className="text-sm text-slate-500">$39/month or $390/year after the trial · Cancel anytime. ReviewAsk is not affiliated with Google, Jobber or Housecall Pro.</p>
</Legal>; }
