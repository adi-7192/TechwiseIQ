# Techwise IQ — Site Spec & Content

What each route is and what it must contain, for the **immersive redesign** (D-028). Rewritten
2026-10-05 from the shipped code (ROADMAP 6.3); the Kinetic-era version is in git history
(`git log -- docs/site-spec.md`). Visual rules: `design-system.md`. Binding decisions:
`DECISIONS.md` (wins over this file). If this file disagrees with the code, the code wins — fix
this file.

## Sitemap

```
/                          Home
/services                  Services overview
/services/web              Websites
/services/software         Custom software
/services/ai               AI automation
/work                      Client work + Concept Lab
/work/[slug]               Case study (from src/data/case-studies.ts)
/about                     About
/contact                   Contact form + direct email / WhatsApp
/bottleneck-review         Free 20-minute bottleneck review (D-036)
/insights                  Articles list (D-037)
/insights/[slug]           Article (from src/data/insights.ts)
/privacy, /terms           Legal
/concepts/<slug>/index.html  Concept Lab demos (static, self-hosted, D-006)
```

Later (not built): industry pages (2+ projects per industry), Arabic `/ar/*`. Rejected: public
`/pricing` (D-003).

## Site-wide

- **Shell:** `ImmersiveShell` (per-route scene + accent) → `SiteHeader` → `<main id="main">` → `SiteFooter`.
  One h1 per route; focus moves to it on route change (D-012).
- **Primary CTA:** "Bring us the problem" → `/contact`, everywhere (D-034). No in-page WhatsApp or
  booking buttons; WhatsApp is the floating button, plus the footer and `/contact` details. Cal.com
  later (Q7b) via a `BOOKING_URL` in `src/lib/site.ts`.
- **Voice:** plain, witty, young; key words in `<strong>` (D-035, `voice-draft.md`).
- **Honesty:** no invented stats, clients, logos, testimonials or team claims (D-002, D-005: "a team
  of experts", no names). No prices anywhere, including JSON-LD and `llms.txt` (D-003, D-022).
- **Contact details:** `src/lib/site.ts` only; breakable email pattern (D-004, AGENTS.md).
- **Machine-readable:** per-route metadata + OG, JSON-LD (Organization, Service, Article,
  BreadcrumbList), `sitemap.ts`, `robots.ts`, `public/llms.txt`. Analytics: Plausible only (D-016).

## Routes

### Home (`src/components/immersive/home`)
Intro preloader → hero ("Technology that moves the work.", WebGL scene, CTA) → "What we build"
(three service stories with looping demos, pause/replay controls) → "04 Selected work" (featured
case studies from data) → "05 Operating model" (written scope, weekly demos, direct access, clean
ownership).

### Services overview (`src/components/ServicesOverview`)
Hero → "01 What we build" (three services) → "02 Find your starting point" (problem picker) →
"03 How we engage" (`#engage`, D-033: requirements → options with our recommendation → you choose,
scope + price in writing → we build). Secondary link to `/bottleneck-review`.

### Service detail ×3 (`src/components/ServiceDetailPage`, data in `src/data/services.ts` + `service-guides.ts`)
Hero + proof object (workbench demo) → fit/promise → "02 What we can build" → "03 The thinking
behind the build" → "04 From brief to handover" (4-step journey, D-033) + handover notes →
(`/services/ai` only) "What we automate for ourselves" (own use, never client work, D-032 Q1) →
"05 Selected client work" → "06 Before we start" (FAQs, "Worth a read" insights links).

### Work (`src/app/work`)
Hero → "01 Selected client work" (featured cap 3, D-007/D-032; "More client work" with labelled
Vercel previews, never counted as live) → Concept Lab (self-initiated, labelled, decorative
non-focusable previews, D-006) → "02 How we work" (what clients get / what we avoid) → CTA.

### Case study (`src/app/work/[slug]`)
Hero + facts → proof grid → story → decisions → system/visual (live preview where available) →
result (only verified claims, D-032) → next case study → CTA.

### About (`src/components/AboutExperience`)
Hero ("a team of experts", D-034) → "01 What we bring" → "02 How we behave" → closing ("Building
for businesses in Dubai and beyond…", D-032 Q5) + CTA. No founder/team names or photos (D-005).

### Contact (`src/app/contact`)
Intro (reply within 24 hours, then a written scope after a short call — D-027) + link to the free
review → form (name, email, company, "What's slowing you down?", budget) + direct email/WhatsApp →
"What happens next" (We reply · 20-minute call · Options, then your call). Form never fakes success
(D-014).

### Free bottleneck review (`src/app/bottleneck-review`, D-036)
Hero → How it works (4 steps) → Good things to bring → What it is (and isn't: a conversation, not a
report and not a quote) → the contact form in review mode (hidden `inquiry=review`, own email
subject). Linked only from `/contact` and `/services` #engage.

### Insights (`src/app/insights`, D-037)
List (title, dek, date, reading time) → article: breadcrumb, h1, byline "Techwise IQ team", body
with numbered citations, closing line, CTA, Sources (new tab). Every number keeps its source and
year. Linked from the footer and each service page.

## Launch gates (owner)

Tracked in `ROADMAP.md` stage 7 and `HANDOFF.md` §4: preview review, Resend env + production form
test, booking URL (Q7b), domain/DNS (canonical placeholder `https://techwiseiq.com`, D-017),
real-device sign-off, `npm audit` review, Lighthouse mobile ≥90 perf and 100 a11y/BP/SEO per route.

## Honest trust signals

Allowed: real case studies with verified facts, labelled previews, our own automations (as own
use), process promises we keep (24 h reply, written scope, options with a recommendation, weekly
progress), sourced articles. Not allowed without verifiable data: stats, client logos,
testimonials, "trusted by" claims, team size (D-002).
