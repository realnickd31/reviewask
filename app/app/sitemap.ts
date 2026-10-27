import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  const b = "https://getreviewask.com";
  return ["", "/for-jobber", "/for-housecall-pro", "/pricing", "/compare/jobber-marketing-suite", "/signup", "/sms", "/privacy", "/terms"].map((p) => ({ url: b + p, lastModified: new Date("2026-10-27") }));
}
