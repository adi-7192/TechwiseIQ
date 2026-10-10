# Techwise IQ Website — Changelog

Running log of all changes made to the codebase. Most recent first.

---

## 2026-10-10 — Insights + edge pages (ROADMAP 14.5–14.6, D-046)

- `/insights`: centred "Plain answers. / Real sources." compact hero; the article list is unchanged.
  Articles keep their reading layout (they inherit the new `DisplayHeading` type).
- Privacy, terms, 404 and error verified on the backdrop with the new heading type; no code change needed.

## 2026-10-10 — Contact + bottleneck review in the reference grammar (ROADMAP 14.4, D-046)

- `RefHero compact`: no viewport min-height, for pages whose job starts right below the hero.
- `/contact`: centred "Let's / talk shop." hero; the form, direct methods and next steps unchanged.
- `/bottleneck-review`: centred "The free 20-minute / bottleneck review." hero with a pill to the form;
  "How it works" as a reference intro with a ruled 4-col grid. Form and copy unchanged.

## 2026-10-10 — About in the reference grammar (ROADMAP 14.3, D-046)

- `DisplayHeading` `<em>` is now the grey ghost run (muted, weight 400) instead of the acid accent, and
  statement/h2 sizes get the reference's tighter tracking. This applies site-wide wherever headings
  use `<em>` (About, Contact, Insights, legal).
- `/about`: pill nav (Short version / Track record / Process / Commitments / Services) right after the
  hero. Layout, motion and copy from D-041 unchanged (fact sheet stays beside the h1).
- Tests: About tab-order tests account for the chapter nav. Full e2e 427/427 locally.

## 2026-10-10 — Work in the reference grammar (ROADMAP 14.2, D-046)

- `/work`: centred "Proof, not / promises." hero with the orbit cards and the totals as one centred row;
  "Live client / sites." and Concept Lab and How we work as reference intros (ruled 4-col process grid);
  pill nav; the closing "Want one like these?" section removed (the footer closes the page).
- `/work/[slug]`: centred RefHero (breadcrumb + meta, title with accent full stop, outcome, live-site +
  contact pills); the duplicate project CTA section removed. Story chapters unchanged.
- RefHero top padding raised so orbit cards clear the header.

## 2026-10-10 — Services in the reference grammar (ROADMAP 14.1, D-046)

- `/services`: centred ghost-line hero with the connected-system demo floating below; "Three services. One
  team." intro; one chapter per service (giant word + accent dot, Home's illustrated feature space, first
  three capabilities as a ruled grid); starting-point and engagement sections as intros with ruled grids;
  pill nav (Services / Starting point / How we engage).
- `/services/{web,software,ai}`: centred hero with the service demo on a floating panel; fit intro with an
  outcome grid; chapters Build / Approach / Delivery / Proof / Details with the service accent; Build
  carries the illustrated feature space, the workbench and every capability (examples folded in, the
  "full scope" disclosure removed); pill nav.
- No second closing section: the footer is every page's close (skill updated, `ClosingCta` dropped).
- Tests: `/services` h1 text now has its space; a11y spec checks the muted ghost line, not acid.

## 2026-10-10 — Redesign rollout foundation (ROADMAP 14.0, D-046)

- `src/components/immersive/reference/`: `RefHero`, `RefIntro`, `Chapter`, `CapabilityGrid`, `Panel`,
  `ClosingCta`, `PillNav` (IntersectionObserver active state) + `reference.module.css`, mirroring Home's
  grammar. Home is not migrated onto them yet.
- Checkered backdrop (D-043, cherry-picked from `stage-12/atmosphere`) is on by default in
  `ImmersiveShell`; Home passes `backdrop="none"`.
- Skill `.claude/skills/reference-redesign/SKILL.md` for redesigning one page at a time.
- Stage-12 footer-arrow edits (D-044) stashed, not merged.

## 2026-10-10 — Home to the reference composition (ROADMAP 13.1, D-045)

- Owner-approved 2026-10-10. QA contrast blocker fixed: every Home stop ≥ 4.5:1 at 390 and 1440, with
  and without motion. Unit 33/33, e2e home + responsive 235/235.
- Inter Tight replaces Manrope + Archivo site-wide.
- Home rebuilt to the reference composition: centred hero + ghost line + floating orbit cards, chapter
  per service (giant title, accent dot, illustrated feature card + parallax artifacts, capability grid),
  centred closing CTA. A centred skyline well frames both the hero and the finale.
- Pill chapter nav restored (Intro / Websites / Software / Automation / Work), `aria-current` from
  ScrollTrigger, hidden ≤768px and while the intro overlay plays.
- `ServiceDemo` removed from Home; its tests moved to `tests/e2e/service-detail-refinement.spec.ts`.
- Lenis: a hash deep link lands outright when Lenis starts (`scrollTo(target, { immediate: true })`);
  the scroll-behavior override keys on `html.lenis`, not `.lenis.lenis-smooth`.
- GSAP 3.12+ folds computed CSS `rotate`/`scale`/`translate` into its transform: the reduce cleanup
  strips those inline values from depth objects.
- UX should-fixes: reveals use opacity only (no `visibility: hidden` pre-state or `autoAlpha`), so
  unrevealed chapter links stay in the Tab order; the intro bootstrap has a 3 s failsafe to
  `data-intro="ready"` if the bundle never runs; pill nav focus ring follows the pill radius; feature
  mock pills show `cursor: default`. New e2e: first Tab pass reaches "Explore web development" before
  the footer; intro failsafe with the JS bundle blocked.
- QA contrast fix (§8 sweep, every stop at 1440 and 390, motion and reduced): skyline exposure lowered at services 0.3,
  websites/apps 0.22, automation 0.28, work 0.4, model 0.3; hero well 0.8; phone stops capped at 0.18 with a 0.45
  centred hero well; 11px count/index labels lifted to `--tw-fg`. Tap targets: every `PrimaryCTA` variant (ghost
  included) is ≥44px under `pointer: coarse`.

## 2026-10-07 — /about rebuilt around proof, process and commitments (ROADMAP 10.1, D-041)

