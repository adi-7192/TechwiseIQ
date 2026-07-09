# Visual Overhaul — Full Design Spec

**Date:** 2026-06-14
**Status:** Approved
**Reference:** https://idotive.webflow.io/ (layout density, scroll animations, visual continuity)
**Approach:** Full visual overhaul (Approach B) — redesign entire page flow as one continuous visual experience

---

## Problem Statement

The current TechwiseIQ home page has:
- Every section centered in the same 1200px `wrap` container — predictable, uniform
- Identical 96–110px padding between all sections — no rhythm variation
- Text always horizontal, centered, same-width blocks — "boring straight lines"
- Scroll effects limited to basic opacity fades (`.rv` class)
- Sections feel isolated — each with `border-top` and independent layout
- No imagery or visual elements — 100% text-on-cream

The goal: achieve Idotive-level visual density, scroll animation richness, and inter-section flow while staying true to Kinetic's identity (Anton type, bone/ink/hot/sun palette, hard shadows, no rounded corners).

---

## Design System Expansions (approved)

### New Animation Types
1. **slide-up** — translateY(50px) to 0 + opacity
2. **rotate-x** — rotateX(90deg) to 0 (dramatic heading reveals)
3. **slide-left / slide-right** — horizontal entry from sides
4. **scale** — scale(0.85) to 1 (image/card reveals)
5. **split-text** — character-by-character stagger
6. **parallax** — elements scroll at different speeds for depth
7. **scroll-progress** — continuously animated based on scroll position

### New Visual Elements
- **Three.js wireframe elements** as decorative accents (same rules as FluidParticles: `pointer-events: none`, `aria-hidden`, z-index layered behind content)
- **Placeholder images** for project screenshots (to be replaced with real ones later)
- **SVG geometric primitives** — animated circles, lines, dots as section accents

### Layout Expansions
- Sections can break the centered `.wrap` pattern (asymmetric layouts)
- Elements can cross section boundaries (inter-section overlap)
- Varied vertical padding — sections no longer uniform 96px

### What's NOT Changing
- No blur/glow effects (stays sharp — fits Kinetic)
- No rounded corners
- No gradients (nav fade-out exempt)
- Core palette: bone/ink/hot/sun only
- Core fonts: Anton / Archivo / Space Mono only
- No photography in hero (Three.js wireframe instead)
- `prefers-reduced-motion` respected everywhere

---

## Animation Infrastructure

### GSAP ScrollTrigger System
Replace the basic `.rv` IntersectionObserver with GSAP ScrollTrigger for all scroll animations. Data-attribute driven:

```
data-animate="slide-up|rotate-x|slide-left|slide-right|scale|split-text"
data-stagger="0.1"        -- delay between siblings (seconds)
data-parallax="0.3"       -- scroll speed multiplier (1 = normal, 0.3 = slow)
data-scroll-progress       -- continuously animated with scroll position
```

Implementation: Single `ScrollAnimationObserver` client component in `src/components/ui/` that registers all `[data-animate]` elements with GSAP ScrollTrigger on mount.

### Three.js Stack
- Dependencies: `three`, `@react-three/fiber`, `@react-three/drei`
- Each Three.js scene is a lazy-loaded client component (`dynamic(() => import(...), { ssr: false })`)
- Canvas paused via `frameloop="demand"` when off-viewport (IntersectionObserver)
- GPU disposal on unmount
- Reduced-motion fallback: static SVG wireframe silhouette

### Performance Guardrails
- Three.js: max 2 active canvases at a time (hero + one other)
- Scenes lazy-loaded with dynamic import
- Target: Lighthouse perf >= 90 (relaxed from 95 for Three.js), a11y 100, SEO 100
- Placeholder images: `next/image` with `placeholder="blur"`, AVIF/WebP
- Bundle monitoring: Three.js tree-shaken, only import what's used

---

## Section Designs (top to bottom)

### 1. Hero (enhanced)

**Keep:** Kinetic marquee rows, claim card, velocity skew, sticker badge
**Replace:** FluidParticles canvas with Three.js wireframe scene
**Add:** Floating project screenshot placeholder

Layout:
```
+---------------------------------------------------------------+
|  [StickerBadge]                                                |
|                                                                |
|  <<<< WEBSITES . SOFTWARE . AI . >>>>  (marquee, skew)        |
|  >>>> BUILT IN DUBAI . SHIPPED WORLDWIDE >>>> (outlined, skew) |
|  <<<< WEEKS NOT QUARTERS . >>>> (hot, skew)                   |
|                                                                |
|        +--[claim card]--+         +--[screenshot]--+           |
|        | h1 + CTAs      |         | placeholder    |           |
|        +-----------------+         | rotated -3deg  |           |
|                                    | parallax 0.6x  |           |
|  [Three.js wireframe icosahedron, slowly rotating,             |
|   mouse-reactive drift, z-index: -1]                           |
|                                                                |
|  [scroll cue]                                                  |
+---------------------------------------------------------------+
```

