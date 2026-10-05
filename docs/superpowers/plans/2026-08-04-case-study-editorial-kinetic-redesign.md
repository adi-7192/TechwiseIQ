> **Historical (written for the Kinetic design, deleted — D-028).** Kept for reference only; do not build from it.
> Current: `docs/site-spec.md`, `docs/design-system.md`, `docs/DECISIONS.md`.

# Case Study Editorial Kinetic Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the AASKRA Realty and Express Trade Financing detail pages as responsive Editorial Kinetic case studies that match the quality of the current Work, About, and Service experiences.

**Architecture:** Keep the existing App Router dynamic route and shared case-study data source. Extend each `CaseStudy` with presentation-ready editorial fields, derive circular next-project navigation in the data module, render one semantic shared page, and replace the route-local CSS Module without adding a new animation system.

**Tech Stack:** Next.js 16 App Router, React 19 Server Components, TypeScript, CSS Modules, `next/image`, GSAP `ScrollAnimator`, Playwright, ESLint

---

## File Map

- Modify `src/types/index.ts` — define the structured editorial decision and case-study presentation fields.
- Modify `src/data/case-studies.ts` — supply verified editorial content and circular next-project lookup.
- Modify `src/app/work/[slug]/page.tsx` — render the approved shared Editorial Kinetic story.
- Replace `src/app/work/[slug]/case-study.module.css` — own the route's desktop, tablet, mobile, focus, and reduced-motion presentation.
- Create `tests/e2e/case-study-editorial.spec.ts` — lock semantic structure, optional/live behavior, next-project navigation, visual tokens, responsiveness, and overflow.
- Reuse `tests/e2e/launch-accessibility.spec.ts` and `tests/e2e/responsive.spec.ts` — guard screenshot-region focus and all-route overflow.

### Task 1: Lock the editorial structure with a failing browser test

**Files:**

- Create: `tests/e2e/case-study-editorial.spec.ts`

- [ ] **Step 1: Write the failing semantic and content test**

Create the file with this complete test suite:

```ts
import { expect, test } from '@playwright/test'

const CASES = [
  {
    slug: 'aaskra-realty',
    title: 'AASKRA Realty',
    storyTitle: 'Trust before track record.',
    proof: ['11', '6', '6 wks'],
    decisionCount: 5,
    nextTitle: 'Express Trade Financing',
    nextHref: '/work/express-trade-financing',
    hasLiveSite: false,
  },
  {
    slug: 'express-trade-financing',
    title: 'Express Trade Financing',
    storyTitle: 'Institutional weight, without the institution.',
    proof: ['USD 200M+', '25+', '5 wks'],
    decisionCount: 5,
    nextTitle: 'AASKRA Realty',
    nextHref: '/work/aaskra-realty',
    hasLiveSite: true,
  },
] as const

test.describe('Editorial Kinetic case studies', () => {
  for (const caseStudy of CASES) {
    test(`${caseStudy.title} renders the approved editorial story`, async ({
      page,
    }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' })
      await page.goto(`/work/${caseStudy.slug}`)

      const experience = page.getByTestId('case-study-experience')
      await expect(experience).toBeVisible()
      await expect(
        page.getByRole('heading', { level: 1, name: caseStudy.title }),
      ).toHaveCount(1)

      const proof = page.getByTestId('case-study-proof')
      for (const value of caseStudy.proof) {
        await expect(proof.getByText(value, { exact: true })).toBeVisible()
      }

      await expect(
        page.getByRole('heading', {
          level: 2,
          name: caseStudy.storyTitle,
        }),
      ).toBeVisible()
      await expect(
        page.getByTestId('case-study-decisions').getByRole('listitem'),
      ).toHaveCount(caseStudy.decisionCount)
      await expect(page.getByTestId('case-study-system')).toBeVisible()

      const scroller = page.getByRole('region', {
        name: `Full-page screenshot of the ${caseStudy.title} website`,
      })
      await scroller.focus()
      await expect(scroller).toBeFocused()

      await expect(
        page.getByRole('link', {
          name: `Next case study: ${caseStudy.nextTitle}`,
        }),
      ).toHaveAttribute('href', caseStudy.nextHref)

      const liveSite = page.getByRole('link', {
        name: `Visit the ${caseStudy.title} live site (opens in a new tab)`,
      })
      if (caseStudy.hasLiveSite) {
        await expect(liveSite).toHaveAttribute('target', '_blank')
      } else {
        await expect(liveSite).toHaveCount(0)
      }
    })
  }
})
```

