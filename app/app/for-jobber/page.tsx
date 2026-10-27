import Link from "next/link";
import Logo from "@/components/Logo";
import Footer from "@/components/Footer";
export const metadata = {
  title: { absolute: "ReviewAsk for Jobber — automatic Google review requests for $39/month" },
  description: "Connect Jobber once and every completed job gets a Google review request, plus one day-3 follow-up. $39/month vs. the $99/month Marketing Suite add-on.",
  alternates: { canonical: "/for-jobber" },
};
const steps = [
  ["Connect Jobber once", "Paste your Google review link, turn on “Ask after every job,” and connect your Jobber account."],
  ["A job closes, the ask goes out", "Your customer gets a short request from your business name with one link to your Google review form."],
  ["One polite follow-up", "If they haven’t been reminded, they get a single reminder on day 3. Your dashboard shows every request and its status."],
];
const faqs = [
  { q: "Do I need Jobber’s Marketing Suite to use ReviewAsk?", a: "No. ReviewAsk connects to your Jobber account directly. You don’t need the $99/month Marketing Suite add-on." },
  { q: "What triggers the review request?", a: "When a job is completed in Jobber, ReviewAsk sends that customer a request from your business name with one link to your Google review form, plus one follow-up on day 3." },
  { q: "Can I ask past customers too?", a: "Yes. Upload a spreadsheet (Excel/CSV) of recent customers and send them all a request with one confirm." },
  { q: "Is there a contract?", a: "No. $39/month or $390/year after a 7-day free trial. Cancel anytime from Settings." },
];
export default function Page() {
  return <main className="bg-white">
    <header className="bg-navy-950 text-white"><div className="mx-auto flex h-16 max-w-5xl items-center gap-4 px-6"><Logo /><Link href="/login" className="ml-auto text-sm text-white/80 hover:text-white">Log in</Link><Link href="/signup" className="btn bg-white px-3.5 py-2 text-navy-950 hover:bg-slate-100">Start free trial</Link></div>
      <div className="mx-auto max-w-5xl px-6 pb-20 pt-16 sm:pt-24">
        <p className="eyebrow !text-lime-400">For Jobber users</p>
        <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-[1.1] sm:text-5xl">Turn every completed Jobber job into a Google review request.</h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/75">ReviewAsk connects to Jobber and asks every customer for a review when the job closes — so nobody on your team has to remember. Just review asks, for $39/month, without paying for the $99/month Marketing Suite.</p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row"><Link href="/signup" className="btn bg-white px-5 py-3 text-navy-950 hover:bg-slate-100">Start 7-day free trial</Link><Link href="/compare/jobber-marketing-suite" className="btn-ghost px-5 py-3">Compare with Marketing Suite</Link></div>
        <p className="mt-5 text-sm text-white/60"><strong className="font-semibold text-white">$39/month</strong> after the trial · No contract · Cancel anytime</p>
      </div></header>
    <section className="py-20"><div className="mx-auto max-w-5xl px-6"><h2 className="text-3xl font-semibold">How it works with Jobber</h2>
      <ol className="mt-10 grid gap-6 md:grid-cols-3">{steps.map(([t, d], i) => <li key={t} className="rounded-lg border border-slate-200 p-6"><span className="font-mono text-xs text-slate-400">0{i + 1}</span><h3 className="mt-3 font-semibold">{t}</h3><p className="mt-2 text-sm leading-relaxed text-slate-600">{d}</p></li>)}</ol></div></section>
    <section className="border-t border-slate-200 bg-slate-50 py-20"><div className="mx-auto max-w-5xl px-6"><h2 className="text-3xl font-semibold">$39 for review asks vs. a $99 add-on</h2>
      <p className="mt-4 max-w-2xl text-slate-600">Jobber’s Marketing Suite is a $99/month add-on that bundles reviews with other marketing tools. If reviews are what you need, ReviewAsk is the focused option.</p>
      <div className="mt-8 overflow-x-auto rounded-lg border border-slate-200 bg-white"><table className="w-full min-w-[440px] text-left text-sm"><thead className="bg-slate-50 text-slate-600"><tr><th scope="col" className="p-4"></th><th scope="col" className="p-4 text-navy-900">ReviewAsk</th><th scope="col" className="p-4">Marketing Suite</th></tr></thead>
        <tbody className="divide-y divide-slate-200"><tr><th scope="row" className="p-4 font-medium">Price</th><td className="p-4 font-semibold">$39/mo or $390/yr</td><td className="p-4">$99/mo add-on</td></tr><tr><th scope="row" className="p-4 font-medium">Focus</th><td className="p-4">Review requests + day-3 follow-up</td><td className="p-4">Reviews plus broader marketing</td></tr><tr><th scope="row" className="p-4 font-medium">Contract</th><td className="p-4">None</td><td className="p-4">Per Jobber’s terms</td></tr></tbody></table></div>
      <p className="mt-4 text-xs text-slate-500">Marketing Suite pricing as listed by Jobber; may change. ReviewAsk is not affiliated with Jobber.</p></div></section>
    <section id="backlog" className="border-t border-slate-200 py-16"><div className="mx-auto max-w-5xl px-6"><div className="rounded-xl border border-lime-200 bg-lime-50/60 p-8"><p className="eyebrow !text-lime-700">Quick win this week</p><h2 className="mt-2 text-2xl font-semibold">Ask last season&apos;s Jobber customers.</h2><p className="mt-3 max-w-3xl text-slate-700">Export your clients from Jobber (or any spreadsheet), paste or upload the list in ReviewAsk, and email each customer a one-tap Google review request, with one follow-up on day 3. SMS is rolling out. Up to 200 requests a month.</p><div className="mt-5 flex flex-wrap items-center gap-4"><Link href="/signup" className="btn-navy px-5 py-3">Start 7-day free trial</Link><Link href="/templates/review-request" className="text-sm font-medium text-navy-900 underline underline-offset-4">See message templates</Link></div></div></div></section>
    <section className="border-t border-slate-200 py-20"><div className="mx-auto max-w-5xl px-6"><h2 className="text-3xl font-semibold">Check your review gap</h2>
      <p className="mt-4 max-w-2xl text-slate-600">Search your trade and town on Google Maps, then compare your review count with the top three results. Most of the gap between a good shop and the local leader is volume: how many customers were actually asked. If you finish 40 jobs a month and ask every customer, even a modest response rate adds up to new reviews every month, without anyone remembering to ask.</p>
      <ol className="mt-6 space-y-2 text-slate-700"><li>1. Note your review count and the top three competitors&apos; counts.</li><li>2. Count how many jobs you finished last month in Jobber.</li><li>3. Ask every one of those customers, automatically, starting with your backlog.</li></ol>
      <p className="mt-6 flex flex-wrap items-center gap-4"><Link href="/signup" className="btn-navy px-5 py-3 !text-white no-underline">Start asking after every job</Link><Link href="/tools/review-gap" className="font-medium text-navy-900 underline underline-offset-4">Use the review gap calculator</Link></p></div></section>
    <section className="py-20"><div className="mx-auto max-w-5xl px-6"><h2 className="text-3xl font-semibold">Done the right way</h2>
      <ul className="mt-6 space-y-3 text-slate-700"><li>✓ Every customer gets the same ask — no review gating or incentives, in line with Google’s policies.</li><li>✓ Sent from your business name, with one clear link.</li><li>✓ Backlog of past customers? Upload a spreadsheet and ask them all at once.</li><li>✓ 200 requests/month, 7-day free trial, cancel anytime from Settings.</li></ul></div></section>
    <section className="border-t border-slate-200 py-20"><div className="mx-auto max-w-3xl px-6"><h2 className="text-3xl font-semibold">Questions from Jobber users</h2>
      <div className="mt-8 divide-y divide-slate-200 border-y border-slate-200">{faqs.map((f) => <details key={f.q} className="group py-5"><summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-4 font-medium [&::-webkit-details-marker]:hidden">{f.q}<span aria-hidden className="text-xl text-slate-400 transition group-open:rotate-45">+</span></summary><p className="mt-3 text-sm leading-relaxed text-slate-600">{f.a}</p></details>)}</div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }) }} /></div></section>
    <section className="bg-navy-950 text-white"><div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-6 px-6 py-14 sm:flex-row sm:items-center"><div><h2 className="text-2xl font-semibold">Start asking after every Jobber job.</h2><p className="mt-2 text-white/70">Setup takes a few minutes. Questions? support@getreviewask.com</p></div><Link href="/signup" className="btn bg-white px-5 py-3 text-navy-950 hover:bg-slate-100">Start your free trial</Link></div></section>
    <Footer />
  </main>;
}
