# Techwise IQ Design System — "Kinetic"

Source of truth for the production build. Visual reference: `design-mockups-11-06-2026/design-e-kinetic-12-06-2026.html` (also copied to `website/docs/design-reference.html`).

The personality: **type IS the design.** Massive moving typography carries the energy; color is hot and confident; structure is hard-edged. Pop elements (stickers, geometric shapes, sun yellow) are seasoning, never the meal. Photography is optional and rare — when the type works, images are decoration.

## 1. Color tokens

```css
:root {
  --bone: #F2F0E9;  /* warm cream — page background, never pure white */
  --ink:  #101010;  /* near-black — text, borders, dark sections */
  --hot:  #FF4D00;  /* hot orange — PRIMARY accent: CTAs, highlights, ticker bg */
  --sun:  #FFD02F;  /* pop yellow — SECONDARY accent: stickers, hover fills. Sparing. */
  --paper:#FFFFFF;  /* card surfaces if ever needed */
  --soft: #7A776E;  /* muted labels on light bg */
  --soft-dark: #9A9A92; /* muted text on ink bg */
}
```

Usage rules:
- Hot orange is the workhorse accent. Sun yellow appears at most 2–3 times per page (sticker badge, one hover state, one shape). If yellow starts competing with orange, cut yellow.
- Dark (`--ink`) sections are emphasis moments — max 1–2 per page (statement section, optionally footer).
- Text pairs that pass contrast: ink/bone, bone/ink, bone/hot (large text only — Anton ≥ 24px), ink/sun. **Never** hot-on-bone for body text, never sun text on bone.

## 2. Typography

| Role | Font | Usage |
|---|---|---|
| Display | **Anton** | All headings + kinetic rows. Always uppercase. letter-spacing +0.005em. Never bold (single weight). |
| Body / UI | **Archivo** 500–700 | Paragraphs, buttons text |
| Labels / technical | **Space Mono** 400, 700 | Section labels, list items, claim card, tickers. Uppercase, +0.07em tracking |

Load via `next/font/google`, self-hosted output, `display: swap`. No other families — ever.

Type scale:

```
kinetic rows: clamp(64px, 12.5vw, 176px) / 0.94
h1/h2 giant (service rows, statement): clamp(34px, 6–7vw, 86–100px) / 0.95–0.96
h2 section: clamp(30px, 4.6vw, 62px) / 1.04
h3: 17–21px uppercase Anton
body: 16.5px / 1.55
mono labels: 11.5–13px uppercase
```

Display tricks (max one per element):
- `.outline` — transparent fill, 2px ink stroke (hover state for service rows, ghost numbers)
- strike-through reveal — 0.12em hot bar, scaleX(0)→1, origin left
- highlight word in `--hot` or `--sun`

## 3. Structure & borders

- Border: `3px solid var(--ink)`. Section dividers, buttons, badges, accordion rows.
- Hard shadows, never blurred: `4–5px offset var(--ink)` on buttons/chips, `9px var(--hot)` on the hero claim card. Hover = translate into the shadow (pressed effect).
- Radius: **0 everywhere.** Circles are allowed only as decorative geometric shapes.
- Container: max-width 1200px, 24px side padding.
- Section padding: 96–120px vertical for set-piece sections; the services accordion is edge-to-edge full-bleed with internal `.wrap`.

## 4. Components (matches `src/components/`)

**Nav** — fixed (not sticky-bordered), transparent with bone fade-out gradient (the one permitted gradient — it's functional, not decorative). Anton wordmark with hot "IQ", single mono CTA chip with hot shadow.

**KineticRows (Hero)** — 3 stacked full-bleed marquee rows: solid ink / outlined / hot orange. Opposing directions, 22–30s linear loops. Centered claim card: ink bg, mono type, rotate(-2deg), 9px hot shadow. Sticker badge top-right: sun bg, 3px border, rotate(7deg), slow wobble.

**Manifesto** — one giant Anton paragraph; words start at 14% opacity and "light up" sequentially as the section scrolls through the viewport. Key word in hot.

**ServiceRows** — full-bleed accordion rows with 3px top borders. Row: mono number (hot) + giant Anton title + hot arrow (appears on hover, rotates 45°→135° when open). Hover: title hollows to outline, row indents 22px. Open: bg shifts to #ECE9E0, body grid = description + mono deliverables list. One open at a time. Rows are buttons (keyboard accessible, aria-expanded).

**Ticker** — full-bleed hot-orange strip, 3px borders, mono uppercase marquee of proof phrases ("Fixed scope ★ Demos every Friday ★ …"). Max one per page; it replaces the old StatsStrip concept — slogans, not numbers, so nothing to fabricate.

**ProcessSection** — 4 columns, 3px vertical rules; ghost Anton numbers (outline) that fill hot on hover; Anton h3 + short body.

**ShoutSection (statement)** — ink bg, giant Anton claim, strike-through reveal on the negated word ("hours."), highlight word in sun. Floating bordered geometric shapes (hot circle, sun square), slow bob. Max 2 shapes.

**CTASection (contact)** — mono kicker + giant Anton mailto (hover: hot underline wipes in left→right, text turns hot) + row of bordered mono chips (WhatsApp, booking, location) with sun hover fill.

**Footer** — 3px top border, two mono lines. Quiet.

**Buttons (ui/)** — mono 700 uppercase 13px, 3px border, hard ink shadow, hot bg (primary) or bone bg (secondary). Hover: translate(3px,3px), shadow shrinks.

## 5. Motion

Vocabulary (everything on the page uses only these):
- Marquee loops: 22–30s linear, infinite. Hero rows + ticker only.
- Scroll reveals: opacity 0 + translateY(30px) → none, 0.75s `cubic-bezier(.2,.7,.3,1)`, sibling stagger 0.12s, fire once.
- Hover micro-interactions: pressed-shadow buttons, outline-hollow titles, arrow slides.
- Accordion: max-height transition, 0.5s same curve.
- Decorative idle: sticker wobble 5s, shape bob 6–7s.

**The showpiece (one per page):** velocity skew — kinetic rows skew with scroll velocity (`skewY`, clamped ±7°, lerp 0.12, rAF loop). Home page only. Other pages get NO showpiece until one is deliberately designed.

Rules:
- transform/opacity only. No layout-triggering properties, no filter animation.
- `prefers-reduced-motion: reduce` → all animation off, marquees static, manifesto fully lit, accordions open-capable, page fully readable. Already proven in the mockup — port it faithfully.
- JS animation isolated in hooks (`useReveal`, `useVelocitySkew`, `useAccordion`) — never inline copy-paste.

## 6. Accessibility

- Service accordion rows: `<button>` semantics, `aria-expanded`, Enter/Space toggle, visible focus = 3px hot outline offset 2px.
- Kinetic rows + ticker are decorative: `aria-hidden="true"`, real h1 lives in the claim card (visually styled, semantically first).
- Contrast rules in §1. Touch targets ≥ 44px. Marquees pause under reduced motion.
- Test the manifesto lit-words effect with a screen reader — content must read as one normal paragraph.

## 7. Don'ts (anti-slop)

No decorative gradients (nav fade exempt). No blurred shadows or glows. No rounded corners. No Inter/Roboto. No photography in the hero — type carries it. If photos appear elsewhere (case studies): 3px ink border + hard shadow, no filters required. No emoji in UI. No third accent color. No second showpiece. No carousel anything. When tempted to add an effect, re-read §5's vocabulary — if it's not listed, it doesn't ship.
