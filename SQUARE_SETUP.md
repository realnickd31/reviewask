# Square integration setup (no secrets in this file)

1. Create an app at https://developer.squareup.com/apps
2. OAuth page (Sandbox first, then Production):
   - Redirect URL: https://getreviewask.com/api/square/callback
3. Webhooks → Subscriptions → Add:
   - URL: https://getreviewask.com/api/square/webhook
   - Events: `payment.updated`, `oauth.authorization.revoked`
   - Copy the Signature Key.
4. Scopes requested by the app: MERCHANT_PROFILE_READ, PAYMENTS_READ, CUSTOMERS_READ, APPOINTMENTS_READ
5. Render env vars (srv-dbfbc94s728c73epr4bg):
   - SQUARE_APPLICATION_ID
   - SQUARE_APPLICATION_SECRET
   - SQUARE_ENVIRONMENT=sandbox   (switch to production with production credentials)
   - SQUARE_WEBHOOK_SIGNATURE_KEY
   - Optional: SQUARE_REDIRECT_URI, SQUARE_WEBHOOK_URL (must exactly match the URL Square signs), SQUARE_API_VERSION

Behavior: on `payment.updated` with status COMPLETED (re-fetched from Square; refunded skipped), the customer's
email/phone is looked up and `sendReviewRequest(u, contact, "webhook")` runs. Payment ids are deduped in `square_events`.
