# Simplify pass (process, not just wording)

Audience: plumbers/HVAC owners and field techs. Native Jobber OAuth app is out of scope (needs Jobber Developer Center review); nothing claims one-click Jobber.

## 1. Bulk: paste, don't export — `components/BulkUpload.tsx`
- Primary: big "Paste from Excel or Google Sheets" textarea; live preview/validation as you paste.
- Parser auto-detects tab (Sheets/Excel copy), comma, or semicolon from the first line; headers optional (defaults name, email, phone).
- File upload is secondary ("or choose a file (CSV)"); sample download kept on the dashboard card. Same `/api/requests/bulk` send path.

## 2. Settings: 4-step Connect Jobber wizard — `components/ConnectWizard.tsx`
1. Create secret key (one button; skipped if the user already has one).
2. Open Zapier (big button, new tab, https://zapier.com/app/zaps).
3. Two big buttons only: Copy connection link, Copy secret key, plus one line of Zapier steps.
4. Test: polls `GET /api/hooks/test` every 5s and shows "Connected" when a real webhook request arrives; "Send a test request" → `POST /api/hooks/test` (session auth) → `sendReviewRequest(u, {name:"Test Customer", email: <account email>}, "test")`. Shows "It worked — check History." Test counts toward the monthly quota.
- "Email instructions" mailto (empty To:, prefilled subject/body with the link) so the owner can forward it to a bookkeeper/tech. No support inbox invented.
- "For your tech person" details stay collapsed.
- `components/ApiToken.tsx` is no longer used by Settings (left in place).

## 3. Quick ask — `/quick` (`app/quick/page.tsx`, `components/QuickAsk.tsx`)
- Requires login; redirects to onboarding if not set up. Mobile-first: "Ask for a review", Customer name + "Phone or email" (auto-detects @), giant Send → existing `POST /api/requests`.
- Success: "Sent to {name}. Next customer." and the form clears. Linked as "Quick ask" in AppNav.

## 4. Dashboard
- New top row of three cards: Quick ask (primary), Paste a spreadsheet, Connect Jobber ("Set once, then forget").
- History source label "Test" for test sends.

All sends go through `lib/send.ts`. `npm run build` passes. Not deployed.
