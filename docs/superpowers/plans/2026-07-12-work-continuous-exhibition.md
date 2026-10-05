> **Historical (written for the Kinetic design, deleted — D-028).** Kept for reference only; do not build from it.
> Current: `docs/site-spec.md`, `docs/design-system.md`, `docs/DECISIONS.md`.

# Work Continuous Exhibition Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Recompose `/work` into a scalable continuous cinematic exhibition that preserves all current content, gives featured client work short desktop takeovers, elevates Concept Lab into a second portfolio, and remains readable without motion.

**Architecture:** The route remains server-rendered. A pure partition helper separates at most three featured case studies from the future-project index, focused server components render the semantic exhibition, and one client-only `WorkMotion` component progressively enhances stable data attributes with IntersectionObserver and existing GSAP/ScrollTrigger. CSS Modules create the continuous spatial canvas, desktop sticky project holds, mobile normal flow, and reduced-motion fallback.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, CSS Modules, GSAP/ScrollTrigger, Node test runner, Playwright.

---

## File Map

### Create

- `src/app/work/work-projects.ts` — pure featured/remaining partition logic.
- `src/app/work/WorkMotion.tsx` — page-scoped progressive motion enhancement and cleanup.
- `tests/unit/work-projects.test.ts` — future-growth behavior for project partitioning.

### Modify

- `src/types/index.ts` — add explicit `featured` presentation metadata to `CaseStudy`.
- `src/data/case-studies.ts` — mark both current projects featured.
- `src/app/work/page.tsx` — continuous semantic composition and page-level motion root.
- `src/app/work/WorkGrid.tsx` — featured cinematic rail, aggregate proof handoff, and conditional future index.
- `src/app/work/ConceptLab.tsx` — second-portfolio exhibition with safe draft/published states.
- `src/app/work/work.module.css` — replace bordered section stack with the continuous exhibition canvas.
- `tests/e2e/work-page.spec.ts` — content preservation, exhibition structure, reduced motion, and responsive coverage.
- `docs/changelog.md` — record implementation and verification.

## Task 1: Lock Growth and Exhibition Contracts with Failing Tests

**Files:**

- Create: `tests/unit/work-projects.test.ts`
- Modify: `tests/e2e/work-page.spec.ts`
- Create: `src/app/work/work-projects.ts`
- Modify: `src/types/index.ts`
- Modify: `src/data/case-studies.ts`

- [ ] **Step 1: Add the failing project-partition unit tests**

```ts
import assert from 'node:assert/strict'
import test from 'node:test'
import { partitionProjects } from '../../src/app/work/work-projects.ts'

const projects = (flags: boolean[]) =>
  flags.map((featured, index) => ({ slug: `project-${index + 1}`, featured }))

test('caps the cinematic reel at three and preserves overflow order', () => {
  const result = partitionProjects(projects([true, true, true, true]))
  assert.deepEqual(result.featured.map((project) => project.slug), [
    'project-1',
    'project-2',
    'project-3',
  ])
  assert.deepEqual(result.remaining.map((project) => project.slug), ['project-4'])
})

test('uses the first three projects when no featured flags exist', () => {
  const result = partitionProjects(projects([false, false, false, false]))
  assert.deepEqual(result.featured.map((project) => project.slug), [
    'project-1',
    'project-2',
    'project-3',
  ])
  assert.deepEqual(result.remaining.map((project) => project.slug), ['project-4'])
})
```

- [ ] **Step 2: Extend the Work e2e contract before changing markup**

Add these assertions to `tests/e2e/work-page.spec.ts`:

```ts
test('renders a continuous client and concept exhibition', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/work')

  const experience = page.getByTestId('work-experience')
  await expect(experience).toHaveAttribute('data-motion', 'reduced')
  await expect(page.getByTestId('featured-project-rail')).toBeVisible()
  await expect(page.locator('[data-featured-project]')).toHaveCount(2)
  await expect(page.getByTestId('project-index')).toHaveCount(0)
  await expect(page.getByTestId('concept-exhibition')).toBeVisible()
  await expect(page.locator('[data-concept-stage]')).toHaveCount(3)
  await expect(page.locator('[data-work-reveal][data-visible="true"]')).not.toHaveCount(0)
})
```

- [ ] **Step 3: Run both tests and verify the new contracts fail**

