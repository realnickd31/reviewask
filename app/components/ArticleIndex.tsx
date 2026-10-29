import Link from "next/link";
import type { Metadata } from "next";
import Legal from "./Legal";
import { articles, type Article } from "@/lib/articles";
import { OG_IMAGES } from "@/lib/og";
export function indexMeta(kind: Article["kind"], title: string, description: string): Metadata {
  const url = `/${kind}`;
  return { title: { absolute: title }, description, alternates: { canonical: url },
    openGraph: { type: "website", siteName: "ReviewAsk", url, title, description, images: OG_IMAGES },
    twitter: { card: "summary_large_image", title, description, images: OG_IMAGES.map((i) => i.url) } };
}
export default function ArticleIndex({ kind, h1, intro }: { kind: Article["kind"]; h1: string; intro: string }) {
  const list = articles.filter((a) => a.kind === kind);
  return <Legal title={h1}>
    <p className="text-lg">{intro}</p>
    <ul className="space-y-5">{list.map((a) => <li key={a.slug}><Link href={`/${a.kind}/${a.slug}`} className="text-lg font-semibold underline underline-offset-4">{a.h1}</Link><p className="mt-1 text-sm">{a.description}</p></li>)}</ul>
    <div className="mt-8 rounded-xl bg-slate-50 p-6"><p className="font-semibold text-navy-900">Ask every customer, without remembering to</p><p className="mt-1 text-sm">ReviewAsk emails each customer a one-tap Google review link with one follow-up. $39/month, 7-day free trial, no contract.</p><div className="mt-4 flex flex-wrap gap-3"><Link href="/signup" className="btn-navy px-5 py-2.5 !text-white no-underline">Start free trial</Link><Link href="/tools/review-link" className="px-2 py-2.5 text-sm underline underline-offset-4">Get your review link free</Link></div></div>
  </Legal>;
}
