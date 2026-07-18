<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Responsive conventions (2026-07-18 — see docs/responsive-audit-plan.md)

**Canonical breakpoints** for all new/edited media queries (max-width unless noted):
`480px` small-phone tweaks · `768px` phone→tablet (content) · `880px` shell (Nav/Footer/CTA/contact) · `1024px` tablet→desktop.
Existing working files keep their breakpoints — converge when touching a file for another reason, never churn-rewrite.

**Mandatory patterns:**
- **Breakable email/URL:** `Info@<wbr />techwise…` in JSX + `overflow-wrap: break-word` on the container (utility: `.u-breakable` in globals.css). Never render a long unbreakable token without it.
- **Hover-revealed content** goes behind `@media (hover: hover) and (pointer: fine)` (reference: `src/app/work/work.module.css`). Cosmetic hover transforms are exempt.
- **Tap targets:** primary controls ≥44px via `@media (pointer: coarse) { min-height: 44px }`; dense text-link lists ≥24px + spacing (WCAG 2.2 AA — Adi-approved trade-off for the mono link lists).
- **Full-viewport heights:** declare `min-height: 100vh; min-height: 100svh;` (fallback chain), never bare `100vh`.
- **Overflow:** `html`/`body` use `overflow-x: clip` as a guardrail — it is a net, not a fix. Root-cause every horizontal overflow (the Playwright sweep in `tests/e2e/responsive.spec.ts` asserts `scrollWidth <= innerWidth`, which `clip` does not mask).
