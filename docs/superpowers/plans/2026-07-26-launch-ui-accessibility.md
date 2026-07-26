# Launch UI and Accessibility Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove verified UI obstructions and accessibility failures without redesigning the approved Kinetic experience.

**Architecture:** Add focused Playwright regressions around the public behavior, then make small semantic and CSS changes in the existing page/component boundaries. A tiny route-focus client component handles focus after client-side navigation; all other changes remain server-rendered.

**Tech Stack:** Next.js 16 App Router, React 19, CSS Modules, Playwright

---

### Task 1: Add failing launch-accessibility regressions

**Files:**
- Create: `tests/e2e/launch-accessibility.spec.ts`

- [ ] **Step 1: Write the failing tests**

```ts
import { expect, test } from '@playwright/test'

test.describe('launch accessibility hardening', () => {
  test('removes the redundant floating WhatsApp control from contact', async ({
    page,
  }) => {
    await page.goto('/contact')

    await expect(
      page.getByRole('link', { name: 'Chat on WhatsApp', exact: true }),
    ).toBeHidden()
    await expect(
      page.getByRole('link', { name: /WhatsApp.*Chat on WhatsApp/i }),
    ).toBeVisible()
  })

  test('uses the visual 404 as the page heading', async ({ page }) => {
    const response = await page.goto('/this-page-does-not-exist')

    expect(response?.status()).toBe(404)
    await expect(
      page.getByRole('heading', { level: 1, name: '404' }),
    ).toHaveCount(1)
  })

  test('uses contrast-safe headline accents and work labels', async ({ page }) => {
    await page.goto('/services')
    await expect(
      page.getByRole('heading', { level: 1 }).locator('span'),
    ).toHaveCSS('color', 'rgb(16, 16, 16)')

    await page.goto('/work')
    await expect(
      page.getByRole('heading', { level: 1 }).locator('span'),
    ).toHaveCSS('color', 'rgb(16, 16, 16)')
    await expect(page.getByText('Capabilities demonstrated')).toHaveCSS(
      'color',
      'rgb(58, 57, 51)',
    )
  })

  test('keeps visible work-action copy in each accessible name', async ({
    page,
  }) => {
    await page.goto('/work')

    await expect(
      page.getByRole('link', {
        name: /Read full case study.*AASKRA Realty/i,
      }),
    ).toBeVisible()
    await expect(
      page.getByRole('link', {
        name: /Visit live site.*AASKRA Realty.*opens in a new tab/i,
      }),
    ).toBeVisible()
  })

  test('moves focus to the destination heading after client navigation', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 900 })
    await page.goto('/')
    await page.getByRole('link', { name: 'Services', exact: true }).first().click()

    await expect(page).toHaveURL(/\/services$/)
    await expect(page.getByRole('heading', { level: 1 })).toBeFocused()
  })

  test('names and focuses the case-study screenshot scroller', async ({
    page,
  }) => {
    await page.goto('/work/aaskra-realty')
    const scroller = page.getByRole('region', {
      name: /Full-page screenshot of the AASKRA Realty website/i,
    })

    await scroller.focus()
    await expect(scroller).toBeFocused()
  })
})
```

- [ ] **Step 2: Run the tests and verify the expected failures**

Run:

```bash
npx playwright test tests/e2e/launch-accessibility.spec.ts
```

Expected: all six tests fail for the current verified reasons: visible floating control, missing 404 `h1`, hot accent colors, mismatched link names, no route-focus behavior, and an unnamed/unfocusable screenshot frame.

- [ ] **Step 3: Commit the red tests**

```bash
git add tests/e2e/launch-accessibility.spec.ts
git commit -m "test: capture launch accessibility gaps"
```

### Task 2: Remove the contact obstruction and correct the 404 heading

**Files:**
- Modify: `src/app/contact/page.tsx`
- Modify: `src/components/WhatsAppButton/WhatsAppButton.module.css`
- Modify: `src/app/not-found.tsx`
- Test: `tests/e2e/launch-accessibility.spec.ts`

- [ ] **Step 1: Mark the contact page and hide only its redundant floating control**

Change the contact landmark to:

```tsx
<main data-contact-page>
```

Add to `WhatsAppButton.module.css`:

```css
:global(body:has(main[data-contact-page])) .btn {
  display: none;
}
```

This keeps the component server-rendered and avoids a site-wide pathname client bundle.

- [ ] **Step 2: Make the visual 404 the semantic heading**

Replace the styled `p` containing `404` with:

```tsx
<h1
  style={{
    fontFamily: 'var(--font-anton)',
    fontSize: 'clamp(120px, 20vw, 200px)',
    lineHeight: 1,
    color: 'var(--hot)',
    textTransform: 'uppercase',
    letterSpacing: '-0.02em',
  }}
>
  404
</h1>
```

- [ ] **Step 3: Run the focused tests**

```bash
npx playwright test tests/e2e/launch-accessibility.spec.ts --grep "WhatsApp|404"
```

Expected: 2 passed.

- [ ] **Step 4: Commit**

```bash
git add src/app/contact/page.tsx src/components/WhatsAppButton/WhatsAppButton.module.css src/app/not-found.tsx
git commit -m "a11y: remove contact obstruction and label 404"
```

### Task 3: Correct verified contrast and accessible-name failures

**Files:**
- Modify: `src/components/ServicesOverview/ServicesOverview.module.css`
- Modify: `src/app/work/work.module.css`
- Modify: `src/app/work/WorkGrid.tsx`
- Test: `tests/e2e/launch-accessibility.spec.ts`

