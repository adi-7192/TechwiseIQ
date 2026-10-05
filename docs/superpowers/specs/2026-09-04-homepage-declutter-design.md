> **Historical (redesign spec, implemented).** The chapters it describes were later removed (ROADMAP 6.2); current Home: `docs/site-spec.md`.

# Homepage decluttering — design spec

**Date:** 2026-09-04
**Status:** Approved by Adi, ready for implementation plan
**Scope:** `src/components/immersive/home/` (content, structure, typography). No new colors, fonts, radii, motion primitives, or libraries — everything below uses tokens already defined in `docs/design-system.md`.

## Problem

The homepage (`ImmersiveHome`) currently renders ~1,600 words across 5 full "chapters" (Websites, Automation, Apps, Advisory, Build), each with a thesis heading + thesis body + 6 capability cards. Four concrete problems, confirmed by reading the code and content:

1. **Text overload.** 30 capability cards total before a visitor reaches real proof or the CTA.
2. **Structural duplication.** The business has 3 pillars (Web, Software, AI — per root `CLAUDE.md`), but the homepage has 5 chapters. "Automation" and "Advisory" both link to `/services/ai` — the AI pillar is told twice, each time with its own full 6-card matrix.
3. **Typography monotony.** The `chapter` display-heading size (`clamp(4rem, 8.7vw, 8.5rem)`, near-hero scale) is used 6 times on one page (the framing statement + all 5 chapters), so nothing after the hero reads as more or less important than anything else.
4. **Buried proof.** `SelectedWork` (real, shipped client work — the strongest credibility signal on the site) currently renders after all 5 giant chapters, deep in the scroll.

## Design

### 1. Chapter structure: 5 → 3 pillars + a trust strip

Replace the 5-chapter list in `CHAPTERS`/`BUILD_CHAPTER` (`home-content.ts`) with 3 full pillar chapters (still using the existing `ChapterContent` shape and `Chapter` component) plus one lightweight, non-chapter "Build" trust strip.

**01 · Websites** — unchanged scene/thesis/transformation/proof. Capabilities cut from 6 to **4** (see design-review note below), dropping the ones that now overlap with the Build strip:
- Keep: `Positioning` ("One sharp promise before the scroll"), `Interaction` ("Motion with an explanatory job"), `Proof` ("Demonstrations before service taxonomy"), `Conversion` ("One clear next action").
- Drop: `Build`, `System`.

**02 · AI** — merges `automation` and `advisory` into one pillar (both currently point at `/services/ai`; this removes the duplication at the root).
- `id`: `'ai'`, `scene`: `'automation'` (reuse the existing violet accent — see §3), `index`: `'02'`, `kicker`/`title`: `'AI'`.
- `thesis`: "Know what's worth building, then put it inside a flow people can control."
- `thesisBody`: "Opportunity discovery and build-vs-buy judgment decide what's worth automating. Inputs, rules, model judgment, system actions and human checkpoints decide whether it actually works once it ships."
- `transformation`: `{ from: '"We should use AI"', to: 'Accountable, running system' }`
- `proof`: `'automation'` (the workflow diagram — intake / rules / bounded AI / human checkpoint), `proofCaption` unchanged.
- `link`: `{ href: '/services/ai', label: 'Explore AI automation & advisory' }`
- Capabilities (4, giving the merged chapter a "decide → build → build → govern" arc across both original chapters): `Opportunity map` ("Prioritize value × feasibility × risk"), `Lead operations` ("Qualify, enrich and route inbound demand"), `Documents` ("Extract and validate operational data"), `Human control` ("Escalate by consequence, not novelty").
- Drop the remaining 8 capabilities from the two original chapters (Knowledge, Email + CRM, Observability, Build vs buy, Prototype, Roadmap, Governance, Adoption) — this depth already lives on `/services/ai`.

**03 · Apps** — unchanged scene/thesis/transformation/proof. Capabilities cut from 6 to 4:
- Keep: `Internal tools` ("One operating console instead of five tabs"), `Portals` ("Give customers the next useful action"), `Workflow products` ("Software around a real sequence of work"), `Iteration` ("Ship the core before the wishlist").
- Drop: `Data`, `Permissions`.

> **web-designer gate — revision made, not rubber-stamped:** the first draft of this spec cut every pillar to exactly 3 capability cards. Checked against `docs/anti-slop-checklist.md` line 21, which explicitly names *"the three feature cards in a row" reflex* as a generic-AI-website tell to avoid. A clean 3-card row under each chapter thesis is exactly that shape, repeated identically 3 times down the page — trading one slop pattern (text overload) for another (template symmetry). Revised to **4 cards per pillar**: in the existing `.matrix` CSS (3-column grid, confirmed in `home.module.css:279-284`), 4 items render as an uneven 3-then-1 row, which breaks the symmetric triad while still cutting the matrix by a third. Total capability cards: 18 → 12, not 18 → 9 as first drafted.

