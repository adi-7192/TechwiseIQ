# Concept Lab Live Sample Sites

**Date:** 2026-07-28  
**Scope:** Three standalone Concept Lab demos, their automated live previews on `/work`, the Concept Lab manifest, and focused verification.  
**Build order:** TerraElix, mėntality, Lumora.

## 1. Goal

Replace the three honest Concept Lab draft slots with polished, self-initiated sample websites built from the prompts in `Sample sites/`. Publish each sample only after it is complete and verified. Visitors should be able to watch the real website inside its Work-page card without opening it, while retaining a clear action that opens the full demo in a new tab.

The prompt files are the source of truth for each sample's content, assets, visual direction, responsive behavior, and interactions. Framework references in the prompts describe the intended implementation patterns, not a required production runtime. The demos will reproduce the specified result using dependency-free HTML, CSS, and JavaScript.

## 2. Standalone demo architecture

Each concept is a self-contained static site:

```text
public/concepts/
  terra-elix/
    index.html
    styles.css
    script.js
  mentality/
    index.html
    styles.css
    script.js
  lumora/
    index.html
    styles.css
    script.js
```

The exact remote images and videos supplied by the prompts remain the primary media sources. Requested Lucide icons are represented by equivalent inline SVG markup. CSS and small vanilla JavaScript modules reproduce the specified menus, animations, carousel behavior, video switching, and responsive layouts without React, Vite, Tailwind, `motion/react`, or additional runtime dependencies.

Every demo is independently usable at `/concepts/<slug>/index.html`. It has semantic landmarks, keyboard-operable controls, visible focus states, appropriate accessible names, and no dependency on the parent Work page.

## 3. Concept-specific requirements

### 3.1 TerraElix

- Full-viewport wellness hero using the exact background, product, avatar, decorative, and panel assets from `sample1`.
- Responsive navbar with desktop links and an accessible mobile overlay menu.
- Three-line word-reveal headline with its inline capsule image.
- CTA row, responsive product composition, and three-panel footer strip.
- Four-card auto-rotating formula carousel with visible progress indicators.
- CSS motion matches the specified easing, reveal direction, and stagger timing.

Manifest presentation:

- Slug: `terra-elix`
- Title: `TerraElix`
- Category: `Wellness / supplements`
- Tags: `Art direction`, `Responsive UI`, `Motion`

### 3.2 mėntality

- Mental-wellbeing landing page using the exact background video from `sample2`.
- Glassmorphic fixed navbar, supplied brand treatment, desktop links, and animated mobile drawer.
- Editorial hero typography, inline eye element, search pill, language control, and architectural edge labels.
- The `#EDEEF5` page background and requested green accent remain visually exact.
- CSS motion reproduces the specified polished slide and drawer transitions.

Manifest presentation:

- Slug: `mentality`
- Title: `mėntality`
- Category: `Mental wellbeing`
- Tags: `Editorial UI`, `Video`, `Glass UI`

### 3.3 Lumora

- Single-viewport cinematic focus-app hero using all four exact videos and the transparent overlay from `sample3`.
- Liquid-glass desktop navigation and animated mobile menu.
- Badge, responsive hero copy, early-access field, video switcher, and bottom statistics.
- Video switching observes the one-second transition lock.
- The Deep Woods state changes hero content to `#182C41`; navigation and statistics remain white.
- The overlay uses the specified continuous bob animation.

Manifest presentation:

- Slug: `lumora`
- Title: `Lumora`
- Category: `Mindfulness / focus`
- Tags: `Cinematic UI`, `Video`, `Interaction`

## 4. Live Work-page preview

The existing static-image preview is replaced with a reusable client-side live-preview component. A published concept card renders the real same-origin demo in an iframe inside the existing browser frame.

Preview rules:

- The iframe is decorative, non-focusable, and has `pointer-events: none`; it cannot trap pointer, touch, or keyboard interaction on `/work`.
- The surrounding concept card remains the accessible link to the full demo and opens it in a new tab.
- A preview is mounted only when its card approaches the viewport.
- After load, the parent reads the same-origin document height and scrolls the iframe from top to bottom at approximately 24 CSS pixels per second, pauses for two seconds, returns upward at the same speed, pauses for two seconds, and repeats.
- Full-viewport demos with no vertical overflow remain at their opening view while their internal animation and video continue.
- Scrolling and embedded video playback pause while the card is off-screen or the document is hidden, then resume when visible.
- `prefers-reduced-motion: reduce` disables automated iframe scrolling and non-essential parent preview motion. The demo remains visible at its opening view.
- Mobile previews render the demo's responsive layout and remain non-interactive.

The preview area shows a branded loading state until the iframe is ready. If the demo does not become ready within 10 seconds, the browser frame shows a concise unavailable state while the card's full-demo link remains usable.

## 5. Manifest and presentation contract

`ConceptSite` will support a live preview mode rather than requiring a static screenshot:

```ts
type ConceptSite = {
  slug: string
  title: string
  category: string
  summary: string
  tags: string[]
  demoPath?: string
  previewMode?: 'live-auto-scroll'
  status: 'draft' | 'published'
}
```

A concept is publishable only when:

- `status` is `published`;
- `demoPath` exists;
- `previewMode` is `live-auto-scroll`; and
- the corresponding standalone demo is present and verified.

Draft concepts keep their existing blueprint treatment and remain non-interactive. Concepts are promoted one at a time in the agreed build order; completing TerraElix does not prematurely publish mėntality or Lumora.

## 6. Performance and resilience

- Iframes use native lazy loading in addition to viewport-based mounting.
- Only previews close to the viewport are active.
- Parent visibility management pauses remote videos when a preview leaves view and resumes them on return.
- Demo backgrounds provide deliberate fallback colors so delayed or failed remote media never exposes an unstyled page.
- Text and controls remain legible while remote assets load.
- Preview failures are isolated to their card and do not affect the rest of `/work`.
- The preview controller cleans up observers, animation frames, and timers when unmounted.

## 7. Accessibility and responsive behavior

- Demo menus expose their expanded state and close through their toggle, link selection, or Escape.
- Form controls have programmatic labels even when the visible design uses placeholders.
- Decorative media and SVGs are hidden from assistive technology; meaningful images have useful alternative text.
- Touch targets meet the repository's coarse-pointer sizing convention.
- Hover-only presentation enhancements are restricted to fine pointers.
- Each demo avoids horizontal overflow at 375px, tablet, and desktop widths.
- Automated carousel or preview movement stops under reduced motion.

## 8. Verification and publishing sequence

For each concept:

1. Add focused tests that fail while the concept is absent or the manifest entry remains unpublished.
2. Implement the standalone HTML, CSS, and JavaScript.
3. Verify semantic content, interactions, remote-media fallback, and reduced motion.
4. Inspect desktop, tablet, and 375px mobile screenshots.
5. Publish only that concept's manifest entry.
6. Verify its automated preview and full-demo link on `/work`.
7. Run the relevant unit, end-to-end, lint, and production-build checks.
8. Continue to the next prompt only after the current concept passes.

Work-page coverage will verify:

- the correct number of draft and published cards at each stage;
- the published card's iframe source and live-preview mode;
- the accessible full-demo link and new-tab behavior;
- preview loading, visibility pause/resume, and reduced-motion behavior;
- graceful preview failure without a broken card; and
- no horizontal overflow at the repository's responsive checkpoints.

Visual verification compares the rendered demos against their prompt specifications, including typography, color, layout, media placement, responsive composition, and motion state.

## 9. Out of scope

- Converting the demos into production customer websites or reusable product applications.
- Adding backend form submission, authentication, checkout, search, or analytics.
- Replacing the supplied remote media with newly generated assets.
- Refactoring unrelated Work-page sections.
- Publishing a concept before its standalone page and embedded preview pass verification.
