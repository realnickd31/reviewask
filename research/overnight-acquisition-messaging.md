# ReviewAsk: Acquisition and Messaging Research (v2, deep pass)
Revised 2026-10-26 ~1:40 AM ET. v1 is backed up at `overnight-acquisition-messaging.v1.bak.md`.

**Assumption:** ReviewAsk is already live at getreviewask.com and Jobber connect works. This document is only about getting customers, not about launching.

**Evidence labels:** **[F]** means I fetched and read the page this pass. **[S]** means it came from a search-result summary only and still needs verifying. **[EST]** means my own estimate with no source. I removed all dollar CAC figures from v1. They were unsourced.

---
## 0. What the live site says today (fetched [F] getreviewask.com)
- Headline: "Every finished job gets a Google review request — automatically." It offers a 7-day trial, **card required**, then $39/mo or $390/yr. The plan includes 200 requests/mo for 1 location, a day-3 follow-up, bulk CSV upload, and a "no review gating" section.
- **Issues to fix before driving traffic:**
  1. The FAQ support email is a placeholder: `support@reviewask.local`. Replace it with a real address.
  2. The site claims automatic asks for **Jobber *and* Housecall Pro**. The brief says only Jobber is live. If the Housecall Pro auto-ask isn't working, the claim needs a "coming soon" label. Otherwise it's a deceptive-claim risk and a refund risk.
  3. "Designed for teams in Dental & medical, Legal & accounting…" dilutes the Jobber/home-service message. Paid and cold traffic should land on a page made just for Jobber home-service businesses.
  4. Nothing on the page proves results yet: no customer count, no screenshot of a review arriving.
- The card-required trial is the right choice for paid conversion. In the First Page Sage data, trial→paid is ~48.8% with a card vs ~18.2% without, though fewer visitors start a card-required trial [S, see §D]. Keep it, and give cold traffic a no-card lead magnet (the gap report) in front of it.

