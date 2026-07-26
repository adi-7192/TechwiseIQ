# Launch Performance and Metadata Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make critical content render immediately, improve measured LCP on the slowest public routes, remove Next.js launch warnings, and give every shareable page complete canonical/Open Graph/Twitter metadata.

**Architecture:** Preserve the existing motion system while making server-rendered content visible by default and excluding only above-the-fold content from reveal gating. Centralize social metadata in a typed helper because Next.js shallowly replaces nested metadata objects. Keep image changes route-local and evidence-driven.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, CSS Modules, Playwright, Lighthouse

---

### Task 1: Add failing progressive-rendering and metadata tests

**Files:**
- Create: `tests/e2e/launch-performance-metadata.spec.ts`

- [ ] **Step 1: Write the failing tests**

```ts
import { expect, test } from '@playwright/test'

const socialRoutes = [
  '/',
  '/services',
  '/services/web',
  '/services/software',
  '/services/ai',
  '/work',
  '/work/aaskra-realty',
  '/work/express-trade-financing',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
]

test.describe('launch metadata', () => {
  for (const route of socialRoutes) {
    test(`${route} has complete share metadata`, async ({ page }) => {
      await page.goto(route)

      await expect(page.locator('link[rel="canonical"]')).toHaveCount(1)
      await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
        'content',
        /\/opengraph-image(?:\?|$)/,
      )
      await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
        'content',
        'summary_large_image',
      )
      await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute(
        'content',
        /\/opengraph-image(?:\?|$)/,
      )
    })
  }
})

test('declares smooth-scroll behavior for Next navigation', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('html')).toHaveAttribute(
    'data-scroll-behavior',
    'smooth',
  )
})

test('prioritizes the first work image and case-study cover', async ({ page }) => {
  await page.goto('/work')
  await expect(
    page.locator('[data-client-project] img').first(),
  ).toHaveAttribute('loading', 'eager')
  await expect(
    page.locator('[data-client-project] img').first(),
  ).toHaveAttribute('fetchpriority', 'high')

  await page.goto('/work/aaskra-realty')
  await expect(page.locator('main img').first()).toHaveAttribute(
    'loading',
    'eager',
  )
  await expect(page.locator('main img').first()).toHaveAttribute(
    'fetchpriority',
    'high',
  )
})

test('critical service and work copy exists without JavaScript', async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  const page = await context.newPage()

  await page.goto('/services')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()

  await page.goto('/services/web')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()

  await page.goto('/work')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()

  await page.goto('/work/aaskra-realty')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()

  await context.close()
})
```

- [ ] **Step 2: Run the tests and verify the expected failures**

```bash
npx playwright test tests/e2e/launch-performance-metadata.spec.ts
```

Expected: social-image assertions fail on child routes, the root attribute and image priority assertions fail, and no-JavaScript service headings are invisible.

- [ ] **Step 3: Commit the red tests**

```bash
git add tests/e2e/launch-performance-metadata.spec.ts
git commit -m "test: capture launch performance and metadata gaps"
```

### Task 2: Centralize complete social metadata

**Files:**
- Create: `src/lib/metadata.ts`
- Modify: `src/app/layout.tsx`
- Modify: `src/app/page.tsx`
- Modify: `src/app/services/page.tsx`
- Modify: `src/app/services/web/page.tsx`
- Modify: `src/app/services/software/page.tsx`
- Modify: `src/app/services/ai/page.tsx`
- Modify: `src/app/work/page.tsx`
- Modify: `src/app/work/[slug]/page.tsx`
- Modify: `src/app/about/page.tsx`
- Modify: `src/app/contact/page.tsx`
- Test: `tests/e2e/launch-performance-metadata.spec.ts`

- [ ] **Step 1: Add the typed social metadata helper**

```ts
import type { Metadata } from 'next'

interface SocialMetadataInput {
  title: string
  description: string
  url: string
}

const socialImage = {
  url: '/opengraph-image',
  width: 1200,
  height: 630,
  alt: 'Techwise IQ — Web, Software and AI Engineering',
}

export function socialMetadata({
  title,
  description,
  url,
}: SocialMetadataInput): Pick<Metadata, 'openGraph' | 'twitter'> {
  return {
    openGraph: {
      title,
      description,
      url,
      siteName: 'Techwise IQ',
      type: 'website',
      locale: 'en_AE',
      images: [socialImage],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [socialImage.url],
    },
  }
}
```

- [ ] **Step 2: Use the helper in root metadata**

Import `socialMetadata`, remove the partial root `openGraph` object, and spread:

```ts
...socialMetadata({
  title: 'Techwise IQ — Web, Software & AI Engineering',
  description:
    'Dubai-based digital engineering agency. We build fast websites, custom software, and AI automations. Agencies sell hours. We sell outcomes.',
  url: '/',
}),
```

- [ ] **Step 3: Replace every page-local `openGraph` object**

In each static page, import `socialMetadata` and replace the existing `openGraph` block with:

```ts
...socialMetadata({
  title: 'Services | Techwise IQ',
  description:
    'Web development, custom software, and AI automation — scoped tight, shipped weekly, priced in writing.',
  url: '/services',
}),
```

Use each page’s current Open Graph title, description, and canonical path. Do not rewrite approved marketing copy.

For the dynamic case-study metadata, use:

```ts
...socialMetadata({
  title: `${cs.title} | Techwise IQ`,
  description: cs.outcome,
  url: `/work/${cs.slug}`,
}),
```

The root helper covers `/privacy` and `/terms`, which do not replace `openGraph`.

- [ ] **Step 4: Run the social metadata tests**

```bash
npx playwright test tests/e2e/launch-performance-metadata.spec.ts --grep "share metadata"
```

Expected: all 12 route cases pass.

