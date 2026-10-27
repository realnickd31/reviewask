# Referral program draft: "Give a month, get a month"

**Offer:** When a shop you refer pays its first month, you both get 1 free month ($39 credit). No cap. Partners/agencies get 20% recurring instead (separate track).

## Copy
- In-app/email: "Know another owner who forgets to ask for reviews? Send them your link. When they become a paying customer, you both get a month free."
- Link format: `getreviewask.com/?ref=CODE` (code = short business slug).

## Ops (simple and manual until there are more than 10 referrals)
1. Code: a Stripe promotion code per customer, or a `ref` param stored at signup (website agent builds the capture; nothing changed here).
2. Qualifying: the referee's first invoice paid, not refunded within 14 days, different business/owner, no self-referral (check card fingerprint and domain).
3. Reward: apply a $39 Stripe customer balance credit to both. Log it in a sheet: referrer, referee, date paid, credit applied.
4. Notify both by email (template below). **Needs Nick's OK + billing support.**
5. Ask moments: right after a customer's 5th new review comes in (they're happiest then), and on day 30.

## Notification template
Subject: You've earned a free month of ReviewAsk
Body: "{{Referee}} just joined ReviewAsk from your link. We added a $39 credit to your account. Thanks for spreading the word. Nick"

## Risks
Credit cost is $39 per side, against an LTV of about $39 × the months a customer stays **[SPEC]**. Fraud is low at this price point. Revisit if referrals go above 20% of signups.
