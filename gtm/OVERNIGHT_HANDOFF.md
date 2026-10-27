# ReviewAsk: 60-second morning brief (updated ~5:10 AM ET, Tue Oct 27 2026)

**Nothing has been emailed, posted, DMed, submitted or bought.** Every outreach item is a draft waiting for your OK.

**Overnight wrap status (~5:00 AM ET):** free discovery is used up (paid options in `gtm/PAID_DISCOVERY_OPTIONS.md`). 49 touch-1 + 49 touch-2 drafts are ready and need your OK per send. Jobber demo checklist is ready (`gtm/jobber-listing/DEMO_DAY_CHECKLIST.md`). SMS toll-free verification is still pending, so phone-only asks are Queued.

**Key docs:** `gtm/SEND_DAY_RUNBOOK.md` · `gtm/jobber-listing/DEMO_DAY_CHECKLIST.md` · `gtm/PAID_DISCOVERY_OPTIONS.md` · `gtm/innovation/referral-program-draft.md` · `gtm/innovation/lead-magnet-review-gap-audit.md` · overview: `gtm/OVERNIGHT_DONE.md`

## Metrics
| | |
|---|---|
| Prospects (`gtm/prospects_overnight.csv`) | 819 (259 Hot, 655 with email) |
| Review-gap audits (`gtm/audits/`) | 173 |
| Touch-1 drafts | 49: `day1_email_drafts.md` #1–24 · `day1_email_drafts_batch2.md` #25–43 · `day1_email_drafts_batch3.md` #44–49 |
| Touch-2 drafts (Day 3, same thread) | 49: `day1_email_drafts_touch2.md` · `day1_email_drafts_batch2_touch2.md` · inline in batch3 |
| Community posts | `gtm/community_posts_ready.md` (refreshed ~4:33 AM ET; you post them yourself) |
| SEO pages live | `/guides` + 6 trade guides (lawn care, cleaning, pressure washing, HVAC, pool service, pest control) |