- [ ] **Step 5: Commit**

```bash
git add src/lib/metadata.ts src/app
git commit -m "seo: complete social metadata on every route"
```

### Task 3: Make critical content progressively visible

**Files:**
- Modify: `src/components/ServiceMotion/ServiceMotion.module.css`
- Modify: `src/components/ServicesOverview/index.tsx`
- Modify: `src/components/ServiceDetailPage/index.tsx`
- Modify: `src/app/work/page.tsx`
- Modify: `src/app/work/work.module.css`
- Modify: `src/app/work/[slug]/page.tsx`
- Test: `tests/e2e/launch-performance-metadata.spec.ts`

- [ ] **Step 1: Make service reveals visible before JavaScript activates motion**

Replace the unconditional hidden rule with:

```css
:global([data-service-reveal]) {
  opacity: 1;
  transform: none;
}

:global(
    [data-service-experience][data-motion='active'] [data-service-reveal]
  ) {
  opacity: 0;
  transform: translateY(32px);
  transition: opacity 0.38s ease, transform 0.38s ease;
}

:global(
    [data-service-experience][data-motion='active']
      [data-service-reveal][data-visible='true']
  ) {
  opacity: 1;
  transform: none;
}
```

Keep the reduced-motion rule.

- [ ] **Step 2: Exclude service hero content from reveal gating**

Remove `data-service-reveal` only from:

```tsx
<div className={styles.heroInner}>
```

in both `ServicesOverview` and `ServiceDetailPage`. Leave below-the-fold reveal attributes in place.

- [ ] **Step 3: Exclude work hero copy from reveal gating**

Remove `data-work-reveal` from the four elements in the `/work` hero: label, `h1`, intro, and decorative marker.

Remove `data-animate="slide-up"` from the case-study hero `h1` and outcome paragraph. Leave below-the-fold animations unchanged.

- [ ] **Step 4: Remove the decorative mobile LCP candidate**

Add:

```css
@media (max-width: 768px) {
  .hero::before {
    content: none;
  }
}
```

The large outlined “PROOF” remains part of the desktop direction but no longer competes with the real heading for mobile LCP.

- [ ] **Step 5: Run the progressive-rendering test**

```bash
npx playwright test tests/e2e/launch-performance-metadata.spec.ts --grep "without JavaScript"
```

Expected: 1 passed.

- [ ] **Step 6: Run adjacent motion suites**

```bash
npx playwright test tests/e2e/services-experience.spec.ts tests/e2e/work-page.spec.ts
```

Expected: all active tests pass; update only assertions that intentionally require an above-the-fold reveal attribute.

- [ ] **Step 7: Commit**

```bash
git add src/components/ServiceMotion src/components/ServicesOverview src/components/ServiceDetailPage src/app/work
git commit -m "perf: render critical route content immediately"
```

### Task 4: Resolve Next.js navigation and image-priority warnings

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `src/app/work/WorkGrid.tsx`
- Modify: `src/app/work/[slug]/page.tsx`
- Test: `tests/e2e/launch-performance-metadata.spec.ts`

- [ ] **Step 1: Declare the global scroll behavior**

Add the documented Next.js attribute to the root element:

```tsx
<html
  lang="en"
  data-scroll-behavior="smooth"
  className={`${anton.variable} ${archivo.variable} ${spaceMono.variable}`}
  suppressHydrationWarning
>
```

- [ ] **Step 2: Prioritize only the first work image**

Update the featured image:

```tsx
loading={index === 0 ? 'eager' : 'lazy'}
fetchPriority={index === 0 ? 'high' : 'auto'}
```

- [ ] **Step 3: Replace deprecated case-study image priority**

Replace `priority` with:

```tsx
loading="eager"
fetchPriority="high"
```

- [ ] **Step 4: Run the focused tests**

```bash
npx playwright test tests/e2e/launch-performance-metadata.spec.ts --grep "smooth-scroll|prioritizes"
```

Expected: 2 passed.

- [ ] **Step 5: Commit**

```bash
git add src/app/layout.tsx src/app/work/WorkGrid.tsx src/app/work/[slug]/page.tsx
git commit -m "perf: prioritize route LCP images"
```

### Task 5: Verify performance and metadata

**Files:**
- Review: all files changed in Tasks 1–4

- [ ] **Step 1: Run the focused workstream suite**

```bash
npx playwright test tests/e2e/launch-performance-metadata.spec.ts
```

Expected: all tests pass.

- [ ] **Step 2: Run lint and production build**

```bash
npm run lint
npm run build
```

Expected: both exit 0 and the image/scroll warnings no longer appear in browser output.

- [ ] **Step 3: Run sequential mobile Lighthouse samples**

Start the built app on port 3100, then run one report at a time:

```bash
npx --yes lighthouse http://127.0.0.1:3100/services --only-categories=performance,accessibility,seo,best-practices --output=json --output-path=/tmp/techwise-services-launch.json --chrome-flags="--headless --no-sandbox"
npx --yes lighthouse http://127.0.0.1:3100/services/web --only-categories=performance,accessibility,seo,best-practices --output=json --output-path=/tmp/techwise-web-launch.json --chrome-flags="--headless --no-sandbox"
npx --yes lighthouse http://127.0.0.1:3100/work --only-categories=performance,accessibility,seo,best-practices --output=json --output-path=/tmp/techwise-work-launch.json --chrome-flags="--headless --no-sandbox"
```

Expected: accessibility and SEO are `1`; performance does not regress below the audited baseline; target LCP is under 3.0 seconds on these local sequential samples.

- [ ] **Step 4: Inspect the diff**

```bash
git diff HEAD~4 --check
git status --short
```

Expected: no whitespace errors and no uncommitted production changes.
