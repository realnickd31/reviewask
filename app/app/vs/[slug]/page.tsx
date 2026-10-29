import { notFound } from "next/navigation";
import ArticlePage, { articleMeta } from "@/components/ArticlePage";
import { articles, getArticle } from "@/lib/articles";
export const dynamicParams = false;
export function generateStaticParams() { return articles.filter((a) => a.kind === "vs").map((a) => ({ slug: a.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) { const a = getArticle("vs", (await params).slug); return a ? articleMeta(a) : {}; }
export default async function Page({ params }: { params: Promise<{ slug: string }> }) { const a = getArticle("vs", (await params).slug); if (!a) notFound(); return <ArticlePage a={a} />; }
