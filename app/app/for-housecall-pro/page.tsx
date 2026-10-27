import Link from "next/link";
import Logo from "@/components/Logo";
import Footer from "@/components/Footer";
export const metadata = {
  title: { absolute: "ReviewAsk for Housecall Pro — send every customer to Google reviews" },
  description: "Every completed Housecall Pro job gets a Google review request — for every customer, not just Gmail users. One day-3 follow-up. $39/month, 7-day free trial.",
  alternates: { canonical: "/for-housecall-pro" },
};
const steps = [
  ["Connect Housecall Pro once", "Paste your Google review link, turn on “Ask after every job,” and connect your Housecall Pro account."],
  ["A job finishes, the ask goes out", "Every customer — whatever email they use — gets a short request from your business name with one link to your Google review form."],
  ["One polite follow-up", "If they haven’t been reminded, they get a single reminder on day 3. Your dashboard shows every request and its status."],
];
const faqs = [
  { q: "Why not just use Housecall Pro’s built-in review requests?", a: "According to Housecall Pro’s help center, by default only customers with @gmail.com addresses are directed to Google; others are directed to leave a Housecall Pro review. ReviewAsk sends every customer straight to your Google review form." },
  { q: "What triggers the review request?", a: "When a job is completed in Housecall Pro, ReviewAsk sends that customer a request from your business name, plus one follow-up on day 3." },
  { q: "Can I ask past customers too?", a: "Yes. Upload a spreadsheet (Excel/CSV) of recent customers and send them all a request with one confirm." },
  { q: "Is there a contract?", a: "No. $39/month or $390/year after a 7-day free trial. Cancel anytime from Settings." },
];
export default function Page() {
  return <main className="bg-white">
    <header className="bg-navy-950 text-white"><div className="mx-auto flex h-16 max-w-5xl items-center gap-4 px-6"><Logo /><Link href="/login" className="ml-auto text-sm text-white/80 hover:text-white">Log in</Link><Link href="/signup" className="btn bg-white px-3.5 py-2 text-navy-950 hover:bg-slate-100">Start free trial</Link></div>
      <div className="mx-auto max-w-5xl px-6 pb-20 pt-16 sm:pt-24">
        <p className="eyebrow !text-lime-400">For Housecall Pro users</p>
        <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-[1.1] sm:text-5xl">Send every Housecall Pro customer to Google — not just the Gmail ones.</h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/75">ReviewAsk connects to Housecall Pro and asks every customer for a Google review when the job is done, with one follow-up on day 3. Google reviews are the ones that show up when people search for you.</p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row"><Link href="/signup" className="btn bg-white px-5 py-3 text-navy-950 hover:bg-slate-100">Start 7-day free trial</Link><a href="#why" className="btn-ghost px-5 py-3">Why every customer matters</a></div>
        <p className="mt-5 text-sm text-white/60"><strong className="font-semibold text-white">$39/month</strong> after the trial · No contract · Cancel anytime</p>
      </div></header>
    <section className="py-20"><div className="mx-auto max-w-5xl px-6"><h2 className="text-3xl font-semibold">How it works with Housecall Pro</h2>
      <ol className="mt-10 grid gap-6 md:grid-cols-3">{steps.map(([t, d], i) => <li key={t} className="rounded-lg border border-slate-200 p-6"><span className="font-mono text-xs text-slate-400">0{i + 1}</span><h3 className="mt-3 font-semibold">{t}</h3><p className="mt-2 text-sm leading-relaxed text-slate-600">{d}</p></li>)}</ol></div></section>
    <section id="why" className="border-t border-slate-200 bg-slate-50 py-20"><div className="mx-auto max-w-5xl px-6"><h2 className="text-3xl font-semibold">100% of customers go to Google</h2>
      <p className="mt-4 max-w-2xl text-slate-600">Housecall Pro’s help center explains that, by default, only customers with @gmail.com addresses are directed to Google, while others are directed to leave a Housecall Pro review. If most of your customers use Yahoo, Outlook, iCloud, or a work email, many of those reviews never reach your Google profile.</p>
      <p className="mt-4 max-w-2xl text-slate-600">ReviewAsk sends every customer the same request with one link to your Google review form — no gating, no filtering.</p>
      <p className="mt-4 text-slate-600">Read the full guide: <Link href="/housecall-pro-google-reviews" className="underline">Housecall Pro Google reviews</Link>.</p>
      <p className="mt-4 text-xs text-slate-500">Source: <a href="https://help.housecallpro.com/en/articles/11481139-reviews-faqs" className="underline" rel="noopener" target="_blank">Housecall Pro Reviews FAQs</a>. Settings and plans may change. ReviewAsk is not affiliated with Housecall Pro.</p></div></section>
    <section className="py-20"><div className="mx-auto max-w-5xl px-6"><h2 className="text-3xl font-semibold">Done the right way</h2>
      <ul className="mt-6 space-y-3 text-slate-700"><li>✓ Every customer gets the same ask — no review gating or incentives, in line with Google’s policies.</li><li>✓ Sent from your business name, with one clear link.</li><li>✓ Backlog of past customers? Upload a spreadsheet and ask them all at once.</li><li>✓ $39/month, 200 requests/month, 7-day free trial, cancel anytime from Settings.</li></ul></div></section>
    <section className="border-t border-slate-200 py-20"><div className="mx-auto max-w-3xl px-6"><h2 className="text-3xl font-semibold">Questions from Housecall Pro users</h2>
      <div className="mt-8 divide-y divide-slate-200 border-y border-slate-200">{faqs.map((f) => <details key={f.q} className="group py-5"><summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-4 font-medium [&::-webkit-details-marker]:hidden">{f.q}<span aria-hidden className="text-xl text-slate-400 transition group-open:rotate-45">+</span></summary><p className="mt-3 text-sm leading-relaxed text-slate-600">{f.a}</p></details>)}</div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }) }} /></div></section>
    <section className="bg-navy-950 text-white"><div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-6 px-6 py-14 sm:flex-row sm:items-center"><div><h2 className="text-2xl font-semibold">Start asking after every Housecall Pro job.</h2><p className="mt-2 text-white/70">Setup takes a few minutes. Questions? support@getreviewask.com</p></div><Link href="/signup" className="btn bg-white px-5 py-3 text-navy-950 hover:bg-slate-100">Start your free trial</Link></div></section>
    <Footer />
  </main>;
}
