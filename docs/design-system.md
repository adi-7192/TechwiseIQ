# Techwise IQ Design System — "Immersive"

Source of truth for the production build (branch `redesign/immersive-system`, migration complete through Phase 9 — see `techwise-iq-build-handoff/TASKS.md`). This replaces the retired "Kinetic" system (Anton uppercase, bone/ink/hot brutalist). All Kinetic UI was **deleted on 2026-10-04** (D-028; archived at git tag `archive/old-design-2026-10-04`). `ui/Button` remains only because `src/app/error.tsx` uses it.

Design thesis (`techwise-iq-build-handoff/docs/03_DESIGN_SYSTEM.md`): Techwise IQ should feel like an **operating environment for better systems** — dark technical atmosphere, unusually large typography, crisp interface artifacts, sparse chapter openings, dense capability matrices, controlled color shifts, spatial depth. It must **not** read as cyberpunk, gaming, generic SaaS, "AI neon," or a corporate consultancy deck.

## 1. Color tokens

All tokens live in `src/app/globals.css` (`:root` + Tailwind `@theme`), prefixed `--tw-*` for the immersive layer:

```css
--tw-bg:      #060706;  /* page background — near-black graphite */
--tw-surface: #101310;  /* raised panels, proof frames */
--tw-fg:      #F2F4EF;  /* primary foreground */
--tw-muted:   #8A918C;  /* secondary / meta text (AA on --tw-bg) */
--tw-line:    #252925;  /* 1px technical rules */
--tw-line-soft: rgb(242 244 239 / 0.10); /* hairline on floating artifacts */

/* Signal accents — one dominates per viewport, never all at once */
--tw-acid:    #C8FF54;  /* Techwise / web / advisory */
--tw-violet:  #695CFF;  /* automation */
--tw-orange:  #FF6540;  /* apps */
--tw-blue:    #70A8FF;  /* developer / build */

/* Light proof surfaces (product-demo interiors, not page background) */
--tw-paper:   #F3F3ED;
--tw-ink:     #101110;

--tw-accent:  var(--tw-acid);  /* set per-scene via inline style on ImmersiveShell */
```

