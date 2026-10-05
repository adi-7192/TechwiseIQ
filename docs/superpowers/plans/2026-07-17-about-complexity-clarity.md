> **Historical (written for the Kinetic design, deleted — D-028).** Kept for reference only; do not build from it.
> Current: `docs/site-spec.md`, `docs/design-system.md`, `docs/DECISIONS.md`.

# About Complexity to Clarity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the outdated `/about` route with the approved four-scene Complexity → Clarity React experience for non-technical business owners.

**Architecture:** Keep the route and all approved content in Server Components so Next.js prerenders meaningful HTML. Put static content in a typed colocated module, visual composition in `AboutExperience`, and all browser-only GSAP/ScrollTrigger behavior in one leaf `AboutMotion` Client Component that progressively enhances stable data attributes and fully supports reduced motion.

**Tech Stack:** Next.js 16 App Router, React 19 Server/Client Components, TypeScript, CSS Modules, GSAP 3 + ScrollTrigger, Playwright.

---

## File Structure

- Create `src/components/AboutExperience/about-content.ts` — typed problem fragments, expertise transformations, and culture principles.
- Create `src/components/AboutExperience/index.tsx` — semantic server-rendered four-scene composition.
- Create `src/components/AboutExperience/AboutExperience.module.css` — Kinetic visual system, sticky desktop scenes, responsive flow, and motion states.
- Create `src/components/AboutExperience/AboutMotion.tsx` — isolated client-only GSAP enhancement and reduced-motion lifecycle.
- Modify `src/app/about/page.tsx` — retain metadata, JSON-LD, navigation, and footer while replacing the legacy route markup with `AboutExperience`.
- Delete `src/app/about/about.module.css` — remove obsolete route-level styling after the component module replaces it.
- Create `tests/e2e/about-experience.spec.ts` — content, honesty, responsive, no-JavaScript, reduced-motion, and active-motion contracts.
- Modify `docs/changelog.md` — record the completed About redesign after verification.

## Task 1: Lock the Approved Semantic Contract

**Files:**
- Create: `tests/e2e/about-experience.spec.ts`

- [ ] **Step 1: Write the failing content and honesty contract**

Create `tests/e2e/about-experience.spec.ts`:

```ts
import { expect, test } from '@playwright/test'

test('renders the approved four-scene About story', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/about')

  const experience = page.getByTestId('about-experience')
  await expect(experience).toBeVisible()
  await expect(
    experience.getByRole('heading', {
      level: 1,
      name: 'We make complex feel clear.',
    }),
  ).toBeVisible()

  await expect(experience.locator(':scope > section')).toHaveCount(4)
  await expect(
    experience.getByRole('heading', {
      name: /technology should make the business simpler/i,
    }),
  ).toBeVisible()
  await expect(experience.getByText('Ownership', { exact: true })).toBeVisible()
  await expect(experience.getByText('Clarity', { exact: true })).toBeVisible()
  await expect(experience.getByText('Momentum', { exact: true })).toBeVisible()
  await expect(
    experience.getByRole('heading', {
      name: 'Built in Dubai. Working beyond borders.',
    }),
  ).toBeVisible()

  const cta = experience.getByRole('link', {
    name: /bring us the business problem/i,
  })
  await expect(cta).toHaveAttribute('href', /wa\.me\/971567760667/)

  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1)
})

test('keeps About proof qualitative and removes individual profiles', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/about')

  const main = page.locator('main')
  await expect(
    main.getByText('Trusted by businesses in Dubai and beyond', {
      exact: false,
    }),
  ).toBeVisible()

  for (const forbidden of [
    /note from the founder/i,
    /small team/i,
    /founder, techwise iq/i,
    /two hundred/i,
  ]) {
    await expect(main.getByText(forbidden)).toHaveCount(0)
  }
})
```

- [ ] **Step 2: Run the focused test and verify it fails**

Run:

```bash
npx playwright test tests/e2e/about-experience.spec.ts --grep "approved four-scene"
```

Expected: FAIL because `[data-testid="about-experience"]` does not exist.