- Three.js scene: wireframe icosahedron in `--ink` color, slow rotation, subtle mouse-follow drift
- Screenshot: positioned right side, absolute, `transform: rotate(-3deg)`, parallax at 0.6x scroll speed
- Entry: page-load stagger — marquee rows slide in with opacity, claim card slides up, screenshot fades in with scale

### 2. Manifesto (centered text, orbiting geometry)

**Keep:** Centered Anton text, scroll-lit word reveal, hot-word burst
**Add:** Flanking animated geometry, optional Three.js accents

Layout:
```
+---------------------------------------------------------------+
|                                                                |
|    [SVG circle]          THE SHORT VERSION          [SVG dot]  |
|        orbiting                                      pattern   |
|                                                                |
|    [wireframe       WE BUILD WEBSITES,        [wireframe      |
|     tetrahedron]    SOFTWARE & AI             torus,          |
|     floating,       AUTOMATIONS FOR           floating,       |
|     rotating]       BUSINESSES THAT           rotating]       |
|                     HATE BORING.                               |
|                                                                |
|    [angular lines]                          [dots cluster]    |
|                                                                |
+---------------------------------------------------------------+
```

- Geometry: SVG animated elements (circles, dots, angular lines) flanking the text, moving on different timing loops (CSS keyframes)
- Optional: Two small Three.js wireframe shapes (tetrahedron left, torus right), gently rotating
- Parallax: geometry at 0.3x scroll speed, text at 1x — depth effect as you scroll through
- Padding: 120px top/bottom (statement section — more breathing room)

### 3. Services (full-width + visual panels)

**Change:** Remove `wrap` constraint — full bleed section
**Add:** Giant background numbers, visual panels on expand

Layout (collapsed):
```
+---------------------------------------------------------------+
|  What we do                                          001 - 003 |
+=====+=========================================================+
| 001 |  WEB DEVELOPMENT                                    ->  |
+-----+---------------------------------------------------------+
| 002 |  CUSTOM SOFTWARE                                     ->  |
+-----+---------------------------------------------------------+
| 003 |  AI AUTOMATION                                       ->  |
+-----+---------------------------------------------------------+
```

Giant "001" / "002" / "003" in outlined Anton (~300px) positioned behind rows, parallax at 0.2x scroll speed.

Layout (expanded, e.g., row 001):
```
+---------------------------------------------------------------+
| 001 |  WEB DEVELOPMENT                                    v   |
+-----+---------------------------------------------------------+
|                                                                |
|  Strategy, design, build,      |  +---[screenshot]---+        |
|  launch -- end to end...       |  | placeholder      |        |
|                                |  | hard-shadow frame|        |
|  * Marketing sites             |  +------------------+        |
|  * E-commerce                  |       [geometric accent]     |
|  * CMS builds                  |                               |
|  * SEO + GEO foundations       |                               |
|                                |                               |
|  Learn more ->                 |                               |
|                                                                |
+---------------------------------------------------------------+
```

- Left 55%: description, deliverables, learn-more link
- Right 45%: placeholder screenshot in a `3px solid var(--ink)` frame with `5px 5px 0 var(--ink)` shadow, plus small animated geometric accent
- Entry: rows slide-up with 0.1s stagger
- Row hover (collapsed): title slides right ~8px, arrow rotates 45deg
- Background numbers: absolute positioned, z-index behind content, parallax

### 4. Ticker

**Keep as-is.** Already full-bleed and kinetic.
Minor: add slight vertical parallax offset (`data-parallax="0.9"`) so it "floats" relative to neighbors — subtle depth cue.

### 5. Process (staggered wave + parallax numbers)

Layout:
```
+---------------------------------------------------------------+
|  How it runs -- no mystery                                     |
|                                                                |
|  +--------+            +--------+                              |
|  |   01   |  +--------+|   03   |  +--------+                 |
|  |        |  |   02   ||        |  |   04   |                 |
|  |Diagnose|  |        ||  Build |  |        |                 |
|  | body   |  | Scope  ||  body  |  |  Run   |                 |
|  |        |  | body   ||        |  |  body  |                 |
|  +--------+  |        |+--------+  |        |                 |
|              +--------+            +--------+                 |
+---------------------------------------------------------------+
```