---
## 1. Verified facts that change the plan
| Claim | Status | Source |
|---|---|---|
| Unpublished (Draft) Jobber apps can connect to at most 5 Jobber accounts | **VERIFIED [F].** "`Draft` - Your app is functional and can connect to up to 5 Jobber accounts." Also: "Functionality is the same between Draft and Published apps, except for the connection limit… request a review when you're ready to release your app publicly or need to lift the connection limit beyond 5 Jobber accounts." | developer.getjobber.com/docs/publishing_your_app/app_review_process/ |
| **Implication:** ReviewAsk **cannot have a 6th Jobber customer** until it passes App Review | Follows from the above. **This is the bottleneck.** Submit before scaling any channel | same |
| App Review requirements | [F] Core functionality stable. Refresh Token Rotation enabled. Subscribed to the **APP_DISCONNECT** webhook. Connect/disconnect/reconnect works from both the marketplace and the app. A test account for reviewers. The pre-submission checklist done. **2FA on the Developer Center account.** An app logo uploaded. Process: Request Review → email → **a meeting with a live demo** → functional, UX, and marketing review → Approved → publish timing set with Jobber | review process + app_listing_details |
| Listing fields | [F] App name, developer name, description, Manage App URL (optional), features/benefits, gallery images, logo (square PNG/SVG, ≥384px, ≤1MB, per the getting-started doc) | app_listing_details |
| Rule on using the Jobber name/logo | [F] "wait until your app's status is Published before making any public announcements… referencing Jobber or our logo." Jobber offers to review marketing materials. **Note:** saying "connects to Jobber" on getreviewask.com today is a factual compatibility statement. Avoid the Jobber logo and "Jobber partner" claims until Published | review process |
| Jobber's reach | [F] The Developer Center says "over 350,000 Home Service Pros". NiceJob's homepage shows **"Jobber: 3,872 businesses connected"** [F]. That's real demand: a single competitor has ~3.9k Jobber connections | developer.getjobber.com ; get.nicejob.com |
| Jobber partner programs | [F] Jobber runs Brand Partner, Ambassador, and Affiliate programs for creators, consultants, vendors, and educators. Separately, the PartnerStack "Jobber Partner Network" lists Referral and **Technology Partners** [S; the PartnerStack page didn't render when fetched] | getjobber.com/partners/ |
| Housecall Pro marketplace | [F] The HCP integrations page lists **Broadly, NiceJob, Podium, Swell, Sign Post, Emitrr** as review/communication apps. That makes HCP the second marketplace to target. I couldn't find a public HCP developer/partner application page: /partners/ returned 404. Next step: email HCP partnerships, or use Zapier as a stopgap | housecallpro.com/integrations/ |
| "74% only care about reviews from the last 3 months" | **VERIFIED [F],** BrightLocal LCRS 2026 (n=1,002 US adults, Feb 11 2026). Related stats on the same page: 97% read local reviews. **47% won't use a business with fewer than 20 reviews.** 68% need 4+ stars (55% in 2025). 31% need 4.5+ (17% in 2025). 32% look for reviews from the last 2 weeks. **78% were asked for a review in the last 12 months, and 83% of those asked left one.** Google's share as a review source fell from 83% to 71%. Use of ChatGPT/AI for local recommendations rose from 6% to 45%. 85% are more likely to use a business after reading positive reviews | brightlocal.com/research/local-consumer-review-survey/ |

---
## 2. Competitor landing-page teardown (all [F])
| Competitor | Hero | Lead magnet / CTA | Proof | Angle to steal or counter |
|---|---|---|---|---|
| **NiceJob** | "Stop chasing customers. Start attracting them instead." | **Free scorecard:** "See how you stack up against local competitors" (Google-powered, 3/day limit) | 4.9 from 4,000+ reviews. 2M+ reviews enabled. 50K+ businesses. "Jobber: 3,872 businesses connected" | **Their main lead magnet is a free competitor scorecard.** That confirms the Review Gap Report. Their pricing: $75 Starter / $125 Pro. Their comparison pages say "14-day free trial, no credit card required" |
| **GatherUp** | "Win your next customer in the age of AI" | **Free audit:** find your business → "Where should we send the audit?" Covers ratings, volume, **freshness**, and competitive position | 30,000+ businesses. G2 9.2/10 ease of setup. "+0.24 avg Google star lift in 90 days" | They also gate the audit behind an email. Angle: being found in AI search. GatherUp pricing is $99/mo for 1 location [S] |
| **Birdeye** | "AI Coworkers for Multi-location Brands" | Demo | Enterprise logos (Jiffy Lube, Orkin, Six Flags) | **Birdeye has moved upmarket** and no longer speaks to single-location contractors. That's room for ReviewAsk |
| **Podium** | "The #1 converting AI Employee for local businesses" | "Watch a demo" / "Get a demo" | 60,000+ businesses. "36 seconds to respond" | **Podium now sells an AI front desk, not reviews.** Owners who bought Podium for reviews are overpaying. NiceJob's page cites Podium Core at $399/mo plus extra fees [F] |
| **NiceJob comparison pages** (vs Podium, vs Birdeye) | Long pages ending in an "honest summary" with Where X fits / Where we fit, pricing, and an FAQ written for search ("Is NiceJob cheaper than Podium?", "Does Birdeye integrate with Jobber?") | Trial CTA | Mentions Birdeye "multi-year contracts" and add-ons at $100–150/mo | **Copy this format for ReviewAsk vs NiceJob, vs Podium, and vs Birdeye** |

**Where ReviewAsk can win:** NiceJob owns "$75 growth platform". Podium and Birdeye moved to AI and enterprise. Nobody owns **"the $39 tool that does just one thing: asks every Jobber customer for a Google review."** The pitch: single-purpose, half NiceJob's price, no demo call, policy-compliant.

---
## 3. Ranked channel playbook (revised)
| # | Move | Why (evidence) | Effort |
|---|---|---|---|
| 1 | **Pass Jobber App Review and get Published** | Hard cap of 5 Jobber accounts until then [F]. The marketplace is high-intent, and NiceJob has 3,872 Jobber connections [F] | 10–20 h prep + review calls [EST] |
| 2 | **Free Review Gap Report** (email-gated, emailed result) | NiceJob and GatherUp both lead with a free scorecard/audit [F]. Use BrightLocal's "47% won't use a business with <20 reviews" and "74% last 3 months" as the scoring rules [F] | 12–20 h build [EST] |
| 3 | **Comparison and alternative SEO pages** | NiceJob's vs-pages show the format works in this category [F]. Podium and Birdeye repositioning away from SMB reviews opens these searches [F] | ~3 h/page [EST] |
| 4 | **Data-personalized cold email → gap report** | Must follow CAN-SPAM [F]. SMB reply benchmarks are 4–8% [S] | 8 h setup + 2 h/wk [EST] |
| 5 | **Meta ads → gap report** | No sourced CPL benchmark for this niche. Test with a $300–500 cap [EST] | 4 h setup + 1 h/wk |
| 6 | **Google Search ads on competitor names** | Google's trademark policy **does not restrict trademarks used as keywords**, but **does restrict a direct competitor using the trademark in ad text** [F]. So bid on "nicejob pricing" and "podium alternative", but write ad copy like "$39 Google review requests for Jobber" without competitor names | 2 h |
| 7 | **Housecall Pro listing** (after Jobber) | HCP lists NiceJob, Broadly, Podium, and others [F] | Unknown, needs an HCP partner contact |
| 8 | **Jobber Affiliate/Ambassador creators** (e.g. trade-business YouTubers) for co-marketing, plus a ReviewAsk affiliate program | Jobber's own creator program is proof that this audience follows creators [F] | 2–4 h outreach |
| — | Google Local Services Ads | **Not applicable.** LSA is for service providers that take homeowner leads, not for SaaS. (Google support URLs 404'd; skip it) | — |
| — | AppSumo | v1 concerns stand [S]: about 24% refunds in one case, and it undercuts MRR | — |

---
## 4. Week-by-week plan: first 10 paying customers (online only)
Target funnel [EST]: ~40 gap reports → ~15 trials → ~10 paid. A card-required trial converting at ~50% [S] makes 15 trials → 7–10 paid plausible.

| Week | Work | Hours [EST] | Exit criteria |
|---|---|---|---|
| **1** | Fix the support email, label Housecall Pro truthfully, build a `/jobber` landing page. Turn on 2FA. Add refresh token rotation and the APP_DISCONNECT webhook if missing. Test connect/disconnect/reconnect. Prepare the listing: logo, 3–5 gallery screenshots, description, features. **Submit Jobber App Review.** Install analytics events (report, trial start, Jobber connected, paid) | 14 | Review requested |
| **2** | Build the Review Gap Report: Places API lookup, top-3 competitors for "category + city", output review count, latest review date, rating, and "you need N reviews to pass #3". Gate it with email, deliver by email via Resend, follow with a 3-email nurture | 16 | 5 test reports correct |
| **3** | SEO: publish `/nicejob-alternative`, `/podium-alternative`, `/birdeye-alternative`, and `/jobber-google-reviews` in NiceJob's "honest summary + FAQ" format. Submit to Search Console. Cold email setup: 2 secondary domains, 4 inboxes, SPF/DKIM/DMARC, warmup starts. Build a list of 1,000 Jobber-likely home-service businesses (HVAC, plumbing, lawn, cleaning, in 10 metros) with Places data | 14 | Pages indexed, warmup running |
| **4** | Jobber review meeting and demo (expected about now). Cold email: 50/day → 100/day, V1–V5 A/B tests. Meta: 3 ad sets at $15/day each, all pointing to the report | 10 | ≥15 reports |
| **5** | Act on Jobber review feedback. Kill weak cold-email and ad variants and keep the top 2. Call or Loom every report requester who doesn't start a trial (async video, not personal email forever) | 10 | ≥5 trials |
| **6** | If Published, announce it: Jobber listing link in every email, "Available in Jobber App Marketplace" badge (with Jobber's approval). Add the Google competitor-keyword campaign at $20/day. Publish 4 trade "how to get more Google reviews for [trade]" pages | 10 | ≥3 paid |
| **7–8** | Scale whatever works. Recruit 2–3 affiliates (trade creators, Jobber consultants). Post 2 Reddit value posts (below). Collect 3 testimonials with real numbers for the landing page and ads | 8/wk | **10 paid** |
Total: about 90 hours over 8 weeks [EST].

---
## 5. Copy bank
Use only sourced stats in copy: BrightLocal 2026 [F] — **74% last 3 months; 47% won't use <20 reviews; 68% need 4+ stars; 83% of people asked left a review; 97% read reviews.** Price anchors: NiceJob $75/$125 [F]; Podium Core $399 as cited by NiceJob [F]; Birdeye $299/location as cited by NiceJob [F]. Don't use testimonial or "X× more reviews" claims until real customer data exists.
Tokens: `{{first}} {{company}} {{city}} {{category}} {{your_count}} {{your_rating}} {{days_since_last}} {{comp1}} {{comp1_count}} {{gap}} {{report_link}} {{fsm}}`
CAN-SPAM footer on every cold email [F]: real From, physical postal address, a clear opt-out ("Reply 'no thanks' and I won't email again"), and opt-outs honored within 10 business days. The FTC also requires that the message be identified as an ad "clearly and conspicuously", with leeway in how [F].

### 5.1 Cold email: 5 variants (plain text, no link in touch 1)
**V1: Competitor gap**
Subj: `{{comp1}} has {{comp1_count}} Google reviews`
> Hi {{first}}, searching "{{category}} {{city}}", {{comp1}} shows {{comp1_count}} reviews and {{company}} shows {{your_count}}.
> BrightLocal's 2026 survey found 47% of people won't use a business with fewer than 20 reviews.
> I put together a free one-page gap report for {{company}}: how many reviews you need to pass them. Want it?
> Nick, ReviewAsk

**V2: Recency**
Subj: `your last Google review: {{days_since_last}} days ago`
> {{first}}, the newest review on {{company}}'s Google profile is {{days_since_last}} days old. 74% of consumers only care about reviews from the last three months (BrightLocal 2026).
> ReviewAsk emails every customer a review link the moment a job closes in Jobber, with one reminder on day 3. $39/mo.
> Worth sending you a quick look?

**V3: Price anchor**
Subj: `Google review requests for $39`
> {{first}}, if you're paying for Podium or Birdeye mainly for review requests, NiceJob's own comparison lists Podium Core at $399/mo and Birdeye at $299/location.
> ReviewAsk does that one job for $39/mo with no contract: every finished Jobber job gets an ask, with a day-3 follow-up.
> Open to a 7-day trial?

**V4: They already ask (people do leave reviews when asked)**
Subj: `quick question about reviews at {{company}}`
> {{first}}, do your techs ask every customer for a Google review, or just the ones they remember?
> In BrightLocal's 2026 survey, 83% of people asked for a review went on to leave one. The hard part is asking every single time.
> ReviewAsk sends the ask automatically when a Jobber job closes. Want me to show you what your customers would get?

**V5: Ultra-short, reply-bait**
Subj: `{{company}} reviews`
> {{first}}, want a free report showing how {{company}}'s Google reviews compare to the top 3 {{category}} companies in {{city}}? I'll send it over, no call needed.

Follow-ups (same thread): Day 3: "Still want the {{company}} report? Takes me 2 minutes." Day 8: "Last note. Reply 'later' and I'll check back in spring, or 'no' and I'm gone."

### 5.2 Review Gap Report nurture sequence (3 touches, after email capture)
**T1 (instant).** Subj: `Your Google review gap report: {{company}}`
> {{first}}, here's where {{company}} stands in {{city}}:
> - You: {{your_count}} reviews · {{your_rating}}★ · last review {{days_since_last}} days ago
> - {{comp1}}: {{comp1_count}} reviews
> - **You need about {{gap}} more reviews to pass them.**
> For context, 74% of consumers only care about reviews from the last 3 months, and 47% won't use a business with fewer than 20 (BrightLocal 2026).
> Fastest fix: ask every customer, every job. ReviewAsk does it automatically from {{fsm}}. → {{trial_link}} (7-day trial, $39/mo after)

**T2 (day 2).** Subj: `the math on {{gap}} reviews`
> If you finish ~{{jobs_per_week}} jobs a week and ask everyone, at BrightLocal's 83%-of-asked-will-review rate (treat it as an upper bound; real response is lower) you could close that gap in weeks, not years. The catch is asking every time. ReviewAsk sends the ask when the job closes, plus one reminder. Bulk-upload last month's customers on day 1 to catch up fast. → {{trial_link}}
(Note: only show the jobs/week calculation if the user supplied it. Otherwise drop that sentence.)

**T3 (day 5).** Subj: `{{first}}, compliant review asks (no gating)`
> One thing to watch: Google prohibits "selectively soliciting positive reviews" and offering incentives, and the FTC's 2024 rule bans buying sentiment-conditioned reviews. ReviewAsk sends every customer the same ask, so nothing gets you flagged. $39/mo, no contract, cancel anytime. → {{trial_link}}

### 5.3 Meta ad sets (3)
**Set A: Gap/loss** (audience: home-service owners, interests Jobber/HVAC/plumbing/lawn care; CTA: free report)
- Primary: "47% of homeowners won't hire a company with fewer than 20 Google reviews (BrightLocal 2026). How many do you have compared to the top 3 in your town? Get your free Review Gap Report in 60 seconds."
- Headline: "See how many reviews you're behind" · Creative: map-pack mockup "You: 14 · Them: 112"

**Set B: Automation/Jobber** (CTA: trial)
- Primary: "Close a job in Jobber → your customer gets a Google review request automatically. One reminder on day 3. That's it. $39/mo, no contract."
- Headline: "Google review requests on autopilot" · Creative: a 15-second screen recording of job closed → email received → review form
- (Don't use the Jobber logo until Published [F].)

**Set C: Price anchor** (retargeting report users and site visitors)
- Primary: "Podium Core: $399/mo. NiceJob: $75/mo. ReviewAsk: $39/mo. If all you need is every customer asked for a Google review, don't pay for an AI front desk."
- Headline: "Review requests. Nothing you don't need." · (Prices as cited on NiceJob's pages [F], with a date in the fine print.)

### 5.4 Landing heroes (3)
1. **Automation (current, keep for organic):** H1 "Every finished job gets a Google review request — automatically." Sub: "Connect Jobber once. ReviewAsk asks every customer and follows up on day 3. $39/mo, no contract."
2. **Loss (paid/cold traffic):** H1 "74% of customers ignore reviews older than 3 months. Is yours?" Sub: "ReviewAsk keeps fresh Google reviews coming in by asking every Jobber customer automatically." CTA: "Get my free review gap report" with a secondary "Start 7-day trial".
3. **Anchor (comparison/retargeting traffic):** H1 "Google review requests for $39, not $399." Sub: "No AI receptionist, no annual contract, no demo call. Just an ask after every job, from Jobber, with a follow-up." Add a 3-column table: ReviewAsk / NiceJob / Podium.

### 5.5 LinkedIn (agencies and Jobber consultants)
> "{{first}}, saw you help home-service companies with {{marketing/Jobber setup}}. I built ReviewAsk: Jobber job closes → the customer gets a Google review ask, plus a day-3 follow-up. $39/mo. I'm looking for 3 partners to offer it to clients for 30% recurring. Happy to set up a free account so you can kick the tires. Interested?"

### 5.6 Reddit value posts (2 outlines, no link, follow subreddit rules)
**Post 1 (r/sweatystartup, r/smallbusiness on a non-promo day only if it's pure value; HVAC subs only with mod OK):**
"I pulled Google review counts for the top 5 [HVAC] companies in 10 metros. Here's the gap between #1 and #5"
- Method (Places data, date). Table of median reviews for #1 vs #5. % with a review in the last 30 days.
- Tie to BrightLocal: 47% won't use <20; 74% only trust the last 3 months.
- 3 copy-paste review-request texts/emails, a when-to-send timing tip, and "never offer discounts or ask only happy customers; Google prohibits it".
- Close: "Comment your trade and city and I'll tell you your gap." DM the tool only if asked.

**Post 2 (r/Entrepreneur, r/SaaS, build-in-public):**
"I'm building a $39 Google review tool for contractors. What I learned from NiceJob, GatherUp, Podium and Birdeye's landing pages"
- Teardown table (from §2). The free-scorecard pattern. Podium/Birdeye's pivot to AI and enterprise.
- Honest numbers from the first weeks (reports, trials, paid).
- Ask for feedback. The product link goes in a comment only if the sub allows it.

### 5.7 SMS to owner
Send this **only to owners who opted in** (e.g. a checkbox on the gap report form with clear consent language, "Reply STOP to opt out"):
> "ReviewAsk: your {{company}} review gap report is ready. You're {{gap}} reviews behind {{comp1}}. View: {{report_link}} Reply STOP to opt out."

---
## 6. Compliance (fetched sources)
- **CAN-SPAM [F]:** "The law makes no exception for business-to-business email." Requirements: no misleading headers, no deceptive subject lines, identify the message as an ad, a valid physical postal address, a clear opt-out that works for at least 30 days after sending, opt-outs honored within 10 business days, and no selling of opted-out addresses. Penalties reach **up to $53,088 per email**, and you're liable for vendors sending on your behalf. Harvesting addresses or dictionary attacks are aggravated violations, so use legitimately published business emails.
- **Texts (FCC/TCPA) [F]:** "FCC rules ban text messages sent to a mobile phone using an autodialer unless the phone owner previously gave consent." **"Commercial texts require written consent."** → **No cold SMS to owners.** Only text owners who opted in.
- **A2P 10DLC [F, Twilio]:** Anyone sending application-to-person SMS over US 10DLC numbers must register a **Brand** and a **Campaign**, including opt-in/opt-out/help flows and the message purpose. Unregistered traffic pays extra carrier fees and gets filtered. ReviewAsk will send SMS on behalf of many contractor customers, which makes it an **ISV** under Twilio's definitions. Each customer business likely needs its own brand registration (Standard/Low-Volume need an EIN; otherwise Sole Proprietor, 1 campaign, ~3k segments/day). Toll-free verification is an alternative. Factor this into the SMS launch timeline before marketing SMS.
- **Product compliance (from v1, Google policy and FTC rule):** no gating, no incentives. The site already says this. Keep it as a selling point.
- **Google Ads trademarks [F]:** bidding on competitor names as keywords is allowed. Using them in ad text as a direct competitor is restricted if the trademark owner complains.
- **Jobber branding [F]:** no Jobber logo or partner announcements until Published.

---
## 7. Funnel benchmarks (search-sourced; still [S])
- Cold email: SMB reply rate 4–8%, positive 1–2% (RevenueFlow). Most senders get 1–4% (Mailshake 2025).
- Trials: no-card 18.2% / card 48.8% trial→paid. Visitor→trial 8.5% no-card / 2.5% card (First Page Sage 2025). ChartMogul 2026 median free→paid is 8%, card trials 30%.
- I have no sourced CPL/CAC for Meta or Google in this niche. Measure it in weeks 4–6.

---
## 8. Sources
**Fetched this pass [F]:**
1. https://developer.getjobber.com/docs/publishing_your_app/app_review_process/
2. https://developer.getjobber.com/docs/publishing_your_app/app_listing_details/
3. https://www.getjobber.com/partners/
4. https://www.housecallpro.com/integrations/
5. https://www.brightlocal.com/research/local-consumer-review-survey/
6. https://www.ftc.gov/business-guidance/resources/can-spam-act-compliance-guide-business
7. https://www.fcc.gov/consumers/guides/stop-unwanted-robocalls-and-texts
8. https://www.twilio.com/docs/messaging/compliance/a2p-10dlc
9. https://support.google.com/adspolicy/answer/6118?hl=en
10. https://get.nicejob.com/
11. https://get.nicejob.com/resources/nicejob-vs.-podium-which-is-right-for-your-service-business
12. https://get.nicejob.com/resources/nicejob-vs.-birdeye-which-is-right-for-your-small-service-business
13. https://gatherup.com/
14. https://birdeye.com/
15. https://www.podium.com/
16. https://getreviewask.com

**Attempted, no usable content:** PartnerStack Jobber application (empty render), Jobber App Marketplace apps.getjobber.com (Cloudflare challenge), housecallpro.com/partners/ (404), Twilio help-center 10DLC article (needs JavaScript), Google LSA support and business pages (404 ×2).

**Search-only from v1 [S]:** NiceJob pricing (get.nicejob.com/pricing); Podium/Birdeye trackers (costbench.com, pluspoint.io, theoryroad.com); GatherUp pricing; Grade.us plans; 1capture.io and launchingnext.com trial benchmarks; revenueflow.com and the Mailshake cold email reports; AppSumo founder posts; Reddit rule pages; FTC Reviews Rule (ftc.gov press release and Q&A); Google Maps contribution policy (support.google.com/contributionpolicy/answer/7400114).
