# Reputation pass — ReviewAsk (Oct 25, 2026)

Goal: read like a calm, credible $39/mo SaaS instead of a neon startup template. No new dependencies, no route/API/session/Stripe changes. `npm run build` passes.

## What changed and why
- **Palette (tailwind.config.ts):** neon `#b6f13a` replaced with a muted sage-lime (`#a9cf6a`, plus 50/100/600/700 shades). Lime is now only a small accent (logo star, checkmarks, "Best value" pill). Primary actions are navy or white, which reads more like a bank/B2B product.
- **Type & components (globals.css, layout.tsx):** system/Inter font stack, tighter heading tracking, semibold instead of extrabold. Buttons, inputs and cards have smaller radii (rounded-md/lg), use hairline borders and quiet focus rings. Chunky rounded-2xl "toy" shapes are gone.
- **Landing (app/page.tsx):** left-aligned hero with an eyebrow that says "Built for local service businesses", plainer copy ("without the awkward conversation"), and a white primary CTA plus a ghost secondary. An industry strip replaces social proof, with no fake logos or counts. Steps sit in a bordered grid with 01/02/03 markers. There is a new "Trust & compliance" section (no review gating, sent under your business name, data not sold). Pricing cards are restrained and add a Stripe/tax note. The FAQ is a two-column divided list with fuller answers (Google policy, how the trial works, cancellation). The final CTA is a sober navy band.
- **Footer:** company-style footer with Product and Company columns, clear Terms of Service / Privacy Policy links, a copyright line, "Payments processed securely by Stripe" and a "not affiliated with Google" disclaimer.
- **Auth (signup/login):** light slate background, narrow card, quiet navy submit, an error shown as a bordered alert, and Terms/Privacy links on both pages.
- **Onboarding:** light background with a dark logo, matching cards, a navy-ring plan selector, and a note that you'll be redirected to Stripe.
- **App chrome:** AppNav is now a white bar with a hairline border and adds Log out (POST to the existing /api/auth/logout). The dashboard has a neutral inactive banner, a navy quota bar, muted status pills, uppercase table headers, and a dashed-border empty state. The Legal header matches.
