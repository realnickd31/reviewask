# ReviewAsk: Overnight Product, Verticals & Innovation Research
_Oct 26, 2026 (ET). Built on what's shipped already (STATUS.md 10/25): Quick ask, Bulk/CSV, Automatic (Jobber OAuth, Housecall key/webhook, Zapier/webhook token), day-3 reminders, proof stats, Resend email, SMS stubbed._

## 0. Main points
- **Price wedge is real.** NiceJob costs $75–125/mo month-to-month. Podium is about $399–599/mo on annual contracts. Birdeye is about $299–449 per location per month on annual contracts, with a 90-day cancellation notice. [S3][S4][S5] At **$39 flat with no contract**, ReviewAsk costs about half of the cheapest focused competitor.
- **The biggest gap is SMS.** Review requests sent by text get far more replies than email, and every competitor leads with texting. Carriers have been filtering unregistered 10DLC traffic hard since Feb 2025, so SMS needs A2P brand and campaign registration. That means opt-in proof, sample messages, STOP/HELP, and a privacy policy on a live site. [S8][S9]
- **Don't do review gating.** Google forbids "selectively solicit[ing] positive reviews" and discouraging negative ones. [S1] The FTC says asking only happy customers "could violate the FTC Act," and its 2024 rule (effective 10/21/2024) allows civil penalties for things like sentiment-conditioned incentives. [S2][S6] **Safe pattern:** every customer gets the Google link. A private "tell us what went wrong" path is offered *alongside* it, never *instead of* it. Treat "we never gate" as a trust selling point.
- **AI reply drafts are doable.** The Google Business Profile API supports `reviews.updateReply`. API access needs an application (about 14 days, requires a business-domain email and a live website) plus owner authorization. [S10][S11][S12] **Apply now**, because approval takes time.

