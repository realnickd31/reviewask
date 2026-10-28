import Link from "next/link";
import Image from "next/image";
import Logo from "@/components/Logo";
import Footer from "@/components/Footer";
import Pricing, { Check } from "@/components/Pricing";
import { currentUser } from "@/lib/session";

export const dynamic = "force-dynamic";
export const metadata = { alternates: { canonical: "/" } };

const steps = [
  { n: "01", t: "Add your Google review link", d: "Paste your Google review link and your business name. That’s the only setup you need — connecting Jobber or Housecall Pro is optional." },
  { n: "02", t: "Your customers get a short email", d: "After the work is done, each customer gets a short note from your business with a one-tap link to leave a Google review. Send it from your phone, upload a spreadsheet, or let it go out automatically." },
  { n: "03", t: "Follow-up and proof, handled", d: "Anyone who hasn’t been reminded gets one polite follow-up on day 3. Your dashboard shows every request, reminder, and status." },
];
const pillars = [
  { t: "Three ways to send", d: "Tap send from your phone after a visit, upload a spreadsheet of customers, or — if you use Jobber or Housecall Pro — have requests go out automatically when a job is marked done." },
  { t: "Bulk upload", d: "Upload a spreadsheet (Excel/CSV) of past customers (name, email, phone) and ask them all with one confirm." },
  { t: "Day-3 follow-up", d: "One polite reminder with the same link. Most people mean to leave a review and simply forget." },
  { t: "Proof it’s working", d: "Monthly totals, follow-ups sent, and a status for every request — sent, reminded, or failed." },
];
const audiences = ["Any local business that wants more Google reviews", "Teams with a customer list in a spreadsheet", "Owner-operators and growing teams", "Jobber and Housecall Pro users (optional)"];
const principles = [
  { t: "Every customer gets the same ask", d: "No review gating or filtering. Requests follow Google’s review policies." },
  { t: "Sent from your business name", d: "Customers see your name and a clear link — no third-party branding in the way." },
  { t: "Your data stays yours", d: "We never sell customer contact details. Export or delete anytime." },
];
const faqs = [
  { q: "How many reminders do customers get?", a: "One. A single polite follow-up three days after the first request, with the same link. No endless drip." },
  { q: "Do my customers need an account?", a: "No. The email contains one link that opens your Google review form directly." },
  { q: "Is asking for reviews allowed by Google?", a: "Yes. Google permits businesses to ask customers for reviews. ReviewAsk sends the same request to every customer and never offers incentives or filters out unhappy customers, which Google prohibits." },
  { q: "Is there a contract?", a: "No. Billing is month-to-month (or annual if you prefer). You can cancel from Settings at any time, and you keep access until the end of the billing period." },
  { q: "How many requests can I send?", a: "The Starter plan includes 200 review requests per month for one location." },
  { q: "Who should I send review requests to?", a: "Only customers you actually did work for, who gave you their contact details. Every ReviewAsk email includes a one-click unsubscribe link, and anyone who opts out is never contacted again from your account. Texts honor STOP replies. ReviewAsk sends one request and one follow-up, never marketing. This isn't legal advice, so check the rules where you operate if you're unsure." },
  { q: "Do you support text messages?", a: "Yes. Email works today, and text-message requests are rolling out gradually as carrier verification completes. Customers can reply STOP at any time to opt out.", link: { href: "/sms", label: "How our texts and opt-in work" } },
  { q: "How does the free trial work?", a: "Every plan starts with a 7-day free trial. A card is required at checkout, and you won’t be charged until the trial ends. Cancel before then and you pay nothing." },
];
export default async function Home() {
  const user = await currentUser();
  return <main id="main" className="bg-white">
    <header className="bg-navy-950 text-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6"><Logo href={user ? "/dashboard" : "/"} />
        <nav aria-label="Main" className="flex items-center gap-4 text-sm text-white/80 sm:gap-6">
          <a href="#how" className="hidden hover:text-white sm:inline">How it works</a>
          <a href="#pricing" className="hidden hover:text-white sm:inline">Pricing</a>
          <a href="#faq" className="hidden hover:text-white sm:inline">FAQ</a>
          {user ? <>
            <Link href="/quick" className="hover:text-white">Quick ask</Link>
            <Link href="/dashboard" className="btn bg-white px-3.5 py-2 text-navy-950 hover:bg-slate-100">Dashboard</Link>
            <form action="/api/auth/logout" method="post"><button type="submit" className="hover:text-white">Log out</button></form>
          </> : <>
            <Link href="/login" className="hidden hover:text-white sm:inline">Log in</Link>
            <Link href="/signup" className="btn bg-white px-3.5 py-2 text-navy-950 hover:bg-slate-100">Start free trial</Link>
            <details className="relative sm:hidden"><summary aria-label="Open menu" className="grid h-11 w-11 cursor-pointer list-none place-items-center rounded-md ring-1 ring-white/20 [&::-webkit-details-marker]:hidden"><svg viewBox="0 0 20 20" className="h-5 w-5 fill-white" aria-hidden><path d="M3 5h14v2H3zm0 4h14v2H3zm0 4h14v2H3z" /></svg></summary>
              <div className="absolute right-0 z-20 mt-2 w-56 rounded-lg bg-white p-2 text-navy-900 shadow-xl">{[["/#how", "How it works"], ["/pricing", "Pricing"], ["/for-housecall-pro", "For Housecall Pro users"], ["/#faq", "FAQ"], ["/login", "Log in"]].map(([h, l]) => <a key={h} href={h} className="block rounded-md px-3 py-3 text-sm hover:bg-slate-50">{l}</a>)}</div></details></>}</nav></div>
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 pb-28 pt-20 sm:pt-28 lg:grid-cols-[1.4fr_1fr]">
        <div className="max-w-3xl">
          <p className="eyebrow !text-lime-400">More Google reviews, without chasing customers · $39/mo</p>
          <h1 className="mt-5 text-4xl font-semibold leading-[1.1] sm:text-[56px]">Every finished job gets a Google review request — automatically.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/75">When a job is done, ReviewAsk emails your customer a short note from your business with one tap to leave a Google review. One polite follow-up on day 3. Upload a spreadsheet of past customers anytime — or send a quick request from your phone. Your dashboard shows exactly what went out.</p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">{user ? <Link href="/dashboard" className="btn bg-white px-5 py-3 text-navy-950 hover:bg-slate-100">Open dashboard</Link> : <Link href="/signup" className="btn bg-white px-5 py-3 text-navy-950 hover:bg-slate-100">Start free for 7 days</Link>}{!user && <a href="#how" className="btn-ghost px-5 py-3">See how it works</a>}</div>
          <p className="mt-4 text-sm text-white/70">Free tool, no signup: <Link href="/tools/review-link" className="font-medium text-white underline underline-offset-4 hover:text-lime-400">Google review link generator</Link>.</p>
          <div className="mt-6 flex flex-wrap gap-2 text-xs text-white/80"><Link href="/#how" className="rounded-full px-3 py-1 ring-1 ring-white/20 hover:bg-white/5">Works with Jobber</Link><Link href="/for-housecall-pro" className="rounded-full px-3 py-1 ring-1 ring-white/20 hover:bg-white/5">Works with Housecall Pro</Link><span className="rounded-full px-3 py-1 ring-1 ring-white/20">Quick ask from any phone</span></div>
          <p className="mt-5 text-sm text-white/60"><strong className="font-semibold text-white">$39/month</strong> after the 7-day trial · No contract · Cancel anytime</p>
        </div>
      </div>
        <div aria-label="Example review request" className="hidden lg:block"><div className="mx-auto w-full max-w-sm rounded-2xl bg-white p-5 text-navy-900 shadow-2xl ring-1 ring-white/10">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Example request</p>
          <p className="mt-3 text-sm font-semibold">From: Your Business Name</p>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">Hi Sam — thanks for choosing us today! Would you mind leaving a quick Google review? It really helps a small business like ours.</p>
          <span className="mt-4 inline-flex rounded-md bg-navy-900 px-4 py-2 text-sm font-medium text-white">Leave a review ★★★★★</span>
          <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500"><span>Sent automatically after the job</span><span className="text-lime-700">Day-3 reminder queued</span></div>
        </div></div>
      
    </header>

    <section className="border-b border-slate-200 bg-slate-50"><div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-8 sm:flex-row sm:items-center">
      <p className="flex-none text-sm font-medium text-slate-500">Built for</p>
      <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-700">{audiences.map((a) => <li key={a}>{a}</li>)}</ul>
    </div></section>

    <section id="how" className="py-24"><div className="mx-auto max-w-6xl px-6">
      <div className="max-w-2xl"><p className="eyebrow">How it works</p><h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Set it up once. Every customer gets asked.</h2></div>
      <div className="mt-14 grid gap-px overflow-hidden rounded-lg border border-slate-200 bg-slate-200 md:grid-cols-3">{steps.map((s) => <div key={s.n} className="bg-white p-8">
        <span className="font-mono text-xs text-slate-400">{s.n}</span>
        <h3 className="mt-4 text-base font-semibold">{s.t}</h3><p className="mt-2 text-sm leading-relaxed text-slate-600">{s.d}</p></div>)}</div>
      <figure className="mt-12"><Image src="/screens/customer-email.png" alt="What your customer sees: a short email from your business with a Leave a review button" width={1600} height={1000} className="mx-auto w-full max-w-3xl rounded-lg border border-slate-200 shadow-sm" /><figcaption className="mt-3 text-center text-sm text-slate-500">What your customer gets: one short note from your business and one tap to your Google review form.</figcaption></figure>
    </div></section>

    <section className="border-t border-slate-200 py-24"><div className="mx-auto max-w-6xl px-6">
      <div className="max-w-2xl"><p className="eyebrow">What you get</p><h2 className="mt-3 text-3xl font-semibold sm:text-4xl">More than a saved text message.</h2>
        <p className="mt-4 text-slate-600">A text you remember to send is a good start. ReviewAsk makes sure it happens for every customer, follows up, and keeps the record.</p></div>
      <div className="mt-14 grid gap-8 sm:grid-cols-2">{pillars.map((p) => <div key={p.t} className="flex gap-4"><Check /><div><h3 className="font-semibold">{p.t}</h3><p className="mt-1 text-sm leading-relaxed text-slate-600">{p.d}</p></div></div>)}</div>
    </div></section>

    <section id="backlog" className="border-t border-slate-200 py-16"><div className="mx-auto max-w-6xl px-6"><div className="flex flex-col gap-6 rounded-xl border border-lime-200 bg-lime-50/60 p-8 sm:flex-row sm:items-center sm:justify-between">
      <div className="max-w-2xl"><p className="eyebrow !text-lime-700">Slower season?</p><h2 className="mt-2 text-2xl font-semibold">Ask last season’s customers this week.</h2>
        <p className="mt-3 text-slate-700">Plenty of happy customers from the busy months never got asked. Export them from Jobber, Housecall Pro, or a spreadsheet, paste or upload the list, and email every one of them a review request with one confirm, plus one follow-up on day 3. (SMS is rolling out.) Up to 200 requests a month.</p></div>
      <div className="flex flex-none flex-col gap-2 sm:items-end"><Link href="/signup" className="btn-navy px-5 py-3">Start free trial</Link><a href="#how" className="text-sm font-medium text-navy-900 underline underline-offset-4">See how it works</a></div>
    </div></div></section>

    <section className="border-t border-slate-200 bg-slate-50 py-24"><div className="mx-auto grid max-w-6xl gap-12 px-6 md:grid-cols-[1fr_1.4fr]">
      <div><p className="eyebrow">Trust & compliance</p><h2 className="mt-3 text-3xl font-semibold">Review requests done the right way.</h2>
        <p className="mt-4 text-slate-600">Reviews only help if they’re genuine. ReviewAsk is built around the practices Google expects.</p></div>
      <dl className="space-y-8">{principles.map((p) => <div key={p.t} className="flex gap-4"><Check /><div><dt className="font-semibold">{p.t}</dt><dd className="mt-1 text-sm leading-relaxed text-slate-600">{p.d}</dd></div></div>)}</dl>
    </div></section>

    <Pricing />

    <section id="founder" className="border-t border-slate-200 py-16"><div className="mx-auto max-w-3xl px-6"><div className="rounded-xl border border-slate-200 bg-white p-8">
      <p className="eyebrow">A note from the founder</p>
      <p className="mt-3 text-slate-700">I built ReviewAsk because the shops doing the best work often have the fewest reviews. Nobody has time to ask after every job. ReviewAsk does that one thing, for a flat $39 a month.</p>
      <p className="mt-3 text-slate-700">Want help getting set up? Email <a href="mailto:support@getreviewask.com?subject=Setup%20help" className="font-medium text-navy-900 underline underline-offset-4">support@getreviewask.com</a> and I&apos;ll walk you through connecting Jobber or Housecall Pro and adding your review link. It usually takes about 10 minutes.</p>
      <p className="mt-4 text-sm font-medium text-navy-900">Nick D&apos;Antonio, founder of ReviewAsk</p>
    </div></div></section>
    <section id="faq" className="border-t border-slate-200 py-24"><div className="mx-auto grid max-w-6xl gap-12 px-6 md:grid-cols-[1fr_1.8fr]">
      <div><p className="eyebrow">FAQ</p><h2 className="mt-3 text-3xl font-semibold">Common questions</h2>
        <p className="mt-4 text-sm text-slate-600">Something else? <a href="mailto:support@getreviewask.com" className="font-medium text-navy-900 underline underline-offset-4">Contact support</a>.</p></div>
      <div className="divide-y divide-slate-200 border-y border-slate-200">{faqs.map((f) => <details key={f.q} className="group py-5">
        <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-4 font-medium [&::-webkit-details-marker]:hidden">{f.q}<span aria-hidden className="text-xl leading-none text-slate-400 transition group-open:rotate-45">+</span></summary>
        <p className="mt-3 pr-8 text-sm leading-relaxed text-slate-600">{f.a}{"link" in f && f.link ? <> <a href={f.link.href} className="underline">{f.link.label}</a>.</> : null}</p></details>)}</div>
    </div></section>

    <section className="bg-navy-950 text-white"><div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-6 py-16 sm:flex-row sm:items-center">
      <div><h2 className="text-2xl font-semibold">Start asking for reviews this week.</h2><p className="mt-2 text-white/70">7-day free trial · $39/month after · Cancel anytime · Questions? support@getreviewask.com</p></div>
      <Link href="/signup" className="btn bg-white px-5 py-3 text-navy-950 hover:bg-slate-100">Start your free trial</Link></div></section>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "SoftwareApplication", name: "ReviewAsk", url: "https://getreviewask.com", applicationCategory: "BusinessApplication", operatingSystem: "Web", description: "ReviewAsk emails your customers a short message with a one-tap link to leave a Google review after work is done, from a spreadsheet, or with one tap — plus one follow-up. For any business that wants more Google reviews. Optional Jobber and Housecall Pro integrations.", offers: [{ "@type": "Offer", price: "39", priceCurrency: "USD", name: "Starter (monthly)" }, { "@type": "Offer", price: "390", priceCurrency: "USD", name: "Starter (annual)" }] }) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }) }} />
    {!user && <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 p-3 backdrop-blur sm:hidden"><Link href="/signup" className="btn-navy w-full py-3">Start 7-day free trial · $39/mo after</Link></div>}
    <div className="pb-20 sm:pb-0"><Footer /></div>
  </main>;
}
