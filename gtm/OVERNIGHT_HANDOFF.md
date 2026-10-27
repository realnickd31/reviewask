# ReviewAsk: morning brief (updated ~3:49 AM ET, Tue Oct 27 2026)

**Nothing has been emailed, posted, DMed or submitted.** Everything below is a draft waiting for your approval.

## Metrics
| | |
|---|---|
| Prospects (`gtm/prospects_overnight.csv`) | 750 (249 Hot / 465 Warm / 586 with email) |
| Review-gap audits (`gtm/audits/`) | 136 |
| Day-1 queue (`gtm/outreach_ready_top25.md`, "Day-1 send queue") | 24 ready, 8 on hold |
| Day-1 email drafts (`gtm/day1_email_drafts.md`) | 24 touch-1, DRAFT ONLY |
| Day-1 touch-2 drafts (`gtm/day1_email_drafts_touch2.md`) | 24, DRAFT ONLY (Day 3, same thread) |
| Community posts (`gtm/community_posts_ready.md`) | Refreshed to current product facts, plus 2 Jobber Community answers |

## Approvals needed from Nick
1. **Sending inbox** (domain or mailbox to send from)
2. **Physical address** for the CAN-SPAM footer (fills [PHYSICAL ADDRESS]) and an unsubscribe mechanism ([UNSUBSCRIBE LINK])
3. **OK for each send**: re-check each lead on Maps first (the notes in each draft have the link)
4. **Community posts**: you post them yourself, after reading each group's promotion rules

## Blockers and flags
- Lead discovery channels are mostly used up; new leads now need paid or manual sources.
- Keep flagged: Task Tacklers, Stan's (closed), Washburn Bros (category needs confirming), 901 cleaning (Nextdoor count), Mclaughlin’s (aggregator-only competitor counts), PoolFix (conflicting count, already #1).
- Render auto-deploy doesn't fire on push. Deploy with the Render API `trigger_deploy` on service srv-dbfbc94s728c73epr4bg.

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
