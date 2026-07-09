# Visual Overhaul Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the TechwiseIQ home page from uniform centered sections into a visually dense, scroll-animated continuous experience with Three.js accents, asymmetric layouts, and inter-section flow.

**Architecture:** GSAP ScrollTrigger replaces the basic `.rv` IntersectionObserver for all scroll animations (slide-up, rotate-x, slide-left/right, scale, parallax). Three.js (`@react-three/fiber` + `@react-three/drei`) provides wireframe 3D accents in hero and shout sections. Each section gets a unique layout treatment (asymmetric grids, staggered columns, split layouts) instead of uniform centered wrappers.

**Tech Stack:** Next.js 16.2.9, React 19, GSAP 3.15 + ScrollTrigger, Three.js + @react-three/fiber + @react-three/drei, Framer Motion, Tailwind v4, TypeScript strict.

**Spec:** `docs/superpowers/specs/2026-06-14-visual-overhaul-design.md`

---

## File Structure

### New Files
| Path | Responsibility |
|---|---|
| `src/components/ui/ScrollAnimator.tsx` | Client component: registers all `[data-animate]` elements with GSAP ScrollTrigger. Replaces `RevealObserver`. |
| `src/components/ui/ParallaxLayer.tsx` | Client wrapper: applies GSAP scroll-speed parallax to children. |
| `src/components/ui/PlaceholderImage.tsx` | Ink-bg placeholder box with centered label, 16:9 aspect ratio. |
| `src/components/ui/GeometricAccents.tsx` | SVG animated geometric shapes (circles, dots, angular lines) with CSS keyframes. |
| `src/components/three/HeroScene.tsx` | Three.js scene: wireframe icosahedron, mouse-reactive drift, lazy-loaded. |
| `src/components/three/FloatingShapes.tsx` | Three.js scene: 2-3 drifting wireframe shapes for Shout section. |

### Modified Files
| Path | Changes |
|---|---|
| `package.json` | Add `three`, `@react-three/fiber`, `@react-three/drei`, `@types/three` |
| `src/components/ui/index.ts` | Export `ScrollAnimator` instead of `RevealObserver`, add new exports |
| `src/app/globals.css` | Add GSAP animation base styles, remove `.rv` CSS (GSAP handles it) |
| `src/app/page.tsx` | Swap `RevealObserver` for `ScrollAnimator`, update section assembly |
| `src/components/Hero/index.tsx` | Three.js scene, floating screenshot, entry stagger |
| `src/components/Hero/Hero.module.css` | Screenshot positioning, layout updates |
| `src/components/Manifesto/index.tsx` | Add geometry accents, parallax attributes |
| `src/components/Manifesto/Manifesto.module.css` | Geometry positioning, padding update, remove border-top |
| `src/components/ServicesSection/index.tsx` | Full-width layout, visual panels, bg numbers |
| `src/components/ServicesSection/ServicesSection.module.css` | Full-bleed, split expanded layout, parallax numbers |
| `src/components/Ticker/index.tsx` | Add parallax wrapper |
| `src/components/ProcessSection/index.tsx` | Staggered wave, parallax ghost numbers |
| `src/components/ProcessSection/ProcessSection.module.css` | Wave offset, ghost number styling, padding update |
| `src/components/ShoutSection/index.tsx` | RotateX heading, Three.js floating shapes, enhanced animations |
| `src/components/ShoutSection/ShoutSection.module.css` | Remove border-top, enhance strike, geometry |
| `src/components/CaseStudySection/index.tsx` | Magazine layout, placeholder images |
| `src/components/CaseStudySection/CaseStudySection.module.css` | Asymmetric grid, image area, overlap tags |
| `src/components/CTASection/index.tsx` | Split layout, geometric accent |
| `src/components/CTASection/CTASection.module.css` | Split grid, channel hover enhancement, remove border |

### Removed Files
| Path | Reason |
|---|---|
| `src/components/Hero/FluidParticles.tsx` | Replaced by Three.js `HeroScene` |
| `src/components/Hero/FluidParticles.module.css` | No longer needed |
| `src/components/ui/RevealObserver.tsx` | Replaced by `ScrollAnimator` |

---

## Implementation Tasks

### Task 1: Install Three.js dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install Three.js packages**

```bash
cd /Users/adi7192/Documents/TechwiseIQ/website
npm install three @react-three/fiber @react-three/drei
npm install -D @types/three
```

- [ ] **Step 2: Verify installation**

```bash
cd /Users/adi7192/Documents/TechwiseIQ/website
node -e "require('three'); require('@react-three/fiber'); require('@react-three/drei'); console.log('OK')"
```

Expected: `OK`

- [ ] **Step 3: Verify build still passes**

```bash
cd /Users/adi7192/Documents/TechwiseIQ/website
npm run build
```

Expected: Build succeeds with no errors.

- [ ] **Step 4: Commit**

```bash
cd /Users/adi7192/Documents/TechwiseIQ/website
git add package.json package-lock.json
git commit -m "chore: add three.js and react-three dependencies"
```

---

### Task 2: Build ScrollAnimator (GSAP ScrollTrigger system)

**Files:**
- Create: `src/components/ui/ScrollAnimator.tsx`
- Modify: `src/components/ui/index.ts`
- Modify: `src/app/globals.css`

This replaces `RevealObserver`. All elements with `data-animate` get GSAP ScrollTrigger-driven entrance animations. Elements with `data-parallax` get scroll-speed effects.

- [ ] **Step 1: Create ScrollAnimator.tsx**

```tsx
'use client'

import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const ANIMATION_MAP: Record<string, gsap.TweenVars> = {
  'slide-up': { y: 50, opacity: 0 },
  'rotate-x': { rotateX: 90, opacity: 0, transformPerspective: 800 },
  'slide-left': { x: -80, opacity: 0 },
  'slide-right': { x: 80, opacity: 0 },
  scale: { scale: 0.85, opacity: 0 },
}

export default function ScrollAnimator() {
  useEffect(() => {
    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    if (reduced) return

    const ctx = gsap.context(() => {
      // Handle data-animate elements
      document.querySelectorAll<HTMLElement>('[data-animate]').forEach((el) => {
        const type = el.dataset.animate ?? 'slide-up'
        const from = ANIMATION_MAP[type]
        if (!from) return

        const stagger = parseFloat(el.dataset.stagger || '0')

        // If element has stagger, animate its direct children
        if (stagger > 0) {
          const children = Array.from(el.children) as HTMLElement[]
          gsap.set(children, from)
          ScrollTrigger.create({
            trigger: el,
            start: 'top 85%',
            once: true,
            onEnter: () => {
              gsap.to(children, {
                ...Object.fromEntries(
                  Object.keys(from).map((k) => [
                    k,
                    k === 'opacity' ? 1 : 0,
                  ]),
                ),
                opacity: 1,
                y: 0,
                x: 0,
                rotateX: 0,
                scale: 1,
                duration: 0.8,
                stagger,
                ease: 'power3.out',
              })
            },
          })
        } else {
          gsap.set(el, from)
          ScrollTrigger.create({
            trigger: el,
            start: 'top 85%',
            once: true,
            onEnter: () => {
              gsap.to(el, {
                opacity: 1,
                y: 0,
                x: 0,
                rotateX: 0,
                scale: 1,
                duration: 0.8,
                ease: 'power3.out',
              })
            },
          })
        }
      })

      // Handle data-parallax elements
      document.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => {
        const speed = parseFloat(el.dataset.parallax || '0.3')
        gsap.to(el, {
          y: () => (1 - speed) * ScrollTrigger.maxScroll(window) * 0.1,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        })
      })
    })

    return () => ctx.revert()
  }, [])

  return null
}
```