- `src/components/AboutExperience/` rebuilt: hero h1 + company fact sheet (data-driven), "the short
  version", track record (route map, live-only totals, case-study cards), the D-033 process on a
  sample brief (pinned scroll sequence on desktop, stacked elsewhere), five commitments, service
  paths, compact CTA. New `AboutMotion.tsx` (GSAP: lit words, reveals, count-ups, drawn route and
  checks, pinned process with a runtime fit guard); full reduced-motion and no-JS final states.
- `src/app/about/page.tsx`: metadata and JSON-LD from `about-content.ts`; no "trusted by".
- `BrowserBar` moved to `src/components/BrowserBar` with its own CSS module; `/work` imports updated.
- `getClientCountries` in `src/app/work/work-projects.ts` (+ unit tests).
- Tests: `tests/e2e/about-experience.spec.ts` rewritten (structure, honesty, pin, fallback, touch
  targets, CLS, reduced motion, no-JS).

## 2026-10-09 — Checkered backdrop + floating depth on /work (ROADMAP 12.1, D-043)

- `ImmersiveShell` gains opt-in `backdrop="checker"`: fixed `.tw-backdrop` layer (globals.css) — dark
  green checker (SVG mask over acid 7% in `--tw-bg`, 48px / 32px on phones), radial edge fade
  (`scene-glow-ok`, D-043).
- New `src/components/immersive/DepthMotion.tsx`: ScrollTrigger-driven backdrop drift (0.3× / 0.15×
  phones) and `[data-depth]` panel drift via `translate`; off on phones (panels) and under reduced motion.
- `/work`: backdrop on; `data-depth` on featured covers (28), more-work thumbs (16), Concept Lab cards
  (16/28 alternating).

---

## 2026-10-06 — /work clarity + trust pass (ROADMAP 9.1, D-040)

- Hero: eyebrow "Our work", new intro, totals `<dl>` moved from below the projects into the hero
  (labels "Live client sites" · "Pages shipped" · "Weeks, brief to launch"), single ghost CTA.
- Featured rail: no per-card accent, shared `BrowserBar` (new `src/app/work/BrowserBar.tsx`) with the
  real hostname, cover links to the case study (`tabIndex -1`, `aria-hidden`), hover zoom gated to
  fine pointers + no-preference motion, Before → Result (`WorkSummary.reported`, new optional field).
- More client work: 2-up grid, text links. Concept Lab: `Section` + `SectionLabel index="02"`,
  "Concept 0N · …", "Open the live demo". How we work: index 03, principle lists removed. Final CTA
  compact (`size="h2"`). `.conceptPreview` raw hex → `var(--tw-bg)`.
- `public/work/*-hero.webp` (all 5) recaptured from the live/preview sites with floating widgets hidden.
- Tests: unit (metric order/labels, featured ⇒ live, `reported` ⊂ `result`, unique Before lines),
  e2e copy/labels + new checks.

## 2026-10-06 — Whole-page skyline journey (ROADMAP 8.2, D-039)

- One fixed scene layer behind every Home section; `src/lib/scene/journey.ts` (camera stop per
  section, `data-journey` markers), districts in `city.ts`, damped journey + render on demand +
  adaptive DPR + software-WebGL lite budget in `engine.ts`.
- Cursor: city light follows the pointer in every view; new `CursorGlow` halo (desktop only).
- `SiteFooter journey` (Home only): transparent footer as the finale stop.
- Scene mount attribute `data-hero-scene` → `data-home-scene`; canvas reports `data-stop` and
  `data-render`. Tests: `tests/unit/journey.test.ts`, district test, journey/lite/halo e2e.

## 2026-10-06 — Home hero skyline (ROADMAP 8.1, D-038)

- Hero scene is now an instanced three.js city (`src/lib/scene/city.ts` + rewritten
  `src/lib/scene/engine.ts`): rises from the centre, acid light follows the pointer, camera climbs to
  an overhead view as the hero scrolls away. All per-tower motion in the shader.
- `HomeHero` copy left-aligned with copy and actions side by side; floating artifact cards, their
  GSAP drift (`HomeMotion`) and the inline SVG field poster (`HeroFieldPoster`, `lib/scene/field.ts`)
  deleted. Hero strip's right label shows the Dubai coordinates.
- Home hydration warning fixed (`suppressHydrationWarning` on the motion-bootstrap root).
- Tests: `tests/unit/city.test.ts` (budgets, determinism, one needle, rise sweep, downtown framing);
  e2e updated for no poster/cards and `data-tower-count`.

## 2026-10-05 — Stage 7: Release verification (ROADMAP 7.1, 7.6)

- 7.6: `work-page` "TerraElix live preview" holds the demo in view after reload
  (`scrollIntoViewHeld`) — the last test that needed a CI retry.
- 7.1: full verification recorded in ROADMAP (no product code changed).

## 2026-10-05 — Stage 6: Polish (ROADMAP 6.1–6.3)

- 6.2: deleted parked redesign components (`src/components/proof/*`, Home `Chapter*`, `FinalCta`,
  `immersive/index.ts`) and unused Home chapter copy — nothing imported them.
- 6.1: Concept Lab demos self-host their media and fonts: 5 videos (H.264 1080p CRF 27), 6 images
  (WebP/PNG), 6 woff2 latin subsets (OFL). Tests updated; new `release-qa` check for third-party
  requests.
- 6.3: `docs/site-spec.md` rewritten for the redesign; historical banners on Kinetic-era docs.

## 2026-10-04 — Stage 5: Insights (ROADMAP 5.2)

- Six researched articles (D-037) at `/insights/[slug]`, list at `/insights`, data in
  `src/data/insights.ts` (inline markup rendered by `src/app/insights/inline.tsx`). Every number
  cites a numbered source with its year; sources open in a new tab.
- `Article` + `BreadcrumbList` JSON-LD (author "Techwise IQ team"), `CollectionPage` on the list.
- Footer "Insights" link; "Worth a read" list in each service page's questions section.
- Sitemap (+7) and `llms.txt` Insights section. Unit test (`tests/unit/insights.test.ts`) and e2e
  (`tests/e2e/insights.spec.ts`); routes added to responsive/launch-smoke/release-qa.
- Test: de-flaked `home-experience` playback (Lenis scroll drift, ROADMAP 7.6).
- Owner confirmed the two claims: art. 2 and art. 6 now close with them (D-037 update).
- Draft sources corrected before publish: Portent stat dropped (no primary), Similarweb via
  TechCrunch, `.ae` via Wikipedia.

