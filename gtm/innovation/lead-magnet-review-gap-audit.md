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
2. Ask same-day after every job; response rate falls quickly after that.
3. Reply to your last {{k}} unanswered reviews.
```

## Converting to a trial
- Close the audit with: "ReviewAsk does #1 and #2 automatically from {{Jobber/HCP}} for $39/mo. 7-day free trial: getreviewask.com. Happy to load your past-customer list with you on a 10-min call."
- Day 0: send the audit. Day 3: "Did the numbers surprise you?" Day 7: "The gap moved by X since last week" (re-check Maps).
- Website later: a `/review-gap` form that collects email and emails the result (website agent's job; just a brief here).
- Track: audits sent → replies → trials. Goal for the first 20 audits: ≥25% reply, ≥3 trials **[SPEC]**.
- Cold use: use the audit as Touch 1 personalization ("I ran a quick review-gap check for you…"). Needs Nick's OK to send.
