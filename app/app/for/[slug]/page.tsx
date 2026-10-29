import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Logo from "@/components/Logo";
import Footer from "@/components/Footer";
import { verticals, getVertical } from "@/lib/verticals";

export const dynamicParams = false;
export function generateStaticParams() { return verticals.map((v) => ({ slug: v.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const v = getVertical((await params).slug); if (!v) return {};
  const url = `/for/${v.slug}`;
  return { title: v.title, description: v.description, alternates: { canonical: url },
    openGraph: { type: "website", siteName: "ReviewAsk", url, title: `${v.title} — ReviewAsk`, description: v.description },
    twitter: { card: "summary_large_image", title: `${v.title} — ReviewAsk`, description: v.description } };
}
const how = [
  { t: "Add your Google review link", d: "Paste your link and business name. Setup takes minutes." },
  { t: "Every customer gets asked", d: "Send from your phone, upload a spreadsheet, or connect Jobber, Housecall Pro, Square, Stripe, QuickBooks, or Zapier." },
  { t: "One follow-up, then stop", d: "A single polite reminder on day 3. Your dashboard shows every request’s status." },
];
export default async function VerticalPage({ params }: { params: Promise<{ slug: string }> }) {
  const v = getVertical((await params).slug); if (!v) notFound();
  const ld = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: v.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) };
  return <main id="main" className="bg-white">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    <header className="bg-navy-950 text-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6"><Logo href="/" />
        <nav aria-label="Main" className="flex items-center gap-4 text-sm text-white/80"><Link href="/login" className="hidden hover:text-white sm:inline">Log in</Link><Link href="/signup" className="btn bg-white px-3.5 py-2 text-navy-950 hover:bg-slate-100">Start free trial</Link></nav></div>
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 pb-24 pt-16 sm:pt-24 lg:grid-cols-[1.4fr_1fr]">
        <div className="max-w-3xl">
          <p className="eyebrow !text-lime-400">ReviewAsk for {v.name} · $39/mo</p>
          <h1 className="mt-5 text-4xl font-semibold leading-[1.1] sm:text-5xl">{v.h1}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/75">{v.intro}</p>
          <div className="mt-10"><Link href="/signup" className="btn bg-white px-5 py-3 text-navy-950 hover:bg-slate-100">Start free for 7 days</Link></div>
          <p className="mt-3 text-sm text-white/60">No contract · Cancel anytime · Card required, not charged until the trial ends.</p>
        </div>
        <div aria-label="Example review request" className="mx-auto w-full max-w-sm rounded-2xl bg-white p-5 text-navy-900 shadow-2xl">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Example request · sent {v.moment}</p>
          <p className="mt-3 text-xs text-slate-500">From: <span className="font-medium text-navy-900">{v.biz}</span></p>
          <p className="mt-1 text-sm font-semibold">{v.subject}</p>
          <p className="mt-3 text-sm leading-relaxed text-slate-700">Hi {v.customer},<br />{v.body}</p>
          <span className="mt-4 inline-flex rounded-md bg-navy-900 px-4 py-2 text-sm font-medium text-white">Leave a Google review</span>
          <p className="mt-3 text-[11px] text-slate-400">Unsubscribe · One follow-up on day 3 if not reviewed</p>
        </div>
      </div>
    </header>
    <section className="mx-auto max-w-6xl px-6 py-20">
      <h2 className="text-3xl font-semibold">How it works for {v.name.toLowerCase()}</h2>
      <div className="mt-10 grid gap-8 sm:grid-cols-3">{how.map((s, i) => <div key={s.t}><p className="text-sm font-semibold text-slate-400">0{i + 1}</p><h3 className="mt-2 font-semibold">{s.t}</h3><p className="mt-2 text-sm leading-relaxed text-slate-600">{s.d}</p></div>)}</div>
    </section>
    <section className="bg-slate-50"><div className="mx-auto max-w-6xl px-6 py-20">
      <h2 className="text-3xl font-semibold">Tips for getting more reviews</h2>
      <ul className="mt-8 space-y-4">{v.tips.map((t) => <li key={t} className="flex gap-3 text-slate-700"><span className="text-lime-600">✓</span>{t}</li>)}</ul>
    </div></section>
    <section className="mx-auto max-w-3xl px-6 py-20">
      <h2 className="text-3xl font-semibold">Frequently asked questions</h2>
      <div className="mt-8 divide-y divide-slate-200">{v.faqs.map((f) => <details key={f.q} className="py-5"><summary className="cursor-pointer font-medium">{f.q}</summary><p className="mt-3 text-sm leading-relaxed text-slate-600">{f.a}</p></details>)}</div>
    </section>
    <section className="bg-navy-950 text-white"><div className="mx-auto max-w-6xl px-6 py-16 text-center">
      <h2 className="text-3xl font-semibold">Start collecting more Google reviews today</h2>
      <p className="mt-3 text-white/70">$39/month after a 7-day free trial. 200 requests/month. Cancel anytime.</p>
      <Link href="/signup" className="btn mt-8 inline-flex bg-white px-5 py-3 text-navy-950 hover:bg-slate-100">Start free for 7 days</Link>
    </div></section>
    <Footer />
  </main>;
}