Run:

```bash
node --experimental-strip-types --test tests/unit/work-projects.test.ts
npx playwright test tests/e2e/work-page.spec.ts
```

Expected: unit test fails because `work-projects.ts` does not exist; Playwright fails because the new test IDs and motion state do not exist.

- [ ] **Step 4: Add the minimal partition implementation**

Create `src/app/work/work-projects.ts`:

```ts
export function partitionProjects<T extends { featured?: boolean }>(
  projects: readonly T[],
) {
  const explicitlyFeatured = projects.filter((project) => project.featured)
  const featured = (
    explicitlyFeatured.length > 0 ? explicitlyFeatured : projects
  ).slice(0, 3)
  const featuredSet = new Set(featured)

  return {
    featured,
    remaining: projects.filter((project) => !featuredSet.has(project)),
  }
}
```

Add `featured: boolean` to `CaseStudy` in `src/types/index.ts` and set `featured: true` on both records in `src/data/case-studies.ts`.

- [ ] **Step 5: Run the unit test and type/lint checks**

Run:

```bash
node --experimental-strip-types --test tests/unit/work-projects.test.ts
npx eslint src/app/work/work-projects.ts src/types/index.ts src/data/case-studies.ts tests/unit/work-projects.test.ts
```

Expected: 2 unit tests pass and ESLint exits 0.

- [ ] **Step 6: Commit the growth contract**

```bash
git add src/app/work/work-projects.ts src/types/index.ts src/data/case-studies.ts tests/unit/work-projects.test.ts tests/e2e/work-page.spec.ts
git commit -m "test: define scalable work exhibition contracts"
```

## Task 2: Build the Featured Reel and Future Project Index

**Files:**

- Modify: `src/app/work/WorkGrid.tsx`
- Modify: `src/app/work/page.tsx`
- Modify: `src/app/work/work.module.css`

- [ ] **Step 1: Read the required Next.js 16 CSS and Image references**

Read completely:

```bash
sed -n '1,260p' node_modules/next/dist/docs/01-app/01-getting-started/11-css.md
sed -n '1,300p' node_modules/next/dist/docs/01-app/01-getting-started/12-images.md
```

Expected: confirm CSS Module scoping and `next/image` sizing/loading behavior before editing UI code.

- [ ] **Step 2: Refactor `WorkGrid` around the partition helper**

Keep the existing aggregate metric derivation, call:

```ts
const { featured, remaining } = partitionProjects(CASE_STUDIES)
```

Render this semantic shape:

```tsx
<div className={styles.projectExperience}>
  <div className={styles.featuredRail} data-testid="featured-project-rail">
    {featured.map((project, index) => (
      <div key={project.slug} className={styles.projectTrack} data-featured-project>
        <FeaturedProject caseStudy={project} index={index} />
      </div>
    ))}
  </div>
  <WorkMetrics metrics={DELIVERY_METRICS} />
  {remaining.length > 0 && (
    <section className={styles.projectIndex} data-testid="project-index" aria-labelledby="project-index-title">
      <h3 id="project-index-title">More client work</h3>
      {remaining.map((project) => (
        <IndexedProject key={project.slug} caseStudy={project} />
      ))}
    </section>
  )}
</div>
```

Define the file-local `FeaturedProject`, `WorkMetrics`, and `IndexedProject` functions above the default export. `FeaturedProject` contains the current image, metadata, title, outcome, proof definition list, challenge/decision/outcome groups, case-study link, and optional live-site link. `WorkMetrics` maps the existing `DELIVERY_METRICS`. `IndexedProject` renders the case-study image, service/industry/timeline metadata, title, outcome, case-study link, and optional live-site link. Project 02 receives a reverse modifier based on index, not duplicated markup.

- [ ] **Step 3: Recompose the page shell without removing content**

In `page.tsx`:

- Replace `<ScrollAnimator />` with `<WorkMotion />` in Task 4; temporarily omit global Work animations.
- Add `data-testid="work-experience"` and `data-work-experience` to the page root.
- Add stable `data-work-reveal` attributes to hero copy, section introductions, capability content, process content, principles, and CTA.
- Preserve JSON-LD, Nav, Footer, all arrays, all copy, and all links.
- Move the aggregate proof marquee visually into the hero-to-project handoff without changing its words.

