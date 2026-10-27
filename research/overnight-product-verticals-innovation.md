# ReviewAsk: Deep Product, Vertical & Innovation Research (v2)
_Written Oct 26, 2026, ~2 AM ET. Replaces v1 (the old version is saved as `overnight-product-verticals-innovation.v1.bak.md`)._

**What I assumed is live:** getreviewask.com runs on Render (Starter plan + disk) with TLS. Resend is sending from `send.getreviewask.com` (verified). Jobber Automatic works end to end. The Housecall connect screen is live (end-to-end use needs a MAX-plan account). Quick ask email works. Login sessions persist. Railway is no longer used.

**Code I read:** `lib/send.ts`, `lib/email.ts`, the file list for `components/` and `app/api/`, and `BRIEF.md`.
**How sources are marked:** [F#] = a page I fetched myself and read. [S#] = taken from a search-result snippet only (not fetched). ⚠️ = claim not confirmed.

---

## 0. What changed from v1 (the 8 most important findings)

1. **🚨 Jobber draft cap.** While our Jobber app is in *Draft*, it can connect to at most **5 Jobber accounts**. Jobber "will block API access if your app is detected connecting to more than 5 paying Jobber accounts while still in Draft." Jobber also says: don't hand out the connect link widely, and don't announce the app publicly until it's approved and Published. After approval there's about **2 weeks of beta** with real Jobber customers. [F11] Our main channel therefore stops at 5 Jobber customers until App Review is done. **Submit for App Review this week.** It is the single most important thing to do.
   - Before submitting we need: Refresh Token Rotation turned on, a subscription to the `APP_DISCONNECT` webhook, working connect / disconnect / reconnect from both the marketplace and our app, a test account for Jobber's reviewers, the pre-submission checklist, 2FA on our Developer Center account, a square logo (PNG/SVG, at least 384×384, under 1 MB), gallery screenshots, and a "Manage App URL". [F11][S1]
2. **Housecall Pro is a small market for us.** Its webhooks and Public API work **only on the MAX plan**, and Housecall itself says a developer usually does the setup. [F12] Lead with Zapier or "forward your invoice email" for Housecall users who aren't on MAX. Keep the native connector as a bonus for MAX customers.
3. **Two bugs in what we send today** (from reading the code):
   - (a) The email unsubscribe link points to `mailto:support@reviewask.local`, an address that doesn't exist. That hurts deliverability and breaks CAN-SPAM-style expectations. **Fix now:** a real one-click unsubscribe link plus a suppression table.
   - (b) The wording "**If we did a good job**, would you… leave us a Google review?" hints that only happy customers should review. The FTC says "Don't ask for reviews only from customers you think will leave positive ones" [F2], and Google forbids "selectively solicit[ing] positive reviews" [F15]. This wording is a borderline policy risk. **Change it to neutral:** "Would you share how it went on Google?"
4. **SMS is still stubbed** (`sendSms` just writes to an outbox file). Twilio requires A2P 10DLC registration for **anyone** texting US numbers from a local 10-digit number. Unregistered traffic gets extra carrier fees and more filtering. [F5] ReviewAsk counts as an **ISV** (a software vendor sending on behalf of its customers). That means either registering each customer as a brand through Twilio's ISV API, or **sending from a toll-free number (verified) at first** to avoid per-customer brand registration. [F5]
5. **Yelp rules out "ask for a Yelp review" completely.** Yelp: "Don't ask anyone to review your business… Don't ask for reviews after requesting customer feedback in other places like surveys." Its software also hides reviews that look solicited. [F3] **Product rule: we never add a Yelp link to a request flow.** We can offer "Find us on Yelp" on the business's own website widget only.
6. **HIPAA is a real gate for dental, medspa and PT.** We would be a *business associate*: we receive patient names and phone numbers from a covered entity's system. We'd need a BAA covering 10 required terms, including a breach-reporting duty and passing the same terms on to our subcontractors (Resend, Twilio, Render). [F4] The "conduit" exception covers things like the USPS that only pass data along. It **does not** cover a software vendor that stores the data. [F16] **Treat healthcare as a 90-day-plus track, not 30.** Mindbody's appointment webhooks include `icdCodes` (diagnosis codes) and `notes`. Our webhook handler must **drop those fields immediately** if we ever connect Mindbody. [F22]
7. **Competitor prices (Oct 2026), from fetched pages:**
   - NiceJob: $75 Starter / $125 Pro. AI replies, NPS, "Competitive Intel" and Gifts are **Pro-only**. 14-day trial. [F6]
   - GatherUp: $99/mo for 1 location (annual), $60 per location for multi-location; up to 300 SMS per location per month. [F7]
   - Grade.us: $99 for 1 location, $60 per location for 2–10, plus agency white-label tiers. [S2]
   - Broadly: Reputation AI module from $79/mo; full packages $399–$999/mo plus $350 setup. [F18]
   - Podium and Birdeye: quote only; no prices on their pages. [F8][F9]

   → **At $39 we cost about half the cheapest focused competitor and roughly 10× less than the bundled suites.** Our weak points are AI replies and competitor tracking. NiceJob charges $125 for both, so including them at $39 makes a strong pitch.
8. **Square fits salons, auto shops, cafés and other retail businesses best.** `booking.updated` fires when a booking is changed or cancelled. `payment.updated` fires when a payment completes, including Point of Sale, Terminal and Invoice payments, "regardless of which Square product" was used. [F13][F19] One OAuth connector covers bookings *and* in-store checkout.

---

## 1. Policy: what's allowed (from primary sources)

| Rule | Source | What ReviewAsk does |
|---|---|---|
|No selectively soliciting positive reviews; no discouraging negative ones|Google Maps UGC policy [F15]|Every customer gets the Google link. A private-feedback option can sit **next to** it, never in front of it|
|No incentives for posting, editing or removing reviews|Google [F15][F1]; FTC 16 CFR 465.4|Block words like "discount", "gift", "free", "% off" in custom templates. Lint the templates|
|Don't pressure people on-premises; don't ask staff to collect a set number of reviews or reviews mentioning a named staff member|Google [F15]|Kiosk mode sends a text to the customer's own phone for later. Leaderboards count **asks sent**, not reviews collected. No "mention Mike!" wording|
|Asking via a Google link or QR code is explicitly recommended|Google Business Profile Help [F1]|QR codes are a sanctioned feature, so we can say "Google recommends this" in sales copy|
|Replies: professional, short, specific; **not promotional**; never reveal private info; for complex cases, take it offline|Google [F1]|The AI reply-draft prompt follows these rules exactly; no offers or deals in replies|
|Don't ask for reviews only from customers you think are happy; don't ask staff, family or friends without disclosure|FTC marketer guide (Jan 2022) [F2]|Settings note: "We send to every completed job"|
|Yelp: don't ask at all|Yelp support [F3]|No Yelp links in requests|
|Review platforms are approved per partner; GBP API access must be applied for (reviewed within 14 days); use a business-domain email and a live site|GBP API FAQ [F17]|Apply from an @getreviewask.com address now. Ask to be added as a *manager* of each profile; Google advises against partners being owner|

**Policy-safe "private feedback + public ask" design:**
```
Step 1 (one screen): "How did [Biz] do today?"
  [ ⭐ Leave a Google review ]  ← main button, always shown
  "Something we should fix? Tell the owner privately →"  ← small text link, also always shown
```
- No star-rating screen that routes by score. Rating-based routing is classic gating; NiceJob and GatherUp's "feedback first" funnels are the risky pattern to avoid. ⚠️ I haven't checked their current wording.
- Private feedback sends the owner an instant alert. That's the "recovery" feature, and it's honest.

---

## 2. Improving what's live now (ranked; effort S/M/L)

| # | Item | Why / evidence | Effort |
|---|---|---|---|
|1|**Fix the unsubscribe link + neutral copy** (`lib/email.ts`)|Broken mailto; gating-adjacent wording [F2][F15]|S|
|2|**Submit for Jobber App Review** (RTR, APP_DISCONNECT, test account, logo, gallery)|5-account cap [F11]|S–M|
|3|**SMS via Twilio**: toll-free verified number at first → A2P ISV brands later; STOP/HELP handling; opt-out table; quiet hours (8am–9pm local)|[F5]; customers expect texts|M|
|4|**Policy-safe request landing page** (`/r/[token]`): our own page with the Google button + private-feedback link, tracks clicks|Lets us measure clicks (we can't today because we link straight to Google) + recovery|S–M|
|5|**QR + print kit**: QR to `/q/[biz]`, which asks for name + phone and texts the customer the link; printable card / invoice sticker / counter tent PDFs|Google recommends QR [F1]|S|
|6|**Onboarding: find the review link by business name** (Places Autocomplete → place_id → `https://search.google.com/local/writereview?placeid=`) + "text/email me a test"|Removes the hardest onboarding step ⚠️ (Places API pricing not checked)|S|
|7|**Click & conversion stats on the dashboard**: sent → opened → clicked Google → (estimated) new reviews; weekly email|Proves ROI; helps keep customers|M|
|8|**AI reply drafts (copy-paste version)**: owner pastes a review, gets 3 replies in their voice following Google's guidance [F1]; one-click post after GBP API approval|NiceJob only offers this on Pro [F6]|S → M|
|9|**Template library + Spanish version**: per-vertical wording (below); word filter blocks incentive language|Broadly highlights Spanish [F18]|S|
|10|**Timing control**: delay after trigger (now / 2h / next morning) + skip weekends|Better reply rates ⚠️ (no rate data opened)|S|
|11|**Duplicate guard**: never ask the same phone/email twice within 90 days; skip repeat customers who already reviewed|Avoids spam complaints and "unusual volume" flags [F15]|S|
|12|**Team seats** (owner/office roles) + per-tech **ask** counts|NiceJob Team Leaderboard [F6]; Google says don't push staff to hit review targets [F15]|M|
|13|**Multi-location** (one login, several review links, rollup view) at +$19–29 per location|GatherUp/Grade.us charge $60 per location [F7][S2]|M|
|14|**Embed widget + public "reviews" page**|NiceJob Microsite/Social Proof [F6]|M|
|15|**Agency white-label tier**|Grade.us offers basic white-label free and premium at $440/yr [S2]|L|

---

## 3. Vertical playbooks

How much each vertical will pay: these are my estimates from competitor prices (NiceJob $75–125 [F6], GatherUp/Grade.us $99 [F7][S2], Broadly $79+ [F18]), not surveys. ⚠️

| Vertical | Trigger event | System / CRM | How to connect | Message differences | Compliance | Will pay vs $39 |
|---|---|---|---|---|---|---|
|**HVAC / plumbing / electrical** (core)|Job closed / invoice paid|Jobber ✅ (cap!), Housecall (MAX only) [F12], ServiceTitan (partner API, apply for access [F10])|Have it (Jobber/HCP); Zapier for others; ServiceTitan = L effort, big contracts|Mention the tech by role ("our technician"), not by name; send 1–3 hrs after the job|TCPA consent for SMS (customer gave phone for service; get a checkbox in onboarding) ⚠️|$39 is an impulse buy; can upsell to $59–79 with AI replies|
|**Cleaning / lawn / pest / pool**|Recurring visit done; ask after the **1st and 5th** visit only|Jobber, Housecall, ServiceM8 ⚠️, GorillaDesk ⚠️|Jobber ✅ / Zapier|"Thanks for having us out"; skip routine weekly visits|Duplicate guard is essential|$39 fits; price-sensitive|
|**Auto repair / detailing / tire**|Repair order closed / paid|Tekmetric, Shopmonkey ⚠️ (not checked), **Square** payments [F19]|Square connector, Zapier|"Your [vehicle] is ready, thanks"; QR at the counter|Don't push customers at pickup [F15]; text for later|$49–79 ⚠️|
|**Salons / barbers / nails / spas**|Appointment checked out|Square Appointments (`booking.updated` + `payment.updated` COMPLETED) [F13][F19]; Vagaro, GlossGenius, Fresha ⚠️|**Square = top new connector**|Bilingual; casual; photo prompt ("show off your look")|Don't ask for a specific stylist's name in the review [F15]|$29–49; very sensitive to price; many locations|
|**Gyms / yoga / studios**|Booking signed in (`classRosterBooking…` signedInStatus `SignedIn`), or `clientSale.created` [F22]; ask after the Nth visit (`clientsNumberOfVisitsAtSite`)|Mindbody (dev account + go-live approval needed) [F22]; PushPress, Glofox ⚠️|Mindbody = M–L effort|Ask members after visit 3–5, not trial users|Mindbody payloads include `icdCodes`/`notes`; drop them at intake [F22]|$39–79|
|**Restaurants / cafés / bars**|Check closed / paid|Toast (partner / custom / standard API tiers; orders `GET` on standard access) [F14]; Square [F19]|Square first; Toast partner program = L effort|Short, immediate, mobile; QR on receipt / table tent|No pressure on-premises [F15]; Yelp: never ask [F3]; ⚠️ alcohol mentions in copy|Low per location; bundle multi-location|
|**Legal**|`matter_closed` webhook (Clio) [F20]|Clio (webhooks expire after 3 days by default, 31 max; daily renewal job needed) [F20], MyCase ⚠️|Clio connector = M effort|Formal; send after the matter closes, never during|State bar rules on testimonials ⚠️; don't mention case outcomes|$79–149 (high value per client)|
|**Dental / ortho**|Appointment completed|Dentrix, Eaglesoft, Open Dental ⚠️ (often servers in the office; integrators like NexHealth)|L effort; Zapier/CSV first|No mention of treatment (avoid PHI)|**BAA required** [F4]; vendors must sign BAAs too|$99–299 (Birdeye/Podium territory)|
|**Medspa / chiro / PT**|Appointment checked out|Boulevard, Jane, Mindbody [F22], Vagaro ⚠️|Square/Mindbody/Zapier|Discreet; no service names|BAA for PT/chiro; medspa varies ⚠️|$79–149|
|**Veterinary**|Visit completed|ezyVet, Cornerstone, Shepherd ⚠️|Zapier/CSV|Use the pet's name warmly; **skip euthanasia / deceased visit types**|Not HIPAA (animals) ⚠️ but state privacy rules|$59–99|
|**Real estate**|Closing date|Follow Up Boss, kvCORE ⚠️|Zapier|Ask after closing + again 30 days later|Brokerage advertising rules ⚠️|$39–59 per agent|
|**E-commerce (Shopify)**|`orders/fulfilled` or `fulfillments/update` delivered [F21]|Shopify|App Store needs mandatory compliance webhooks [F21]|Only for stores with a physical location (Google review)|GDPR-style `customers/redact` handling [F21]|Low fit; skip|

**Which connector next:** **Square** (one OAuth covers salons, auto, cafés, retail and spas) → **Clio** (simple webhook, high value per client) → **Mindbody** (needs approval, PHI-filtering work) → ServiceTitan / Toast (partner programs, slow).

---

## 4. Innovation bets: Impact × Feasibility (scores are 1–5 each)

| Bet | Impact | Feasibility | Score | Evidence |
|---|---|---|---|---|
|**Published on the Jobber Marketplace** (distribution + lifts the 5-account cap)|5|4|**20**|[F11]|
|**Real SMS** (toll-free → 10DLC ISV)|5|4|**20**|[F5]|
|**Policy-safe request page + private-feedback recovery alerts**|4|5|**20**|[F15][F2]|
|**QR / NFC kit** (QR now; NFC cards as a $15 add-on — NFC stores the same URL, so it's trivial)|4|5|**20**|Google endorses QR [F1]|
|**Weekly "you vs. 3 nearby competitors" review-count email**|5|4|**20**|NiceJob sells this on Pro only [F6]; GatherUp charges $125+ per location for competitor views [F7]. ⚠️ Places API terms on storing data|
|**AI reply drafts**: copy-paste now → GBP API one-click later|4|4|**16**|GBP Reviews API reply exists; 14-day access review [F17]; Google reply guidance [F1]|
|**Square connector**|5|3|**15**|[F13][F19]|
|**Multi-location + franchise pack** (Jobber franchise apps get a "lighter review" for more than 5 accounts [F11])|4|3|12|[F11][F7]|
|**Agency white-label**|4|3|12|Grade.us model [S2]|
|**Photo prompt** on the request page ("Photos help neighbors; add one of the finished job"), a suggestion only, no required content|3|4|12|Google bans *requesting specific content* [F15]; suggesting a photo is generic ⚠️ borderline; keep it optional|
|**Review-velocity safety alerts** ("you sent 300 asks today; Google may flag unusual volume")|3|5|15|Google lists "unusual volumes or patterns" as manipulation [F15]|
|**Contractor referral loop** (owner gives $50, owner gets 1 free month; reward goes to *owners*, not reviewers)|3|4|12|No review incentive involved, so policy-safe|
|**Video testimonials**|2|2|4|Not on Google; low priority|
|**Clio connector** (legal)|3|4|12|[F20]|
|**HIPAA track** (BAA paperwork, BAAs from vendors, PHI-stripping)|4|2|8|[F4][F16]|

**What we can do that incumbents don't:**
1. **$39 with AI replies + competitor tracking included.** NiceJob charges $125 for these. [F6]
2. **"We never filter reviews" as a stated guarantee.** Compliance is a selling point, especially since GatherUp now sells a "Transparency Certificate". [F7]
3. **Set up in under 3 minutes** from Jobber Marketplace one-click install.
4. **Simple language for owners who aren't tech people.**

---

## 5. 30 / 60 / 90 days (assumes the product is live)

### Days 0–30: Unlock distribution + SMS + trust
- [ ] Fix `lib/email.ts`: real unsubscribe (`/u/[token]` + `suppressions` table) + neutral wording (no "if we did a good job").
- [ ] **Jobber App Review submission:** turn on Refresh Token Rotation, subscribe to APP_DISCONNECT, test reconnect, test account, logo and gallery, Manage App URL, 2FA. Until then, stay at **5 Jobber accounts or fewer**. Don't spread the connect link around. [F11]
- [ ] **Twilio**: buy a toll-free number + submit verification (sample messages, opt-in description, privacy URL); implement `sendSms`, STOP/HELP, quiet hours, delivery status webhook. Start the ISV brand flow in parallel. [F5]
- [ ] **`/r/[token]` request page** (Google button + private-feedback link) + click tracking + owner alert on private feedback.
- [ ] **QR kit + printable PDFs**; `/q/[biz]` captures name and phone and sends the ask by text.
- [ ] **Apply for GBP API access** from an @getreviewask.com address. [F17]
- [ ] Places-lookup onboarding + "send me a test."
- [ ] GTM: landing pages for /hvac, /plumbing, /cleaning, /auto-repair, /salons, each using vertical templates.

### Days 31–60: Retention + second connector
- [ ] **Square OAuth connector** (`payment.updated` COMPLETED + optional `booking.updated`; customer lookup through the Customers API). [F13][F19]
- [ ] AI reply drafts (copy-paste version); weekly email: asks, clicks, estimated new reviews, **competitor counts**.
- [ ] Team seats + per-tech ask counts; duplicate guard; send delay / skip weekends.
- [ ] Spanish templates; template word filter (blocks incentive words).
- [ ] Annual plan push ($390) + NFC card bundle.
- [ ] GTM: Square App Marketplace listing ⚠️ (submission process not checked); salon and auto outbound lists.

### Days 61–90: Expand & upmarket
- [ ] GBP API: list new reviews → alert → one-click AI reply post (with the owner's authorization). [F17]
- [ ] Multi-location + franchise pack (Jobber franchise review route [F11]); agency white-label beta.
- [ ] Clio connector (daily webhook renewal job; HMAC check on `X-Hook-Signature`). [F20]
- [ ] HIPAA readiness checklist: our own BAA template [F4], BAAs from Twilio/Resend/Render ⚠️ (availability not checked), PHI-stripping at intake, then a dental/medspa pilot at $99.
- [ ] Pricing test: Starter $39 / Pro $69 (AI auto-replies, competitors, multi-platform links).

**Path from 10 to 100 paying customers (estimates ⚠️):**

| Channel | Customers | What it depends on |
|---|---|---|
| Jobber Marketplace | 30–50 | Getting published |
| Square vertical outbound | 20–30 | Square connector shipped |
| QR / walk-in | 10–20 | QR kit shipped |
| Agencies / referrals | 10+ | White-label tier and referral loop |

---

## 6. GTM for verticals beyond HVAC (short version)
- **Salons:** "Text every client a Google link at checkout — $39, no contract." Channels: Square marketplace, Instagram DMs, local beauty-supply bulletin boards.
- **Auto shops:** "Counter QR + text after pickup." Channels: Tekmetric/Shopmonkey user Facebook groups ⚠️, ASA chapters ⚠️.
- **Cleaning / lawn:** a Jobber-first message ("1 click inside Jobber").
- **Legal:** "Asks only after the matter closes, automatically from Clio." Lead with the ethics-safe angle.
- **Avoid for now:** restaurants (low price per location; Toast partner process is slow [F14]) and dental (needs the BAA first [F4]).

---

## 7. Sources

**Fetched and read myself (22 URLs):**
- F1 Google Business Profile Help, "Tips to get more reviews": https://support.google.com/business/answer/3474122
- F2 FTC, "Soliciting and Paying for Online Reviews: A Guide for Marketers": https://www.ftc.gov/business-guidance/resources/soliciting-paying-online-reviews-guide-marketers
- F3 Yelp, "Don't Ask for Reviews": https://www.yelp-support.com/article/Don-t-Ask-for-Reviews?l=en_US
- F4 HHS, Business Associate Contracts (sample provisions): https://www.hhs.gov/hipaa/for-professionals/covered-entities/sample-business-associate-agreement-provisions/index.html
- F5 Twilio, Programmable Messaging and A2P 10DLC: https://www.twilio.com/docs/messaging/compliance/a2p-10dlc
- F6 NiceJob pricing: https://get.nicejob.com/pricing
- F7 GatherUp pricing: https://gatherup.com/pricing/
- F8 Podium pricing: https://www.podium.com/pricing
- F9 Birdeye pricing: https://birdeye.com/pricing/
- F10 ServiceTitan developer portal: https://developer.servicetitan.io/
- F11 Jobber App Review Process: https://developer.getjobber.com/docs/publishing_your_app/app_review_process/
- F12 Housecall Pro, How to Enable Webhooks: https://help.housecallpro.com/en/articles/5683520-how-to-enable-webhooks
- F13 Square Bookings API webhooks: https://developer.squareup.com/reference/square/bookings-api/webhooks
- F14 Toast API overview: https://doc.toasttab.com/doc/devguide/apiOverview.html
- F15 Google Maps UGC prohibited & restricted content: https://support.google.com/contributionpolicy/answer/7400114
- F16 HHS FAQ on conduits (USPS, couriers): https://www.hhs.gov/hipaa/for-professionals/faq/245/are-entities-business-associates/index.html
- F17 Google Business Profile APIs FAQ: https://developers.google.com/my-business/content/faq
- F18 Broadly pricing: https://broadly.com/pricing/
- F19 Square Payments API webhooks: https://developer.squareup.com/docs/payments-api/webhooks
- F20 Clio webhooks guide: https://docs.developers.clio.com/guides/clio-manage/webhooks/
- F21 Shopify webhooks reference: https://shopify.dev/docs/api/webhooks
- F22 Mindbody Webhooks API: https://developers.mindbodyonline.com/WebhooksDocumentation

**From search snippets only (not fetched):**
- S1 Jobber App Listing Details / Getting Started / Testing: https://developer.getjobber.com/docs/publishing_your_app/app_listing_details/ and https://developer.getjobber.com/docs/building_your_app/testing_your_app/ (the 5-account Draft cap is confirmed in F11)
- S2 Grade.us plans: https://www.grade.us/home/plans/ (the fetch of /pricing returned 404)

**Tried but failed:**
- Twilio Help Center A2P fee and how-to articles (needed JavaScript)
- grade.us/pricing (404)
- Jobber /docs/app_marketplace (404)
- Housecall docs root (404)
- birdeye.com/broadly (404)
- Google BP answer 7035772 (timed out)
- FTC rule page (404)

**Still unconfirmed ⚠️:**
- 10DLC fee amounts
- Toll-free verification timeline
- Whether Twilio, Resend and Render will sign BAAs
- Places API pricing and storage terms
- The Square App Marketplace submission process
- Tekmetric / Shopmonkey / Dentrix / Boulevard APIs
- Willingness-to-pay estimates
- State bar testimonial rules