Usage rules:
- Exactly one signal accent active per viewport (`--tw-accent`, set by `ImmersiveShell`'s `scene` prop and read by proof objects, buttons, focus rings). Never mix acid + violet + orange + blue in one screen.
- `--tw-paper`/`--tw-ink` are for proof-object interiors only (a demo "product surface" floating inside the dark world) — never the page background.
- Text pairs that pass contrast: `--tw-fg` on `--tw-bg`/`--tw-surface`, `--tw-muted` on `--tw-bg` (AA verified). Never small text at low contrast against the atmosphere/grain layer.

## 2. Typography

*Revised 2026-10-10 (D-045, owner-approved): Inter Tight replaces Manrope (display) and Archivo (body) site-wide.*

| Role | Font | Variable | Usage |
|---|---|---|---|
| Display + body | **Inter Tight** (variable, wght 100–900) | `--font-display` | Hero, chapter titles, statements, headings, paragraphs, buttons, matrix copy, mock-UI text |
| Labels/mono | **Space Mono** | `--font-mono` | Section eyebrows (`SectionLabel`), count labels, "Illustrative" tags, meta |

Loaded via `next/font/google` in `layout.tsx` (`Inter_Tight, Space_Mono`). Inter Tight is loaded as the variable font (no `weight` list) with `variable: '--font-display'`, `display: 'swap'`. **Manrope, Archivo and Anton are retired** — `--font-archivo` and `--font-anton` are removed from `globals.css`; every former `var(--font-archivo)` reads `var(--font-display)`. Do not reintroduce them.

Plain **Inter** stays banned (`anti-slop-checklist.md`): Inter Tight is the owner's specific choice for the reference look, not a default grotesk. Never write a family name in a `font-family` declaration — always `var(--font-display)` / `var(--font-mono)`. The `design-guard` hook greps `font-family…Inter` and will block a literal (that includes a comment on the same line).

Setting — "the reference way":
- **Display:** weight 400–680 (680 for a primary line, 400 for ghost lines and the one-word chapter titles), tracking −0.065em to −0.075em, line-height 0.78–0.9.
- **Ghost line:** the second line of a two-line display heading in `--tw-muted` at weight 400. It stages emphasis without a second accent colour (hero, intro, closing CTA, section titles).
- **Thesis (sub-display):** weight ~450, tracking −0.045em, line-height ~1.03.
- **Card / matrix titles:** weight 650, tracking −0.01em, line-height 1.2.
- **Body:** weight 400 (`<strong>` 600, `--tw-fg`), tracking 0, line-height 1.5–1.65.

Type scale (`globals.css`):

```
display:          clamp(4.25rem, 10.6vw, 10.3125rem)   Home hero h1 (>768px)
display-compact:  clamp(2.5rem, 13.5vw, 6.5rem)        Home hero h1 (≤768px), keeps two lines at 320px
hero:             clamp(4.25rem, 10.5vw, 10.25rem)
chapter:          clamp(4rem, 8.7vw, 8.5rem)           one-word chapter titles (>1024px), footer CTA
word:             clamp(2.75rem, 17vw, 8.5rem)         one-word chapter titles (≤1024px, stacked)
intro:            clamp(2.5rem, 7.8vw, 7.1875rem)      Home intro statement
statement:        clamp(3rem, 6vw, 6rem)
h2:               clamp(2.2rem, 4vw, 4.5rem)
thesis:           clamp(1.5rem, 3vw, 2.875rem)         chapter thesis h3
body-lg:          clamp(1.125rem, 0.6rem + 1vw, 1.375rem)
body:             clamp(0.95rem, 0.9rem + 0.3vw, 1.0625rem)
meta:             clamp(0.625rem, 0.55rem + 0.35vw, 0.75rem)
```

`DisplayHeading` primitive weights/tracking under Inter Tight: hero and chapter 680 / −0.07em and −0.065em; statement and h2 600 / −0.05em and −0.04em.

Size is decoupled from semantic element via `DisplayHeading` (`variant="hero" | "chapter" | "statement" | "h2"`, `as` prop for the actual tag) or a `--tw-type-*` token — never invent a new clamp stop inline. Mock-UI text inside illustrations is the one exception: it uses local container-relative sizes (see "Home reference composition").

## 3. Structure, borders, radius

- Borders: **1px** technical rules, `var(--tw-line)` (`#252925`) on solid surfaces, `var(--tw-line-soft)` (10% white) on floating artifacts. No 3px Kinetic borders.
- Radius is **not** zero everywhere — it's a controlled three-step scale:
  - `--tw-radius-proof: 22px` — large proof objects (the demo "product" surfaces)
  - `--tw-radius-artifact: 10px` — floating artifacts, small cards
  - `--tw-radius-control: 999px` — buttons/pills (`PrimaryCTA`)
  - Everything else (section wrappers, text blocks, technical rules) stays square. Don't make every content block a rounded rectangle — radius signals "this is an interface," not decoration.
- Container: `--tw-max: 1520px`, page padding `--tw-page-pad: clamp(18px, 4vw, 64px)`.
- Grid: 12-column conceptual grid; chapter openers are often a 6/6 split; dense capability grids are 3-col desktop / 1-col mobile.
- Section rhythm (`Section` primitive, `density` prop): `sparse` (hero, chapter title, final CTA) vs `dense` (feature matrices, proof metadata, work lists) vs `flush`. **Never stack many medium-density sections in a row.**

## 4. Components (matches `src/components/`)

**Global shell:**
- `global/SiteHeader` — compact mono nav, hide-on-scroll, solid technical surface when scrolled (no glass/blur), skip-link, focus trap.
- `global/SiteFooter` — all contact/legal links preserved, dark restyle. `journey` variant (Home only) is the closing CTA: transparent over the skyline finale, centred "Let’s build" / ghost "what’s next." (D-045).
- `global/MobileNav` — full-screen overlay, focus trap + return, Esc, scroll-lock.

**Immersive primitives (`immersive/primitives`):**
- `Section` — sparse/dense/flush rhythm, content rail, optional `bleed`/`ruled`, `data-scene` marker for the scene observer.
- `SectionLabel` — mono eyebrow label.
- `DisplayHeading` — hero/chapter/statement/h2, element decoupled from size.
- `ImmersiveShell` — establishes `.tw-world` (dark atmosphere + `--tw-accent` per `scene` prop) and mounts `SmoothScroll`. Wrap any route that should feel like part of the world. It no longer mounts WebGL: `scene` selects the CSS accent only, and there is no `withScene` prop.

**Scene (`immersive/HeroScene`, `lib/scene/engine.ts`):** one session-singleton Three.js renderer (vanilla Three, not React Three Fiber), mounted **behind the whole Home page** in one fixed layer — see "Hero skyline" and "Home journey" below (D-038, D-039). Every other route and chapter runs on the CSS radial atmosphere in `globals.css`, which was always the designed fallback. `data-scene` markers on `Section`/`ImmersiveShell` still publish the chapter accent for CSS; nothing reads them for WebGL any more.

**Proof objects and illustrations:** DOM/CSS/inline-SVG demonstrations, never screenshots of fake products. The old `components/proof/` set (`ProofFrame`, `WebsiteProof`, …) is deleted. Current: `immersive/home/ServiceDemo` (finite interactive demos, used on `/services/*` only) and the Home illustrations (`immersive/home/Illustrations.tsx`, D-045: hero orbit cards, chapter feature cards, artifacts). Every mock that shows text or data carries a visible Space Mono "Illustrative" tag; mock strings come only from `src/data/services.ts`. All state is deterministic sample data — never a fake live metric.

**Homepage (`immersive/home/`, D-045):**
- `HomeHero` — centred real `<h1>` ("Technology that" / ghost "moves the work."), lead, two pill CTAs, five decorative tilted orbit cards (`aria-hidden`, no focusables).
- `ServiceStories` — intro statement (count label / giant h2 with ghost line / muted aside) and three service chapters. Chapter anatomy: count label → giant one-word title with accent dot → thesis set right → illustrated feature card (`--tw-radius-proof`) with 2–4 tilted artifacts (`--tw-radius-artifact`) at differing parallax rates → hairline-ruled 3-col capability grid from `SERVICES[id].capabilities`.
- `SelectedWork` (real case studies only, asymmetric grid), `OperatingModel` (hairline grid), `HomeMotion` (GSAP client boundary — see §5), `CursorGlow`, `IntroPreloader`.
- Pill chapter nav — light pill fixed bottom-centre, `<nav aria-label="Page chapters">`, Intro / Websites / Software / Automation / Work, hidden ≤768px. Markup in `home/index.tsx`, active state set by `HomeMotion`.
- Retired and deleted: `Chapter`, `ChapterNav`, `FinalCta`, `ChapterArtifacts`.

**Buttons (`ui/PrimaryCTA`):** pill control (`--tw-radius-control`). `primary` = light bg / dark text, `secondary` = dark translucent + technical border, `ghost` = inline text link. Polymorphic: `Link` for internal routes, plain `<a>` for external (mailto/wa.me/http) with `external` + `rel`, or `<button>`. No gradients, ever.

## 5. Motion

Four primitives only (`techwise-iq-build-handoff/docs/04_MOTION_AND_3D_SPEC.md`) — motion exists to make the site feel like **one continuous technical world**, not an effects checklist:

1. **Ambient persistence** — the WebGL scene lives across the whole page, moves slowly, never demands attention.
2. **Chapter transition** — scene color/density/form interpolates gradually as a chapter enters; title + proof object enter with restrained depth.
3. **Proof-object depth** — the central proof object moves slightly relative to scroll; supporting artifacts move at a different depth ratio (parallax, not sway).
4. **Reveal** — text/dense content use consistent vertical or clip reveals.

Architecture: **GSAP is the sole DOM animation library** (`gsap` + `@gsap/react`) — no Framer Motion. **Lenis** (`lenis`) drives smooth scroll via `immersive/SmoothScroll.tsx`, feeding scene state (`feedScene` prop on `ImmersiveShell`). Do not add a second scroll or animation library without updating this doc and getting sign-off — that's a vocabulary expansion.

GSAP 3.12+ folds an element's computed CSS `rotate`/`scale`/`translate` into its own transform the first time it touches it; any cleanup on a switch to reduced motion must strip those inline values too, or the CSS rest pose never comes back.

Timing:
```
micro:     160–240ms
component: 400–650ms
chapter:   700–1100ms
ambient:   8–30s loops
easing:    cubic-bezier(.16, 1, .3, 1)
```

Reduced motion (`prefers-reduced-motion: reduce`): no smooth scroll (Lenis disabled), no parallax, scene freezes to a single static frame (no RAF loop), no infinite artifact drift, content appears directly or with minimal fade. This is implemented at the token/CSS layer (`.tw-world` reduced-motion block in `globals.css`) and in the scene engine (renders one static frame, no loop) — verify both, don't assume one covers the other.

Performance budget: one WebGL renderer (session singleton, guarded against duplicates on Fast Refresh/navigation), DPR capped `min(devicePixelRatio, 1.5)` desktop / `1` on constrained mobile, signal count capped (4 mobile / 8 desktop; reusable buffers of 32 / 100 points), target 60fps desktop / 30–60fps mobile, never block scrolling, no bloom/post-processing in v1. WebGL failure must fall back to the CSS radial atmosphere + grain — the site must never render blank.

## 6. Accessibility

- DOM carries all meaningful content, navigation, interaction, and accessibility — the scene canvas is `aria-hidden`, `pointer-events: none`, purely decorative.
- Real `<h1>` lives in `HomeHero`, not in decorative chapter titles alone.
- Chapter nav: native hash anchors, keyboard operable, visible focus (acid focus ring, scoped inside `.tw-world`), scroll-synced `aria-current`.
- Approved exception (13.1, D-045): the Home pill chapter nav sits on `--tw-paper`, where the acid ring is invisible, so its links use a 2px `--tw-ink` focus ring instead (`.pillNav a:focus-visible` in `home/studio.module.css`).
- Skip link precedes all other focusable elements (including the global WhatsApp control — this was a real bug, fixed in Phase 9; don't regress it).
- Touch targets ≥44px. Mobile sheds 30–60% of floating artifacts and shrinks spatial depth — verify by reading the actual breakpoint CSS, not assuming.
- Proof objects are labelled figures (`ProofFrame`'s `aria-label`) with an honest "Illustrative" tag — never presented as real live data.
- Contrast: `--tw-fg`/`--tw-muted` on `--tw-bg` verified AA; grain/atmosphere layer must never sit at meaningful opacity over small text (`0.06–0.12` cap).

## 7. Don'ts (anti-slop)

Full checklist: `docs/anti-slop-checklist.md`. System-specific don'ts from the design brief:
No hosted third-party 3D scenes (Spline and friends) — a second WebGL runtime, an asset we do not own, and a bundle we cannot budget for. No generic glass cards everywhere. No neon purple+blue gradient as a default "AI" identity. No meaningless KPI dashboards. No random particle explosions. No 3D spheres behind every heading. No tiny low-contrast copy. No endless logo/testimonial blocks without evidence. No rounded-card overload — radius is reserved for proof objects, floating artifacts, and CTAs (§3). No second scroll/animation library. No fabricated metrics in proof objects — sample data must read as sample data.

## Checkered backdrop — 2026-10-09 (D-043)

Inner routes (never Home) opt in with `<ImmersiveShell backdrop="checker">`. The shell renders
`.tw-backdrop` (fixed, `z-index: -1`, between the scene glow and the grain) and mounts `DepthMotion`.

- **Look.** Checker squares of `--tw-checker` (48px; 32px ≤768px), drawn as an SVG mask over
  `color-mix(in oklab, var(--tw-acid) 7%, var(--tw-bg))`. The outer layer fades the pattern toward the
  edges with one radial mask — the second sanctioned `scene-glow-ok` gradient. No new colour token.
  Muted text over the brightest square stays above AA.
- **Float.** `DepthMotion` drifts the pattern at 0.3× page scroll (0.15× on phones), wrapping one tile
  so the layer stays one viewport tall. Opaque proof panels tagged `data-depth="<px>"` drift ±px across
  their pass through the viewport (§5 proof-object depth), via the standalone `translate` property so
  hover `transform`s still compose. Copy is never tagged.
- **Contract.** Rides the Lenis → ScrollTrigger feed (no scroll listener of its own), no per-frame
  layout reads, compositor-only writes. Phones: no panel drift. Reduced motion: still pattern, no drift.


## Homepage refinement — 2026-09-05

Approved direction: hero → compact service introduction → Websites → Custom Software → AI Automation & Advisory → Selected Work → working relationship → contact. Client evidence deliberately follows the three services.

- `home/studio.module.css` composes the homepage with existing type stops: chapter-scale h1 on large desktops, hero scale on phones, h2 for service headings. Manrope display, Archivo copy, Space Mono metadata; the headline accent is acid. Service scene accents remain local.
- `HomeHero` is an interface composition with a protected text column, visible project/work links, and stacked illustrative website/software/workflow panels. Phone layouts place the interface composition below the text and actions.
- `ServiceStories` replaces the five homepage chapter instances and capability matrices. Legacy Chapter/ChapterNav/proof components remain on disk; they are not mounted on the homepage.
- `ServiceDemo` adds finite four-stage demonstrations, built as accessible DOM/CSS with a GSAP timeline. They start in view, pause offscreen or in a hidden tab, and allow replay, pause and manual stepping. Software's manual path includes approving a sample request. Reduced motion renders the finished example and permits manual steps without animation. Without JavaScript, the completed example remains visible and controls stay hidden.
- The WebGL knot and particle field are replaced with five connected interface outlines. Matching vertices interpolate between browser, software-module and branching-workflow layouts. Small signals travel along the connections. Keep this geometry quiet behind the foreground interfaces. The session singleton, CSS fallback, DPR caps and mobile frame cap remain.
- Lenis duration is 0.85s, driven by the GSAP ticker; native mobile touch remains. Scene loading is dynamic so text-only routes do not fetch Three.js through the scroll controller. Scene, homepage reveals and demos react to live reduced-motion changes.
- The persistent WhatsApp action now uses the immersive surface, border and pill tokens. The bottom chapter dock is removed from the homepage.

## Motion and footer revision — 2026-09-05

The user's follow-up supersedes the restrained hero and finite-demo direction above:

- Hero: centred chapter-scale display typography, clipped line entrances, floating interface fragments and a visible kinetic WebGL core. `HeroStage.module.css` owns the hero; the service layouts continue to use `studio.module.css`. Supporting copy and both hero actions stay readable and clear of the artifacts.
- Scene: woven geometry and three orbit paths return behind the hero, alongside the service-specific interface panels. Ambient dust is capped at 480 desktop / 160 mobile, in addition to the 8 / 4 travelling connection signals. Initial mobile geometry uses fewer segments. The same renderer, DPR caps, reduced-motion behaviour and offscreen-tab pause remain.
- Demonstrations: GSAP timelines now loop while visible. Four overlapping beats assemble interface elements, adapt a website to mobile, move a cursor toward a CTA, assemble an operational app, reveal checks and approval, and move signals through an AI workflow. Each cycle holds its conclusion and fades before rebuilding. Pause remains available throughout the loop. Manual stepping and reduced-motion/no-JavaScript conclusions remain supported.
- First-visit introduction: `IntroPreloader` uses “Think. Build. Move.” and Web/Software/AI modules, followed by a curtain exit into the hero animation. Once per tab, approximately 1.85 seconds, no fabricated load percentages. Reduced motion, anchor arrivals and unavailable storage bypass it. Keyboard, wheel or pointer input dismisses it. A JS timeout and CSS fail-open ensure it cannot permanently cover content.
- Footer: a large linked project invitation, email, contact/navigation/service links, oversized wordmark and legal row. The homepage's separate final CTA is removed to avoid repeating the invitation. The global footer follows the same type, colour, radius and spacing vocabulary.

## Scene revision — 2026-09-05 (Adi-approved)

Supersedes the "woven geometry and three orbit paths" scene above. The generative
core was a stock 3D form behind copy, which `anti-slop-checklist.md` forbids
outright, and it rendered through body text on the services intro, Custom
Software and Operating Model sections.

- **The connected interface panels are now the only form.** `TorusKnotGeometry`,
  the three orbit rings and their materials are deleted from `lib/scene/engine.ts`.
  What remains is `createWireGeometry()`: five wireframe interface panels wired to
  a hub, whose matching vertices interpolate between a browser layout (`web`), a
  module grid (`apps`), a branching workflow (`automation`), an audit board
  (`advisory`) and stacked source panes (`developer`). Signals still travel the hub
  connections. The background is the thing we build, and it changes per chapter.
- **The composition is placed off the copy column, per chapter.** `ScenePreset`
  gains `offsetX` / `offsetY`: chapters with copy on the left push the composition
  right, `apps` (copy on the right) pushes it left. The group eases between
  placements instead of snapping.
- **Scene weight follows the sparse/dense rhythm.** `ScenePreset.wireOpacity`:
  sparse chapters that have room for it carry the composition (intro 0.45,
  advisory/developer 0.5); the dense two-column service chapters already lead with
  a foreground proof object, so the scene recedes to a texture there (0.3).
- **Phones get their own placement.** No empty column exists at 390px, so the
  composition is pushed to the lower outside corner (`composedX/Y/Scale`) at 0.78
  scale and 45% of the line opacity.
- Unchanged: one session-singleton renderer, DPR caps, mobile point/frame caps,
  reduced-motion static frame, offscreen-tab pause, and the CSS atmosphere fallback.
- `ServiceDemo` progress: the separate full-bleed cycle track is removed. The four
  stage segments are the single indicator — each fills across its own stage, so
  step position and time-within-step read from one bar instead of two abutting
  bars that looked like a rendering fault.


## Hero depth field — 2026-09-05

Supersedes the site-wide persistent scene described above and in the two 2026-09-05 sections. Approved by Adi after reviewing a hosted-Spline "galaxy hero" reference: the *idea* (depth, pointer parallax, a field that frames the headline) was kept; the implementation was rebuilt in our own engine because the reference brought a second WebGL runtime, an indigo/purple identity, blur and two overlay gradients — all banned here.

**Scope** *(superseded by "Home journey", D-039: one fixed layer behind the whole Home page)*. WebGL now exists on exactly one surface: the home hero. `HomeHero` mounts `SceneLoader` → `HeroScene`, which attaches the singleton canvas into a hero-local `.scene` layer (`position: absolute`, not `fixed`). `lib/scene/presets.ts`, `immersive/PersistentScene` and the chapter `IntersectionObserver` that drove per-chapter interpolation are deleted.

**Composition.** A receding lattice of ~150 clustered nodes (one anchor plus five satellites, two links back to the anchor), generated deterministically from a `sin`-hash so the frame is identical across hydration and reloads. It reads as connected systems seen in depth, not as decorative stardust — the distinction `anti-slop-checklist.md` draws. Muted graphite-green `0x8fb39a` at rest, acid `0xc8ff54` on a sparse minority of anchors, link lines at `0x4c7360` / 0.18 opacity. Normal blending only, no additive glow.

**Legibility without a gradient.** The centre "well" that keeps the `h1` clear of bright points is baked into the **vertex colours** — near-centre nodes are shaded down at build time — so no CSS overlay gradient is needed and the gradient ban holds. The hero `h1` also carries the same `--tw-bg` text-shadow backing the body copy already had.

**Motion.** Slow ambient breathing (z-rotation and z-drift on sine), pointer parallax through the field, and a scroll-linked exit: the camera pushes into the corridor and the field fades to ~5% as the hero leaves. Hero exit progress is read off the container rect **inside the already-scheduled render loop** — deliberately not a scroll listener, so Lenis remains the one scroll driver. `SmoothScroll` no longer feeds the engine and has no `feedScene` prop.

**Budget** *(historical — the field was replaced by the skyline)*. Field construction is allocation-free (no per-node `THREE.Color`) and deferred to `requestIdleCallback`, so it never lands on the hydration critical path. 900 nodes desktop / 300 mobile; DPR capped at 1.5 (1 on mobile); 30fps cap on mobile. The render loop is gated by an `IntersectionObserver` on the hero container — scrolling past the hero stops GPU work entirely, and leaving the route detaches the canvas. Reduced motion renders a single static frame with no RAF loop. Three.js is code-split behind the home route: no other route downloads it.

**First paint — 2026-09-06.** The hero includes an inline SVG image of the field in its server-rendered HTML, with the same shared deterministic geometry, perspective, colours and desktop/mobile densities as WebGL (`lib/scene/field.ts`). It needs no JavaScript or separate image request. The deferred renderer prepares its shaders and replaces that image only after painting its first frame, without the previous 900ms opacity entrance. If JavaScript or WebGL is unavailable, the static field stays visible. Existing hero styling and live effects remain unchanged.

## Hero skyline — 2026-10-06 (Adi-approved, D-038)

Supersedes the composition, legibility and first-paint parts of "Hero depth field" above; its scope
(Lenis as the one scroll driver) still holds; the hero-only scope was widened to the whole Home page by "Home journey" (D-039).
Chosen by the owner from three prototypes (`proto/hero-variations`, variant B).

**Composition.** A city of instanced towers on a faint ground grid (`lib/scene/city.ts`, deterministic
`sin`-hash, so every load is identical): low-rise noise everywhere, a dense downtown right of centre on
landscape screens (it frames the left-aligned `h1`; nearer the middle on portrait) and exactly one
needle tower. Graphite towers (`0x1b221d`, standard material), hemisphere + rim + "moonlight"
directional lights, one acid point light, fog into `--tw-bg`. A sparse set of rooftops carries a
blinking acid beacon (emissive top face). ACES tone mapping. No bloom, no additive glow.

**Motion.** Towers rise from the centre out (delay by distance, 0.9s each, held while the intro
overlay is up). The acid light follows the pointer's hit on the ground (it wanders on its own on
touch devices) and towers near it stretch slightly toward it; heights breathe very slowly. As the
hero scrolls away the camera climbs to an overhead map view and the canvas trails the hero at ~55%
scroll speed, so the climb stays on screen (parallax, not a pin). Exit progress is read from the
cached hero box inside the render loop — no scroll listener.

**Legibility without a gradient.** On landscape screens the tower fragment shader shades the
lower-left region behind the copy down to ~40% (`uWell`), the same idea as the old vertex-colour
well. The hero `h1` and body keep their `--tw-bg` text-shadow.

**Performance contract.** Every per-tower effect (rise, breathing, pull toward the light, beacons)
runs in the vertex/fragment shader; instance matrices are written once per layout (build or a
breakpoint change), never per frame, so the CPU only updates a few uniforms, the light and the
camera. One instanced draw for the city, one for the grid. 2,560 towers desktop / 1,120 mobile
(`data-tower-count`), DPR ≤1.5 desktop / 1 mobile, MSAA on desktop only, 30fps cap on mobile,
`powerPreference: 'default'`. Loop gated by render-on-demand (see "Home journey") and by tab
visibility; idle-deferred setup and `compileAsync` keep it off hydration; reduced motion renders one
still frame (city standing, no loop); returning to Home shows the city already standing.
Measured 2026-10-06 (production build): Lighthouse mobile Home perf 92/95/93, LCP 2.9–3.2 s, TBT
0–90 ms, a11y/BP/SEO 100; page scripts ~2% of the main thread on desktop while animating.

**First paint.** The inline SVG poster is removed (it was most of the Home HTML). The canvas appears
on its first drawn frame with the towers at ground level, and the rise is the entrance. Without
JavaScript or WebGL the hero shows the CSS atmosphere from `globals.css`.

## Home journey — 2026-10-06 (Adi-approved, D-039)

Extends "Hero skyline": the same city and engine now run behind the **whole Home page**.

**Mount.** `immersive/home/index.tsx` renders one `SceneLoader` into `.sceneLayer` (fixed,
full-viewport, `z-index: 0`); Home sections sit above it (`z-index: 1`). The footer is the last stop:
`SiteFooter journey` (Home only) drops its background. No other route mounts WebGL.

**Path.** `lib/scene/journey.ts` (pure, unit-tested) holds a stop per section, matched by
`data-journey` markers: `hero` → `services` (overhead map, three districts glow faintly) →
`websites` / `apps` / `automation` (camera flies to that service's district, framed opposite its
copy; light acid / orange / violet; district rooftops glow) → `work` (high overview, low exposure) →
`model` (pull-back) → `finale` (street level facing the needle behind "Let's build what's next.").
A stop is reached when its section's top is 30% down the viewport; the camera rests for the first
35% of each segment, then eases to the next. The engine damps toward the target (frame-rate
independent), so Lenis + damping give one continuous move with no corners.

**Cursor.** The acid point light follows the pointer's hit on the ground in every view (higher and
wider over the map). `CursorGlow` adds a soft acid halo (12%, `mix-blend-mode: screen`) for fine
pointers only, hidden for reduced motion — the sanctioned `scene-glow-ok` gradient.

**Legibility.** Per-stop exposure (1 in the hero/finale, 0.38–0.65 elsewhere), a copy-side shader
well on landscape (`uWell`: side, strength, top), and on portrait or ≤768px every section after the
hero at ≤0.42 exposure with no well (copy is full-width; the finale 0.6). Footer text on Home and the
hero copy carry the `--tw-bg` text-shadow backing; the hero's secondary CTA gets a solid backing
beside the lit downtown. Proof panels and work cards keep their opaque surfaces. Checked with a
p90-background contrast sweep per stop at 1440 and 390 (2026-10-06).

**District colours.** Acid and orange are the tokens; the AI district uses `#8b80ff`, `--tw-violet`
lifted 25% toward `--tw-fg` (raw violet is too dark to read as light in the scene).

**Performance contract (adds to "Hero skyline").**
- Render on demand: continuous while the hero is on screen; below it the loop runs only while
  scrolling, pointer movement, resize or the camera settling require it, then sleeps
  (`data-animation-running`). A passive scroll listener only wakes the loop.
- Section anchors are measured on attach, resize and a debounced `ResizeObserver(body)` — never in
  the frame.
- Adaptive DPR on desktop: 1.5 → 1.25 → 1 when frames average >22 ms, back up when <12 ms.
- Lite budget on **software WebGL** (SwiftShader/llvmpipe — VMs, no GPU acceleration, CI;
  `data-render="software"`): city in the hero only (Lambert material, DPR 0.75, 30 fps, no MSAA,
  render on demand), shader compile deferred past page load, CSS atmosphere below the hero. CPU-drawn
  frames block the page, so the full journey needs a GPU. Tests force it with `window.__twSceneFull`.
- Reduced motion: one still hero frame, hidden below the hero.
- Measured 2026-10-06 (production build, GPU): scrolling the full page with the pointer moving costs
  ~4.6% main-thread script time on desktop, frames p95 9.4 ms; idle after ~4 s, then ~0.3%. Lighthouse
  mobile Home perf 91–94 (final 91/91), a11y/BP/SEO 100. Full e2e 362 pass.
- Scene time (`clock`) advances only while frames are drawn, so waking after a sleep continues
  exactly where it stopped (QA blocker, verified: 12 px change after a 15 s sleep).

## About motion — 2026-10-06 (Adi-approved, D-041)

A vocabulary expansion for **`/about` only**. Every other route keeps the four primitives in §5.
It lives in one client boundary, `AboutExperience/AboutMotion.tsx`, and one `gsap.matchMedia()`.
Spec: `docs/specs/10.1-about.md` (Visual spec, V10).

**Added motions.**
- **Scroll-lit statement words.** The 01 tagline's words are server-rendered spans (no JS split, so
  the plain sentence stays the accessible name). They start dim at opacity 0.45, which keeps ≥3:1
  for large text, and light to 1 in reading order, scrubbed as the heading crosses the viewport.