- [ ] **Step 4: Add structural CSS sufficient for readable normal flow**

Before cinematic styling, add final-state CSS that ensures:

```css
.experience { position: relative; overflow: clip; }
.projectTrack { position: relative; min-height: 100svh; }
.projectStage { position: relative; min-height: 100svh; }
.projectIndex:empty { display: none; }
```

Keep every element visible; do not add opacity-zero initial states until `WorkMotion` is present.

- [ ] **Step 5: Run the focused e2e test to confirm structure**

Run: `npx playwright test tests/e2e/work-page.spec.ts`

Expected: existing content/link/draft/mobile tests pass; the new exhibition test still fails only on `data-motion` and reveal visibility until Task 4.

- [ ] **Step 6: Commit the server-rendered exhibition structure**

```bash
git add src/app/work/page.tsx src/app/work/WorkGrid.tsx src/app/work/work.module.css
git commit -m "feat: build scalable featured work reel"
```

## Task 3: Elevate Concept Lab into a Second Portfolio

**Files:**

- Modify: `src/app/work/ConceptLab.tsx`
- Modify: `src/app/work/work.module.css`
- Modify: `tests/e2e/work-page.spec.ts`

- [ ] **Step 1: Add draft/published behavior assertions**

Extend the Concept Lab test with:

```ts
const stages = lab.locator('[data-concept-stage]')
await expect(stages).toHaveCount(3)
await expect(stages.nth(0)).toHaveAttribute('data-concept-status', 'draft')
await expect(stages.nth(0).getByText('Art direction')).toBeVisible()
await expect(stages.nth(1).getByText('Data UI')).toBeVisible()
await expect(stages.nth(2).getByText('Editorial UI')).toBeVisible()
```

- [ ] **Step 2: Run the focused draft test and verify failure**

Run:

```bash
npx playwright test tests/e2e/work-page.spec.ts -g "draft concept slots"
```

Expected: FAIL because `data-concept-stage` is not present.

- [ ] **Step 3: Recompose Concept Lab as an exhibition trail**

Use this outer contract:

```tsx
<section
  className={styles.conceptLab}
  data-testid="concept-exhibition"
  data-work-reveal
>
  <div className={styles.sectionIntro} data-work-reveal>
    <p className={styles.label}>Concept Lab / Self-initiated</p>
    <h2 className={styles.sectionTitle}>What else could we <span>build?</span></h2>
    <p className={styles.sectionBody}>Reserved spaces for coded website explorations across industries, visual languages and interaction patterns.</p>
    <p className={styles.conceptDisclosure}>Concept work — not client commissions</p>
  </div>
  <div className={styles.conceptTrail}>
    {CONCEPT_SITES.map((concept, index) =>
      concept.status === 'published' && concept.previewImage && concept.demoPath ? (
        <a
          key={concept.slug}
          href={concept.demoPath}
          className={styles.conceptStage}
          data-concept-stage
          data-concept-status="published"
          data-concept-index={index}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open ${concept.title} live HTML demo (opens in a new tab)`}
        >
          <ConceptPreview concept={concept} />
          <ConceptCopy concept={concept} index={index} published />
        </a>
      ) : (
        <article
          key={concept.slug}
          className={styles.conceptStage}
          data-concept-stage
          data-concept-status="draft"
          data-concept-index={index}
        >
          <ConceptBlueprint />
          <ConceptCopy concept={concept} index={index} published={false} />
        </article>
      ),
    )}
  </div>
