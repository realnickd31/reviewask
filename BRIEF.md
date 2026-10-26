# ReviewAsk — SaaS brief (Nick D’Antonio)

## Pitch
Get more 5-star Google reviews on autopilot. After a job, send a 1-tap SMS/email asking happy customers to leave a Google review.

## Why this product
- Huge market: every local service business (HVAC, plumbers, dentists, salons, lawyers, RE agents, restaurants)
- One-sentence sell, impulse-buy price
- Time-to-value < 5 minutes

## Pricing
- Starter: $39/mo — 200 review requests/month, 1 location, email + SMS (SMS when Twilio connected)
- Annual: $390/yr (2 months free) — same limits

## MVP (ship this week)
1. Marketing landing page (hero, how it works, pricing, FAQ, CTA → Stripe Checkout)
2. Auth: email + password (NextAuth credentials or Clerk-free simple JWT)
3. Onboarding: business name, Google review link (place URL)
4. Dashboard: send review request (name, email and/or phone), history table, request count
5. Email send via Resend API (or nodemailer SMTP if no key — queue locally; document env)
6. Stripe Checkout subscription + Customer Portal + webhook to unlock account
7. Terms + Privacy pages
8. Deploy on Vercel (or local tunnel for demo)

## Out of MVP
- Multi-location, QR codes, auto-trigger from Square/Jobber, AI reply drafts, white-label

## Brand
- Name: ReviewAsk
- Tagline: More 5-star reviews. Less awkward asking.
- Tone: plain, confident, no fluff
- Colors: deep navy + lime accent

## Success
Live URL + Stripe live mode + 10 paying subscribers ($39/mo or annual).
