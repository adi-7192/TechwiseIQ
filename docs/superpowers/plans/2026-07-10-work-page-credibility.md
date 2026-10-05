> **Historical (written for the Kinetic design, deleted — D-028).** Kept for reference only; do not build from it.
> Current: `docs/site-spec.md`, `docs/design-system.md`, `docs/DECISIONS.md`.

# Work Page Credibility Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the short `/work` tile index with an evidence-led, animated portfolio page containing two deep project chapters, verified delivery proof, capabilities, three honest Concept Lab placeholders, process, working principles, and a centered CTA.

**Architecture:** Keep `/work` as a server-rendered App Router page. Extend the canonical case-study records with a compact `workSummary`, render project chapters from those records, and keep Concept Lab metadata in its own manifest. Use the existing GSAP `ScrollAnimator`, `Marquee`, `Nav`, `Footer`, and design tokens; introduce no filtering, modal, carousel, or new client state.

**Tech Stack:** Next.js 16 App Router, React 19 Server Components, TypeScript, CSS Modules, `next/image`, `next/link`, GSAP ScrollTrigger, Playwright.

---

## File structure

- Modify `src/types/index.ts` — add `WorkSummary` and attach it to `CaseStudy`.
- Modify `src/data/case-studies.ts` — add verified Work-page summaries and proof values.
- Create `src/data/concept-sites.ts` — three draft demo-slot records and manifest types.
- Modify `src/app/work/page.tsx` — compose the complete page and static evidence/process sections.
- Modify `src/app/work/WorkGrid.tsx` — replace tile links with reusable project chapters and delivery metrics.
- Create `src/app/work/ConceptLab.tsx` — render non-interactive draft slots and future published demo links.
- Rewrite `src/app/work/work.module.css` — all Work-page layout, typography, motion enhancement, and responsive behavior.
- Create `tests/e2e/work-page.spec.ts` — semantic, responsive, placeholder, navigation, and reduced-motion acceptance coverage.

### Task 1: Lock the redesign with failing browser tests

**Files:**
- Create: `tests/e2e/work-page.spec.ts`

- [ ] **Step 1: Write the failing acceptance tests**

```ts
import { expect, test } from '@playwright/test'

test.describe('Work credibility page', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/work')
  })

  test('presents real work, delivery proof, concepts, and working style', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1, name: 'Proof, not promises.' })).toHaveCount(1)
    await expect(page.getByRole('heading', { level: 2, name: 'Built for real business.' })).toBeVisible()
    await expect(page.getByRole('article')).toHaveCount(2)
    await expect(page.getByText('21', { exact: true })).toBeVisible()
    await expect(page.getByText('Pages shipped', { exact: true })).toBeVisible()
    await expect(page.getByRole('heading', { level: 2, name: 'What else could we build?' })).toBeVisible()
    await expect(page.getByText('Brief pending', { exact: true })).toHaveCount(3)
    await expect(page.getByRole('heading', { level: 2, name: 'Clear from kickoff to launch.' })).toBeVisible()
    await expect(page.getByRole('heading', { level: 2, name: 'Bring us the problem.' })).toBeVisible()
  })

  test('links both projects to stable case-study pages', async ({ page }) => {
    await expect(page.getByRole('link', { name: /Read AASKRA Realty case study/ })).toHaveAttribute('href', '/work/aaskra-realty')
    await expect(page.getByRole('link', { name: /Read Express Trade Financing case study/ })).toHaveAttribute('href', '/work/express-trade-financing')
  })

  test('draft concept slots are honest and non-interactive', async ({ page }) => {
    const lab = page.getByTestId('concept-lab')
    await expect(lab.getByRole('link')).toHaveCount(0)
    await expect(lab.getByText('Demo slot', { exact: false })).toHaveCount(3)
    await expect(lab.getByText('Concept work — not client commissions')).toBeVisible()
  })
})

test('keeps the work page inside a 375px viewport', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/work')

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
  expect(overflow).toBeLessThanOrEqual(1)

  const firstArticle = page.getByRole('article').first()
  const imageBox = await firstArticle.locator('img').boundingBox()
  const headingBox = await firstArticle.getByRole('heading', { level: 3 }).boundingBox()
  expect(imageBox).not.toBeNull()
  expect(headingBox).not.toBeNull()
  expect(imageBox!.y).toBeLessThan(headingBox!.y)
})
```

