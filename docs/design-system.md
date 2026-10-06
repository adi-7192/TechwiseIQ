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

| Role | Font | Variable | Usage |
|---|---|---|---|
| Display | **Manrope** (variable grotesk) | `--font-display` | Hero, chapter titles, statements, h2 |
| Body/UI | **Archivo** | `--font-archivo` | Paragraphs, buttons, capability matrix copy |
| Labels/mono | **Space Mono** | `--font-mono` | Section eyebrows (`SectionLabel`), proof-frame labels, meta |

Loaded via `next/font/google` in `layout.tsx` (`Archivo, Manrope, Space_Mono`). **Anton is retired** — removed from `layout.tsx` imports entirely; do not reintroduce it.

Type scale (`globals.css`):

```
hero:      clamp(4.25rem, 10.5vw, 10.25rem)
chapter:   clamp(4rem, 8.7vw, 8.5rem)
statement: clamp(3rem, 6vw, 6rem)
h2:        clamp(2.2rem, 4vw, 4.5rem)
body-lg:   clamp(1.125rem, 0.6rem + 1vw, 1.375rem)
body:      clamp(0.95rem, 0.9rem + 0.3vw, 1.0625rem)
meta:      clamp(0.625rem, 0.55rem + 0.35vw, 0.75rem)
```

Size is decoupled from semantic element via `DisplayHeading` (`variant="hero" | "chapter" | "statement" | "h2"`, `as` prop for the actual tag) — never invent a new clamp stop inline.

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
- `global/SiteFooter` — all contact/legal links preserved, dark restyle.
- `global/MobileNav` — full-screen overlay, focus trap + return, Esc, scroll-lock.

**Immersive primitives (`immersive/primitives`):**
- `Section` — sparse/dense/flush rhythm, content rail, optional `bleed`/`ruled`, `data-scene` marker for the scene observer.
- `SectionLabel` — mono eyebrow label.
- `DisplayHeading` — hero/chapter/statement/h2, element decoupled from size.
- `ImmersiveShell` — establishes `.tw-world` (dark atmosphere + `--tw-accent` per `scene` prop) and mounts `SmoothScroll`. Wrap any route that should feel like part of the world. It no longer mounts WebGL: `scene` selects the CSS accent only, and there is no `withScene` prop.

**Scene (`immersive/HeroScene`, `lib/scene/engine.ts`):** one session-singleton Three.js renderer (vanilla Three, not React Three Fiber), mounted **behind the home hero only** — see "Hero skyline" below (D-038). Every other route and chapter runs on the CSS radial atmosphere in `globals.css`, which was always the designed fallback. `data-scene` markers on `Section`/`ImmersiveShell` still publish the chapter accent for CSS; nothing reads them for WebGL any more.

**Proof objects (`components/proof/`):** DOM/CSS/SVG demonstrations, not screenshots. Shared `ProofFrame` (bordered surface, mono label bar, honest "Illustrative" tag, optional caption, `surface="dark"|"light"`, accent follows ambient `--tw-accent`). Concrete demos: `WebsiteProof`, `AutomationFlowDemo`, `OperationsConsoleDemo`, `OpportunityMapDemo`, `BuildProof`, dispatched via `proof/index.tsx` (`<ProofObject variant=... />`). All state is deterministic sample data — never a fake live metric.

**Homepage (`immersive/home/`):** `HomeHero` (real `<h1>`, left-aligned copy over the WebGL skyline; the floating artifacts were removed 2026-10-06), `Chapter` (reusable chapter shell: `SectionLabel` + `DisplayHeading` + `ProofObject` + capability matrix), `ChapterNav` (compact persistent nav, scroll-synced active state, native hash anchors), `SelectedWork` (real case studies only), `OperatingModel`, `FinalCta`, `ChapterArtifacts`, `HomeMotion` (GSAP client boundary — see §5).

**Buttons (`ui/PrimaryCTA`):** pill control (`--tw-radius-control`). `primary` = light bg / dark text, `secondary` = dark translucent + technical border, `ghost` = inline text link. Polymorphic: `Link` for internal routes, plain `<a>` for external (mailto/wa.me/http) with `external` + `rel`, or `<button>`. No gradients, ever.

## 5. Motion

Four primitives only (`techwise-iq-build-handoff/docs/04_MOTION_AND_3D_SPEC.md`) — motion exists to make the site feel like **one continuous technical world**, not an effects checklist:

1. **Ambient persistence** — the WebGL scene lives across the whole page, moves slowly, never demands attention.
2. **Chapter transition** — scene color/density/form interpolates gradually as a chapter enters; title + proof object enter with restrained depth.
3. **Proof-object depth** — the central proof object moves slightly relative to scroll; supporting artifacts move at a different depth ratio (parallax, not sway).
4. **Reveal** — text/dense content use consistent vertical or clip reveals.