- Staggered heights: odd columns (01, 03) start 40px higher than even columns (02, 04) — wave pattern
- Ghost numbers: "01"–"04" rendered at ~200px behind each column, outlined Anton, `data-parallax="0.4"`
- Entry: slide-up with 0.15s stagger left-to-right
- Hover: number fills `--hot` + scale(1.05) on the number element
- Padding: 80px (tighter — process is dense information)

### 6. Shout (centered, maximum impact)

**Keep:** Centered layout on ink background, strike-through reveal
**Add:** RotateX heading, enhanced strike, floating wireframe geometry

Layout:
```
+---------------------------------------------------------------+
|  [ink background]                                              |
|                                                                |
|       [wireframe shape,             [wireframe shape,          |
|        drifting slowly]              drifting slowly]          |
|                                                                |
|              AGENCIES SELL HOURS.                               |
|              WE SELL OUTCOMES.                                  |
|                                                                |
|              body text...                                      |
|                                                                |
|       [wireframe shape]                                        |
+---------------------------------------------------------------+
```

- Heading: `data-animate="rotate-x"` — starts at rotateX(90deg), rotates into view. Most dramatic reveal on the page.
- "HOURS" strike-through: enhanced — wider line (4px), snappier timing (0.4s), brief `--hot` color flash on the line
- "OUTCOMES" word: scale burst on reveal (scale 0.75 -> 1.15 -> 1.0, 0.5s)
- Animated geometry: 2–3 wireframe SVG shapes (or lightweight Three.js) drifting slowly around text, `--soft-dark` color, low opacity. Creates texture on the dark background.
- Padding: 120px (statement section — dramatic pause)

### 7. Case Studies (magazine layout)

Layout:
```
+---------------------------------------------------------------+
|  Selected work                             All projects ->     |
|                                                                |
|  +--[FEATURED CARD]--------------------+  +--[CARD 2]------+  |
|  | [placeholder image]                 |  |                 |  |
|  |                                     |  | (offset 30px    |  |
|  | Real Estate                         |  |  down)          |  |
|  | AASKRA REALTY                        |  |                 |  |
|  | outcome text...                     |  | [placeholder]   |  |
|  |                                     |  | FinTech         |  |
|  | [Next.js] [React] [Supabase]        |  | ETF             |  |
|  | View project ->                     |  | outcome...      |  |
|  +-------------------------------------+  |                 |  |
|                                           | [tags]          |  |
|                                           | View project -> |  |
|                                           +-----------------+  |
+---------------------------------------------------------------+
```

- First card: 58% width (large, featured feel)
- Second card: 38% width, offset down 30px (asymmetric, creates visual interest)
- 4% gap between
- Placeholder images: aspect-ratio 16/9, `background: var(--ink)` with centered "screenshot" label (replaced with real images later)
- Entry: `data-animate="scale"` with stagger
- Hover: translate(-6px, -6px), shadow grows to `8px 8px 0 var(--ink)`, placeholder image shifts slightly (translateY -4px)
- Tech tags: positioned to slightly overlap the card bottom edge (negative margin-bottom, relative positioning)

### 8. CTA (split layout)

Layout:
```
+---------------------------------------------------------------+
|  Got a bottleneck? Bring it.                                   |
|                                                                |
|  START THE               +---[Email]---------+                 |
|  CONVERSATION.           | Info@techwise...   |                |
|                          +--------------------+                |
|  [slide-in from left]    +---[WhatsApp]------+                 |
|                          | Chat with us       |                |
|                          +--------------------+                |
|                          +---[Book a call]---+                 |
|  [geometric accent       | 20-min intro       |                |
|   in the gap]            +--------------------+                |
|                                                                |
|                          [slide-in from right, staggered]     |
+---------------------------------------------------------------+
```

- Left 55%: Giant Anton heading, `data-animate="slide-left"`
- Right 40%: Channel cards stacked, `data-animate="slide-right"` with `data-stagger="0.1"`
- 5% gap with geometric accent (angular SVG line composition)
- Channel card hover: background fills `--hot`, text color inverts to `--bone`, border remains `--ink`
- Padding: 96px (standard)

---

## Inter-Section Flow

### Remove Uniform Borders
- Remove `border-top` from: Manifesto, Process, Shout, CTA
- Keep `border-top` on: Services rows (horizontal rules serve the accordion), Case Studies (structural)
- Result: sections flow into each other more naturally