## 2026-10-04 — Stage 5: Growth (ROADMAP 5.1)

- New static page `/bottleneck-review` (free 20-minute bottleneck review, D-032 Q4, D-036): hero,
  How it works (4 steps), Good things to bring, What it is (and isn't), form. `Service` JSON-LD,
  no price. Step 01 links to the form.
- `ContactForm review` posts a hidden `inquiry=review`; the action sends subject
  "Free bottleneck review request — …" + a `Type:` line. Only the exact value counts.
- Links: one in the `/contact` intro, one under `/services` #engage. Sitemap + `llms.txt` updated.
- Tests: unit (subject, tampered value), e2e page check; route added to responsive, launch-smoke,
  release-qa route lists.

## 2026-10-04 — Stage 4: Trust (ROADMAP 4.1–4.4)

- `/about`: "Building for businesses in Dubai and beyond" (was "Trusted by…"); hero says "a team of
  experts"; closing CTA → `/contact`.
- One primary CTA site-wide: "Bring us the problem" → `/contact` (replaces "Start a project",
  "Discuss your project", "Start the conversation", "Bring us the business problem").
- Booking: `BOOKING_URL` (WhatsApp prefill) removed; dropped in-page WhatsApp/"Book a call" buttons
  on `/work`, case studies, mobile nav and `/contact` (self-link). Floating WhatsApp button stays.
- Voice: approved rows 1–12 shipped. Round 2 site-wide plain-English rewrite (services data and
  guides, Home, /services, /work, case-study CTA, About, contact, footer) — no jargon, same facts.
  Key words highlighted with `<strong>` in paragraphs (`globals.css`). `/work` process → D-033.
- E2E: About trust copy, CTA selectors scoped to `main`, new `release-qa` check (one CTA → `/contact`,
  no in-page WhatsApp outside `/contact`).

---

## 2026-10-04 — Stage 3: Clarity (ROADMAP 3.1)

- `/services` section 03 is now "How we engage" (`#engage`): "You decide. We deliver." — we gather
  requirements → bring options with our recommendation → you choose → we build your choice.
  Reuses the existing four-step track and styles.
- `/services/{web,software,ai}` journeys follow the same pattern (step 02 = options, illustrated
  as "Options, side by side" with "Our pick"); heading "Your call. At every step."
- `/contact` steps: 20-minute call gathers requirements; step 3 "Options, then your call."
- `/contact` "What happens next" ends with "No packages or price lists: every quote is for your
  requirement." + link to `/services#engage`.
- `llms.txt` "Process" → "How we engage", same model, no prices.
- E2E: engage section steps + CTA (`services-experience`), contact link (`contact-form`).

---

## 2026-10-04 — Stage 2: Proof (ROADMAP 2.1, 2.2)

- New case studies: Supreme Universal (76 pages), Express Petroleum (28 pages), RSiGHT (awaiting
  launch). Featured: Supreme, ETF, Express Petroleum. AASKRA + RSiGHT in "More client work" with
  labelled preview links (`previewUrl`, never counted as live) and a project status.
- `/work` totals now count live sites only (114 pages, 3 live); the old total counted unlaunched builds.
- `/services/ai`: "What we automate for ourselves" — the team's own automations, labelled as such.
- `/services/web` proof → the three live sites; Home selected work shows three cards.
- Sitemap generated from case-study data; `llms.txt` lists the new studies.
- ETF result line now attributed ("The client reports enquiries from 25+ countries").

---

## 2026-10-04 — Service contrast + accessible names (ROADMAP 1.3, 1.4) — Stage 1 done

- `/services/*` a11y 96 → 100. The mock text wasn't light: the workbench loop faded pieces to
  opacity 0.15. Dim floor is now 0.6 (4.78:1). Automation scene accent = violet + 12% fg (raw
  violet was 4.1:1 as small text). `/services/ai` fork marks the inactive branch by colour.
- Accessible names (D-031): logo "TechwiseIQ home"; WhatsApp "WhatsApp — chat"; phone text "Chat ↗".
- Lighthouse a11y/BP/SEO 100 on all 12 routes.

---

## 2026-10-04 — Home LCP verified (ROADMAP 1.2)

- No code change. Home Lighthouse mobile perf 90 ×3 (sequential, uncontended), LCP 3.5 s, TBT
  ≤10 ms — meets the ≥90 bar. The audit's 84 came from a run on a loaded machine.

---

## 2026-10-04 — `/contact`: honest promise + "What happens next" (ROADMAP 1.1)

- Intro and metadata no longer promise scope, timeline and cost within 24 hours (scope needs a
  call first): "reply within 24 hours, then a written scope after a short call" (D-027).
- Sidebar "Response guarantee" box replaced by "What happens next" — three numbered steps. The
  same steps appear under the success message, which now receives focus; the sidebar copy hides.
- E2E: `contact-form.spec.ts` checks the steps, the removed copy and success focus.
- De-flake: `work-page` TerraElix pause check sampled while Lenis was still scrolling to the top
  (page 77–477 px down after 400 ms); it now waits for scrollY 0. Failed 3/3 on CI, 1/5 locally →
  20/20 under 4 workers.

---

## 2026-10-04 — Redesign merged to main; CI/CD in place

- PR #1 merged into `main` (`5e00dce`): immersive redesign, carried content fixes, old UI removed.
- GitHub Actions CI added — lint, `tsc`, unit, build, and the full Playwright suite on a production
  build. Green on the PR (277 passed, 2 flaky on first try) and on `main` after the merge.
- `main` branch protection: both CI checks required, no force-push/deletion (D-029).
- Vercel production deployment of `main` succeeded (behind Deployment Protection).

---

## 2026-10-04 — Redesign made primary; old design removed

The day's roadmap work (in a worktree branched from `main`) had been done on the old Kinetic
design. Owner decision D-028: the immersive redesign is the site, all changes land on it.

- Committed the owner's uncommitted redesign WIP on `redesign/immersive-system` (`0481568`).
- Old-design commits archived at local tag `archive/old-design-2026-10-04` (never pushed).
- Carried over: `llms.txt` without prices (D-022), AASKRA honesty copy, AASKRA + ETF screenshots
  without cookie banners (ETF cover replaced — it was captured mid-animation), screenshots for three
  new projects, anchor/price guards in `launch-smoke`, ponytail plugin, AGENTS.md read-first block.
- Deleted every Kinetic component no route reached (Hero, HomeExperience, Nav, Footer, CTASection,
  Ticker, Marquee, ServiceHero, MiniProcess, ProofStrip, DeliverablesSection, FAQSection, old
  AboutMotion, unused ui exports, hooks, robot video, marquee/.wrap globals).
- `launch-accessibility`: `/services` h1 accent assertion updated to the acid accent set in 3f65173.
- Re-audited the redesign; rebuilt `ROADMAP.md`, `HANDOFF.md`, `DECISIONS.md` for it.
- Verified: lint, tsc, 13/13 unit, build, 277 e2e pass on a production build.

---

## 2026-09-05 — Hero entrance moved to CSS; scene fades in

Follow-up to the entry-animation fix below. Adi: "the hero glitches and does not
load smoothly in the beginning ... it should feel smooth and flawless even if I
load it multiple times." Filmed the repeat-load path frame by frame (4x CPU,
10Mbps, production build) rather than reasoning about it, which showed two
defects that had nothing to do with animation weight:

1. The hero was **completely blank from the first paint until ~330ms** — header
   and WhatsApp button only. The entrance was a GSAP timeline, so it could not
   begin until the bundle had downloaded, parsed and hydrated. On a first visit
   the intro overlay hides that; on any repeat visit it is a dark empty screen
   followed by a pop.
2. The WebGL field **hard-cut in at full brightness** around 340–445ms, after the
   headline had already started moving. It never faded.

- **Hero entrance is now CSS** (`HeroStage.module.css`), on the same timings the
  GSAP timeline used: lines wipe up from `translateY(115%) rotate(3deg)` over
  1.15s staggered 0.13s; support copy fades up 18px over 0.85s from 0.35s,
  staggered 0.1s; artifacts fade and scale from 0.88 over 1.2s from 0.2s. It
  starts at the first paint instead of at hydration — measured at ~150ms rather
  than ~330ms — and needs no JavaScript at all. Held at its first frame by
  `animation-play-state: paused` while `html[data-intro='loading']`, so it cannot
  be part-way through when the overlay lifts. The reduce block in globals.css
  kills `animation` outright, which lands everything in its natural visible state.
- **GSAP keeps only the continuous artifact drift**, started 1.7s in so the
  artifacts are not still scaling while they begin to float. The three `.from()`
  hero tweens are gone.
- **`pending` now covers the scroll reveals only.** The hero owns its own start
  frame through the CSS animation's `both` fill, so it is never hidden waiting on
  the bundle — which also makes the intro-overlay exemption added earlier today
  obsolete, and it is removed.
- **The scene canvas fades in** (`engine.ts`): mounts at `opacity: 0` with a 900ms
  transition and is revealed by `markPainted()` once it has actually rendered a
  frame. Reused across navigations without re-fading.

Verification: 26 full-page screenshots byte-identical to the pre-change baseline —
the resting state is untouched, only the arrival changed. Lighthouse mobile
91/100/100/100, LCP 3.5s, CLS 0, TBT 0ms (unchanged). Build passes 19/19, lint
clean, 13 unit + 179 e2e + 15 home-experience pass, including two new tests: the
hero must settle with the JS bundle blocked entirely, and must stay paused behind
the overlay.

Note on vocabulary: this puts the hero entrance in CSS keyframes rather than GSAP.
GSAP remains the only DOM animation *library* and still owns everything
scroll-linked and continuous; a first-paint entrance is the one thing it
structurally cannot do, since it does not exist until the bundle runs.

---

## 2026-09-05 — Home page: entry-animation flash fix and load pass

Adi reported that switching to the home page "glitches" and asked for a
performance pass that changes nothing visible.

The glitch was not animation load — it was a missing pre-animation state. The
server HTML painted the fully-revealed page, then `HomeMotion`'s `useEffect` ran
*after* that paint and snapped everything back to the start of its entry
animation. Measured before the fix: **21 of 21** tracked elements (hero lines,
hero support copy, floating artifacts, every `[data-home-reveal]` block) painted
visible and were then hidden. On a first load the intro overlay covered that
frame; on a client-side navigation nothing did. `data-home-experience` already
carried `data-home-motion="static"` as the hook for this and nothing consumed it.