- [ ] **Step 2: Update globals.css — replace .rv with GSAP base styles**

In `src/app/globals.css`, replace the `.rv` block (lines 69-76) with:

```css
/* ─── GSAP ScrollTrigger base (hidden until animated) ─── */
[data-animate] {
  will-change: transform, opacity;
}
```

Keep the reduced-motion `.rv` overrides (lines 95-104) but update them:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation: none !important;
    transition: none !important;
  }
  .rv, [data-animate] {
    opacity: 1 !important;
    transform: none !important;
  }
}
```

- [ ] **Step 3: Update ui/index.ts barrel export**

Read the current `src/components/ui/index.ts` and replace `RevealObserver` export with `ScrollAnimator`:

```ts
export { default as Button } from './Button'
export { default as StickerBadge } from './StickerBadge'
export { default as ScrollAnimator } from './ScrollAnimator'
export { default as VelocitySkewObserver } from './VelocitySkewObserver'
```

- [ ] **Step 4: Update page.tsx to use ScrollAnimator**

In `src/app/page.tsx`, replace `RevealObserver` import and usage:

```tsx
import { ScrollAnimator, VelocitySkewObserver } from '@/components/ui'
```

And in the JSX, replace `<RevealObserver />` with `<ScrollAnimator />`.

- [ ] **Step 5: Verify lint and build**

```bash
cd /Users/adi7192/Documents/TechwiseIQ/website
npm run lint && npm run build
```

Expected: Both pass. The page should still work — existing `.rv` elements will need migration to `data-animate` in later tasks, but nothing should break.

- [ ] **Step 6: Commit**

```bash
cd /Users/adi7192/Documents/TechwiseIQ/website
git add src/components/ui/ScrollAnimator.tsx src/components/ui/index.ts src/app/globals.css src/app/page.tsx
git commit -m "feat: add GSAP ScrollTrigger animation system (ScrollAnimator)"
```

---

### Task 3: Build PlaceholderImage and GeometricAccents components

**Files:**
- Create: `src/components/ui/PlaceholderImage.tsx`
- Create: `src/components/ui/PlaceholderImage.module.css`
- Create: `src/components/ui/GeometricAccents.tsx`
- Create: `src/components/ui/GeometricAccents.module.css`
- Modify: `src/components/ui/index.ts`

- [ ] **Step 1: Create PlaceholderImage**

`src/components/ui/PlaceholderImage.tsx`:
```tsx
import styles from './PlaceholderImage.module.css'

interface Props {
  label?: string
  className?: string
  aspectRatio?: string
}

export default function PlaceholderImage({
  label = 'Screenshot',
  className,
  aspectRatio = '16 / 9',
}: Props) {
  return (
    <div
      className={`${styles.placeholder}${className ? ` ${className}` : ''}`}
      style={{ aspectRatio }}
      aria-hidden="true"
    >
      <span className={styles.label}>{label}</span>
    </div>
  )
}
```

`src/components/ui/PlaceholderImage.module.css`:
```css
.placeholder {
  background: var(--ink);
  border: 3px solid var(--ink);
  box-shadow: 5px 5px 0 var(--ink);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  position: relative;
  overflow: hidden;
}

.label {
  font-family: var(--font-mono), monospace;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--soft-dark);
}
```

- [ ] **Step 2: Create GeometricAccents**

`src/components/ui/GeometricAccents.tsx`:
```tsx
import styles from './GeometricAccents.module.css'

interface Props {
  variant: 'manifesto' | 'services' | 'cta'
  className?: string
}

export default function GeometricAccents({ variant, className }: Props) {
  return (
    <div
      className={`${styles.container} ${styles[variant]}${className ? ` ${className}` : ''}`}
      aria-hidden="true"
    >
      {variant === 'manifesto' && (
        <>
          <svg className={`${styles.shape} ${styles.circleL}`} viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="56" fill="none" stroke="var(--ink)" strokeWidth="3" />
          </svg>
          <svg className={`${styles.shape} ${styles.dotsR}`} viewBox="0 0 80 80">
            {[0, 1, 2, 3].map((row) =>
              [0, 1, 2, 3].map((col) => (
                <circle
                  key={`${row}-${col}`}
                  cx={10 + col * 20}
                  cy={10 + row * 20}
                  r="2.5"
                  fill="var(--soft)"
                />
              )),
            )}
          </svg>
          <svg className={`${styles.shape} ${styles.linesL}`} viewBox="0 0 60 100">
            <line x1="0" y1="0" x2="60" y2="40" stroke="var(--ink)" strokeWidth="2" />
            <line x1="0" y1="30" x2="60" y2="70" stroke="var(--ink)" strokeWidth="2" />
            <line x1="0" y1="60" x2="60" y2="100" stroke="var(--ink)" strokeWidth="2" />
          </svg>
          <svg className={`${styles.shape} ${styles.dotsCluster}`} viewBox="0 0 60 60">
            {[0, 1, 2].map((row) =>
              [0, 1, 2].map((col) => (
                <circle
                  key={`c-${row}-${col}`}
                  cx={10 + col * 20}
                  cy={10 + row * 20}
                  r="3"
                  fill="var(--hot)"
                  opacity="0.4"
                />
              )),
            )}
          </svg>
        </>
      )}
      {variant === 'services' && (
        <svg className={`${styles.shape} ${styles.serviceAccent}`} viewBox="0 0 40 40">
          <rect x="4" y="4" width="32" height="32" fill="none" stroke="var(--hot)" strokeWidth="2" transform="rotate(12 20 20)" />
        </svg>
      )}
      {variant === 'cta' && (
        <svg className={`${styles.shape} ${styles.ctaLines}`} viewBox="0 0 100 200">
          <line x1="10" y1="0" x2="90" y2="60" stroke="var(--ink)" strokeWidth="2" />
          <line x1="10" y1="50" x2="90" y2="110" stroke="var(--hot)" strokeWidth="2" />
          <line x1="10" y1="100" x2="90" y2="160" stroke="var(--ink)" strokeWidth="2" />
          <line x1="10" y1="150" x2="90" y2="200" stroke="var(--soft)" strokeWidth="2" />
        </svg>
      )}
    </div>
  )
}
```

`src/components/ui/GeometricAccents.module.css`:
```css
.container {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 0;
}

.shape {
  position: absolute;
}

/* ── Manifesto variant ── */
.manifesto .circleL {
  width: 120px;
  top: 15%;
  left: 5%;
  animation: orbit 12s ease-in-out infinite;
}

.manifesto .dotsR {
  width: 80px;
  top: 10%;
  right: 8%;
  animation: drift 10s ease-in-out infinite reverse;
}

.manifesto .linesL {
  width: 60px;
  bottom: 15%;
  left: 8%;
  animation: drift 14s ease-in-out infinite;
}

.manifesto .dotsCluster {
  width: 60px;
  bottom: 12%;
  right: 10%;
  animation: orbit 11s ease-in-out infinite reverse;
}

/* ── Services variant ── */
.services .serviceAccent {
  width: 40px;
  animation: spin 8s linear infinite;
}

/* ── CTA variant ── */
.cta .ctaLines {
  width: 100px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 0.5;
}

@keyframes orbit {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  25% { transform: translate(8px, -12px) rotate(5deg); }
  50% { transform: translate(-4px, -20px) rotate(-3deg); }
  75% { transform: translate(6px, -8px) rotate(4deg); }
}

@keyframes drift {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(10px, -15px); }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@media (prefers-reduced-motion: reduce) {
  .shape {
    animation: none !important;
  }
}

