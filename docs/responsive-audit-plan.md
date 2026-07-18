# TechwiseIQ — Mobile & Tablet Responsiveness Audit + Fix Plan

**Date:** 2026-07-18
**Status:** ✅ Implemented 2026-07-18 — all four phases complete, gates passed (see website/docs/changelog.md)
**Scope:** Every live page and shared component of `website/` (Next.js 16.2.9, CSS Modules + Tailwind v4 tokens, GSAP)
**Prime directive:** Desktop stays pixel-identical. Every fix is either scoped inside a `max-width` / `pointer: coarse` media query desktop never matches, or additive and provably inert at desktop widths.

---

## 1. Executive summary

The site is in better responsive shape than a first glance suggests — `/work` and `/about` have the most thorough coverage in the repo, the contact form is iOS-zoom-safe, and all `next/image` usage is correct. But the audit found:

1. **Real horizontal overflow on phones, currently hidden — not fixed — by `body { overflow-x: hidden }`.** The 30-character email `Info@techwiseiqtechnologies.ae` overflows its container in three places (CTASection, privacy/terms, contact sidebar). The Footer already solves this correctly with `<wbr>` + `overflow-wrap` — the pattern just wasn't propagated.
2. **A broken tablet band on `/work` (768–1023px):** the 12-column collage grid keeps the project title overlapping what is by then a collapsed image.
3. **Touch targets below minimums:** nav burger 36×36, WhatsApp float ~42px, footer links ~15px tall.
4. **A live JS bug:** the FAQ accordion on all three `/services/*` pages measures its open height once and never re-measures — rotating the device clips content.
5. **Six dead component folders** (Manifesto, ServicesSection, ProcessSection, ShoutSection, CaseStudySection, RobotVideo) — the live home page renders `Hero + HomeExperience`, not these. *(Decision made: delete them.)*
6. **Breakpoint fragmentation:** mobile cutovers at 540 / 600 / 760 / 767 / 768 / 880 / 980 / 1023 / 1180 depending on the file, creating seams where one component on a page is in mobile layout while its neighbour is still desktop.

The fix plan is four phases: **P0 overflow → P1 touch targets → P2 tablet bands & consistency → P3 guardrails + regression tests**, each gated by `npm run lint`, `npm run build`, and a desktop screenshot diff against a baseline captured before any change.

**Decisions already confirmed by Adi (2026-07-18):**
- Dead components: **delete** (separate cleanup commit; recoverable via git).
- Dense footer link lists: **WCAG 2.2 AA (24px+)** tap targets, preserving the mono-link density. Primary controls (burger, buttons, WhatsApp) get full 44px.

---

## 2. What is already done well (no changes)

| Area | Evidence |
|---|---|
| Contact form inputs | `font-size: 16px` (`contact.module.css:77`) — no iOS auto-zoom; ~48px tall inputs; labels stack correctly |
| `/work` hover gating | All hover transforms behind `@media (hover: hover) and (pointer: fine)` (`work.module.css:1050`) — the repo's best pattern |
| Footer email | `Info@<wbr>techwise…` (`Footer/index.tsx:47`) + `overflow-wrap: break-word` (`Footer.module.css:77`) — the canonical breakable-email pattern |
| `next/image` | Every usage supplies `sizes` and `fill`/aspect-ratio (WorkGrid, ConceptLab, ServiceDetailPage, case-study cover) |
| HomeExperience | 980/767/390 breakpoints + reduced-motion; `gsap.matchMedia` swaps process-line animation per breakpoint; no scroll pinning anywhere |
| AboutExperience | Fluid gutter `clamp(20px, 4vw, 48px)`, `svh` units, granular small-screen handling down to 340px |
| Reduced motion | Global kill-switch in `globals.css:94-106` plus local blocks in most components; JS early-returns in animation hooks |
| 404 page | Pure clamp-based inline styles; wraps safely at 320px |

---

## 3. Findings — page by page

Priorities: **P0** = visible breakage on phones · **P1** = touch/usability failures · **P2** = tablet dead zones & inconsistency · **P3** = hygiene/guardrails.

### 3.1 Global shell (`globals.css`, `layout.tsx`)