## Approvals needed (in order). Step-by-step: `gtm/SEND_DAY_RUNBOOK.md`
1. **Sending inbox**: the domain or mailbox to send from. Max 30 sends a day.
2. **Physical mailing address** for the footer ([PHYSICAL ADDRESS]) and an **unsubscribe link** ([UNSUBSCRIBE LINK]).
3. **OK for each send**, after a same-morning Maps re-check (every draft's notes have its Maps link).
4. **Community posts**: post them yourself, after reading each group's promotion rules.

## Top 10 to send first (Southeast, week 1, `day1_email_drafts.md`; touch 2 in `day1_email_drafts_touch2.md`)
| Draft # | Business | City | Reviews → leader | Check first |
|---|---|---|---|---|
| 1 | Daystar Exterior Cleaning | Bradenton, FL | 19 → 153 | — |
| 3 | TN Lawnsmiths, LLC | Murfreesboro, TN | 16 → 159 | Mirror count |
| 4 | Bros Mow Landscape, LLC | Brentwood, TN | 17 → 67 | Mirror count |
| 5 | Steve's Scapes | Knoxville, TN | 5 → 48 | — |
| 10 | D&D Lawn Care of Cane Bay | Summerville, SC | 13 → 59 | — |
| 11 | Carolina Lawn Services | Rock Hill, SC | 10 → 134 | — |
| 13 | AmeriGro Landscape Services | Charleston, SC | 8 → 75 | Comp counts from RateXYZ |
| 14 | Green Thumbs Landscape | Prosperity, SC | 8 → 150 | — |
| 15 | Simply SoftWash Exterior Cleaning | Greenville, SC | 9 → 291 | — |
| 2 | Thunder Services LLC | Orlando, FL | 17 → 239 | Count from Exa only |

## Maps re-check warnings
- Counts from a single or self-reported source: Sweep Techs #47, Brandon's #49 (27 vs 33), Junk Heist #46, Thunder #2, Grasshopper #8 (3 reviews), Top Tier #12.
- Greetings to confirm: Ben #44, Jaron #45, Edgar #46 (guessed from the email address), Austin #47, Brandon #49.
- On Hold: Task Tacklers, Stan's, Washburn Bros, 901 cleaning, Mclaughlin's, PoolFix, Honey Do, Battle Buddies, Grow Roots (2-star), JMAS.

## Status (as recorded overnight, not re-checked this morning)
- **Twilio toll-free (877) 629-9694**: verification resubmitted ~12:49 AM ET as Sole Proprietor (Nicholas DAntonio DBA ReviewAsk); status In Progress; account still Trial. Until it's approved, phone-only asks are marked **Queued**, not Sent.
- **Jobber Marketplace app**: In Review since ~11:46 PM ET Oct 26. Next, Jobber emails to schedule a demo. Reviewer test account: jobber-review@getreviewask.com (in the vault). Demo prep: `gtm/jobber-listing/DEMO_DAY_CHECKLIST.md`.
- **Discovery**: the free sources are used up. Options are in `gtm/PAID_DISCOVERY_OPTIONS.md` (nothing bought).
- **Deploys**: Render auto-deploy doesn't fire on push. Use `trigger_deploy` on srv-dbfbc94s728c73epr4bg.

## Live URL checklist (all 200 at ~4:45 AM ET; /quick and /dashboard redirect 307 to /login)
`/` · `/pricing` · `/signup` · `/login` (and `/dashboard` sends you to it) · `/sms` · `/for-jobber` · `/for-housecall-pro` · `/guides` · `/tools/review-gap` · `/tools/review-link` · `/templates/review-request` · `/reviews-for-lawn-care` · `/reviews-for-cleaning` · `/reviews-for-pressure-washing` · `/reviews-for-hvac` · `/reviews-for-pool-service` · `/reviews-for-pest-control`

---
# Overnight log (oldest first)

## Live site QA (~3:27 AM ET): all 15 URLs return 200
https://getreviewask.com: `/`, `/pricing`, `/for-jobber`, `/for-housecall-pro`, `/tools/review-gap`, `/birdeye-alternative`, `/podium-alternative`, `/nicejob-alternative`, `/compare/jobber-marketing-suite`, `/sms`, `/terms`, `/privacy`, `/signup`, `/login`, `/sitemap.xml`
- Pricing page shows $39/mo or $390/yr, a 7-day trial, and "card required at checkout". The SMS page says SMS is "rolling out". No copy bugs found.

## ~3:33 AM ET updates
- **Spreadsheet upload verified in code:** the dashboard BulkUpload component (paste from Excel/Sheets or CSV) posts to `/api/requests/bulk`. Rows are validated and the 200-a-month quota applies. The touch-2 copy now says "email them", because phone-only rows need SMS, which is still rolling out.
- **Homepage hero:** the eyebrow now reads "For Jobber & Housecall Pro businesses · $39/mo", and there's a secondary link under the CTAs to the free /tools/review-gap calculator (experiment #1 plus a light version of #3 from conversion-experiments.md). Deployed.

## ~3:37 AM ET updates
- **/pricing:** added a price comparison table, checked Oct 27, 2026: ReviewAsk $39/mo, Jobber Marketing Suite $99/mo add-on, NiceJob $75 Starter / $125 Pro, Podium priced by sales quote. Deployed (d9cbe46).
- **SEO pages:** /jobber-google-reviews and /housecall-pro-google-reviews were already live, in the footer and in the sitemap. /jobber-marketing-suite-alternative already 308-redirects to /compare/jobber-marketing-suite. No new pages were needed.
- **7 more audits (113 total):** section AA in outreach_ready_top25.md. New flags: Byrd's (4.4 rating, pitch rating recovery), Macon's (leader count from a weaker source). I skipped Honey Do Spring Hill (it's a franchise and its count conflicts: 3, 75 or 91).

## ~3:42 AM ET updates
- **New page live:** https://getreviewask.com/templates/review-request has 10 copy-paste text and email review-request templates for any field-service business, Google policy rules, a soft trial CTA and a link to the review gap calculator. It's in the footer Guides and the sitemap. Deployed (00a790c) and checked 200.
- **QA:** /pricing still shows the price table. /housecall-pro-google-reviews and /jobber-google-reviews return 200.
- **8 more audits (121 total):** section AB in outreach_ready_top25.md. Flags: J & K's and THE ART OF LAWN CARE share a market and comparison set, so stagger the sends. Sunrise Air's gap is very large (Lakeland HVAC), so pitch saving time. Applewood has only one comparable competitor.

## ~3:46 AM ET updates
- **Backlog callout (experiment #9):** a new "Ask last season's Jobber customers" box on /for-jobber. It covers exporting from Jobber, pasting or uploading the list, email asks with a day-3 follow-up, SMS rolling out, and the 200-a-month limit. It links to the trial and the templates page. The homepage backlog box (already live) now says "email" and "up to 200 a month" and links the templates. Deployed (b3d0a50).
- **New tool live:** https://getreviewask.com/tools/review-link. It turns a Place ID into a direct Google review link in the browser, with no signup, and has a soft CTA. It's in the footer Guides and the sitemap.
- **QA:** /tools/review-link, /for-jobber, /templates/review-request, /, /pricing and /housecall-pro-google-reviews all return 200. Both backlog boxes and the "See message templates" link show on the live pages.
- **7 more audits (128 total):** section AC. Flags: Duplechain HVAC (huge Huntsville gap, pitch saving time), Tri-Star (4.4 rating), Johnson's Tree (own count 14 vs 17). I skipped Little Pickle HVAC because I only found weak competitor sources.

## ~3:49 AM ET updates
- **New page live:** https://getreviewask.com/google-review-software-home-services. It's a category page for any home or field-service business: what to look for, an honest dated comparison (Marketing Suite $99, NiceJob $75/$125, Podium and Birdeye quoted) with "best when" for each, how ReviewAsk works (email now, SMS rolling out), and links to the gap tool, link tool, templates, /for-jobber and /for-housecall-pro. It's in the footer and sitemap. Deployed 1e993e8 and checked 200.
- **QA:** /tools/review-link, /templates/review-request and /for-jobber (backlog box present) all return 200.
- **8 more audits (136 total):** section AD. Flags: GRANDSCAPE shares the Palm Bay market with Byrd's, so stagger. Most of this batch have very few reviews (1–11), so the backlog upload is the main pitch. Atta Boy's count (Elizabethton) includes its Christmas-light business. Graceful Touch (Wake Forest) comes from a search summary only.

## Update 3:53 AM ET
- Shipped: a founder note on the homepage (#founder) with a 10-minute setup-help offer by email (support@getreviewask.com). No Calendly link. Deploy dep-dbg5fll9el5s73bvbd50 on commit 008d43c is live.
- The footer Guides links were already complete.
- Audits: 143 total (+7, section AE). These are outside the Southeast because the Southeast Hot leads with clean comps are used up.
- Flags: the Battle Buddies 1-star review should not be mentioned. Sierra Tree has only 2 comps. TLC Marion was skipped (its only comp is a count the company reports itself).

## Update 3:56 AM ET
- Homepage CTA (#5) is live: the primary button reads "Connect Jobber — free for 7 days" and the secondary reads "Using Housecall Pro? Start free trial". Both go to /signup. Deploy dep-dbg5hesipgvc73ej6r5g on commit dffa24d.
- Audits: 149 total (+6, section AF: Visalia, Edmonds, Katy, Smithville OH, Linton Hall VA, Richmond VA). No discovery this round.
- Flags: JMAS Texas (verify whether JMAS Landscaping is a related listing). Addicott is at 4.5 (pitch rating recovery). For Epps and Iggys, the own counts come from the CSV only. Battle Buddies is held for Nick's OK. Skipped: Cleanadora (1 clean comp), NKY Lawn Pros (conflicting counts), Electric Force (no Google comps), Parsons (own count is from its Jobber site, not Google), Chrispy Clean Bins and Albany Bed Bug (comps are franchise, national or non-Google only).

## Update 4:00 AM ET
- Discovery: +27 new Jobber Sites prospects with public email, from search-engine site:jobbersites.com queries (not the old scrape). 8 are scored Hot (85, provisional) and 19 Warm (80). Google counts are mostly unverified.
- Totals: 777 prospects, 257 Hot, 613 with email, 155 audits.
- Audits AG (+6): Pristine Lawn (Gadsden AL), Lawn Wolf (Sioux Falls), Precision Handyman (Noblesville), Handy Crow (Arlington TX), Pain In The Grass (Huntertown IN), Call The Cavalry (Richmond VA).
- Flags: Under Pressure (Clermont) and Top to Bottom (Wilmington) were not audited because of conflicting or self-reported counts (both are already ~150–190). Don't send Call The Cavalry and Iggys on the same day (same comps). No site change this round.

## Update 4:02 AM ET
- Enrichment of the 27 new Jobber Sites leads: 3 are Hot after rescore (Green Thumb 10 reviews/4.9, WayUp 30/5.0, Pristine Lawn, already audited). Shinehaus and Lumen were moved down for conflicting counts, Under Pressure and Top to Bottom for already leading locally. Dunlap (3.9) and Legendary (1.0) are flagged for low ratings. Station 35 has 0 reviews (backlog pitch). Locations fixed: Primary Services is Roswell GA, AB Handyman is Glade Hill VA, Tri City Pool is Riverside CA, RPG is Orlando (conflicts with Winter Springs).
- Audits AH (+5): Pressure Wash Improvements (Charleston WV), EES (Bush LA), Dogwood (Sherwood AR), Texas Finest (Crosby TX), Green Ranger (Hampton VA).
- Totals: 777 prospects, 252 Hot, 613 with email, 160 audits. CTA QA passed.

## Update 4:06 AM ET
- Site (live, deploy dep-dbg5lpd9el5s73bvrmqg, commit 0d72a55): the signup bullets now say "200 requests/month, sent by email (SMS rolling out)" and "No contract · cancel before day 7 and pay nothing". The pricing card line adds the email-first, SMS-rolling-out note. The homepage hero links the review link generator and message templates as more free tools.
- Discovery (new angle: business websites whose privacy/terms pages or quote portals mention Jobber, plus Nextdoor Client Hub links): +12 rows, all with email. None scored Hot. Riptide (188), Pearce's (125+) and Giant/Shiny (53–55) are already strong. The rest are unverified.
- Audits AI (+4): My Service Heroes (Conroe), Perennial Lawn (Parker CO), Tactical Landscape (Virginia Beach), Mikes Lawn Care (Louisville, 4.1 rating flag).
- Totals: 789 prospects, 252 Hot, 625 with email, 164 audits.

## Batch AJ (~4:09 AM ET)
- Shipped consent/CAN-SPAM FAQ (commit d581888, deploy dep-dbg5ni4s728c73dfab0g live; key URLs 200). Link/meta/sitemap/robots scan clean; SMS copy already aligned.
- AJ audits: iMow Lawns (Houston), Grow Roots (Katy), PV Repair & Cleaning (Naples). 167 audits total.
- No discovery. Totals: 789 prospects, 252 Hot, 625 w/ email.
- Flags: Grow Roots has a 2-star review (don't mention); iMow gap inflated (big metro); PV own count varies by source. Hot-with-clean-comps pipeline nearly exhausted (45 Hot+email unaudited, mostly flagged/weak comps/<5 reviews).

## Batch AK (~4:17 AM ET)
- Day-1 expansion: 19 new touch-1 DRAFTS in gtm/day1_email_drafts_batch2.md (#25–43); table in outreach_ready_top25.md section AK. 4 soft-pitch (Johnson's Tree, Galloway, Iggys, Epps: conflicting own counts). Willow Creek = week 2 (Murfreesboro overlap). Nothing sent.
- Product: dashboard first-run 3-step guide (connect Jobber/HCP, send first ask to yourself, optional spreadsheet backlog; email now, SMS rolling out). Commit b4c3aff, deploy dep-dbg5pics728c73dffrvg live; public URLs 200, /dashboard 307 to login.
- No audits: no clean-comp Hot leads remain. Totals: 789 prospects, 252 Hot, 625 w/ email, 167 audits, 43 Day-1 drafts.
- Sending still needs Nick's inbox + physical address + per-send OK.

## Batch AL (~4:27 AM ET)
- Touch-2: 19 Day-3 reply-in-thread DRAFTS in gtm/day1_email_drafts_batch2_touch2.md (name+city only, no numbers, email-first backlog, SMS rolling out). Fixed Gilileo's touch-1 opener (now 'just ahead of Made In The Shade (45)').
- Discovery (HCP booking pages + Nextdoor/Exa Jobber Client Hub angle): +13 deduped leads, +2 Hot (Landscaping And Moore, Wayne PA, 36 @5.0; Straight Line Seamless Gutter, Negaunee MI, 8 @5.0). Rest Warm/low: 9 have unverified/conflicting counts or Birdeye/Thumbtack-only, 2 low rating (Cannons 4.0, Floreks 3.8).
- No audits: new Hot comps not checked yet.
- Data-only, no deploy. QA: marketing URLs 200, /dashboard 307 to login.
- Totals: 802 prospects, 254 Hot, 638 w/ email, 167 audits, 43 touch-1 + 43 touch-2 drafts. Sending still needs Nick's inbox + physical address + per-send OK.

## Batch AM (~4:38 AM ET)
- Audit AL: Landscaping And Moore (Wayne PA) 36 @5.0; comps Naturescapes (Paoli) 91, Suburban Lawn (Wayne) 28; leader gap 55; ~27 asks/mo [SPEC]. Straight Line Gutter SKIPPED (own count 8/11/17 conflicts; local comps 6–8). No other Hot with clean comps.
- Draft: gtm/day1_email_drafts_batch3.md #44 (touch 1 + touch 2) for Landscaping And Moore; greeting 'Ben' from reviews, confirm before sending.
- Discovery (Mountain West/Midwest/Northeast; chimney, junk, window, irrigation, HVAC, detailing): +8 deduped, +3 Hot (JHansen Cleaning Orem UT 14 @5.0; Junk Heist Goodyear AZ 55 @5.0; Sweep Techs Rochester MN 27 @4.8 from own reviews page). 5 Warm with unverified counts.
- community_posts_ready.md refreshed: prices unchanged live; added HCP support, free tools URLs, founder note.
- Data-only, no deploy. QA: 13 URLs 200, /dashboard 307 to login.
- Totals: 810 prospects, 257 Hot, 646 w/ email, 168 audits, 44 touch-1 + 44 touch-2 drafts. Sending still needs Nick's inbox + physical address + per-send OK.

## Batch AN (~4:52 AM ET)
- Audits AM (3): JHansen Cleaning (Orem UT) 14 @5.0, comps Mountain Window 190 / Good Neighbor 76 / Window Works 68, leader gap 176. Junk Heist (Goodyear AZ) 55 @5.0 confirmed in lpraudit GBP table; independents 972/356/299 so gap inflated, soft pitch with near peers (Desert Junk 66, Junk Departure 85). Sweep Techs (Rochester MN) 27 @4.8 (own-site Google summary), comp Dano's 81; single comp.
- Drafts #45-47 (touch 1 + 2) in gtm/day1_email_drafts_batch3.md. Greetings Jaron/Edgar/Austin; Edgar is inferred from the email only.
- Site: new /reviews-for-lawn-care guide (any-trade note, links to free tools), plus sitemap and footer. Commit 550c022, deploy dep-dbg5uh2vcj2c73b98d90 live, 200.
- Discovery: +6 deduped (Rapha Plumbing Bertram TX 19 @5.0 Hot; Brayden's 63-84 conflict; Ecoscape low rating; A1Repairman unverified; Bob's Garage 379 and Ross HVAC 352-404 already leaders). Below the +15 target; Nextdoor/HCP angle is producing many dupes now.
- Totals: 816 prospects, 258 Hot, 652 w/ email, 171 audits, 47 touch-1 + 47 touch-2 drafts. Sending still needs Nick's inbox + physical address + per-send OK.

## Batch AO (~5:02 AM ET)
- Site: /reviews-for-cleaning live (mirrors lawn-care guide; any-trade note; cross-link). Footer + sitemap. Commit c934362, deploy dep-dbg605gm7kps73bgu8k0, 200.
- Audit AN: Rapha Plumbing (Bertram TX) 19 @5.0; comps Tanker's 119, Complete Care 81 (Marble Falls), TNT 36 (Bertram); leader gap 100; ~67 asks/mo [SPEC]. Draft #48 touch 1+2 in batch3.
- Discovery (jobbersites in OR/WA/NM/WI/IA/ME): +3 only (Brandon's All Around The House, Forest Grove OR, 27 @5.0 Hot, yahoo email; Thayer & Son's, Stuart IA, 22+ self-reported, Warm; C.J.'s Outdoor, Greenfield WI, unverified). NM/ME/WA searches gave no Jobber/HCP leads with email. Skipped Jam Mechanical, Wick's, Gray's (no Jobber/HCP signal).
- Totals: 819 prospects, 259 Hot, 655 w/ email, 172 audits, 48 touch-1 + 48 touch-2 drafts. Sending still needs Nick's inbox + physical address + per-send OK.

## Batch AP (~5:12 AM ET)
- Site: /reviews-for-pressure-washing and /reviews-for-hvac live (HVAC chosen over pool as broader). All 4 trade pages cross-link ('More guides'), and all are in the footer and sitemap. Commit 4ffe5d0, deploy dep-dbg61u142hec73dn7ee0, 200.
- SMS copy check: /sms still says rolling out; no in-app copy claims SMS is live.
- Audit AO: Brandon's (Forest Grove OR) 27 (lower of 27/33) vs Aloha Pressure Washing, Hillsboro, 138 (lower of 138/151). Single comp, soft pitch. Draft #49 touch 1+2 in batch3.
- Discovery: skipped (no easy angle).
- Morning brief header, metrics and approvals refreshed.
- Totals: 819 prospects, 259 Hot, 655 w/ email, 173 audits, 49 touch-1 + 49 touch-2 drafts.

## Batch AQ (~5:18 AM ET)
- Site: /reviews-for-pool-service, /reviews-for-pest-control and a /guides index (free tools, 6 trade guides, Jobber/HCP and comparison pages). All 6 guides cross-link and link to /guides. The footer now has one 'All guides' link instead of the trade list.
- Meta: each trade page and /guides now sets its own og:title/description/url and twitter title (they were inheriting the homepage title). Shared OG image unchanged.
- Commit e24488e, deploy dep-dbg63ql9el5s73c12s6g; all new URLs 200; sitemap has 7 guide URLs.
- GTM: gtm/PAID_DISCOVERY_OPTIONS.md, 5 sources with effort notes. No purchases, no prices quoted.
- No audits or discovery. Totals unchanged: 819 prospects, 259 Hot, 655 w/ email, 173 audits, 49+49 drafts.

## Batch ~4:45 AM ET
- Product (c7f20df, dep-dbg65oijnfac73fd3ifg, live 4:39 AM ET): while Twilio isn't sending, phone-only asks are marked Queued (sms_pending) instead of Sent, with an honest message in Quick ask and Send. Quick ask is now email-first: "Email sends right away. Text messages are rolling out."
- Rewrote the brief at the top of this file. Twilio and Jobber statuses come from the overnight records.
- QA: 19 URLs return 200. /quick and /dashboard redirect 307 to /login. Nothing sent.

## Batch ~4:50 AM ET
- Site (ee3559f, dep-dbg68uh42hec73dnr2fg, live): the 4 compare pages now link to /guides. The Jobber Marketing Suite page gets a "How asks go out" row (Email today; SMS rolling out) and dates the $99 price to October 2026. Everything else checked matched ($39, the review-gap link, "choose them if…" honesty), so no other changes.
- Dashboard: the Queued chip has a tooltip and a note under History explaining phone-only asks.
- Grep found no leftover "SMS is live" copy.
- Lead magnet: `gtm/innovation/lead-magnet-review-gap-audit.md` has a 5-minute fill-in template (DRAFT).
- QA: 15 of 15 URLs return 200 (compare pages, /guides, /sms, 6 trade pages, home, pricing, review-gap). /dashboard redirects 307 to /login. Nothing sent.

## Batch ~5:00 AM ET
- Docs: `gtm/jobber-listing/DEMO_DAY_CHECKLIST.md`, the plan for the morning Jobber emails (prep, 10-min script, what works, what to say about SMS, limits, likely questions). No secrets in it. Nothing submitted, and Jobber not contacted.
- Site (171dc83, dep-dbg6b129lscs73960fk0, live): added a "Skip to content" link and `id="main"` landmarks on every page. The 7 review-gap calculator inputs now have labels tied to them. Review-link input already labeled. No `<img>` tags to lazy-load. The trust lines on /pricing and /signup already name Jobber + HCP.
- QA: 20 of 20 URLs return 200. Nothing sent.

## Batch ~5:00 AM ET (2)
- Referral: `gtm/innovation/referral-program-draft.md` is now an ops brief (offer, eligibility, manual Stripe-credit steps, abuse notes, DRAFT copy, 5 OKs needed). No code and no Stripe coupons or credits.
- Site (c706c41, dep-dbg6cpom7kps73bi1kq0, live): a friendly 404 with links to home, pricing, /guides and the review-gap tool, plus noindex. Sitemap already lists all 25 public pages. Login and signup trial/SMS wording already matches.
- QA: 28 of 28 return 200 on two clean rounds. There were brief 502s on 10 URLs right as the deploy switched over; they cleared within ~1 min. /dashboard, /quick and /settings redirect 307 to login. Nothing sent.

## Batch ~5:05 AM ET
- `gtm/SEND_DAY_RUNBOOK.md`: first-morning send checklist (prerequisites, 20–30/day cap, per-send checks, day-3 rule, log columns, file map). Linked from the brief.
- Needs Nick's input: /terms names no legal entity. Not edited.
- No code change and no deploy. The only TODO is a Jobber field-name check in `app/lib/jobber.ts`; it's not an overnight-safe change. QA: home, /guides and /sms return 200; unknown URLs return 404 with the friendly page. Nothing sent.

## Batch ~5:10 AM ET (wrap)
- Metrics re-counted from the files: 819 prospects, 259 Hot, 655 with email, 173 audits, 24+19+6 touch-1 and 24+19+6 touch-2. All match. Added the key-docs line to the brief and wrote `gtm/OVERNIGHT_DONE.md`.
- Live: /, /guides, /sms and /pricing return 200, and the SMS wording reads "rolling out". Every footer and /guides link returns 200. No code change. Nothing sent.
