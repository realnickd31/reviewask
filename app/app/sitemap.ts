import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  const b = "https://getreviewask.com";
  return ["", "/for-jobber", "/for-housecall-pro", "/jobber-google-reviews", "/housecall-pro-google-reviews", "/nicejob-alternative", "/podium-alternative", "/birdeye-alternative", "/tools/review-gap", "/templates/review-request", "/tools/review-link", "/google-review-software-home-services", "/reviews-for-lawn-care", "/pricing", "/compare/jobber-marketing-suite", "/signup", "/sms", "/privacy", "/terms"].map((p) => ({ url: b + p, lastModified: new Date("2026-10-27") }));
}
