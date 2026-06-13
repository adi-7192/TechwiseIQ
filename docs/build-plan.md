# Techwise IQ Website — Phased Build Plan

How to take `design-e-kinetic-12-06-2026.html` to a launched Next.js site, phase by phase. Each phase ends with a hard gate: **qa-engineer PASS verdict + `npm run lint` + `npm run build` + your own eyes on `npm run dev`.** Don't start the next phase on a failed gate.

Copy of this plan lives at `website/docs/build-plan.md`. Agents and enforcement tooling: see `website/claude-setup-12-06-2026/INSTALL.md` (install before Phase 0).

---

## Phase 0 — Foundation (½–1 day)

Goal: primitives every page needs. No pages yet.

- Verify tokens/fonts already in `globals.css` + `layout.tsx` (done — confirm `npm run build` passes on your machine)
- `src/hooks/`: `useReveal`, `useVelocitySkew`, `useAccordion` — ported from the reference HTML's JS, reduced-motion aware
- `src/components/ui/`: Button (primary hot / secondary bone), StickerBadge
- `Marquee/` primitive (direction, duration props; `aria-hidden`; static under reduced motion)
- `Nav/` + `Footer/`

Kickoff prompt for Claude Code:
> Read CLAUDE.md, docs/design-system.md and docs/design-reference.html. Build Phase 0 from docs/build-plan.md: the three hooks, ui primitives, Marquee, Nav, Footer. Port behavior faithfully from the reference HTML. Use the ui-specialist for implementation and qa-engineer as the gate.

Gate: components render in a scratch page; reduced-motion verified; QA PASS.

## Phase 1 — Home page (2–3 days)

Goal: the full Kinetic homepage, section by section, in this order (each section = design-reference fidelity + QA):

1. `Hero/` — 3 kinetic rows + claim card (real h1) + sticker + CTAs + velocity skew showpiece
2. `Manifesto/` — lit-words scroll effect
3. `ServicesSection/` — giant accordion rows (button semantics)
4. `Ticker/` — hot strip, proof phrases
5. `ProcessSection/` — 4 steps, ghost numbers
6. `ShoutSection/` — ink statement, strike-through, 2 shapes
7. `CTASection/` — giant mailto + chips
8. Page assembly + metadata + JSON-LD (`Organization`, `ProfessionalService`)

Gate: Lighthouse ≥95/100/100/100 on `npm run build && npx serve out` (or vercel preview); real phone test; reduced-motion test; QA PASS on the whole page.

## Phase 2 — Services pages (1–2 days)

`/services` overview + `/services/web`, `/services/software`, `/services/ai` per site-spec: hero claim → deliverables → mini-process → FAQ (real objections, honest "starting from" ranges from the internal catalogue — ranges ONLY) → CTA. `FAQPage` JSON-LD. No new showpiece animations — existing vocabulary only.

Full pipeline applies: product-manager spec per page first (copy is the hard part here, not layout).

## Phase 3 — Proof + people (1–2 days + waiting on content)

- `/work` + `/work/[slug]` — **blocked on real content**: fill `case-study-template` for your 2 sites + 1–2 apps before this phase. The build can't start without it; schedule the writing now.
- `/about` — the trust-carrying page (founder note, how-we-think, real internal automation example)
- `/contact` — form (server action), WhatsApp link, booking embed, response-time promise

## Phase 4 — Site-wide polish (1 day)

404 page (on-brand), `/privacy` + `/terms`, OG images (Kinetic-styled template), sitemap.xml, robots.txt, WhatsApp floating button, analytics (Plausible/Umami), favicon set, full-site Lighthouse sweep, cross-browser pass (Safari matters in UAE).

## Phase 5 — Launch (½ day)

Run the launch checklist in `site-spec` §Launch. Deploy to Vercel, custom domain, redirect www, submit sitemap to Search Console. Post-launch backlog (do NOT pull forward): `/insights` blog, `/pricing` public page, Arabic `/ar`.

---

## Standing rules across all phases

1. **One section per Claude Code task.** Small tasks, frequent commits (`feat: hero kinetic rows`). Don't ask for whole pages in one prompt — review drift compounds.
2. **External components go through `/adapt-component`. No exceptions.** That pipeline exists precisely for the moment a free-components site tempts you. Idea in, tokens out, license checked.
3. **The reference HTML is law until it isn't.** Deviations from `design-reference.html` need a reason written into the design-system doc — otherwise faithful port wins.
4. **New animation = vocabulary expansion = your sign-off + doc update first.** The agents are instructed to stop and ask. If they don't, that's a bug in the process — tell them to re-read the design system.
5. **Verify the gate yourself once per phase.** Agents catch most things; your eyes on a real phone catch the rest.