- [ ] **Step 3: Commit the failing contract**

```bash
git add tests/e2e/about-experience.spec.ts
git commit -m "test: define about experience contract"
```

## Task 2: Build the Server-Rendered React Experience

**Files:**
- Create: `src/components/AboutExperience/about-content.ts`
- Create: `src/components/AboutExperience/index.tsx`
- Create: `src/components/AboutExperience/AboutExperience.module.css`
- Modify: `src/app/about/page.tsx`
- Delete: `src/app/about/about.module.css`
- Test: `tests/e2e/about-experience.spec.ts`

- [ ] **Step 1: Add the approved typed content**

Create `src/components/AboutExperience/about-content.ts`:

```ts
export const ABOUT_PROBLEMS = [
  'Underperforming website',
  'Manual daily work',
  'Disconnected systems',
  'Technical uncertainty',
  'Growth bottlenecks',
] as const

export const EXPERTISE_PATHS = [
  {
    problem: 'A website that undersells you',
    outcome: 'A digital presence built to earn attention and action.',
  },
  {
    problem: 'Work trapped in spreadsheets',
    outcome: 'Software shaped around how your operation actually runs.',
  },
  {
    problem: 'Repetitive work slowing people down',
    outcome: 'AI automation with clear human control.',
  },
] as const

export const CULTURE_PRINCIPLES = [
  {
    title: 'Ownership',
    body: 'We recommend the path and take responsibility for delivery.',
  },
  {
    title: 'Clarity',
    body: 'Plain language, written scope, and progress you can see.',
  },
  {
    title: 'Momentum',
    body: 'Fewer hand-offs. Working progress. Decisions turned into useful outcomes.',
  },
] as const
```

- [ ] **Step 2: Create the semantic Server Component**

Create `src/components/AboutExperience/index.tsx`:

```tsx
import { BOOKING_URL } from '@/lib/site'
import AboutMotion from './AboutMotion'
import {
  ABOUT_PROBLEMS,
  CULTURE_PRINCIPLES,
  EXPERTISE_PATHS,
} from './about-content'
import styles from './AboutExperience.module.css'

export default function AboutExperience() {
  return (
    <div
      className={styles.experience}
      data-about-experience
      data-testid="about-experience"
    >
      <AboutMotion />

      <section className={styles.hero} data-about-hero>
        <div className={styles.heroStage}>
          <ul className="sr-only" aria-label="Business bottlenecks we help resolve">
            {ABOUT_PROBLEMS.map((problem) => <li key={problem}>{problem}</li>)}
          </ul>
          <div className={styles.fragmentField} aria-hidden="true">
            {ABOUT_PROBLEMS.map((problem) => (
              <span className={styles.fragment} data-about-fragment key={problem}>
                {problem}
              </span>
            ))}
          </div>
          <div className={styles.heroContent}>
            <p className={styles.sceneLabel}>About Techwise IQ / Dubai</p>
            <h1 className={styles.heroTitle}>
              We make complex <em>feel clear.</em>
            </h1>
            <p className={styles.heroBody}>
              Techwise IQ turns business bottlenecks into websites, software
              and AI systems that move the work forward. You bring the goal.
              We own the technical path.
            </p>
            <span className={styles.scrollCue} aria-hidden="true">
              Scroll to bring the pieces together ↓
            </span>
          </div>
        </div>
      </section>

      <section className={styles.expertise} data-about-expertise>
        <div className={styles.inner}>
          <p className={styles.sceneLabel}>What we bring to the problem</p>
          <h2 className={styles.sectionTitle}>
            Technology should make the business simpler—not give it more to
            manage.
          </h2>
          <ol className={styles.pathList}>
            {EXPERTISE_PATHS.map((path, index) => (
              <li className={styles.path} data-about-path key={path.problem}>
                <span className={styles.pathNumber}>0{index + 1}</span>
                <strong>{path.problem}</strong>
                <span className={styles.pathArrow} aria-hidden="true">→</span>
                <p>{path.outcome}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className={styles.culture} data-about-culture>
        <div className={styles.cultureStage}>
          <div className={styles.cultureIntro}>
            <p className={styles.sceneLabel}>How we behave when the work gets real</p>
            <h2 className="sr-only">Our operating culture</h2>
          </div>
          <div className={styles.culturePanels}>
            {CULTURE_PRINCIPLES.map((principle, index) => (
              <article
                className={styles.culturePanel}
                data-about-culture-panel
                key={principle.title}
              >
                <span>0{index + 1}</span>
                <h3>{principle.title}</h3>
                <p>{principle.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.closing} data-about-closing>
        <div className={styles.targetMotif} aria-hidden="true" />
        <div className={styles.closingContent} data-about-closing-content>
          <p className={styles.sceneLabel}>Dubai / Working beyond borders</p>
          <h2 className={styles.closingTitle}>
            Built in Dubai. <em>Working beyond borders.</em>
          </h2>
          <p className={styles.closingBody}>
            Trusted by businesses in Dubai and beyond to turn important ideas
            into working digital products.
          </p>
          <a className={styles.cta} href={BOOKING_URL}>
            Bring us the business problem <span aria-hidden="true">→</span>
          </a>
        </div>
      </section>
    </div>
  )
}
```

