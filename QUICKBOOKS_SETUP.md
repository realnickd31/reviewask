# QuickBooks Online integration setup (no secrets in this file)

1. Sign in at https://developer.intuit.com → **Dashboard → Create an app → QuickBooks Online and Payments**. Name it "ReviewAsk".
2. Scopes: select **only** `com.intuit.quickbooks.accounting` (read is all we use; no Payments, Payroll, or OpenID scopes).
3. **Keys & credentials → Development (Sandbox)**:
   - Redirect URI: `https://getreviewask.com/api/quickbooks/callback`
   - Copy Client ID and Client Secret.
4. **Webhooks → Development**:
   - Endpoint URL: `https://getreviewask.com/api/quickbooks/webhook`
   - Entities: **Invoice → Update**, **Payment → Create**
   - Turn on **CloudEvents payload format** (the handler also accepts the legacy format).
   - Copy the **Verifier Token**.
5. Render env vars (service srv-dbfbc94s728c73epr4bg → Environment):
   - `INTUIT_CLIENT_ID`
   - `INTUIT_CLIENT_SECRET`
   - `INTUIT_ENVIRONMENT=sandbox` (set `production` with production keys)
   - `INTUIT_WEBHOOK_VERIFIER_TOKEN`
   - Optional: `INTUIT_REDIRECT_URI` (must exactly match the portal), `INTUIT_MINOR_VERSION` (default 75)
6. Production: fill out the app's **Production settings** (app URLs incl. EULA `https://getreviewask.com/terms`, privacy `https://getreviewask.com/privacy`,
   host domain, launch URL `https://getreviewask.com/settings`, disconnect URL `https://getreviewask.com/settings`), complete the
   compliance questionnaire, then repeat steps 3–5 in the Production tab with production keys/verifier token. Intuit must approve
   production keys; listing on the QuickBooks App Store is a separate, optional review.

Behavior: Connect starts OAuth (`/api/quickbooks/connect`); the callback stores tokens + `realmId` (one ReviewAsk user per QuickBooks
company). Access tokens (1h) auto-refresh; refresh tokens rotate and are re-saved. Webhooks are HMAC-SHA256 verified against
`intuit-signature`, acked immediately, then processed: an Invoice update is re-fetched and asked only when `Balance == 0` (and
total > 0); a Payment create is re-fetched and its customer asked. A payment that pays off an invoice dedupes against that invoice
(`qbo_events`), so the customer gets one ask. Contact = Customer mobile/phone + primary email, falling back to invoice BillEmail.
Then `sendReviewRequest(u, contact, "webhook")`. Disconnect revokes the token at Intuit and clears the columns.

Smoke test (sandbox): set env vars → Settings → Connect QuickBooks → pick the sandbox company → in the sandbox company, give a
customer your email/phone, create an invoice, then Receive Payment for it → check Render logs for `qbo webhook: review ask sent`.
