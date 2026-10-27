# ReviewAsk: morning brief (updated ~3:37 AM ET, Tue Oct 27 2026)

**Nothing has been emailed, posted, DMed or submitted.** Everything below is a draft waiting for your approval.

## Metrics
| | |
|---|---|
| Prospects (`gtm/prospects_overnight.csv`) | 750 (249 Hot / 465 Warm / 586 with email) |
| Review-gap audits (`gtm/audits/`) | 113 |
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
