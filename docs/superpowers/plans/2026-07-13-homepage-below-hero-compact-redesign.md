# Homepage Below-Hero Compact Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the homepage content below the existing Hero with the approved compact Problem → Services → Difference/Process → CTA experience, including responsive and accessible GSAP motion while leaving the Hero unchanged.

**Architecture:** Keep `src/app/page.tsx` and the new `HomeExperience` as Server Components so all copy and links render without client JavaScript. Put static content in a typed module, service-specific decorative visuals in a focused component, and all progressive animation in one leaf `HomeMotion` Client Component that enhances stable data attributes and handles reduced motion.

**Tech Stack:** Next.js 16 App Router, React 19 Server/Client Components, TypeScript, CSS Modules, `next/image`, GSAP 3 + ScrollTrigger, Playwright.

---

## File Structure

- Create `src/components/HomeExperience/home-content.ts` — typed problem, service, promise, process, and CTA content.
- Create `src/components/HomeExperience/ServiceVisuals.tsx` — decorative Web, Software, and AI scene visuals with no behavior or copy ownership.
- Create `src/components/HomeExperience/HomeMotion.tsx` — client-only GSAP/IntersectionObserver enhancement and reduced-motion lifecycle.
- Create `src/components/HomeExperience/HomeExperience.module.css` — complete desktop, tablet, mobile, focus, hover, active-motion, and reduced-motion styling.
- Create `src/components/HomeExperience/index.tsx` — semantic server-rendered below-Hero composition.
- Modify `src/app/page.tsx` — retain the existing Hero and replace the legacy below-Hero component sequence with `HomeExperience`.
- Create `tests/e2e/home-experience.spec.ts` — structure, content, CTA, responsive overflow, touch target, reduced-motion, and Hero-preservation contracts.

## Task 1: Lock the Homepage Contract with a Failing End-to-End Test

**Files:**
- Create: `tests/e2e/home-experience.spec.ts`

- [ ] **Step 1: Write the failing semantic and route contract**

```ts
import { expect, test } from '@playwright/test'

test('keeps the hero and replaces the below-hero story', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')

  await expect(page.locator('header').first().locator('.marquee-track')).toHaveCount(3)
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'Techwise IQ — the AI-first engineering agency.',
  )

  const experience = page.getByTestId('home-experience')
  await expect(experience).toBeVisible()
  await expect(experience.getByRole('heading', { name: /shouldn.t feel this manual/i })).toBeVisible()

  const serviceLinks = [
    ['Web Development', '/services/web'],
    ['Custom Software', '/services/software'],
    ['AI Automation', '/services/ai'],
  ] as const

  for (const [name, path] of serviceLinks) {
    const link = experience.getByRole('link', { name: new RegExp(`Explore ${name}`, 'i') })
    await expect(link).toHaveAttribute('href', path)
  }

  await expect(experience.getByText('Fixed scope', { exact: true })).toBeVisible()
  await expect(experience.getByText('Weekly demos', { exact: true })).toBeVisible()
  await expect(experience.getByRole('link', { name: /book a call/i })).toHaveAttribute(
    'href',
    /wa\.me\/971567760667/,
  )
  await expect(experience.getByRole('link', { name: /whatsapp/i })).toHaveAttribute(
    'href',
    'https://wa.me/971567760667',
  )
  await expect(experience.getByRole('link', { name: /enquiry/i })).toHaveAttribute(
    'href',
    '/contact',
  )

  await expect(experience.getByText('Selected work', { exact: true })).toHaveCount(0)
  await expect(experience.getByTestId('home-proof')).toHaveCount(0)
})
```

- [ ] **Step 2: Run the test and verify the new contract fails**

Run: `npx playwright test tests/e2e/home-experience.spec.ts --grep "keeps the hero"`

Expected: FAIL because `[data-testid="home-experience"]` does not exist.

- [ ] **Step 3: Commit the failing contract**

```bash
git add tests/e2e/home-experience.spec.ts
git commit -m "test: define compact homepage experience contract"
```

## Task 2: Add Typed Content and the Server-Rendered Experience

