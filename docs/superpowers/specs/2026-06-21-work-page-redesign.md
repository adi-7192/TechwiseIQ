# Work Page Redesign — Spec
**Date:** 2026-06-21
**Scope:** `/work` listing page only. Case study detail pages (`/work/[slug]`) are out of scope.
**Goal:** Replace the broken accordion grid with full-width project rows + full-screen Framer Motion overlay. Add kinetic marquee strip, filter chips, ghost card, and bridge strip. Bring the page energy in line with the home page without adding a second showpiece.

---

## 1. Problems this fixes

| Problem | Fix |
|---|---|
| Accordion expands below the sibling tile — confusing spatial logic | Remove accordion entirely; replace with overlay |
| 2-column 50/50 tiles read thin with only 2 projects | Full-width rows — each project owns the horizontal space |
| Card info sparse (service + title + tagline only) | Add year, industry, outcome pills |
| Full case study pages (`/work/[slug]`) are invisible from the grid | Overlay has prominent "Read full case study →" CTA |
| Hero has no kinetic energy | Add ink marquee strip directly below hero border |
| No signal the portfolio is live/growing | Ghost card: dashed-border placeholder row |
| Abrupt jump from grid to CTASection | New bridge strip (ink bg) before CTASection |
| WorkGrid has its own `PROJECTS` array, duplicating data from `case-studies.ts` | Consolidate: extend `CaseStudy` type, delete WorkGrid's local array |

---

## 2. Data layer changes

### 2a. `src/types/index.ts` — extend `CaseStudy`

Add two new optional fields:

```ts
export type CaseStudy = {
  // ... existing fields unchanged ...
  year: number                // e.g. 2025 — for card metadata
  deliverables: string[]      // max 6 punchy bullet strings — shown in overlay
}
```

### 2b. `src/data/case-studies.ts` — populate new fields

**AASKRA Realty:**
```ts
year: 2025,
deliverables: [
  '11-page Next.js website with custom luxury design',
  'Cinematic animated loading screen + hero sequence',
  '6 interactive location profiles with ROI metrics',
  '3 strategy pages (off-plan, buying, selling)',
  'Developer partnership showcase (EMAAR, DAMAC, SOBHA)',
  'WhatsApp Business + consultation booking integration',
],
```

**Express Trade Financing:**
```ts
year: 2025,
deliverables: [
  '10-page website with custom design and animations',
  'Global transaction map — 25+ countries served',
  '3 detailed case studies with real deal outcomes',
  'Animated hero with Dubai skyline panorama',
  'Trade finance + SME support service pages',
  'WhatsApp + consultation form integration',
],
```

---

## 3. Section-by-section design

### 3a. Hero — minimal change

Keep existing markup and copy. One addition only:

**StickerBadge** — reuse `ui/StickerBadge`. Position: absolute, top-right of the `.hero` wrap. Text: `"2\nLIVE\nPROJECTS"`. Color: `--sun` background, `--ink` border (standard sticker treatment). Rotate: `rotate(−8deg)`. Slow wobble animation (already in StickerBadge).

No other hero changes. Padding stays as-is.

### 3b. Kinetic marquee strip (NEW)

Directly below the hero `border-bottom`, before the filter chips. Full-bleed, `background: var(--ink)`.

- Use existing `Marquee` component (already handles `aria-hidden`, loop speed, direction)
- Content: alternating project names + `"DUBAI · WORLDWIDE"` separator phrase, all in `--soft-dark`, arrows `→` in `--hot`
- One row only. Speed: 28s. Direction: left.
- `prefers-reduced-motion`: static, no animation (Marquee component already handles this)
- `aria-hidden="true"` on the strip wrapper

Text items (repeat ×2 for seamless loop):
`→ AASKRA REALTY` · `→ EXPRESS TRADE FINANCING` · `→ DUBAI · WORLDWIDE` · `→ WEB DEVELOPMENT`

### 3c. Filter chips (NEW)

Inside `.wrap`, `padding: 20px 0`, `border-bottom: var(--bd)`.

