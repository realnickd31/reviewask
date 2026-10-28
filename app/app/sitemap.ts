import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  const b = "https://getreviewask.com";
  return ["", "/for-housecall-pro", "/jobber-google-reviews", "/housecall-pro-google-reviews", "/templates/review-request", "/tools/review-link", "/google-review-software-home-services", "/reviews-for-lawn-care", "/reviews-for-cleaning", "/reviews-for-pressure-washing", "/reviews-for-hvac", "/reviews-for-pool-service", "/reviews-for-pest-control", "/guides", "/pricing", "/signup", "/sms", "/privacy", "/terms"].map((p) => ({ url: b + p, lastModified: new Date("2026-10-27") }));
}