- [ ] **Step 2: Run the Work-page test and verify it fails against the old page**

Run: `npx playwright test tests/e2e/work-page.spec.ts`

Expected: FAIL because headings such as `Built for real business.` and the Concept Lab do not exist.

- [ ] **Step 3: Commit the red test**

```bash
git add tests/e2e/work-page.spec.ts
git commit -m "test: specify work credibility page"
```

### Task 2: Add canonical Work and Concept Lab data

**Files:**
- Modify: `src/types/index.ts`
- Modify: `src/data/case-studies.ts`
- Create: `src/data/concept-sites.ts`

- [ ] **Step 1: Define presentation types without duplicating case-study records**

Add to `src/types/index.ts`:

```ts
export type WorkSummary = {
  challenge: string
  decision: string
  outcome: string
  proof: { value: string; label: string }[]
}

export type CaseStudy = {
  // existing fields remain unchanged
  workSummary: WorkSummary
}
```

- [ ] **Step 2: Add exact verified summaries to both records**

Add `workSummary` to AASKRA:

```ts
workSummary: {
  challenge: 'No digital presence in a trust-heavy market.',
  decision: 'Build credibility through useful market data, location profiles, and a clear investor journey.',
  outcome: 'A live platform that carries the brand\'s authority while its track record grows.',
  proof: [
    { value: '11', label: 'pages' },
    { value: '6', label: 'location profiles' },
    { value: '6 wks', label: 'delivery' },
  ],
},
```

Add `workSummary` to Express Trade Financing:

```ts
workSummary: {
  challenge: 'Significant deal history, but no credible digital presence.',
  decision: 'Lead with real transaction stories, explain the process plainly, and balance institutional weight with accessibility.',
  outcome: 'A live site that presents a boutique firm with institutional credibility.',
  proof: [
    { value: '10', label: 'pages' },
    { value: '25+', label: 'countries served' },
    { value: '5 wks', label: 'delivery' },
  ],
},
```

- [ ] **Step 3: Create the Concept Lab manifest**

Create `src/data/concept-sites.ts`:

```ts
export type ConceptSite = {
  slug: string
  title: string
  category: string
  summary: string
  tags: string[]
  previewImage?: string
  demoPath?: string
  status: 'draft' | 'published'
}

export const CONCEPT_SITES: ConceptSite[] = [
  {
    slug: 'hospitality-concept',
    title: 'Hospitality concept',
    category: 'Luxury hospitality / restaurant',
    summary: 'A reserved demo slot for an immersive hospitality experience.',
    tags: ['Art direction', 'Booking UX', 'Motion'],
    status: 'draft',
  },
  {
    slug: 'saas-concept',
    title: 'SaaS product concept',
    category: 'B2B SaaS / product platform',
    summary: 'A reserved demo slot for a technical product story and conversion journey.',
    tags: ['Product story', 'Data UI', 'Conversion'],
    status: 'draft',
  },
  {
    slug: 'commerce-concept',
    title: 'Commerce concept',
    category: 'E-commerce / lifestyle',
    summary: 'A reserved demo slot for product storytelling and a focused shopping path.',
    tags: ['E-commerce', 'Editorial UI', 'Product UX'],
    status: 'draft',
  },
]
```

- [ ] **Step 4: Verify types and commit**

Run: `npm run build`

Expected: PASS with all `CaseStudy` records satisfying the new required property.

```bash
git add src/types/index.ts src/data/case-studies.ts src/data/concept-sites.ts
git commit -m "feat: add work proof and concept data"
```

### Task 3: Build project chapters and evidence-led page structure

**Files:**
- Modify: `src/app/work/WorkGrid.tsx`
- Modify: `src/app/work/page.tsx`
- Modify: `src/app/work/work.module.css`

- [ ] **Step 1: Replace tile cards with project chapters and metrics**