- **Pinned process sequence.** Under `(min-width: 1024px) and (min-height: 720px) and (pointer:
  fine) and (prefers-reduced-motion: no-preference)`, section 03 pins for 3 viewport heights (the
  cap; UX U3 gives each middle step ≥0.9 viewport heights of hold). It is scrubbed (`scrub: true`)
  and reversible. The four step frames crossfade (opacity + y), a progress rail fills on `scaleX`,
  and each step's check draws. It ends on frame 04 with all four steps complete. There is no snap.
  It arms only when the stage fits the viewport (runtime fit guard) and 03 is still below the
  viewport when the motion boots, so the pin spacer never shifts visible content (CLS). Everywhere
  else, the four frames stack and reveal in turn.
- **Count-ups.** The 02 live-only totals count from 0 once, on first view, in ≤1.2s. The final
  value is the accessible text (sr-only), and the changing digits are `aria-hidden` and
  `tabular-nums`.
- **Drawn route line.** The client map's route path draws once with `stroke-dashoffset`
  (`pathLength="1"`), and then the remote node fades in.
- **Drawn check marks.** The ledger checks (04), the in-frame checks and the rail checks (03) draw
  once with `stroke-dashoffset`.
- **Slight depth on covers.** Track-record cover images drift `yPercent` ±3 at a fixed `scale(1.06)`,
  scrubbed, at ≥768px. This is §5 proof-object depth applied to covers. The motion goes on a wrapper
  element, and the hover scale stays on the `img` (D-008: one system per element's `transform`).

**Constraints.**
- GSAP + ScrollTrigger only. No new package.
- Animate `transform`, `opacity` and `stroke-dashoffset`/`stroke-dasharray` only. No layout
  properties, no filter, no blur. **No `autoAlpha`/`visibility` on About** (UX U2/U3): hidden
  start states are opacity only, so content stays in the accessibility tree and focusable.
- Reveals and count-ups whose element is already on screen (or above it) when the motion boots
  show their final state immediately (scroll restoration, late hydration).
- Timed tweens use the token durations and easing (`expo.out` = `cubic-bezier(.16, 1, .3, 1)`).
  Scrubbed tweens use `ease: 'none'`.
- Reduced motion: every element is in its final state immediately (all words lit, line and checks
  drawn, totals final, all frames visible). No pin, no drift, and Lenis stays off.
- No JS: everything is visible. Pre-animation states apply only under
  `data-about-motion="pending"`, set by an inline bootstrap or the layout effect, and fail open to
  `static` after 3s (Home's `data-home-motion` pattern).
- No WebGL or canvas on About. The page runs on the CSS atmosphere, acid accent only
  (`scene="advisory"`).

## Home reference composition — 2026-10-10 (Adi-approved, D-045)

Refines "Home journey": the skyline stays as the backdrop; Home's foreground returns to the layout and
rhythm of `techwise-iq-build-handoff/reference/techwise-iq-editions-reference.html` (idea source only —
nothing pasted). Full build spec: `docs/superpowers/specs/2026-10-10-13.1-reference-home-design.md`.
Supersedes the 2026-09-05 "Homepage refinement" and "Motion and footer revision" layouts and D-038's
"floating hero cards removed".

**Hero.** Centred: mono eyebrow, `h1` "Technology that" (680) / ghost "moves the work." (400,
`--tw-muted`) at `--tw-type-display` (≤768px `--tw-type-display-compact`, two lines down to 320px),
lead, primary + secondary pills. Five decorative orbit cards (`aria-hidden`, text-free UI skeletons,
tilted ±2–7°) sit outside the copy: on screens >768px they are anchored to the copy block's outer edges,
so they can never cover the `h1`, lead or CTAs; ≤768px at most two sit in the band above the eyebrow
(none on short phones). The `h1`/lead remain the LCP element. The scroll note shows only ≤768px, where
the pill nav is hidden.

**Chapters (Websites → Software → AI).** Count label (`01 / Websites`), giant one-word title (400,
−0.072em) with an `aria-hidden` accent dot, thesis h3 + muted body set right, a large illustrated
feature card (`--tw-radius-proof`) with 2–3 tilted artifacts (`--tw-radius-artifact`), then a hairline
3-col capability grid from `SERVICES[id].capabilities`. Illustrations are DOM + small inline SVG in
tokens, every mock with text carries a visible Space Mono "Illustrative" tag, and mock strings come only
from `services.ts` (`fitSignals`, `capabilities[].title`, `process[].title`) plus "Illustrative" /
"Sample".

**Accent rule as applied (strict, default).** Each chapter's illustrations use only that chapter's
accent (web acid, software orange, AI violet) plus neutrals (`--tw-fg`, `--tw-paper`, `--tw-ink`,
`--tw-surface`, `--tw-bg`, greys). The hero orbit is acid + neutrals. *Pending owner question
OQ-13.1-A:* whether the hero orbit may show one service accent per card (acid / orange / violet). The
orbit reads its colours from one block of per-card custom properties, so the variant is a token swap;
it is not built.

**Violet and orange contrast.** Small text never sits on violet (white/ink on `--tw-violet` is
~4.1–4.4:1) or white text on orange (~2.6:1). Violet is a fill/shape colour; labels on orange are
`--tw-ink`. Text on `--tw-paper` is `--tw-ink` (muted on paper fails).

**Chapter dot.** The accent dot after each one-word title may carry a soft accent `box-shadow`
halo — the one sanctioned accent glow, scoped to that dot (from the approved reference). It is never
applied to cards, borders or buttons. *Flagged for Adi's confirmation; removing it is one declaration.*

**Elevation.** Feature cards, artifacts and orbit cards may carry a dark elevation shadow
(`box-shadow` in `rgb(0 0 0 / …)`) for depth. Dark only — never an accent-coloured glow.

**Pill nav.** Fixed bottom-centre light pill (`--tw-paper` / `--tw-ink`, active item inverted),
`<nav aria-label="Page chapters">`, hidden ≤768px, clear of the WhatsApp control; its focus ring is
`--tw-ink` because the acid ring is invisible on paper. Home's footer reserves bottom padding for it.

**Legibility.** The hero shader well becomes centred: `uWell.x = 0` now means "centre column" (the
mask blends from centre to side by `|x|`), and "no well" is `wellStrength = 0`. Chapter stops put the
well on the thesis side. Opaque illustration surfaces stop the Home text-shadow backing
(`[data-illustration]`).

**Motion mapping (no new primitives).** Orbit cards and feature-card artifacts = proof-object depth
(scroll parallax at per-card rates; pointer tilt for fine pointers, from the brief's "Websites:
pointer tilt"). Section content = reveal. Skyline = ambient persistence + chapter transition. Static
tilts use the CSS `rotate` property so GSAP transforms compose with them. Reduced motion: cards
static (tilt kept), no parallax or pointer response, content shown directly.
