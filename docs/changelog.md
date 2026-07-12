# Techwise IQ Website — Changelog

Running log of all changes made to the codebase. Most recent first.

---

## 2026-07-12 — Work continuous exhibition redesign

- **Continuous exhibition canvas:** recomposed `/work` from bordered grids into one overlapping visual sequence with centered cinematic titles, image planes, detached proof objects, angled color fields, and shared handoffs between content moments.
- **Scalable client portfolio:** added explicit featured metadata, a tested three-project cinematic cap, fallback selection when no feature flags exist, and a conditional image-led index for future projects.
- **Cinematic project reel:** both current projects receive short desktop sticky stages with reversible GSAP image/title/proof movement; tablet, mobile, and reduced-motion modes remain in normal document flow.
- **Concept Lab as portfolio:** promoted the three self-initiated concepts to large alternating exhibition stages with animated blueprint-ready structure, visible capability tags, honest draft states, and safe published preview/demo behavior.
- **Demonstrated capabilities:** replaced the six-box capability grid with an open outline-type composition that grows directly out of client proof.
- **Connected delivery story:** rebuilt process, principles, and CTA as a continuous route, opposing editorial groups, and a near-viewport closing takeover.
- **Progressive enhancement:** one page-scoped Work motion component owns observers and GSAP cleanup; all content is server-rendered and visible if JavaScript or motion is unavailable.
- **Accessibility and responsiveness:** preserved semantic projects and links, non-interactive drafts, reduced-motion final states, keyboard focus behavior, 44px controls, 16px mobile copy, and overflow-safe 375px layouts.
- **Verification:** Node unit coverage for project partitioning, six Playwright Work-page tests, full ESLint and TypeScript checks, desktop/mobile Chrome visual inspection, and production build.

## 2026-07-11 — Services experience redesign

- **Problem-first overview:** replaced the mouse-scrub robot hero and sparse service rows with a centered bottleneck-led hero, progressive problem navigator, three full-width service acts, connected delivery story, real proof, and a focused CTA.
- **Fluid visual system:** removed the box-grid treatment in favor of overlapping type, static diagonal scene transitions, asymmetric compositions, a single orange scroll current, and responsive Web/Software/AI diagrams.
- **Distinct detail pages:** introduced one shared decision journey—fit signals, outcome flow, proof, capability river, connected process, FAQ, and CTA—with a responsive browser canvas for Web, system map for Software, and human-review workflow motif for AI.
- **Shared content source:** centralized service copy, problem mappings, capabilities, processes, FAQs, proof relationships, metadata inputs, and JSON-LD in `src/data/services.ts`.
- **Honest proof:** Web links to the two real case studies; Software and AI use an explicit Work-page fallback until matching case studies exist.
- **No public service pricing:** removed price language from service metadata, FAQs, visible service content, and service structured data (`Offer`/`PriceSpecification`).
- **Purposeful motion:** one GSAP ScrollTrigger controls the connected current; IntersectionObserver handles content reveals; hover/focus feedback covers problem links, diagrams, arrows, project rows, and pressed CTAs; reduced motion renders final static states.
- **Accessibility and responsiveness:** keyboard-operable navigator, visible selected state, semantic headings/FAQs, decorative motifs hidden from assistive technology, 44px minimum primary actions, and overflow-safe 375px layouts.
- **Regression coverage:** new Playwright suite covers the overview, problem matching, all three detail journeys, pricing-free structured data, reduced motion, keyboard selection, touch targets, and mobile overflow.

## 2026-07-10 — fix: full-height mobile hero marquee

- **Full-field type:** the three kinetic marquee rows are distributed across the complete mobile hero rather than collapsing into a shallow band.
- **Readable overlay:** the semantic claim card and CTAs remain centered above the moving type, with 44px minimum touch targets and a narrow-phone stacked fallback.
- **Collision safety:** the sticker, CTAs, scroll cue, and fixed WhatsApp control retain clear separation across the supported phone sizes.
- **Desktop preserved:** all row positioning changes are scoped to viewports at or below 600px; desktop and tablet retain the original composition.
- **Regression coverage:** Playwright verifies 320×568, 375×667, 390×844, 430×932, 600×900, desktop flow, and hero overflow containment.