- 4 chips: **All / Web / Software / AI**
- Chip style: Space Mono 700, 11px, uppercase, `letter-spacing: 0.07em`, `padding: 8px 16px`, `border: var(--bd)`, no radius
- Active chip: `background: var(--ink); color: var(--bone)`
- Inactive hover: `background: #ECE9E0`
- Hard shadow (`box-shadow: 3px 3px 0 var(--ink)`) on active chip only
- Logic: CSS `display: none` on non-matching rows via data attribute. No JS library. Client component (`"use client"`).
- All 3 current projects are `service: 'web'` so Software/AI filters will show the ghost card only.

### 3d. Project rows (replaces tile grid + accordion)

One full-width `<article>` per project. Stack vertically, separated by `border-bottom: var(--bd)`.

**Layout:** `display: grid; grid-template-columns: 1fr 1fr`. Left column: cover image. Right column: content.

**Left (image column):**
- `border-right: var(--bd)`
- `aspect-ratio: auto` (fills row height, min-height 320px)
- `<Image>` with `fill`, `object-fit: cover`, `object-position: top center`
- Hover: `transform: scale(1.03)` on the image (0.4s ease) — same as current tile
- `pointer-events: none` on the image itself

**Right (content column):**
`padding: 48px 56px`, flex column, gap 16px.

Top line (Space Mono 700, 11px, uppercase, `letter-spacing: 0.07em`):
- Service label in `--hot`
- `·` separator in `--soft`
- Year in `--soft`
- `·` separator
- Industry in `--soft`

Title: Anton, `clamp(36px, 4.5vw, 64px)`, uppercase, `line-height: 0.93`, `letter-spacing: 0.005em`. Hover: title goes outline (`color: transparent; -webkit-text-stroke: 2px var(--ink)`). Transition 0.2s (same as ServicesSection rows).

Tagline: Archivo 500, 15px, `color: #3A3933`, `line-height: 1.5`, `max-width: 44ch`.

Outcome pills row (max 2 pills):
Space Mono 700, 11px, uppercase, `border: var(--bd)`, `padding: 6px 14px`, `background: var(--bone)`, `box-shadow: 3px 3px 0 var(--ink)`. No hover state (decorative, not interactive).

Footer row (`margin-top: auto`): left = stack tags (Space Mono 700, 10px, uppercase, `border: 1px solid #CCC`, `color: var(--soft)`, `padding: 4px 10px`). Right = "View project →" in `--hot`, Space Mono 700, 12px, arrow slides 4px right on row hover.

**Row interaction:**
- Entire `<article>` is a `<button>` semantically (or `role="button"` + `tabindex="0"` on `<article>` — prefer `<button>` wrapper with `type="button"`)
- `aria-haspopup="dialog"` + `aria-label="{title} — view project details"`
- Hover: row bg `#ECE9E0` (0.15s), title goes outline, arrow slides
- Click: opens the overlay (`openOverlay(slug)`)
- Row `border-top: var(--bd)` on the first row only (or `border-top` on the projects container)

**Responsive (≤880px):** stack to single column — image on top (full width, `aspect-ratio: 16/10`), content below. Both columns lose `border-right`.

**Responsive (≤600px):** content `padding: 28px 20px`.

### 3e. Ghost card (NEW)

Sits after the last real project row. Always visible, `aria-hidden="true"` (not a real project, not interactive).

Same `display: grid; grid-template-columns: 1fr 1fr` as project rows.

**Left:** dashed border `2px dashed #CCC`, background: `repeating-linear-gradient(-45deg, transparent, transparent 8px, #E8E5DC 8px, #E8E5DC 9px)`. Centered label: Space Mono, 11px, `color: #AAA`, `text-transform: uppercase` — `"IN PROGRESS"`.

**Right:** dashed border same, `padding: 48px 56px`.
- Eyebrow: `"NEXT PROJECT"` in Space Mono, `--soft`
- Title: Anton, same scale as project rows, `color: #CCC` (grayed-out), `text-transform: uppercase` — `"YOUR PROJECT\nHERE?"`
- Body: Archivo 500, 14px, `color: #BBB` — `"We're scoping new work. If you've got a problem worth solving, this slot could be yours."`
- No CTA (ghost — links to CTASection)

`opacity: 0.65` on the entire ghost row.

