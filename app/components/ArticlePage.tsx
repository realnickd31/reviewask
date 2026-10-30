import Link from "next/link";
import type { Metadata } from "next";
import Legal from "./Legal";
import { articles, type Article } from "@/lib/articles";
import { OG_IMAGES } from "@/lib/og";
export function articleMeta(a: Article): Metadata {
  const url = `/${a.kind}/${a.slug}`;
  return { title: { absolute: `${a.title} | ReviewAsk` }, description: a.description, alternates: { canonical: url },
    openGraph: { type: "article", siteName: "ReviewAsk", url, title: a.title, description: a.description, images: OG_IMAGES },
    twitter: { card: "summary_large_image", title: a.title, description: a.description, images: OG_IMAGES.map((i) => i.url) } };
}
const LINKS: [string, string][] = [["free Google review link generator", "/tools/review-link"], ["start a free trial", "/signup"]];
const md = (t: string) => t.split(/(\[[^\]]+\]\(\/[^)]+\))/).map((s, i) => { const m = s.match(/^\[([^\]]+)\]\((\/[^)]+)\)$/); return m ? <Link key={i} href={m[2]}>{m[1]}</Link> : s; });
const linkify = (t: string) => { if (/\]\(\//.test(t)) return <>{md(t)}</>; const m = LINKS.find(([k]) => t.includes(k)); if (!m) return t; const [k, href] = m; const [a, ...b] = t.split(k);
  return <>{a}<Link href={href}>{k}</Link>{b.join(k)}</>; };
const RELATED: Record<string, string[]> = {
  "how-to-get-more-google-reviews": ["how-to-ask-customers-for-a-review", "find-your-google-review-link", "google-review-policy-rules"],
  "how-to-ask-customers-for-a-review": ["find-your-google-review-link", "google-review-policy-rules", "how-to-get-more-google-reviews"],
  "find-your-google-review-link": ["how-to-ask-customers-for-a-review", "how-to-get-more-google-reviews"],
  "how-to-respond-to-google-reviews": ["how-to-get-more-google-reviews", "google-review-policy-rules"],
  "google-review-link-without-business-profile": ["send-google-review-link-by-text", "find-your-google-review-link", "how-to-ask-customers-for-a-review"],
  "send-google-review-link-by-text": ["google-review-link-without-business-profile", "how-to-ask-customers-for-a-review", "google-review-policy-rules"],
  "google-review-policy-rules": ["how-to-ask-customers-for-a-review", "how-to-respond-to-google-reviews"],
};
function related(a: Article): { heading: string; items: Article[] } {
  const guide = (slug: string) => articles.find((x) => x.kind === "guides" && x.slug === slug)!;
  if (a.kind === "guides") return { heading: "Related guides", items: (RELATED[a.slug] ?? []).map(guide).filter(Boolean) };
  return { heading: "More comparisons", items: [...articles.filter((x) => x.kind === "vs" && x.slug !== a.slug), guide("how-to-get-more-google-reviews")] };
}
export default function ArticlePage({ a }: { a: Article }) {
  const ld = [{ "@context": "https://schema.org", "@type": "Article", headline: a.h1, description: a.description, dateModified: "2026-10-29", author: { "@type": "Organization", name: "ReviewAsk" }, mainEntityOfPage: `https://getreviewask.com/${a.kind}/${a.slug}` },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: a.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }];
  return <Legal title={a.h1}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    <p className="text-lg">{a.intro}</p>
    {a.sections.map((s) => <section key={s.h} className="space-y-3"><h2>{s.h}</h2>
      {s.table && <div className="overflow-x-auto"><table className="w-full border-collapse text-sm"><tbody>{s.table.map((r, i) => <tr key={i} className="border-b border-slate-200">{r.map((c, j) => i === 0 ? <th key={j} className="p-2 text-left font-semibold text-navy-900">{c}</th> : <td key={j} className={`p-2 align-top ${j === 0 ? "font-medium" : ""}`}>{c}</td>)}</tr>)}</tbody></table></div>}
      {s.p?.map((t) => <p key={t}>{linkify(t)}</p>)}
      {s.list && <ul className="list-disc space-y-1 pl-5">{s.list.map((t) => <li key={t}>{t}</li>)}</ul>}</section>)}
    <div className="mt-8 rounded-xl bg-slate-50 p-6"><p className="font-semibold text-navy-900">Ask every customer, without remembering to</p><p className="mt-1 text-sm">ReviewAsk texts or emails every customer a one-tap Google review link, with one reminder. No Google login needed. $39/month, 7-day free trial, no contract.</p><div className="mt-4 flex flex-wrap gap-3"><Link href="/signup" className="btn-navy px-5 py-2.5 !text-white no-underline">Start free trial</Link><Link href="/tools/review-link" className="px-2 py-2.5 text-sm underline underline-offset-4">Get your review link free</Link></div></div>
    {(() => { const r = related(a); return r.items.length > 0 && <nav aria-label={r.heading} className="rounded-xl border border-slate-200 p-6"><p className="font-semibold text-navy-900">{r.heading}</p><ul className="mt-3 space-y-2 text-sm">{r.items.map((x) => <li key={x.slug}><Link href={`/${x.kind}/${x.slug}`}>{x.h1}</Link></li>)}</ul><p className="mt-4 text-sm"><Link href={a.kind === "vs" ? "/vs" : "/guides"}>{a.kind === "vs" ? "All comparisons" : "All guides"}</Link></p></nav>; })()}
    <h2>FAQ</h2>
    {a.faqs.map((f) => <div key={f.q}><h3 className="font-semibold text-navy-900">{f.q}</h3><p>{f.a}</p></div>)}
    {a.kind === "vs" && <p className="text-xs text-slate-500">Competitor details are from their public websites as of October 2026 and may change. Product names are trademarks of their owners; ReviewAsk is not affiliated with them or with Google.</p>}
  </Legal>;
}
