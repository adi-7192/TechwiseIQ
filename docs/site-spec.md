# Techwise IQ — Site Spec & Content

Sitemap, per-page sections, approved copy, and the launch checklist. Approved design + copy live in the Kinetic mockup (`design-mockups-11-06-2026/design-e-kinetic-12-06-2026.html`, copied to `website/docs/design-reference.html`) — reuse it unless changed here. Other design-*.html mockups are rejected explorations; never copy content or styles from them.

## Sitemap

**Phase 1 (launch):**

```
/                     Home
/services             Services overview
/services/web         End-to-End Web Development
/services/software    Custom Software Engineering
/services/ai          AI Automation & Enablement
/work                 Projects / case studies
/work/[slug]          Individual case study
/about                About / why us
/contact              Contact + booking
/privacy, /terms      Legal (required for payment/analytics compliance)
```

**Phase 2 (post-launch):** `/insights` blog (SEO/GEO engine), `/pricing` public "starting from" page (decision pending — see pricing catalogue doc), Arabic localization (`/ar/...`).

## Page specs

### Home
Sections in order (mirrors Kinetic mockup): fixed nav → kinetic hero (3 marquee type rows, aria-hidden + claim card carrying the real h1 + sticker badge + 2 CTAs) → manifesto (words light up on scroll; "…for businesses that hate boring.") → services as giant accordion type rows (001 Web Development / 002 Custom Software / 003 AI Automation — each opens to description + deliverables list) → hot-orange ticker ("Fixed scope ★ Demos every Friday ★ No surprise invoices ★ Weeks not quarters") → process (4 steps: Diagnose, Scope, Build, Run; ghost numbers) → statement section, ink bg ("Agencies sell ~~hours~~. We sell outcomes." — strike-through reveal) → featured case study (1, real — design TBD within Kinetic language) → contact CTA (giant mailto + WhatsApp / booking / location chips) → footer.
Home showpiece: velocity skew on the hero rows. No second showpiece.
Note: the old stats strip is gone by design — the ticker carries process claims instead of numbers, so there is nothing to fabricate. If real verifiable stats accumulate post-launch, a stats section can be reintroduced deliberately.

### Services overview + 3 detail pages
Each detail page: hero claim → what you get (deliverables list) → mini-process specific to that service → relevant case study → FAQ (3–5 questions, real objections: "How long does a website take?", "Do you work with clients outside UAE?", "What does it cost?" → answer honestly with "starting from" ranges) → CTA.
The web page mentions: design, build, CMS, SEO + GEO, performance. The AI page must demystify: name concrete automations (invoice processing, email triage, report generation, WhatsApp flows) — not "AI solutions."

### Work
Grid of real case studies only (2 sites + 1–2 apps at launch — that's fine). Each links to a full case study page built from `case-study-template-11-06-2026.md`. Optional honest filler: a "From the lab" strip for self-initiated builds, clearly labeled.

### About
The "new but expert" page. Sections: who we are (short, no stock-photo team grid unless real photos exist) → how we think (the outcomes-not-hours philosophy) → why an AI-first agency (we use the automation we sell — show a real internal example) → founder note (direct, first person, signed). This page carries the trust burden that a long client list would normally carry — write it carefully.

### Contact
Short form (name, email, company, "what's slowing you down?" textarea, budget range select) + direct email + **WhatsApp button (essential in UAE market)** + calendar booking embed (Cal.com or Calendly). State response time and honor it.

## Site-wide additions (build into Phase 1)

- WhatsApp floating contact (UAE buyers expect it)
- JSON-LD: Organization, ProfessionalService, FAQPage; per-page meta + OG images (design OG template in the brand style)
- Sitemap.xml, robots.txt, 404 page (use the design system's attitude — make it memorable)
- Analytics: privacy-friendly (Plausible/Umami) — also a credibility signal
- Performance budget per CLAUDE.md (the site is the demo)

## Launch checklist (blockers)

1. Verify no invented content shipped: the Kinetic mockup contains no fake stats/logos/testimonials by design — keep it that way. Never port content from the rejected mockups (design-a/b/c/d), which contain fake stats, logos, and a placeholder testimonial.
2. Real case studies written and approved (min 2).
3. Real email + WhatsApp + booking link wired and tested.
4. Legal pages exist. Favicon + OG images exist.
5. Lighthouse ≥ 95 perf / 100 a11y on every page; tested on a real phone.
6. All copy passes the banned-vocabulary list in CLAUDE.md.

## Honest alternatives to fake trust signals

Since real client volume is low at launch:
- Stats can be true without being client-counts: "2,400+ engineering hours shipped", "3 industries served", "100% projects delivered on scope" (if true), "< 24h response time".
- "Built with" strip (technologies) instead of client logo strip.
- Process guarantees as trust signals: fixed written scope, weekly demos, no surprise invoices.
- Founder visibility: real names and faces beat anonymous logos.