- [ ] **Step 3: Add a minimal non-animated CSS module**

Create `src/components/AboutExperience/AboutExperience.module.css` with the selectors required by the component and these initial rules:

```css
.experience { overflow: clip; background: var(--bone); }
.heroStage,
.expertise,
.culture,
.closing { position: relative; }
.heroContent,
.inner,
.cultureStage,
.closingContent { width: min(100% - 40px, var(--max)); margin-inline: auto; }
.fragmentField { display: none; }
.heroContent,
.closingContent { text-align: center; }
.cta { display: inline-flex; min-height: 44px; align-items: center; }
```

- [ ] **Step 4: Replace the legacy route composition**

Replace `src/app/about/page.tsx` with:

```tsx
import type { Metadata } from 'next'
import AboutExperience from '@/components/AboutExperience'
import Footer from '@/components/Footer'
import Nav from '@/components/Nav'

export const metadata: Metadata = {
  title: 'About Techwise IQ | Business-First Engineering in Dubai',
  description:
    'Techwise IQ turns business bottlenecks into websites, custom software, and AI systems. Built in Dubai and trusted by businesses beyond borders.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About Techwise IQ | Business-First Engineering in Dubai',
    description:
      'You bring the business goal. We make the technical path clear and take responsibility for delivery.',
    url: 'https://techwiseiq.com/about',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  '@id': 'https://techwiseiq.com/about',
  name: 'About Techwise IQ',
  description:
    'Dubai-based digital engineering company building websites, custom software, and AI systems around business outcomes.',
  mainEntity: { '@id': 'https://techwiseiq.com/#organization' },
}

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Nav />
      <main>
        <AboutExperience />
      </main>
      <Footer />
    </>
  )
}
```

Delete `src/app/about/about.module.css`. Do not retain `ScrollAnimator`, `CTASection`, the founder note, principles grid, or AI evidence list.

- [ ] **Step 5: Add a temporary no-op Client Component so the server composition compiles**

Create `src/components/AboutExperience/AboutMotion.tsx`:

```tsx
'use client'

export default function AboutMotion() {
  return null
}
```

- [ ] **Step 6: Run the semantic tests**

Run:

```bash
npx playwright test tests/e2e/about-experience.spec.ts
```

Expected: PASS for both semantic and honesty tests.

- [ ] **Step 7: Run lint**

Run: `npm run lint`

Expected: PASS with no ESLint errors.

- [ ] **Step 8: Commit the server-rendered experience**

```bash
git add src/app/about src/components/AboutExperience tests/e2e/about-experience.spec.ts
git commit -m "feat: build about complexity to clarity story"
```

## Task 3: Implement the Centered Kinetic Layout

**Files:**
- Modify: `tests/e2e/about-experience.spec.ts`
- Modify: `src/components/AboutExperience/AboutExperience.module.css`

