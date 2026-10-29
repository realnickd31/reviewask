# SEO status — 2026-10-29
Crawl audit (all 38 sitemap URLs): 200, self-canonical, no noindex/X-Robots-Tag, robots.txt only blocks app/private paths. www -> apex 301. Unknown paths 404 correctly. No code blocks found.
Edge issue (not app code): plain http://getreviewask.com/ returns 500 (Render edge, empty body) instead of 301 to https. Check Render custom domain / DNS (Cloudflare "Always Use HTTPS" if proxied).
SC (per Nick): /, /tools/review-link, /guides/how-to-get-more-google-reviews, /for/hvac Indexed; /vs/reviewask-vs-nicejob Discovered-not-indexed -> fixed by adding links from indexed guide + tool to all vs pages.
Shipped: vs GatherUp, Broadly, Jobber Reviews (commits 5831254, 30dae08; deploy dep-dbhduqec6qcc73f5iu70).
Nick to do in SC: resubmit sitemap; URL Inspection -> Request indexing for the 6 /vs/ pages + remaining guides.