- **Pre-animation state (`studio.module.css`, `home/index.tsx`, `HomeMotion.tsx`).**
  Three-state machine on `[data-home-experience]`: `static` (server render / no JS
  — everything visible, fail-open) → `pending` (pre-animation frame, set before
  paint) → `active` (GSAP's inline styles own the elements). `pending` is armed by
  an inline bootstrap script during parse on a hard load and by a layout effect on
  a client-side navigation. The handover to `active` happens after the tweens are
  built, which is what keeps their trailing `clearProps` from re-hiding anything.
  **After: 0 of 21 elements flash.**
- **Not armed behind the intro overlay.** While `html[data-intro='loading']` the
  hero sits behind an opaque full-viewport overlay, so there is no flash to
  prevent — and withholding the hero copy from the first paint costs LCP, which is
  measured on that paragraph. Arming it there cost ~2s of mobile LCP (5.5s vs 3.5s)
  for no visual gain; the exemption is covered by a regression test.
- **Off the hydration commit.** `/` mounted 8+ client components in one commit.
  The three `ServiceDemo` timelines (~20 tweens and several `querySelectorAll`
  passes each, two of them far below the fold) are now built on approach via a
  `rootMargin: '400px'` observer; playback still starts at `threshold: 0.3`, so the
  demos still begin at step 0 when you reach them. `ScrollTrigger.refresh()` (a
  full-document reflow) moved into a `requestAnimationFrame`, and
  `ScrollTrigger.config({ ignoreMobileResize: true })` stops the mobile URL bar
  from triggering a refresh mid-scroll.
- **One Lenis, not one per route.** `ImmersiveShell` is per-route, so two shells
  can briefly coexist during a navigation and each instantiate its own Lenis,
  fighting over the same wheel events. `SmoothScroll` now reference-counts a
  module-level instance.
- **Render loop (`lib/scene/engine.ts`).** `readExit()` called
  `getBoundingClientRect()` *inside every rAF frame* — a forced layout per frame
  for as long as the hero was on screen. The hero box is now cached by
  `measureContainer()` (attach, resize, ResizeObserver, re-entry) and exit progress
  derived from `window.scrollY`. `powerPreference` dropped from
  `'high-performance'` to `'default'`: forcing the discrete GPU for a few hundred
  decorative points costs a context-creation stall and battery.
- **Dead CSS removed.** 100 unreferenced rules — `studio.module.css` 652→260
  lines, `home.module.css` 576→424 — including a `perspective: 1400px` stage and
  two rotated panels with `0 35px 70px` shadows that no component rendered.

**Verification.** 26 full-page screenshots (13 routes × 1280/1440) byte-identical
before and after. Lighthouse mobile 91/100/100/100 (was 88–93), LCP 3.4–3.5s (was
3.2–3.7s), CLS 0, TBT 0–10ms (was 20–140ms); desktop 100, LCP 0.7s. Build passes,
19/19 routes prerender, lint clean, 13 unit + 179 e2e pass. Four regression tests
added to `home-experience.spec.ts`.

**Still open.** Mobile Lighthouse is 91, not the ≥95 the budget states, and LCP
3.4s against a <1.8s target — both pre-existing. The cause is design timing, not
code: the intro overlay holds for up to 2.6s and the hero intro tween runs 1.15s
after it, so the hero copy cannot be the LCP before ~3.4s on throttled mobile.
Shortening that is a motion-vocabulary decision and needs Adi's sign-off.

---

## 2026-09-05 — Hero depth field replaces the site-wide WebGL scene

Adi supplied a 21st.dev "galaxy interactive hero" reference (hosted Spline scene)
and asked for it in the hero background, in a form that respects the design
system. The reference was **not** integrated as shipped — `@splinetool/react-spline`
is a second WebGL runtime (~1MB JS) streaming an asset we do not own from
`prod.spline.design`, and its look (indigo/purple identity, `backdrop-filter`
blur, two overlay gradients, a fake app screenshot, a duplicate navbar, the
banned word "Elevate") collides with the design system on six separate counts.
Per the "external components are never pasted in" rule the idea was extracted —
depth, pointer parallax, a field that frames the headline — and rebuilt in our
own engine. Adi chose this over installing Spline, and chose hero-only scope.

- **Scope.** WebGL now exists on exactly one surface. `lib/scene/presets.ts`,
  `immersive/PersistentScene` and `tests/unit/scene-presets.test.ts` are deleted;
  `immersive/HeroScene` replaces them and is mounted by `HomeHero`, not by
  `ImmersiveShell`. `ImmersiveShell` loses `withScene` (its `scene` prop now only
  picks the CSS accent) and `SmoothScroll` loses `feedScene`. Every non-home route
  runs on the CSS radial atmosphere, which was always the designed fallback.
- **Composition.** `lib/scene/engine.ts` rewritten: a receding lattice of ~150
  deterministic clusters (anchor + five satellites, two links back) in muted
  graphite-green with acid on a sparse minority of anchors. Reads as connected
  systems in depth rather than decorative sparkle — the line `anti-slop-checklist.md`
  draws. The legibility "well" behind the `h1` is baked into vertex colours, so no
  overlay gradient was needed and the gradient ban holds.
- **Motion.** Slow ambient breathing, pointer parallax, and a scroll-linked exit
  (camera pushes in, field fades out as the hero leaves). Exit progress is read off
  the container rect inside the already-scheduled render loop rather than via a
  scroll listener, so Lenis stays the single scroll driver.
- **Budget.** Field construction is allocation-free and deferred to
  `requestIdleCallback`, so it never sits on the hydration critical path. 900 nodes
  desktop / 300 mobile. The loop is gated by an `IntersectionObserver` on the hero,
  so scrolling past it stops GPU work entirely — cheaper than the old always-on
  fixed canvas. Three.js is code-split behind the home route; `/privacy`, `/about`,
  `/services/ai` and `/work` now download none of it (asserted in
  `performance-mobile.spec.ts`).
- **Tests.** `performance-mobile`, `services-experience` and `release-qa` updated
  from the site-wide contract to the hero-scoped one. Full suite: 243 passed.

---

## 2026-09-05 — Scene rebuild + single demo progress bar

Homepage review follow-up. Two defects fixed, nothing else in scope.

- **Background scene.** Removed the `TorusKnotGeometry` core and its three orbit
  rings from `lib/scene/engine.ts`. The per-chapter connected interface panels are
  now the only form, with new `advisory` and `developer` layouts so those routes no
  longer fall back to `intro`. `ScenePreset` gained `offsetX` / `offsetY` (places the
  composition off each chapter's copy column) and `wireOpacity` (sparse chapters
  carry it, dense service chapters recede to a texture). Phones get a lower-outside
  placement at 0.78 scale / 45% opacity, since there is no empty column at 390px.
  Wireframe secondaries brightened now that nothing sits in front of them.
  Net effect: no body copy renders over scene geometry on any homepage section.
- **Service demo progress.** `ServiceDemo` had two progress indicators stacked on
  adjacent pixel rows — a 3px full-bleed cycle track above a 4-segment step bar,
  each at a different fill position, reading as one broken bar. Merged into one:
  each of the four segments now fills across its own stage (2.4s × 3, then 3.2s),
  so the cycle timing and the step position come from a single element.
- Verified: lint clean, `npm run build` passes, 19/19 routes prerender, full
  Playwright suite green against the production build except two pre-existing
  order-dependent flakes (`home-experience` playback, `performance-mobile` long
  task) which pass in isolation and were confirmed to fail on unmodified code too.

---

## 2026-08-31 — Immersive homepage refinement pass (depth, motion, pacing)

Closed the gap between the built immersive homepage and the approved editions
reference, which had drifted flat/conventional. Additive refinement only — every
route, real case study, proof-demo, form, SEO and reduced-motion behaviour
preserved.

- **Smooth scroll (one driver):** added Lenis (`SmoothScroll.tsx`, duration 1.05)
  advanced from GSAP's single ticker; Lenis scroll drives `ScrollTrigger.update`
  and feeds the WebGL atmosphere's drift via `engine.setScrollProgress`. Guarded
  by reduced-motion (live `change` listener), native anchors, and native touch
  (`syncTouch:false`). `feedScene` gate keeps the renderer off content-only routes.
- **Proof objects as light heroes:** `ProofFrame` gained a `surface="light"`
  variant that remaps interior tokens (via `color-mix` on palette tokens) to an
  off-white product surface with a hard floating shadow — flips all four
  interactive demos with no per-demo CSS rewrite. Proof stage widened with
  perspective + `translateZ` depth.
- **Floating artifacts:** 15 tailored reference SVGs added to `public/artifacts`;
  new `ChapterArtifacts` places 3–5 parallaxing fragments around each chapter
  proof (`[data-chapter-artifact]` scrub, desktop-only — hidden and untriggered
  below 1081px).
- **Scene presence:** stronger point opacity/atmosphere, wider scroll drift,
  more distinct per-chapter accents; still NormalBlending (no glow), DPR cap,
  static reduced-motion frame.
- **Hero:** 3D orbit (perspective + per-chip Z depth) and a fifth light "panel"
  fragment introducing the light-surface language above the fold.
- **New Developer/Build chapter** (`BUILD_CHAPTER` + `BuildProof` using
  `dev-hero.svg`): a fifth, service-linkless engineering-credibility beat before
  Selected Work that closes the scene arc on developer blue. Added to `ChapterNav`.
- **Selected Work transition:** honest "illustrative → real, shipped" bridge
  marker, enlarged AASKRA/ETF covers (3:2) and outcome stats; scene continuous.
- **Pacing:** sculpted sparse → spectacular proof → dense matrix rhythm within
  each chapter.
- Updated `home-experience` assertions for the fifth chapter (5 proofs, 6 nav
  links). Chromium suite: 235 active tests green, 26 opt-in captures skipped;
  lint + build clean. Homepage reviewed at 1440px and 390px and under reduced
  motion.

## 2026-08-31 — Full release QA pass

Completed Prompt 13 across routes, navigation, forms, metadata, accessibility,
WebGL fallback/lifecycle, responsive layouts, analytics, and browser history.

- Added release-contract coverage for every rendered internal link, shared
  header/footer/contact/legal destinations, browser back/forward behavior,
  mobile menu focus trapping, visible skip-link focus, and a forced WebGL-
  unavailable fallback.
- Fixed the only application regression found: the globally fixed WhatsApp link
  preceded page content in DOM order and intercepted the first Tab. It now
  renders after page content while retaining the same fixed visual position.
- Chromium full suite: 235 active tests pass, with 26 opt-in screenshot captures
  skipped. Firefox critical suite: 23/23. WebKit: 22/23 critical checks (the
  remaining link-Tab assertion depends on the macOS full-keyboard-access
  preference) plus 39/39 route/overflow checks at 390, 834, and 1440px.
- Still owner/environment gated: real Resend delivery, Plausible live ingestion,
  and physical Safari/iOS/Android device sign-off.

---

## 2026-08-31 — Performance and mobile hardening

Completed Prompt 12 with measured bundle/runtime changes rather than reducing
the visual identity.

- Deferred the persistent Three.js scene behind a client-only loader. Meaningful
  DOM and the CSS atmosphere render first; Privacy, Terms, and 404 never mount
  or transfer the WebGL scene. On the production build this saves 127KB of
  transferred JavaScript on content-only routes (226KB vs 353KB scene-enabled).
- Made the scene budget responsive at startup and after viewport changes:
  mobile/coarse-pointer rendering uses DPR 1, a 700-point draw limit, lower wire
  geometry, 30fps, and no pointer parallax; desktop caps DPR at 1.5 with 1800
  points and 60fps. Reduced motion still renders one static frame with no RAF.
- Retired the unused Anton font from the root loader and updated the error
  boundary to Manrope, reducing generated font output from 276KB/18 files to
  232KB/15 files.
- Audited all real images: WebP sources have explicit intrinsic dimensions or
  aspect-ratio containers, above-fold work images are prioritized, and below-
  fold/case-study imagery remains lazy through `next/image`.
- Production measurements at 390px: CLS 0; local LCP 40–76ms; worst observed
  long task 80ms. Route-cycle tests retain one canvas and keep post-GC heap
  growth below the regression budget.
- Verification: performance/mobile E2E 6/6; full E2E 230 active tests green with
  26 baseline captures intentionally skipped; production build and ESLint clean.

---

## 2026-08-31 — Complete SEO, forms, and analytics parity

Completed Prompt 11 without changing routes, the contact backend, or the
analytics provider.

- Audited every public title, description, canonical, OG/Twitter image, heading,
  sitemap entry, robots rule, internal destination, and existing JSON-LD block.
  Added route-specific social metadata to Privacy and Terms; no unsupported
  structured-data claims or pricing schema were introduced.
- Preserved Plausible as the only analytics platform. Added one delegated,
  privacy-safe event layer for `cta_start_project`, `cta_whatsapp`,
  `contact_form_start`, `contact_form_submit`, `contact_form_success`,
  `work_open`, `service_open`, and `concept_open`. Properties contain only the
  current path and non-personal content slugs—never form contents.
- Verified Contact validation, invalid-field focus, value retention, honest
  Resend failure messaging, success rendering/event behavior, honeypot handling,
  and in-flight duplicate-submit prevention. Real email delivery remains gated
  by the owner-controlled `RESEND_API_KEY`.
- Updated Privacy copy so it accurately describes selected anonymous interaction
  events and explicitly states that enquiry contents are never sent to analytics.
- Verification: ESLint clean; 15/15 unit tests; production build passes with all
  19 routes; full E2E 224 active tests green with 26 baseline-capture tests
  intentionally skipped; `git diff --check` clean.

---

## 2026-08-31 — Migrate About, Contact, legal, and 404 routes

Completed Prompt 10 and moved the remaining public Next.js routes onto the
immersive design system without changing their operational contracts.

- Rebuilt `/about` around the approved content source and studio positioning:
  direct ownership, clarity, momentum, small-studio speed, and no account-
  management relay. The route remains qualitative and contains no founder or
  freelancer biography.
- Restyled `/contact` with the new dark form system and shared header/footer.
  The Resend Server Action, server validation, environment variables, delivery
  destinations, honeypot, and success/error behavior are unchanged.
- Reskinned `/privacy`, `/terms`, and the semantic 404 with simple readable
  typography. Added an explicit scene opt-out so these content-first routes use
  no WebGL canvas while retaining the CSS atmosphere and shared chrome.
- Compacted the fixed WhatsApp control below 480px so it obscures less content
  while preserving its destination, accessible name, and 44px touch target.
- Verification: ESLint clean; 15/15 unit tests; production build passes with all
  19 routes; Prompt 10 E2E 14/14; full E2E 219 active tests green with 26
  baseline-capture tests intentionally skipped; desktop/mobile visual QA.

---

## 2026-08-30 — Complete homepage choreography and repair redesign handoff gaps

Completed the previously skipped Prompt 07 without changing the established
architecture: the immersive homepage remains server-rendered/static-first and
adds two small client boundaries for progressive motion and chapter navigation.

- Added grouped GSAP reveals, subtle proof-object scroll depth and fine-pointer
  tilt, restrained hero-artifact depth, and the existing chapter scene changes.
  Reduced motion bypasses all enhanced motion; meaningful content stays visible
  with JavaScript disabled.
- Added a compact native-anchor chapter rail with scroll-synchronized active
  state. On phones it remains swipeable and sits beside—never under—the existing
  fixed WhatsApp control; geometry and viewport bounds are regression-tested.
- Fixed non-home immersive routes resetting their WebGL renderer to `intro`:
  `ImmersiveShell` now initializes the singleton from its route scene, and the
  canvas publishes its resolved scene for regression coverage.
- Restored `.env.example` with the real Resend/Plausible variables and optional
  contact overrides; no secrets were added.
- Corrected the handoff task board and technical decisions to reflect completed
  Prompts 07–09 and the actual vanilla Three.js singleton architecture.
- Stabilized the resource-heavy TerraElix preview assertion under full-suite
  load. Switched Playwright's default from system Chrome to its pinned bundled
  Chromium, avoiding a macOS Chrome teardown bug that left workers alive after
  all tests completed.
- Verification: ESLint clean; 15/15 unit tests; production build passes with all
  19 routes; responsive desktop/mobile visual QA; focused E2E 31/31; full E2E
  231 active tests green with 26 baseline-capture tests intentionally skipped.

---

## 2026-08-30 — Migrate the services routes to the immersive system

Rebuilt `/services`, `/services/web`, `/services/software`, and `/services/ai`
on the immersive `.tw-world` system (`ImmersiveShell` + `SiteHeader`/`SiteFooter`
+ shared primitives). URLs unchanged; `src/data/services.ts` remains the factual
source (copy preserved).

- `/services`: reframed as a **diagnosis tool, not a second homepage** — hero →
  `ProblemNavigator` (the core friction-to-discipline tool, kept keyboard-
  operable with its testids) → compact three-service directory (`#service-{id}`
  anchors) → delivery spine → CTA.
- `/services/{web,software,ai}`: 9-section immersive detail — hero, business
  friction, transformation, **interactive proof object**, capabilities, delivery
  model, real related work, FAQ, CTA. Each service leads with its own scene
  accent (web=acid, software=orange, ai=violet).
- Proof objects reused from the homepage set: web → `WebsiteProof`, software →
  `OperationsConsoleDemo` (until a real custom-software case exists), ai →
  `AutomationFlowDemo`. Web links strongly to both real case studies; software/
  ai use an honest "our published work is web" fallback (no fabricated cases).
- AI page makes the control model explicit next to the flow: deterministic rules
  first, bounded AI judgment, human review, tool integrations, traceability.
- `FAQSection` and `PrimaryCTA` restyled for the dark world; `PrimaryCTA` pills
  now meet the 44px tap target (WCAG 2.5.5). Retired `ServiceMotion` and
  `ServiceMotif` (static-first). Updated `services-experience.spec.ts` and the
  `/services` assertion in `launch-accessibility.spec.ts`.
- Verification: lint clean, `next build` passes (19 routes), 13/13 unit; e2e —
  services (13) + launch + work + home specs green; full suite run.
- Also realigned `home-experience.spec.ts`, which still asserted the retired
  Kinetic homepage (marquee header, old h1, `data-home-*` service loops) and had
  been failing since the homepage was migrated to the immersive system. Rewrote
  it against the immersive home (hero, four proof chapters, real selected work,
  operating model, contact CTAs; reduced-motion + no-JS + responsive).

---

## 2026-08-30 — Migrate proof-heavy routes to the immersive system

Rebuilt `/work`, `/work/aaskra-realty`, and `/work/express-trade-financing` on
the immersive `.tw-world` design system (`ImmersiveShell` + `SiteHeader`/
`SiteFooter` + shared primitives), matching the migrated homepage. Content is
unchanged — all facts, scope, timelines, stacks, and real screenshots
(`/work/*.webp`) are preserved from `src/data/case-studies.ts`.

- `/work`: leads with two visually dominant real client case studies (each with
  its own signal accent), delivery totals derived from real data, then a clearly
  separated, labelled **Concept Lab** (self-initiated) with the three live HTML
  previews retained; how-we-work + CTA close the page.
- `/work/[slug]`: cinematic evidence page — hero, project facts, problem +
  constraints, key decisions, delivered scope + full-page build imagery, result,
  stack, next case study, project CTA. Per-case accent: AASKRA → apps/orange,
  Express → build/blue (scene glow matches).
- New: `FeaturedWork.tsx`, `case-accent.ts`; retired `WorkGrid.tsx`,
  `WorkMotion.tsx` (static-first, no GSAP on these routes). `ConceptLab.tsx` and
  `LiveConceptPreview.tsx` kept; restyled for the dark world.
- Tests: rewrote `work-page.spec.ts` and `case-study-editorial.spec.ts` for the
  new structure (kept all factual/behavioral contracts — concept previews,
  live-site rules, scroller region, next link); patched the `/work` portion of
  `launch-accessibility.spec.ts`.
- Verification: lint clean, `next build` passes (19 routes), 13/13 unit; e2e —
  work-page + case-study + launch-{accessibility,performance,smoke} + responsive
  (117 no-overflow) all green.

---

## 2026-08-04 — Pre-deploy final check + Vercel runbook

- Ran full verification: lint clean, `next build` passes (19 Static/SSG routes),
  13/13 unit tests, 229 e2e passed. One transient dev-server 500 on `/` under
  parallel load proved non-reproducible (`launch-smoke --workers=1` = 14/14) and
  cannot occur in production (static prerender).
- **New:** `docs/vercel-deployment-2026-08-04.md` — deploy runbook + owner-controlled
  pending items (env vars, domain, push, optional Node pin).
- No code changes; site is code-ready to deploy for a client preview.

---

## 2026-07-26 — Launch-readiness hardening

- **UI and accessibility:** removed the redundant contact-page WhatsApp float,
  corrected Services/Work contrast, made the 404 heading semantic, preserved
  visible Work-link names, added route-heading focus, and exposed the case-study
  screenshot scroller to keyboard users.
- **Performance and metadata:** rendered critical route content immediately,
  prioritized route LCP images, and completed Open Graph/Twitter metadata across
  all public pages. Sequential mobile Lighthouse now scores 91–95 performance
  and 100 accessibility/best-practices/SEO on all 12 routes.
- **Contact reliability:** added server-side validation and limits, honeypot
  suppression, honest Resend failures, invalid-field focus, inline errors, and
  full value preservation after validation or delivery errors.
- **Link safety:** removed the non-resolving AASKRA live-site action while
  retaining the internal case study; verified the Express and WhatsApp targets.
- **Verification:** added deterministic unit/lint scripts plus launch smoke,
  accessibility, metadata/performance, contact, and live-domain regressions.
  The complete responsive matrix covers 12 routes plus 404 at nine widths.
- **Deployment:** code is a release candidate, but no Vercel preview or
  production deployment exists because authentication and owner-controlled
  integration gates are still missing.
- **Report:** see
  [`docs/launch-readiness-report-2026-07-26.md`](launch-readiness-report-2026-07-26.md).

## 2026-07-18 — Site-wide mobile/tablet responsiveness overhaul

Full audit + phased fix per `docs/responsive-audit-plan.md`. Desktop is pixel-identical throughout (verified by 1280/1440 full-page screenshot diffs against a pre-change baseline on all 13 routes).

- **P0 overflow (root-caused, not masked):** breakable-email pattern (`<wbr>` + `overflow-wrap`, copied from Footer) applied to CTASection, contact sidebar, and privacy/terms body links; `/work` 768–1023px band re-rowed (image → identity → proof chips → story — desktop's intentional collage overlap untouched at ≥1024); About culture headings floor `clamp(64px→40px, 11vw, 160px)` (identical ≥582px, fixes "OWNERSHIP" on ≤364px phones).
- **P1 touch:** nav burger hit area 36→44px (padding + negative margin — icon and nav height unchanged, X-geometry preserved); WhatsApp float `min-height: 44px` under `pointer: coarse` + safe-area-inset bottom ≤880; footer links ~25px tap boxes (WCAG 2.2 AA, Adi-approved density trade-off) in the ≤880 block; `useAccordion` now re-measures the open panel via ResizeObserver + resize listener (fixes clipped FAQ content after device rotation on `/services/*`).
- **P2 tablet bands:** Hero `min-height: 100svh` fallback chain (fixes 601–880 browser-chrome band); Hero CTA column-switch raised 339→429px and forced `nowrap` removed; case-study `.statsGrid` → 1-col at ≤880 (matches CTASection's seam on the same page); services modules converged 760→768px (incl. the `sizes` hint); `.wrap` gutter `clamp(16px, 4vw, 24px)` (exactly 24px ≥600px); explicit `viewport` export in `layout.tsx`. About's 769/768 min/max pair reviewed — complementary, kept.
- **P3 guardrails & hygiene:** `overflow-x: clip` on `html` + fallback chain on `body` (sticky-safe; `scrollWidth` still reports overflow so tests stay honest); deleted six dead component folders (Manifesto, ServicesSection, ProcessSection, ShoutSection, CaseStudySection, RobotVideo — imported nowhere; home renders Hero + HomeExperience); consolidated byte-identical privacy/terms CSS into shared `src/app/legal.module.css`; responsive conventions + canonical breakpoints (480/768/880/1024) documented in `AGENTS.md` and `globals.css`.
- **Regression harness:** `tests/e2e/responsive.spec.ts` — 117 horizontal-overflow assertions (13 routes × 9 widths, 320→1440, reduced-motion, full-page scroll); `tests/e2e/desktop-baseline.spec.ts` (CAPTURE_BASELINE=1) for desktop screenshot locks; `playwright.config.ts` accepts `PW_BASE_URL` to reuse a running dev server (Next 16 single-instance lock).
- **Verification:** ESLint 0 errors; production build passes; 175 Playwright tests pass (117 new + 58 pre-existing); desktop diff clean; Lighthouse a11y (mobile): home 100, /services/web 100, /work 96 — the /work 96 is **pre-existing** (color-contrast on heroTitle span + label-content-name-mismatch on project action links, unrelated to this work, flagged for follow-up); tap-target audit passes on all three.
- **Left for Adi:** delete or keep orphaned `public/robot-scrub.mp4` + `robot-poster.webp` (RobotVideo component removed); the two pre-existing /work a11y findings above.

## 2026-07-17 — About Complexity to Clarity

- Replaced the legacy profile-style About page with a centered four-scene business narrative.
- Added problem-to-outcome expertise paths and the Ownership / Clarity / Momentum culture sequence.
- Added one progressive GSAP convergence showpiece with reduced-motion and no-JavaScript fallbacks.
- Kept all trust claims qualitative and removed founder, individual, team-size, and invented-proof language.

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

Status as of 2026-08-04. Done items removed; remaining are owner-controlled.
Full deploy runbook: `docs/vercel-deployment-2026-08-04.md`.

| Item | Blocked on |
|------|-----------|
| `RESEND_API_KEY` in Vercel env | Contact form delivery (code done; degrades gracefully if unset) |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` in Vercel env | Analytics activation (script gated; only loads when set) |
| Booking link → real Cal.com/Calendly URL | URL from Adi (`TODO(Adi)` in `src/lib/site.ts`; WhatsApp fallback live) |
| `priceRange` in JSON-LD | Confirmed public-facing "starting from" figure |
| Custom domain `techwiseiq.com` | DNS + Vercel domain config (needed for public launch, not client preview) |

Completed since the last table: contact form server action, OG image
(`/opengraph-image`), favicon (`/icon`, `/apple-icon` via ImageResponse),
analytics env-gating, and About page content.