- [ ] **Step 1: Add failing responsive and visual-token assertions**

Append to `tests/e2e/about-experience.spec.ts`:

```ts
for (const viewport of [
  { width: 375, height: 667 },
  { width: 768, height: 900 },
  { width: 1440, height: 1000 },
]) {
  test(`keeps About centered and inside ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport)
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/about')

    const experience = page.getByTestId('about-experience')
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true)

    const h1 = experience.getByRole('heading', { level: 1 })
    await expect(h1).toHaveCSS('text-align', 'center')

    const cta = experience.getByRole('link', {
      name: /bring us the business problem/i,
    })
    const ctaBox = await cta.boundingBox()
    expect(ctaBox).not.toBeNull()
    expect(ctaBox!.height).toBeGreaterThanOrEqual(44)

    await expect(experience.locator('[data-about-culture]')).toHaveCSS(
      'background-color',
      'rgb(16, 16, 16)',
    )
    await expect(experience.locator('[data-about-closing]')).toHaveCSS(
      'background-color',
      'rgb(255, 208, 47)',
    )
  })
}
```

- [ ] **Step 2: Run the responsive test and verify it fails**

Run:

```bash
npx playwright test tests/e2e/about-experience.spec.ts --grep "keeps About centered"
```

Expected: FAIL because the complete centered Kinetic layout and section colors are not implemented.

- [ ] **Step 3: Replace the minimal CSS with the complete responsive module**

Replace `src/components/AboutExperience/AboutExperience.module.css` with a complete module following this exact structure and values:

```css
.experience {
  --about-gutter: clamp(20px, 4vw, 48px);
  overflow: clip;
  background: var(--bone);
}

.hero,
.expertise,
.culture,
.closing { position: relative; isolation: isolate; }

.hero { min-height: 130svh; }

.heroStage {
  position: sticky;
  top: 0;
  display: grid;
  min-height: 100svh;
  place-items: center;
  overflow: hidden;
  padding: 112px var(--about-gutter) 72px;
}

.heroContent,
.inner,
.cultureStage,
.closingContent {
  width: min(100%, var(--max));
  margin-inline: auto;
}

.heroContent { position: relative; z-index: 3; text-align: center; }

.sceneLabel {
  font-family: var(--font-mono), monospace;
  font-size: .7rem;
  font-weight: 700;
  letter-spacing: .08em;
  text-transform: uppercase;
}

.heroTitle,
.sectionTitle,
.closingTitle {
  font-family: var(--font-anton), sans-serif;
  font-weight: 400;
  letter-spacing: .005em;
  text-transform: uppercase;
}

.heroTitle {
  max-width: 1020px;
  margin: 18px auto 0;
  font-size: clamp(64px, 10.5vw, 154px);
  line-height: .84;
}

.heroTitle em,
.closingTitle em { color: var(--hot); font-style: normal; }

.heroTitle em { position: relative; display: inline-block; }
.heroTitle em::after {
  position: absolute;
  z-index: -1;
  right: 2%;
  bottom: -.05em;
  left: 2%;
  height: .1em;
  background: var(--sun);
  content: '';
  transform: rotate(-1deg) scaleX(var(--about-underline, 1));
  transform-origin: left;
}

.heroBody,
.closingBody {
  max-width: 58ch;
  margin: 24px auto 0;
  font-size: clamp(1rem, 1.5vw, 1.15rem);
  font-weight: 600;
  line-height: 1.6;
}

.scrollCue {
  display: block;
  margin-top: 28px;
  font-family: var(--font-mono), monospace;
  font-size: .65rem;
  font-weight: 700;
  letter-spacing: .08em;
  text-transform: uppercase;
}