- [ ] **Step 2: Run the test and verify RED**

Run:

```bash
npx playwright test tests/e2e/case-study-editorial.spec.ts
```

Expected: FAIL because `case-study-experience`, the editorial story headings, decision list, system section, and next-case-study links do not exist yet.

- [ ] **Step 3: Commit the failing test**

```bash
git add tests/e2e/case-study-editorial.spec.ts
git commit -m "test: define editorial case study experience"
```

### Task 2: Add structured editorial content and next-project navigation

**Files:**

- Modify: `src/types/index.ts:17-40`
- Modify: `src/data/case-studies.ts:9-137`

- [ ] **Step 1: Define structured decisions and presentation fields**

Add this type above `CaseStudy` and replace `approach: string[]` with the new fields:

```ts
export type CaseStudyDecision = {
  title: string
  body: string
}

export type CaseStudy = {
  slug: string
  featured: boolean
  title: string
  outcome: string
  workSummary: WorkSummary
  client: string
  industry: string
  service: Service['id']
  timeline: string
  stack: string[]
  liveUrl?: string
  coverImage?: string
  coverCaption: string
  storyTitle: string
  problem: string
  constraints: string
  decisions: CaseStudyDecision[]
  deliverables: string[]
  result: string
  stats?: { value: string; label: string }[]
  fullPageImage?: { src: string; width: number; height: number }
  images?: string[]
}
```

- [ ] **Step 2: Replace AASKRA's approach content with editorial fields**

Immediately after `coverImage`, add:

```ts
coverCaption:
  'An investor-first homepage built to establish authority before the first conversation.',
storyTitle: 'Trust before track record.',
```

Replace its `approach` array with:

```ts
decisions: [
  {
    title: 'Establish the luxury signal',
    body:
      'Use a dark, gold-accented visual system, architectural photography, and restrained motion to create an institutional first impression.',
  },
  {
    title: 'Make location data useful',
    body:
      'Build six location profiles around entry prices and ROI context so investors can compare real opportunities, not generic neighbourhood summaries.',
  },
  {
    title: 'Turn services into routes',
    body:
      'Structure off-plan acquisition, buying, and selling around concrete process steps instead of broad promises.',
  },
  {
    title: 'Shorten the path to a conversation',
    body:
      'Integrate WhatsApp Business and consultation booking where intent is highest, giving prospects a direct next step.',
  },
  {
    title: 'Build trust into the foundation',
    body:
      'Ship structured data, social metadata, discovery files, and RERA-compliant legal pages as part of the launch rather than after it.',
  },
],
```

- [ ] **Step 3: Replace Express Trade Finance's approach content with editorial fields**

Immediately after `coverImage`, add:

```ts
coverCaption:
  'A trust-first homepage that balances institutional weight with an approachable route to enquiry.',
storyTitle: 'Institutional weight, without the institution.',
```

Replace its `approach` array with:

```ts
decisions: [
  {
    title: 'Lead with proof',
    body:
      'Anchor the experience in real market data, global transaction reach, and the firm\'s USD 200M+ track record.',
  },
  {
    title: 'Make experience concrete',
    body:
      'Turn three real transactions into detailed case studies with values, timelines, and outcomes while protecting client confidentiality.',
  },
  {
    title: 'Explain finance plainly',
    body:
      'Structure trade finance and SME support services around understandable processes rather than specialist jargon.',
  },
  {
    title: 'Publish an informed point of view',
    body:
      'Create a journal for market analysis that supports ongoing discovery and demonstrates subject-matter expertise.',
  },
  {
    title: 'Keep global enquiries close',
    body:
      'Use WhatsApp and consultation forms to create a direct response path for prospects operating across time zones.',
  },
],
```

- [ ] **Step 4: Add circular next-project lookup**

Append this helper to `src/data/case-studies.ts`:

```ts
export function getNextCaseStudy(slug: string): CaseStudy | undefined {
  const index = CASE_STUDIES.findIndex((caseStudy) => caseStudy.slug === slug)
  if (index === -1 || CASE_STUDIES.length < 2) return undefined

  return CASE_STUDIES[(index + 1) % CASE_STUDIES.length]
}
```

- [ ] **Step 5: Run the TypeScript-aware checks**

Run:

```bash
npm run lint -- src/types/index.ts src/data/case-studies.ts
```

Expected: PASS with no ESLint errors. The browser test remains red because the page has not consumed the new fields.

- [ ] **Step 6: Commit the data model**

```bash
git add src/types/index.ts src/data/case-studies.ts
git commit -m "refactor: structure case study narratives"
```

### Task 3: Render the shared Editorial Kinetic experience

**Files:**

- Modify: `src/app/work/[slug]/page.tsx:9-275`

- [ ] **Step 1: Import and resolve the next case study**

Add `getNextCaseStudy` to the existing data import and resolve it after the current case study:

```ts
const cs = getCaseStudy(slug)
if (!cs) notFound()
const nextCaseStudy = getNextCaseStudy(slug)
```

- [ ] **Step 2: Replace the existing `<main>` with the editorial structure**

Keep the existing JSON-LD script, `ScrollAnimator`, `Nav`, `CTASection`, and `Footer`, then use this complete main tree:

```tsx
<main
  className={styles.experience}
  data-testid="case-study-experience"
>
  <section className={styles.hero} data-ghost="PROOF">
    <div className={styles.heroInner}>
      <div className={styles.breadcrumb}>
        <Link href="/work" className={styles.back}>Work</Link>
        <span aria-hidden="true">/</span>
        <span>{cs.title}</span>
      </div>
      <p className={styles.heroMeta}>
        {cs.industry} / {SERVICE_LABELS[cs.service]} / {cs.timeline}
      </p>
      <h1 className={styles.title}>
        {cs.title}<span aria-hidden="true">.</span>
      </h1>
      <p className={styles.outcome}>{cs.outcome}</p>
    </div>
  </section>

  {cs.stats && cs.stats.length > 0 && (
    <section className={styles.proofBand} aria-label="Project proof">
      <dl className={styles.proofGrid} data-testid="case-study-proof">
        {cs.stats.map((stat) => (
          <div key={stat.label} className={styles.proofItem}>
            <dt>{stat.label}</dt>
            <dd>{stat.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )}

  {cs.coverImage && (
    <section className={styles.visualChapter}>
      <div className="wrap">
        <div className={styles.coverFrame} data-animate="slide-up">
          <Image
            src={cs.coverImage}
            alt={`${cs.title} homepage screenshot`}
            fill
            sizes="(max-width: 768px) 92vw, 1152px"
            loading="eager"
            fetchPriority="high"
            className={styles.coverImg}
          />
        </div>
        <div className={styles.coverCaption}>
          <p>The launch / Homepage</p>
          <p>{cs.coverCaption}</p>
        </div>
      </div>
    </section>
  )}

  <section className={styles.challengeChapter}>
    <div className={styles.chapterGrid}>
      <div data-animate="slide-up">
        <p className={styles.darkLabel}>01 / The challenge</p>
        <h2>{cs.storyTitle}</h2>
      </div>
      <div className={styles.challengeCopy} data-animate="slide-up">
        <article>
          <h3>The problem</h3>
          <p>{cs.problem}</p>
        </article>
        <article>
          <h3>The constraint</h3>
          <p>{cs.constraints}</p>
        </article>
      </div>
    </div>
  </section>

  <section className={styles.decisionsChapter}>
    <div className="wrap">
      <p className={styles.sectionLabel}>02 / The decisions</p>
      <h2 className={styles.sectionTitle} data-animate="slide-up">
        What moved the work <span>forward.</span>
      </h2>
      <ol
        className={styles.decisionList}
        data-testid="case-study-decisions"
        data-animate="slide-up"
        data-stagger="0.08"
      >
        {cs.decisions.map((decision, index) => (
          <li key={decision.title}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <h3>{decision.title}</h3>
            <p>{decision.body}</p>
          </li>
        ))}
      </ol>
    </div>
  </section>

  <section className={styles.systemChapter} data-testid="case-study-system">
    <div className="wrap">
      <p className={styles.sectionLabel}>03 / The shipped system</p>
      <h2 className={styles.sectionTitle} data-animate="slide-up">
        One launch. <span>Every layer.</span>
      </h2>
      <div className={styles.systemGrid}>
        <div>
          <ul className={styles.deliverableCloud} data-animate="slide-up">
            {cs.deliverables.map((item) => <li key={item}>{item}</li>)}
          </ul>
          {cs.liveUrl && (
            <a
              href={cs.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.liveLink}
              aria-label={`Visit the ${cs.title} live site (opens in a new tab)`}
            >
              Visit the live site <span aria-hidden="true">↗</span>
            </a>
          )}
        </div>
        {cs.fullPageImage && (
          <div className={styles.browserFrame} data-animate="slide-up">
            <p>Full-page build / Scroll inside the frame ↓</p>
            <div
              className={styles.fullFrame}
              role="region"
              aria-label={`Full-page screenshot of the ${cs.title} website`}
              tabIndex={0}
            >
              <Image
                src={cs.fullPageImage.src}
                alt={`Full-page screenshot of the ${cs.title} website`}
                width={cs.fullPageImage.width}
                height={cs.fullPageImage.height}
                sizes="(max-width: 1024px) 92vw, 56vw"
                className={styles.fullImg}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  </section>

  <section className={styles.resultChapter}>
    <div className={styles.resultGrid}>
      <div data-animate="slide-up">
        <p className={styles.sectionLabel}>04 / The result</p>
        <h2 className={styles.resultTitle}>Credibility, <span>shipped.</span></h2>
      </div>
      <div data-animate="slide-up">
        <p className={styles.resultCopy}>{cs.result}</p>
        {cs.stats && (
          <dl className={styles.resultStats}>
            {cs.stats.map((stat) => (
              <div key={stat.label}>
                <dt>{stat.label}</dt>
                <dd>{stat.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </div>
  </section>

  <section className={styles.stackChapter}>
    <div className="wrap">
      <p className={styles.sectionLabel}>Built with</p>
      <div className={styles.stackList} data-animate="slide-up">
        {cs.stack.map((tech) => <span key={tech}>{tech}</span>)}
      </div>
    </div>
  </section>

  {nextCaseStudy && (
    <section className={styles.nextChapter} data-ghost="NEXT">
      <div className={styles.nextInner}>
        <p>Continue exploring</p>
        <h2>{nextCaseStudy.title}</h2>
        <Link
          href={`/work/${nextCaseStudy.slug}`}
          className={styles.nextLink}
          aria-label={`Next case study: ${nextCaseStudy.title}`}
        >
          Next case study <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  )}

  <CTASection />
</main>
```

- [ ] **Step 3: Run the semantic browser test and verify GREEN**

```bash
npx playwright test tests/e2e/case-study-editorial.spec.ts
```

