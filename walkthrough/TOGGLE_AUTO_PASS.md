# Toggle-first Automatic: notes on this pass

## What shipped
- **Settings → "Ask after every job"**: a big On/Off switch with "Automatically ask customers for a Google review when a job is finished." When it's off, the card reads "Turn this on, then connect your job software once." When it's on, three big buttons appear: I use Jobber / I use Housecall Pro / Neither / not sure.
- **Jobber**: one "Connect Jobber" button.
  - If `JOBBER_CLIENT_ID` + `JOBBER_CLIENT_SECRET` are set, the button goes to `/api/jobber/connect`, then Jobber's authorize page (PKCE S256), then `/api/jobber/callback`. That stores the tokens and sets `jobber_connected=1`, `auto_provider='jobber'`, `auto_enabled=1`. The card then shows green "Connected to Jobber · Asking automatically" with Turn off / Disconnect.
  - If the env vars are missing (the situation today), the same button opens "We'll connect it for you": a Jobber login email field and "Request connect". That saves `auto_setup_email` and `auto_setup_requested_at`.
- **Housecall Pro**: the same request-setup panel. No fake OAuth. Provider is saved as `housecall`.
- **Neither**: an "Open Quick ask" button and "Copy link for your techs", which copies the absolute `/quick` URL.
- **Zapier/webhook/token**: moved into a collapsed "Advanced (for a tech person)" section at the bottom of Settings.
- **Dashboard card**: shows "Turn on automatic asks", "On · Jobber", "Setup requested" or "Finish connecting".
- **Landing page**: the copy now says "turn on automatic asks and connect Jobber once, or use Quick ask on your phone". It no longer claims one-click.
- **DB** (added with safe ALTERs on `users`): `auto_enabled`, `auto_provider`, `auto_setup_email`, `auto_setup_requested_at`, `jobber_connected`, `jobber_access_token`, `jobber_refresh_token`, `jobber_token_expires_at`, `jobber_account_id`. Tokens are never logged. They are **not encrypted at rest** yet.
- **Files**: `lib/jobber.ts`, `lib/base.ts`, `app/api/jobber/{connect,callback,disconnect,webhook}/route.ts`, `app/api/auto/route.ts`, `components/AutoToggle.tsx`.

## Webhook (`POST /api/jobber/webhook`)
- Checks HMAC-SHA256 (base64, keyed with the client secret) from the `X-Jobber-Hmac-SHA256` header. It returns 200 right away.
- On `JOB_CLOSED`, it finds the user by `accountId`, refreshes the token if needed, and queries `job(id: itemId) { client { name emails phones } }`. Then it calls `sendReviewRequest(..., "webhook")`.
- **TODO**: check the GraphQL field names and the API version header (`JOBBER_API_VERSION`, default `2025-01-20`) against the live schema once a dev app exists. This path has not been tested against Jobber.

## Blocked on Nick (needed for real one-click)
1. Create an app in the Jobber Developer Center (developer.getjobber.com).
2. Set the app's redirect URL to `https://<your-domain>/api/jobber/callback`. Add scopes to read jobs, clients and account.
3. Subscribe the webhook topic `JOB_CLOSED` to `https://<your-domain>/api/jobber/webhook`.
4. Set these env vars: `JOBBER_CLIENT_ID`, `JOBBER_CLIENT_SECRET`, `JOBBER_REDIRECT_URI`. Optionally set `JOBBER_API_VERSION`.
5. Public apps may need Jobber's app review before shops outside your dev account can connect.

Until then, "Connect Jobber" collects a setup request. Nobody gets notified when a request comes in: find them with
`SELECT email, auto_provider, auto_setup_email, auto_setup_requested_at FROM users WHERE auto_setup_requested_at IS NOT NULL;`
"You'll get an email when it's on" is a promise someone has to keep by hand.

Not deployed.