`WorkGrid.tsx` remains a server component. Map `CASE_STUDIES` into `<article>` elements, apply `styles.projectReverse` to odd indexes, render `next/image` with `fill` and `sizes="(max-width: 880px) 100vw, 50vw"`, and render challenge/decision/outcome plus proof cells. Use internal `Link` for case studies and standard anchors for `liveUrl`.

Core chapter structure:

```tsx
<article className={`${styles.project} ${index % 2 ? styles.projectReverse : ''}`}>
  <div className={styles.projectVisual} data-animate={index % 2 ? 'slide-right' : 'slide-left'}>
    <Image fill sizes="(max-width: 880px) 100vw, 50vw" src={cs.coverImage!} alt={`${cs.title} website preview`} />
  </div>
  <div className={styles.projectContent} data-animate={index % 2 ? 'slide-left' : 'slide-right'}>
    <p className={styles.projectMeta}>{SERVICE_LABELS[cs.service]} / {cs.industry} / {cs.timeline}</p>
    <h3>{cs.title}</h3>
    <p>{cs.outcome}</p>
    <div className={styles.proofGrid}>{cs.workSummary.proof.map(/* proof cell */)}</div>
    <div className={styles.storyGrid}>{/* challenge, decision, outcome */}</div>
    <div className={styles.projectActions}>{/* case study + optional live link */}</div>
  </div>
</article>
```

After the first project, render the three-cell metric strip with `21`, `5–6`, and `2`.

- [ ] **Step 2: Compose all approved sections in `page.tsx`**

Keep metadata and JSON-LD. Replace the old hero/grid/CTA sequence with:

1. Centered hero.
2. `Marquee` proof strip.
3. Centered Selected Work introduction.
4. `<WorkGrid />`.
5. Capabilities section.
6. `<ConceptLab />` placeholder (implemented in Task 4).
7. Dark How We Work section.
8. Working principles.
9. Centered CTA using `BOOKING_URL`.

Use semantic H2 headings, `data-animate="slide-up"`, and `data-stagger` only on direct-child grids.

- [ ] **Step 3: Implement the first CSS pass**

Define reusable page classes in `work.module.css` for:

```css
.sectionIntro { text-align: center; max-width: 760px; margin-inline: auto; }
.sectionTitle { font-family: var(--font-anton), sans-serif; text-transform: uppercase; font-size: clamp(34px, 5.2vw, 68px); line-height: .95; }
.project { display: grid; grid-template-columns: 1.05fr 1fr; border-top: var(--bd); }
.projectReverse { grid-template-columns: 1fr 1.05fr; }
.projectVisual { position: relative; min-height: 520px; overflow: hidden; border-right: var(--bd); }
.projectReverse .projectVisual { order: 2; border-right: 0; border-left: var(--bd); }
.metrics { display: grid; grid-template-columns: repeat(3, 1fr); border-block: var(--bd); }
```

Apply the design tokens and exact typography rules from the approved spec. Do not introduce rounded corners, blurred shadows, gradients, or new colors.

- [ ] **Step 4: Run the acceptance test**

Run: `npx playwright test tests/e2e/work-page.spec.ts`

Expected: Concept Lab assertions still FAIL; project, metrics, and primary hierarchy assertions PASS.

- [ ] **Step 5: Commit the project/page slice**

```bash
git add src/app/work/page.tsx src/app/work/WorkGrid.tsx src/app/work/work.module.css
git commit -m "feat: expand work page with project proof"
```

### Task 4: Add honest Concept Lab placeholders

**Files:**
- Create: `src/app/work/ConceptLab.tsx`
- Modify: `src/app/work/page.tsx`
- Modify: `src/app/work/work.module.css`

- [ ] **Step 1: Implement status-aware cards**

Create a server component that renders draft entries as `<div>` cards and published entries as external `<a>` cards only when both optional paths are present.