**Build — demoted to a trust strip, not a chapter.** It was always documented as "not a fifth service, a credibility beat" but got full-chapter visual weight. New treatment: a single compact horizontal strip — one short line + 5 small badges (label + one-line note each), no thesis pair, no proof object, no `chapter`-scale heading.
- Line: "The last 20% is where a prototype becomes a system."
- Badges: `Testing` — "Cover the paths that actually break" · `Deployment` — "Ship on purpose, not by hand" · `Performance` — "Fast on real devices and networks" · `Security` — "Safe defaults, least privilege" · `Ownership` — "You keep the keys".
- Drop `Observability` from this strip (the least visitor-facing of the six; the other five carry the most buyer-relevant trust signal).
- This needs a new small presentational piece (e.g. `BuildStrip.tsx` + a `BUILD_STRIP` content export) rather than reusing `Chapter` — it is deliberately a lighter-weight component, not a 4th instance of the chapter pattern.
- **ux-specialist gate:** badges are presentational (label + note text), not controls — no `role="button"`/click handler/hover-only affordance. Nothing here needs keyboard interaction beyond normal document flow. The strip still needs a real, labelled section heading (can be visually understated — e.g. `SectionLabel` + a small `h2`, doesn't need `chapter`/`h2` display scale) so it stays in the document outline and the `#build` `ChapterNav` anchor lands somewhere AT users can identify as a section, not an unlabelled `<div>`.

### 2. Page order — proof moves earlier

Current: Hero → Framing → Websites → Automation → Apps → Advisory → Build → Selected Work → Operating Model → Final CTA.

New: **Hero → Framing → Websites → AI → Apps → Build strip → Selected Work → Operating Model → Final CTA.**

Real client proof now follows immediately after the pitch instead of after 5 chapters — it should be the thing a visitor sees right before Operating Model / the final ask, not something they have to scroll past a wall of illustrative content to reach.

### 3. Typography hierarchy

Reserve the `chapter` display-heading size (near-hero scale) for the **Framing statement only** — it's said once, so it can still land with impact. The 3 pillar chapter titles (`Chapter.tsx`, currently `size="chapter"`) drop to `size="h2"` (`clamp(2.2rem, 4vw, 4.5rem)`). Both are existing tokens from `docs/design-system.md` — this is a size-choice change, not a new vocabulary entry, so it doesn't touch the design-guard hook.

Resulting hierarchy: Hero (loudest, once) → Framing statement (`chapter`, once) → 3 pillar titles (`h2`, three times) → Build strip (smaller still — no display heading, just label-scale type) → Selected Work / Operating Model / Final CTA (existing sizes, unchanged).

### 4. Supporting copy/nav updates

- `FRAMING.index`: `'Field guide / 3 chapters'` (was `'04 chapters'`).
- `FRAMING.titleLines`: `['One studio.', 'Three ways to remove', 'business friction.']` (was "Four ways").
- `FRAMING.aside`: unchanged — "Instead of a service menu, each chapter shows..." still reads correctly for 3 chapters.
- `ChapterNav.CHAPTER_LINKS`: `Intro, Web, AI, Apps, Build` (5 entries, was 6) — `Build` keeps its own nav anchor even as a strip, since it's still a distinct scroll stop.

### 5. Technical/scene impact (verified against current code, not speculative)

- `Scene` type in `home-content.ts` drops `'advisory'`; only `'web' | 'automation' | 'apps' | 'developer'` remain in use on the homepage. `automation`'s existing violet accent now represents the merged AI chapter.
- `SCENE_ACCENT` loses its `advisory` entry. (Note: `advisory` previously reused the same acid accent as `web` — a pre-existing minor color-mapping overlap that this merge also resolves.)
- `src/lib/scene/presets.ts:14` (the `SceneName` union) and `:39` (the `advisory: { accent: 0xd0ff68, ... }` preset entry) both need the `advisory` case removed.
- `src/components/immersive/home/ChapterArtifacts.tsx:39` (type union) and `:61-62` (the `advisory: [{ src: 'advisory-roadmap', ... }]` floating-artifact slot) both need `advisory` removed or reassigned — decide whether the `advisory-roadmap` artifact asset is retired or repurposed under the merged `automation` slot.
- Confirmed by reading `HomeMotion.tsx`: it drives reveals off generic `[data-home-reveal]`/`[data-chapter-artifact]` selectors, not a hardcoded chapter list or count — the chapter-count reduction should not require changes there, but `frontend-specialist` should still re-verify post-build rather than assume.
- `BUILD_CHAPTER` export is replaced by a `BUILD_STRIP` export; anywhere importing `BUILD_CHAPTER` (currently just `home/index.tsx`) needs updating to render `BuildStrip` instead of `Chapter`.

## What stays untouched

Hero, Selected Work, Operating Model, and Final CTA sections are already lean and correctly scoped — no changes proposed to any of them. No new colors, fonts, radius values, motion primitives, or libraries anywhere in this spec — everything is a content cut, a re-grouping, or a choice between two already-existing type tokens.

## Net effect

- ~1,600 words → roughly 650–750 words on the page.
- 30 capability cards → 12 full cards + 5 short badges.
- AI pillar explained once instead of twice.
- 6 near-hero-scale headings on one page → 1.
- Real client proof moves from position 8 of 10 sections to position 6 of 9.

## Pipeline gate log

Run against this project's `.claude/agents/` role definitions, applied inline (their `main-website-designer` dispatcher isn't registered as a callable subagent in this environment — see conversation for detail). `ui-specialist`, `frontend-specialist`, and `qa-engineer` gate implementation, which hasn't started; those run when this spec becomes code.

