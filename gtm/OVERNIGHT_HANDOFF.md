# ReviewAsk morning brief: Tue Oct 27, 2026 (updated ~3:00 AM ET)

**Nothing was emailed, posted, DMed or submitted to any prospect or community overnight.** The review counts below come from web mirror sites and the Google widgets on Jobber Sites pages, not from Google Maps directly. Re-check Maps before every send.

## Top metrics
| | Count |
|---|---|
| Prospects (`gtm/prospects_overnight.csv`) | **737** (all US, deduped against day 1) |
| Hot (score 85+) | **247** |
| Warm (70–84) | **454** |
| With public email | **578** |
| Review-gap audits (`gtm/audits/`) | **86** |
| Outreach-ready sections (`gtm/outreach_ready_top25.md`) | Top 25 + sections J–W + Day-1 send queue |

Overnight adds: +286 Jobber Sites rows (passes 4–9), 115 newly Hot with email (sections M–W) and 53 new audits. Product facts used everywhere: $39/mo or $390/yr, 7-day trial with card required, email live, SMS rolling out, works with any Jobber plan (Housecall Pro is in early access).

## Day-1 approvals still needed
1. **Sending inbox and domain for cold email.** support@getreviewask.com needs a mailbox; GoDaddy Email Essentials was the option under consideration. A separate sending subdomain or inbox is recommended.
2. **Physical mailing address for the CAN-SPAM footer.** Cold email can't go out without one.
3. **Approve the first 25 sends** from `outreach_ready_top25.md`. Re-check each one's Google Maps count first, and keep to about 30 a day while the domain is new.
4. **Approve the community posts** in `community_posts_ready.md`, posted from your own accounts after checking each group's rules.

## Blockers
- **Twilio toll-free number +1 877 629 9694.** The verification was rejected, then resubmitted Oct 27 at ~12:49 AM ET as Sole Proprietor "Nicholas DAntonio DBA ReviewAsk". Status is In Progress, with a 3–5 day estimate. The account is still on the Trial plan; upgrading requires an ID check plus card and tax details. Review requests go out by email until this clears.
- **Jobber app review.** The app has been "In Review" since Oct 26 at ~11:46 PM ET. Next, Jobber emails the Developer Center account to schedule a demo. The reviewer test account exists (jobber-review@getreviewask.com, saved in the vault). Draft apps are capped at 5 connected accounts until approval.
- **Render auto-deploy.** Pushes to GitHub `main` don't seem to deploy on their own, so every deploy tonight was triggered through the API. To fix it, turn on Auto-Deploy in the Render dashboard for srv-dbfbc94s728c73epr4bg (one click).
- **Legal entity.** Twilio was filed under your own name as a sole proprietor because there is no EIN. Decide whether ReviewAsk stays a sole proprietorship or moves to an LLC/EIN, then make Terms/Privacy, Stripe, and Twilio match.
- **Cleanup:** a stray `TWILIO_AUTH_TOKEN_B64` env var may still be on Render; worth deleting.

## Live pages (checked 200)
- Home: https://getreviewask.com/ · Pricing: https://getreviewask.com/pricing
- **Review gap calculator:** https://getreviewask.com/tools/review-gap. It runs in the browser and captures nothing. Linked from the home page, /for-jobber and the footer.
- Competitor alternatives: https://getreviewask.com/birdeye-alternative · https://getreviewask.com/podium-alternative · https://getreviewask.com/nicejob-alternative · https://getreviewask.com/compare/jobber-marketing-suite
- Integrations and guides: https://getreviewask.com/for-jobber · https://getreviewask.com/for-housecall-pro · https://getreviewask.com/jobber-google-reviews · https://getreviewask.com/housecall-pro-google-reviews
- Other: /sms · /terms · /privacy · /sitemap.xml

## Known data flags (verify before sending)
- Held out for low ratings: Paradise Pools (1.0 from 2) and Downtown Pools (3.9, with complaints).
- Disqualified for high review counts: Pressure Wash Carolina (634). PoolFix (~150) leads its market, so it has no gap pitch.
- Odd email domains: Coastal Handymen (stayheresav.org) and PV Repair (naplespremierpaversprotection.com).
- Weak sources: J&K's Precision (name match only), Tactical Landscape and Georgia Softwash (directory counts).
- Many Jobber Sites rows are still [BLOCKED] because only Yelp, Thumbtack or HomeAdvisor counts exist. They score 82 (Warm).

## Where things are
`gtm/outreach_ready_top25.md` (who to send to first) · `gtm/audits/review-gap-audits.md` (gap math with the 15% [SPEC] response rate) · `gtm/community_posts_ready.md` · `gtm/outreach-sequences.md` · `gtm/icp-and-scoring.md` · `gtm/SUMMARY.md` (full log)
