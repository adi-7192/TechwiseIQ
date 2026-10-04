# Anti-Slop Checklist

Shared reference for `web-designer`, `ui-specialist`, `frontend-specialist`, and `qa-engineer`. Two layers: system-specific rules (from `techwise-iq-build-handoff/docs/03_DESIGN_SYSTEM.md`, enforced by `design-guard.sh` where mechanically checkable) and general 2026 "AI slop" tells (from current web research — not all mechanically checkable, so `qa-engineer` reviews these by eye against Gate 3).

The premise: LLM-generated design converges on the median of its training data — which is generic 2019–2024 SaaS. Avoiding that median is not optional polish, it's the product promise (this website IS the demo).

## Visual tells to forbid

- Inter, Roboto, or any default system grotesk as the display face (this project uses Manrope/Archivo/Space Mono — see `design-system.md` §2).
- Indigo→purple (or any) gradient used as a default "this is an AI product" signal. Gradients are banned outright in this system (`design-guard.sh` gate).
- Glassmorphism / `backdrop-filter` blur anywhere, including nav bars.
- Glowing card borders, neon-on-dark accent glow, `box-shadow` blur used as a glow effect.
- Permanent dark mode reached for as a reflex rather than a deliberate atmosphere decision (this site's dark world is a *designed* atmosphere with a documented rationale — not "dark mode because AI defaults to it").
- A thin colored accent bar down the left edge of every card — a specific, very recognizable 2026 AI-generated-UI tell.
- Uniform 1px-gray-border card grids where every card looks identical.
- Stock 3D blobs/spheres behind every heading, or a 3D object rendered "because AI things get 3D."
- Random particle explosions or particle fields with no relationship to content (this system's point field is muted, chapter-linked, and slow — never decorative sparkle).

## Structural tells to forbid

- The "three feature cards in a row" reflex — symmetric hero + 3 cards + 3 cards template shape. Break the triptych with asymmetry or a different rhythm (§3, dense capability grids are 3-col but paired with sparse/dense alternation, not stacked symmetric triads).
- Carousel-anything.
- Stacking many medium-density sections back to back (§3 rhythm rule: sparse/dense must alternate).
- Meaningless KPI dashboards or invented live metrics in proof objects — every number in a proof demo must be clearly sample/illustrative data (`ProofFrame`'s "Illustrative" tag exists specifically to prevent this).

## Copy tells to forbid

Extends the existing banned-vocabulary list (empowering, unlock, elevate, synergy, cutting-edge, seamless, revolutionize, "digital transformation," passionate about):

- Em-dash-spliced clauses used as a substitute for real sentence structure — several em dashes per paragraph is a 2026 AI-writing fingerprint. One or two per page for genuine emphasis is fine; more than that, rewrite as separate sentences.
- Symmetric "it's not just X, it's Y" constructions.
- "In today's fast-paced world," "delve," "tapestry," "landscape" (as metaphor), and hedging that never commits ("might potentially help").
- About/bio copy that is all feelings, no facts — "passionate," "dedicated," "committed to excellence" with no concrete number, date, or named outcome attached.
- Any stat, client name, logo, or testimonial that doesn't trace to real data (hard rule already in `qa-engineer.md` Gate 3 — this extends it to cover the newer copy tells, not just fabricated numbers).

## What "good" looks like instead (already true here — defend it, don't drift from it)

- One locked archetype for the whole site: dark technical atmosphere / operating-environment, not brutalist-editorial (retired) and not generic SaaS.
- A capped, intentional accent system — one signal color dominant per viewport (`--tw-accent`), never all four signals competing at once.
- A real, non-default font pairing (Manrope + Archivo + Space Mono) — not Inter.
- Radius used as a deliberate signal ("this is an interface") on proof objects/artifacts/buttons only — not applied uniformly to every block.
- Asymmetric chapter rhythm (sparse ↔ dense alternation) instead of a neat repeating grid.
- Proof objects that demonstrate an actual believable workflow with real labels — not fake dashboards or stock screenshots.

## How this gets used

- `web-designer` designs against this list before any code is written — a spec that reintroduces a forbidden pattern gets rejected at the spec stage, cheaper than catching it in code.
- `ui-specialist` / `frontend-specialist` self-check against it before handing off.
- `qa-engineer` Gate 2 mechanically greps for the checkable subset (fonts, gradients, blur, off-token hex) via `design-guard.sh`; Gate 3 reviews the rest by eye — copy tells and structural tells aren't grep-able.
- Anything here that turns out to be wrong for a specific real design need is a vocabulary-expansion decision (Adi's sign-off + doc update), same process as any other motion/visual vocabulary change.
