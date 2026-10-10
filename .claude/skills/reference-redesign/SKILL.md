---
name: reference-redesign
description: Redesign one Techwise IQ page (any route other than Home) in the reference composition that Home shipped with in ROADMAP 13.1 / D-045 — centred ghost-line hero, giant-word chapters with accent dot, illustrated feature cards with parallax artifacts, hairline capability grids, pill chapter nav, Inter Tight, over the checkered backdrop. Use when the owner says "redesign /about", "apply the home design to <page>", "next page in the redesign", or "/reference-redesign <route>".
---

# Reference redesign: one page at a time

Home (`src/components/immersive/home/`) is the finished example of the design. This skill gives
every other page the same grammar, one route per run, cheaply.

Argument: the route to redesign (e.g. `/services/web`). If none is given, take the next ⬜ row in
the ROADMAP "Redesign rollout" stage.

## 0. Cost rules (owner, 2026-10-10, D-046)

- Work **directly, with no sub-agents**. The 7-agent pipeline (D-020) is suspended for this rollout.
- If a fix fails the same check twice, stop and report. No rebuild loops.
- Take screenshots with one small Playwright script, at 390 and 1440 only. Run Lighthouse once per group, at the end.

## 1. Read first (only what this page needs)

1. `docs/DECISIONS.md`: D-045 (the design), D-002 (honesty), plus any decision that names this route.
2. `docs/design-system.md` § "Home reference composition", plus the type and colour token sections.
3. The page's current files (`src/app/<route>/`, its component folder, its `*-content.ts`/`data/`).
4. Home as the pattern: `home/index.tsx`, `HomeHero.tsx`, `ServiceStories.tsx`, `Illustrations.tsx`,
   `home.module.css`, `HomeMotion.tsx`.
5. Visual source: `techwise-iq-build-handoff/reference/techwise-iq-editions-reference.html`
   (an idea source only; never paste from it).

## 2. The grammar (what makes it look like Home)

| Element | Rule |
|---|---|
| **Hero** | Centred. Mono eyebrow → huge `h1` with line 1 in `--tw-fg` at weight ~680 and a ghost line 2 in `--tw-muted` at 400 → one lead sentence → max two pill CTAs. Tracking −0.065 to −0.075em, line-height ~0.8–0.9. 2–5 tilted decorative cards (`aria-hidden`), kept clear of the copy. |
| **Intro statement** | 3-col grid: small count label / giant multi-line statement (ghost second half) / muted aside. |
| **Chapter** | `0N / Name` count, then a **giant one-word title** (400, −0.072em) with an `aria-hidden` accent dot, then the thesis `h3` and a muted paragraph set right. Next comes a feature space: a large illustrated card (`--tw-radius-proof`) with 2–3 tilted artifacts (`--tw-radius-artifact`) at different parallax rates. It ends with a hairline-ruled 3-col grid (mono type label / `h4` / short `p`). |
| **Rhythm** | Alternate sparse (giant type, air) and dense (grid, data). Never two dense blocks back to back. No rows of equal rounded cards. |
| **Accent** | One accent per viewport: web acid, software orange, AI violet, build blue. A page with no service leans acid. |
| **Nav** | A page with ≥3 chapters gets the fixed bottom pill nav (`<nav aria-label="Page chapters">`, hidden ≤768px). |
| **Close** | The site footer ("Let's build what's next.") is every page's close. Never add a second closing CTA section above it. |
| **Type** | Inter Tight (`--font-display`) for everything except labels, which use Space Mono (`--font-mono`). `--font-archivo` no longer exists, so grep for it. |

Not every page gets every element. Long-form reading pages (insights articles, legal) take only the
hero, type and close treatment, and the body stays a calm ~65ch column.

## 3. Reuse, don't copy

The building blocks live in `src/components/immersive/reference/` (14.0): `RefHero` (optional `orbit`),
`RefIntro`, `Chapter` (`accent`: acid | orange | violet | blue), `CapabilityGrid` (2/3/4 cols), `Panel`
(opaque surface that floats via `data-depth`), `PillNav`, and `refStyles` for one-off
needs. Service illustrations: `FeatureSpace kind="web|software|ai"` from `home/Illustrations.tsx`.
The checkered backdrop is on by default in `ImmersiveShell` (Home passes `backdrop="none"`).
A new need goes into these files, not into a page-local copy. Home itself is not migrated onto them
yet; leave Home alone.

## 4. Steps

1. **Map the page.** Take screenshots of the current page at 390 + 1440. Then
   write a short section map in this format: `current section → new element (hero / intro / chapter N /
   grid / close) → content source → accent`. List anything cut and every **new string**. If the owner is present, wait for their
   OK. If they are away (D-046), build it and list the new strings in the PR description.
2. **Build the static structure** from the primitives and existing content/data files. Don't invent
   copy beyond the approved new strings.
3. **Motion**: reuse Home's patterns only (reveal = opacity only, never `autoAlpha`/`visibility`;
   artifact parallax + fine-pointer tilt; static tilt through the CSS `rotate` property). Use a
   `data-*-motion` bootstrap that fails open after 3s. GSAP + Lenis only, and no WebGL off Home.
4. **Gate**, run once at the end:
   `npm run lint` · `npx tsc --noEmit` · `npm run build` · `npm run test:unit` · that route's e2e specs
   + `tests/e2e/responsive.spec.ts` (update the specs that assert the old structure, and add one that asserts the new
   landmarks) · no overflow from 320 to 1440 · reduced motion and no-JS show everything · contrast ≥4.5:1 for body text over
   the backdrop · screenshots at 390 + 1440 · one Lighthouse mobile run (perf ≥ 90, a11y/SEO/BP 100).
5. **Track**: tick the route in the ROADMAP rollout stage, add a line to the changelog and to HANDOFF §6, and log a new
   decision only if something deviates from this skill.

## 5. Never

- Paste from the reference HTML/SVG, or from any external component.
- Invent clients, metrics, testimonials or "live" numbers. Every mock UI carries a visible
  **"Illustrative"** tag, and mock strings come from `src/data/*` or are plainly generic.
- Use blur, glassmorphism, or gradients without the `scene-glow-ok` marker. Don't animate layout
  properties, add a new library, or add a second WebGL renderer.
- Use banned vocabulary (root `CLAUDE.md`) or em-dash-spliced copy.
- Leave a hover-only reveal without the `(hover: hover) and (pointer: fine)` guard, a tap target
  under 44px on a coarse pointer, or a bare `100vh`.

## 6. Done means

The owner has seen 390 + 1440 screenshots, the gate is green, docs are ticked, and the page is a commit on its group's
branch `redesign/<n>-<group>`. Each group's PR stacks on the previous group's branch.