@media (max-width: 880px) {
  .manifesto .circleL,
  .manifesto .linesL {
    display: none;
  }
}
```

- [ ] **Step 3: Update ui/index.ts**

Add to the barrel:
```ts
export { default as PlaceholderImage } from './PlaceholderImage'
export { default as GeometricAccents } from './GeometricAccents'
```

- [ ] **Step 4: Verify lint and build**

```bash
cd /Users/adi7192/Documents/TechwiseIQ/website
npm run lint && npm run build
```

- [ ] **Step 5: Commit**

```bash
cd /Users/adi7192/Documents/TechwiseIQ/website
git add src/components/ui/PlaceholderImage.tsx src/components/ui/PlaceholderImage.module.css src/components/ui/GeometricAccents.tsx src/components/ui/GeometricAccents.module.css src/components/ui/index.ts
git commit -m "feat: add PlaceholderImage and GeometricAccents components"
```

---

### Task 4: Build Three.js HeroScene

**Files:**
- Create: `src/components/three/HeroScene.tsx`

This is the wireframe icosahedron with mouse-reactive drift for the hero section. Lazy-loaded, paused when off-viewport.

- [ ] **Step 1: Create HeroScene.tsx**

`src/components/three/HeroScene.tsx`:
```tsx
'use client'

import { useRef, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Icosahedron, Wireframe } from '@react-three/drei'
import * as THREE from 'three'

function Scene() {
  const meshRef = useRef<THREE.Mesh>(null)
  const mouse = useRef({ x: 0, y: 0 })
  const { viewport } = useThree()

  useEffect(() => {
    function onMove(e: MouseEvent) {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  useFrame((_, delta) => {
    if (!meshRef.current) return
    meshRef.current.rotation.y += delta * 0.15
    meshRef.current.rotation.x += delta * 0.08

    // Subtle mouse-follow drift
    const targetX = mouse.current.y * 0.3
    const targetY = mouse.current.x * 0.3
    meshRef.current.position.x +=
      (targetY * viewport.width * 0.05 - meshRef.current.position.x) * 0.02
    meshRef.current.position.y +=
      (targetX * viewport.height * 0.05 - meshRef.current.position.y) * 0.02
  })

  return (
    <Icosahedron ref={meshRef} args={[2.2, 1]}>
      <meshBasicMaterial color="#101010" wireframe />
    </Icosahedron>
  )
}

export default function HeroScene() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: -1,
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    >
      <Canvas
        frameloop={visible ? 'always' : 'never'}
        camera={{ position: [0, 0, 6], fov: 50 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: 'transparent' }}
      >
        <Scene />
      </Canvas>
    </div>
  )
}
```

- [ ] **Step 2: Verify lint and build**

```bash
cd /Users/adi7192/Documents/TechwiseIQ/website
npm run lint && npm run build
```

- [ ] **Step 3: Commit**

```bash
cd /Users/adi7192/Documents/TechwiseIQ/website
git add src/components/three/HeroScene.tsx
git commit -m "feat: add Three.js wireframe icosahedron hero scene"
```

---

### Task 5: Build Three.js FloatingShapes (for Shout section)

**Files:**
- Create: `src/components/three/FloatingShapes.tsx`

2-3 wireframe shapes drifting slowly on a dark (ink) background for the Shout section.

- [ ] **Step 1: Create FloatingShapes.tsx**

`src/components/three/FloatingShapes.tsx`:
```tsx
'use client'

import { useRef, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function DriftingShape({
  geometry,
  position,
  speed,
}: {
  geometry: 'tetra' | 'torus' | 'octa'
  position: [number, number, number]
  speed: number
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const baseY = position[1]

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    meshRef.current.rotation.x = clock.elapsedTime * speed * 0.3
    meshRef.current.rotation.y = clock.elapsedTime * speed * 0.2
    meshRef.current.position.y =
      baseY + Math.sin(clock.elapsedTime * speed * 0.5) * 0.3
  })

  return (
    <mesh ref={meshRef} position={position}>
      {geometry === 'tetra' && <tetrahedronGeometry args={[0.8, 0]} />}
      {geometry === 'torus' && <torusGeometry args={[0.6, 0.2, 8, 16]} />}
      {geometry === 'octa' && <octahedronGeometry args={[0.7, 0]} />}
      <meshBasicMaterial color="#9A9A92" wireframe opacity={0.5} transparent />
    </mesh>
  )
}

export default function FloatingShapes() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    >
      <Canvas
        frameloop={visible ? 'always' : 'never'}
        camera={{ position: [0, 0, 8], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: 'transparent' }}
      >
        <DriftingShape geometry="tetra" position={[-3.5, 1.2, 0]} speed={0.8} />
        <DriftingShape geometry="torus" position={[3.2, -0.8, -1]} speed={0.6} />
        <DriftingShape geometry="octa" position={[-2, -1.5, 0.5]} speed={0.7} />
      </Canvas>
    </div>
  )
}
```

- [ ] **Step 2: Verify lint and build**

```bash
cd /Users/adi7192/Documents/TechwiseIQ/website
npm run lint && npm run build
```

- [ ] **Step 3: Commit**

```bash
cd /Users/adi7192/Documents/TechwiseIQ/website
git add src/components/three/FloatingShapes.tsx
git commit -m "feat: add Three.js floating wireframe shapes for shout section"
```

---

### Task 6: Overhaul Hero section

**Files:**
- Modify: `src/components/Hero/index.tsx`
- Modify: `src/components/Hero/Hero.module.css`
- Delete: `src/components/Hero/FluidParticles.tsx`
- Delete: `src/components/Hero/FluidParticles.module.css`

Replace FluidParticles with Three.js HeroScene. Add floating screenshot placeholder. Add stagger entry animations via `data-animate`.

- [ ] **Step 1: Delete FluidParticles files**

```bash
cd /Users/adi7192/Documents/TechwiseIQ/website
rm src/components/Hero/FluidParticles.tsx src/components/Hero/FluidParticles.module.css
```

- [ ] **Step 2: Rewrite Hero/index.tsx**

```tsx
import dynamic from 'next/dynamic'
import Marquee from '@/components/Marquee'
import { Button, StickerBadge, PlaceholderImage } from '@/components/ui'
import styles from './Hero.module.css'

const HeroScene = dynamic(() => import('@/components/three/HeroScene'), {
  ssr: false,
})

export default function Hero() {
  return (
    <header className={styles.hero}>
      <HeroScene />
      <StickerBadge className={styles.sticker}>AI-FIRST ★ DUBAI</StickerBadge>

      {/* 3 kinetic marquee rows — decorative, real h1 is in the claim card */}
      <div className="skew" data-animate="slide-up">
        <Marquee duration={26}>
          <span className={styles.rowText}>
            Websites · Software · AI ·&nbsp;
          </span>
        </Marquee>
      </div>
      <div className="skew" data-animate="slide-up">
        <Marquee direction="right" duration={30}>
          <span className={`${styles.rowText} ${styles.outlined}`}>
            Built in Dubai · Shipped worldwide ·&nbsp;
          </span>
        </Marquee>
      </div>
      <div className="skew" data-animate="slide-up">
        <Marquee duration={22}>
          <span className={`${styles.rowText} ${styles.hotText}`}>
            Weeks not quarters ·&nbsp;
          </span>
        </Marquee>
      </div>

      {/* Claim card — carries the semantic h1 */}
      <div className={styles.card}>
        <h1 className={styles.claim} data-animate="slide-up">
          Techwise IQ — the AI-first engineering agency.{' '}
          <span className={styles.highlight}>
            We build it. We ship it. You own the outcome.
          </span>
        </h1>
        <div className={styles.ctas} data-animate="slide-up">
          <Button variant="primary" href="#contact">
            Book a call
          </Button>
          <Button variant="secondary" href="#services">
            What we do ↓
          </Button>
        </div>
      </div>

      {/* Floating screenshot placeholder */}
      <div className={styles.screenshot} data-animate="scale" data-parallax="0.6">
        <PlaceholderImage label="Project preview" />
      </div>

      <span className={styles.cue}>
        <span className={styles.cueArrow}>↓</span> Scroll
      </span>
    </header>
  )
}
```

- [ ] **Step 3: Rewrite Hero.module.css**

```css
.hero {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  padding: 90px 0 70px;
  overflow: hidden;
  isolation: isolate;
}

