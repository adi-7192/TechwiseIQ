# Techwise IQ Website — Build Roadmap & Progress Tracker

> **New session? Start here.** Read this file → `docs/HANDOFF.md` → `docs/DECISIONS.md`.
> The site is the **immersive redesign** (D-028) and still being built (D-023).
> Work on the task in **▶ NEXT**. One task = one branch off `main` → PR → both CI checks green → merge (D-029).

---

## ▶ NEXT

**Stage 13 Reference home (13.1) — done, owner-approved 2026-10-10, PR open on `stage-13/reference-home`.** Merge once
CI is green (CI runs the real Turbopack build). Then 13.2: carry the reference style to the inner pages.
**Stage 7 — owner launch gates.** 7.1 and 7.6 done on `stage-7/release`. Next: 🔒 7.2 preview review
(include `/work` Lighthouse on the preview, see 7.1), 7.3 form test, 7.5 launch.

## Progress

**23 / 28 tasks done** · rebuilt for the redesign 2026-10-04

| Stage | Goal | Done | Status |
|---|---|---|---|
| 1. Fixes | Audit findings on the redesign (HANDOFF §3) | 4/4 | ✅ |
| 2. Proof | More real work where buyers decide | 2/2 | ✅ |
| 3. Clarity | How working with us works | 1/1 | ✅ (PR #6 merged) |
| 4. Trust | Honest claims, people, consistent CTAs, booking | 3/4 | 🟡 (voice draft awaiting owner; Cal.com later) |
| 5. Growth | First-step offer, insights | 2/2 | ✅ (PR #8 open) |
| 6. Polish | Concept Lab self-hosting, parked components, docs | 3/3 | ✅ (PR #9 merged) |
| 7. Release | Redesign release checklist → merge to `main` | 3/6 | 🟡 (7.2, 7.3, 7.5 🔒 owner) |
| 8. Showpiece | Home skyline: hero (D-038) + whole-page journey (D-039) | 2/2 | ✅ (PR #11 merged) |
| 9. Work clarity | `/work` shows the work first, with less to read (D-040) | 1/1 | ✅ (PR #12 merged) |
| 10. About | `/about` proves who we are: proof, process, commitments (D-041) | 1/1 | ✅ (PR #13 merged) |
| 13. Reference home | Home rebuilt to the reference composition + Inter Tight (D-045) | 1/2 | 🟡 (13.1 PR #14 open) |

Legend: ⬜ to do · 🟡 in progress · ✅ done · 🔒 blocked on owner · ⏸ held.

### How to update this file
Starting → 🟡. Done → ✅ + date + short hash. Update counts and ▶ NEXT. Add a line to
`HANDOFF.md` §6 and `changelog.md`; new decisions → `DECISIONS.md`.

---

## Waiting on Adi

| Q | Question | Unblocks |
|---|---|---|
| Q7b | Cal.com booking URL (until then "Book a call" → `/contact`, D-032) | 4.4 final |

All other questions answered 2026-10-04 → D-032.

## Standard gate (every task)

`npm run lint` · `npx tsc --noEmit` · `npm run build` · `npm run test:unit` · relevant e2e (full
suite before release) · screenshots at 390 + 1440 · no overflow 320–1440 · reduced-motion + no-JS
show all content · `AGENTS.md` patterns · `/ponytail-review` on the diff (D-024) · docs updated.
New section/page → full agent pipeline (D-020). Visual work follows `docs/design-system.md`
(Immersive) — never Kinetic (D-028).

---

## Stage 1 — Fixes

- ✅ **1.1 `/contact` honest promise + next steps** (R-1, D-027) — 2026-10-04, branch `fix/contact-honest-promise` — `src/app/contact/page.tsx`,
  `ContactForm.tsx`: intro/metadata → "reply within 24 hours, then a written scope after a short
  call"; replace "Response guarantee" with "What happens next" (We reply · 20-minute call · Written
  scope), repeated under the success message with focus on it. Redesign styling only.
- ✅ **1.2 Home LCP** (R-2) — 2026-10-04, verified, no code change. Three sequential uncontended
  Lighthouse mobile runs: perf 90/90/90, LCP 3.5 s, TBT 0–10 ms (matches the 91 after the
  2026-09-05 entrance work). The 84 was measured on a loaded machine. Headroom is thin: the LCP
  element is the intro overlay text; any further gain must keep the entrance work intact.
- ✅ **1.3 Service workbench contrast** (R-3) — 2026-10-04. `/services/*` a11y 96 → 100. Three causes:
  workbench loop dimmed pieces to opacity 0.15 (floor now 0.6 = 4.78:1); automation-scene accent
  is now violet mixed 12% toward fg (4.9:1 on surface); `/services/ai` fork dims the inactive
  branch by colour, not opacity.
- ✅ **1.4 Accessible names match visible text** (R-4, D-031) — 2026-10-04. "TechwiseIQ home",
  "WhatsApp — chat", phone text "WA" → "Chat"; tests updated.

## Stage 2 — Proof

- ✅ **2.1 Three new case studies** (D-032) — 2026-10-04, `stage-2/proof`. Supreme Universal, Express
  Petroleum (featured with ETF), RSiGHT (awaiting launch) + AASKRA under "More client work" with
  labelled Vercel previews (`previewUrl`). /work totals count live sites only. Sitemap derives from
  data; `llms.txt`, Home, `/services/web` proof updated. Facts checked against the live sites.
- ✅ **2.2 Automation proof** (D-032) — 2026-10-04. "What we automate for ourselves" on
  `/services/ai` (own use, not client work; owner confirmed the human-review lines).

## Stage 3 — Clarity

- ✅ **3.1 "How we engage"** (D-032, D-033) — 2026-10-04, `stage-3/clarity`. `/services` section 03
  (was "How it comes together") → `#engage` "You decide. We deliver.": requirements → options
  with our recommendation → you choose (scope + price in writing) → we build your choice. Same
  pattern in each service's 4-step journey (web: design options; software: solution options; AI:
  workflow/tool options) and the `/contact` steps. `/contact` "What happens next" gains
  a no-packages line linking to it. `llms.txt` process → the same model (dropped "discovery
  sprint"/"retainer" products). No prices (D-003).

## Stage 4 — Trust

- ✅ **4.1 About claim** (Q5, R-5) — 2026-10-04, `stage-4/trust`. "Trusted by…" → "Building for
  businesses in Dubai and beyond, turning important ideas into working digital products."
- ✅ **4.2 People on About** (Q2) — 2026-10-04. Hero: "Techwise IQ is a team of experts…". No names (D-005).
- 🟡 **4.3 CTA vocabulary + voice** (rows 1–12 approved + shipped; round 2 site-wide rewrite on branch, owner review) (Q6, R-6) — CTA done 2026-10-04: every primary CTA (header, mobile
  nav, Home, /services, service pages, /work, case studies, About) reads "Bring us the problem" →
  `/contact`. Voice rewrite drafted in `docs/voice-draft.md` — 🔒 owner approval before shipping.
- ✅ **4.4 Booking** (Q7) — 2026-10-04. `BOOKING_URL` (a WhatsApp link) removed; no in-page WhatsApp
  or "Book a call" buttons — WhatsApp is the floating button (+ footer and `/contact` contact
  details). Cal.com later (Q7b): add a `BOOKING_URL` in `src/lib/site.ts`.

## Stage 5 — Growth

- ✅ **5.1 First-step offer page** (Q4, D-036) — 2026-10-04, `stage-5/growth`. `/bottleneck-review`:
  free 20-minute review (same call as `/contact` step 2), no written deliverable. Reuses
  `ContactForm` (`review` prop → hidden `inquiry=review`, own email subject). Linked from the
  `/contact` intro and `/services` #engage only. Full agent pipeline; QA Lighthouse a11y/BP/SEO 100.
- ✅ **5.2 Insights** (D-037) — 2026-10-04, `stage-5/growth`. Six researched, sourced articles
  (drafts: `docs/insights-drafts-2026-10-04.md`, spec: `docs/specs/5.2-insights.md`). `/insights` +
  `/insights/[slug]` from `src/data/insights.ts`; Article JSON-LD, byline "Techwise IQ team";
  footer link + "Worth a read" on each service page. Both [OWNER] claims confirmed and shipped.

## Stage 6 — Polish

- ✅ **6.1 Concept Lab self-hosting** (Q8, R-8) — 2026-10-05, `stage-6/polish` (`b48265e`). Media and
  fonts in `public/concepts/<slug>/media|fonts`; videos re-encoded 1080p (~100 MB → 18.6 MB), images
  WebP. `release-qa` fails on any third-party request from a demo.
- ✅ **6.2 Parked components** (Q15, R-7) — 2026-10-05 (`656600c`). Deleted the 20 files unreachable from
  any route or test (`components/proof/*`, Home `Chapter*`/`FinalCta`, `immersive/index.ts`) and the
  dead chapter copy in `home-content.ts` (−2,627 lines).
- ✅ **6.3 Docs** — 2026-10-05. `site-spec.md` rewritten from the shipped code (all routes);
  31 Kinetic-era docs carry a "Historical" banner in place; redesign-era logs marked accurately.

## Stage 7 — Release (from the redesign's `TASKS.md`)

- ✅ **7.1 Full verification** — 2026-10-05, `stage-7/release`. Gate green; full e2e on a prod build
  359 pass / 26 skipped by design, twice. Lighthouse mobile (18 routes, sequential, system Chrome —
  Playwright's Chromium gives NO_FCP): a11y/BP/SEO 100 everywhere; perf 91–94 except **`/work` 89**
  (3 runs, LCP 3.7 s). Cause: `/work` HTML is 14.4 KB gzip (most content of any page since Stage 2),
  one simulated round trip more than other pages; Vercel serves brotli (9.8 KB), so confirm it on the
  preview in 7.2. Raising the first image's fetch priority was tested — no change, reverted. Content
  parity: `llms.txt`, `/work` totals (114 pages, 3–5 weeks), sitemap and pages match `src/data/*`.
- 🔒 **7.2 Preview review** — owner reviews the Vercel deployment (protected: sign in to Vercel).
  Also run Lighthouse mobile on the preview's `/work` (bar ≥90; local gzip run reads 89, see 7.1).
- 🔒 **7.3 Production form test** — Resend env + test inquiry.
- ✅ **7.4 Merge to `main`** — 2026-10-04, PR #1 (`5e00dce`). CI added (`.github/workflows/ci.yml`),
  `main` protected (both checks required). Vercel deploys `main` to production automatically.
- ✅ **7.6 De-flake e2e tests** — 2026-10-05 last fix. 2026-10-05: `work-page` "TerraElix live preview" (the
  only CI retry since the playback fix) moved to `scrollIntoViewHeld` after reload — 10/10 under 4
  workers. No other retries in the last 10 CI runs. History: `home-experience` "playback pauses on demand…" passes only on
  retry in CI; `performance-mobile` long-task budget (<200 ms) depends on host load. Fixed
  2026-10-04: `performance-mobile` canvas test used a native `scrollTo` that Lenis overrode on CI
  (trace showed the page never left #selected-work) — now retries the jump until it holds.
  Same cause fixed 2026-10-04 in `home-experience` "playback pauses…": Lenis carried the jump past
  the demo (8% visible, Play resumes only at ≥30%), so it sat at step 0; now retries the jump until
  it holds and waits for `data-playing="true"` (10/10 alone, 72/72 under 4 workers).
  2026-10-05: the same jump moved into `tests/e2e/helpers.ts` (`scrollIntoViewHeld`) and used by
  `kinetic-home` "software construction…" too; full suite 3/3 clean runs (was 1 flake per run).
  Same cause fixed 2026-10-04 in `work-page` "TerraElix live preview … reduced motion": 400 ms after
  `scrollTo(0,0)` the page was still 77–477 px down mid-Lenis-scroll; now waits for scrollY 0.
- 🔒 **7.5 Production smoke + launch gates** — domain/DNS, real devices, promote.

## Stage 8 — Showpiece

- ✅ **8.1 Home hero skyline** (D-038) — 2026-10-06, `feat/skyline-hero`. Owner picked prototype B of
  three (`proto/hero-variations`). Instanced three.js city in the existing session-singleton engine
  (`lib/scene/engine.ts`, `lib/scene/city.ts`); per-tower motion in the shader; left-aligned hero;
  floating cards and the SVG field poster removed. Gate + full e2e on a production build (one host-load failure, `main` fails it identically —
  see HANDOFF §6); Home HTML 428 KB → 82 KB; Lighthouse
  mobile Home perf 92/95/93 (was 91). Owner reviews on the PR preview, then merge.

- ✅ **8.2 Whole-page skyline journey** (D-039) — 2026-10-06, same branch/PR. Fixed scene layer behind
  every Home section, camera stop per section (`lib/scene/journey.ts`), service districts, cursor
  light everywhere + desktop cursor halo, footer finale. Render on demand, adaptive DPR, lite
  (hero-only) budget on software WebGL. UX + QA agent review (D-020): wake-jump blocker and legibility
  fixes applied. Full e2e 362 pass; Lighthouse mobile Home 91–94.

## Stage 9 — Work clarity

- ✅ **9.1 `/work` UI/UX clarity + trust pass** (D-040) — 2026-10-06, `stage-9/work-page`. Owner-approved
  plan after a 390/1440 review. Hero: "Our work", totals strip (3 live sites · 114 pages · 3–5 weeks)
  beside the h1, first project above the fold at 1440×900. Featured rail: one page accent, browser-framed
  covers showing the real domain (cover clicks through to the case study), meta = industry only,
  Before → client-reported Result instead of Challenge/Decision. More client work: 2-up, text links.
  Concept Lab on `Section` (markers 01/02/03), "Concept 0N", "Open the live demo". How we work: 4 steps,
  lists dropped. Compact h2 CTA. All 5 covers recaptured without floating widgets/cookie bars.
  PM + web-designer + UX + QA agents (D-020). Full e2e 362 pass; Lighthouse mobile `/work` perf 90
  (was 89), a11y/BP/SEO 100; page height 7.6k → 6.6k px desktop, 10.7k → 9.6k mobile.
  `/ponytail-review` applied (4 trims, ~20 lines).

## Stage 10 — About

- ✅ **10.1 `/about` rebuild** (D-041) — 2026-10-07, `stage-10/about`. Owner-approved plan after a
  390/1440 review: fact-sheet hero, why-we-exist statement, track record from data, D-033 process
  showpiece (pinned on desktop, stacked on touch/short screens), five commitments, service paths,
  one compact CTA. Meta description no longer says "trusted by". `BrowserBar` moved to
  `src/components/BrowserBar` (shared with /work). Full agent pipeline (D-020): UX no-ship ×2
  (tap targets, smooth-glide on pin fallback) → fixed; QA FAIL on perf → fixed → PASS. Owner copy
  answers 2026-10-07: h1 option B, search-foundations row dropped, EP label stays Dubai; h1 set at
  statement scale on desktop so it fits the fold. Full e2e 388 pass; Lighthouse mobile `/about`
  median 95 (5 runs, min 92; pre-rebuild 94), a11y/BP/SEO 100, CLS 0. `/ponytail-review` applied.

## Stage 13 — Reference home

- ✅ **13.1 Home to the reference composition** (D-045) — 2026-10-10 — branch `stage-13/reference-home`. Centred hero +
  ghost line + floating artifact cards over the skyline; chapter per service (giant title + accent dot,
  thesis right, illustrated feature card + parallax artifacts, hairline capability grid); pill chapter
  nav; centred closing CTA. Inter Tight replaces Manrope + Archivo. Full pipeline (D-020).
  **Done 2026-10-10:** owner reviewed on local prod build ("looks good"), accepting the as-built orbit
  accents, chapter-dot glow and pill-nav strings. QA contrast blocker fixed (0 failures, 390 + 1440,
  motion + reduced). Gates: lint, tsc, `next build --webpack`, unit 33/33, e2e home + responsive 235/235.
  Notes carried forward:
  - Turbopack build panics in the `website-stage-13` worktree (symlinked `node_modules`); gates ran on
    `next build --webpack`. CI runs the real `npm run build`.
  - HANDOFF §6: reconcile `SiteFooter` with the owner's uncommitted edits on `stage-12/atmosphere`.
  - TBT: Lighthouse mobile median TBT 0 ms over 6 runs, but single runs spike to ~190 ms — a rAF task
    where the first WebGL frame's compositor commit lands (headless software GL). Not a HomeMotion cost
    (its setup is ~27 ms at 4× CPU). Recheck on the Vercel preview with real GPU before treating as a gap.
- ⬜ **13.2 Carry the reference style to inner pages** — after owner review of 13.1.

## Later / rejected

- Later: industry pages (2+ projects per industry), Arabic `/ar/*`.
- Rejected: public `/pricing` (D-003); stats/logo strips/testimonials without verifiable data (D-002).