## 2026-07-10 — Phase 4: Performance, Accessibility & Optimization (premium-launch roadmap)

**Lighthouse (prod build, emulated mobile): 95 perf / 100 a11y / 100 best-practices / 100 SEO on all six audited routes** (/, /about, /contact, /work, /services/web, /work/aaskra-realty). Budget met.

- **Hero LCP fixed** (3.6s → 3.0s, perf 90 → 95): hero entrance moved from post-hydration GSAP to a CSS `heroIn` keyframe that plays at first paint — the LCP text is never held at opacity 0 waiting for JS. Global reduced-motion reset still kills it.
- **`--soft` darkened** #7A776E → **#66635B** (3.9:1 → 5.3:1 on bone) — every mono label now passes AA; design-system docs updated (both copies).
- **Small hot-on-bone text eliminated** (2.9:1, fails at any size): work tiles, ProofStrip CTAs, home viewLink, case-study snapLink → ink with a 2px hot underline (marker treatment from the display-trick vocabulary). Work tile service labels → soft. **h1 accent words** (about/contact/work "On purpose." / "talk." / "promises.") → ink + 0.12em hot marker underline (hot fill missed the 3:1 large-text bar by 0.09).
- **Footer logotype "IQ"** → hot on an ink chip (5.7:1). Nav logo left as-is (hot on bone; WCAG logotype exemption, not flagged by axe). ⚠️ Adi: veto/keep the footer chip; optionally match the nav.
- **Wordmarks**: visual logotype spans `aria-hidden` with sr-only "Techwise IQ" text for AT.
- **Heading order completed**: sr-only h2s in MiniProcess, DeliverablesSection, FAQSection (service pages had h1 → h3 jumps).
- **Root `error.tsx`** — on-brand error boundary (Anton "Something broke.", Try again + Go home). `loading.tsx` skipped deliberately: every route is statically prerendered, so it would never render.
- **Analytics**: Plausible script in layout, gated on `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` (documented in .env.example) — matches the privacy-policy promise.
- **GEO**: `public/llms.txt` with factual statements — services, starting prices (AED), both case studies, process, contact.
- JS: ~140KB gz first-load per page (shared react/gsap chunks) — inside the 150KB budget.
- Still pending on Adi: Cal.com URL, RESEND_API_KEY + domain verify, founder public name (Person schema + About signature), `priceRange` figure for Organization JSON-LD.

---

## 2026-07-10 — Phase 3: Premium Interactions & Polish (premium-launch roadmap)

- **One animation system**: all inner pages migrated from the legacy `.rv`/IntersectionObserver reveals to GSAP `ScrollAnimator` (`data-animate` + `data-stagger`). `RevealObserver.tsx`, `useReveal.ts`, and the `.rv` CSS are deleted. Shared components (ServiceHero, DeliverablesSection, MiniProcess) converted with parent-level stagger.
- **Design system ratified** (both doc copies): GSAP reveal vocabulary (slide-up/left/right, scale, rotate-x), scrub parallax, the /services mouse-scrub robot video as that page's showpiece, the ink-on-hot contrast rule, and the two-element rule for skew + entrance transforms.
- **Case-study visual weight**: giant Anton result stats (`<dl>`, hot values — real numbers only: 11 pages / 6 profiles / 6 wks; USD 200M+ / 25+ countries / 5 wks) and a scrollable "full build" frame with the complete 7300px-tall page screenshots (`fullPageImage` in data with dimensions).
- **Micro-interactions**: ticker pauses on hover; process numbers render hot-filled on touch devices (`@media (hover: none)` — mobile never saw the hover state); StickerBadge is `aria-hidden` (★ read as "black star"). 404 buttons already use the Button primitive — no change needed.
- **Instant navigation evaluated and deferred**: `cacheComponents` + `unstable_instant` rejects the file-based metadata routes (icon/OG with fs reads) under the draft validator. All routes are fully static so default Link prefetch is already instant; decision documented in `next.config.ts`.
- Verified: lint 0 errors, build passes (19 routes), stats/full-build/animation output checked on prod server.

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