.sticker {
  position: absolute;
  top: 14%;
  right: 7%;
  z-index: 5;
}

.rowText {
  font-family: var(--font-anton), sans-serif;
  text-transform: uppercase;
  font-size: clamp(64px, 12.5vw, 176px);
  line-height: 0.94;
  padding-right: 46px;
  letter-spacing: 0.005em;
  white-space: nowrap;
}

.outlined {
  color: transparent;
  -webkit-text-stroke: 2px var(--ink);
}

.hotText {
  color: var(--hot);
}

.card {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 22px;
  pointer-events: none;
  z-index: 2;
}

.claim {
  background: var(--ink);
  color: var(--bone);
  font-family: var(--font-mono), monospace;
  font-size: 14px;
  font-weight: 400;
  padding: 18px 28px;
  max-width: 52ch;
  text-align: center;
  transform: rotate(-2deg);
  box-shadow: var(--shadow-hot);
  pointer-events: auto;
  line-height: 1.55;
}

.highlight {
  color: var(--sun);
  font-weight: 400;
}

.ctas {
  display: flex;
  gap: 16px;
  pointer-events: auto;
  flex-wrap: wrap;
  justify-content: center;
}

.screenshot {
  position: absolute;
  right: 5%;
  bottom: 18%;
  width: clamp(200px, 22vw, 320px);
  transform: rotate(-3deg);
  z-index: 3;
  pointer-events: none;
}

.cue {
  position: absolute;
  bottom: 22px;
  left: 24px;
  color: var(--soft);
  display: flex;
  gap: 10px;
  align-items: center;
  font-family: var(--font-mono), monospace;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  z-index: 4;
}

.cueArrow {
  animation: dip 1.6s ease-in-out infinite;
  display: inline-block;
}

@keyframes dip {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(6px); }
}

@media (max-width: 880px) {
  .sticker {
    top: auto;
    bottom: 18%;
    right: 5%;
  }

  .screenshot {
    display: none;
  }
}

@media (max-width: 600px) {
  .claim {
    font-size: 12.5px;
    max-width: 90vw;
  }
}

@media (prefers-reduced-motion: reduce) {
  .cueArrow {
    animation: none;
  }
}
```

- [ ] **Step 4: Verify lint and build**

```bash
cd /Users/adi7192/Documents/TechwiseIQ/website
npm run lint && npm run build
```

- [ ] **Step 5: Commit**

```bash
cd /Users/adi7192/Documents/TechwiseIQ/website
git add -A src/components/Hero/
git commit -m "feat: hero overhaul — Three.js wireframe, floating screenshot, entry animations"
```

---

### Task 7: Overhaul Manifesto section

**Files:**
- Modify: `src/components/Manifesto/index.tsx`
- Modify: `src/components/Manifesto/Manifesto.module.css`

Add flanking geometric accents, parallax on geometry, remove border-top, update padding to 120px.

- [ ] **Step 1: Update Manifesto/index.tsx**

Add `GeometricAccents` and `data-parallax` attributes. The existing scroll-lit word logic stays unchanged.

```tsx
'use client'

import { useEffect, useRef } from 'react'
import { GeometricAccents } from '@/components/ui'
import styles from './Manifesto.module.css'

const LEAD_WORDS =
  'We build websites, software & AI automations for businesses that'.split(' ')
const PUNCH_WORDS = ['hate', 'boring.']

