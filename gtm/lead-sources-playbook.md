# Lead-Sources Playbook — finding businesses most likely to subscribe

Ground rules for every source: public pages only, human-paced browsing or documented search operators, no logging into anyone else's account, no private/internal APIs, no bypassing captchas/rate limits, respect each platform's ToS and group rules. Cold email under CAN-SPAM (real name, physical address, opt-out honored within 10 days, no deceptive subject) — https://www.ftc.gov/business-guidance/resources/can-spam-act-compliance-guide-business . **No cold SMS** to prospects (TCPA). Canada = CASL, skip for cold.

Yield estimates are **[SPEC]** unless noted.

---
## 1. Businesses proven to be on Jobber

### 1a. Tech-detect directories (BEST source tonight — used for the seed list)
- **Coldlytics "Companies using Jobber"** — public free directory: https://directory.coldlytics.com/technologies/jobber . States "Jobber detected on 3,392 websites; 426 verified profiles" with Google rating, review count, employees, owner names. 92% are 1–10 employees (from that page).
- Steps: page through `?page=1..9` → open each company → keep reviews <100, ≤20 staff → **open their homepage and confirm Jobber** (view-source, search "getjobber") → score.
- Tonight: 426 profiles read, 142 shortlisted, **~97 confirmed Jobber on homepage HTML**.
- Also: same site has `/technologies/housecall-pro` (718) for the HCP list once HCP is live. Paid export exists (Coldlytics) — Nick's call; free pages are enough for week 1.
- Alternatives: BuiltWith / Wappalyzer "Jobber" tech lookups (paid lists, ToS-clean), PublicWWW search for `clienthub.getjobber.com` in source code (paid tier).

### 1b. Google search operators (free, ~5–15 new leads per query)
Copy-paste:
```
"clienthub.getjobber.com" "work_request" <city or niche>
"powered by Jobber" "request" <niche> <state>
"Client Hub, powered by Jobber"
site:nextdoor.com/pages "clienthub.getjobber.com" <state abbr>
site:linkedin.com/company "clienthub.getjobber.com"
"clienthub.getjobber.com/booking" <niche>
site:facebook.com "clienthub.getjobber.com" <city>
```
Directories that mirror Facebook pages and list a Jobber link as the "website" (cleaners10.com, contractors1000.com, glonstruct.com, assistant247.net) — search `site:cleaners10.com "getjobber" <state>`.
A business whose *website is literally a Jobber link* = no marketing site, tiny shop, almost certainly no review tool → high fit.

### 1c. Nextdoor business pages (FL/Southeast gold)
- Search `site:nextdoor.com/pages "getjobber" <niche> <city>`. Pages show phone, public email, "Neighborhood Favorite" awards, recent posts.
- **Do not** DM neighbors; Nextdoor restricts unsolicited sales messages. Use the page's own public email/phone for a single cold email.
- Tonight: 15 Southeast Nextdoor pages captured.

### 1d. Jobber App Marketplace (once ReviewAsk is approved)
- Jobber reviews apps before listing (https://developer.getjobber.com/docs/publishing_your_app/app_review_process/). Marketplace has no public ratings per app, so **listing copy + category placement** do the work. Pull keywords "reviews", "Google reviews", "Marketing Suite alternative" into listing title/description (see `jobber-app-listing.md`).
- Expect: passive inbound; this is the highest-intent channel because users are already in Jobber looking.

### 1e. Jobber Community & Facebook groups
- Jobber Home Service Community: https://community.getjobber.com/ — answer threads on reviews/marketing (value first, disclose you built ReviewAsk). Search the community for "reviews", "Marketing Suite".
- Facebook groups: "Jobber Users" groups, niche groups (Lawn Care Business Owners, Window Cleaning Business, Pressure Washing Resource, House Cleaning Business Owners). Read rules; post only in promo threads; DM only people who post about reviews.
- Yield: 3–10 conversations/week.

### 1f. Reddit pain threads
- Example: r/WindowCleaning "jobber review add-on" https://www.reddit.com/r/WindowCleaning/comments/1eoypit/jobber_review_addon/ ; r/landscaping "Is Jobber worth it for small teams?" https://www.reddit.com/r/landscaping/comments/1op8yp6/is_jobber_worth_it_for_small_teams/
- Search: `site:reddit.com jobber "marketing suite"`, `site:reddit.com jobber reviews add-on`, `site:reddit.com "how do you get google reviews" lawn OR cleaning OR pressure washing`.
- Reply with the actual tactic (text/email within 1 hr of job, direct review link). Mention ReviewAsk only where self-promo allowed, with disclosure. Never astroturf.

### 1g. LinkedIn
- `site:linkedin.com/company "clienthub.getjobber.com"` finds solo operators who pasted their Jobber link in "About". Connect with the owner with a ≤300-char note (see pitch doc). Manual only — no automation tools.

### 1h. Jobber customer stories
- https://www.getjobber.com/academy/ case studies and "website examples" posts (e.g. https://www.getjobber.com/academy/cleaning/cleaning-company-website-examples/) name real Jobber customers — good for warm lists, but they're often bigger/featured; low priority.

---
## 2. Review-gap businesses (any FSM)
Goal: same city+category, a business with ≤⅓ the reviews of the #1–3 Maps result, still active.
Steps (manual-augmented, ~20–30 min per 25 leads):
1. Google Maps: search `<category> <city>` (e.g. "pressure washing Lakeland FL").
2. Note top-3 review counts. Scroll results; capture businesses with rating ≥4.3, <⅓ of leader's reviews, and recent reviews/photos (active).
3. Open their site; check for Jobber/HCP links (→ jobber_signal), review widgets (→ incumbent tool), owner name, public email.
4. Log in `prospects_template.csv`; score with `icp-and-scoring.md`.
- Tools: Google Maps (manual), Google Business Profile public pages, optional paid **Google Places API** (official, ToS-compliant; display/storage limits apply — https://developers.google.com/maps/documentation/places/web-service/policies) to pull review counts for a city+category grid. Outscraper/Apify Maps scrapers exist — gray-area vs Google ToS; **not recommended**.
- Volume: 25–40 qualified/hr manually; ~unlimited via Places API (~$17–32 per 1k Place Details requests, verify current pricing).
- Prioritize categories with high job frequency + low review culture: recurring lawn, pool, cleaning, pest, window, pressure washing, detailing.

## 3. Competitor displacement
- Detect widgets: view-source for `nicejob`, `podium`, `birdeye`, `broadly`, `gatherup`, `reviewsimple`, `grade.us` (done automatically for the seed list; column `competitor_reviews_note`).
- Jobber's own NiceJob integration page: https://help.getjobber.com/en/articles/jobber-and-nicejob-reviews-and-referrals/ — NiceJob+Jobber users are pre-qualified; NiceJob Starter is $75 (https://get.nicejob.com/pricing).
- Pain sources: Capterra NiceJob/GatherUp reviews (contract, "pestered" customers), Reddit Podium/Birdeye contract complaints — see `../research/overnight-demand-competitors.md`.
- Pitch: "same review asks, $39, cancel in-app, no contract." Never disparage; state facts with links.
- Volume: low (5–10% of sites show a widget) but highest $ intent.

## Weekly cadence (Nick or VA)
Mon: 1 hr operators → +40 leads. Tue: Maps gap checks on top 40 → competitor_reviews_note filled. Wed–Thu: send sequence (≤30 new/day/domain). Fri: community/Reddit answers + log replies.
