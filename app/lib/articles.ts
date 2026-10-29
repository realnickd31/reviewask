export type Section = { h: string; p?: string[]; list?: string[]; table?: string[][] };
export type Article = { kind: "guides" | "vs"; slug: string; title: string; h1: string; description: string; intro: string; sections: Section[]; faqs: { q: string; a: string }[] };
const g = (a: Omit<Article, "kind">): Article => ({ kind: "guides", ...a });
const v = (a: Omit<Article, "kind">): Article => ({ kind: "vs", ...a });
export const articles: Article[] = [
  g({ slug: "how-to-get-more-google-reviews", title: "How to Get More Google Reviews (2026 Guide)", h1: "How to get more Google reviews", description: "A practical system for getting more Google reviews: ask at the right moment, use a direct link, follow up once, and stay within Google's rules.",
    intro: "Most happy customers never leave a review, not because they don't want to, but because nobody asked at the right moment with an easy link. Getting more Google reviews is mostly a process problem. Here's a process that works for almost any business.",
    sections: [
      { h: "1. Ask every customer, not just the ones you remember", p: ["The biggest gap is consistency. Businesses that ask sometimes get reviews sometimes. Make the ask part of how every job, visit, or order ends, so it doesn't depend on anyone's memory on a busy day."] },
      { h: "2. Ask within hours, not weeks", p: ["Response rates fall off quickly after the work is done. The best window is the same day, while the experience is fresh. A message sent a week later competes with everything else in the customer's inbox."] },
      { h: "3. Send a direct review link", p: ["Every extra step loses people. \"Search for us on Google\" loses far more than a link that opens your review form directly. Create one with our free Google review link generator, or copy the short link from your Google Business Profile."] },
      { h: "4. Keep the message short and personal", list: ["Use the customer's first name and your business name", "Say thanks for something specific (the job, the visit, the order)", "One sentence explaining it helps other customers find you", "The link, and nothing else to click"] },
      { h: "5. Follow up once, then stop", p: ["A single reminder a few days later often brings in as many reviews as the first message. More than one feels pushy and can hurt the relationship. One follow-up, then stop."] },
      { h: "6. Stay within Google's rules", list: ["Ask every customer, not only the ones you expect to be happy (no review gating)", "Don't offer discounts, gifts, or entries in exchange for reviews", "Never write reviews for yourself or have staff post them"], p: ["Breaking these rules can get reviews removed or your profile restricted, and in the U.S. the FTC treats fake or incentivized reviews as deceptive."] },
      { h: "7. Reply to the reviews you get", p: ["Replying shows future customers you're paying attention and encourages more people to review. Thank positive reviewers by name and respond calmly to criticism."] },
    ],
    faqs: [
      { q: "What's the fastest way to get more Google reviews?", a: "Send every customer a short message with a direct review link on the day you finish the work, then one follow-up a few days later." },
      { q: "Can I pay or reward customers for Google reviews?", a: "No. Google's policies prohibit incentives for reviews, and the FTC treats incentivized reviews as deceptive in the U.S." },
      { q: "How many follow-ups should I send?", a: "One. A single reminder a few days after the first ask captures most of the extra reviews without annoying customers." },
    ] }),
  g({ slug: "how-to-ask-customers-for-a-review", title: "How to Ask Customers for a Google Review (Templates)", h1: "How to ask customers for a Google review (with templates)", description: "Copy-ready email and text templates for asking customers for a Google review, plus when to send them and what to avoid.",
    intro: "Asking for a review feels awkward until you have the words ready. These templates are short on purpose: customers decide in seconds whether to tap the link.",
    sections: [
      { h: "When to ask", p: ["Ask right after the moment of value: the job is finished, the appointment is over, the order arrived. Same day is best. If you ask in person, follow it with a message that contains the link, since people forget."] },
      { h: "Email template", p: ["Subject: Thanks from [Business]. Quick favor?", "Hi [First name], thanks for choosing [Business] for [the job]. If you have a minute, a Google review helps other people find us: [review link]. It takes about 30 seconds. Thank you! [Your name]"] },
      { h: "Text message template", p: ["Hi [First name], it's [Your name] from [Business]. Thanks again for today! Would you leave us a quick Google review? [review link]"] },
      { h: "Follow-up template (send once, about 3 days later)", p: ["Hi [First name], just a quick reminder in case it got buried. A short review would mean a lot: [review link]. Thanks either way!"] },
      { h: "In-person script", p: ["\"We're a small business and reviews really help people find us. I'll text you a link. If you have 30 seconds later, we'd really appreciate it.\""] },
      { h: "What to avoid", list: ["Asking only customers you think are happy (review gating)", "Offering anything in return for a review", "Long messages with several links or a survey before the review", "Repeated reminders"] },
    ],
    faqs: [
      { q: "Should I ask for a review by text or email?", a: "Both work. Text tends to get read faster; email is easier to send at scale and needs no special consent setup. Use whatever your customers respond to." },
      { q: "Is it okay to ask for a 5-star review?", a: "Ask for an honest review instead. Asking specifically for 5 stars can come across as pressure and conflicts with the spirit of Google's policies." },
      { q: "What should I include in a review request?", a: "The customer's name, your business name, a thank-you, one line on why reviews help, and a direct link to your Google review form." },
    ] }),
  g({ slug: "find-your-google-review-link", title: "How to Find Your Google Review Link (3 Ways)", h1: "How to find your Google review link", description: "Three ways to get a direct link to your Google review form: from Google Business Profile, from your Place ID, or with a free generator.",
    intro: "A Google review link opens your review form directly, so customers don't have to search for you. Here are three ways to get yours.",
    sections: [
      { h: "Option 1: From your Google Business Profile", list: ["Sign in to Google with the account that manages your business", "Search for your business name on Google or open Business Profile Manager", "Click \"Ask for reviews\" (sometimes \"Get more reviews\")", "Copy the short link Google shows you"] },
      { h: "Option 2: Build it from your Place ID", p: ["Every Google business listing has a Place ID. Find yours with Google's Place ID Finder, then add it to the end of this address: https://search.google.com/local/writereview?placeid=YOUR_PLACE_ID. This works even if you don't manage the profile yourself, for example if an agency set it up."] },
      { h: "Option 3: Use a free generator", p: ["Paste your Place ID into our free Google review link generator and it builds the link for you, with a test button so you can check it opens the right business."] },
      { h: "Test your link", p: ["Open it in a private/incognito window on your phone. You should see your business name and the star rating form. If it opens the wrong business, double-check the Place ID."] },
      { h: "Where to put it", list: ["Review request emails and texts after each job", "Invoices, receipts, and email signatures", "A QR code at your counter or on business cards", "Your website's thank-you page"] },
    ],
    faqs: [
      { q: "Does a Google review link expire?", a: "No. The link keeps working as long as your Google Business Profile exists." },
      { q: "Is the short g.page link different from the Place ID link?", a: "They both open the same review form. Use whichever you have; neither one is better for rankings." },
      { q: "Can I make a QR code from my review link?", a: "Yes. Any QR code generator can turn the link into a code you can print." },
    ] }),
  g({ slug: "how-to-respond-to-google-reviews", title: "How to Respond to Google Reviews (Good & Bad)", h1: "How to respond to Google reviews, good and bad", description: "How to reply to positive and negative Google reviews, with example responses and what never to say publicly.",
    intro: "Your replies are read by future customers as much as by the reviewer. A good response is short, specific, and calm.",
    sections: [
      { h: "Replying to positive reviews", p: ["Thank them by name, mention something specific, and keep it to two or three sentences. Example: \"Thanks, Maria! Glad the new water heater is keeping up with the cold mornings. We appreciate you choosing us.\""] },
      { h: "Replying to negative reviews", list: ["Reply within a day or two, after you've cooled off", "Thank them for the feedback and acknowledge the issue without arguing", "Don't share private details about the customer or the job", "Offer to make it right offline (a phone number or email for your business)", "Keep it short. Long defenses look worse than the original review"], p: ["Example: \"Hi James, I'm sorry the appointment ran late and nobody called ahead. That's not the experience we want. Please reach us at our office line so we can make it right.\""] },
      { h: "Reviews that break the rules", p: ["If a review is spam, off-topic, hateful, or from someone who was never a customer, you can report it from your Business Profile. Google removes reviews that violate its policies, not reviews that are simply negative."] },
      { h: "The best fix for a bad review", p: ["A steady flow of new reviews from your real customers. One bad review stands out among ten; it barely registers among two hundred. That's why asking every customer matters."] },
    ],
    faqs: [
      { q: "Should I respond to every Google review?", a: "Ideally yes, or at least every negative review and as many positive ones as you can. It signals to customers that you're engaged." },
      { q: "Can I delete a negative Google review?", a: "No, but you can report reviews that violate Google's policies. Otherwise, respond professionally and focus on getting more reviews from happy customers." },
      { q: "Do review responses help SEO?", a: "Google says responding shows customers you value them; the clearer benefit is trust with people reading your profile." },
    ] }),
  g({ slug: "google-review-policy-rules", title: "Google Review Rules: Gating, Incentives & What's Allowed", h1: "Google review rules: what's allowed when you ask for reviews", description: "Plain-English guide to Google's review policies: review gating, incentives, employee reviews, and the FTC rule on fake reviews.",
    intro: "You're allowed, and encouraged, to ask customers for Google reviews. A few practices can get reviews removed or your profile restricted. This is a plain-English summary, not legal advice.",
    sections: [
      { h: "Allowed", list: ["Asking every customer for a review, by email, text, or in person", "Sending a direct review link", "A single reminder", "Replying to reviews"] },
      { h: "Not allowed: review gating", p: ["Review gating means screening customers first (\"How did we do?\") and only sending happy ones to Google. Google's policies prohibit discouraging negative reviews or selectively soliciting positive ones. Ask everyone the same way."] },
      { h: "Not allowed: incentives", p: ["Don't offer discounts, gifts, contest entries, or payment for reviews, even if you don't require a positive review. Thank customers, but don't reward the review."] },
      { h: "Not allowed: fake or conflicted reviews", list: ["Reviews you or your staff write about your own business", "Reviews from family members posing as customers", "Buying reviews or using review exchange groups", "Reviewing a competitor"] },
      { h: "The FTC rule (U.S.)", p: ["Since October 2024, the FTC's rule on consumer reviews bans fake reviews, buying reviews, and conditioning incentives on a review's sentiment, with civil penalties for violations. Asking honestly, with no strings attached, is fine."] },
      { h: "How ReviewAsk keeps you compliant", p: ["ReviewAsk sends the same honest request to every customer, with a direct link and one follow-up. No gating, no incentives."] },
    ],
    faqs: [
      { q: "Is review gating illegal?", a: "It violates Google's policies and can draw FTC scrutiny in the U.S. if it suppresses negative reviews. Ask every customer the same way." },
      { q: "Can I run a giveaway for people who leave reviews?", a: "No. Google prohibits incentives for reviews, including contest entries." },
      { q: "Can employees leave reviews for our business?", a: "No. Reviews from employees or owners are a conflict of interest under Google's policies." },
    ] }),
  v({ slug: "reviewask-vs-podium", title: "ReviewAsk vs Podium: Simple Review Requests vs All-in-One", h1: "ReviewAsk vs Podium", description: "Compare ReviewAsk and Podium for getting Google reviews: pricing model, contracts, setup, and which fits a small business.",
    intro: "Podium is a broad customer-communication platform: messaging inbox, AI lead conversion, payments, phones, and reviews. ReviewAsk does one job: ask every customer for a Google review automatically. Here's how they compare.",
    sections: [
      { h: "At a glance", table: [["", "ReviewAsk", "Podium"], ["Focus", "Google review requests", "Messaging, AI leads, payments, reviews"], ["Price", "$39/month or $390/year", "Sold through sales; quote varies by industry and volume"], ["Signup", "Self-serve, 7-day free trial", "Sales call / demo"], ["Contract", "Month-to-month", "Set in a sales order form"], ["Setup", "Minutes", "Onboarding with their team"]] },
      { h: "When Podium makes sense", p: ["If you want a shared text inbox for your team, website chat, AI lead handling, and payments in one place, and you have the budget and volume to justify it, Podium is built for that."] },
      { h: "When ReviewAsk makes sense", p: ["If your goal is simply more Google reviews, you probably don't need a full communications suite. ReviewAsk sends each customer a short request with a direct link, from a spreadsheet, with one tap on your phone, or automatically from tools you already use (optional Jobber and Housecall Pro connections). One follow-up, then it stops."] },
      { h: "Bottom line", p: ["Podium is a platform; ReviewAsk is a focused tool. Many small businesses only need the second. Pricing for Podium should be confirmed with their sales team, since it depends on your industry and setup."] },
    ],
    faqs: [
      { q: "How much does Podium cost?", a: "Podium sells plans through its sales team and says pricing varies by industry, integrations, and volume. Request a quote from Podium for a current figure." },
      { q: "Is ReviewAsk a Podium alternative?", a: "For review requests, yes. ReviewAsk doesn't replace Podium's messaging inbox, phones, or payments." },
    ] }),
  v({ slug: "reviewask-vs-birdeye", title: "ReviewAsk vs Birdeye: Pricing, Contracts & Fit", h1: "ReviewAsk vs Birdeye", description: "Compare ReviewAsk and Birdeye for Google review requests: quote-based vs flat pricing, contracts, and which fits a small business.",
    intro: "Birdeye is a reputation and customer-experience platform for single and multi-location businesses: reviews, listings, messaging, surveys, social, and more. ReviewAsk focuses on one thing: getting more Google reviews from your customers.",
    sections: [
      { h: "At a glance", table: [["", "ReviewAsk", "Birdeye"], ["Focus", "Google review requests", "Reviews, listings, messaging, social, surveys"], ["Price", "$39/month or $390/year", "Custom quote by locations and modules (not published)"], ["Signup", "Self-serve, 7-day free trial", "Sales call"], ["Contract", "Month-to-month", "Sales order forms that auto-renew, per Birdeye's terms"], ["Best for", "Single businesses that want more reviews", "Multi-location brands needing a full suite"]] },
      { h: "When Birdeye makes sense", p: ["If you manage many locations, need listings management across directories, and want surveys, social posting, and messaging in one contract, Birdeye is designed for that scale."] },
      { h: "When ReviewAsk makes sense", p: ["If you're one business (or a few) and the job is \"ask every customer for a Google review,\" ReviewAsk does it for a flat monthly price with no contract. Send from a spreadsheet, your phone, or automatically from tools you already use."] },
      { h: "Bottom line", p: ["Birdeye is enterprise-grade reputation software with quote-based pricing. ReviewAsk is a simple, transparent tool for the review-request job."] },
    ],
    faqs: [
      { q: "How much does Birdeye cost?", a: "Birdeye doesn't publish prices; its pricing page asks for your number of locations and routes you to sales for a quote." },
      { q: "Does ReviewAsk do listings management like Birdeye?", a: "No. ReviewAsk focuses on review requests. It doesn't manage directory listings." },
    ] }),
  v({ slug: "reviewask-vs-nicejob", title: "ReviewAsk vs NiceJob: Price & Features Compared", h1: "ReviewAsk vs NiceJob", description: "Compare ReviewAsk ($39/mo) and NiceJob (from $75/mo) for Google review requests: features, pricing, and which fits your business.",
    intro: "NiceJob is a reputation marketing tool with review requests, website widgets, social sharing, and (on Pro) referrals and repeat-customer campaigns. ReviewAsk is narrower and cheaper: it asks every customer for a Google review.",
    sections: [
      { h: "At a glance", table: [["", "ReviewAsk", "NiceJob"], ["Focus", "Google review requests", "Review requests, widgets, social, referrals (Pro)"], ["Price", "$39/month or $390/year", "Starter $75/month, Pro $125/month (per NiceJob's pricing page, Oct 2026)"], ["Free trial", "7 days", "14 days"], ["Contract", "Month-to-month", "No contract"], ["Integrations", "Spreadsheet, phone, optional Jobber / Housecall Pro and more", "Many integrations"]] },
      { h: "When NiceJob makes sense", p: ["If you want review widgets on your website, auto-posting reviews to social media, referral campaigns, or win-back emails, NiceJob bundles those marketing features."] },
      { h: "When ReviewAsk makes sense", p: ["If you mainly want more Google reviews without paying for marketing extras, ReviewAsk does the core job, with a short request, a direct link, and one follow-up, for about half NiceJob's Starter price."] },
      { h: "Bottom line", p: ["Both are month-to-month and self-serve. Choose NiceJob for a broader marketing bundle, ReviewAsk for a focused, lower-cost review-request tool. Prices change; check NiceJob's pricing page for current figures."] },
    ],
    faqs: [
      { q: "How much does NiceJob cost?", a: "As of October 2026, NiceJob's pricing page lists Starter at $75/month and Pro at $125/month, with a 14-day free trial." },
      { q: "Is ReviewAsk cheaper than NiceJob?", a: "Yes. ReviewAsk is $39/month (or $390/year) compared with NiceJob Starter at $75/month as of October 2026." },
    ] }),
];
export const getArticle = (kind: string, slug: string) => articles.find((a) => a.kind === kind && a.slug === slug);
