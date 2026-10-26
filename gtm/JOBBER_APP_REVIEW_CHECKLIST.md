# Jobber App Review — Pre-Submission Checklist (ReviewAsk)
Updated Mon Oct 26, 2026, 7:55 PM ET · App: ReviewAsk (Draft) · Client ID 0673934d-d104-4118-ac01-a0bddc50d96e
Source: developer.getjobber.com — App Review Process, App Listing Details, App Authorization (fetched today).

**Verdict: NO-GO to click Request Review *right now* — code is ready; only Developer Center settings plus a reviewer test account are left (all ❓/❌ below are Nick-only).**

## Requirements
| # | Jobber requirement | Status | Evidence |
|---|---|---|---|
| 1 | Core functionality complete & stable | ✅ | OAuth connect + JOB_CLOSED → review ask worked end-to-end Oct 25 |
| 2 | Tested end-to-end with own Jobber account | ✅ (re-test after today's deploy) | See "Re-test script" below |
| 3 | Refresh Token Rotation **enabled** in Dev Center | ❓ Nick | Code is RTR-safe: `app/lib/jobber.ts` `accessToken()` saves every returned refresh_token (overwrite), re-reads the row before refreshing, single-flight per user |
| 4 | Subscribed to **APP_DISCONNECT** webhook | ❓ Nick | Handler exists: `app/app/api/jobber/webhook/route.ts` clears tokens + account id, sets disconnected |
| 5 | Connect / disconnect / reconnect from **Jobber Marketplace** | ✅ code (fixed today) | Callback now accepts Marketplace-started flow (no state/PKCE); if not logged in, code is parked 10 min → signup/login → auto-resumes. Verified live: `/api/jobber/callback?code=…` → `/signup?from=jobber` |
| 6 | Connect / disconnect / reconnect **from inside ReviewAsk** | ✅ code (fixed today) | Disconnect now calls Jobber `appDisconnect` mutation, then clears locally (`app/app/api/jobber/disconnect/route.ts`). Reconnect = Connect Jobber button again (fresh PKCE) |
| 7 | Test account / login for reviewers | ❌ Nick | See TEST ACCOUNT SETUP |
| 8 | App logo uploaded (required to submit) | ❌ Nick upload | `gtm/jobber-listing/logo.png` (512×512) |
| 9 | Gallery images | ❌ Nick upload | `gtm/jobber-listing/01,03,04,05-*.png` (4 images, 1600×1000) — consider sharper recapture |
| 10 | Listing: name, developer, description, features, Manage App URL | ❌ Nick paste | `gtm/jobber-listing.md` |
| 11 | Two-Factor Authentication on Developer Center account (required to submit) | ❓ Nick | Dev Center → account settings |
| 12 | Scopes minimal | ❓ Nick verify | App only needs read Jobs + read Clients (+ webhook). Remove any unused write scopes in Dev Center |
| 13 | Webhook URL set | ❓ Nick verify | `https://getreviewask.com/api/jobber/webhook` (HMAC verified with client secret) |
| 14 | Handle revoked tokens gracefully | ✅ (added today) | Refresh 400/401 → user marked disconnected, sees "Connect Jobber" again |
| 15 | Pre-Submission Checklist (in-dialog when you click Request Review) | ❌ Nick | Use this file to answer it |
| 16 | No public Jobber announcements until Published | ✅ | Nothing published |

## Code changes today (commit 6e1c28f, deployed live on Render dep-dbfueiu1egvs73a2jtbg, 7:52 PM ET)
- **Bug: Marketplace "Connect" would have failed** — callback rejected requests without `state`/PKCE, which is exactly how Jobber's Marketplace starts OAuth. Fixed + handles not-logged-in users.
- **Bug: in-app Disconnect didn't tell Jobber** (required: `appDisconnect` mutation). Fixed.
- **Bug: tokens might never refresh** — expiry only came from `expires_in`; if missing, expiry was treated as "never". Now uses `expires_in` → JWT `exp` → 60 min fallback.
- RTR hardening: re-read latest refresh token before refreshing; one refresh at a time per user (a stale rotated token would otherwise kill the connection).
- Revoked refresh token → clean disconnected state.

## TEST ACCOUNT SETUP (for Jobber reviewers)
Signup is open at https://getreviewask.com/signup, but onboarding asks for a card (Stripe trial), so reviewers need a ready-made account:
1. Nick: sign up at https://getreviewask.com/signup with a dedicated address, e.g. `jobber-review@getreviewask.com` (or a +tag of your own inbox) and a strong unique password. **Save it in the vault**, not in any file.
2. Finish onboarding: business name "Jobber Review Test Co.", any Google review link (e.g. your own), start the trial (use a real card or a Stripe 100%-off coupon), or ask Grok Bot to flag that user as `trialing` in the DB.
3. Leave Jobber **disconnected** so reviewers test Connect themselves.
4. Give Jobber in the review meeting: login URL https://getreviewask.com/login, email + password (from vault), and these steps:
   - Log in → Settings → "Ask after every job" → I use Jobber → **Connect Jobber** → Allow Access (or click Connect from the Marketplace listing).
   - Add a client with your own email in Jobber, create a job, **close the job** → a review request email arrives within a minute; it shows in the ReviewAsk Dashboard as "sent automatically".
   - Disconnect from ReviewAsk Settings **or** from the Jobber listing → ReviewAsk shows "Connect Jobber" again. Reconnect works the same way.
   - Note: the review button in the email opens the business's Google review page — reviewers don't need to post a real review.

## Nick must do in Developer Center (developer.getjobber.com → Manage Apps → ReviewAsk)
1. Turn on **Two-Factor Authentication** for your Developer Center account.
2. App settings → **Refresh Token Rotation: ON**. (Existing connections keep working; after enabling, disconnect + reconnect your own Jobber once to confirm.)
3. Webhooks: confirm URL `https://getreviewask.com/api/jobber/webhook` and topics **JOB_CLOSED** and **APP_DISCONNECT** both checked.
4. Scopes: keep only what's needed (read clients, read jobs). Changing scopes forces re-authorization.
5. Upload **logo** (`gtm/jobber-listing/logo.png`) and **gallery** (01, 03, 04, 05).
6. Paste listing fields from `gtm/jobber-listing.md` (description, Features or benefits, Manage App URL `https://getreviewask.com/settings#automatic`, developer name).
7. Run the re-test script below once yourself.
8. Create the reviewer test account (above) and store creds in vault.
9. Then: ⋯ next to ReviewAsk → **Request Review** → complete the Pre-Submission Checklist. Jobber will email the Dev Center address to book a live demo.

## Re-test script (5 min, after RTR ON)
1. Settings → Disconnect Jobber (if connected) → check Jobber's App Marketplace listing shows Disconnected.
2. Connect Jobber from ReviewAsk → close a test job → email arrives.
3. Disconnect from **Jobber's** listing → refresh ReviewAsk Settings → shows "Connect Jobber" (proves APP_DISCONNECT).
4. Click Connect from **Jobber's** listing → lands in ReviewAsk → Settings shows connected (proves Marketplace connect).
5. Wait >60 min, close another job → email still arrives (proves token refresh with RTR).