**product-manager — BUILD.**
- Scope: this is a content/IA trim to an existing homepage, not a new page/feature. No honesty-rule risk — the change only removes capability claims and consolidates existing real content; nothing invented.
- Banned-vocabulary scan (root `CLAUDE.md` list + `docs/anti-slop-checklist.md` tells) on all new/rewritten copy in this spec: clean.
- Audience check: `Websites` keeps a founder-facing card (`Conversion`) and process/craft cards (`Interaction`, `Proof`) balanced against the ops/IT-facing `Positioning`; `AI` keeps one advisory-framing card (`Opportunity map`), two concrete delivery cards (`Lead operations`, `Documents`), and one governance card (`Human control`) — both buyer types still served. The reliability signal that used to repeat inside every chapter (testing/deploy/security/ownership) isn't lost, it's consolidated into the Build strip once instead of scattered 5 times — an improvement for the ops/IT reader, not a cut.
- Corroborating evidence the 3-pillar structure is correct, not a stylistic preference: `docs/site-spec.md:27` (the retired but still cardinality-relevant Kinetic spec) describes the service section as exactly 3 items ("001 Web Development / 002 Custom Software / 003 AI Automation"), and `src/app/page.tsx`'s existing `JSON-LD` `serviceType` list already only names 3 services. The current 5-chapter homepage was the outlier, not this spec.
- Acceptance criteria: (1) homepage renders exactly 3 pillar chapters + 1 Build strip, no `/services/ai` link appears twice, (2) rendered word count drops from ~1,600 to the 650–750 range, (3) no chapter/section introduces a stat, client name, or testimonial not already in `@/data/case-studies`, (4) banned-vocabulary and anti-slop-checklist scans stay clean on the new copy, (5) `Selected Work` renders immediately after the Build strip and before `Operating Model`.

**web-designer — BUILD, with the revision above already applied.** Flagged and fixed the 3-card anti-slop violation (§ above). Sign-off conditions: `h2` used for pillar titles (not a new size stop), no new color/gradient/radius, `.matrix` grid handles a 4-item row without new CSS rules (confirmed against current `home.module.css`), Build strip is visually subordinate to the 3 pillar chapters (smaller type, no proof object) so it still reads as a credibility beat and not a 4th pillar.

**ux-specialist — BUILD, with two additions folded into § "Build" above.** (1) Build-strip badges must stay non-interactive/presentational — no fake button affordance. (2) Build strip needs a real, labelled heading in the document outline, even if visually small, so the `#build` anchor and screen-reader navigation both still land on something identifiable. No blockers on keyboard, reduced-motion, or contrast — this spec introduces no new interaction pattern, no new color, and (per `HomeMotion.tsx`, confirmed by reading it) no hardcoded chapter list that the count reduction would break.

## Out of scope

- Any change to `/services/*` detail pages — the capability depth cut from the homepage already lives there; this spec doesn't touch that content.
- Visual/motion implementation details (exact badge styling, `BuildStrip` markup, spacing) — those belong to `web-designer`/`ui-specialist` in the build pipeline, not this content/IA spec.
- Mobile-specific layout of the new 3-column-down-to-1 capability grid — existing responsive rules in `home.module.css` already handle a `.matrix` with fewer children; no new breakpoint behavior is being introduced.