```tsx
import Image from 'next/image'
import { CONCEPT_SITES } from '@/data/concept-sites'
import styles from './work.module.css'

export default function ConceptLab() {
  if (CONCEPT_SITES.length === 0) return null

  return (
    <section className={styles.conceptLab} data-testid="concept-lab">
      <div className="wrap">
        <div className={styles.sectionIntro}>{/* label, H2, body, disclosure */}</div>
        <div className={styles.conceptGrid} data-animate="slide-up" data-stagger="0.08">
          {CONCEPT_SITES.map((concept, index) => {
            const published = concept.status === 'published' && concept.previewImage && concept.demoPath
            const content = published ? (
              <><Image fill sizes="(max-width: 768px) 100vw, 33vw" src={concept.previewImage} alt={`${concept.title} concept website preview`} />{/* copy */}</>
            ) : (
              <><div className={styles.conceptBlueprint} aria-hidden="true" />{/* demo slot, category, brief pending */}</>
            )
            return published ? <a key={concept.slug} href={concept.demoPath} target="_blank" rel="noopener noreferrer">{content}</a> : <div key={concept.slug}>{content}</div>
          })}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Add placeholder styling and published-card hover states**

Use a CSS blueprint made from hard 1px lines, not decorative gradients. Implement it with pseudo-elements and repeating linear backgrounds only inside the explicit placeholder preview; this is a functional placeholder treatment and the sole exception in this page to the general decorative-gradient prohibition.

Draft cards use `cursor: default` and no movement. Published cards may shift the real preview image up to 18px, hollow the title, and slide the arrow.

- [ ] **Step 3: Run the full Work-page acceptance test**

Run: `npx playwright test tests/e2e/work-page.spec.ts`

Expected: PASS, including three `Brief pending` labels and zero links inside Concept Lab.

- [ ] **Step 4: Commit Concept Lab**

```bash
git add src/app/work/ConceptLab.tsx src/app/work/page.tsx src/app/work/work.module.css
git commit -m "feat: add concept lab demo slots"
```

### Task 5: Finish responsive behavior, motion, accessibility, and quality checks

**Files:**
- Modify: `src/app/work/work.module.css`
- Modify: `tests/e2e/work-page.spec.ts` only if selectors need to target final semantic markup without weakening assertions.

- [ ] **Step 1: Complete responsive layouts**

At `max-width: 880px`, stack project chapters and force `.projectVisual` before `.projectContent`; remove alternating borders/orders. Change capabilities/process to two columns and Concept Lab to one column. At `max-width: 600px`, use 20px gutters, 64–72px section padding, single-column process/principles, wrapping proof grids, and minimum 44px action heights.

- [ ] **Step 2: Complete Kinetic Rhythm interactions**

Use only transform/opacity/color/stroke transitions:

- image settle/hover scale;
- title outline on hover-capable devices;
- arrow translateX(4px);
- staggered metric/process entrances through `ScrollAnimator`;
- static readable state under `prefers-reduced-motion`.

- [ ] **Step 3: Run targeted and regression verification**

Run:

```bash
npx playwright test tests/e2e/work-page.spec.ts
npm run lint
npm run build
```

Expected: all Work-page tests pass, ESLint exits 0, and the production build completes with `/work` statically generated.

- [ ] **Step 4: Capture visual checks**

Run:

```bash
npx playwright screenshot --device="Desktop Chrome" http://127.0.0.1:3100/work /tmp/work-desktop.png
npx playwright screenshot --viewport-size="375,812" http://127.0.0.1:3100/work /tmp/work-mobile.png
```

Inspect both screenshots for centered major headers, left-aligned evidence, no overflow, correct alternating project order, three explicit draft slots, and Kinetic design-system consistency.

- [ ] **Step 5: Commit the finished page**

```bash
git add src/app/work/work.module.css tests/e2e/work-page.spec.ts
git commit -m "feat: finish responsive work experience"
```

### Task 6: Final requirements audit

**Files:**
- Verify all files above; no new files expected.

- [ ] **Step 1: Compare the implementation line by line with the approved design spec**

Confirm: centered main headings; two real project chapters; only verified metrics; capabilities; three non-interactive Concept Lab slots; process; working principles; CTA; reduced motion; no filters/modal/carousel; no fake demo assets.

- [ ] **Step 2: Run the complete available suite**

Run:

```bash
npm run lint
npm run build
npx playwright test
```

Expected: ESLint 0 errors, build success, and every Playwright test passes.

- [ ] **Step 3: Check the final diff and working tree**

Run:

```bash
git diff --check
git status --short
git log --oneline -6
```

Expected: no whitespace errors; only intentional feature files changed; task commits are visible.
