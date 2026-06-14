# Techwise IQ Website — Changelog

Running log of all changes made to the codebase. Most recent first.

---

## 2026-06-14 — Homepage + Support Pages Build

- Added homepage content and layout updates across Hero, Services, Ticker, Case Study, CTA, footer, and contact.
- Added legal pages: `src/app/privacy/page.tsx`, `src/app/terms/page.tsx`, plus new page styles.
- Added site scaffolding: `src/app/sitemap.ts`, `src/app/robots.ts`, `src/app/not-found.tsx`, `src/app/icon.tsx`.
- Added site-wide WhatsApp float button: `src/components/WhatsAppButton/index.tsx`.
- Added Case Study section and linked real project cards from `src/data/case-studies.ts`.
- Updated global metadata, JSON-LD contact info, email/WhatsApp links, and homepage Open Graph image metadata.
- Added review notes document: `docs/pm-homepage-review-13-06-2026.md`.

---

## 2026-06-13 — PM Review Fixes + Email Update

### Business details confirmed
- **Email:** `Info@techwiseiqtechnologies.ae` (updated across all files)
- **WhatsApp:** `+971567760667` (confirmed; placeholder `971000000000` in contact page also fixed)

### Email updated in
- `src/components/CTASection/index.tsx` — mailto href + display text
- `src/app/page.tsx` — JSON-LD `contactPoint.email`
- `src/app/contact/page.tsx` — email link + display; WhatsApp placeholder fixed
- `src/app/privacy/page.tsx` — all 3 references
- `src/app/terms/page.tsx` — reference in contact section

---

## 2026-06-13 — PM Homepage Review Fixes (12 tasks)

Addressed all P0/P1/P2/P3 items from `pm-homepage-review-13-06-2026.md`.

### Task 1 — CTASection: WhatsApp link wired [P0]
- `src/components/CTASection/index.tsx`
- `href="https://wa.me/971567760667"` on WhatsApp link
- Booking link left as `#` with `// TODO: wire booking link` comment

### Task 2 — WhatsApp Floating Button (site-wide) [P0]
- **New:** `src/components/WhatsAppButton/index.tsx`
- **New:** `src/components/WhatsAppButton/WhatsAppButton.module.css`
- Fixed position bottom-right, `--hot` bg, `--ink` border, pressed-shadow hover
- Added to `src/app/layout.tsx` → renders on every page

### Task 3 — Hero h1 copy [P2]
- `src/components/Hero/index.tsx`
- Old: "The type does the talking. The work does the proving."
- New: **"We build it. We ship it. You own the outcome."** (approved by Adi)

### Task 4 — ServicesSection: "Learn more" links [P1]
- `src/components/ServicesSection/index.tsx` — added `href` field to SERVICES array
  - `001 Web Development` → `/services/web`
  - `002 Custom Software` → `/services/software`
  - `003 AI Automation` → `/services/ai`
- Added `<Link href={svc.href}>Learn more →</Link>` inside each accordion body
- `src/components/ServicesSection/ServicesSection.module.css` — added `.learnMore` style (Space Mono, ink border-bottom on hover, grid-column 2)

### Task 5 — CaseStudySection [P1]
- **New:** `src/components/CaseStudySection/index.tsx`
- **New:** `src/components/CaseStudySection/CaseStudySection.module.css`
- Imports from `src/data/case-studies.ts` (already existed with 2 real projects)
- 2-column card grid with industry, client (Anton), outcome, stack tags, "View project →"
- Inserted in `src/app/page.tsx` between `<ShoutSection />` and `<CTASection />`

### Task 6 — Ticker accessibility [P1]
- `src/components/Ticker/index.tsx`
- Added `<ul className="sr-only">` with the 4 trust claims before the `aria-hidden` visual ticker
- Added `.sr-only` utility class to `src/app/globals.css`

### Task 7 — OG image metadata [P0]
- `src/app/page.tsx` + `src/app/layout.tsx`
- Added `images: [{ url: '/og-image.png', width: 1200, height: 630, alt: '...' }]` to openGraph
- ⚠️ `public/og-image.png` not yet created — design task pending

### Task 8 — JSON-LD telephone [P2]
- `src/app/page.tsx`
- Added `telephone: '+971567760667'` to `contactPoint` in JSON-LD

### Task 9 — sitemap.xml + robots.txt [P3]
- **New:** `src/app/sitemap.ts` — all Phase 1 routes with priorities
- **New:** `src/app/robots.ts` — allow all, sitemap URL

### Task 10 — 404 page [P3]
- **New:** `src/app/not-found.tsx`
- Giant `--hot` 404 in Anton, Archivo sub-line, two buttons (Go home / What we do ↓)

### Task 11 — Favicon [P3]
- **New:** `src/app/icon.tsx` — Next.js `ImageResponse` favicon, "T" in `--hot` on `--ink` background
- ⚠️ Proper Anton-based icon still needs design; this is a fallback

### Task 12 — Privacy + Terms pages [P3]
- **New:** `src/app/privacy/page.tsx` + `src/app/privacy/privacy.module.css`
- **New:** `src/app/terms/page.tsx` + `src/app/terms/terms.module.css`
- Both: Anton headings, Archivo body, metadata exports, ink-bordered sections

---

## 2026-06-13 — FluidParticles canvas background

- Added `src/components/Hero/FluidParticles.tsx` + `FluidParticles.module.css`
- Canvas dot field: `--soft` idle, `--ink` on mouse proximity repulsion
- Rules: `pointer-events: none`, `aria-hidden`, `z-index: -1`, `isolation: isolate` parent, hard bail on `prefers-reduced-motion`
- Animation vocabulary updated in `CLAUDE.md`

---

## Pending / Deferred

| Item | Blocked on |
|------|-----------|
| Booking link in CTASection | Calendly/Cal.com URL from Adi |
| `priceRange` in JSON-LD | Confirmed public-facing "starting from" figure |
| `public/og-image.png` | Design: Anton wordmark on bone, 1200×630 |
| Real favicon file | Design: TIQ lettermark on ink square |
| Analytics (Plausible/Umami) | Setup + environment variable |
| Contact form action | Server action / API route implementation |
| About page content | Copy approval from Adi |
