# 7-Day Launch Plan: 10 paid subscribers at $39/mo

**Math:** 10 paid ≈ 25–30 trials ≈ 60–80 real conversations ≈ about 300 cold touches (email + DM + calls) plus the warm network. The volume is front-loaded. The key move is a **"done-for-you first batch"**: we send their first review requests for them, so they see real reviews before the trial ends.

**Offer:** 14-day free trial, card at signup (or no card plus a personal follow-up), $39/mo after that. First 10 customers get **founder pricing locked at $39 for life** plus a 30-day money-back guarantee. That's the urgency, and it's honest.

---

## Day 0 (tonight): minimum setup, under 3 hours
- [ ] Buy a secondary sending domain (e.g. getreviewask.com). Set up Google Workspace or Zoho mail, plus SPF, DKIM, and DMARC.
- [ ] One-page landing site: tagline, 3-step how-it-works, $39/mo, "Start free trial" + "Book 10-min call" (Calendly/Cal.com free).
- [ ] Stripe Payment Link for $39/mo with a 14-day trial.
- [ ] SMS: Twilio (or similar) number, with A2P 10DLC registration started. It can take days, so use email requests until it's approved.
- [ ] Make sure the product can: add a customer → send an email/SMS with the business's Google review link (`https://search.google.com/local/writereview?placeid=...`) → send one reminder → show a count.
- [ ] Copy `prospects_template.csv` into a Google Sheet.

## Day 1 (Mon): warm network + first 50 prospects
- [ ] Text or call 10–20 local businesses Nick personally uses: "I built a thing for getting more Google reviews. Can I set it up free for you this week?"
- [ ] Build 50 prospects from Google Maps (home services, 1 city) using `prospect_sources.md`, with review counts and a named competitor.
- [ ] Send 30 cold emails (variant 1). Keep it to 30–40 a day per inbox while the domain is new.
- [ ] Join 8 FB groups (by niche + city).
- **Target:** 2 warm trials.

## Day 2 (Tue): dental/salon + phones
- [ ] Add 50 prospects (dental/salon/med spa).
- [ ] Send 40 cold emails (variant 2) + 20 day-1 follow-ups queued for day 3.
- [ ] **Call 20 home-service businesses** between 7:00 and 8:30 AM or 4:30 and 6:00 PM (owners pick up). Script: "Hi, I'm Nick, local. Quick one: how do you get Google reviews right now?… I'll set you up free and send the first batch. Can I text you the link?"
- [ ] Onboard yesterday's trials personally: load their customer list and send the first batch for them.
- **Target:** 4 trials total.

## Day 3 (Wed): social + RE agents
- [ ] Post a value post in 3 FB groups that allow it. DM everyone who posted about reviews or leads (10–15 DMs).
- [ ] 20 LinkedIn connections (RE agents + owners). Send the follow-up DM to anyone who accepts.
- [ ] 30 cold emails (variant 3, RE agents) + day-3 follow-ups to the day-1 list.
- [ ] Check in with trial users: "You've got X clicks / Y new reviews so far."
- **Target:** 8 trials total.

## Day 4 (Thu): double down on what's replying
- [ ] Look at reply rates by niche and put 70% of today's effort into the best one.
- [ ] Add a second city: 50 new prospects. Send 40 emails + 20 calls.
- [ ] Nextdoor: one business post + DMs to local business pages.
- [ ] Ask the happiest trial user for a one-line quote and screenshots of their new reviews. Add them to the landing page and emails ("Joe's Plumbing got 11 reviews in 5 days").
- **Target:** 12 trials. First conversion attempts start (offer founder pricing to early trials who are seeing results).

## Day 5 (Fri): convert + optional paid test
- [ ] Call every trial user: "You've got N new reviews. Want to lock in $39 for life before I raise the price for new signups?" Send the Stripe link while you're on the call.
- [ ] Follow-ups to everyone emailed on days 1–3. Another 30 new emails.
- [ ] Ask each paying customer for referrals: "Know another owner who'd want this? I'll give you a free month for each one who signs up."
- [ ] **Optional paid (only if organic is giving fewer than 2 trials a day):**
  - Facebook/Instagram ads at $20–30/day, targeted at small business owners plus interests (HVAC, plumbing, salon owner) within 25 miles of target cities. Creative: before/after review count screenshot. CTA: free trial.
  - Or Google Search at $20/day on `podium alternative`, `get more google reviews`, `google review software for small business`. Use exact/phrase match and add negatives (free, jobs, how to).
  - Stop any ad set that hasn't produced a trial after $60 spent.
- **Target:** 3–4 paid.

## Day 6 (Sat): catch-up + content
- [ ] Reply to everyone and onboard the new trials.
- [ ] Post a short case study (with permission) in FB groups and on LinkedIn: numbers, screenshot, no hype.
- [ ] Prospect for next week: another 50.
- **Target:** 6 paid.

## Day 7 (Sun): close + review
- [ ] Final conversion messages to trials that started on days 1–3: "Your trial ends Tuesday. Here's what you got: N reviews. Want to keep it going at $39?"
- [ ] Metrics review: emails sent → reply % → trial % → paid %, by niche and channel. Pick the best niche + channel for next week.
- [ ] Ask every churned or declined trial why. Log it in `notes`.
- **Target:** 10 paid (or a clear plan to get there by Day 10 as trials end).

---

## Daily non-negotiables
- 40+ new cold touches (email + calls + DMs).
- Every reply answered within 2 hours.
- Every trial gets a done-for-you first batch within 24 hours.
- Update the `status` column for every prospect: new → contacted → replied → trial → paid / lost.

## Status values for the CSV
`new`, `contacted`, `followup_1`, `followup_2`, `replied`, `call_booked`, `trial`, `paid`, `lost`, `do_not_contact`

## Benchmarks to watch
| Metric | OK | Good |
|---|---|---|
| Cold email reply rate | 3% | 8%+ |
| Cold call → trial | 5% | 15% |
| Trial → paid (with done-for-you batch) | 30% | 50%+ |
If the reply rate is below 2% after 100 emails, change the subject and first line, not the offer.
