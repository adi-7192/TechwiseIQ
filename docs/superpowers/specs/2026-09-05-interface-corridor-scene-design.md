# Interface corridor — background scene design spec

**Date:** 2026-09-05
**Status:** Approved by Adi, ready for implementation plan
**Scope:** `src/lib/scene/` (engine, presets, new plate texture module). Read-only touches on `HomeHero.tsx` / `HeroStage.module.css` to source near-ring positions. No new colors, fonts, radii, libraries, or motion primitives — everything below uses tokens already in `docs/design-system.md` and the existing GSAP + Lenis + vanilla Three.js stack.

## Problem

The ambient WebGL layer has now failed twice, for the same underlying reason.

1. **The `TorusKnotGeometry` core (shipped through `7abc925`'s parent).** A stock 3D form rendered behind copy — explicitly banned by `docs/anti-slop-checklist.md` ("stock 3D blobs/spheres behind every heading"). It also rendered *through* body text on the services intro, Custom Software and Operating Model sections.
2. **The five-panel wire composition (current, `7abc925`).** Fixed the legibility problem and the anti-slop violation, but Adi's verdict was that it still isn't impressive.

The common cause is **absence of depth**. Both versions place their geometry on effectively one plane at one distance. There is no parallax between near and far elements, nothing occludes anything else, and no fog. A background built that way reads as a decal applied to the page rather than an environment the page sits inside — regardless of how the shapes are arranged.

A second, separate problem: the hero's three DOM artifact cards (`.website` / `.software` / `.automation` in `HeroStage.module.css`) and the WebGL layer currently do not acknowledge each other. They are different materials, different proportions, at unrelated positions. The result reads as two stacked layers rather than one space.

## Design

### 1. The object: interface plates

The corridor is built from **opaque interface plates** receding into depth.

Each plate is a quad carrying:

- Fill: `--tw-surface` (`#101310`)
- Edge: `--tw-line-soft` (`rgb(242 244 239 / 0.10)`), 1px equivalent
- Corners: `--tw-radius-artifact` (10px) equivalent at the plate's texture resolution
- A drawn interface inside it

Opacity is the load-bearing property. Opaque plates **occlude each other**, and occlusion is what the eye reads as depth. Line geometry cannot occlude, which is precisely why both previous attempts read flat no matter how the elements were arranged.

**Count and spread:** ~22 plates on desktop distributed across ~40 world units of depth, each with a small independent yaw (±0.25 rad) so the corridor does not read as a flat wall of cards.

### 2. Plate designs — three, each restating an existing hero card

Every plate design is a direct restatement of one of the three DOM artifacts already in the hero, so the corridor is made of the same objects the foreground is made of.

**W — web experience** (mirrors `.sitePreview`)
Wordmark bar, two-line heading block, image block, accent CTA chip.

**S — software systems** (mirrors `.code`)
Four code-like bars of varying length with one accented, plus a footer dot and label bar.

**A — connected workflows** (mirrors `.flow`)
Three chips in a row with arrow connectors, last chip accented.

All three share the plate chrome from §1 and are drawn at a single texture aspect (~16:10). Per-instance variety comes from the quad's world dimensions, which vary ±15% around that aspect — the texture itself is never re-drawn per instance.

### 3. The hero handoff

The three hero DOM cards become the **near end of the corridor**, not a layer on top of it.

- The first ring of WebGL plates is seeded at the three DOM cards' screen positions, pushed back in Z, so each foreground card visibly has siblings receding behind it. Positions are derived from `HeroStage.module.css` (left-low, right-high, right-low), read once and hard-coded as world-space constants with a comment pointing back at the CSS.
- Plate proportions, corner radius, border weight and surface colour come from the same tokens the DOM cards use, so the material is identical rather than merely similar.
- On scroll out of the hero the DOM cards drift back (existing `data-home-artifact` drift timeline) and the WebGL plates continue the same trajectory.

**The DOM cards stay DOM.** They carry readable text and must remain in the accessibility tree; nothing moves into the canvas.

### 4. Rendering architecture

Each plate design is drawn **once** to an offscreen 2D canvas at 512×320 and used as a `CanvasTexture`. One `InstancedMesh` per design carries all instances of it.

- **4 draw calls** for the entire corridor (three plate designs plus accent chips — see below)
- **0 network bytes** — everything is procedural
- UI anatomy is pixel-identical to the hero cards because it is drawn from the same token values

Material: `MeshBasicMaterial` with `alphaTest` (no `transparent: true`). `alphaTest` cuts the rounded corners without transparency blending, so the depth buffer stays correct and occlusion is free — no manual sort, no render-order bookkeeping.

`THREE.Fog` set to `--tw-bg` (`#060706`) handles distance falloff so far plates dissolve into the world instead of popping at the far clip. This is scene fog, not a CSS gradient, and is therefore outside the `design-guard.sh` gradient rule.

**The accent is not baked into the texture.** A texture drawn once cannot recolour, and the accent must follow the active chapter (§6). So each plate texture carries only its chrome and muted UI elements, and the single accent element — the CTA chip, the highlighted code line, the final workflow chip — is a separate small quad rendered from a **fourth `InstancedMesh`** with a plain colour material that lerps toward the chapter accent on the existing interpolation schedule. Its per-instance transform is derived from the parent plate's transform plus a fixed offset per design.

Total: **4 draw calls** — three plate designs plus the accent chips.

**New module:** `src/lib/scene/plates.ts` — owns texture generation and nothing else. Exports the three `CanvasTexture`s, their shared aspect, and the per-design accent-chip offset/size that the engine needs to place the chips. Testable and readable in isolation; the engine consumes it and does not know how a plate is drawn.

### 5. Motion

Scroll drives the camera forward along −Z, fed by the existing `setScrollProgress` from `SmoothScroll.tsx`. No second scroll source.

Two constraints:

- **The camera never travels faster than the page.** Nothing that reads as scroll-jacking.
- **The corridor wraps.** Plates passing behind the camera recycle to the far end, so there is no beginning or end to reach and no state to reset on navigation.

Retained unchanged: slow ambient yaw, restrained pointer parallax, and the existing travelling connection signals (`updateSignals`).

### 6. Per-chapter behaviour

Chapter meaning survives as a **mix shift** rather than a geometry morph. Each preset declares a plate mix as three weights summing to 1 — Websites is predominantly W, Custom Software predominantly S, AI Automation predominantly A.

**The mix shifts through recycling, not cross-fading.** An `alphaTest` material has no partial opacity to animate, so nothing fades between designs. Instead, when a plate wraps past the camera to the far end of the corridor (§5) it is re-issued into whichever design group the *current* chapter mix calls for. The corridor therefore becomes predominantly W or S or A over a few seconds of scrolling, and every individual change happens out of sight behind the camera.

Implementation consequence: each design's `InstancedMesh` is allocated the full plate capacity, and instances not currently in use are collapsed to zero scale. Three meshes at capacity N, with exactly N live instances across all three at any moment.

Accent recolours per chapter exactly as today — one signal colour per viewport. The existing `offsetX` / `offsetY` preset fields carry over unchanged. `wireOpacity` is renamed `plateBrightness` and controls edge and accent-block opacity only; plate count stays constant per breakpoint, and signal count keeps using the existing `particleDensity`.

### 7. Legibility

Plates are **safer** for copy than the line geometry was. `#101310` against `#060706` is roughly a 1.05:1 luminance difference, so body text crossing a plate face is essentially unaffected.

The only elements with real contrast are the hairline edges and the small accent blocks. Those are kept off the copy column by the existing per-chapter `offsetX` / `offsetY` placement, which already achieves this in the shipped version.

### 8. Accessibility, fallback, performance

All existing guarantees are preserved, not re-derived:

- `prefers-reduced-motion: reduce` → one composed static frame, no RAF loop
- Canvas stays `aria-hidden` and `pointer-events: none`; all meaningful content stays in the DOM
- WebGL failure falls through to the CSS radial atmosphere in `globals.css`
- One session-singleton renderer, DPR capped `min(devicePixelRatio, 1.5)` desktop / `1` mobile
- Offscreen-tab pause via the existing `visibilitychange` handling

**Mobile:** ~10 plates, no forward camera travel, composition pushed to the lower outside corner (the existing `composedX` / `composedY` / `composedScale` helpers).

**Texture budget:** 3 × 512×320 RGBA ≈ 2MB VRAM, zero network cost. Textures are generated once per session alongside the singleton renderer, never per chapter.

### 9. What changes

| File | Change |
|---|---|
| `src/lib/scene/plates.ts` | **New.** Draws the three plate textures from design tokens. |
| `src/lib/scene/engine.ts` | Corridor of instanced plates replaces `createWireGeometry()`; adds fog and scroll-driven camera travel. |
| `src/lib/scene/presets.ts` | `wireOpacity` → `plateBrightness`; adds per-chapter plate mix weights. `offsetX`/`offsetY`/`particleDensity` unchanged. |
| `src/components/immersive/home/HomeHero.tsx`, `HeroStage.module.css` | Read-only — source of the near-ring positions. |
| `docs/design-system.md`, `docs/changelog.md` | Scene revision entry. |

**Removed:** the five-panel wire geometry (`createWireGeometry` and its per-scene layouts).
**Retained:** the travelling connection signals, the ambient dust field, and every guarantee in §8.

## Acceptance criteria

1. The corridor visibly occludes itself — near plates cover far plates — at both 1440px and 390px.
2. No body copy on any homepage section crosses a plate hairline edge or accent block.
3. The hero's three DOM cards and the nearest WebGL plates read as the same family of objects: same corner radius, same edge weight, same surface colour.
4. `npm run lint` clean; `npm run build` passes; 19/19 routes prerender.
5. The `performance-mobile.spec.ts` long-task and CLS budgets hold against a production build.
6. Under `prefers-reduced-motion: reduce`, one frame renders and `data-animation-running` is `false`.
7. Exactly one `<canvas>` survives repeated route changes (existing `performance-mobile` assertion).

## Out of scope

Deliberately excluded, tracked separately:

- The half-empty Software and AI demo stages during steps 01–02.
- The mobile collision between the WhatsApp pill, the back-to-top badge and the hero scroll rail.
- Deleting the now-unreferenced `home/ChapterNav.tsx` and `home/FinalCta.tsx`.
