import Link from "next/link";
import Logo from "@/components/Logo";
import Footer from "@/components/Footer";
import Pricing, { Check } from "@/components/Pricing";
import { currentUser } from "@/lib/session";

export const dynamic = "force-dynamic";
export const metadata = { alternates: { canonical: "/" } };

const steps = [
  { n: "01", t: "Connect once", d: "Add your Google review link, then turn on automatic asks and connect Jobber once — or use Quick ask on your phone after each job." },
  { n: "02", t: "Requests go out after every job", d: "When a job closes, the customer gets a short request from your business. Have a backlog? Upload a spreadsheet of recent customers." },
  { n: "03", t: "Follow-up and proof, handled", d: "Anyone who hasn’t been reminded gets one polite follow-up on day 3. Your dashboard shows every request, reminder, and status." },
];
const pillars = [
  { t: "Automatic after each job", d: "When a job is marked done in Jobber or Housecall Pro, the ask goes out on its own — no one has to remember." },
  { t: "Bulk upload", d: "Upload a spreadsheet (Excel/CSV) of past customers (name, email, phone) and ask them all with one confirm." },
  { t: "Day-3 follow-up", d: "One polite reminder with the same link. Most people mean to leave a review and simply forget." },
  { t: "Proof it’s working", d: "Monthly totals, follow-ups sent, and a status for every request — sent, reminded, or failed." },
];
const audiences = ["Any business that runs jobs in Jobber", "Housecall Pro shops", "Owner-operators and growing crews", "Anyone who finishes a job and wants the review"];
const principles = [
  { t: "Every customer gets the same ask", d: "No review gating or filtering. Requests follow Google’s review policies." },
  { t: "Sent from your business name", d: "Customers see your name and a clear link — no third-party branding in the way." },
  { t: "Your data stays yours", d: "We never sell customer contact details. Export or delete anytime." },
];
const faqs = [
  { q: "Does it work with Jobber or Housecall Pro?", a: "Yes. Flip on “Ask after every job” in Settings, pick Jobber or Housecall Pro, and connect it once — we’ll help finish the setup for you. Not on either? Use Quick ask on your phone after each job." },
  { q: "How many reminders do customers get?", a: "One. A single polite follow-up three days after the first request, with the same link. No endless drip." },
  { q: "Do my customers need an account?", a: "No. The email contains one link that opens your Google review form directly." },
  { q: "Is asking for reviews allowed by Google?", a: "Yes. Google permits businesses to ask customers for reviews. ReviewAsk sends the same request to every customer and never offers incentives or filters out unhappy customers, which Google prohibits." },
  { q: "Is there a contract?", a: "No. Billing is month-to-month (or annual if you prefer). You can cancel from Settings at any time, and you keep access until the end of the billing period." },
  { q: "How is this different from Jobber’s Marketing Suite?", a: "Jobber’s Marketing Suite is a $99/month add-on that bundles reviews with other marketing tools. If what you want is review requests after every job, ReviewAsk does that one thing for $39/month and connects to Jobber directly.", link: { href: "/compare/jobber-marketing-suite", label: "See the side-by-side" } },
  { q: "How many requests can I send?", a: "The Starter plan includes 200 review requests per month for one location." },
  { q: "Do you support text messages?", a: "Yes. Email works today, and text-message requests are rolling out gradually as carrier verification completes. Customers can reply STOP at any time to opt out.", link: { href: "/sms", label: "How our texts and opt-in work" } },
  { q: "How does the free trial work?", a: "Every plan starts with a 7-day free trial. A card is required at checkout, and you won’t be charged until the trial ends. Cancel before then and you pay nothing." },
];
export default async function Home() {
  const user = await currentUser();
  return <main className="bg-white">
    <header className="bg-navy-950 text-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6"><Logo href={user ? "/dashboard" : "/"} />
        <nav aria-label="Main" className="flex items-center gap-4 text-sm text-white/80 sm:gap-6">
          <a href="#how" className="hidden hover:text-white sm:inline">How it works</a>
          <a href="#pricing" className="hidden hover:text-white sm:inline">Pricing</a>
          <a href="#faq" className="hidden hover:text-white sm:inline">FAQ</a>
          <a href="#compare" className="hidden hover:text-white md:inline">vs. Jobber Suite</a>
          {user ? <>
            <Link href="/quick" className="hover:text-white">Quick ask</Link>
            <Link href="/dashboard" className="btn bg-white px-3.5 py-2 text-navy-950 hover:bg-slate-100">Dashboard</Link>
            <form action="/api/auth/logout" method="post"><button type="submit" className="hover:text-white">Log out</button></form>
          </> : <>
            <Link href="/login" className="hover:text-white">Log in</Link>
            <Link href="/signup" className="btn bg-white px-3.5 py-2 text-navy-950 hover:bg-slate-100">Start free trial</Link></>}</nav></div>
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 pb-28 pt-20 sm:pt-28 lg:grid-cols-[1.4fr_1fr]">
        <div className="max-w-3xl">
          <p className="eyebrow !text-lime-400">For Jobber and field-service businesses</p>
          <h1 className="mt-5 text-4xl font-semibold leading-[1.1] sm:text-[56px]">Every finished job gets a Google review request — automatically.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/75">ReviewAsk sends the ask when a job closes in Jobber or Housecall Pro, follows up once on day 3, and shows you exactly what went out. No chasing customers by hand — and no $99/month add-on.</p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">{user ? <Link href="/dashboard" className="btn bg-white px-5 py-3 text-navy-950 hover:bg-slate-100">Open dashboard</Link> : <Link href="/signup" className="btn bg-white px-5 py-3 text-navy-950 hover:bg-slate-100">Start 7-day free trial</Link>}<a href="#how" className="btn-ghost px-5 py-3">See how it works</a></div>
          <p className="mt-5 text-sm text-white/60">$39/month after the 7-day trial · No contract · Cancel anytime</p>
        </div>
      </div>
        <div aria-label="Example review request" className="hidden lg:block"><div className="mx-auto max-w-sm rounded-2xl bg-white p-5 text-navy-900 shadow-2xl ring-1 ring-white/10">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Example request</p>
          <p className="mt-3 text-sm font-semibold">From: Your Business Name</p>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">Hi Sam — thanks for choosing us today! Would you mind leaving a quick Google review? It really helps a small business like ours.</p>
          <span className="mt-4 inline-flex rounded-md bg-navy-900 px-4 py-2 text-sm font-medium text-white">Leave a review ★★★★★</span>
          <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500"><span>Job closed in Jobber → sent automatically</span><span className="text-lime-700">Day-3 reminder queued</span></div>
        </div></div>
      
    </header>

    <section className="border-b border-slate-200 bg-slate-50"><div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-8 sm:flex-row sm:items-center">
      <p className="flex-none text-sm font-medium text-slate-500">Built for</p>
      <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-700">{audiences.map((a) => <li key={a}>{a}</li>)}</ul>
    </div></section>

    <section id="how" className="py-24"><div className="mx-auto max-w-6xl px-6">
      <div className="max-w-2xl"><p className="eyebrow">How it works</p><h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Set it up once. It keeps asking.</h2></div>
      <div className="mt-14 grid gap-px overflow-hidden rounded-lg border border-slate-200 bg-slate-200 md:grid-cols-3">{steps.map((s) => <div key={s.n} className="bg-white p-8">
        <span className="font-mono text-xs text-slate-400">{s.n}</span>
        <h3 className="mt-4 text-base font-semibold">{s.t}</h3><p className="mt-2 text-sm leading-relaxed text-slate-600">{s.d}</p></div>)}</div>
    </div></section>

    <section className="border-t border-slate-200 py-24"><div className="mx-auto max-w-6xl px-6">
      <div className="max-w-2xl"><p className="eyebrow">What you get</p><h2 className="mt-3 text-3xl font-semibold sm:text-4xl">More than a saved text message.</h2>
        <p className="mt-4 text-slate-600">A text you remember to send is a good start. ReviewAsk makes sure it happens for every customer, follows up, and keeps the record.</p></div>
      <div className="mt-14 grid gap-8 sm:grid-cols-2">{pillars.map((p) => <div key={p.t} className="flex gap-4"><Check /><div><h3 className="font-semibold">{p.t}</h3><p className="mt-1 text-sm leading-relaxed text-slate-600">{p.d}</p></div></div>)}</div>
    </div></section>

    <section className="border-t border-slate-200 bg-slate-50 py-24"><div className="mx-auto grid max-w-6xl gap-12 px-6 md:grid-cols-[1fr_1.4fr]">
      <div><p className="eyebrow">Trust & compliance</p><h2 className="mt-3 text-3xl font-semibold">Review requests done the right way.</h2>
        <p className="mt-4 text-slate-600">Reviews only help if they’re genuine. ReviewAsk is built around the practices Google expects.</p></div>
      <dl className="space-y-8">{principles.map((p) => <div key={p.t} className="flex gap-4"><Check /><div><dt className="font-semibold">{p.t}</dt><dd className="mt-1 text-sm leading-relaxed text-slate-600">{p.d}</dd></div></div>)}</dl>
    </div></section>

    <section id="compare" className="border-t border-slate-200 py-24"><div className="mx-auto max-w-5xl px-6">
      <div className="max-w-2xl"><p className="eyebrow">For Jobber users</p><h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Jobber review asks without the $99 Marketing Suite.</h2>
        <p className="mt-4 text-slate-600">Jobber’s Marketing Suite is a $99/month add-on that includes reviews alongside other marketing tools. If you just want every finished job to turn into a review request, ReviewAsk does exactly that for $39/month.</p></div>
      <div className="mt-10 overflow-x-auto rounded-lg border border-slate-200"><table className="w-full min-w-[480px] text-left text-sm">
        <thead className="bg-slate-50 text-slate-600"><tr><th scope="col" className="p-4 font-medium"></th><th scope="col" className="p-4 font-semibold text-navy-900">ReviewAsk</th><th scope="col" className="p-4 font-medium">Jobber Marketing Suite</th></tr></thead>
        <tbody className="divide-y divide-slate-200">
          <tr><th scope="row" className="p-4 font-medium">Price</th><td className="p-4 font-semibold">$39/month</td><td className="p-4">$99/month add-on</td></tr>
          <tr><th scope="row" className="p-4 font-medium">Focus</th><td className="p-4">Google review requests after every job</td><td className="p-4">Reviews plus a broader marketing bundle</td></tr>
          <tr><th scope="row" className="p-4 font-medium">Works with Jobber</th><td className="p-4">Yes — connects to your account</td><td className="p-4">Yes — built in</td></tr>
          <tr><th scope="row" className="p-4 font-medium">Contract</th><td className="p-4">None, cancel anytime</td><td className="p-4">Per Jobber’s plan terms</td></tr>
        </tbody></table></div>
      <p className="mt-4 text-sm text-slate-500">Want more than reviews? The Marketing Suite may be the right fit. <Link href="/compare/jobber-marketing-suite" className="font-medium text-navy-900 underline underline-offset-4">Read the full comparison</Link>.</p>
    </div></section>

    <Pricing />

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
    <Footer />
  </main>;
}
