# Lead magnet: Free "Google Review Gap" Audit

**Offer line:** "Free 2-minute check: how many Google reviews you're behind the top 3 shops in your town, and how many asks a month closes the gap."

## Inputs (from prospect, or Nick fills from public data)
1. Business name + city (or Google Maps link)
2. Primary service keyword (e.g. "lawn care Tampa")
3. Optional: jobs/month, FSM tool (Jobber / Housecall Pro / other)

## How to run it (manual today, ~5 min/shop)
1. Google Maps: search "<service> <city>". Note the top 3 map-pack results: review count, rating, newest review age.
2. Note the prospect's count, rating, newest review age, and how many of their last 10 reviews have an owner reply.
3. Math: Gap = (avg of top 3) − theirs. Asks/mo needed = Gap ÷ 6 months ÷ response rate. Assume 10–20% **[SPEC: check against real ReviewAsk data once you have it]**.
4. Paste into the template below and send as a reply or a PDF/image.
Later: automate with the official Google Places API (Text Search + Place Details for rating/user_ratings_total). Don't scrape Maps.

## Output template
```
Google Review Gap — {{Business}} ({{City}}, "{{keyword}}")
Checked {{date}}. Counts change, so verify on Maps.

            Reviews  Rating  Newest review
You         {{n}}    {{r}}   {{days}} days ago
#1 {{A}}    {{nA}}   {{rA}}  {{dA}}
#2 {{B}}    {{nB}}   {{rB}}  {{dB}}
#3 {{C}}    {{nC}}   {{rC}}  {{dC}}

Gap to top-3 average: {{gap}} reviews
To close it in 6 months: ~{{gap/6}} new reviews/mo ≈ {{asks}} asks/mo at a 15% response rate
You do ~{{jobs}} jobs/mo, so asking after every job closes the gap in about {{months}} months.

3 quick wins:
1. Ask last season's customers this week (one bulk send).
2. Ask same-day after every job; response rate likely falls after that [SPEC].
3. Reply to your last {{k}} unanswered reviews.
```

## Converting to a trial
- Close the audit with: "ReviewAsk does #1 and #2 automatically from {{Jobber/HCP}} for $39/mo. 7-day free trial: getreviewask.com. Happy to load your past-customer list with you on a 10-min call."
- Day 0: send the audit. Day 3: "Did the numbers surprise you?" Day 7: "The gap moved by X since last week" (re-check Maps).
- Website: the free self-serve calculator is live at /tools/review-gap.
- Track: audits sent → replies → trials. Goal for the first 20 audits: ≥25% reply, ≥3 trials **[SPEC]**.
- Cold use: use the audit as Touch 1 personalization ("I ran a quick review-gap check for you…"). Needs Nick's OK to send.


---
## 5-minute fill-in template (DRAFT, for Nick only; do not send without his OK)
Updated ~4:50 AM ET, Oct 27 2026. Uses the same math as `gtm/audits/review-gap-audits.md`.

**Steps (≈5 min):**
1. (1 min) Google Maps: search "<service> <city>". Write down the prospect's review count and rating, plus 2–3 map-pack competitors. Skip franchises, national brands and marketplaces.
2. (1 min) If Maps shows nothing clear, use a mirror or the business's own review widget. Note the source. If only one source has the count, mark it **[UNVERIFIED]**.
3. (1 min) Do the math in the box below. Don't round in their favor.
4. (2 min) Pick an opener from the options below, then paste it into the draft. **Do not send** until Nick OKs that specific send; the footer must have [PHYSICAL ADDRESS] and [UNSUBSCRIBE LINK].

```
REVIEW-GAP AUDIT: {{Business}} · {{City}} · "{{service}} {{city}}"
Checked {{date}} by Nick. Source: {{Maps / mirror / widget}}{{ [UNVERIFIED] if one source}}

                     Google reviews   Rating
You                  {{own}}          {{own_rating}}
Comp 1 {{name1}}     {{c1}}           {{r1}}
Comp 2 {{name2}}     {{c2}}           {{r2}}
Comp 3 {{name3}}     {{c3}}           {{r3}}   (optional)

Gap to comp average      = avg(c1..c3) − own          = {{gap}}
Gap to the leader        = max(c1..c3) − own          = {{leader_gap}}
Reviews/mo to close in 6 months = ceil(gap ÷ 6)       = {{need}}
Asks/mo needed [SPEC]    = ceil(need ÷ 0.15)          = {{asks}}
  (0.15 is an assumed 15% reply-to-review rate, not measured yet)

If gap ≤ 0: you're ahead, so pitch keeping the lead. Don't claim a gap.
```

**Opener options (pick one; fill in only real numbers):**
- Behind: "{{First}}, you have {{own}} Google reviews; {{name1}} has {{c1}}. Closing that in 6 months takes about {{need}} new reviews a month, and an automatic ask after every {{Jobber/HCP}} job gets you most of the way there."
- Close behind: "{{First}}, you're only {{leader_gap}} reviews behind {{name1}} on Google. A short ask after each job usually closes that faster than people expect [SPEC]."
- Ahead: "{{First}}, you lead {{city}} with {{own}} Google reviews. An ask after every job keeps it that way while others catch up."
- Low rating (≤4.2): don't pitch volume. Send a soft check-in or skip.

**Close line:** "ReviewAsk sends that ask automatically from Jobber or Housecall Pro (or a phone or spreadsheet) for $39/mo. Email goes out today; SMS is rolling out. 7-day free trial at getreviewask.com. Free self-check: getreviewask.com/tools/review-gap."

**Checklist before Nick sends:** ☐ counts re-checked on Maps the same day ☐ greeting name confirmed ☐ comps aren't franchise or national ☐ no claims about their rating that the numbers don't back ☐ CAN-SPAM footer filled in ☐ Nick's OK for this send
