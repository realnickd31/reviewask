import Link from "next/link";
import Logo from "@/components/Logo";
import Footer from "@/components/Footer";
import { currentUser } from "@/lib/session";

export const dynamic = "force-dynamic";

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
const audiences = ["Plumbing & HVAC", "Dental & medical", "Salons & spas", "Legal & accounting", "Home services", "Auto repair"];
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
  { q: "How many requests can I send?", a: "The Starter plan includes 200 review requests per month for one location." },
  { q: "Do you support text messages?", a: "Yes. Email works today, and SMS review requests are rolling out now from our verified toll-free number. Customers can reply STOP at any time to opt out.", link: { href: "/sms", label: "How our texts and opt-in work" } },
  { q: "How does the free trial work?", a: "Every plan starts with a 7-day free trial. A card is required at checkout, and you won’t be charged until the trial ends. Cancel before then and you pay nothing." },
];
const features = ["200 review requests per month", "Automatic requests after every job (Jobber, Housecall Pro)", "Quick ask for techs + paste from Excel/Sheets", "Day-3 follow-up reminders", "Status history & monthly proof", "Cancel anytime"];

function Check() { return <svg viewBox="0 0 16 16" className="mt-0.5 h-4 w-4 flex-none fill-lime-600" aria-hidden><path d="M6.2 11.3L2.9 8l1-1 2.3 2.3 5.9-5.9 1 1z" /></svg>; }

function Pricing() {
  return <section id="pricing" className="border-t border-slate-200 bg-white py-24"><div className="mx-auto max-w-5xl px-6">
    <div className="max-w-2xl"><p className="eyebrow">Pricing</p>
      <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">One plan. No setup fees.</h2>
      <p className="mt-4 text-slate-600">Everything included, with a 7-day free trial on either billing option.</p></div>
    <div className="mt-12 grid gap-6 md:grid-cols-2">
      {[{ name: "Monthly", price: "$39", per: "per month", note: "Billed monthly" }, { name: "Annual", price: "$390", per: "per year", note: "Two months included at no cost" }].map((p, i) => (
        <div key={p.name} className={`rounded-lg border bg-white p-8 ${i === 1 ? "border-navy-900 ring-1 ring-navy-900" : "border-slate-200"}`}>
          <div className="flex items-center justify-between"><p className="text-sm font-medium text-slate-600">Starter · {p.name}</p>
            {i === 1 && <span className="rounded-full bg-lime-50 px-2.5 py-0.5 text-xs font-medium text-lime-700 ring-1 ring-lime-100">Best value</span>}</div>
          <p className="mt-4 flex items-baseline gap-2"><span className="text-4xl font-semibold tracking-tight">{p.price}</span><span className="text-sm text-slate-500">{p.per}</span></p>
          <p className="mt-1 text-sm text-slate-500">{p.note}</p>
          <ul className="mt-8 space-y-3 text-sm text-slate-700">{features.map((f) => <li key={f} className="flex gap-2.5"><Check />{f}</li>)}</ul>
          <Link href="/signup" className={`${i === 1 ? "btn-navy" : "btn-outline"} mt-8 w-full`}>Start free trial</Link>
        </div>))}
    </div>
    <p className="mt-6 text-sm text-slate-500">Prices in USD. Taxes may apply. Payments processed securely by Stripe.</p>
  </div></section>;
}

export default async function Home() {
  const user = await currentUser();
  return <main className="bg-white">
    <header className="bg-navy-950 text-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6"><Logo href={user ? "/dashboard" : "/"} />
        <nav className="flex items-center gap-6 text-sm text-white/70">
          <a href="#how" className="hidden hover:text-white sm:inline">How it works</a>
          <a href="#pricing" className="hidden hover:text-white sm:inline">Pricing</a>
          <a href="#faq" className="hidden hover:text-white sm:inline">FAQ</a>
          {user ? <>
            <Link href="/quick" className="hover:text-white">Quick ask</Link>
            <Link href="/dashboard" className="btn bg-white px-3.5 py-2 text-navy-950 hover:bg-slate-100">Dashboard</Link>
            <form action="/api/auth/logout" method="post"><button type="submit" className="hover:text-white">Log out</button></form>
          </> : <>
            <Link href="/login" className="hover:text-white">Log in</Link>
            <Link href="/signup" className="btn bg-white px-3.5 py-2 text-navy-950 hover:bg-slate-100">Start free trial</Link></>}</nav></div>
      <div className="mx-auto max-w-6xl px-6 pb-28 pt-20 sm:pt-28">
        <div className="max-w-3xl">
          <p className="eyebrow !text-lime-400">Built for local service businesses</p>
          <h1 className="mt-5 text-4xl font-semibold leading-[1.1] sm:text-[56px]">Every finished job gets a Google review request — automatically.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/65">ReviewAsk sends the ask when a job closes, follows up once on day 3, and shows you exactly what went out. Upload past customers in bulk to catch up on your backlog.</p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">{user ? <Link href="/dashboard" className="btn bg-white px-5 py-3 text-navy-950 hover:bg-slate-100">Open dashboard</Link> : <Link href="/signup" className="btn bg-white px-5 py-3 text-navy-950 hover:bg-slate-100">Start 7-day free trial</Link>}<a href="#how" className="btn-ghost px-5 py-3">See how it works</a></div>
          <p className="mt-5 text-sm text-white/45">$39/month after trial · No contract · Cancel anytime</p>
        </div>
      </div>
    </header>

    <section className="border-b border-slate-200 bg-slate-50"><div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-8 sm:flex-row sm:items-center">
      <p className="flex-none text-sm font-medium text-slate-500">Designed for teams in</p>
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

    <Pricing />

    <section id="faq" className="border-t border-slate-200 py-24"><div className="mx-auto grid max-w-6xl gap-12 px-6 md:grid-cols-[1fr_1.8fr]">
      <div><p className="eyebrow">FAQ</p><h2 className="mt-3 text-3xl font-semibold">Common questions</h2>
        <p className="mt-4 text-sm text-slate-600">Something else? <a href="mailto:support@getreviewask.com" className="font-medium text-navy-900 underline underline-offset-4">Contact support</a>.</p></div>
      <div className="divide-y divide-slate-200 border-y border-slate-200">{faqs.map((f) => <details key={f.q} className="group py-5">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium [&::-webkit-details-marker]:hidden">{f.q}<span className="text-slate-400 transition group-open:rotate-45">+</span></summary>
        <p className="mt-3 pr-8 text-sm leading-relaxed text-slate-600">{f.a}{"link" in f && f.link ? <> <a href={f.link.href} className="underline">{f.link.label}</a>.</> : null}</p></details>)}</div>
    </div></section>

    <section className="bg-navy-950 text-white"><div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-6 py-16 sm:flex-row sm:items-center">
      <div><h2 className="text-2xl font-semibold">Start asking for reviews this week.</h2><p className="mt-2 text-white/60">7-day free trial. Setup takes a few minutes.</p></div>
      <Link href="/signup" className="btn bg-white px-5 py-3 text-navy-950 hover:bg-slate-100">Start free trial</Link></div></section>
    <Footer />
  </main>;
}