.fragmentField { position: absolute; z-index: 1; inset: 88px 0 48px; }
.fragment {
  position: absolute;
  padding: 10px 12px;
  border: var(--bd);
  background: var(--bone);
  box-shadow: 4px 4px 0 var(--ink);
  font-family: var(--font-mono), monospace;
  font-size: .65rem;
  font-weight: 700;
  text-transform: uppercase;
}
.fragment:nth-child(1) { top: 14%; left: 6%; transform: rotate(-5deg); }
.fragment:nth-child(2) { top: 20%; right: 7%; transform: rotate(4deg); }
.fragment:nth-child(3) { bottom: 17%; left: 8%; transform: rotate(3deg); }
.fragment:nth-child(4) { right: 6%; bottom: 14%; transform: rotate(-4deg); }
.fragment:nth-child(5) { top: 53%; left: 2%; transform: rotate(-6deg); }

.expertise { padding: 112px var(--about-gutter); border-top: var(--bd); }
.inner { text-align: center; }
.sectionTitle {
  max-width: 980px;
  margin: 18px auto 0;
  font-size: clamp(48px, 7.5vw, 106px);
  line-height: .9;
}
.pathList { margin-top: 64px; border-top: var(--bd); list-style: none; text-align: left; }
.path {
  display: grid;
  min-height: 112px;
  grid-template-columns: 58px minmax(0, 1fr) 70px minmax(0, 1.15fr);
  align-items: center;
  gap: 18px;
  border-bottom: var(--bd);
}
.pathNumber,
.pathArrow { font-family: var(--font-mono), monospace; color: var(--hot); font-weight: 700; }
.path strong { font-family: var(--font-anton), sans-serif; font-size: clamp(1.4rem, 2.6vw, 2.4rem); font-weight: 400; text-transform: uppercase; }
.pathArrow { font-size: 2rem; text-align: center; }
.path p { max-width: 34ch; font-weight: 600; line-height: 1.5; }

.culture { min-height: 100svh; overflow: hidden; background: var(--ink); color: var(--bone); }
.cultureStage { position: relative; min-height: 100svh; padding: 96px var(--about-gutter); }
.cultureIntro { position: relative; z-index: 3; text-align: center; }
.culturePanels { display: grid; gap: 32px; margin-top: 54px; }
.culturePanel { padding: 34px 0; border-block: 3px solid var(--soft-dark); text-align: center; }
.culturePanel > span { font-family: var(--font-mono), monospace; color: var(--hot); font-size: .7rem; font-weight: 700; }
.culturePanel h3 { margin: 12px 0 0; color: var(--hot); font-family: var(--font-anton), sans-serif; font-size: clamp(64px, 11vw, 160px); font-weight: 400; line-height: .84; text-transform: uppercase; }
.culturePanel p { max-width: 48ch; margin: 18px auto 0; color: var(--soft-dark); font-size: 1rem; font-weight: 600; line-height: 1.55; }

.closing {
  display: grid;
  min-height: 88svh;
  place-items: center;
  overflow: hidden;
  padding: 112px var(--about-gutter);
  background: var(--sun);
}
.closingContent { position: relative; z-index: 2; text-align: center; }
.closingTitle { max-width: 1020px; margin: 18px auto 0; font-size: clamp(58px, 9vw, 132px); line-height: .86; }
.targetMotif {
  position: absolute;
  left: 50%;
  top: 50%;
  width: min(62vw, 650px);
  aspect-ratio: 1;
  border: var(--bd);
  border-radius: 50%;
  opacity: .12;
  transform: translate(-50%, -50%);
}
.targetMotif::before,
.targetMotif::after { position: absolute; background: var(--ink); content: ''; }
.targetMotif::before { top: 50%; left: -15%; width: 130%; height: 3px; }
.targetMotif::after { top: -15%; left: 50%; width: 3px; height: 130%; }
.cta {
  display: inline-flex;
  min-height: 52px;
  align-items: center;
  gap: 16px;
  margin-top: 30px;
  padding: 14px 18px;
  border: var(--bd);
  color: var(--bone);
  background: var(--hot);
  box-shadow: 5px 5px 0 var(--ink);
  font-family: var(--font-mono), monospace;
  font-size: .72rem;
  font-weight: 700;
  text-transform: uppercase;
  transition: transform 180ms ease, box-shadow 180ms ease;
}
.cta:hover,
.cta:focus-visible { transform: translate(2px, 2px); box-shadow: 2px 2px 0 var(--ink); }
.cta:focus-visible { outline: 3px solid var(--ink); outline-offset: 5px; }