| # | Priority | Finding | Location |
|---|---|---|---|
| G1 | P3 | `body { overflow-x: hidden }` is the single mask hiding every overflow bug below; also `hidden` on body can break `position: sticky` in edge cases (`clip` is safer) | `globals.css:58` |
| G2 | P2 | `.wrap` gutter fixed at 24px down to 320px — cramped on small phones | `globals.css:66-70` |
| G3 | P2 | No explicit `viewport` export (Next's default is correct; add for auditability) | `layout.tsx` |

### 3.2 Nav

| # | Priority | Finding | Location |
|---|---|---|---|
| N1 | P1 | Burger button 36×36px — below the 44px minimum | `Nav.module.css:111-112` |
| — | ✅ | Full hamburger overlay exists at ≤880 with focus trap, Escape, scroll lock; overlay links are `clamp(42px,10vw,72px)` with 18px padding — excellent | `Nav/index.tsx:112-154` |

### 3.3 Hero (home)

| # | Priority | Finding | Location |
|---|---|---|---|
| H1 | P2 | `min-height: 100vh` at base; `100svh` only ≤600 — mobile-browser-chrome height bug persists in the 601–880 band | `Hero.module.css:2,157` |
| H2 | P2 | `.ctas` forced `flex-wrap: nowrap` at ≤600; column layout only ≤339 — two buttons cramped in the 340–600 band | `Hero.module.css:198,215-229` |
| H3 | P2 | StickerBadge (`white-space: nowrap`, rotate 7°) absolutely positioned near the right edge — cosmetic clip risk ≤360px (contained by `overflow: hidden`, not an overflow cause) | `Hero.module.css:12-16`, `StickerBadge.module.css:14` |
| — | ✅ | Kinetic rows `clamp(64px,12.5vw,176px)` are correctly clipped by Marquee wrappers; velocity skew is scroll-based (touch-compatible) and reduced-motion-safe | |

### 3.4 Home content (`HomeExperience`)

Well covered (980/767/390 + reduced-motion, matchMedia-swapped animations). **No changes.**

### 3.5 `/services` overview + detail pages

| # | Priority | Finding | Location |
|---|---|---|---|
| S1 | P2 | Mobile cutover at **760px** (vs 767/768 elsewhere) — desktop layout shown on iPad-Mini-portrait-class widths 761–768 | `ServicesOverview.module.css:619`, `ServiceDetailPage.module.css:546`, `ServiceMotion.module.css:32` |
| S2 | P1 | **Live bug:** FAQ accordion (`useAccordion`) sets `maxHeight = scrollHeight` once at open and never re-measures — rotate the device with a row open and reflowed content is clipped. Ships on `/services/web`, `/services/software`, `/services/ai` via `FAQSection` | `hooks/useAccordion.ts:38-39`, `ServiceDetailPage/index.tsx:180` |
| — | ✅ | All grids collapse at the breakpoint; clamp() headings; decorative ghost text properly clipped by `overflow: hidden` | |

### 3.6 `/work` overview

| # | Priority | Finding | Location |
|---|---|---|---|
| W1 | **P0** | Tablet band 768–1023: `.projectStage` keeps the 12-col grid with `.projectVisual` (cols 1–9) and `.projectIdentity` (cols 7–13) on the **same grid row** — the title sits on top of a collapsed `aspect-ratio: 16/10` image. The overlap is intentional collage design at ≥1024 (z-index 4, hard text-shadow); it degrades, not survives, at tablet | `work.module.css:1116-1152` |
| W2 | P0/P3 | `.projectExperience` full-bleed via `width: 100vw; margin-left: calc(50% - 50vw)` never reset — overflows by scrollbar width on classic-scrollbar systems. Keep the hack; fix class-wide with the P3 `overflow-x: clip` guardrail | `work.module.css:182-184` |
| — | ✅ | Everything else here is the repo's reference implementation (hover gating, `sizes`, metric grids collapsing, 46px CTA min-heights) | |

### 3.7 `/work/[slug]` case study + CTASection

| # | Priority | Finding | Location |
|---|---|---|---|
| C1 | **P0** | CTASection `.channelValue` renders `Info@techwiseiqtechnologies.ae` (13px mono, no wrap allowance) inside a `min-width: 200px` card — at ≤~360px the string overflows the card and is silently clipped | `CTASection/index.tsx:28`, `CTASection.module.css:79-86,51` |
| C2 | P2 | Single 600px breakpoint on the case-study page — `.statsGrid` stays 3-col at 601–880 with Anton `clamp(40px,5.5vw,84px)` values like "USD 200M+" crowding third-width cells | `case-study.module.css:183-187,252` |
| — | ✅ | `.snapGrid` uses `auto-fit, minmax(180px,1fr)` (self-wrapping); `.fullFrame` scroll region works; cover image correct | |

### 3.8 `/about`

| # | Priority | Finding | Location |
|---|---|---|---|
| A1 | **P0** | `.culturePanel h3` `clamp(64px, 11vw, 160px)` — the 64px floor pins on phones; single unbreakable words ("OWNERSHIP") overflow ≤~364px viewports | `AboutExperience.module.css:265` |
| A2 | P2 | Mixed 769px/768px min/max seam in the same file — merge to 768 | `AboutExperience.module.css:364,396` |
| — | ✅ | Otherwise the most granular responsive file in the repo (fragment hiding at 340, svh units, landscape-height queries) | |

### 3.9 `/contact`

| # | Priority | Finding | Location |
|---|---|---|---|
| K1 | **P0** | Sidebar email at 12px mono, no break hint — tight/overflow ≤~300px (Galaxy Fold class) | `contact/page.tsx:53-58`, `contact.module.css:182-190` |
| — | ✅ | Grid collapses at 880; form is exemplary (16px inputs, ~48px tall, single `role="alert"` error block) | |

### 3.10 `/privacy` + `/terms`

| # | Priority | Finding | Location |
|---|---|---|---|
| L1 | **P0** | Zero `@media` rules in either module; inline email links have no `overflow-wrap` — overflow ≤~340px | `privacy.module.css:42`, `terms.module.css:42` |
| L2 | P3 | The two CSS modules are byte-identical — consolidate | both files |

### 3.11 Footer

| # | Priority | Finding | Location |
|---|---|---|---|
| F1 | P1 | Links ~15px-tall tap targets with 10px gaps on mobile | `Footer.module.css:77` + gap rules |
| — | ✅ | Grid collapses 4→2→1 at 880/540; email break pattern is the site's reference | |

### 3.12 WhatsAppButton (site-wide)

| # | Priority | Finding | Location |
|---|---|---|---|
| WA1 | P1 | ~42px tall (12px font + 12px×2 padding + borders) — under 44px; no safe-area inset; fixed position identical at all widths; can sit over bottom-of-page content | `WhatsAppButton.module.css:2-21` |

### 3.13 Dead code (decision: delete)

Imported by no page: `Manifesto/`, `ServicesSection/`, `ProcessSection/`, `ShoutSection/`, `CaseStudySection/`, `RobotVideo/`. `FluidParticles` (referenced in project docs) does not exist in the repo. `useAccordion.ts` is **live** (FAQSection) and stays. Imports will be re-grepped at delete time.

### 3.14 Audit corrections (found during plan validation)

- `Button.module.css` `.btn` intrinsic height is **~49px** (13px line-height-1 font + 15px×2 padding + 3px×2 border, border-box), not the ~43px first reported — already compliant; only optional hardening planned.
- The `useAccordion` bug was initially filed as dead-code-only; it is **live** via FAQSection (promoted to P1).
- The `/work` overlap is a design feature degrading at tablet, not a wrong design — the fix re-rows the existing ≤1023 block and leaves desktop untouched.

---

## 4. Breakpoint strategy

**Canonical scale for all new/edited media queries** (documented in `globals.css` header + `AGENTS.md`):

| Token | Value | Meaning |
|---|---|---|
| small phone | `max-width: 480px` | spacing/stacking tweaks for ≤480 |
| phone → tablet | `max-width: 768px` | primary content-module cutover |
| shell | `max-width: 880px` | Nav burger, Footer 2-col, CTA/contact splits (existing standard — retained) |
| tablet → desktop | `max-width: 1024px` | wide-layout cutover |

**Migration rule: converge, don't rewrite.** Working files keep their breakpoints; only files with actual defects change:

| File | Current | Action |
|---|---|---|
| Nav, Footer, CTASection, contact | 880 (+540/600) | Keep |
| work.module.css | 1180/1023/767 + hover gating | Keep (already aligned with 768/1024) |
| HomeExperience | 980/767/390 | Keep |
| AboutExperience | 980/769/768/340 | Keep; merge 769/768 seam → 768 |
| ServicesOverview / ServiceDetailPage / ServiceMotion | **760** | **→ 768** (only the 761–768 band changes) |
| case-study.module.css | 600 | Keep 600; **add 880** tablet block |
| Hero | 600/339 | Keep 600; **339 → 429** for CTA column switch |
| Footer 540 | 540 | Keep (working; churn > value) |

**No `@custom-media` tooling** — it would add a PostCSS plugin to a build that currently runs only Tailwind's. Convention + docs, zero build risk.

---

## 5. Reusable patterns

| Pattern | Definition | Where it lives | Used by |
|---|---|---|---|
| **Breakable email** | `Info@<wbr>techwise…` in JSX + `overflow-wrap: break-word` on the container | Pattern source: `Footer/index.tsx:47` + `Footer.module.css:76-77`; utility `.u-breakable` added to `globals.css` | CTASection, contact sidebar, privacy/terms |
| **Tap target** | `@media (pointer: coarse) { min-height: 44px }` on primary controls; ≥24px + spacing (AA) for dense text lists | Per-component, documented in `AGENTS.md` | Burger, WhatsApp, Button, footer links |
| **Hover gating** | Hover-revealed content only inside `@media (hover: hover) and (pointer: fine)` | Pattern source: `work.module.css:1050`; documented in `AGENTS.md` | Mandatory for future work |
| **Viewport-unit fallback** | `min-height: 100vh; min-height: 100svh;` double declaration | Inline where needed | Hero |
| **Overflow guardrail** | `overflow-x: hidden; overflow-x: clip;` on body + `html { overflow-x: clip }` | `globals.css` | Site-wide |

---

## 6. Implementation phases

### Phase 0 — Foundations (Effort: S)
1. Canonical-breakpoint comment block in `globals.css` header; pattern documentation in `website/AGENTS.md`.
2. `.u-breakable { overflow-wrap: break-word; }` utility in `globals.css`.

*Desktop impact: none (comments + inert utility).*

### Phase 1 — P0: overflow on phones (Effort: S–M)
| Fix | File(s) | Change |
|---|---|---|
| C1 email | `CTASection/index.tsx`, `.module.css` | `<wbr>` after `Info@`; `overflow-wrap: break-word` on `.channelValue`. Keep `min-width: 200px` (not the cause) |
| L1 privacy/terms | both modules | `overflow-wrap: break-word` on `.section a`; add one `@media (max-width: 480px)` spacing block each (`.main` 72px padding, tightened section spacing) |
| W1 work tablet | `work.module.css` (inside existing ≤1023 block) | `.projectStage { grid-template-rows: auto auto auto }`; identity → row 2, proof cloud → row 3; keep alternating text alignment |
| A1 about headings | `AboutExperience.module.css:265` | `clamp(64px,11vw,160px)` → `clamp(40px,11vw,160px)` — mathematically identical at every viewport ≥582px |
| K1 contact email | `contact/page.tsx`, `contact.module.css` | `<wbr>` + `overflow-wrap` on `.methodDetail` |

*Desktop impact: zero — every change is `<wbr>`/`overflow-wrap` (inert when text fits) or inside existing mobile/tablet blocks. Only intended visual change: `/work` at 768–1023.*

### Phase 2 — P1: touch targets & touch UX (Effort: M)
| Fix | File(s) | Change |
|---|---|---|
| N1 burger | `Nav.module.css` | 44×44 hit area, icon lines stay 36px; verify open-state "X" transform geometry, pad outer box if offsets are hardcoded |
| WA1 WhatsApp | `WhatsAppButton.module.css` | `@media (pointer: coarse) { min-height: 44px }`; ≤880: `right: 16px; bottom: calc(20px + env(safe-area-inset-bottom))`; verify bottom-of-page collisions, add mobile-only footer clearance if confirmed |
| F1 footer links | `Footer.module.css` (≤880 block) | `.col a { padding-block: 7px; margin-block: -2px }` → ~29px hit height, density preserved (AA per decision) |
| Button hardening | `ui/Button.module.css` | Optional `pointer: coarse` min-height (intrinsic already ~49px); drop if inline-flex shifts any baseline |
| S2 accordion | `hooks/useAccordion.ts` | ResizeObserver on the open panel re-assigns `maxHeight` from `scrollHeight` while open (~15 lines, no API change). Note: the max-height transition itself is a grandfathered layout-property animation; replacing it = vocabulary change = separate sign-off, out of scope |

*Desktop impact: zero — all under `pointer: coarse` / ≤880 / invisible-at-desktop elements.*

### Phase 3 — P2: tablet dead zones & consistency (Effort: M–L)
| Fix | File(s) | Change |
|---|---|---|
| H1 svh | `Hero.module.css:2` | `min-height: 100vh; min-height: 100svh;` fallback chain |
| H2 CTA band | `Hero.module.css` | Column switch 339 → 429 (verify fit at 430, raise to 479 if needed); drop ≤600 `flex-wrap: nowrap` |
| C2 stats | `case-study.module.css` | New `@media (max-width: 880px)` block: `.statsGrid` → 1-col with `--bd` separators; dedupe from the 600 block; sweep `.snapGrid`/`.deliverablesList` in the 601–880 band |
| S1 seam | Services modules | 760 → 768 across the three files |
| A2 seam | `AboutExperience.module.css` | 769/768 → 768 |
| H3 sticker | Hero/StickerBadge | Verify at 320/360; nudge `right` in ≤600 block / shrink padding ≤379 only if clipped |
| G2 gutter | `globals.css` | `.wrap { padding: 0 clamp(16px, 4vw, 24px) }` — resolves to exactly 24px at every viewport ≥600px |
| G3 viewport | `layout.tsx` | Explicit `export const viewport: Viewport = { width: 'device-width', initialScale: 1 }` |

*Desktop impact: zero — clamp maths and vh/svh equivalence proven above; everything else ≤880-scoped.*

### Phase 4 — P3: guardrails & hygiene (Effort: S–M)
1. **Overflow guardrail** (`globals.css:58`): `overflow-x: hidden; overflow-x: clip;` on body + `html { overflow-x: clip }`. `clip` doesn't create a scroll container (safer for sticky descendants) and still lets `scrollWidth` report overflow — so the regression test below stays meaningful.
2. **Delete dead code** (approved): the six folders in §3.13, after a fresh import grep. Separate `chore:` commit. Keep `useAccordion.ts`.
3. **Consolidate** the byte-identical privacy/terms CSS modules into one shared module.
4. **Document patterns** (§5) in `AGENTS.md`.
5. **Regression test** — new `tests/e2e/responsive.spec.ts` (Playwright already configured; `npm run test:e2e`):
   - Routes: `/`, `/services`, `/services/web`, `/services/software`, `/services/ai`, `/work`, `/work/aaskra-realty`, `/about`, `/contact`, `/privacy`, `/terms`, a 404 URL.
   - Widths: 320, 375, 390, 414, 768, 834, 1024, 1280, 1440.
   - Assert `document.documentElement.scrollWidth <= innerWidth + 1` after a full-page scroll (triggers lazy/GSAP content), with `prefers-reduced-motion: reduce` emulation for determinism.
   - Desktop lock: 1280/1440 screenshots diffed clean against the pre-change baseline.

---

## 7. Verification protocol (every phase boundary)

1. `npm run lint` (0 errors) and `npm run build` from `website/`.
2. Playwright horizontal-scroll sweep across the route × width matrix.
3. Desktop screenshot diff at 1280/1440 vs baseline — **zero diff expected** (the only intended visual changes are at ≤1023 widths).
4. Phase 2 extra: DevTools touch emulation — burger tap at 320/390; WhatsApp reachability + safe-area on an iPhone viewport; FAQ open → rotate → content not clipped; Lighthouse a11y tap-target audit on `/`, `/services/web`, `/work`.
5. Changelog entry in `website/docs/changelog.md` per phase; conventional commits (`fix:` / `a11y:` / `chore:`).

## 8. Effort summary

| Phase | Scope | Effort |
|---|---|---|
| 0 — Foundations | docs + one utility | **S** |
| 1 — P0 overflow | 5 fixes, ~8 files | **S–M** |
| 2 — P1 touch | 5 fixes incl. one JS hook | **M** |
| 3 — P2 tablet | 8 items incl. verify-then-fix | **M–L** (largest QA surface: 601–880 sweeps) |
| 4 — P3 guardrails | 1-line CSS + deletions + test spec | **S–M** (test spec is most of it) |

## 9. Open items for Adi

1. **Approve this doc** → implementation starts at Phase 0.
2. Footer 44px vs AA density — already decided (AA), flagged here for the record.
3. FAQ accordion's max-height transition is a grandfathered layout-property animation; replacing it with a transform-based reveal would be a vocabulary expansion needing your sign-off — **not** included in this plan.
