# Techwise IQ Website — Changelog

Running log of all changes made to the codebase. Most recent first.

---

## 2026-07-09 — Phase 2: UX & Visual Improvements (premium-launch roadmap)

- **Hero entrance fixed**: GSAP slide-up and velocity skew were writing the same `style.transform` (skew clobbered the entrance every frame). Now GSAP animates an outer wrapper, skew writes an inner `.skew` div. Skew loop also skips DOM writes when idle. Hero no longer needs `'use client'`.
- **Contrast (WCAG)**: all small bone-on-hot text switched to ink-on-hot — Ticker, primary Button, CTA channel hover, WhatsApp float, mobile-menu CTA (~2.6:1 → ~5:1).
- **Heading hierarchy**: sr-only h2s added to ProcessSection ("How we work") and Manifesto ("What we do"); page outline now monotonic.
- **Section rhythm**: light sections normalized to 96px (set-pieces stay 120px); dividers added at Hero→Manifesto and CaseStudy→CTA boundaries.
- **Proof cross-links**: new `ProofStrip` component on all 3 service detail pages (case-study cards for web; "see what we've shipped" fallback for software/ai until those studies exist). Case-study snapshot "Service" now links back to its service page.
- **Mobile nav hardened**: Escape closes, focus trap (burger + overlay links), focus moves into overlay on open and back to burger on close. WhatsApp float dropped to z-index 50 (below nav 60 / overlay 59).
- **Manifesto**: scroll handler rAF-throttled (was forcing reflow per scroll event); word-hiding is now progressive enhancement (`.enhanced` added by JS — no-JS visitors see the full statement); "hate boring." wraps below 480px; inline style moved to `.inner` class.
- **Structured data**: `Service` + `Offer` (AED minPrice) on the 3 service pages, `CollectionPage`/`ItemList` on /work, `AboutPage` on /about, `BreadcrumbList` on case studies. (Founder `Person` schema deferred — needs Adi's preferred public name.)
- **Token discipline**: new `--ink-soft` (#3A3933) and `--surface-open` (#ECE9E0) tokens; ~20 hardcoded uses replaced across 9 stylesheets; literal borders/shadows swapped for `--bd`/`--shadow`/`--shadow-md` in CaseStudySection + WhatsAppButton; Nav breakpoint 768→880 (site standard); dead CSS removed (`.geometryWrap`, `.svcAccent`, `.accent` + CTA's empty 5% spacer column → real gap).
- Verified: lint 0 errors, build passes, proof strips/JSON-LD/h2s/ticker checked on prod server.

---

## 2026-07-09 — Phase 1: Launch Blockers (premium-launch roadmap)

- **Contact form delivery**: `contact/actions.ts` now sends via Resend (reply-to visitor, recipient `Info@techwiseiqtechnologies.ae`). Fail-loud: missing `RESEND_API_KEY` or a failed send returns a visible error with email/WhatsApp fallback — never a false "sent". Status regions given `aria-live`. Added `.env.example`. ⏳ Needs Adi: `RESEND_API_KEY` + domain verification.
- **Booking CTAs**: dead `href="#"` in CTASection + contact sidebar replaced with `BOOKING_URL` from new `src/lib/site.ts` (interim WhatsApp deep link with prefilled message). ⏳ Needs Adi: Cal.com/Calendly URL — one-line swap.
- **OG image + favicons in-code**: new `src/app/opengraph-image.tsx` (1200×630 Anton/ink/hot kinetic card, site-wide), rebuilt `icon.tsx` (hot square, Anton T), new `apple-icon.tsx` (TIQ lettermark). Removed stray `favicon.ico` and all broken `/og-image.png` references. Anton TTF vendored at `src/assets/fonts/`.
- **Case-study architecture unified**: deleted WorkGrid's duplicate `PROJECTS` array; grid now driven by `case-studies.ts` and tiles link to `/work/[slug]` (were dead-end accordions). Added `deliverables` + `SERVICE_LABELS` to the data module. `[slug]` pages render a framed cover screenshot + "What we delivered" section. Home CaseStudySection shows real covers via `next/image` (placeholder fallback kept).
- **Images optimized**: `public/work/*.png` (9.9 MB) → WebP q82 (0.8 MB total).
- **Robot video self-hosted**: CloudFront dependency removed; re-encoded 3828px/4.4 MB source → 1920px/728 KB with dense keyframes for smooth scrubbing + `robot-poster.webp`.
- **Canonical URLs**: `alternates.canonical` on all 12 routes (domain `techwiseiq.com`).
- **Hygiene**: deleted dead `page.module.css` (starter boilerplate), starter SVGs, orphaned `components/three/` + `GeometricAccents`; uninstalled unused `lenis`, `framer-motion`, `three`, `@react-three/fiber`, `@react-three/drei`. Added `resend`.
- Verified: lint 0 errors, build passes (19 static routes), OG/icon renders inspected, work links + video + booking links checked on prod server.

---

## 2026-06-14 — Visual Overhaul

- **Animation system**: Replaced `.rv` IntersectionObserver with GSAP ScrollTrigger (slide-up, rotate-x, slide-left/right, scale, parallax) via ScrollAnimator component
- **Three.js**: Added wireframe icosahedron hero scene + floating wireframe shapes in Shout section
- **Hero**: Three.js background, floating project screenshot placeholder, stagger entry
- **Manifesto**: Orbiting SVG geometric accents with parallax, removed border-top
- **Services**: Full-width layout, giant parallax background numbers, visual panels with placeholder screenshots on expand
- **Process**: Staggered wave column heights, ghost parallax numbers, enhanced hover
- **Shout**: RotateX heading reveal, Three.js floating wireframes, enhanced strike-through + outcomes burst, removed border-top, centered
- **Case Studies**: Magazine layout (58/38% asymmetric), placeholder images, scale reveal, enhanced hover
- **CTA**: Split layout (heading left, channels right), geometric accent, hot-fill channel hover
- **Inter-section flow**: Removed uniform borders from Manifesto/Shout, varied padding rhythm
- **Dependencies**: Added three, @react-three/fiber, @react-three/drei
- **Reduced-motion audit**: Three.js `useFrame` animation guard via `reducedRef`; `[data-parallax]` added to global CSS reduced-motion reset; `scroll-behavior: auto` under reduced-motion

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