### 3f. Project overlay (NEW — key feature)

Full-viewport dialog. Opened on project row click. Closed by ✕ button, Escape key, or clicking the backdrop.

**Component:** `src/components/WorkOverlay/index.tsx` (`"use client"`). Receives `project: CaseStudy | null` as prop.
Rendered in `work/WorkGrid.tsx`, above the rows, always in the DOM but hidden when `project === null`.

**Animation:** Framer Motion `AnimatePresence`. On open: `opacity: 0 → 1`, `scale: 0.98 → 1`, `duration: 0.3`, `ease: [0.2, 0.7, 0.3, 1]`. On close: reverse same curve.
`prefers-reduced-motion`: skip scale, opacity only (still 0.2s).

**Overlay DOM structure:**

```
<dialog> (use native HTML dialog for a11y — .showModal() / .close())
  <div class="overlayInner">   ← display: grid, grid-template-columns: 1fr 1fr, height: 100dvh
    <div class="overlayImage"> ← position: relative, overflow: hidden, background: #1A1A1A
      <Image fill object-fit:cover object-position:top center src={project.coverImage} />
    </div>
    <div class="overlayContent"> ← overflow-y: auto, padding: 64px 56px, display: flex, flex-col, gap: 24px
      <!-- top bar -->
      <div class="overlayTopBar">
        <span class="overlayBreadcrumb">Work / {project.title}</span>  ← Space Mono, 11px, --soft-dark
        <button class="overlayClose" aria-label="Close overlay">✕ ESC</button>  ← Space Mono 11px, border: 2px solid #333, --soft-dark. Hover: border/color → --bone
      </div>
      <!-- project info -->
      <div>
        <span class="overlayService">{SERVICE_LABEL} · {project.industry} · {project.year}</span>  ← Space Mono 11px, --hot
        <h2 class="overlayTitle">{project.title}</h2>  ← Anton, clamp(36px, 5vw, 72px), --bone, uppercase, line-height 0.92
      </div>
      <p class="overlayTagline">{project.outcome}</p>  ← Archivo 500, 15px, --soft-dark, line-height 1.6
      <hr class="overlayDivider" />  ← height: 2px, background: #222, border: none
      <!-- deliverables -->
      <div>
        <p class="overlayLabel">What we delivered</p>  ← Space Mono 700, 10px, uppercase, --soft-dark, margin-bottom 12px
        <ul class="overlayDeliverables">
          {project.deliverables.map(d =>
            <li><span aria-hidden>→</span> {d}</li>   ← Archivo 500, 14px, #CCC, gap 12px, arrow in --hot
          )}
        </ul>
      </div>
      <!-- stack -->
      <div>
        <p class="overlayLabel">Built with</p>
        <div class="overlayStack">
          {project.stack.map(t => <span class="overlayStackTag">{t}</span>)}  ← Space Mono 700 10px, border: 1px solid #333, --soft-dark, padding 6px 12px
        </div>
      </div>
      <!-- footer CTAs (margin-top: auto, padding-top: 24px, border-top: 2px solid #222) -->
      <div class="overlayFooter">
        <Link href={`/work/${project.slug}`} class="overlayCTAPrimary">Read full case study →</Link>
        <!-- style: Button primary but bone text on hot bg, box-shadow: 4px 4px 0 #FF4D00, pressed hover -->
        {project.liveUrl && (
          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" class="overlayCTASecondary">
            Visit live site ↗
          </a>
          <!-- style: transparent, border: 2px solid #333, --soft-dark, hover: border/color → --bone -->
        )}
      </div>
    </div>
  </div>
</dialog>
```

**Backdrop:** `background: rgba(0,0,0,0.7)` via `dialog::backdrop`. On backdrop click → close.

**Scroll lock:** `document.body.style.overflow = 'hidden'` on open, restore on close. Already handled by native `<dialog>`.

**Responsive (≤880px):** single column — image top (aspect-ratio 16/10, max-height 40dvh), content fills remainder.

**Responsive (≤600px):** content `padding: 28px 20px`.

### 3g. Bridge strip (NEW — between grid and CTASection)