@media (min-width: 769px) {
  .experience[data-motion='active'] .culture { min-height: 190svh; }
  .experience[data-motion='active'] .cultureStage { position: sticky; top: 0; }
  .experience[data-motion='active'] .culturePanels { position: absolute; inset: 48% var(--about-gutter) auto; margin: 0; transform: translateY(-40%); }
  .experience[data-motion='active'] .culturePanel { position: absolute; inset: 0; border: 0; }
}

@media (max-width: 768px) {
  .hero { min-height: auto; }
  .heroStage { position: relative; min-height: 100svh; padding-top: 116px; }
  .fragment { padding: 7px 8px; font-size: .54rem; }
  .fragment:nth-child(4),
  .fragment:nth-child(5) { display: none; }
  .expertise,
  .cultureStage,
  .closing { padding-block: 76px; }
  .path { grid-template-columns: 36px 1fr 28px; gap: 10px; padding: 24px 0; }
  .path p { grid-column: 2 / -1; max-width: none; }
  .pathArrow { grid-column: 3; grid-row: 1; font-size: 1.35rem; }
  .culturePanels { gap: 0; }
  .targetMotif { width: 88vw; }
}

@media (prefers-reduced-motion: reduce) {
  .experience[data-motion='reduced'] .fragmentField { display: none; }
  .cta { transition: none; }
}
```

- [ ] **Step 4: Run the responsive tests**

Run:

```bash
npx playwright test tests/e2e/about-experience.spec.ts --grep "keeps About centered"
```

Expected: 3 passed.

- [ ] **Step 5: Run lint and commit the visual system**

Run: `npm run lint`

Expected: PASS.

```bash
git add src/components/AboutExperience/AboutExperience.module.css tests/e2e/about-experience.spec.ts
git commit -m "feat: style centered about experience"
```

## Task 4: Add Progressive Scroll Motion

**Files:**
- Modify: `tests/e2e/about-experience.spec.ts`
- Modify: `src/components/AboutExperience/AboutMotion.tsx`

- [ ] **Step 1: Add failing reduced-motion, no-JavaScript, and active-motion tests**

Append to `tests/e2e/about-experience.spec.ts`:

```ts
test('settles the complete About story for reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/about')

  const experience = page.getByTestId('about-experience')
  await expect(experience).toHaveAttribute('data-motion', 'reduced')

  const panels = experience.locator('[data-about-culture-panel]')
  await expect(panels).toHaveCount(3)
  for (const panel of await panels.all()) {
    await expect(panel).toHaveCSS('opacity', '1')
  }
})

test('keeps About complete without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  const page = await context.newPage()
  await page.goto('/about')

  await expect(page.getByTestId('about-experience')).toBeVisible()
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await expect(page.locator('[data-about-culture-panel]')).toHaveCount(3)
  await expect(
    page.getByRole('link', { name: /bring us the business problem/i }),
  ).toBeVisible()
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true)

  await context.close()
})

test('activates the hero convergence when motion is allowed', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/about')

  const experience = page.getByTestId('about-experience')
  await expect(experience).toHaveAttribute('data-motion', 'active')

  const fragment = experience.locator('[data-about-fragment]').first()
  const before = await fragment.evaluate(
    (element) => getComputedStyle(element).transform,
  )
  await page.evaluate(() => window.scrollTo(0, window.innerHeight * 0.35))
  await page.waitForTimeout(250)
  const after = await fragment.evaluate(
    (element) => getComputedStyle(element).transform,
  )

  expect(after).not.toBe(before)
})
```

- [ ] **Step 2: Run the motion tests and verify they fail**

Run:

```bash
npx playwright test tests/e2e/about-experience.spec.ts --grep "reduced motion|without JavaScript|hero convergence"
```

Expected: the no-JavaScript test passes; reduced-motion and active-motion tests fail because the no-op controller does not set `data-motion` or animate fragments.

- [ ] **Step 3: Implement the complete motion controller**

Replace `src/components/AboutExperience/AboutMotion.tsx` with:

```tsx
'use client'

