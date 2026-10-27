# ReviewAsk overnight handoff, Tue Oct 27, 2026

Nothing was sent, posted, or submitted to any prospect or community. Sources for this brief: `SUMMARY.md`, `git log`, curl checks of the live site (~2:05 AM ET), and the notes kept from last night's sessions.

## 1. Website: shipped and live
Every URL below returned HTTP 200 at ~2:05 AM ET:
- https://getreviewask.com/ (homepage now includes the "ask last season's customers" section and SoftwareApplication JSON-LD at $39/$390)
- https://getreviewask.com/pricing
- https://getreviewask.com/for-jobber · https://getreviewask.com/for-housecall-pro
- https://getreviewask.com/jobber-google-reviews · https://getreviewask.com/housecall-pro-google-reviews
- https://getreviewask.com/compare/jobber-marketing-suite · https://getreviewask.com/nicejob-alternative
- https://getreviewask.com/sms · /terms · /privacy · /login · /sitemap.xml

Latest site commits: `b507d0e` adds a separate Guides column to the footer (deployed via the Render API, live at 1:45 AM ET); `a56aaa5` is the homepage backlog section; `5bbd75c` added /nicejob-alternative, the HCP guide, and the sticky mobile CTA.

## 2. Marketing assets and prospects (all in `gtm/`)
- **`prospects_overnight.csv`: 451 rows**, all US, with duplicates against day 1 removed.
  - 283 show Jobber publicly; 45 are "maybe", meaning only a tech-detection directory says they use Jobber.
  - **310 have a public email.** 149 are in the Southeast. Rows 329–400 are Jobber Sites businesses. All 72 have been searched. 34 have review counts from mirrors, which made 15 Hot (14 with email, in sections J and K). 38 are [BLOCKED] with a reason given.
  - **128 are Hot (score 85+) and 292 are Warm (70–84).** Rows 401–451 are 51 Jobber Sites businesses, all searched: 27 have counts (22 newly Hot with email, in section L) and 24 are [BLOCKED]. Aristocrat Detailing was rescored to Warm.
  - Rows 258 onward came from Nextdoor (71 rows). 57 of those emails come from the business's own Nextdoor listing, not a website.
  - Review counts for the new rows come from web mirror sites, not Google Maps. Re-check Maps before every send.
- **`outreach_ready_top25.md`**: the top 25 Hot leads with audited review gaps, plus three appended sections of newly Hot leads that have email (12 + 10 + 8). 10 of them now carry openers from the review-gap audits.
- **`audits/review-gap-audits.md/.csv`: 33 audits** (15 earlier, then 10 and 8 more on 2026-10-27).
- **New pages:** https://getreviewask.com/birdeye-alternative (Birdeye shows no list price), a review-gap callout on /for-jobber, and https://getreviewask.com/podium-alternative (Podium pricing is sales-quoted, so the page says that rather than quoting a number).
- **`community_posts_ready.md`**: three ready-to-paste posts for the Jobber Community, Facebook groups, and Reddit, with no invented claims.
- Also ready: `pitch-vs-jobber-marketing-suite.md`, `outreach-sequences.md`, `outreach_email.md`, `dm_scripts.md`, `growth-system.md`, `lead-sources-playbook.md`, `icp-and-scoring.md`.

## 3. Day-1 actions that need your OK
1. **Sending inbox and domain for cold email.** support@getreviewask.com needs a mailbox; GoDaddy Email Essentials was the option under consideration. A separate sending subdomain or inbox is recommended.
2. **Physical mailing address for the CAN-SPAM footer.** Cold email can't go out without one.
3. **Approve the first 25 sends** from `outreach_ready_top25.md`. Re-check each one's Google Maps count first, and keep to about 30 a day while the domain is new.
4. **Approve the community posts** in `community_posts_ready.md`, posted from your own accounts after checking each group's rules.

## 4. Blockers
- **Twilio toll-free number +1 877 629 9694.** The verification was rejected, then resubmitted Oct 27 at ~12:49 AM ET as Sole Proprietor "Nicholas DAntonio DBA ReviewAsk". Status is In Progress, with a 3–5 day estimate. The account is still on the Trial plan; upgrading requires an ID check plus card and tax details. Review requests go out by email until this clears.
- **Jobber app review.** The app has been "In Review" since Oct 26 at ~11:46 PM ET. Next, Jobber emails the Developer Center account to schedule a demo. The reviewer test account exists (jobber-review@getreviewask.com, saved in the vault). Draft apps are capped at 5 connected accounts until approval.
- **Render auto-deploy.** Pushes to GitHub `main` don't seem to deploy on their own, so every deploy tonight was triggered through the API. To fix it, turn on Auto-Deploy in the Render dashboard for srv-dbfbc94s728c73epr4bg (one click).
- **Legal entity.** Twilio was filed under your own name as a sole proprietor because there is no EIN. Decide whether ReviewAsk stays a sole proprietorship or moves to an LLC/EIN, then make Terms/Privacy, Stripe, and Twilio match.
- **Cleanup:** a stray `TWILIO_AUTH_TOKEN_B64` env var may still be on Render; worth deleting.
