import Link from "next/link";
import Legal from "@/components/Legal";
export const metadata = {
  title: { absolute: "Jobber Google reviews: how to automate review requests after every job" },
  description: "How Jobber businesses get more Google reviews: ask after every completed job, follow up once, and send everyone to Google. Options compared, setup steps, and a message template.",
  alternates: { canonical: "/jobber-google-reviews" },
};
export default function Page() { return <Legal title="Jobber Google reviews: automate the ask after every job">
  <p>Most happy customers will leave a Google review — if someone asks at the right moment and makes it one tap. The hard part isn&apos;t the message; it&apos;s remembering to send it after every single job. Here&apos;s how Jobber businesses can handle it.</p>
  <h2>Your three options</h2>
  <p><strong>1. Ask by hand.</strong> Text or email each customer yourself after the job. Free, personal, and easy to forget on a busy week.</p>
  <p><strong>2. Jobber&apos;s Marketing Suite.</strong> Jobber offers review requests as part of its Marketing Suite, a $99/month add-on that also includes other marketing tools. A good fit if you want that whole bundle.</p>
  <p><strong>3. A focused review tool.</strong> <Link href="/for-jobber">ReviewAsk</Link> connects to Jobber and sends a Google review request whenever a job is completed, with one follow-up on day 3, for $39/month. <Link href="/compare/jobber-marketing-suite">Compare the two side by side</Link>.</p>
  <h2>What a good review request looks like</h2>
  <ul className="list-disc space-y-1 pl-5"><li>Sent soon after the job is finished, while it&apos;s fresh.</li><li>From your business name, short and personal.</li><li>One link that opens your Google review form directly.</li><li>At most one polite reminder — no endless drip.</li><li>Sent to every customer. Google&apos;s policies prohibit offering incentives for reviews or selectively asking only happy customers.</li></ul>
  <h2>A template you can use</h2>
  <blockquote className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm">Hi [first name] — thanks for choosing [business] today! If you have a minute, would you leave us a quick Google review? It really helps a local business like ours. [review link]</blockquote>
  <p>Find your review link in your Google Business Profile under &ldquo;Ask for reviews&rdquo; (or &ldquo;Get more reviews&rdquo;).</p>
  <h2>Setting it up with ReviewAsk</h2>
  <ol className="list-decimal space-y-1 pl-5"><li>Create an account and paste your Google review link.</li><li>Turn on &ldquo;Ask after every job&rdquo; and connect Jobber once.</li><li>Optional: upload a spreadsheet of past customers to catch up on your backlog.</li></ol>
  <p>From then on, each completed job triggers a request, and your dashboard shows what was sent, reminded, or failed.</p>
  <p className="pt-4"><Link href="/signup" className="btn-navy px-5 py-3 no-underline">Start your 7-day free trial</Link></p>
  <p className="text-sm text-slate-500">$39/month or $390/year after the trial · No contract · Cancel anytime. Marketing Suite pricing as listed by Jobber and may change. ReviewAsk is not affiliated with Jobber or Google.</p>
</Legal>; }