Architecture: **GSAP is the sole DOM animation library** (`gsap` + `@gsap/react`) — no Framer Motion. **Lenis** (`lenis`) drives smooth scroll via `immersive/SmoothScroll.tsx`, feeding scene state (`feedScene` prop on `ImmersiveShell`). Do not add a second scroll or animation library without updating this doc and getting sign-off — that's a vocabulary expansion.

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
- Skip link precedes all other focusable elements (including the global WhatsApp control — this was a real bug, fixed in Phase 9; don't regress it).
- Touch targets ≥44px. Mobile sheds 30–60% of floating artifacts and shrinks spatial depth — verify by reading the actual breakpoint CSS, not assuming.
- Proof objects are labelled figures (`ProofFrame`'s `aria-label`) with an honest "Illustrative" tag — never presented as real live data.
- Contrast: `--tw-fg`/`--tw-muted` on `--tw-bg` verified AA; grain/atmosphere layer must never sit at meaningful opacity over small text (`0.06–0.12` cap).

## 7. Don'ts (anti-slop)

Full checklist: `docs/anti-slop-checklist.md`. System-specific don'ts from the design brief:
No hosted third-party 3D scenes (Spline and friends) — a second WebGL runtime, an asset we do not own, and a bundle we cannot budget for. No generic glass cards everywhere. No neon purple+blue gradient as a default "AI" identity. No meaningless KPI dashboards. No random particle explosions. No 3D spheres behind every heading. No tiny low-contrast copy. No endless logo/testimonial blocks without evidence. No rounded-card overload — radius is reserved for proof objects, floating artifacts, and CTAs (§3). No second scroll/animation library. No fabricated metrics in proof objects — sample data must read as sample data.


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

**Scope.** WebGL now exists on exactly one surface: the home hero. `HomeHero` mounts `SceneLoader` → `HeroScene`, which attaches the singleton canvas into a hero-local `.scene` layer (`position: absolute`, not `fixed`). `lib/scene/presets.ts`, `immersive/PersistentScene` and the chapter `IntersectionObserver` that drove per-chapter interpolation are deleted.

**Composition.** A receding lattice of ~150 clustered nodes (one anchor plus five satellites, two links back to the anchor), generated deterministically from a `sin`-hash so the frame is identical across hydration and reloads. It reads as connected systems seen in depth, not as decorative stardust — the distinction `anti-slop-checklist.md` draws. Muted graphite-green `0x8fb39a` at rest, acid `0xc8ff54` on a sparse minority of anchors, link lines at `0x4c7360` / 0.18 opacity. Normal blending only, no additive glow.

**Legibility without a gradient.** The centre "well" that keeps the `h1` clear of bright points is baked into the **vertex colours** — near-centre nodes are shaded down at build time — so no CSS overlay gradient is needed and the gradient ban holds. The hero `h1` also carries the same `--tw-bg` text-shadow backing the body copy already had.

**Motion.** Slow ambient breathing (z-rotation and z-drift on sine), pointer parallax through the field, and a scroll-linked exit: the camera pushes into the corridor and the field fades to ~5% as the hero leaves. Hero exit progress is read off the container rect **inside the already-scheduled render loop** — deliberately not a scroll listener, so Lenis remains the one scroll driver. `SmoothScroll` no longer feeds the engine and has no `feedScene` prop.

**Budget.** Field construction is allocation-free (no per-node `THREE.Color`) and deferred to `requestIdleCallback`, so it never lands on the hydration critical path. 900 nodes desktop / 300 mobile; DPR capped at 1.5 (1 on mobile); 30fps cap on mobile. The render loop is gated by an `IntersectionObserver` on the hero container — scrolling past the hero stops GPU work entirely, and leaving the route detaches the canvas. Reduced motion renders a single static frame with no RAF loop. Three.js is code-split behind the home route: no other route downloads it.

**First paint — 2026-09-06.** The hero includes an inline SVG image of the field in its server-rendered HTML, with the same shared deterministic geometry, perspective, colours and desktop/mobile densities as WebGL (`lib/scene/field.ts`). It needs no JavaScript or separate image request. The deferred renderer prepares its shaders and replaces that image only after painting its first frame, without the previous 900ms opacity entrance. If JavaScript or WebGL is unavailable, the static field stays visible. Existing hero styling and live effects remain unchanged.

## Hero skyline — 2026-10-06 (Adi-approved, D-038)

Supersedes the composition, legibility and first-paint parts of "Hero depth field" above; its scope
(WebGL on the home hero only, hero-local canvas, Lenis as the one scroll driver) still holds.
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
`powerPreference: 'default'`. Loop gated by an `IntersectionObserver` on the hero and by tab
visibility; idle-deferred setup and `compileAsync` keep it off hydration; reduced motion renders one
still frame (city standing, no loop); returning to Home shows the city already standing.
Measured 2026-10-06 (production build): Lighthouse mobile Home perf 92/95/93, LCP 2.9–3.2 s, TBT
0–90 ms, a11y/BP/SEO 100; page scripts ~2% of the main thread on desktop while animating.

**First paint.** The inline SVG poster is removed (it was most of the Home HTML). The canvas appears
on its first drawn frame with the towers at ground level, and the rise is the entrance. Without
JavaScript or WebGL the hero shows the CSS atmosphere from `globals.css`.