import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const CHIP_VECTORS = [
  [0.2, 0.15],
  [-0.22, 0.14],
  [0.22, -0.15],
  [-0.2, -0.16],
  [0.28, -0.02],
] as const

export default function AboutMotion() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>('[data-about-experience]')
    if (!root) return

    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const fragments = Array.from(
      root.querySelectorAll<HTMLElement>('[data-about-fragment]'),
    )
    const paths = Array.from(
      root.querySelectorAll<HTMLElement>('[data-about-path]'),
    )
    const panels = Array.from(
      root.querySelectorAll<HTMLElement>('[data-about-culture-panel]'),
    )
    const closing = root.querySelector<HTMLElement>(
      '[data-about-closing-content]',
    )
    let disposeMode = () => {}

    const applyMode = (reduced: boolean) => {
      disposeMode()
      gsap.set([...fragments, ...paths, ...panels, closing].filter(Boolean), {
        clearProps: 'all',
      })

      if (reduced) {
        root.dataset.motion = 'reduced'
        root.style.setProperty('--about-underline', '1')
        disposeMode = () => {}
        return
      }

      root.dataset.motion = 'active'
      root.style.setProperty('--about-underline', '.12')
      const media = gsap.matchMedia()
      const context = gsap.context(() => {
        gsap.fromTo(
          paths,
          { x: (index) => (index % 2 === 0 ? 46 : -46), opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.72,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: '[data-about-expertise]',
              start: 'top 70%',
              toggleActions: 'play none none reverse',
            },
          },
        )

        media.add('(min-width: 769px)', () => {
          const hero = root.querySelector<HTMLElement>('[data-about-hero]')
          if (hero) {
            const heroTimeline = gsap.timeline({
              scrollTrigger: {
                trigger: hero,
                start: 'top top',
                end: 'bottom bottom',
                scrub: 0.65,
                invalidateOnRefresh: true,
              },
            })
            heroTimeline.to(
              fragments,
              {
                x: (index) => window.innerWidth * (CHIP_VECTORS[index]?.[0] ?? 0),
                y: (index) => window.innerHeight * (CHIP_VECTORS[index]?.[1] ?? 0),
                rotate: 0,
                scale: 0.88,
                opacity: 0.16,
                stagger: 0.025,
                ease: 'none',
              },
              0,
            )
            heroTimeline.to(
              root,
              { '--about-underline': 1, duration: 0.7, ease: 'none' },
              0.15,
            )
          }

          const culture = root.querySelector<HTMLElement>('[data-about-culture]')
          if (!culture || panels.length !== 3) return

          gsap.set(panels, { opacity: 0, y: 42 })
          gsap.set(panels[0], { opacity: 1, y: 0 })
          const cultureTimeline = gsap.timeline({
            scrollTrigger: {
              trigger: culture,
              start: 'top top',
              end: 'bottom bottom',
              scrub: 0.65,
            },
          })
          cultureTimeline
            .to(panels[0], { opacity: 0, y: -42, duration: 0.3 })
            .to(panels[1], { opacity: 1, y: 0, duration: 0.3 }, '<')
            .to(panels[1], { opacity: 0, y: -42, duration: 0.3 }, '+=0.2')
            .to(panels[2], { opacity: 1, y: 0, duration: 0.3 }, '<')
        })

        media.add('(max-width: 768px)', () => {
          gsap.fromTo(
            fragments,
            { y: 18, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.58,
              stagger: 0.06,
              ease: 'power3.out',
            },
          )
          panels.forEach((panel) => {
            gsap.fromTo(
              panel,
              { y: 28, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.58,
                ease: 'power3.out',
                scrollTrigger: {
                  trigger: panel,
                  start: 'top 82%',
                  toggleActions: 'play none none reverse',
                },
              },
            )
          })
        })

        if (closing) {
          gsap.fromTo(
            closing,
            { y: 34, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.72,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: '[data-about-closing]',
                start: 'top 68%',
                toggleActions: 'play none none reverse',
              },
            },
          )
        }
      }, root)

      disposeMode = () => {
        media.revert()
        context.revert()
      }
    }

    const handlePreference = (event: MediaQueryListEvent) => {
      applyMode(event.matches)
    }

    applyMode(preference.matches)
    preference.addEventListener('change', handlePreference)

    return () => {
      preference.removeEventListener('change', handlePreference)
      disposeMode()
      delete root.dataset.motion
      root.style.removeProperty('--about-underline')
    }
  }, [])

  return null
}
```

- [ ] **Step 4: Run the complete About test file**

Run:

```bash
npx playwright test tests/e2e/about-experience.spec.ts
```

Expected: all About tests PASS.

- [ ] **Step 5: Run lint and commit motion**

Run: `npm run lint`

Expected: PASS.

```bash
git add src/components/AboutExperience/AboutMotion.tsx tests/e2e/about-experience.spec.ts
git commit -m "feat: animate about complexity to clarity"
```

## Task 5: Visual QA, Full Verification, and Documentation

**Files:**
- Modify: `src/components/AboutExperience/AboutExperience.module.css` only if visual verification identifies a scoped defect.
- Modify: `src/components/AboutExperience/AboutMotion.tsx` only if motion verification identifies a scoped defect.
- Modify: `tests/e2e/about-experience.spec.ts` when a discovered regression needs a permanent contract.
- Modify: `docs/changelog.md`.

- [ ] **Step 1: Start the development server**

Run:

```bash
npm run dev -- --hostname 127.0.0.1 --port 3017
```

Expected: Next.js reports the local site ready at `http://127.0.0.1:3017`.

