# ReviewAsk: demand and competitor research, pass 2
_Rewritten Oct 26 2026, ~1:45 AM ET. Supersedes pass 1._

## Sourcing legend and honesty notes
- **[F]** means I fetched the page myself and read it in full.
- **[S]** means I only saw a search-engine excerpt of the page, not the full page. The quote is real user or vendor text, but I couldn't see its context.
- **[SPEC]** marks my own inference or speculation.
- **Pass-2 fetches:** 17 succeeded. Another 15 failed:
  - Reddit www, old.reddit and curl `.json`: 403 every time (9 attempts).
  - G2 NiceJob and G2 Podium: timed out.
  - Capterra Podium and Grade.us pricing: 404.
  - Capterra "Birdeye" URL: returned Slack's page instead.
  - Two old Jobber help-center URLs: 404.
  - Trustpilot: blocked by a captcha in pass 1; I skipped it this pass.
- **What this means for the evidence:**
  - All Reddit evidence below is **[S]**: search-index excerpts of real threads.
  - **I couldn't mine G2 at all.** The review mining comes from Capterra for **NiceJob** and **GatherUp** only.
  - Birdeye and Podium complaints come from third-party summaries plus Reddit **[S]**, which is weaker evidence.

---

## 0. Corrections to pass 1 (read these first)
1. **I retract the "Jobber Reviews is a $39/mo add-on" claim. It is out of date.**
   - Jobber's own add-ons help article says marketing tools, Reviews included, are sold *only* through **Marketing Suite**. That article lists "Campaigns, Reviews, Referrals, Job Showcase, Social Posting, Marketing Plan" [S, help.getjobber.com/en/articles/add-on-features-to-your-jobber-plan-subscription/].
   - The Jobber pricing page lists **Marketing Suite at $99/mo**, as an add-on for Core, Connect and Grow. It's included in Plus, which costs $280–$529/mo billed annually [F, https://www.getjobber.com/pricing/].
   - The pricing page still has a stale footnote: "*feature available when Reviews add-on is enabled*" [F, same page].
   - A third party agrees there's no standalone price shown [S, https://reviewjet.com/blog/jobber-marketing-suite-pricing].
   - **Net: a Jobber Core, Connect or Grow user today pays $99/mo for Jobber's review asks, or ~$280+/mo on Plus. ReviewAsk at $39 is less than half.** This *improves* the case for ReviewAsk versus pass 1.