**Files:**
- Create: `src/components/HomeExperience/home-content.ts`
- Create: `src/components/HomeExperience/ServiceVisuals.tsx`
- Create: `src/components/HomeExperience/index.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Define the static content contract**

Create `home-content.ts` with exported readonly collections and a `HomeService` type:

```ts
export type HomeServiceId = 'web' | 'software' | 'ai'

export type HomeService = {
  id: HomeServiceId
  number: string
  outcome: string
  title: string
  summary: string
  deliverables: readonly string[]
  href: string
}

export const PROBLEM_SIGNALS = [
  'The website looks smaller than the business',
  'Busywork owns the calendar',
  'Your tools refuse to talk',
  'Good leads die in the handoff',
] as const

export const HOME_SERVICES: readonly HomeService[] = [
  {
    id: 'web',
    number: '001',
    outcome: 'Make choosing easy',
    title: 'Web Development',
    summary:
      'Strategy, design and development in one continuous build. Websites engineered to explain the business clearly and earn the next click.',
    deliverables: ['Marketing sites', 'E-commerce', 'CMS builds', 'SEO + GEO'],
    href: '/services/web',
  },
  {
    id: 'software',
    number: '002',
    outcome: 'Make operations lighter',
    title: 'Custom Software',
    summary:
      'Portals, dashboards, internal tools and products shaped around how your business actually runs.',
    deliverables: ['Web apps', 'Portals', 'APIs', 'Integrations', 'Legacy rebuilds'],
    href: '/services/software',
  },
  {
    id: 'ai',
    number: '003',
    outcome: 'Make repetition optional',
    title: 'AI Automation',
    summary:
      'Documents processed, emails triaged and reports assembled, with human review wherever judgment matters.',
    deliverables: ['Workflow automation', 'AI on your data', 'Document processing', 'AI audits'],
    href: '/services/ai',
  },
] as const

export const DELIVERY_PROMISES = [
  ['Fixed scope', 'Written before the build.'],
  ['Weekly demos', 'Progress you can click.'],
  ['Direct access', 'Talk to the builders.'],
  ['Clean ownership', 'Your product and code.'],
] as const

export const PROCESS_STEPS = [
  ['01', 'Diagnose', 'Map the bottleneck.'],
  ['02', 'Scope', 'Fix timeline and cost.'],
  ['03', 'Build', 'Demo every week.'],
  ['04', 'Run', 'Launch and hand over.'],
] as const
```

- [ ] **Step 2: Create service visuals with stable motion hooks**

Create `ServiceVisuals.tsx` exporting `ServiceVisual({ id })`. Render:

- Web: `next/image` using `/work/aaskra-hero.webp`, `width={1440}`, `height={900}`, `sizes="(max-width: 767px) calc(100vw - 40px), 50vw"`, descriptive alt text, and `data-home-web-image`.
- Software: four `aria-hidden` node labels and three nested line elements using `data-home-system-node`, `data-home-system-line`, and `data-home-system-core`.
- AI: `aria-hidden` document, human-review, connector, and result elements using `data-home-ai-input`, `data-home-ai-review`, and `data-home-ai-result`.

Use CSS module classes passed from the same folder; do not add client directives or event handlers.

- [ ] **Step 3: Create the semantic HomeExperience server component**

Create `index.tsx` that:

- imports `Link`, `BOOKING_URL`, `WHATSAPP_URL`, content constants, visuals, styles, and `HomeMotion`;
- renders one root `<div data-testid="home-experience" data-home-experience>`;
- renders `HomeMotion` as a leaf;
- uses `<section>` for Problem, Services introduction, each service, Difference, and CTA;
- renders service index and deliverables as lists;
- uses one `h2` per top-level scene and `h3` for each service;
- renders explicit accessible link names `Explore Web Development`, `Explore Custom Software`, and `Explore AI Automation`;
- renders Book a call, WhatsApp, and Enquiry with the destinations required by Task 1;
- marks diagrams and oversized numbers `aria-hidden="true"`.

- [ ] **Step 4: Replace only the below-Hero composition in the route**

Modify `src/app/page.tsx` imports and JSX to keep:

```tsx
<ScrollAnimator />
<VelocitySkewObserver />
<Nav />
<main>
  <Hero />
  <HomeExperience />