- [ ] **Step 2: Capture desktop, mobile, and reduced-motion screenshots**

Run:

```bash
npx playwright screenshot --viewport-size=1440,1000 --full-page http://127.0.0.1:3017/about /tmp/about-desktop.png
npx playwright screenshot --viewport-size=375,667 --full-page http://127.0.0.1:3017/about /tmp/about-mobile.png
```

Use Playwright with `page.emulateMedia({ reducedMotion: 'reduce' })` to capture `/tmp/about-reduced.png` at 1440×1000.

Expected visual checks:

- every primary heading is centered;
- fragments never overlap the `h1` at the inspected widths;
- no horizontal overflow appears;
- expertise rows remain readable and directional;
- culture uses one principle per beat on desktop and normal flow on mobile;
- the target motif stays behind the closing copy;
- the CTA is visible, focused correctly, and at least 44 pixels tall;
- no extra cards, founder content, portraits, statistics, or testimonials appear.

- [ ] **Step 3: Add a changelog entry**

Add this dated entry near the top of `docs/changelog.md`:

```markdown
## 2026-07-17 — About Complexity to Clarity

- Replaced the legacy profile-style About page with a centered four-scene business narrative.
- Added problem-to-outcome expertise paths and the Ownership / Clarity / Momentum culture sequence.
- Added one progressive GSAP convergence showpiece with reduced-motion and no-JavaScript fallbacks.
- Kept all trust claims qualitative and removed founder, individual, team-size, and invented-proof language.
```

- [ ] **Step 4: Run focused and regression tests**

Run:

```bash
npx playwright test tests/e2e/about-experience.spec.ts
npx playwright test tests/e2e/home-experience.spec.ts tests/e2e/services-experience.spec.ts tests/e2e/work-page.spec.ts
```

Expected: all tests PASS.

- [ ] **Step 5: Run final lint and production build**

Run:

```bash
npm run lint
npm run build
```

Expected: both commands exit 0; `/about` is included in the production route output.

- [ ] **Step 6: Commit verified documentation and any scoped QA fixes**

```bash
git add docs/changelog.md src/components/AboutExperience tests/e2e/about-experience.spec.ts
git commit -m "docs: record verified about redesign"
```

- [ ] **Step 7: Confirm the worktree is clean**

Run: `git status --short`

Expected: no output.
