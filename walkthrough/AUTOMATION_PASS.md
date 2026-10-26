# Automation pass: Automatic, Bulk, Follow-up, Proof

## Files
- `lib/db.ts`: safe ALTER migrations (`review_requests.remind_at`, `reminded_at`, `source`; `users.api_token` + unique index), `getUserByToken`
- `lib/send.ts` (new): the shared `sendReviewRequest()` (quota, validation, sendEmail/sendSms, row insert, schedules +3d reminder) and `processDueReminders()`
- `lib/email.ts`: `buildReminderEmail()`
- `app/api/requests/route.ts`: now calls the shared send path
- `app/api/requests/bulk/route.ts` (new): bulk send, stops at quota
- `app/api/cron/reminders/route.ts` (new): POST/GET, protected by `CRON_SECRET`
- `app/api/hooks/job-complete/route.ts` (new): per-user token webhook
- `app/api/token/route.ts` (new): generate/regenerate token
- `components/BulkUpload.tsx`, `components/ApiToken.tsx` (new)
- `app/dashboard/page.tsx`: summary strip, one-off + bulk cards, status chips, follow-up column, reminders run on load
- `app/settings/page.tsx`: Automatic sending section (URL, token with copy and regenerate, Zapier/Jobber steps)
- `app/page.tsx`: hero, how-it-works, new "What you get" section, features, FAQ
- `README.md`, `.env.example`: `CRON_SECRET`, `APP_URL`

## Test locally (`npm run dev`, then `npm run seed` and log in as demo@reviewask.local / demo12345)
1. **Bulk:** on the Dashboard, open Bulk upload and pick a CSV such as `name,email,phone\nJo Smith,jo@x.com,\nSam,,5551234`. Check the preview count, click Send, and confirm. The result line shows sent and skipped counts. Messages land in `data/outbox.json`.
2. **Follow-up:** send one request. To make it due now, run `sqlite3 data/reviewask.db "update review_requests set remind_at=datetime('now','-1 minute')"`. Then either reload the dashboard (the chip turns to "Reminded") or call
   `curl -X POST -H "Authorization: Bearer $CRON_SECRET" localhost:3000/api/cron/reminders`. The `?secret=` form also works. A second run sends nothing.
3. **Proof:** the dashboard top strip shows requests this month, follow-ups sent and scheduled, sent automatically, and remaining quota. The History table has chips (Queued/Sent/Reminded/Failed), channel, source, timestamps and follow-up time.
4. **Automatic:** go to Settings → Generate token, then
   `curl -X POST localhost:3000/api/hooks/job-complete -H "Authorization: Bearer ra_..." -H "content-type: application/json" -d '{"customerName":"Pat Lee","Email":"pat@example.com"}'`
   Expected response: `{"ok":true,"id":..,"mode":"outbox","used":..}`. A bad token returns 401.

## Non-tech copy pass (Oct 25, 2026)
- Settings: "Automatic sending" → "Send after every job"; plain-English lead; "Webhook URL" → "Connection link", "API token" → "Secret key"; 6-step Zapier guide in shop-owner words; Bearer/JSON/Make moved into a collapsed "For your tech person" note; regen confirm says "Connections using the old key will stop working". Billing status shown as Active/Free trial/Not active.
- Dashboard: "from your job software", "Requests left" with Active/Trial wording; Source column shows Typed in / Spreadsheet / Job software; bulk card retitled "Upload a spreadsheet (Excel/CSV)" with "Download sample spreadsheet" (`/public/sample-customers.csv`); hands-free line reworded.
- BulkUpload helper: Excel/Google Sheets export + sample; "name plus an email or phone".
- Landing: webhook/Zapier/Make jargon removed from steps, features, FAQ and pricing list.
- No API, token, or route changes.
