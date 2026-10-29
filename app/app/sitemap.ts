import type { MetadataRoute } from "next";
import { verticals } from "@/lib/verticals";
import { articles } from "@/lib/articles";
export default function sitemap(): MetadataRoute.Sitemap {
  const b = "https://getreviewask.com";
  return [...["", "/pricing", "/signup", "/tools/review-link", "/sms", "/privacy", "/terms", "/guides", "/vs"], ...articles.map((a) => `/${a.kind}/${a.slug}`), ...verticals.map((v) => `/for/${v.slug}`)].map((p) => ({ url: b + p, lastModified: new Date("2026-10-29") }));
}