</section>
```

Define file-local `ConceptPreview` and `ConceptBlueprint` functions using the current browser bar, optimized Image, and blueprint markup. For published concepts, keep the outer element as a real external anchor instead of nesting an anchor inside an article. For drafts, use a non-interactive article. Keep the shared copy in `ConceptCopy`.

- [ ] **Step 4: Style large alternating concept stages**

- Use browser frames at `min-height: clamp(420px, 58vw, 720px)` on desktop.
- Alternate frame alignment and rotation by `data-concept-index`.
- Keep blueprint blocks clearly schematic.
- Keep `Concept work — not client commissions` visible above the trail.
- Convert to single-column normal flow below 768px.
- Ensure draft stages have no cursor, transform, or shadow change on hover.

- [ ] **Step 5: Run Concept Lab and mobile tests**

Run:

```bash
npx playwright test tests/e2e/work-page.spec.ts -g "draft concept slots|375px"
```

Expected: both tests pass.

- [ ] **Step 6: Commit the Concept Lab exhibition**

```bash
git add src/app/work/ConceptLab.tsx src/app/work/work.module.css tests/e2e/work-page.spec.ts
git commit -m "feat: elevate concept lab exhibition"
```

## Task 4: Add the Page-Scoped Motion Orchestrator

**Files:**

- Create: `src/app/work/WorkMotion.tsx`
- Modify: `src/app/work/page.tsx`
- Modify: `src/app/work/work.module.css`
- Modify: `tests/e2e/work-page.spec.ts`

- [ ] **Step 1: Add active-motion and reduced-motion assertions**

Add a new test:

```ts
test('enhances motion progressively and exposes the reduced fallback', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/work')
  await expect(page.getByTestId('work-experience')).toHaveAttribute('data-motion', 'reduced')
  await expect(page.locator('[data-work-reveal]:not([data-visible="true"])')).toHaveCount(0)

  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.reload()
  await expect(page.getByTestId('work-experience')).toHaveAttribute('data-motion', 'active')
})
```

- [ ] **Step 2: Run the test and verify failure**

Run:

```bash
npx playwright test tests/e2e/work-page.spec.ts -g "enhances motion"
```

Expected: FAIL because no page-scoped motion component sets `data-motion`.

- [ ] **Step 3: Implement `WorkMotion`**

Implement these responsibilities in one `useEffect`:

```tsx
'use client'

import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function WorkMotion() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>('[data-work-experience]')
    if (!root) return
    const reveals = Array.from(root.querySelectorAll<HTMLElement>('[data-work-reveal]'))
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduced) {
      root.dataset.motion = 'reduced'
      reveals.forEach((element) => { element.dataset.visible = 'true' })
      return
    }

    root.dataset.motion = 'active'
    const observer = new IntersectionObserver(/* reveal once at 12% threshold */)
    reveals.forEach((element) => observer.observe(element))

    const context = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-project-stage]').forEach((stage) => {
        const image = stage.querySelector<HTMLElement>('[data-project-image]')
        const title = stage.querySelector<HTMLElement>('[data-project-title]')
        const proof = stage.querySelectorAll<HTMLElement>('[data-project-proof]')
        const timeline = gsap.timeline({
          scrollTrigger: { trigger: stage, start: 'top bottom', end: 'bottom top', scrub: 0.55 },
        })
        if (image) timeline.fromTo(image, { scale: 0.94, rotate: -4 }, { scale: 1, rotate: 0, ease: 'none' }, 0)
        if (title) timeline.fromTo(title, { yPercent: 22 }, { yPercent: -8, ease: 'none' }, 0)
        if (proof.length) timeline.fromTo(proof, { y: 24, opacity: 0.55 }, { y: -8, opacity: 1, stagger: 0.04, ease: 'none' }, 0.1)
      })
    }, root)

    return () => {
      observer.disconnect()
      context.revert()
      delete root.dataset.motion
    }
  }, [])

  return null
}
```

Guard project timelines with `window.matchMedia('(min-width: 1024px)')`; mobile and tablet use IntersectionObserver reveals only.

- [ ] **Step 4: Mount `WorkMotion` and add stable motion attributes**

Import and render `<WorkMotion />` once inside the Work page. Add:

- `data-project-image` to the project image plane.
- `data-project-title` to project titles.
- `data-project-proof` to proof objects.
- `data-work-reveal` to non-project cinematic moments.

- [ ] **Step 5: Add progressive CSS states**

```css
:global([data-work-reveal]) {
  opacity: 1;
  transform: none;
}

:global([data-work-experience][data-motion='active'] [data-work-reveal]) {
  opacity: 0;
  transform: translateY(32px);
  transition: opacity 0.38s ease, transform 0.38s ease;
}