Expected: PASS for both case studies. The page is structurally correct but not visually complete.

- [ ] **Step 4: Commit the semantic page structure**

```bash
git add src/app/work/[slug]/page.tsx
git commit -m "feat: render editorial case study stories"
```

### Task 4: Lock and implement the responsive Kinetic presentation

**Files:**

- Modify: `tests/e2e/case-study-editorial.spec.ts`
- Replace: `src/app/work/[slug]/case-study.module.css`

- [ ] **Step 1: Add failing visual-token and responsive assertions**

Append these tests inside the existing `test.describe` block:

```ts
test('uses the approved Kinetic chapter treatments on desktop', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/work/aaskra-realty')

  const experience = page.getByTestId('case-study-experience')
  const hero = experience.locator('section').first()
  expect((await hero.boundingBox())!.height).toBeGreaterThanOrEqual(895)
  await expect(
    page.getByRole('heading', { level: 1, name: 'AASKRA Realty' }),
  ).toHaveCSS('font-family', /Anton/)
  await expect(page.getByText('01 / The challenge')).toHaveCSS(
    'color',
    'rgb(154, 154, 146)',
  )
  await expect(page.getByTestId('case-study-system')).toHaveCSS(
    'background-color',
    'rgb(255, 208, 47)',
  )
})

test('turns the proof and editorial grids into a deliberate mobile story', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/work/express-trade-financing')
  await page.evaluate(() => document.fonts.ready)

  const proofItems = page.getByTestId('case-study-proof').locator('div')
  const first = await proofItems.nth(0).boundingBox()
  const second = await proofItems.nth(1).boundingBox()
  expect(first).not.toBeNull()
  expect(second).not.toBeNull()
  expect(second!.y).toBeGreaterThan(first!.y + first!.height - 1)

  const { scrollWidth, innerWidth } = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    innerWidth: window.innerWidth,
  }))
  expect(scrollWidth).toBeLessThanOrEqual(innerWidth + 1)
})
```

- [ ] **Step 2: Run the new assertions and verify RED**

```bash
npx playwright test tests/e2e/case-study-editorial.spec.ts --grep "Kinetic|mobile story"
```

Expected: FAIL because the hero is not full height, the new chapters lack their approved colors and typography, and the proof grid does not yet stack at 390px.

- [ ] **Step 3: Replace the route CSS Module**

Implement these exact layout contracts in `case-study.module.css`:

```css
.experience { overflow: clip; background: var(--bone); }
.hero { position: relative; display: grid; min-height: 100vh; min-height: 100svh; place-items: center; overflow: hidden; padding: 140px 24px 96px; text-align: center; isolation: isolate; }
.hero::before, .nextChapter::before { position: absolute; z-index: -1; content: attr(data-ghost); color: transparent; -webkit-text-stroke: 2px color-mix(in srgb, currentColor 13%, transparent); font-family: var(--font-anton), sans-serif; font-size: clamp(150px, 27vw, 390px); line-height: .7; transform: rotate(-7deg); }
.heroInner, .nextInner { position: relative; z-index: 2; display: grid; justify-items: center; }
.breadcrumb, .heroMeta, .sectionLabel, .darkLabel, .coverCaption, .proofItem dt, .resultStats dt, .stackList, .nextInner > p, .browserFrame > p { font-family: var(--font-mono), monospace; font-size: 11.5px; font-weight: 700; letter-spacing: .07em; text-transform: uppercase; }
.breadcrumb { display: flex; gap: 8px; color: var(--soft); }
.back { min-height: 24px; text-decoration: underline; text-decoration-color: var(--hot); text-decoration-thickness: 2px; text-underline-offset: 4px; }
.heroMeta { margin-top: 24px; color: var(--soft); }
.title { max-width: 11ch; margin-top: 16px; font-family: var(--font-anton), sans-serif; font-size: clamp(64px, 10.5vw, 150px); font-weight: 400; line-height: .86; letter-spacing: .005em; text-transform: uppercase; text-wrap: balance; }
.title span, .sectionTitle span, .resultTitle span { color: var(--hot); }
.outcome { max-width: 60ch; margin-top: 24px; color: var(--ink-soft); font-size: 17px; font-weight: 600; line-height: 1.6; }
.proofBand { border-block: var(--bd); }
.proofGrid { display: grid; grid-template-columns: repeat(3, 1fr); max-width: var(--max); margin: 0 auto; border-left: var(--bd); }
.proofItem { display: flex; min-width: 0; flex-direction: column-reverse; padding: 24px; border-right: var(--bd); text-align: center; }
.proofItem dd { color: var(--hot); font-family: var(--font-anton), sans-serif; font-size: clamp(42px, 5vw, 72px); line-height: 1; text-transform: uppercase; }
.proofItem dt { margin-top: 9px; color: var(--soft); }
.visualChapter, .decisionsChapter, .resultChapter, .stackChapter { padding: 112px 0; }
.coverFrame { position: relative; aspect-ratio: 16 / 9; overflow: hidden; border: var(--bd); box-shadow: 14px 14px 0 var(--hot); transform: rotate(-1.25deg); }
.coverImg { object-fit: cover; object-position: top center; }
.coverCaption { display: grid; grid-template-columns: .55fr 1.45fr; gap: 28px; margin-top: 34px; color: var(--soft); }
.coverCaption p:last-child { max-width: 58ch; color: var(--ink-soft); font-family: var(--font-archivo), sans-serif; font-size: 15px; letter-spacing: 0; line-height: 1.55; text-transform: none; }
.challengeChapter { padding: 160px clamp(24px, 7vw, 112px); background: var(--ink); color: var(--bone); clip-path: polygon(0 6%,100% 0,100% 94%,0 100%); }
.chapterGrid, .resultGrid { display: grid; grid-template-columns: minmax(0,.82fr) minmax(0,1.18fr); gap: clamp(48px, 8vw, 120px); width: min(100%, 1320px); margin: 0 auto; }
.darkLabel { color: var(--soft-dark); }
.challengeChapter h2, .sectionTitle, .resultTitle, .nextChapter h2 { font-family: var(--font-anton), sans-serif; font-weight: 400; line-height: .9; letter-spacing: .005em; text-transform: uppercase; }
.challengeChapter h2 { max-width: 9ch; margin-top: 16px; color: var(--hot); font-size: clamp(52px, 7vw, 104px); }
.challengeCopy { align-self: center; }
.challengeCopy article + article { margin-top: 40px; padding-top: 40px; border-top: 2px solid color-mix(in srgb, var(--bone) 34%, transparent); }
.challengeCopy h3 { font-family: var(--font-mono), monospace; font-size: 12px; letter-spacing: .07em; text-transform: uppercase; }
.challengeCopy p { max-width: 62ch; margin-top: 13px; color: var(--soft-dark); font-weight: 600; line-height: 1.65; }
.sectionLabel { color: var(--soft); }
.sectionTitle { max-width: 12ch; margin-top: 16px; font-size: clamp(52px, 7.2vw, 104px); }
.decisionList { margin-top: 64px; border-top: var(--bd); list-style: none; }
.decisionList li { display: grid; grid-template-columns: 64px minmax(220px,.8fr) minmax(0,1.2fr); gap: 28px; align-items: baseline; padding: 28px 0; border-bottom: var(--bd); }
.decisionList li > span { color: var(--hot); font-family: var(--font-mono), monospace; font-size: 12px; font-weight: 700; }
.decisionList h3 { font-family: var(--font-anton), sans-serif; font-size: clamp(25px, 3vw, 38px); font-weight: 400; line-height: 1; text-transform: uppercase; }
.decisionList p { max-width: 56ch; color: var(--ink-soft); font-weight: 600; line-height: 1.55; }
.systemChapter { padding: 128px 0; background: var(--sun); }
.systemGrid { display: grid; grid-template-columns: minmax(260px,.72fr) minmax(0,1.28fr); gap: clamp(48px,7vw,96px); align-items: start; margin-top: 64px; }
.deliverableCloud { display: flex; flex-wrap: wrap; gap: 12px; list-style: none; }
.deliverableCloud li, .stackList span { padding: 10px 13px; border: var(--bd); background: var(--bone); box-shadow: var(--shadow); font-family: var(--font-mono), monospace; font-size: 11px; font-weight: 700; letter-spacing: .04em; text-transform: uppercase; }
.liveLink, .nextLink { display: inline-flex; min-height: 48px; align-items: center; gap: 12px; margin-top: 32px; padding: 12px 16px; border: var(--bd); background: var(--hot); box-shadow: var(--shadow-md); font-family: var(--font-mono), monospace; font-size: 11px; font-weight: 700; letter-spacing: .07em; text-transform: uppercase; transition: transform .15s ease, box-shadow .15s ease; }
.liveLink:hover, .liveLink:focus-visible, .nextLink:hover, .nextLink:focus-visible { box-shadow: 1px 1px 0 currentColor; transform: translate(4px,4px); }
.browserFrame { overflow: hidden; border: var(--bd); background: var(--bone); box-shadow: 10px 10px 0 var(--hot); }
.browserFrame > p { padding: 12px 14px; border-bottom: var(--bd); }
.fullFrame { height: 620px; overflow-y: auto; overscroll-behavior: contain; }
.fullFrame:focus-visible { outline: 3px solid var(--hot); outline-offset: -6px; }
.fullImg { width: 100%; height: auto; }
.resultGrid { align-items: center; }
.resultTitle { max-width: 9ch; margin-top: 16px; font-size: clamp(52px, 7.2vw, 104px); }
.resultCopy { max-width: 58ch; color: var(--ink-soft); font-size: 17px; font-weight: 600; line-height: 1.65; }
.resultStats { margin-top: 36px; border-top: var(--bd); }
.resultStats div { display: flex; justify-content: space-between; align-items: baseline; gap: 24px; padding: 16px 0; border-bottom: var(--bd); }
.resultStats dd { color: var(--hot); font-family: var(--font-anton), sans-serif; font-size: clamp(30px,4vw,54px); line-height: 1; text-transform: uppercase; }
.resultStats dt { color: var(--soft); }
.stackChapter { padding-top: 0; }
.stackList { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 24px; }
.nextChapter { position: relative; display: grid; min-height: 72vh; place-items: center; overflow: hidden; padding: 112px 24px; background: var(--ink); color: var(--bone); text-align: center; isolation: isolate; }
.nextChapter::before { font-size: clamp(180px,30vw,430px); opacity: .65; }
.nextInner > p { color: var(--soft-dark); }
.nextChapter h2 { max-width: 11ch; margin-top: 18px; color: var(--sun); font-size: clamp(54px,8vw,118px); }
.nextLink { color: var(--ink); }
@media (max-width: 1024px) { .chapterGrid, .resultGrid, .systemGrid { grid-template-columns: 1fr; } .challengeChapter h2, .resultTitle { max-width: 12ch; } .coverFrame { box-shadow: 10px 10px 0 var(--hot); } }
@media (max-width: 768px) { .hero { padding-inline: 18px; } .proofGrid { grid-template-columns: 1fr; border-top: 0; } .proofItem { border-right: 0; border-bottom: var(--bd); } .proofItem:last-child { border-bottom: 0; } .visualChapter, .decisionsChapter, .resultChapter, .stackChapter { padding-block: 88px; } .challengeChapter { padding-block: 128px; clip-path: polygon(0 2.5%,100% 0,100% 97.5%,0 100%); } .coverCaption { grid-template-columns: 1fr; gap: 10px; } .decisionList li { grid-template-columns: 42px 1fr; gap: 12px 16px; } .decisionList p { grid-column: 2; } .systemChapter { padding-block: 96px; } .fullFrame { height: 500px; } }
@media (max-width: 480px) { .title { font-size: clamp(48px,16vw,72px); } .heroMeta { max-width: 30ch; } .coverFrame { box-shadow: 7px 7px 0 var(--hot); transform: none; } .challengeChapter { clip-path: none; } .decisionList { margin-top: 44px; } .decisionList li { padding-block: 22px; } .fullFrame { height: 430px; } .nextChapter { min-height: 64vh; } }
@media (pointer: coarse) { .back { min-height: 44px; display: inline-flex; align-items: center; } }
@media (prefers-reduced-motion: reduce) { .coverFrame, .hero::before, .nextChapter::before { transform: none; } }
```

