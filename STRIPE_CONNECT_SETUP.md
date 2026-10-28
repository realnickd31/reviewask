# Stripe Connect (seller) integration setup — no secrets in this file

Separate from ReviewAsk's own billing (`lib/stripe.ts`, `/api/stripe/checkout|portal|webhook`, `STRIPE_WEBHOOK_SECRET`) — those are untouched.

Flow: Standard Connect OAuth (`connect.stripe.com/oauth/authorize`, scope `read_write`) → `stripe.oauth.token` with the platform
`STRIPE_SECRET_KEY` → we store only `stripe_user_id` (acct_…) and call the API as the platform with the `Stripe-Account` header.
Access/refresh tokens are not stored.

## Stripe Dashboard (same account as billing)
1. Connect → get started / enable Connect (platform). Settings → Connect → **Onboarding options → OAuth**: enable OAuth for Standard accounts, copy **Client ID** (`ca_…`).
2. Same page → Redirects: add `https://getreviewask.com/api/stripe-connect/callback`.
3. Developers → Webhooks → Add endpoint → **Listen to events on Connected accounts**:
   - URL `https://getreviewask.com/api/stripe-connect/webhook`
   - Events: `charge.succeeded`, `account.application.deauthorized`
   - Copy its signing secret (`whsec_…`, different from the billing webhook secret).

## Render env vars (srv-dbfbc94s728c73epr4bg)
- `STRIPE_CONNECT_CLIENT_ID` (ca_…)
- `STRIPE_CONNECT_WEBHOOK_SECRET` (whsec_… of the Connect endpoint)
- Optional `STRIPE_CONNECT_REDIRECT_URI` (default `<base>/api/stripe-connect/callback`)
- Existing `STRIPE_SECRET_KEY` is reused (OAuth client secret + API calls). Test-mode key ↔ test client id; live ↔ live.

## Behavior
Primary event `charge.succeeded`: charge re-fetched on the connected account (customer expanded); skipped if not paid,
refunded/partially refunded, or no email/phone. Contact = Customer name/email/phone → billing_details → receipt_email.
Then `sendReviewRequest(u, contact, "webhook")`. Deduped by charge id in `stripe_connect_events`.
Disconnect calls `oauth.deauthorize` and clears; `account.application.deauthorized` clears too.
On connect: `auto_enabled=1`, `auto_provider='stripe'` unless already jobber/housecall/square.