:global([data-work-experience][data-motion='active'] [data-work-reveal][data-visible='true']) {
  opacity: 1;
  transform: none;
}
```

In reduced motion, remove sticky positioning and all transitions/animations.

- [ ] **Step 6: Run focused motion and existing Work tests**

Run: `npx playwright test tests/e2e/work-page.spec.ts`

Expected: all Work-page tests pass.

- [ ] **Step 7: Commit the motion orchestration**

```bash
git add src/app/work/WorkMotion.tsx src/app/work/page.tsx src/app/work/WorkGrid.tsx src/app/work/work.module.css tests/e2e/work-page.spec.ts
git commit -m "feat: connect work scenes with cinematic motion"
```

## Task 5: Complete the Continuous Canvas Visual System

**Files:**

- Modify: `src/app/work/work.module.css`
- Modify: `src/app/work/page.tsx`
- Modify: `src/app/work/WorkGrid.tsx`
- Modify: `src/app/work/ConceptLab.tsx`

- [ ] **Step 1: Replace visible section boxes with overlapping planes**

Implement the approved rules:

- Center every major label/title/intro.
- Remove page-wide horizontal borders from hero, selected work, capabilities, Concept Lab, process, principles, and CTA.
- Use `overflow: clip`, isolated stacking contexts, static polygon planes, and negative block margins for visual overlap.
- Keep borders local to project proof, concept browser frames, tags, controls, and list rows.
- Use ink, bone, hot, and sun only.

- [ ] **Step 2: Style desktop featured projects as short sticky stages**

At 1024px and above:

```css
.projectTrack { min-height: 145svh; }
.projectStage { position: sticky; top: 0; min-height: 100svh; }
```

Compose image, centered title, metadata, proof, story, and actions around one stage. Keep narrative widths at 35–48ch and prevent title overlap from intercepting links.

- [ ] **Step 3: Turn metrics and capabilities into handoff objects**

- Place aggregate metrics as detached bordered objects between the two project planes.
- Render six capabilities as an open rail/cloud, not a grid.
- Use `-webkit-text-stroke` only for large Anton labels.
- Keep capability descriptions visible without hover.

- [ ] **Step 4: Connect process, principles, and CTA**

- Render the four process steps along a centered route, vertical below 768px.
- Remove the boxed principles grid; use opposing readable groups with local row rules.
- Expand the final CTA to near-viewport height and resolve the composition into the existing button.

- [ ] **Step 5: Complete responsive and reduced-motion CSS**

At below 1024px, remove sticky project holds. At below 768px, use one-column normal flow, image before project copy, 20px gutters, body text at least 16px, and no transforms that push content outside the viewport. Under reduced motion, disable all keyframes, transitions, sticky positioning, and transform travel.

- [ ] **Step 6: Verify responsive content and visual order**

Run:

```bash
npx playwright test tests/e2e/work-page.spec.ts
npm run lint -- -- src/app/work src/data/case-studies.ts src/types/index.ts tests/e2e/work-page.spec.ts tests/unit/work-projects.test.ts
```

Expected: tests pass, no horizontal overflow at 375px, and lint exits 0.

- [ ] **Step 7: Commit the continuous canvas styling**

```bash
git add src/app/work src/data/case-studies.ts src/types/index.ts tests/e2e/work-page.spec.ts tests/unit/work-projects.test.ts
git commit -m "feat: finish continuous work exhibition canvas"
```

## Task 6: Final Verification and Documentation

**Files:**

- Modify: `docs/changelog.md`

- [ ] **Step 1: Record the delivered redesign**

Add a dated changelog entry covering:

- Continuous exhibition composition.
- Featured project cap and future index.
- Concept Lab elevation and safe draft/published states.
- Desktop-only short sticky stages.
- Reduced-motion and mobile normal-flow fallbacks.
- Verification commands and results.

- [ ] **Step 2: Run the complete verification suite**

Run:

```bash
node --experimental-strip-types --test tests/unit/work-projects.test.ts
npx playwright test tests/e2e/work-page.spec.ts
npm run lint
npm run build
```

Expected: unit tests, Work Playwright tests, lint, and production build all pass.

- [ ] **Step 3: Inspect the final diff and repository state**

Run:

```bash
git diff --check
git status --short
git log --oneline -8
```

Expected: no whitespace errors; only the changelog remains uncommitted before the final commit.

- [ ] **Step 4: Commit verification documentation**

```bash
git add docs/changelog.md
git commit -m "docs: record work exhibition verification"
```

- [ ] **Step 5: Re-run the final status check**

Run: `git status --short`

Expected: clean worktree.