</main>
<Footer />
```

Remove the route imports and render calls for `Manifesto`, `ServicesSection`, `Ticker`, `ProcessSection`, `ShoutSection`, `CaseStudySection`, and `CTASection`. Do not delete their component files.

- [ ] **Step 5: Run the semantic test**

Run: `npx playwright test tests/e2e/home-experience.spec.ts --grep "keeps the hero"`

Expected: PASS.

- [ ] **Step 6: Run lint**

Run: `npm run lint`

Expected: PASS with no ESLint errors.

- [ ] **Step 7: Commit server-rendered content**

```bash
git add src/app/page.tsx src/components/HomeExperience tests/e2e/home-experience.spec.ts
git commit -m "feat: build compact homepage story"
```

## Task 3: Implement the Compact Kinetic Layout and Responsive Composition

**Files:**
- Create: `src/components/HomeExperience/HomeExperience.module.css`
- Modify: `src/components/HomeExperience/ServiceVisuals.tsx`
- Modify: `src/components/HomeExperience/index.tsx`
- Modify: `tests/e2e/home-experience.spec.ts`

- [ ] **Step 1: Add responsive layout assertions before styling**

Append this test:

```ts
for (const viewport of [
  { width: 375, height: 667 },
  { width: 768, height: 900 },
  { width: 1440, height: 1000 },
]) {
  test(`keeps the compact experience inside ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport)
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')

    const experience = page.getByTestId('home-experience')
    await expect(experience).toBeVisible()
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true)

    const ctas = experience.locator('[data-home-cta-link]')
    await expect(ctas).toHaveCount(3)
    for (const cta of await ctas.all()) {
      const box = await cta.boundingBox()
      expect(box).not.toBeNull()
      expect(box!.height).toBeGreaterThanOrEqual(44)
    }

    const sections = experience.locator(':scope > section')
    expect(await sections.count()).toBe(7)
  })
}
```

- [ ] **Step 2: Run the responsive test and verify it fails before CSS is complete**

Run: `npx playwright test tests/e2e/home-experience.spec.ts --grep "keeps the compact"`

Expected: FAIL on CTA sizing and/or responsive overflow.

- [ ] **Step 3: Implement the CSS Module**

Build `HomeExperience.module.css` using only existing tokens. Required selector groups:

```css
.experience { overflow: clip; background: var(--bone); }
.sceneLabel { font: 700 0.68rem/1 var(--font-mono); text-transform: uppercase; letter-spacing: .08em; }
.problem { background: var(--ink); color: var(--bone); clip-path: polygon(0 0, 100% 3%, 100% 100%, 0 97%); }
.servicesIntro { background: var(--bone); text-align: center; }
.serviceScene { position: relative; overflow: hidden; }
.web { background: var(--bone); }
.software { background: var(--ink); color: var(--bone); clip-path: polygon(0 3%, 100% 0, 100% 97%, 0 100%); }
.ai { background: var(--sun); color: var(--ink); }
.difference { background: var(--ink); color: var(--bone); clip-path: polygon(0 0, 100% 3%, 100% 100%, 0 97%); }
.finalCta { background: var(--hot); color: var(--ink); }
```

Complete the module so that:

- desktop Problem uses two columns and compact `clamp()` padding;
- signals are editorial strips with bounded 1–2 degree rotations;
- Services introduction is centered and shorter than a viewport;
- each service uses a two-column asymmetric composition and `min-height` between 520px and 650px;
- Web image uses a bordered, overflow-hidden frame and hard hot shadow;
- Software system nodes and AI flow use absolute positioning only inside their visual containers;
- Difference contains promises plus process in one scene;
- CTA actions use a three-column hierarchy, with Book a call visually dominant;
- tablet uses two-by-two promises/process and reduced travel/rotation;
- below 768px, copy precedes visuals, process is vertical, CTA links stack, gutters are at least 20px, and no decorative element can produce horizontal scroll;
- focus-visible states meet the existing 3px brand outline vocabulary;
- touch targets are at least 44px high;
- no body copy is hot-on-bone or bone-on-hot.

- [ ] **Step 4: Run responsive and semantic tests**

Run: `npx playwright test tests/e2e/home-experience.spec.ts`

Expected: all tests PASS.

- [ ] **Step 5: Run the protected mobile Hero test**

Run: `npx playwright test tests/e2e/mobile-hero.spec.ts`

Expected: all 6 tests PASS.

- [ ] **Step 6: Commit the responsive visual system**

```bash
git add src/components/HomeExperience tests/e2e/home-experience.spec.ts
git commit -m "feat: style compact homepage experience"
```

## Task 4: Add Purposeful Scroll and Hover Motion

**Files:**
- Create: `src/components/HomeExperience/HomeMotion.tsx`
- Modify: `src/components/HomeExperience/HomeExperience.module.css`
- Modify: `tests/e2e/home-experience.spec.ts`

- [ ] **Step 1: Add reduced-motion and active-motion tests**

Append:

```ts
test('renders meaningful final states with reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')

  const experience = page.getByTestId('home-experience')
  await expect(experience).toHaveAttribute('data-motion', 'reduced')
  await expect(experience.locator('[data-home-reveal]').first()).toBeVisible()

  const transforms = await experience.locator('[data-home-reveal]').evaluateAll((nodes) =>
    nodes.map((node) => getComputedStyle(node).transform),
  )
  expect(transforms.every((value) => value === 'none')).toBe(true)
})

test('initializes active motion without hiding content permanently', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/')

  const experience = page.getByTestId('home-experience')
  await expect(experience).toHaveAttribute('data-motion', 'active')
  await experience.scrollIntoViewIfNeeded()
  await expect(experience.locator('[data-home-reveal]').first()).toHaveAttribute(
    'data-visible',
    'true',
  )
})
```

- [ ] **Step 2: Run motion tests and verify failure**

Run: `npx playwright test tests/e2e/home-experience.spec.ts --grep "motion|active"`

Expected: FAIL because `HomeMotion` has not set `data-motion` or reveal states.

- [ ] **Step 3: Implement HomeMotion lifecycle**

Create `HomeMotion.tsx` with:

```tsx
'use client'

import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function HomeMotion() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>('[data-home-experience]')
    if (!root) return

    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    let disposeMode = () => {}

    const applyMode = (reduced: boolean) => {
      disposeMode()
      const reveals = Array.from(root.querySelectorAll<HTMLElement>('[data-home-reveal]'))

      if (reduced) {
        root.dataset.motion = 'reduced'
        reveals.forEach((element) => {
          element.dataset.visible = 'true'
          gsap.set(element, { clearProps: 'all' })
        })
        disposeMode = () => {}
        return
      }

      root.dataset.motion = 'active'
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          ;(entry.target as HTMLElement).dataset.visible = 'true'
          observer.unobserve(entry.target)
        })
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.1 })

      reveals.forEach((element) => observer.observe(element))

      const media = gsap.matchMedia()
      const context = gsap.context(() => {
        media.add('(min-width: 768px)', () => {
          const problem = root.querySelector<HTMLElement>('[data-home-problem]')
          if (problem) {
            gsap.fromTo(
              problem.querySelectorAll<HTMLElement>('[data-home-signal]'),
              { x: 48, opacity: 0, rotate: 0 },
              {
                x: 0,
                opacity: 1,
                duration: 0.42,
                stagger: 0.04,
                ease: 'power3.out',
                scrollTrigger: { trigger: problem, start: 'top 72%' },
              },
            )
          }

          const webScene = root.querySelector<HTMLElement>('[data-home-service="web"]')
          const webFrame = webScene?.querySelector<HTMLElement>('[data-home-web-frame]')
          const webImage = webScene?.querySelector<HTMLElement>('[data-home-web-image]')
          if (webScene && webFrame) {
            gsap.fromTo(
              webFrame,
              { xPercent: 6, scale: 0.96, rotate: 2 },
              {
                xPercent: 0,
                scale: 1,
                rotate: 0,
                ease: 'none',
                scrollTrigger: {
                  trigger: webScene,
                  start: 'top bottom',
                  end: 'bottom top',
                  scrub: 0.5,
                },
              },
            )
          }
          if (webScene && webImage) {
            gsap.fromTo(
              webImage,
              { yPercent: -2 },
              {
                yPercent: 2,
                ease: 'none',
                scrollTrigger: {
                  trigger: webScene,
                  start: 'top bottom',
                  end: 'bottom top',
                  scrub: 0.5,
                },
              },
            )
          }

          const software = root.querySelector<HTMLElement>('[data-home-service="software"]')
          if (software) {
            gsap.timeline({ scrollTrigger: { trigger: software, start: 'top 70%' } })
              .fromTo(
                software.querySelectorAll<HTMLElement>('[data-home-system-node]'),
                { x: 30, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.38, stagger: 0.04, ease: 'power3.out' },
              )
              .fromTo(
                software.querySelectorAll<HTMLElement>('[data-home-system-line] > i'),
                { scaleX: 0 },
                { scaleX: 1, duration: 0.32, stagger: 0.04, ease: 'power2.out' },
                0.08,
              )
          }

          const ai = root.querySelector<HTMLElement>('[data-home-service="ai"]')
          const aiInput = ai?.querySelector<HTMLElement>('[data-home-ai-input]')
          const aiReview = ai?.querySelector<HTMLElement>('[data-home-ai-review]')
          const aiResult = ai?.querySelector<HTMLElement>('[data-home-ai-result]')
          if (ai && aiInput && aiReview && aiResult) {
            gsap.timeline({ scrollTrigger: { trigger: ai, start: 'top 70%' } })
              .fromTo(aiInput, { xPercent: -8, opacity: 0 }, { xPercent: 0, opacity: 1, duration: 0.4 })
              .fromTo(aiReview, { scale: 0.96 }, { scale: 1.05, duration: 0.2, yoyo: true, repeat: 1 })
              .fromTo(aiResult, { xPercent: 8, opacity: 0 }, { xPercent: 0, opacity: 1, duration: 0.4 })
          }

          const difference = root.querySelector<HTMLElement>('[data-home-difference]')
          if (difference) {
            gsap.timeline({ scrollTrigger: { trigger: difference, start: 'top 72%' } })
              .fromTo('[data-home-strike]', { scaleX: 0 }, { scaleX: 1, duration: 0.35, transformOrigin: 'left' })
              .fromTo('[data-home-outcomes]', { scale: 0.96, opacity: 0.6 }, { scale: 1, opacity: 1, duration: 0.25 })
              .fromTo('[data-home-promise]', { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, stagger: 0.04 }, 0.12)
              .fromTo('[data-home-process-current]', { scaleX: 0 }, { scaleX: 1, duration: 0.45, transformOrigin: 'left' }, 0.2)
              .fromTo('[data-home-process-marker]', { scale: 0.94 }, { scale: 1.05, duration: 0.2, stagger: 0.04 }, 0.28)
          }
        })
      }, root)

      ScrollTrigger.refresh()
      disposeMode = () => {
        observer.disconnect()
        media.revert()
        context.revert()
      }
    }

    const onPreferenceChange = (event: MediaQueryListEvent) => applyMode(event.matches)
    applyMode(preference.matches)
    preference.addEventListener('change', onPreferenceChange)

    return () => {
      preference.removeEventListener('change', onPreferenceChange)
      disposeMode()
      delete root.dataset.motion
    }
  }, [])

  return null
}
```

The implementation must use these bounded values exactly or reduce them during visual polish. Do not add pinning, scroll snapping, width/height/top/left/filter animation, or independent ambient loops.

- [ ] **Step 4: Add active/reduced CSS states and interaction motion**

Use CSS selectors so content is visible by default and only receives initial reveal styling after `data-motion="active"` is present:

```css
.experience[data-motion='active'] [data-home-reveal] {
  opacity: 0;
  transform: translateY(28px);
}

.experience[data-motion='active'] [data-home-reveal][data-visible='true'] {
  opacity: 1;
  transform: translateY(0);
  transition: opacity 380ms ease, transform 380ms ease;
}

.experience[data-motion='reduced'] [data-home-reveal] {
  opacity: 1;
  transform: none;
}
```

Add hover/focus behavior:

- service links: orange underline sweep and arrow translate ≤8px;
- Web frame: internal image scale ≤1.03 when its service link or scene has `:focus-within`/hover;
- Software core: hot/sun fill response on link hover/focus;
- CTA primary: existing hard-shadow press response;
- CTA secondary links: local background and 4px arrow shift;
- all hover effects have `:focus-visible` or `:focus-within` equivalents.

- [ ] **Step 5: Run motion tests**

Run: `npx playwright test tests/e2e/home-experience.spec.ts --grep "motion|active"`

Expected: PASS.

- [ ] **Step 6: Run the complete new test file**

Run: `npx playwright test tests/e2e/home-experience.spec.ts`

Expected: all tests PASS.

- [ ] **Step 7: Commit motion**

```bash
git add src/components/HomeExperience tests/e2e/home-experience.spec.ts
git commit -m "feat: animate homepage story"
```

## Task 5: Visual Inspection and Responsive Polish

**Files:**
- Modify: `src/components/HomeExperience/HomeExperience.module.css`
- Modify: `src/components/HomeExperience/HomeMotion.tsx` only if inspection reveals a bounded motion defect

- [ ] **Step 1: Start the isolated development server**

Run: `npm run dev -- --hostname 127.0.0.1 --port 3113`

Expected: Next.js reports Ready and serves `http://127.0.0.1:3113/`.

- [ ] **Step 2: Capture full-page screenshots**

Capture reduced-motion screenshots at 375×844, 768×900, and 1440×1000 using Playwright and Chrome. Save them to `/tmp/home-experience-375.png`, `/tmp/home-experience-768.png`, and `/tmp/home-experience-1440.png`.

Expected: all images render the unchanged Hero, Problem, all three services, compact Difference/Process, CTA, and Footer with no Work/Proof section.

- [ ] **Step 3: Inspect section handoffs and compactness**

Confirm visually:

- no large empty vertical gaps;
- Problem strips do not clip essential text;
- all three service titles are immediately readable;
- service visuals do not overlap copy at any target viewport;
- Difference and Process read as one scene;
- CTA hierarchy is Book a call → WhatsApp / Enquiry;
- no horizontal scrollbar or clipped focus outline.

- [ ] **Step 4: Apply only evidence-driven CSS corrections**

Adjust existing CSS module values for spacing, font clamps, overlaps, or visual container dimensions. Do not add new sections, dependencies, claims, effects, or media.

- [ ] **Step 5: Re-run screenshot capture after corrections**

Expected: all three target screenshots satisfy Step 3.

- [ ] **Step 6: Commit responsive polish**

```bash
git add src/components/HomeExperience/HomeExperience.module.css src/components/HomeExperience/HomeMotion.tsx
git commit -m "fix: polish homepage responsive flow"
```

## Task 6: Final Verification

**Files:**
- Verify only

- [ ] **Step 1: Run lint**

Run: `npm run lint`

Expected: PASS with no errors.

- [ ] **Step 2: Run the new homepage suite**

Run: `npx playwright test tests/e2e/home-experience.spec.ts`

Expected: all tests PASS.

- [ ] **Step 3: Run protected Hero and related page suites**

Run: `npx playwright test tests/e2e/mobile-hero.spec.ts tests/e2e/services-experience.spec.ts tests/e2e/work-page.spec.ts`

Expected: all tests PASS.

- [ ] **Step 4: Run production build**

Run: `npm run build`

Expected: Next.js production build completes successfully with `/` generated and no type errors.

- [ ] **Step 5: Verify the branch diff**

Run: `git status --short` and `git diff main...HEAD --check`

Expected: no uncommitted production changes and no whitespace errors.

- [ ] **Step 6: Record final verification in the implementation handoff**

Report the exact lint, Playwright, and production-build results in the final handoff; do not add a documentation-only commit.
