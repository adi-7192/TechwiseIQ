# Robot Video Hero — Services Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a mouse-scrub robot video as the full-screen background of the services page hero section, with an ink overlay for text legibility and full reduced-motion support.

**Architecture:** A new `"use client"` component `RobotVideo` renders an `<video>` element absolutely positioned inside the hero. A `mousemove` listener on `window` scrubs `video.currentTime` proportional to horizontal delta; an `onSeeked` handler prevents seek flooding. An ink overlay div ensures text contrast. The hero section gets `position: relative; overflow: hidden; isolation: isolate` so the video is contained to the hero only.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript strict, CSS Modules, Tailwind v4

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `src/components/RobotVideo/index.tsx` | Create | Video element + mouse-scrub logic |
| `src/components/RobotVideo/RobotVideo.module.css` | Create | Absolute-fill video styles |
| `src/app/services/services.module.css` | Modify | Hero containment + text color on dark bg + overlay + content z-index |
| `src/app/services/page.tsx` | Modify | Import RobotVideo, add overlay div, wrap content in heroContent |

---

### Task 1: Create RobotVideo component

**Files:**
- Create: `src/components/RobotVideo/index.tsx`
- Create: `src/components/RobotVideo/RobotVideo.module.css`

- [ ] **Step 1: Create `RobotVideo.module.css`**

```css
/* src/components/RobotVideo/RobotVideo.module.css */
.video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 70% center;
  pointer-events: none;
  z-index: 0;
}
```

- [ ] **Step 2: Create `index.tsx`**

```tsx
'use client'

import { useEffect, useRef } from 'react'
import styles from './RobotVideo.module.css'

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260530_042513_df96a13b-6155-4f6e-8b93-c9dee66fba08.mp4'

const SENSITIVITY = 0.8

export default function RobotVideo() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mq.matches) return

    const video = videoRef.current
    if (!video) return

    let prevX: number | null = null
    let targetTime = 0
    let isSeeking = false

    const onSeeked = () => {
      if (Math.abs(video.currentTime - targetTime) > 0.01) {
        video.currentTime = targetTime
      } else {
        isSeeking = false
      }
    }

    const onMouseMove = (e: MouseEvent) => {
      if (prevX === null) {
        prevX = e.clientX
        return
      }
      const delta = e.clientX - prevX
      prevX = e.clientX
      if (!video.duration) return
      const offset = (delta / window.innerWidth) * SENSITIVITY * video.duration
      targetTime = Math.max(0, Math.min(video.duration, targetTime + offset))
      if (!isSeeking) {
        video.currentTime = targetTime
        isSeeking = true
      }
    }

    video.addEventListener('seeked', onSeeked)
    window.addEventListener('mousemove', onMouseMove)

    return () => {
      video.removeEventListener('seeked', onSeeked)
      window.removeEventListener('mousemove', onMouseMove)
    }
  }, [])

  return (
    <video
      ref={videoRef}
      className={styles.video}
      src={VIDEO_URL}
      muted
      playsInline
      preload="auto"
      aria-hidden="true"
    />
  )
}
```

- [ ] **Step 3: Verify lint**

Run from `website/`:
```bash
npm run lint -- --file src/components/RobotVideo/index.tsx
```
Expected: 0 errors, 0 warnings.

- [ ] **Step 4: Commit**

```bash
git add src/components/RobotVideo/
git commit -m "feat: add RobotVideo component — mouse-scrub video background"
```

---

### Task 2: Update services hero CSS

**Files:**
- Modify: `src/app/services/services.module.css`

Current `.hero`:
```css
.hero {
  padding: 160px 0 96px;
  border-bottom: var(--bd);
}
```

- [ ] **Step 1: Update `.hero` and add new classes**

Replace the **entire** contents of `src/app/services/services.module.css` with:

```css
.hero {
  position: relative;
  overflow: hidden;
  isolation: isolate;
  padding: 160px 0 96px;
  border-bottom: var(--bd);
}

.overlay {
  position: absolute;
  inset: 0;
  background: rgba(16, 16, 16, 0.55);
  pointer-events: none;
  z-index: 1;
}

.heroContent {
  position: relative;
  z-index: 2;
}

.label {
  font-family: var(--font-mono), monospace;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: var(--soft-dark);
}

.title {
  font-family: var(--font-anton), sans-serif;
  text-transform: uppercase;
  font-size: clamp(40px, 7.5vw, 110px);
  line-height: 0.95;
  letter-spacing: 0.005em;
  margin-top: 16px;
  color: var(--bone);
}

.titleAccent {
  color: var(--hot);
}

.intro {
  margin-top: 28px;
  font-size: 16.5px;
  font-weight: 500;
  max-width: 56ch;
  color: rgba(242, 240, 233, 0.8);
}

.list {
  border-top: var(--bd);
}

.svc {
  border-bottom: var(--bd);
  display: block;
  transition: background 0.2s;
}

.svc:hover {
  background: #ece9e0;
}

.row {
  display: flex;
  align-items: baseline;
  gap: 28px;
  padding: 30px 0;
  transition: padding-left 0.25s ease;
}

.svc:hover .row {
  padding-left: 22px;
}

.num {
  font-family: var(--font-mono), monospace;
  font-size: 14px;
  color: var(--hot);
  min-width: 46px;
  flex-shrink: 0;
}

.svcTitle {
  font-family: var(--font-anton), sans-serif;
  text-transform: uppercase;
  font-size: clamp(34px, 6.2vw, 86px);
  line-height: 0.96;
  letter-spacing: 0.005em;
  flex: 1;
  transition: color 0.2s ease, -webkit-text-stroke 0.2s ease;
}

.svc:hover .svcTitle {
  color: transparent;
  -webkit-text-stroke: 2px var(--ink);
}

.arr {
  font-family: var(--font-anton), sans-serif;
  font-size: clamp(26px, 3.6vw, 48px);
  color: var(--hot);
  transform: translateX(-14px);
  opacity: 0;
  transition: transform 0.25s ease, opacity 0.25s ease;
  flex-shrink: 0;
}

.svc:hover .arr {
  opacity: 1;
  transform: translateX(0);
}

.tagline {
  display: block;
  font-family: var(--font-mono), monospace;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: var(--soft);
  margin-top: 8px;
}

@media (max-width: 600px) {
  .hero {
    padding: 120px 0 64px;
  }

  .row {
    gap: 14px;
    padding: 22px 0;
  }

  .num {
    min-width: 30px;
    font-size: 12px;
  }

  .tagline {
    display: none;
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/services/services.module.css
git commit -m "feat: update services hero CSS for dark video background"
```

---

### Task 3: Wire RobotVideo into the services page

**Files:**
- Modify: `src/app/services/page.tsx`

- [ ] **Step 1: Update `page.tsx`**

Replace the file with:

```tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import CTASection from '@/components/CTASection'
import RobotVideo from '@/components/RobotVideo'
import { RevealObserver } from '@/components/ui'
import styles from './services.module.css'

export const metadata: Metadata = {
  title: 'Services',
  description:
    'Web development, custom software, and AI automation — scoped tight, shipped weekly, priced in writing. Based in Dubai, serving clients worldwide.',
  openGraph: {
    title: 'Services | Techwise IQ',
    description:
      'Web development, custom software, and AI automation — scoped tight, shipped weekly, priced in writing.',
    url: 'https://techwiseiq.com/services',
  },
}

const SERVICES = [
  {
    num: '001',
    title: 'Web Development',
    tagline: 'Marketing sites, e-commerce, CMS — custom design every time',
    href: '/services/web',
  },
  {
    num: '002',
    title: 'Custom Software',
    tagline: 'Portals, dashboards, APIs, mobile apps — built for how you operate',
    href: '/services/software',
  },
  {
    num: '003',
    title: 'AI Automation',
    tagline: 'Workflow automation, AI assistants, document processing',
    href: '/services/ai',
  },
]

export default function ServicesPage() {
  return (
    <>
      <RevealObserver />
      <Nav />
      <main>
        <section className={styles.hero}>
          <RobotVideo />
          <div className={styles.overlay} aria-hidden="true" />
          <div className={`wrap ${styles.heroContent}`}>
            <span className={styles.label}>What we do — 001 to 003</span>
            <h1 className={`${styles.title} rv`}>
              Three pillars.
              <br />
              <span className={styles.titleAccent}>One outcome.</span>
            </h1>
            <p className={`${styles.intro} rv rv-d1`}>
              Web development, custom software, AI automation. Each scoped tight,
              shipped weekly, priced in writing.
            </p>
          </div>
        </section>

        <section className={styles.list}>
          <div className="wrap">
            {SERVICES.map((svc, i) => (
              <Link
                key={svc.num}
                href={svc.href}
                className={`${styles.svc} rv${i === 1 ? ' rv-d1' : ''}${i === 2 ? ' rv-d2' : ''}`}
              >
                <div className={styles.row}>
                  <span className={styles.num}>{svc.num}</span>
                  <div style={{ flex: 1 }}>
                    <span className={styles.svcTitle}>{svc.title}</span>
                    <span className={styles.tagline}>{svc.tagline}</span>
                  </div>
                  <span className={styles.arr} aria-hidden="true">
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <CTASection />
      </main>
      <Footer />
    </>
  )
}
```

- [ ] **Step 2: Run lint**

```bash
npm run lint
```
Expected: 0 errors.

- [ ] **Step 3: Run build**

```bash
npm run build
```
Expected: Build completes successfully, no TypeScript errors.

- [ ] **Step 4: Visual check**

```bash
npm run dev
```
Open `http://localhost:3000/services`. Verify:
- Robot video is visible behind the hero text
- Moving mouse left/right scrubs the video
- "Three pillars." is `--bone` (cream), "One outcome." is `--hot` (orange)
- Intro text is legible (slightly dimmed bone)
- No video visible outside the hero section (scroll down — list section shows bone background)
- Resize to mobile: hero text still readable

- [ ] **Step 5: Commit**

```bash
git add src/app/services/page.tsx
git commit -m "feat: wire RobotVideo into services hero with ink overlay"
```
