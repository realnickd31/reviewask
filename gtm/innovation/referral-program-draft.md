# Referral program ops brief: "Give a month, get a month" (DRAFT, for Nick. Not built, nothing sent)
Updated ~5:00 AM ET, Oct 27 2026. **No billing code and no Stripe coupons or credits have been created.**

## Offer (one line)
Refer another field-service owner (Jobber, Housecall Pro, or neither). When they pay their first month, **you both get one month free ($39 credit each)**. Agencies/partners: a separate track, 20% recurring **[SPEC, not decided]**.

## Eligibility
- **Referrer:** an active paying account (not trialing, not past due).
- **Referee:** a new business (different owner, business name and domain). Their first $39 invoice is paid and not refunded or disputed within 14 days.
- No self-referrals and no reward for re-signups of a cancelled account. One reward per referee.
- Annual plans ($390/yr): the credit is still $39 and applies to the next invoice **[SPEC: confirm with Nick]**.

## Manual ops (until there are more than 10 referrals a month)
1. **Capture:** the referee tells us who sent them (signup note or reply to the welcome email). A `?ref=` link comes later, only if Nick OKs coding it.
2. **Check (2 min):** in the Stripe Dashboard, confirm the referee's first invoice is paid and 14 days old, and that the card or email domain doesn't match the referrer.
3. **Reward:** Nick applies a $39 credit to each customer by hand in the Stripe Dashboard. Use whatever credit method is already in his account; this brief doesn't define one.
4. **Log** in a sheet: referrer, referee, first-paid date, credit date, notes.
5. **Notify** both with the templates below, sent by Nick.

## Abuse notes
- Watch for a matching card fingerprint or email domain, the same Google review link, or the same Jobber/HCP account.
- Self-referral by a cancel-and-resignup loop: no reward if the email or review link matches a past account.
- Price is low, so fraud risk is low. Review if referrals go above 20% of signups or anyone earns more than 3 credits a month **[SPEC thresholds]**.

## Copy (DRAFT, needs Nick's OK before any use)
**In-app card (dashboard, after the 5th review or on day 30):**
> **Know another owner who forgets to ask for reviews?** Send them to ReviewAsk. When they become a paying customer, you both get a month free.
> [Copy my referral note]

**Referral note the customer forwards (plain text):**
> I use ReviewAsk to ask for Google reviews automatically after every job (works with Jobber and Housecall Pro, or by spreadsheet). $39/mo, 7-day free trial: getreviewask.com. Tell them {{Referrer business}} sent you and we both get a month free.

**Reward email (Nick sends, both parties):**
> Subject: You've earned a free month of ReviewAsk
> Hi {{First}}, {{Other business}} just became a ReviewAsk customer {{through you / after hearing about us from you}}. We've added a $39 credit to your account, which covers your next month. Thanks for passing it on. Nick

## Needs Nick's OK before anything is coded or used
1. The offer itself ($39 each side, no cap) and whether annual plans count.
2. How credits are applied in Stripe (his manual method). **No coupons are created until he decides.**
3. Whether to build `?ref=` capture at signup, plus the dashboard card.
4. The copy above.
5. Whether to run the partner/agency track at all.

## Cost note
$39 per side per successful referral. Payback depends on retention, which isn't measured yet **[SPEC]**.
