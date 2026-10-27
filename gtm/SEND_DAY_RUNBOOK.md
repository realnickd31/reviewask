# Send-day runbook: first cold-email morning (DRAFT, for Nick. Nothing has been sent)
Updated ~5:05 AM ET, Oct 27 2026. Every send needs **your OK**. Grok Bot doesn't send.

## 1. Before the first send (one time)
- [ ] **Sending inbox chosen.** Pick one mailbox you can monitor and reply from. If it's a new custom domain, warm it up and start small.
- [ ] **Physical mailing address** for the footer (CAN-SPAM). It fills [PHYSICAL ADDRESS].
- [ ] **Unsubscribe mechanism.** It can be as simple as "Reply STOP and I won't email again", honored within 10 business days, or a link. It fills [UNSUBSCRIBE LINK].
- [ ] **Custom domain only:** in your email provider's admin, confirm SPF, DKIM and DMARC show as verified/passing. Use the records your provider gives you; none are listed here on purpose.
- [ ] **Opt-out list started:** a sheet tab, "Do not contact".
- [ ] **Terms entity (needs your input):** /terms doesn't name a legal entity. Decide what goes there (e.g. sole proprietor name + DBA). Not changed overnight.

## 2. Volume
- Day 1: the **top 10** in the brief at the top of `gtm/OVERNIGHT_HANDOFF.md`.
- Then ~20–30 a day **max**, working down the "Day-1 send queue" in `gtm/outreach_ready_top25.md`, then batch 2 and batch 3.
- Space sends out (a few minutes apart). Stop for the day if bounces or spam complaints show up.

## 3. Per send (≈3 min each)
1. [ ] **Maps re-check:** their review count and rating, plus the comp(s) named in the draft. If the numbers moved, edit them. If they no longer show a gap, use the "ahead" framing or skip.
2. [ ] **Greeting name:** confirm before sending to Ben #44, Jaron #45, Edgar #46 (guessed from the email address), Austin #47 and Brandon #49.
3. [ ] **Not on the opt-out list**, and not on the On Hold list (below).
4. [ ] **Paste** touch 1 from the draft file. Fill [PHYSICAL ADDRESS] and [UNSUBSCRIBE LINK]. Make sure no `{{` or `[` placeholders are left.
5. [ ] Send from your inbox, then **log it** (section 5).

## 4. Day-3 follow-up
- Only if there's **no reply**, no bounce and no opt-out. Send touch 2 **in the same thread** (reply to your own email).
- Never send a third cold touch.
- Touch-2 files: `gtm/day1_email_drafts_touch2.md` (#1–24), `gtm/day1_email_drafts_batch2_touch2.md` (#25–43), and inline in `gtm/day1_email_drafts_batch3.md` (#44–49).

## 5. Send log (sheet columns)
`Date sent | Draft # | Business | Email | Maps count checked (y/n + number) | Greeting | Touch (1/2) | Replied (date) | Outcome (interested / no / opt-out / bounce) | Trial started (y/n) | Notes`

## 6. Where everything is
| What | File |
|---|---|
| Touch-1 drafts | `gtm/day1_email_drafts.md` (#1–24), `gtm/day1_email_drafts_batch2.md` (#25–43), `gtm/day1_email_drafts_batch3.md` (#44–49) |
| Send queue + flags | `gtm/outreach_ready_top25.md` ("Day-1 send queue") |
| Maps warnings + On Hold list | Top brief in `gtm/OVERNIGHT_HANDOFF.md` |
| Audits behind each draft | `gtm/audits/review-gap-audits.md` |
| 5-minute audit template | `gtm/innovation/lead-magnet-review-gap-audit.md` |
| More leads (paid options, nothing bought) | `gtm/PAID_DISCOVERY_OPTIONS.md` |
| Jobber demo prep | `gtm/jobber-listing/DEMO_DAY_CHECKLIST.md` |

**On Hold (do not send):** Task Tacklers, Stan's, Washburn Bros, 901 cleaning, Mclaughlin's, PoolFix, Honey Do, Battle Buddies, Grow Roots (2-star), JMAS.

## 7. If someone replies
- Interested: point them to getreviewask.com/signup (7-day trial, $39/mo). Offer to help load past customers.
- Asks about texting: "Email works today; SMS is rolling out."
- Opt-out: add them to the list and don't reply further.