Full-bleed section, `background: var(--ink)`, `border-top: var(--bd)`, `border-bottom: var(--bd)`, `padding: 64px 0`.

Inside `.wrap`: two-column flex (`align-items: center`, `justify-content: space-between`, `gap: 48px`).

**Left:** Anton, `clamp(24px, 3.5vw, 44px)`, uppercase, `--bone`, `line-height: 1`, `max-width: 22ch`.
Copy: `"EVERY PROJECT ABOVE STARTED WITH A "` + `<span style="color: var(--hot)">20-MIN CALL.</span>`

**Right:** Archivo 500, 14px, `--soft-dark`, `line-height: 1.6`, `max-width: 38ch`.
Copy: `"No decks. No pitch theatre. You describe the problem, we tell you how we'd solve it — and whether we're the right fit. That's it."`

**Responsive (≤768px):** stack to single column.

---

## 4. Files to create/modify

| File | Action |
|---|---|
| `src/types/index.ts` | Add `year: number` and `deliverables: string[]` to `CaseStudy` |
| `src/data/case-studies.ts` | Populate `year` and `deliverables` on both entries |
| `src/app/work/page.tsx` | Add `WorkOverlay` import if needed; add `BridgeStrip` section between grid and CTASection |
| `src/app/work/WorkGrid.tsx` | Replace local `PROJECTS` array with `CASE_STUDIES`; replace accordion with project rows + overlay state; add filter chip logic; add ghost card |
| `src/app/work/work.module.css` | Full rewrite: replace tile/accordion styles with row styles, filter styles, ghost styles |
| `src/components/WorkOverlay/index.tsx` | New component — full-screen dialog overlay |
| `src/components/WorkOverlay/WorkOverlay.module.css` | New — overlay styles |

**Do not create:**
- A new hook for overlay open/close — simple `useState` in WorkGrid is sufficient (not reused elsewhere)
- A separate BridgeStrip component — inline in `page.tsx` as a `<section>` with `work.module.css` styles (one-off, not reused)

---

## 5. Animation additions (within approved vocabulary)

All new animations use only the approved vocabulary from the design system. No new entries needed:

| Animation | Token | Notes |
|---|---|---|
| Overlay open/close | Framer Motion `opacity` + `scale` | Already in vocabulary: "component/page transitions" |
| Project row title hover → outline | `color` + `-webkit-text-stroke` transition | Same as ServicesSection; already in vocabulary |
| Project row image hover → scale(1.03) | `transform` | Already in tile hover; already in vocabulary |
| Arrow slides 4px right on row hover | `transform: translateX(4px)` | Arrow micro-interaction; in vocabulary |
| StickerBadge wobble | Already built in `ui/StickerBadge` | No change needed |
| Marquee strip loop | Already built in `Marquee` component | No change needed |

**No new showpiece.** The work page intentionally has no velocity-skew or other showpiece — this is reserved for home only per design system rules.

---

## 6. Accessibility checklist

- Project row `<button>`: `aria-haspopup="dialog"`, `aria-label="{title} — view project details"`
- Overlay uses native `<dialog>` with `.showModal()` for correct focus trapping and backdrop semantics
- Overlay has `aria-label="Project detail — {project.title}"`
- Overlay close button: `aria-label="Close overlay"`
- ESC key closes overlay (native `<dialog>` handles this automatically)
- Overlay `<h2>` (project title) is the dialog's heading — focus moves to it on open
- Filter chips: `role="group"` wrapper with `aria-label="Filter by service"`, each chip is a `<button>` with `aria-pressed`
- Ghost card: `aria-hidden="true"` (not real content)
- Marquee strip: `aria-hidden="true"`
- `prefers-reduced-motion`: overlay animates opacity only (no scale), marquee is static
- Stack tags and outcome pills are decorative — no interactive role needed
- Touch targets: all interactive elements ≥ 44px

---

## 7. What stays unchanged

- `/work/[slug]` case study pages — no changes
- `CTASection` — no changes
- `Nav`, `Footer` — no changes
- Hero copy ("Proof, not promises.") — no changes
- `RevealObserver` — kept, scroll-reveals apply to content columns
- `src/data/case-studies.ts` structure — additions only, no breaking changes