export default function Manifesto() {
  const sectionRef = useRef<HTMLElement>(null)
  const burstFired = useRef(false)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const el = sectionRef.current
    if (!el) return
    const wordEls = el.querySelectorAll<HTMLSpanElement>('[data-w]')
    const count = wordEls.length
    const hotStart = count - PUNCH_WORDS.length

    function litCheck() {
      const r = el!.getBoundingClientRect()
      const progress = Math.min(Math.max((innerHeight * 0.82 - r.top) / r.height, 0), 1)
      const leadEnd = hotStart
      const cursor = progress <= 0.85
        ? (progress / 0.85) * leadEnd
        : leadEnd + ((progress - 0.85) / 0.15) * PUNCH_WORDS.length

      wordEls.forEach((w, i) => {
        const shouldBeLit = cursor > i
        const isLit = w.hasAttribute('data-lit')
        if (shouldBeLit && !isLit) {
          w.setAttribute('data-lit', '')
        } else if (!shouldBeLit && isLit) {
          w.removeAttribute('data-lit')
        }
      })

      const allHotLit = cursor >= count
      if (allHotLit && !burstFired.current) {
        burstFired.current = true
        for (let i = hotStart; i < count; i++) {
          wordEls[i].setAttribute('data-burst', '')
        }
      }
      if (!allHotLit) {
        burstFired.current = false
        for (let i = hotStart; i < count; i++) {
          wordEls[i].removeAttribute('data-burst')
        }
      }
    }

    window.addEventListener('scroll', litCheck, { passive: true })
    litCheck()
    return () => window.removeEventListener('scroll', litCheck)
  }, [])

  return (
    <section ref={sectionRef} className={styles.manifesto}>
      <div className={styles.geometryWrap} data-parallax="0.3">
        <GeometricAccents variant="manifesto" />
      </div>
      <div className="wrap" style={{ position: 'relative', zIndex: 1 }}>
        <span className={styles.label}>The short version</span>
        <p className={styles.text}>
          {LEAD_WORDS.map((word, i) => (
            <span key={i} data-w="" className={styles.word}>
              {word}{' '}
            </span>
          ))}
          <span className={styles.hotLine}>
            {PUNCH_WORDS.map((word, i) => (
              <span
                key={`hot-${i}`}
                data-w=""
                className={`${styles.word} ${styles.hot}`}
              >
                {word}{i < PUNCH_WORDS.length - 1 ? ' ' : ''}
              </span>
            ))}
          </span>
        </p>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Update Manifesto.module.css**

```css
.manifesto {
  padding: 120px 0;
  text-align: center;
  position: relative;
  overflow: visible;
}

.geometryWrap {
  position: absolute;
  inset: -20px 0;
  pointer-events: none;
}

.label {
  display: block;
  margin-bottom: 30px;
  font-family: var(--font-mono), monospace;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: var(--soft);
}

.text {
  font-family: var(--font-anton), sans-serif;
  text-transform: uppercase;
  font-size: clamp(36px, 5.6vw, 76px);
  line-height: 1.08;
  max-width: 18ch;
  margin: 0 auto;
  letter-spacing: 0.005em;
}

.word {
  display: inline-block;
  margin-right: 0.22em;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.word[data-lit] {
  opacity: 1;
}

.hotLine {
  display: block;
  margin-top: 0.1em;
  white-space: nowrap;
}

.hot {
  color: var(--hot);
  font-size: 1.45em;
  line-height: 1;
  transform-origin: center center;
}

.hot[data-burst] {
  animation: burst 0.55s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

@keyframes burst {
  0%   { transform: scale(0.75); opacity: 0.6; }
  45%  { transform: scale(1.18); opacity: 1; }
  100% { transform: scale(1);   opacity: 1; }
}

@media (prefers-reduced-motion: reduce) {
  .word {
    opacity: 1;
    transition: none;
  }
  .hot[data-burst] {
    animation: none;
  }
}
```

- [ ] **Step 3: Verify lint and build**

```bash
cd /Users/adi7192/Documents/TechwiseIQ/website
npm run lint && npm run build
```

- [ ] **Step 4: Commit**

```bash
cd /Users/adi7192/Documents/TechwiseIQ/website
git add src/components/Manifesto/
git commit -m "feat: manifesto — orbiting geometry, parallax, remove border"
```

---

### Task 8: Overhaul ServicesSection (full-width + visual panels)

**Files:**
- Modify: `src/components/ServicesSection/index.tsx`
- Modify: `src/components/ServicesSection/ServicesSection.module.css`

Full-bleed layout, giant parallax background numbers, split expanded view with placeholder screenshots.

- [ ] **Step 1: Update ServicesSection/index.tsx**

```tsx
'use client'

import { useAccordion } from '@/hooks/useAccordion'
import { PlaceholderImage, GeometricAccents } from '@/components/ui'
import styles from './ServicesSection.module.css'

const SERVICES = [
  {
    num: '001',
    title: 'Web Development',
    description:
      'Strategy, design, build, launch — end to end. Sites engineered to load fast and convert visitors, not decorate the internet. Custom design every time; templates are for agencies that bill by the hour.',
    deliverables: ['Marketing sites', 'E-commerce', 'CMS builds', 'SEO + GEO foundations'],
    href: '/services/web',
  },
  {
    num: '002',
    title: 'Custom Software',
    description:
      'Portals, dashboards, internal tools, products — software shaped to how your business actually runs. Scoped tight in writing, shipped in weekly demos you can click.',
    deliverables: ['Web apps + portals', 'APIs + integrations', 'Legacy rebuilds', 'Ongoing support'],
    href: '/services/software',
  },
  {
    num: '003',
    title: 'AI Automation',
    description:
      "We hunt the busywork in your workflows and kill it. Documents processed, emails triaged, reports generated — AI where it helps, plain code where it doesn't.",
    deliverables: ['Workflow automation', 'AI on your data', 'Doc + email processing', 'AI audits'],
    href: '/services/ai',
  },
]

export default function ServicesSection() {
  const { openIndex, toggle, setBodyRef } = useAccordion(SERVICES.length)

  return (
    <section className={styles.services} id="services">
      <div className={styles.headWrap}>
        <div className={styles.head}>
          <span className={styles.label}>What we do — tap a row</span>
          <span className={styles.label}>001 — 003</span>
        </div>
      </div>
      {SERVICES.map((svc, i) => (
        <div
          key={svc.num}
          className={`${styles.svc}${openIndex === i ? ` ${styles.open}` : ''}`}
          data-animate="slide-up"
        >
          {/* Giant background number */}
          <span className={styles.bgNum} data-parallax="0.2" aria-hidden="true">
            {svc.num}
          </span>
          <div className={styles.svcInner}>
            <h2 className={styles.heading}>
              <button
                id={`svc-btn-${i}`}
                className={styles.row}
                onClick={() => toggle(i)}
                aria-expanded={openIndex === i}
                aria-controls={`svc-body-${i}`}
                type="button"
              >
                <span className={styles.num}>{svc.num}</span>
                <span className={styles.title}>{svc.title}</span>
                <span className={styles.arr} aria-hidden="true">
                  →
                </span>
              </button>
            </h2>
            <div
              id={`svc-body-${i}`}
              ref={setBodyRef(i)}
              className={styles.body}
              role="region"
              aria-labelledby={`svc-btn-${i}`}
            >
              <div className={styles.bodyInner}>
                <div className={styles.bodyText}>
                  <p>{svc.description}</p>
                  <ul>
                    {svc.deliverables.map((d) => (
                      <li key={d}>{d}</li>
                    ))}
                  </ul>
                  <a href={svc.href} className={styles.learnMore}>
                    Learn more →
                  </a>
                </div>
                <div className={styles.bodyVisual}>
                  <PlaceholderImage label={`${svc.title} project`} />
                  <GeometricAccents variant="services" className={styles.svcAccent} />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </section>
  )
}
```

- [ ] **Step 2: Rewrite ServicesSection.module.css**

```css
.services {
  padding: 72px 0 48px;
}

.headWrap {
  max-width: var(--max);
  margin: 0 auto;
  padding: 0 24px;
}

.head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 26px 0;
}

.label {
  font-family: var(--font-mono), monospace;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: var(--soft);
}

.svc {
  border-top: var(--bd);
  position: relative;
  overflow: hidden;
}

.svc:last-child {
  border-bottom: var(--bd);
}

.bgNum {
  position: absolute;
  right: 5%;
  top: 50%;
  transform: translateY(-50%);
  font-family: var(--font-anton), sans-serif;
  font-size: clamp(150px, 20vw, 300px);
  line-height: 1;
  color: transparent;
  -webkit-text-stroke: 2px rgba(16, 16, 16, 0.06);
  pointer-events: none;
  z-index: 0;
  white-space: nowrap;
}

.svcInner {
  max-width: var(--max);
  margin: 0 auto;
  padding: 0 24px;
  position: relative;
  z-index: 1;
}

.heading {
  margin: 0;
  font-size: inherit;
  font-weight: inherit;
}

.row {
  display: flex;
  align-items: baseline;
  gap: 28px;
  padding: 26px 0;
  width: 100%;
  background: none;
  border: none;
  cursor: pointer;
  font: inherit;
  color: inherit;
  text-align: left;
  position: relative;
  transition: padding-left 0.25s ease;
}

.row:hover {
  padding-left: 22px;
}

.num {
  font-family: var(--font-mono), monospace;
  font-size: 14px;
  color: var(--hot);
  min-width: 46px;
  flex-shrink: 0;
}

.title {
  font-family: var(--font-anton), sans-serif;
  text-transform: uppercase;
  font-size: clamp(34px, 6.2vw, 86px);
  line-height: 0.96;
  letter-spacing: 0.005em;
  transition: color 0.2s ease, -webkit-text-stroke 0.2s ease, transform 0.25s ease;
  flex: 1;
}

.row:hover .title {
  color: transparent;
  -webkit-text-stroke: 2px var(--ink);
  transform: translateX(8px);
}

.arr {
  font-family: var(--font-anton), sans-serif;
  font-size: clamp(26px, 3.6vw, 48px);
  color: var(--hot);
  transform: translateX(-14px) rotate(0deg);
  opacity: 0;
  transition: transform 0.25s ease, opacity 0.25s ease;
  flex-shrink: 0;
}

.row:hover .arr,
.open .arr {
  opacity: 1;
  transform: translateX(0) rotate(45deg);
}

.open .arr {
  transform: rotate(135deg);
}

.body {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.5s cubic-bezier(0.2, 0.7, 0.3, 1);
}

.bodyInner {
  display: grid;
  grid-template-columns: 55% 40%;
  gap: 5%;
  padding: 6px 0 48px 74px;
}

.bodyText p {
  font-size: 16.5px;
  max-width: 52ch;
  font-weight: 500;
}

.bodyText ul {
  list-style: none;
  margin-top: 16px;
}

.bodyText li {
  font-family: var(--font-mono), monospace;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  padding: 9px 0;
  border-top: 1.5px solid var(--ink);
}

.bodyText li::before {
  content: '→ ';
  color: var(--hot);
}

.bodyVisual {
  position: relative;
  display: flex;
  align-items: flex-start;
  padding-top: 8px;
}

.svcAccent {
  position: absolute;
  bottom: -10px;
  right: -10px;
  width: 40px;
  height: 40px;
}

.learnMore {
  display: inline-block;
  margin-top: 20px;
  font-family: var(--font-mono), monospace;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: var(--ink);
  text-decoration: none;
  border-bottom: 3px solid transparent;
  padding-bottom: 2px;
  transition: border-color 0.2s ease;
}

.learnMore:hover {
  border-bottom-color: var(--ink);
}

.open {
  background: #ece9e0;
}

@media (max-width: 880px) {
  .bodyInner {
    grid-template-columns: 1fr;
    padding-left: 0;
    gap: 20px;
  }

  .bodyVisual {
    max-width: 320px;
  }

  .bgNum {
    font-size: clamp(100px, 15vw, 180px);
    right: 2%;
  }
}

@media (max-width: 600px) {
  .row {
    gap: 14px;
    padding: 20px 0;
  }

  .num {
    min-width: 30px;
    font-size: 12px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .body {
    max-height: none !important;
    overflow: visible !important;
  }
}
```

- [ ] **Step 3: Verify lint and build**

```bash
cd /Users/adi7192/Documents/TechwiseIQ/website
npm run lint && npm run build
```

- [ ] **Step 4: Commit**

```bash
cd /Users/adi7192/Documents/TechwiseIQ/website
git add src/components/ServicesSection/
git commit -m "feat: services — full-width layout, visual panels, parallax bg numbers"
```

---

### Task 9: Add parallax to Ticker

**Files:**
- Modify: `src/components/Ticker/index.tsx`

Minimal change — wrap the visual ticker in a parallax container.

- [ ] **Step 1: Update Ticker/index.tsx**

```tsx
import Marquee from '@/components/Marquee'
import styles from './Ticker.module.css'

export default function Ticker() {
  return (
    <>
      <ul className="sr-only">
        <li>Fixed scope</li>
        <li>Demos every Friday</li>
        <li>No surprise invoices</li>
        <li>Weeks not quarters</li>
      </ul>
      <div className={styles.ticker} aria-hidden="true" data-parallax="0.9">
        <Marquee duration={26}>
          <span className={styles.text}>
            Fixed scope ★ Demos every Friday ★ No surprise invoices ★ Weeks not
            quarters ★&nbsp;
          </span>
        </Marquee>
      </div>
    </>
  )
}
```

- [ ] **Step 2: Verify lint and build**

```bash
cd /Users/adi7192/Documents/TechwiseIQ/website
npm run lint && npm run build
```

- [ ] **Step 3: Commit**

```bash
cd /Users/adi7192/Documents/TechwiseIQ/website
git add src/components/Ticker/
git commit -m "feat: ticker — add parallax depth offset"
```

---

### Task 10: Overhaul ProcessSection (staggered wave + parallax)

**Files:**
- Modify: `src/components/ProcessSection/index.tsx`
- Modify: `src/components/ProcessSection/ProcessSection.module.css`

Staggered column heights, ghost parallax numbers, slide-up stagger entry, enhanced hover.

- [ ] **Step 1: Update ProcessSection/index.tsx**

```tsx
import styles from './ProcessSection.module.css'

const STEPS = [
  {
    num: '01',
    title: 'Diagnose',
    body: 'A short discovery sprint. Goals, systems, bottlenecks — mapped before we quote a dirham.',
  },
  {
    num: '02',
    title: 'Scope',
    body: 'Fixed written scope. Timeline, cost, deliverables. No vague estimates.',
  },
  {
    num: '03',
    title: 'Build',
    body: 'Working software every Friday. Progress you can click, not status reports.',
  },
  {
    num: '04',
    title: 'Run',
    body: 'Launch + handover. Optional retainer for support and new automations.',
  },
]

export default function ProcessSection() {
  return (
    <section className={styles.process}>
      <div className="wrap">
        <span className={styles.label}>How it runs — no mystery</span>
        <div className={styles.grid} data-animate="slide-up" data-stagger="0.15">
          {STEPS.map((step, i) => (
            <div
              key={step.num}
              className={`${styles.step} ${i % 2 === 1 ? styles.stepOffset : ''}`}
            >
              <span className={styles.ghost} data-parallax="0.4" aria-hidden="true">
                {step.num}
              </span>
              <div className={styles.big}>{step.num}</div>
              <h3 className={styles.title}>{step.title}</h3>
              <p className={styles.body}>{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Rewrite ProcessSection.module.css**

```css
.process {
  padding: 80px 0;
}

.label {
  font-family: var(--font-mono), monospace;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: var(--soft);
}

.grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0;
  margin-top: 46px;
  border-left: var(--bd);
}

