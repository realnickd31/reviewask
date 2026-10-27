# Jobber demo-day checklist (ReviewAsk). For Nick. Updated ~4:55 AM ET, Oct 27 2026
Status: the app is **In Review** (requested ~11:46 PM ET Oct 26). Jobber emails the Developer Center address to book a live demo. **Don't submit or change anything in Developer Center until that email arrives.** This file is only for preparing.

## When the email arrives (≈15 min)
1. Pick the earliest slot you can do with a laptop, plus your phone if you want to show Quick ask.
2. Vault: open "ReviewAsk — Jobber App Review test" (jobber-review@getreviewask.com). Log in once at https://getreviewask.com/login to confirm it works. Check that status is trialing and that Jobber shows **Disconnected**. **Never paste the password into email or chat.** Share it only the way Jobber asks.
3. Have a Jobber test account ready that has one client with **your own email**, plus a job you can close live.
4. Open these tabs: getreviewask.com · /login · /settings#automatic · /dashboard · your inbox · the Jobber app.
5. Dry run once (5 min): Connect → close a job → email arrives → Disconnect. Then leave it **disconnected** for the demo.
6. Before the call, check that `JOBBER_APP_REVIEW_CHECKLIST.md` rows 3, 4, 11 and 13 (refresh token rotation, APP_DISCONNECT webhook, 2FA, webhook URL) are done.

## 10-minute walkthrough script
| Min | Show | Say |
|---|---|---|
| 0–1 | Homepage | "ReviewAsk does one thing: after every finished job, it asks the customer for a Google review. $39/mo, 7-day trial." |
| 1–3 | Log in → Settings → I use Jobber → **Connect Jobber** → Allow | "We only read clients and jobs, and use the JOB_CLOSED webhook." (Make sure the scopes match.) |
| 3–5 | In Jobber, close the test job → inbox → Dashboard | "An email goes to the client within about a minute. The Dashboard shows it as sent automatically." Click the button: it opens the Google review page. |
| 5–6 | Dashboard → Follow-up column | "One polite follow-up on day 3, never more. Every customer gets the same ask: no gating, no incentives." |
| 6–7 | Paste a spreadsheet / Quick ask | "For past customers, or jobs that don't come from Jobber." |
| 7–8 | Disconnect in Settings → Jobber listing shows Disconnected → reconnect from the listing | "This calls appDisconnect. Disconnecting in Jobber clears our tokens through APP_DISCONNECT." |
| 8–10 | Questions | See below |

## What works today (say yes)
- Email review asks, both automatic (Jobber JOB_CLOSED) and manual (Quick ask, Send form).
- Connect, disconnect and reconnect from either side. Refresh-token rotation is handled safely, and a revoked token disconnects cleanly.
- Bulk paste or upload from a spreadsheet, and one day-3 follow-up.
- Housecall Pro and non-Jobber users are covered through bulk upload and Quick ask.

## What to say about SMS
"Email works today. SMS is rolling out: the toll-free number's carrier verification is pending. Until it's approved, a phone-only ask is saved as **Queued**, never shown as sent." Don't promise a date.

## Known limits (say them before they ask)
- 200 review requests a month per account.
- Signup asks for a card at checkout for the 7-day Stripe trial (cancel before day 7 and nothing is charged). The reviewer account is already trialing, so reviewers skip this.
- Google review counts aren't pulled automatically (no Places API yet).
- One Google review link per account (no multi-location).

## Likely questions
- *Data?* Client name, email/phone and job close time, used only to send the ask. Privacy: getreviewask.com/privacy.
- *Write access?* None needed.
- *Support?* support@getreviewask.com.
- *Pricing vs Marketing Suite?* Keep it neutral on Jobber's call: "Focused, review-only tool."

## After the call
Write down any fixes Jobber asks for, with dates, in `gtm/OVERNIGHT_HANDOFF.md`. No public announcement until the listing is **Published**.
