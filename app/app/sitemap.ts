import type { MetadataRoute } from "next";
import { verticals } from "@/lib/verticals";
export default function sitemap(): MetadataRoute.Sitemap {
  const b = "https://getreviewask.com";
  return [...["", "/pricing", "/signup", "/sms", "/privacy", "/terms"], ...verticals.map((v) => `/for/${v.slug}`)].map((p) => ({ url: b + p, lastModified: new Date("2026-10-28") }));
}