.step {
  border-right: var(--bd);
  padding: 8px 26px 34px;
  position: relative;
  overflow: visible;
}

.stepOffset {
  margin-top: 40px;
}

.ghost {
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  font-family: var(--font-anton), sans-serif;
  font-size: clamp(120px, 14vw, 200px);
  line-height: 1;
  color: transparent;
  -webkit-text-stroke: 2px rgba(16, 16, 16, 0.05);
  pointer-events: none;
  z-index: 0;
  white-space: nowrap;
}

.big {
  font-family: var(--font-anton), sans-serif;
  font-size: clamp(56px, 7vw, 110px);
  line-height: 1;
  color: transparent;
  -webkit-text-stroke: 2px var(--ink);
  transition: color 0.25s ease, -webkit-text-stroke 0.25s ease, transform 0.25s ease;
  position: relative;
  z-index: 1;
}

.step:hover .big {
  color: var(--hot);
  -webkit-text-stroke: 2px var(--hot);
  transform: scale(1.05);
}

.title {
  font-family: var(--font-anton), sans-serif;
  text-transform: uppercase;
  font-size: 21px;
  margin: 20px 0 8px;
  letter-spacing: 0.01em;
  position: relative;
  z-index: 1;
}

.body {
  font-size: 14.5px;
  font-weight: 500;
  color: #3a3933;
  position: relative;
  z-index: 1;
}

@media (max-width: 880px) {
  .grid {
    grid-template-columns: 1fr 1fr;
    border-top: var(--bd);
  }

  .step {
    border-bottom: var(--bd);
    padding: 18px 20px 26px;
  }

  .stepOffset {
    margin-top: 0;
  }

  .ghost {
    font-size: 100px;
  }
}