- [ ] **Step 4: Run the complete focused test and verify GREEN**

```bash
npx playwright test tests/e2e/case-study-editorial.spec.ts
```

Expected: 4 tests pass with no failures.

- [ ] **Step 5: Commit the visual implementation**

```bash
git add tests/e2e/case-study-editorial.spec.ts src/app/work/[slug]/case-study.module.css
git commit -m "feat: style editorial case study experience"
```

### Task 5: Run accessibility, responsive, visual, and production verification

**Files:**

- Modify only if a verification failure exposes an in-scope defect.

- [ ] **Step 1: Run focused and existing unit coverage**

```bash
npm run test:unit
npx playwright test tests/e2e/case-study-editorial.spec.ts tests/e2e/launch-accessibility.spec.ts
```

Expected: all unit tests and all selected Playwright tests pass.

- [ ] **Step 2: Run the repository responsive sweep**

```bash
npx playwright test tests/e2e/responsive.spec.ts
```

Expected: every route passes at all nine viewport widths, including both redesigned case studies.

- [ ] **Step 3: Run static and production checks**

```bash
npm run lint
npm run build
```

Expected: both commands exit 0 with no ESLint or Next.js build errors.

- [ ] **Step 4: Capture fresh desktop and mobile screenshots**

With the dev server running at `http://127.0.0.1:3100`, capture both routes at 1440×1000 and 390×844 with reduced motion. Save temporary review images under `/tmp`:

```bash
node -e 'const { chromium } = require("playwright"); (async () => { const browser = await chromium.launch({ channel: "chrome", headless: true }); for (const [name, route] of [["aaskra", "/work/aaskra-realty"], ["etf", "/work/express-trade-financing"]]) { for (const [size, width, height] of [["desktop", 1440, 1000], ["mobile", 390, 844]]) { const page = await browser.newPage({ viewport: { width, height }, reducedMotion: "reduce" }); await page.goto("http://127.0.0.1:3100" + route, { waitUntil: "networkidle" }); await page.screenshot({ path: `/tmp/${name}-${size}-editorial.png`, fullPage: true }); await page.close(); } } await browser.close(); })().catch((error) => { console.error(error); process.exit(1) })'
```

Expected: four screenshots show complete content with loaded project imagery, readable hierarchy, no clipped type, no unexpected whitespace, and deliberate mobile stacking.

- [ ] **Step 5: Review the implementation against the approved spec**

Check every section in `docs/superpowers/specs/2026-08-04-case-study-editorial-kinetic-redesign.md`: shared architecture, hero, proof, visual, challenge, decisions, shipped system, result, stack, next-project handoff, optional states, motion, responsiveness, accessibility, and factual content.

- [ ] **Step 6: Commit only verification-driven fixes, if any**

```bash
git add src/types/index.ts src/data/case-studies.ts src/app/work/[slug]/page.tsx src/app/work/[slug]/case-study.module.css tests/e2e/case-study-editorial.spec.ts
git commit -m "fix: harden case study responsive presentation"
```

Skip this commit if verification required no changes.