2. **The Apr 17 2026 Google policy change is verified, but the scope I gave in pass 1 was wrong.**
   - **What's real:** two new lines in Google's Maps policy, which I read live today [F, https://support.google.com/contributionpolicy/answer/7400114]:
     - "Merchants requesting that staff solicit a certain number of reviews"
     - "Merchants requesting that staff solicit reviews that include specific content, including content that identifies a staff member."
   - **When:** Search Engine Roundtable dates the change to Apr 17 2026 [F, https://www.seroundtable.com/google-reviews-policy-staff-mentions-solicitations-41175.html].
   - **What I got wrong:** pass 1 implied that "asking for 5 stars" became newly banned that day. It didn't. That was already covered by the older line, "without… attempting to influence the rating or the contents of the review."
   - **On the vendor source:** the ReviewBuzz write-up [F] is a vendor marketing piece and blends these two things together.
3. **Housecall Pro's Gmail-only routing is confirmed in HCP's own docs:** "Only customers with @gmail.com… will be directed to Google… Those customers who do not have a Gmail email will be directed to leave a Housecall review" [S, https://help.housecallpro.com/en/articles/11481139-reviews-faqs]. Customers can override it via "Edit distribution", but one article says that requires **Premium Reviews** [S, https://help.housecallpro.com/en/articles/2748926].

---

## 1. Executive takeaways (ranked by impact on ReviewAsk)
1. **Price position vs Jobber is much stronger than I thought.**
   - ReviewAsk is $39 month-to-month. Jobber's review asks cost $99/mo (Marketing Suite) or come with the $280+ Plus plan [F, Jobber pricing].
   - **Pitch:** "Jobber review asks without the $99 Marketing Suite."
   - This is the sharpest wedge for the Jobber-first go-to-market (GTM).
2. **SMS is still the #1 product gap. Cheap rivals already ship it.**
   - **ReviewSimple Pro:** $34.99 for 300 email+SMS requests [F, https://getreviewsimple.com/].
   - **GatherUp:** includes up to 300 SMS per location [F, https://www.gatherup.com/pricing/].
   - **NiceJob Starter:** "SMS & email review requests" for $75 [F, https://get.nicejob.com/pricing].
   - **Jobber's own Reviews:** "Automatically send a text and email" [S, help article].
   - **ReputeMap** deliberately skips SMS. It says outright that SMS-first tools fit text-heavy businesses better [F, https://reputemap.com/review-request-software].
   - **Effect:** ReviewAsk's $39 for 200 *email-only* asks is currently a worse deal than ReviewSimple's $34.99.
3. **Housecall Pro wedge: "100% of your customers go to Google."**
   - HCP's default sends non-Gmail customers to an HCP-hosted review, and changing the split may need Premium [S, HCP docs].
   - HCP's default "Personalized" request names the technician and says "If we earned it, we'd love a quick review" [S, https://help.housecallpro.com/en/articles/16498830].
   - **[SPEC]** Naming the tech in the ask edges toward Google's new staff-identification line. That line targets merchants asking for *content* that identifies staff, so this is a gray area, not a clear violation.
4. **Filter and removal fear is real. "Filter-safe" sending is an unowned position.**
   - The Reddit evidence is repeated across threads, but anecdotal [S; links in §5].
   - The FTC itself treats "an unusually large number of reviews… in a very short period" as a red flag for fake reviews. That's FTC guidance on purchased reviews, not Google's algorithm, so the parallel is **[SPEC]** [F, https://www.ftc.gov/business-guidance/resources/consumer-reviews-testimonials-rule-questions-answers].
   - **Implication:** Bulk paste should drip-send by default.
5. **Gating is everywhere at the low end. ReviewAsk can own "honest by design."**
   - **QuickFeedback ($29):** "Customers who rate you 4 or 5 stars are taken straight to your Google review page. Customers who rate 1-3 stars can tell you privately… and they still see a link" [F, https://quickfeedback.app/].
   - **ReviewSimple:** a rate-first flow, then "Everyone gets your Google review link" [F].
   - **Capterra users openly praise gating.** GatherUp: "catches when they're unhappy and keeps the review from hitting sites" [F, Capterra GatherUp]. NiceJob users tag customers "noreview" [F, Capterra NiceJob].
   - **Google bans** "selectively solicit positive reviews" [F].
   - **The FTC** says asking only happy customers "could violate the FTC Act" [F, FTC Q&A].
   - **Tension:** buyers *want* to hear about unhappy customers privately. **[SPEC]** The safe version is a private-feedback option shown *alongside* the Google link for everyone, never instead of it. ReviewAsk can also offer a per-job "skip" toggle for warranty or dispute jobs. Skipping one job isn't sentiment routing, but it carries mild risk if overused.
6. **Technician leaderboards are standard at NiceJob ($75), but need care after Apr 17.**
   - NiceJob Starter includes a "Team Leaderboard – staff review rankings" [F].
   - ReputeMap ranks staff by link visits, "doesn't count reviews", and warns against quotas [F].
   - **Implication:** ReviewAsk should attribute by job assignee, never ask customers to mention names, and never show quota targets.
7. **Contract lock-in is still the top hate. Even competitors now market "no contract."**
   - NiceJob, GatherUp (month-to-month option), Broadly ("no long-term contract"), ReputeMap, QuickFeedback and ReviewSimple all advertise cancel-anytime [F, each page].
   - **Effect:** "No contract" is now table stakes rather than a differentiator. **In-app one-click cancel** is still differentiating, given complaints about Birdeye, Podium and HCP (§5).
8. **The suites are moving upmarket into "AI employees."**
   - **Podium:** its pricing page is now "AI employee… Jerry", with no published prices [F, https://www.podium.com/pricing/].
   - **Broadly:** $799/mo AI Workforce, or Reputation AI from $79 [F, https://broadly.com/pricing].
   - **Birdeye:** quote-only, organized by location tiers [F, https://birdeye.com/pricing/].
   - **[SPEC]** This leaves the "just reviews" niche to small players, which is good for ReviewAsk.
9. **Outside home services, the review ask is mostly built into vertical software.**
   - **Salons:** GlossGenius Gold, Vagaro text campaigns (~$20), Acuity follow-up email [S, r/hairstylist].
   - **Dental and medical:** NexHealth, Weave, Tebra, Birdeye, plus a HIPAA/BAA requirement [S, r/Dentistry, r/PrivatePracticeDocs].
   - **Restaurants:** Ovation, Toast-adjacent tools [S].
   - **Realtors:** RateMyAgent, CRM workflows [S].
   - **Law:** Clio tasks plus a manual link [S].
   - **Implication:** stay in trades, where Jobber and HCP gate review asks behind upsells. Dental and medical need a BAA, so skip them for now.
10. **Monitoring and AI replies are bundled almost everywhere at $19+.**
    - ReputeMap (all plans), GatherUp, Jobber's Reviews dashboard ("AI-generated responses") and NiceJob Pro all include them [F].
    - **[SPEC]** This becomes a near-term expectation once a customer passes the first month. It's not a first-sale blocker.

---

## 2. Jobs ReviewAsk already covers vs still missing
| Job the customer is hiring for | ReviewAsk today | Status | Competitor bar |
|---|---|---|---|
| Ask automatically when a Jobber job closes | Live end-to-end (JOB_CLOSED, client primary email and phone) | ✅ Covered | Jobber's own Reviews triggers on job close, visit complete or invoice paid [S] |
| Trigger on **invoice paid** instead of job close | Not offered | ❌ Gap (small) | Jobber, HCP and NiceJob all offer a paid trigger [S/F]. Avoids asking before payment disputes |
| Text the customer | Stubbed | ❌ **P0 gap** | Every serious rival; ReviewSimple does it at $34.99 |
| Email ask | Live via Resend | ✅ | Parity |
| Housecall Pro auto-ask | Connect UI live; e2e blocked on MAX | ⚠️ Partial | NiceJob integrates with HCP; HCP has its own built in |
| One-off "Quick ask" | Live | ✅ | ReputeMap and ReviewSimple have the same |
| Ask past customers in bulk | Bulk paste live | ⚠️ Risky | Needs drip and pacing (see §1 #4) |
| Follow-up for non-responders | Day-3 reminder live | ✅ | NiceJob "follows up intelligently"; ReputeMap gives one reminder; Feedback Guru up to 2 |
| Prove it's working | Proof dashboard live | ✅ (partial) | Rivals show *actual new Google reviews* through the Google Business Profile (GBP) API. **[SPEC]** If ReviewAsk shows only sends and clicks, it's a step behind |
| See and reply to reviews | None | ❌ P2 | ReputeMap (from $19), Jobber, GatherUp, NiceJob Pro |
| Per-tech attribution | None | ❌ P1 | NiceJob Starter leaderboard |
| QR code or printed card | None | ❌ P2 (cheap) | ReputeMap, QuickFeedback, ReviewSimple, Feedback Guru: all free or included |
| Skip a specific customer or job | Unknown | ❓ | NiceJob users rely on a "noreview" tag [F]; HCP has "Exclude customers" tags [S] |
| Non-Jobber/HCP sources | Zapier/webhook under Advanced | ⚠️ | QuickFeedback uses the same Zapier approach. Fine for power users, but jargon for this ICP |
| Cancel without a phone call | $39 month-to-month via Stripe | ✅ | Say "cancel in-app" explicitly |
| Policy-safe wording | Unknown | ❓ | ReputeMap markets "No review gating… FTC-aligned" heavily |

---

## 3. Feature and gap demand table
| Want | Evidence | Who | Priority vs ReviewAsk | Notes |
|---|---|---|---|---|
| Simple, cheap, text after the job | "I just need something that sends a text… a couple hours after I leave" [S, https://www.reddit.com/r/Contractor/comments/1s6wye2/] | Solo trades | **P0 (SMS stubbed)** | Needs A2P 10DLC registration; keep the message non-promotional with STOP language [S, https://reviewroket.com/resources/sms-review-request-compliance-tcpa/] |
| Avoid add-on nickel-and-diming | Jobber Marketing Suite $99 [F]; "reviews cost an extra $39… referrals another $29" (older pricing, quoted by Pavado) [S] | Jobber Core/Connect/Grow | **P0 messaging** | Pricing-page comparison |
| Every customer goes to Google | HCP Gmail-only default [S, HCP FAQ]; "If it's not a Google review, it's worthless" [S, https://www.reddit.com/r/Contractor/comments/1o8hq6p/] | HCP users | **P0** (fix MAX blocker) | |
| Don't lose reviews to the filter | "Over 50% reviews just disappears" [S, https://www.reddit.com/r/GoogleMyBusiness/comments/1syu6cl/]; "never batch ten on a friday" [S, https://www.reddit.com/r/localseo/comments/1ttdwbq/]; 94→80 reviews after a spike [S, https://www.reddit.com/r/GoogleMyBusiness/comments/1wjj05l/]; "deprioritizing reviews from a link" [S, r/hairstylist 1mff7c4] | Everyone | **P1** | All anecdotal. Google's documentation only says removals are for policy/spam [S, https://support.google.com/business/answer/10313341]. Ship pacing, and A/B test a "search us on Maps" variant **[SPEC]** |
| Hear from unhappy customers privately | QuickFeedback and ReviewSimple pitch it [F]; Capterra users praise it [F]; doctors gate openly [S, r/PrivatePracticeDocs 1u3teh0] | All verticals | P2, **must be non-gating** | Show the private-feedback option alongside the Google link, for every customer |
| Skip a particular customer | NiceJob "noreview" tag [F, Capterra]; HCP "Exclude customers" [S] | Trades with warranty or callback jobs | P2 | Per-job manual skip; log reasons **[SPEC]** |
| Tech leaderboard | NiceJob Starter [F]; ReviewBuzz/TapTools [F] | Multi-tech HVAC and plumbing | P1 | Attribute by job assignee; no quotas (Google, Apr 17) |
| Fewer "pestering" defaults | NiceJob: "Default settings can make customers feel 'pestered'" [F, Capterra]; "The amount of times it send the review request" [F, Capterra] | Owners protective of customers | P1 (cheap) | Cap at 1 reminder; stop when the review is detected |
| Customize wording and timing | NiceJob: "restrictive if you want more flexibility in how review requests are timed, worded" [F]; GatherUp: "forced to use the one generic template" [F] | Owners and agencies | P2 | Plain-text-looking email; editable SMS |
| More texts per dollar | GatherUp user: "more than 300 SMS credits… seems low" [F] | Higher-volume shops | P2 | Watch the 200-ask cap at $39 |
| Price sensitivity at the low end | NiceJob users: "price feels a little high when you're just starting"; "If there was a smaller package it would be great" (re $75) [F, Capterra] | Startups, solos | Confirms the $39 tier | |
| Transparent pricing | GatherUp reviewer: "pricing is confusing… always a red flag" [F]; Podium and Birdeye quote-only [F] | All | ✅ already | |
| Reply to reviews (AI draft + approve) | Jobber, ReputeMap, GatherUp, NiceJob Pro [F]; owners want a human in the loop [S, https://www.reddit.com/r/GBPManagers/comments/1ojva2y/] | 20+ reviews/mo | P2–P3 | |
| QR or tap card at the door | Tappty 1-year thread [S, https://www.reddit.com/r/Tappty/comments/1cujopy/]; stylist: in-person ask works, "99% of the time they will literally write it from their car" [S, r/hairstylist 1mff7c4] | Trades, salons | P2 | |
| HIPAA/BAA | r/MedSpa, r/PrivatePracticeDocs [S] | Dental and medical | Out of scope | Needs a BAA |

---

## 4. Competitor teardown (primary-page figures where marked [F])
| Competitor | Price | ICP | Killer features | Weak spots to exploit |
|---|---|---|---|---|
| **Jobber Reviews** | Via $99 Marketing Suite, or Plus $280–$529/mo annual [F] | Jobber users | Native triggers (job close, visit, invoice paid), GBP dashboard, AI replies, nearby comparisons [F feature page; S help] | $99 bundle when you only want reviews; only admins see the dashboard [S] |
| **Housecall Pro Reviews** | Included from Basic $59; distribution control needs Premium [S] | HCP users | Auto on "Finish", AI-personalized asks [S] | **Non-Gmail customers go to HCP or Facebook by default**; HCP reviews can't be moved to Google [S]; names the tech in the ask |
| **NiceJob** | $75 Starter / $125 Pro, no contract, 14-day trial [F] | Small and medium trades | SMS+email, widgets, social sharing, **team leaderboard**, microsite; Pro adds AI replies, referrals, NPS, competitive intel [F] | ~2× ReviewAsk's price; "pestered" defaults; limited customization; basic reporting; "some reviews only get posted via NiceJob only and not on Google" [F, Capterra] |
| **GatherUp** | $99/mo 1 location (annual), $60/location multi; month-to-month available; Review Defense $45–$300/location annual-only [F] | Agencies, multi-location | NPS, monitoring of 100+ sites, AI replies, 300 SMS/3,000 email, Zapier/API, kiosk [F] | Confusing pricing, price creep ("price has gone up… support quality has gone down"), linear flow, generic template [F, Capterra] |
| **Podium** | Not published; "AI employee Jerry" [F]. Third-party reports: $399–$599+, 12-month auto-renew [S] | Messaging-heavy shops | Inbox, phones, payments, webchat [F] | Opaque pricing, annual contracts, BBB and Trustpilot complaints (third-party [S]) |
| **Birdeye** | Not published; location-tier quotes [F] | Multi-location, healthcare | Breadth, "#1 on G2" [F] | Reddit: "low review volume, difficult cancellation, auto-renewal" [S, r/smallbusiness 1jw5hja]; "continue to charge even after you ask them to stop" [S, r/PrivatePracticeDocs] |
| **Broadly** | $799 package, or Reputation AI $79–$89, Premium "call"; $350 setup on tiers [F] | Owner-operators wanting done-for-you | AI receptionist plus reviews; integrations claimed with HCP, ServiceTitan [F] | Automated *requesting* is only on the "call for pricing" tier [F]; setup fees |
| **ReputeMap** | $19–$189, locations included; trial needs a card [F] | Multi-location, agencies | Inbox, AI drafts, 1–3★ alerts, QR, staff link leaderboard, API/MCP [F] | **No SMS** [F]; no field-service software (FSM) triggers |
| **QuickFeedback** | $29 unlimited, 5 profiles [F] | Generic local businesses | Reminder, Zapier/webhook triggers, private alerts [F] | **4–5★ vs 1–3★ split** is gating-adjacent [F]; no native FSM integration |
| **ReviewSimple** | $19.99 email / **$34.99 SMS+email, 300 asks** [F] | Barbers, salons, contractors | SMS, QR, Yelp [F] | Rate-first flow; no FSM triggers |
| **Feedback Guru** | Free / $19 / $49 per location [F] | DIY | Link, QR, 2 reminders [F] | No SMS, no integrations; can't count posted reviews [F] |
| **Grade.us** | Couldn't verify (pricing page 404) | Agencies | White-label | Thin source |

---

## 5. Customer language (verbatim)
**Home services**
- "The big review platforms (Podium, Birdeye, etc.) are way overkill for what I need and cost a fortune." [S, r/Contractor 1s6wye2]
- "If it's not a Google review, it's worthless in my opinion." [S, r/Contractor 1o8hq6p]
- "Run!!!! Housecall Pro sucks if you want to cancel." [S, same thread]
- "In the first 6 months, we more than doubled the number of Google reviews we'd received in the previous 15 years!" (NiceJob, home services) [F, Capterra]
- "We literally don't even have to press a button, as soon as we close a job it automatically gets sent." (NiceJob) [F, Capterra]
- "I feel like $75 is a GREAT deal… But as a small company all monthly expenses provide a challenge. If there was a smaller package it would be great." [F, Capterra NiceJob]

**Filter and removal fear**
- "Direct review links are triggering the spam filters." [S, r/GoogleMyBusiness 1syu6cl]
- "Appeals are a coin flip… anything pulled for policy never came back." [S, r/localseo 1ttdwbq]

**Gating desire (shows the demand, but don't build it)**
- "Then they can berate us directly instead of posting it to the internet!" (dental, NexHealth) [S, r/Dentistry 155kbgf]
- "We make sure to send link only to the patients whom we feel are happy." [S, r/PrivatePracticeDocs 1u3teh0]

**Salons**
- "I am very happy with Vagaro but it doesn't offer this feature." [S, r/hairstylist 1vs1to7]
- "They don't nickel and dime me for every feature." (GlossGenius) [S, same]

**Pricing and support**
- "Pricing is confusing… always a red flag!" [F, Capterra GatherUp]
- "Customer support quality has decreased, and the price has gone up steadily." [F, Capterra GatherUp]

---

## 6. Anti-patterns (what shops hate)
- Quote-only pricing and demos required (Podium, Birdeye, Broadly Premium) [F]
- Annual auto-renewal and cancellation runarounds [S]
- Bundles that force paying for unused modules ($99 Jobber suite; GatherUp reviewer: "features… we did not want to use but could not avoid paying for") [F]
- Reviews landing on a vendor or internal page instead of Google (HCP default; NiceJob reviewer) [S/F]
- Over-asking customers ("pestered") [F]
- Generic, branded-looking emails [F]
- Price creep after signup [F]

---

## 7. Compliance notes for ReviewAsk
- **Google Maps policy** [F]:
  - No incentives.
  - No selective solicitation.
  - No pressure on the premises.
  - No requested content (including staff identity).
  - No staff quotas.
  - "Unusual volumes or patterns" get removed, which supports the case for pacing.
- **FTC Consumer Reviews Rule** (16 CFR 465, effective Oct 21 2024) [F, FTC Q&A]:
  - Generalized solicitation of all purchasers is explicitly carved out (§465.2(d)).
  - Happy-only asks "could violate the FTC Act."
  - Reputation-management firms *can* be liable.
  - **[SPEC]** That liability point is a reason ReviewAsk should not build gating.
- **SMS:** register A2P 10DLC, keep the ask transactional and non-promotional, and honor STOP [S, ReviewRoket].
  - Podium passes a 10DLC fee through to customers (third-party report [S]).
  - **[SPEC]** Absorb that fee into the $39 rather than itemizing it.

---

## 8. Roadmap implications (re-prioritized)
1. **P0: Ship SMS with 10DLC.** Without it, ReviewSimple's $34.99 SMS plan undercuts ReviewAsk.
2. **P0: Pricing and landing copy:**
   - "Jobber review asks without the $99 Marketing Suite" (cite Jobber's pricing page).
   - "Housecall: every customer goes to Google, not just Gmail users."
   - "Month-to-month, cancel in-app."
3. **P0/P1: Unblock Housecall Pro end-to-end (the MAX-plan blocker).**
4. **P1: "Filter-safe sending":**
   - Daily cap, plus drip-sending for Bulk paste.
   - A single reminder only.
   - Stop asking once a review is detected (needs a GBP read).
5. **P1: Honest-by-design ask:**
   - Same Google link for everyone.
   - An optional "tell us privately" link shown *alongside* it.
   - Template checker that flags star or staff-name wording.
6. **P1: Tech leaderboard by Jobber assignee,** with no quotas.
7. **P2:**
   - Invoice-paid trigger.
   - Per-job skip.
   - QR card PDF.
   - GBP read for actual review counts in the proof dashboard.
   - AI reply drafts.
8. **Defer:** dental and medical (needs a BAA), restaurants (Ovation/Toast own it), agencies (GatherUp, ReputeMap).

## 9. Still not done (suggested pass 3)
- G2 review mining for all four vendors (timed out).
- Trustpilot (captcha).
- Full Reddit threads, which need a logged-in browser or the Reddit API.
- ServiceTitan and Square review features.
- Facebook groups.
- ContractorTalk.
- YouTube comments.