### Background Transitions
- Hero (bone) -> Manifesto (bone) — seamless, no border
- Manifesto (bone) -> Services (bone) — seamless
- Services (bone) -> Ticker (hot) — sharp color break (intentional, already works)
- Ticker (hot) -> Process (bone) — sharp color break (intentional)
- Process (bone) -> Shout (ink) — seamless transition: Process bottom fades into ink via a 60px overlap zone where Shout's dark bg extends upward behind Process's bottom
- Shout (ink) -> Case Studies (bone) — sharp break back to light
- Case Studies (bone) -> CTA (bone) — seamless, no border

### Overlapping Elements
- Manifesto geometry peeks slightly below its section boundary into Services top
- Process ghost numbers extend slightly above the section into Ticker bottom area
- Shout floating geometry drifts past section boundaries

### Varied Vertical Padding
| Section | Current | New |
|---|---|---|
| Hero | 90px top, 70px bottom | unchanged (100vh) |
| Manifesto | 110px | 120px (statement) |
| Services | 96px | 72px top, 48px bottom (dense) |
| Ticker | auto | unchanged |
| Process | 96px | 80px (dense information) |
| Shout | 96px (assumed) | 120px (dramatic pause) |
| Case Studies | 96px | 96px (keep) |
| CTA | 96px | 96px (keep) |

---

## New Dependencies

```json
{
  "three": "^0.170.0",
  "@react-three/fiber": "^9.0.0",
  "@react-three/drei": "^10.0.0"
}
```

---

## File Changes Summary

### New Files
- `src/components/ui/ScrollAnimator.tsx` — GSAP ScrollTrigger orchestrator (replaces RevealObserver)
- `src/components/ui/ParallaxLayer.tsx` — parallax wrapper component
- `src/components/ui/SplitText.tsx` — character-by-character animation component
- `src/components/three/WireframeScene.tsx` — reusable Three.js wireframe shape component
- `src/components/three/HeroScene.tsx` — hero-specific Three.js scene (icosahedron)
- `src/components/three/FloatingShapes.tsx` — decorative drifting wireframe shapes
- `src/components/ui/GeometricAccents.tsx` — SVG animated geometric elements
- `src/components/ui/PlaceholderImage.tsx` — styled placeholder for future screenshots

### Modified Files
- `src/app/page.tsx` — swap RevealObserver for ScrollAnimator, update section flow
- `src/components/Hero/index.tsx` — Three.js scene, screenshot, entry animations
- `src/components/Hero/Hero.module.css` — layout for screenshot, remove FluidParticles styles
- `src/components/Manifesto/index.tsx` — add geometry, parallax attributes
- `src/components/Manifesto/Manifesto.module.css` — geometry positioning
- `src/components/ServicesSection/index.tsx` — full-width, visual panels, bg numbers
- `src/components/ServicesSection/ServicesSection.module.css` — full-bleed, split layout
- `src/components/ProcessSection/index.tsx` — staggered wave, parallax numbers
- `src/components/ProcessSection/ProcessSection.module.css` — wave offset, ghost numbers
- `src/components/ShoutSection/index.tsx` — rotateX, geometry, enhanced animations
- `src/components/ShoutSection/ShoutSection.module.css` — geometry positioning, animation updates
- `src/components/CaseStudySection/index.tsx` — magazine layout, placeholder images
- `src/components/CaseStudySection/CaseStudySection.module.css` — asymmetric grid, overlap
- `src/components/CTASection/index.tsx` — split layout, geometric accent
- `src/components/CTASection/CTASection.module.css` — split grid, channel hover

### Removed
- `src/components/Hero/FluidParticles.tsx` — replaced by Three.js HeroScene
- `src/components/Hero/FluidParticles.module.css` — no longer needed
- `src/components/ui/RevealObserver.tsx` — replaced by ScrollAnimator (keep VelocitySkewObserver)

---

## Reduced Motion Fallback

All new features respect `prefers-reduced-motion: reduce`:
- All `data-animate` elements: instantly visible, no transforms
- All `data-parallax` elements: standard scroll (parallax disabled)
- Three.js scenes: replaced with static SVG wireframe silhouette (same shape, no animation)
- Split-text: all characters visible immediately
- Scroll-progress elements: show final state
- Existing behaviors preserved: static marquees, fully-lit manifesto

---

## Success Criteria

1. Page feels visually dense — no large empty areas between content
2. Scroll through the page is a continuous visual experience, not isolated boxes
3. At least 3 sections use asymmetric layouts (Services, Case Studies, CTA)
4. Three.js hero scene runs at 60fps on mid-range devices
5. All animations stagger and cascade — nothing pops in as a flat block
6. Lighthouse: perf >= 90, a11y = 100, SEO = 100, best-practices = 100
7. `npm run lint` passes with zero errors
8. `npm run build` passes
9. Reduced-motion fallback is complete and usable