## 1. Improving the current version (ranked by impact × ease)
| # | Item | Why | Effort |
|---|---|---|---|
|1|**Live SMS (Twilio, with A2P 10DLC done under ReviewAsk as the ISV)**|Biggest conversion gap. Customers expect a text.|M|
|2|**Signup → first ask sent in under 3 minutes**: pre-fill the Google review link using a Places lookup by business name, then "Send a test to yourself"|Removes the first-day stall after signup|S|
|3|**QR code + printable leave-behind card / truck sticker PDF** (one per account, tracked with `?src=qr`)|Free, works in every vertical, gives us a "Print your card" moment|S|
|4|**Non-gated feedback step**: request page shows "Leave a Google review" (main button) + "Something not right? Tell the owner privately" (smaller link). Owner gets an alert when private feedback comes in|Saves bad experiences without violating Google [S1]|S|
|5|**New-review alerts + weekly "review velocity" email** (reviews this week vs. last week, rating trend, count vs. top 3 local competitors)|Proves ROI, so fewer people cancel|M (polling needs GBP API or Places)|
|6|**AI reply drafts** (copy-paste now; one-click post after GBP API approval)|Incumbents charge extra for this|S/M|
|7|**Deliverability**: own sending domain per account (or `reviews@getreviewask.com` with reply-to set to the owner), SPF/DKIM/DMARC, plain-text-ish template, one link, unsubscribe|Avoids spam folders|S|
|8|**Templates + Spanish option** (owner picks "English / Español / both")|Large Spanish-speaking customer bases in trades, salons, and auto|S|
|9|**Tech-name prompt** ("How did Mike do?") — careful: Google bans *requesting specific content / staff naming* [S1]. Show the tech's photo but don't ask customers to name staff|Personal touch without breaking policy|S|
|10|**Team seats + per-tech leaderboard** (based on asks sent, not reviews demanded)|Owners like it; ties to the Jobber assignee|M|
|11|**Multi-location** (one login, N review links, rollup view), priced at $29 for each extra location|Opens franchise/agency deals|M|
|12|**iPad / counter kiosk mode** (customer types their phone number, gets a text). Google says don't pressure customers on-premises [S1], so the kiosk sends a text for later and doesn't open Google on the iPad|Shops, salons, auto|S|
|13|**NFC tap card** (just a URL; resell for $15 or bundle with annual plan)|Upsell + word of mouth|S|
|14|**White-label for agencies** ($99/mo for 5 clients, custom domain)|Distribution channel|M|
|15|**Embed widget** (latest 5-star reviews on the owner's site)|Matches NiceJob [S3]|S|

**Friction after signup:** a 3-step checklist (Link ✓ → Test text ✓ → Connect Jobber or print QR ✓), a day-1 email from the founder, an automatic "you haven't sent an ask in 3 days" nudge, and a done-for-you CSV import of the last 90 days of customers (with a fresh, consent-aware ask).

## 2. Vertical playbooks
How to read the table: **Trigger** = when the ask goes out. **System** = what to integrate. **Caution** = rules or risks to watch.
| Vertical | Buy intensity | System / trigger | Messaging | Caution |
|---|---|---|---|---|
|**Home services (HVAC, plumbing, electric, roofing, cleaning, lawn)** — core|Very high|Jobber job closed / invoice paid ✅; Housecall ✅; **ServiceTitan** (partner API, enterprise), FieldPulse, Workiz, ServiceM8, QuickBooks invoice paid via Zapier|Text 1–2 hrs after the job; mention the tech; photo prompt|Make sure TCPA consent is captured in the CRM|
|**Auto repair / detailing / tire**|High|Tekmetric, Shopmonkey, Mitchell1; repair order closed / paid; Square|"Your car's ready & thanks"; kiosk at pickup|—|
|**Dental**|Very high (pays $300+/mo today)|Dentrix, Eaglesoft, Open Dental (local server, needs a sync agent), or appointment-completed exports; NexHealth / Weave as competitors and integration paths|No treatment details|**HIPAA:** text with no PHI ("Thanks for visiting Smile Dental"), get a BAA from the SMS/email vendor, and sign a BAA ourselves before selling. Birdeye wins here because it offers a BAA [S5]|
|**Medspa / chiro / PT**|High|Boulevard, Vagaro, Jane, Mindbody (webhooks exist; class visits come from the API) [S16]|Same as dental|Same as dental|
|**Salons / barbers / spas**|High volume, price-sensitive ($39 fits)|Square Appointments (`booking.updated`, `payment.updated` = COMPLETED) [S13][S14], Vagaro, GlossGenius, Fresha|Spanish/English; Instagram tag prompt|—|
|**Gyms / studios**|Medium|Mindbody, Glofox, PushPress; trigger after the 3rd visit, not the 1st|Ask *members*, not trial users|—|
|**Legal**|Medium-high (big value per case)|Clio `matter_closed` webhook [S15]; MyCase|Formal tone; ask only when the matter is closed|Bar ethics rules on testimonials vary by state; no incentives; avoid saying anything about the case outcome|
|**Restaurants / bars**|High demand, low ASP, needs table-side ask|Toast (partner program), Square check closed; QR on the receipt or table tent|Instant, mobile|Never ask on-premises with pressure [S1]; check rules on alcohol-related wording|
|**Real estate agents**|Medium|Follow Up Boss, kvCORE; trigger on closing date; Zillow reviews + Google|After closing, then again 30 days later|Brokerage rules|
|**Veterinary**|High|ezyVet, Cornerstone, Shepherd, Vetspire|Use the pet's name (not PHI under HIPAA, but be gentle; skip euthanasia visits!)|**Exclude** euthanasia/deceased appointment types|
|**Retail / e-com (Shopify)**|Low fit for Google reviews|`orders/fulfilled` webhook + delivery delay|Google ask only for stores with a physical location|Product reviews are a different market (Judge.me)|

**Expansion order:** home services (now) → auto + salons via **Square** (one integration covers thousands of businesses) → medspa/dental *after* a BAA and no-PHI templates → legal via Clio (simple webhook). Each vertical gets its own landing page (/hvac, /dental, /salons…) for SEO and outbound.

## 3. Innovation bets (impact × feasibility, 1–5 each)
|Bet|I|F|Score|Notes|
|---|---|---|---|---|
|Jobber-first "set it and forget it in 2 clicks" + $39|5|5|25|Already the moat; get into the Jobber App Marketplace listing|
|Live SMS + day-3 reminder (text then email)|5|4|20|Reminders produce a large share of reviews [S5]|
|QR/NFC leave-behind kit (printed, shipped)|4|5|20|Physical object = harder to cancel|
|Competitor review-count tracker ("You 42 vs. Bob's HVAC 118")|5|4|20|Places API; powerful for sales and retention|
|AI review reply drafts (+ auto-post later)|4|4|16|Needs GBP API|
|Square integration (salons/auto/restaurants)|5|3|15|Square App Marketplace distribution|
|Private feedback + "recovery" alert (non-gated)|4|4|16|Saves churn for the owner|
|Photo-prompt review page ("add a photo of your new unit")|3|4|12|Photo reviews help ranking and conversion; *suggesting* photos is OK, but don't dictate content|
|Multi-platform links (Google + Yelp*, Facebook, Nextdoor, BBB, Angi)|3|5|15|*Yelp prohibits asking for reviews — give Yelp a "check us out" link only, never a request|
|Agency / white-label + franchise packs|4|3|12|Shortcut to 10→100 through resellers|
|Contractor referral network ("give $50 / get a free month")|3|4|12|Viral among owners. The incentive goes to *owners*, never to reviewers|
|Video testimonials|2|2|4|Later|

## 4. 30 / 60 / 90 days (toward 10 → 100 paying)
**30 days:** go live (domain, Resend, Stripe live, cron); Twilio + A2P registration; 3-minute onboarding with Places link lookup + test text; QR/PDF card; non-gated private feedback; Spanish templates; **submit the GBP API application**; apply for Jobber App Marketplace; landing pages for /hvac /plumbing /cleaning.
**60 days:** weekly velocity email + competitor count; AI reply drafts (copy-paste version); Square integration (bookings + payments); team seats + tech leaderboard; kiosk mode; annual plan $390 (2 months free) + NFC card bundle.
**90 days:** GBP one-click reply + new-review alerts; multi-location + agency white-label; Clio + Tekmetric connectors; HIPAA track (BAA with vendors, no-PHI templates) → dental/medspa pilot priced at $79; owner-to-owner referral program.

## 5. Top 15 prioritized actions
1. Ship real SMS (Twilio) + start A2P 10DLC brand/campaign registration now (it takes weeks).
2. Go live in production: domain, Resend domain auth (SPF/DKIM/DMARC), live Stripe, cron ping.
3. Submit the Google Business Profile API access application (about 14-day review).
4. Onboarding in under 3 minutes: Places autocomplete → review link, then "text me a test."
5. Non-gated request page: Google button for everyone + an optional private-feedback link + owner alert. Market it as "policy-safe."
6. QR code + printable card/sticker PDF in the dashboard.
7. Apply to the Jobber App Marketplace (and Housecall Pro's) for distribution.
8. Weekly "review velocity" email with a competitor count comparison.
9. AI reply drafts for new Google reviews.
10. Spanish / bilingual templates.
11. Square integration (one connector unlocks salons, auto, cafés).
12. Team seats + per-tech ask leaderboard (Jobber assignee).
13. Vertical landing pages + outbound lists for auto shops and salons.
14. Multi-location ($29 per extra location) + agency white-label tier.
15. HIPAA readiness (BAAs, no-PHI templates, exclusion rules) before selling to dental/medspa/vet.

## Sources
- S1 Google Maps UGC prohibited content (review gating, incentives, on-premises pressure, staff naming): https://support.google.com/contributionpolicy/answer/7400114
- S2 FTC Consumer Reviews & Testimonials Rule Q&A: https://www.ftc.gov/business-guidance/resources/consumer-reviews-testimonials-rule-questions-answers
- S3 NiceJob 2026 review software roundup: https://get.nicejob.com/resources/the-best-review-software-for-small-home-service-businesses-in-2026
- S4 Reviewtail Podium vs Birdeye vs NiceJob pricing: https://reviewtail.io/learn/podium-vs-birdeye-vs-nicejob-full-feature-price-comparison
- S5 cwbrannan Podium/Birdeye/NiceJob (Oct 2026; BAA, reminders): https://cwbrannan.com/blog/podium-vs-birdeye-vs-nicejob
- S6 16 CFR 465.4: https://www.ecfr.gov/current/title-16/chapter-I/subchapter-D/part-465/section-465.4
- S7 Spokk on gating + penalties: https://www.spokk.io/blog/google-review-gating
- S8 Talkroute 10DLC requirements: https://support.talkroute.com/hc/en-us/articles/34540520757267-10DLC-Requirements
- S9 Tebra A2P FAQ: https://helpme.tebra.com/Platform/Practice_Settings/A2P_Registration/Application_to_Person_(A2P)_Registration_FAQs
- S10 GBP API FAQ (access): https://developers.google.com/my-business/content/faq
- S11 GBP review reply: https://developers.google.com/my-business/content/review-data
- S12 GBP policies (authorization): https://developers.google.com/my-business/content/policies
- S13 Square Bookings webhooks: https://developer.squareup.com/reference/square/bookings-api/webhooks
- S14 Square Payments webhooks: https://developer.squareup.com/docs/payments-api/webhooks
- S15 Clio webhooks (matter_closed): https://docs.developers.clio.com/guides/clio-manage/webhooks/
- S16 Mindbody webhooks: https://developers.mindbodyonline.com/WebhooksDocumentation
- Note: the Yelp anti-solicitation and HIPAA/BAA points come from general industry knowledge and S5; check them against Yelp's and HHS's own pages before using them in marketing copy.
