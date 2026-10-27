# Overnight GTM build — Oct 27, 2026 (nothing sent to anyone)

| Artifact | What |
|---|---|
| icp-and-scoring.md | ICP, intent signals, disqualifiers, 0–100 rubric |
| lead-sources-playbook.md | Jobber-user discovery (Coldlytics tech-detect, search operators, Nextdoor, Marketplace, community, Reddit, LinkedIn), review-gap method, displacement; compliance |
| prospects_overnight.csv | **451 rows** (US only, deduped vs day1). 355 Jobber-confirmed publicly, 45 "maybe" (directory-only). 310 with public email. 149 Southeast. 104 Hot (≥85), 316 Warm (70–84). Rows 165–257 = Coldlytics expansion (+93, Jobber client-hub link on own site). Rows 258+ = Nextdoor pass (+71, Jobber client-hub link on their Nextdoor business page; 24 Southeast; 65 with email, of which 57 come from their Nextdoor listing rather than a website; review counts enriched for 33 via web mirrors → 18 newly Hot; 32 [BLOCKED], 6 not checked (no email)). Rows 329–400 are the Jobber Sites pass: +72 businesses whose website is a *.jobbersites.com site (38 Southeast, 68 with email from their own site). Review counts are unknown, so these score Warm at most (82 maximum) and none are Hot. Aristocrat Detailing was rescored to 81 Warm (141 reviews) and 1 Stop Roofing to 86 (51 reviews). |
| community_posts_ready.md | 3 value-first posts (Jobber Community, Facebook, Reddit), placeholder claims removed |
| pitch-vs-jobber-marketing-suite.md | One-pager, short email, DM, LinkedIn note, objections |
| outreach-sequences.md | 3-touch email (Jobber / review-gap / displacement) + 2-touch DMs |
| outreach_email.md, dm_scripts.md | Refreshed to current product (7-day trial, $39, Jobber+HCP, email now/SMS rolling out). Old versions: *.v1.bak.md |
| growth-system.md | 14-day channel plan, targets, approvals, innovation ideas |

## Data caveats
- Review counts/ratings/owner names come from the Coldlytics public directory (profiles show "last updated" dates, some from early 2026) — **re-check the Google Maps count before each email**.
- Competitor review gap was **not** checked per row tonight; column says so.
- Emails are only mailto: addresses on the business's own site or public Nextdoor/LinkedIn pages. Nothing invented.

- Review-gap audits: **25** (10 new on 2026-10-27: Higgins, Scoop Lab, Roof Ninja, 1 Stop, Plumbing Pro SC, Kearney's, Champagne Valley, Call Chad, South Heat, Hercs Works). Their openers were pushed into outreach_ready_top25.md.

- Jobber Sites enrichment (2026-10-27, ~2:30 AM ET): searched 48 of the 72 Jobber Sites rows (all 36 Southeast rows plus 12 others). 23 got review counts from mirrors (ServiceAgent, Birdeye, ProsGrade, wanderboat, Exa, contractorsranked, own sites). 11 became newly Hot (section J in outreach_ready_top25.md). Southern Brass turned out to be a hardware supplier and was dropped to 55. Handyman Can Help and Don's Tree already use NiceJob and scored down. 49 rows are still [BLOCKED]: 24 were not searched and 25 had no Google count, or only Thumbtack/HomeAdvisor/Yelp counts.

- Jobber Sites pass 2 (2026-10-27, ~2:40 AM ET): searched the remaining 24 unsearched rows, so all 72 have now been searched. 12 got counts and 3 became Hot with email (section K). Texas Lonestar is also Hot (1 review) but has no email. 12 were marked [BLOCKED] with a reason. 34 of the 72 Jobber Sites rows now have counts, and 38 are [BLOCKED] with a reason.

- Review-gap audits: **33** (8 more on 2026-10-27, ~2:30 AM ET: SBR Cleaning, Cleaned Pristine, Boone Landscape, R&B Sparkly Clean, Ground Effects, GreenLeaf, Here to Help Window Cleaning, Zack Of All Trades). Their openers were pushed into outreach_ready_top25.md and the CSV. Beantown Mechanical was skipped (2.3 rating). Christmas Lights of Texas was skipped (only 3 reviews, thin source).
- Site: new SEO page https://getreviewask.com/podium-alternative, added to the footer Guides column and the sitemap.

- Jobber Sites pass 3 (2026-10-27, ~2:25 AM ET): +51 new rows (rows 401–451), found with Southeast-focused searches of jobbersites.com. 46 are Southeast and 49 have email from their own site. Review counts were not looked up, so all are [BLOCKED] and Warm (82 maximum). Next step: enrich them from mirrors to surface Hot leads.
- Site: added https://getreviewask.com/birdeye-alternative (FAQ JSON-LD, footer, sitemap) and a "Check your review gap" callout on /for-jobber.
