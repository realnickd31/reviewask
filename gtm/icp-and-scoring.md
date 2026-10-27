# ReviewAsk — Ideal Customer Profile & Lead Scoring (v1, Oct 27 2026)

## Who converts (core ICP)
A **US local service business that runs its jobs in Jobber (Core / Connect / Grow, not Plus)**, owner-operated or ≤10 people, actively completing jobs every week, with **fewer Google reviews than its job volume deserves** and no review tool already.
Any vertical works: lawn/landscaping, tree, pressure washing, window cleaning, house/commercial cleaning, pool, pest, handyman, detailing, HVAC, plumbing, electrical, appliance repair, gutters, junk removal, painting, irrigation, etc.

Why: Jobber's own review asks sit in the **Marketing Suite at $99/mo** for Core/Connect/Grow, and are included only in Plus ($280+/mo) — https://www.getjobber.com/pricing/ . ReviewAsk is $39/mo month-to-month. That's the wedge.

Secondary ICP: Housecall Pro shops (connect UI live; full auto-ask still being verified — sell as "early access"), and any non-Jobber shop with a clear review gap (manual "Quick ask" works for them).

## High-intent signals (in order of strength)
1. Public Jobber link on site/Nextdoor/Facebook/LinkedIn (`clienthub.getjobber.com/...work_request`, `/booking/`, "Powered by Jobber", Client Hub login). **Proof they use Jobber.**
2. Review count low vs. job volume (e.g. weekly recurring service but <50 reviews) or vs. top 3 Maps competitors in the same city+category (gap ≥3×).
3. Recent activity: posts in last 60 days, "booked out" posts, seasonal pushes, hiring.
4. Owner name visible / owner answers the phone; gmail/icloud contact (owner reads it).
5. Website brags about reviews ("60+ 5-star reviews") → they care but are asking by hand.
6. Pain posts: Reddit/Jobber community/FB complaints about Marketing Suite price or "how do I get more reviews".
7. Pays for NiceJob/Podium/Birdeye/Broadly (widget on site) → price/contract displacement.

## Disqualifiers
- On Jobber **Plus** (review asks included) or already happy on Jobber Marketing Suite with steady reviews.
- 300+ reviews with strong recent velocity (no pain).
- Healthcare needing HIPAA/BAA (dental/medical) — not ready.
- No consumer customers (pure B2B/wholesale/"trade-only") or no Google Business Profile.
- Franchise locations where corporate controls marketing tools.
- Outside US/Canada for now (US first). Canada OK later (CASL consent rules stricter).
- Rating <3.5 with recent angry reviews (asks won't fix ops issues; reputational risk).

## Scoring rubric (0–100)
| Factor | Weight | Points |
|---|---|---|
| **Jobber signal** | 30 | 30 = Jobber link/widget seen publicly; 15 = tech-detect directory only; 5 = other FSM (HCP) ; 0 = none |
| **Review gap** | 25 | <25 reviews = 25; 25–49 = 20; 50–99 = 14; 100–199 = 8; 200+ = 2; unknown = 10. (+5 bonus, cap 25, if ≥3× behind top Maps competitor) |
| **Size / owner-operated** | 15 | ≤10 staff = 15; 11–20 = 10; 21+ = 4; unknown = 10–12 |
| **Geography** | 10 | FL/GA/NC/SC/TN/AL (Nick's network & Southeast focus) = 10; other US = 5 |
| **Reachability** | 10 | Public email = 10; phone only = 5; none = 0 |
| **No incumbent review tool** | 10 | None detected = 10; NiceJob/Podium/Birdeye etc. = 0 (but tag for displacement sequence) |
| Penalty | — | −10 if site shows Housecall Pro/ServiceTitan as primary FSM (wrong integration until HCP e2e is live) |

**Tiers:** 85+ = Hot (personal email + call within 48h) · 70–84 = Warm (sequence) · 50–69 = Nurture (newsletter/marketplace) · <50 = skip.

Scores in `prospects_overnight.csv` were computed with exactly this rubric (competitor-gap bonus not applied — not checked tonight).