- [ ] **Step 1: Replace the services hero fill with the approved marker treatment**

Update the services hero accent rule to:

```css
.hero h1 span {
  color: var(--ink);
  text-decoration: underline;
  text-decoration-color: var(--hot);
  text-decoration-thickness: 0.12em;
  text-underline-offset: 0.08em;
}
```

- [ ] **Step 2: Split work hero accents from other section accents**

Replace the combined accent rule with:

```css
.sectionTitle span,
.darkTitle span {
  color: var(--hot);
}

.heroTitle span {
  color: var(--ink);
  text-decoration: underline;
  text-decoration-color: var(--hot);
  text-decoration-thickness: 0.12em;
  text-underline-offset: 0.08em;
}

.capabilities .label {
  color: var(--ink-soft);
}
```

- [ ] **Step 3: Make work-action names include their visible copy**

Remove both `aria-label` props from `ProjectActions` and include contextual screen-reader text:

```tsx
<Link
  href={`/work/${caseStudy.slug}`}
  className={styles.projectPrimary}
>
  Read full case study
  <span className="sr-only"> for {caseStudy.title}</span>{' '}
  <span aria-hidden="true">→</span>
</Link>
```

```tsx
<a
  href={caseStudy.liveUrl}
  className={styles.projectSecondary}
  target="_blank"
  rel="noopener noreferrer"
>
  Visit live site
  <span className="sr-only">
    {' '}
    for {caseStudy.title}, opens in a new tab
  </span>{' '}
  <span aria-hidden="true">↗</span>
</a>
```

- [ ] **Step 4: Run the contrast and name tests**

```bash
npx playwright test tests/e2e/launch-accessibility.spec.ts --grep "contrast|accessible name"
```

Expected: 2 passed.

- [ ] **Step 5: Commit**

```bash
git add src/components/ServicesOverview/ServicesOverview.module.css src/app/work/work.module.css src/app/work/WorkGrid.tsx
git commit -m "a11y: fix launch contrast and link names"
```

### Task 4: Add route-change focus management

**Files:**
- Create: `src/components/RouteFocusManager/index.tsx`
- Modify: `src/app/layout.tsx`
- Test: `tests/e2e/launch-accessibility.spec.ts`

- [ ] **Step 1: Add the focused client component**

```tsx
'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

export default function RouteFocusManager() {
  const pathname = usePathname()
  const previousPath = useRef(pathname)

  useEffect(() => {
    if (previousPath.current === pathname) return
    previousPath.current = pathname

    const frame = window.requestAnimationFrame(() => {
      const target = document.querySelector<HTMLElement>('main h1')
      if (!target) return
      target.tabIndex = -1
      target.focus({ preventScroll: true })
    })

    return () => window.cancelAnimationFrame(frame)
  }, [pathname])

  return null
}
```

- [ ] **Step 2: Mount it once in the root layout**

Import `RouteFocusManager` and render it as the first element inside `body`, before the global WhatsApp control.

- [ ] **Step 3: Run the route-focus regression**

```bash
npx playwright test tests/e2e/launch-accessibility.spec.ts --grep "destination heading"
```

Expected: 1 passed.

- [ ] **Step 4: Commit**

```bash
git add src/components/RouteFocusManager/index.tsx src/app/layout.tsx
git commit -m "a11y: focus page headings after navigation"
```

### Task 5: Make the intentional screenshot scroller operable

**Files:**
- Modify: `src/app/work/[slug]/page.tsx`
- Modify: `src/app/work/[slug]/case-study.module.css`
- Test: `tests/e2e/launch-accessibility.spec.ts`

- [ ] **Step 1: Name and focus the scroll region**

Change the full-build frame to:

```tsx
<div
  className={styles.fullFrame}
  data-animate="slide-up"
  role="region"
  aria-label={`Full-page screenshot of the ${cs.title} website`}
  tabIndex={0}
>
```

- [ ] **Step 2: Add a focused scroll-region treatment**

```css
.fullFrame:focus-visible {
  outline: 3px solid var(--hot);
  outline-offset: 4px;
}
```

- [ ] **Step 3: Run the complete plan test file**

```bash
npx playwright test tests/e2e/launch-accessibility.spec.ts
```

Expected: 6 passed.

- [ ] **Step 4: Run adjacent page suites**

```bash
npx playwright test tests/e2e/services-experience.spec.ts tests/e2e/work-page.spec.ts tests/e2e/responsive.spec.ts
```

Expected: all active tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/app/work/[slug]/page.tsx src/app/work/[slug]/case-study.module.css
git commit -m "a11y: expose case study screenshot scroller"
```

### Task 6: Verify the UI/accessibility workstream

**Files:**
- Review: all files changed in Tasks 1–5

- [ ] **Step 1: Run lint and the production build**

```bash
npm run lint
npm run build
```

Expected: both exit 0.

- [ ] **Step 2: Run Lighthouse accessibility on affected routes**

```bash
npx --yes lighthouse http://127.0.0.1:3100/services --only-categories=accessibility --output=json --output-path=/tmp/techwise-services-a11y.json --chrome-flags="--headless --no-sandbox"
npx --yes lighthouse http://127.0.0.1:3100/work --only-categories=accessibility --output=json --output-path=/tmp/techwise-work-a11y.json --chrome-flags="--headless --no-sandbox"
```

Expected: accessibility score `1` for both reports.

- [ ] **Step 3: Inspect the final diff**

```bash
git diff HEAD~5 --check
git status --short
```

Expected: no whitespace errors and no uncommitted production changes.
