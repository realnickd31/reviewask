# ReviewAsk

More 5-star reviews. Less awkward asking. One-tap Google review requests for local businesses — $39/mo (or $390/yr) with a 7-day trial via Stripe Checkout.

Stack: Next.js 14 (App Router) + TypeScript + Tailwind, SQLite (better-sqlite3, `data/reviewask.db`), iron-session email/password auth (bcrypt), Stripe Checkout + webhook + Customer Portal, Resend email (falls back to `data/outbox.json`).

## Run locally (no keys needed)
```bash
npm install
cp .env.example .env.local     # set NEXTAUTH_SECRET to 32+ random chars: openssl rand -hex 32
npm run dev                    # http://localhost:3000
npm run seed                   # optional: demo@reviewask.local / demo12345 (already active)
```
Without Stripe keys, "Continue to secure checkout" unlocks the account as `trialing` (dev only; disabled when `NODE_ENV=production`). Without `RESEND_API_KEY`, emails are written to `data/outbox.json` and shown as sent.

## Stripe setup (test mode, ~5 min)
1. Get keys at https://dashboard.stripe.com/test/apikeys → `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.
2. Create prices:
   ```bash
   stripe products create --name "ReviewAsk Starter"
   stripe prices create --product prod_XXX --unit-amount 3900 --currency usd -d "recurring[interval]=month"   # -> STRIPE_PRICE_ID
   stripe prices create --product prod_XXX --unit-amount 39000 --currency usd -d "recurring[interval]=year"   # -> STRIPE_PRICE_ID_ANNUAL (optional)
   ```
3. Webhook (local): `stripe listen --forward-to localhost:3000/api/stripe/webhook` → copy `whsec_...` into `STRIPE_WEBHOOK_SECRET`.
   Production: add endpoint `https://YOUR_DOMAIN/api/stripe/webhook` with events `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`.
4. Enable the Customer Portal: https://dashboard.stripe.com/test/settings/billing/portal (click Save once).
5. Restart `npm run dev`. Pay with card `4242 4242 4242 4242`, any future date/CVC.

The dashboard also syncs the subscription from `?session_id=` on return from Checkout, so the account unlocks even if the webhook is late.

## Email (Resend)
Set `RESEND_API_KEY` and `RESEND_FROM`. `onboarding@resend.dev` only delivers to your own Resend account email; verify a domain to send to customers.

## Flow
`/` → `/signup` → `/onboarding` (business + review link) → `/onboarding?step=pay` → Stripe Checkout → `/dashboard` (send, history, 200/mo quota) → `/settings` (edit, billing portal, logout).

API: `POST /api/requests` `{name,email?,phone?}` · `POST /api/stripe/checkout` (form `plan=monthly|annual`) · `POST /api/stripe/portal` · `POST /api/stripe/webhook`.

## Automation (bulk, follow-ups, webhook)
- **Bulk:** Dashboard → Bulk upload, CSV with name/email/phone (header optional). `POST /api/requests/bulk {rows:[...]}` (session auth). Stops at the 200/mo quota and reports sent vs skipped.
- **Follow-ups:** each sent request gets `remind_at = +3 days`. Due reminders are sent by `POST /api/cron/reminders` (also GET) with `Authorization: Bearer $CRON_SECRET` or `?secret=$CRON_SECRET`, and best-effort for the signed-in account on each dashboard load.
  Set `CRON_SECRET` (e.g. `openssl rand -hex 32`) and schedule hourly (Railway cron / Vercel cron / any uptime pinger).
- **Webhook:** `POST /api/hooks/job-complete` with `Authorization: Bearer <token>` (or `X-Api-Token`, `?token=`). JSON or form body: `customer_name`/`name`/`customerName`/`first_name`+`last_name`, `email`, `phone`. Generate the token in Settings → Automatic sending.
- **Zapier:** Settings → Ask after every job → **Connect Zapier**. Trigger on any paid/completed event (Invoice paid, Payment received, Job completed) → Webhooks by Zapier POST (JSON) to `https://YOUR_DOMAIN/api/zapier/webhook` (alias of `/api/hooks/job-complete`) with header `Authorization: Bearer <secret key>`; fields `customer_name`, `email`, `phone`. Creating the key sets `auto_provider='zapier'`; Disconnect clears it (`DELETE /api/token`).
- Optional `APP_URL` sets the base URL shown in Settings.

## Deploy
SQLite needs a persistent disk: use Railway/Fly/Render/a VPS (`npm run build && npm start`). `vercel.json` is included, but Vercel's filesystem is ephemeral — swap to Turso/Postgres before relying on it there. SMS is stubbed (logged to outbox) until Twilio is added in `lib/email.ts`.