@media (max-width: 600px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 3: Verify lint and build**

```bash
cd /Users/adi7192/Documents/TechwiseIQ/website
npm run lint && npm run build
```

- [ ] **Step 4: Commit**

```bash
cd /Users/adi7192/Documents/TechwiseIQ/website
git add src/components/ProcessSection/
git commit -m "feat: process — staggered wave layout, ghost parallax numbers, enhanced hover"
```

---

### Task 11: Overhaul ShoutSection (rotateX + floating shapes)

**Files:**
- Modify: `src/components/ShoutSection/index.tsx`
- Modify: `src/components/ShoutSection/ShoutSection.module.css`

RotateX heading reveal, Three.js floating wireframes, enhanced strike-through, "outcomes" burst, remove border-top.

- [ ] **Step 1: Update ShoutSection/index.tsx**

```tsx
'use client'

import { useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import styles from './ShoutSection.module.css'

const FloatingShapes = dynamic(() => import('@/components/three/FloatingShapes'), {
  ssr: false,
})

export default function ShoutSection() {
  const strikeRef = useRef<HTMLSpanElement>(null)
  const outcomeRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const strikeEl = strikeRef.current
    const outcomeEl = outcomeRef.current
    if (!strikeEl) return

    const io = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            strikeEl.setAttribute('data-struck', '')
            if (outcomeEl) outcomeEl.setAttribute('data-burst', '')
            observer.disconnect()
          }
        })
      },
      { threshold: 0.6 },
    )

    io.observe(strikeEl)
    return () => io.disconnect()
  }, [])

  return (
    <section className={styles.shout}>
      <FloatingShapes />
      <div className="wrap">
        <h2 className={styles.heading} data-animate="rotate-x">
          Agencies sell{' '}
          <span ref={strikeRef} className={styles.strike}>
            hours.
          </span>
          <br />
          We sell{' '}
          <span ref={outcomeRef} className={styles.highlight}>
            outcomes.
          </span>
        </h2>
        <p className={styles.body} data-animate="slide-up">
          A website that sells. Software that fits. Automations that hand your
          team its week back. That&apos;s the product — everything else is
          invoice padding.
        </p>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Rewrite ShoutSection.module.css**

```css
.shout {
  background: var(--ink);
  color: var(--bone);
  padding: 120px 0;
  position: relative;
  overflow: hidden;
}

.heading {
  font-family: var(--font-anton), sans-serif;
  text-transform: uppercase;
  font-size: clamp(40px, 7vw, 100px);
  line-height: 0.95;
  letter-spacing: 0.005em;
  position: relative;
  z-index: 2;
  text-align: center;
}

.strike {
  position: relative;
  white-space: nowrap;
}

.strike::after {
  content: '';
  position: absolute;
  left: -2%;
  right: -2%;
  top: 52%;
  height: 4px;
  background: var(--hot);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.4s cubic-bezier(0.2, 0.7, 0.3, 1) 0.3s;
}

.strike[data-struck]::after {
  transform: scaleX(1);
}

.highlight {
  color: var(--sun);
  display: inline-block;
  transform: scale(1);
  transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}

.highlight[data-burst] {
  animation: outcomeBurst 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

@keyframes outcomeBurst {
  0% { transform: scale(0.75); opacity: 0.6; }
  50% { transform: scale(1.15); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
}

.body {
  margin-top: 30px;
  font-family: var(--font-mono), monospace;
  font-size: 13.5px;
  color: var(--soft-dark);
  max-width: 54ch;
  position: relative;
  z-index: 2;
  text-align: center;
  margin-left: auto;
  margin-right: auto;
}

@media (prefers-reduced-motion: reduce) {
  .strike::after {
    transform: scaleX(1);
  }

  .highlight[data-burst] {
    animation: none;
  }
}
```

- [ ] **Step 3: Verify lint and build**

```bash
cd /Users/adi7192/Documents/TechwiseIQ/website
npm run lint && npm run build
```

- [ ] **Step 4: Commit**

```bash
cd /Users/adi7192/Documents/TechwiseIQ/website
git add src/components/ShoutSection/
git commit -m "feat: shout — rotateX reveal, Three.js floating shapes, enhanced strike + outcomes burst"
```

---

### Task 12: Overhaul CaseStudySection (magazine layout + placeholders)

**Files:**
- Modify: `src/components/CaseStudySection/index.tsx`
- Modify: `src/components/CaseStudySection/CaseStudySection.module.css`

Asymmetric magazine grid (58/38%), placeholder images, scale reveal, enhanced hover, overlapping tags.

- [ ] **Step 1: Update CaseStudySection/index.tsx**

```tsx
import Link from 'next/link'
import { CASE_STUDIES } from '@/data/case-studies'
import { PlaceholderImage } from '@/components/ui'
import styles from './CaseStudySection.module.css'

export default function CaseStudySection() {
  return (
    <section className={styles.section}>
      <div className="wrap">
        <div className={styles.head}>
          <span className={styles.label}>Selected work</span>
          <Link href="/work" className={styles.allLink}>
            All projects →
          </Link>
        </div>
        <div className={styles.grid} data-animate="scale" data-stagger="0.15">
          {CASE_STUDIES.map((cs, i) => (
            <Link
              key={cs.slug}
              href={`/work/${cs.slug}`}
              className={`${styles.card} ${i === 0 ? styles.featured : styles.secondary}`}
            >
              <div className={styles.imageWrap}>
                <PlaceholderImage label={cs.client} />
              </div>
              <div className={styles.cardBody}>
                <span className={styles.industry}>{cs.industry}</span>
                <h2 className={styles.client}>{cs.client}</h2>
                <p className={styles.outcome}>{cs.outcome}</p>
                <div className={styles.stack}>
                  {cs.stack.map((tech) => (
                    <span key={tech} className={styles.tag}>
                      {tech}
                    </span>
                  ))}
                </div>
                <span className={styles.viewLink}>View project →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Rewrite CaseStudySection.module.css**

```css
.section {
  border-top: var(--bd);
  padding: 96px 0;
}

.head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 56px;
}

.label {
  font-family: var(--font-mono), monospace;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: var(--soft);
}

.allLink {
  font-family: var(--font-mono), monospace;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: var(--ink);
  text-decoration: none;
  border-bottom: 3px solid transparent;
  padding-bottom: 2px;
  transition: border-color 0.2s ease;
}

.allLink:hover {
  border-bottom-color: var(--ink);
}

.grid {
  display: grid;
  grid-template-columns: 58% 38%;
  gap: 4%;
  align-items: start;
}

.card {
  border: 3px solid var(--ink);
  background: var(--bone);
  box-shadow: 5px 5px 0 var(--ink);
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: var(--ink);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  overflow: visible;
}

.card:hover {
  transform: translate(-6px, -6px);
  box-shadow: 8px 8px 0 var(--ink);
}

.card:hover .imageWrap {
  transform: translateY(-4px);
}

.featured {
  /* first card — large */
}

.secondary {
  margin-top: 30px;
}

.imageWrap {
  transition: transform 0.2s ease;
  border-bottom: 3px solid var(--ink);
}

.cardBody {
  padding: 28px 28px 32px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.industry {
  font-family: var(--font-mono), monospace;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.09em;
  color: var(--soft);
}

.client {
  font-family: var(--font-anton), sans-serif;
  font-size: clamp(28px, 4vw, 48px);
  text-transform: uppercase;
  line-height: 1;
  letter-spacing: 0.01em;
  margin: 0;
}

.outcome {
  font-family: var(--font-archivo), sans-serif;
  font-size: 15px;
  font-weight: 500;
  line-height: 1.5;
  color: var(--ink);
  flex: 1;
}

.stack {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 4px;
  margin-bottom: -20px;
  position: relative;
  z-index: 2;
}

.tag {
  font-family: var(--font-mono), monospace;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  border: 1px solid var(--ink);
  padding: 4px 8px;
  color: var(--ink);
  background: var(--bone);
}

.viewLink {
  font-family: var(--font-mono), monospace;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: var(--hot);
  margin-top: 20px;
}

@media (max-width: 700px) {
  .grid {
    grid-template-columns: 1fr;
  }

  .secondary {
    margin-top: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .card:hover {
    transform: none;
    box-shadow: 5px 5px 0 var(--ink);
  }

  .card:hover .imageWrap {
    transform: none;
  }
}
```

- [ ] **Step 3: Verify lint and build**

```bash
cd /Users/adi7192/Documents/TechwiseIQ/website
npm run lint && npm run build
```

- [ ] **Step 4: Commit**

```bash
cd /Users/adi7192/Documents/TechwiseIQ/website
git add src/components/CaseStudySection/
git commit -m "feat: case studies — magazine layout, placeholder images, scale reveal, enhanced hover"
```

---

### Task 13: Overhaul CTASection (split layout + geometric accent)

**Files:**
- Modify: `src/components/CTASection/index.tsx`
- Modify: `src/components/CTASection/CTASection.module.css`

Split layout — heading left, channels right. Geometric accent in the gap. Enhanced channel hover (hot bg, bone text).

- [ ] **Step 1: Update CTASection/index.tsx**

```tsx
import { GeometricAccents } from '@/components/ui'
import styles from './CTASection.module.css'

export default function CTASection() {
  return (
    <section className={styles.contact} id="contact">
      <div className="wrap">
        <span className={styles.label}>Got a bottleneck? Bring it.</span>
        <div className={styles.split}>
          <div className={styles.left} data-animate="slide-left">
            <h2 className={styles.heading}>
              START THE
              <br />
              CONVERSATION.
            </h2>
          </div>
          <div className={styles.accent}>
            <GeometricAccents variant="cta" />
          </div>
          <div className={styles.right} data-animate="slide-right" data-stagger="0.1">
            <a
              className={styles.channel}
              href="mailto:Info@techwiseiqtechnologies.ae"
            >
              <span className={styles.channelType}>Email</span>
              <span className={styles.channelValue}>
                Info@techwiseiqtechnologies.ae
              </span>
            </a>
            <a
              className={styles.channel}
              href="https://wa.me/971567760667"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className={styles.channelType}>WhatsApp</span>
              <span className={styles.channelValue}>Chat with us ↗</span>
            </a>
            {/* TODO: wire booking link */}
            <a className={styles.channel} href="#">
              <span className={styles.channelType}>Book a call</span>
              <span className={styles.channelValue}>20-min intro ↗</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Rewrite CTASection.module.css**

```css
.contact {
  padding: 96px 0 90px;
}

.label {
  font-family: var(--font-mono), monospace;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: var(--soft);
}

.split {
  display: grid;
  grid-template-columns: 55% 5% 40%;
  align-items: start;
  margin-top: 20px;
}

.left {
  /* heading side */
}

.heading {
  font-family: var(--font-anton), sans-serif;
  text-transform: uppercase;
  font-size: clamp(48px, 7vw, 108px);
  line-height: 1;
  letter-spacing: 0.005em;
  color: var(--ink);
}

.accent {
  position: relative;
  min-height: 200px;
}

.right {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-top: 10px;
}

.channel {
  display: flex;
  flex-direction: column;
  gap: 6px;
  border: var(--bd);
  padding: 20px 28px;
  background: var(--bone);
  box-shadow: var(--shadow);
  transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease, color 0.15s ease;
  min-width: 200px;
}

.channel:hover {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0 var(--ink);
  background: var(--hot);
}

.channel:hover .channelType {
  color: var(--bone);
  opacity: 0.8;
}

.channel:hover .channelValue {
  color: var(--bone);
}

.channelType {
  font-family: var(--font-mono), monospace;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--soft);
  transition: color 0.15s ease;
}

.channelValue {
  font-family: var(--font-mono), monospace;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.02em;
  color: var(--ink);
  transition: color 0.15s ease;
}

@media (max-width: 880px) {
  .split {
    grid-template-columns: 1fr;
    gap: 32px;
  }

  .accent {
    display: none;
  }

  .heading {
    margin-bottom: 12px;
  }
}
```

- [ ] **Step 3: Verify lint and build**

```bash
cd /Users/adi7192/Documents/TechwiseIQ/website
npm run lint && npm run build
```

- [ ] **Step 4: Commit**

```bash
cd /Users/adi7192/Documents/TechwiseIQ/website
git add src/components/CTASection/
git commit -m "feat: CTA — split layout, geometric accent, hot-fill channel hover"
```

---

### Task 14: Update page.tsx and clean up inter-section flow

**Files:**
- Modify: `src/app/page.tsx`
- Delete: `src/components/ui/RevealObserver.tsx`

Final assembly: swap RevealObserver for ScrollAnimator (if not already done in Task 2), remove the old RevealObserver file. Verify the full page flow.

- [ ] **Step 1: Delete RevealObserver**

```bash
cd /Users/adi7192/Documents/TechwiseIQ/website
rm src/components/ui/RevealObserver.tsx
```

- [ ] **Step 2: Verify page.tsx uses ScrollAnimator**

Ensure `src/app/page.tsx` imports `ScrollAnimator` (not `RevealObserver`) from `@/components/ui`. This should already be done from Task 2. If any `.rv` class references remain in page.tsx or other files, remove them.

- [ ] **Step 3: Verify lint and build**

```bash
cd /Users/adi7192/Documents/TechwiseIQ/website
npm run lint && npm run build
```

- [ ] **Step 4: Run dev server and visual check**

```bash
cd /Users/adi7192/Documents/TechwiseIQ/website
npm run dev
```

Open http://localhost:3000 and verify:
- Hero: Three.js wireframe visible, marquee rows animate, screenshot placeholder visible
- Manifesto: geometric accents orbit around centered text, word-lit scroll works
- Services: full-width rows, background numbers visible, visual panel shows on expand
- Ticker: slight parallax feel
- Process: staggered wave columns, ghost numbers behind
- Shout: rotateX heading entrance, floating wireframes, strike + outcomes burst
- Case Studies: magazine layout, placeholder images, scale hover
- CTA: split layout, channel cards hover to hot

- [ ] **Step 5: Commit**

```bash
cd /Users/adi7192/Documents/TechwiseIQ/website
git add -A
git commit -m "feat: complete visual overhaul — inter-section flow, cleanup RevealObserver"
```

---

### Task 15: Reduced-motion audit and final verification

**Files:**
- Potentially any file that needs fixes

- [ ] **Step 1: Test reduced-motion**

In browser DevTools, emulate `prefers-reduced-motion: reduce` and verify:
- All elements are immediately visible (no transforms, no opacity: 0)
- Three.js canvases show nothing (or a static fallback)
- No marquee animation, no parallax, no scroll effects
- All content is readable and accessible

- [ ] **Step 2: Fix any reduced-motion issues found**

If any elements are hidden or broken under reduced-motion, fix them. The `globals.css` catch-all (`animation: none !important; transition: none !important;`) should handle most cases. Ensure GSAP animations check for reduced-motion (already handled in ScrollAnimator).

- [ ] **Step 3: Run full lint + build**

```bash
cd /Users/adi7192/Documents/TechwiseIQ/website
npm run lint && npm run build
```

Both must pass with zero errors.

- [ ] **Step 4: Update changelog**

Add an entry to `website/docs/changelog.md`:

```markdown
## 2026-06-14 — Visual Overhaul

- **Animation system**: Replaced `.rv` IntersectionObserver with GSAP ScrollTrigger (slide-up, rotate-x, slide-left/right, scale, parallax)
- **Three.js**: Added wireframe icosahedron hero scene + floating shapes in Shout section
- **Hero**: Three.js background, floating project screenshot placeholder, stagger entry
- **Manifesto**: Orbiting SVG geometric accents with parallax, removed border-top
- **Services**: Full-width layout, giant parallax background numbers, visual panels with placeholder screenshots on expand
- **Process**: Staggered wave column heights, ghost parallax numbers, enhanced hover
- **Shout**: RotateX heading reveal, Three.js floating wireframes, enhanced strike-through + outcomes burst, removed border-top
- **Case Studies**: Magazine layout (58/38% asymmetric), placeholder images, scale reveal, enhanced hover
- **CTA**: Split layout (heading left, channels right), geometric accent, hot-fill channel hover
- **Inter-section flow**: Removed uniform borders, varied padding, visual continuity
- **Dependencies**: Added three, @react-three/fiber, @react-three/drei
```

- [ ] **Step 5: Final commit**

```bash
cd /Users/adi7192/Documents/TechwiseIQ/website
git add docs/changelog.md
git commit -m "docs: changelog entry for visual overhaul"
```
