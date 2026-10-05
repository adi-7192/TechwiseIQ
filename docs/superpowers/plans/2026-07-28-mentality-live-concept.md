> **Historical (written for the Kinetic design, deleted — D-028).** Kept for reference only; do not build from it.
> The demo in `public/concepts/` still ships (media self-hosted since ROADMAP 6.1); its Work-page integration was rebuilt.
> Current: `docs/site-spec.md`, `docs/design-system.md`, `docs/DECISIONS.md`.

# mėntality Live Concept Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the mėntality standalone mental-wellbeing sample and publish it as the second automated live preview on `/work`.

**Architecture:** Add a dependency-free HTML/CSS/JavaScript page at `public/concepts/mentality/`. Reuse the verified `LiveConceptPreview` client component unchanged. Promote only the second manifest entry; TerraElix remains published and Lumora remains an honest draft.

**Tech Stack:** Semantic HTML, CSS, vanilla JavaScript, existing Next.js Concept Lab manifest/client preview, Playwright.

**Working directory:** `/Users/adi7192/Documents/TechwiseIQ/website/.worktrees/concept-lab-samples`

---

### Task 1: Build the standalone mėntality page

**Files:**
- Create: `tests/e2e/mentality.spec.ts`
- Create: `public/concepts/mentality/index.html`
- Create: `public/concepts/mentality/styles.css`
- Create: `public/concepts/mentality/script.js`

- [ ] **Step 1: Write failing standalone tests**

```ts
import { expect, test } from '@playwright/test'

test.describe('mėntality concept', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/concepts/mentality/index.html')
  })

  test('renders the editorial mental-wellbeing hero', async ({ page }) => {
    await expect(page).toHaveTitle('mėntality — Mental wellbeing resources')
    await expect(page.getByRole('link', { name: 'mėntality' })).toBeVisible()
    await expect(
      page.getByRole('heading', {
        level: 1,
        name: /Mentality offers information and resources/,
      }),
    ).toBeVisible()
    await expect(page.getByLabel('Ask mėntality')).toHaveAttribute(
      'placeholder',
      'Ask me anything...',
    )
    await expect(page.locator('video')).toHaveAttribute(
      'src',
      'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260603_132049_036591b8-6e92-4760-b94c-a7ea6eef315c.mp4',
    )
    await expect(page.getByText('pl — en')).toBeVisible()
    await expect(page.getByText('2024', { exact: true })).toBeVisible()
    await expect(page.getByText('mental health tools')).toBeVisible()
  })

  test('opens and closes the mobile navigation accessibly', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    const toggle = page.locator('.menu-toggle')
    await expect(toggle).toHaveAccessibleName('Open menu')
    await toggle.click()
    await expect(toggle).toHaveAttribute('aria-expanded', 'true')
    await expect(page.getByRole('dialog', { name: 'Site menu' })).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(
      await page.evaluate(
        () =>
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth,
      ),
    ).toBeLessThanOrEqual(1)
  })

  test('keeps the exact base background and reduced-motion fallback', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.reload()
    await expect(page.locator('body')).toHaveCSS(
      'background-color',
      'rgb(237, 238, 245)',
    )
    await expect(page.getByRole('heading', { level: 1 })).toHaveCSS(
      'opacity',
      '1',
    )
  })
})
```

- [ ] **Step 2: Verify RED**

Run:

```bash
npx playwright test tests/e2e/mentality.spec.ts
```

Expected: all tests fail because `/concepts/mentality/index.html` is absent.

- [ ] **Step 3: Implement semantic HTML**

Create a single page with:

- Google Fonts links for Inter and Outfit.
- Fixed 12-column glass-gradient header.
- Inline geometric clover SVG and exact `mėntality` wordmark.
- Desktop links: `service`, `patient resources`, `about us`, `education center`.
- Right actions: `find help`, `get started →`, and an animated mobile hamburger.
- A mobile `role="dialog"` drawer using the same links.
- Hero `h1` whose accessible text is `Mentality offers information and resources to help you manage your mental wellbeing.` and whose visual spans use `#1a1a1a` for the opening phrase and `#8e8e8e` thereafter.
- Inline eye pill between `your` and `mental`.
- Search control with `<label class="sr-only" for="mentality-search">Ask mėntality</label>`, placeholder `Ask me anything...`, and a round submit button.
- Exact CloudFront video with `autoplay loop muted playsinline`.
- Language, year, and tool edge labels.

- [ ] **Step 4: Implement exact responsive CSS**

Required tokens and geometry:

```css
:root {
  --font-sans: Inter, system-ui, sans-serif;
  --font-display: Outfit, system-ui, sans-serif;
  --brand-green: #9fff00;
  --bg-base: #edeef5;
  --ink: #1a1a1a;
  --muted: #8e8e8e;
}
```

- Body: `background: var(--bg-base); color: #18181b; font-family: var(--font-sans)`.
- Header: fixed, `padding: 40px 32px`, soft vertical gradient and `backdrop-filter: blur(2px)`.
- Header inner: 12-column grid, `max-width: 1280px`.
- Hero: `min-height: 110vh`; at 640px and above `min-height: 140vh`.
- Video wrapper: `top: 15vh; height: 95vh`; at 640px and above `top: 20vh; height: 120vh`.
- Video: full size, `object-fit: cover`; top blend gradient from `var(--bg-base)` to transparent.
- Hero grid: 12 columns, max 1280px, responsive 32/64/80px gutters.
- Heading: Outfit, responsive clamp from 42px through 82px, tight tracking, max 10 columns.
- Search pill: white, 6px radius, 1px translucent border, integrated transparent input, 36px black action.
- Edge labels remain inside viewport safe gutters.
- Phone rules use the 768px canonical boundary; hamburger and drawer appear below 768px.
- Reduced motion removes entrance and drawer transitions.

- [ ] **Step 5: Implement drawer behavior**

`script.js` must:

- toggle `hidden`, `aria-expanded`, and the button accessible name;
- lock body scrolling while open;
- move focus to the first drawer link;
- close on link activation and Escape;
- return focus to the toggle after keyboard dismissal.

- [ ] **Step 6: Verify GREEN and commit**

Run:

```bash
npx playwright test tests/e2e/mentality.spec.ts
```

Expected: 3 tests pass.

Commit:

```bash
git add public/concepts/mentality tests/e2e/mentality.spec.ts
git commit -m "feat: build mentality concept demo"
```

### Task 2: Publish the second live Concept Lab entry

**Files:**
- Modify: `src/data/concept-sites.ts`
- Modify: `tests/e2e/work-page.spec.ts`

- [ ] **Step 1: Write failing mixed-state coverage**

Update Work-page assertions to require:

```ts
const slots = page.locator('[data-concept-stage]')
await expect(slots.nth(0)).toHaveAttribute('data-concept-status', 'published')
await expect(slots.nth(1)).toHaveAttribute('data-concept-status', 'published')
await expect(slots.nth(2)).toHaveAttribute('data-concept-status', 'draft')
await expect(page.getByText('Brief pending', { exact: true })).toHaveCount(1)
await expect(
  slots.nth(1).getByRole('link', {
    name: 'Open mėntality live HTML demo (opens in a new tab)',
  }),
).toHaveAttribute('href', '/concepts/mentality/index.html')
```

Add a focused lazy-preview assertion:

```ts
test('loads the mėntality live preview in its second stage', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/work')
  const stage = page.locator('[data-concept-stage]').nth(1)
  await stage.scrollIntoViewIfNeeded()
  const frame = stage.locator('iframe')
  await expect(frame).toHaveAttribute('src', '/concepts/mentality/index.html')
  await expect(frame).toHaveAttribute('data-preview-state', 'ready')
})
```

- [ ] **Step 2: Verify RED**

Run:

```bash
npx playwright test tests/e2e/work-page.spec.ts -g "mėntality|later concept"
```

Expected: FAIL because the second manifest entry remains draft.

- [ ] **Step 3: Publish only mėntality**

Use:

```ts
{
  slug: 'mentality',
  title: 'mėntality',
  category: 'Mental wellbeing',
  summary:
    'An editorial mental-health resource experience combining calm guidance with conversational discovery.',
  tags: ['Editorial UI', 'Video', 'Glass UI'],
  demoPath: '/concepts/mentality/index.html',
  previewMode: 'live-auto-scroll',
  status: 'published',
}
```

Do not alter TerraElix or publish Lumora.

- [ ] **Step 4: Verify GREEN and commit**

Run:

```bash
npx playwright test tests/e2e/work-page.spec.ts tests/e2e/mentality.spec.ts
npm run lint
```

Expected: focused browser tests and lint pass.

Commit:

```bash
git add src/data/concept-sites.ts tests/e2e/work-page.spec.ts
git commit -m "feat: publish mentality live concept"
```

### Task 3: Visual and production verification

**Files:**
- Modify only if verification finds a tested defect: `public/concepts/mentality/*`
- Modify only if verification finds a tested defect: `tests/e2e/mentality.spec.ts`

- [ ] **Step 1: Run deterministic verification**

```bash
npm run test:unit
npm run lint
npx playwright test tests/e2e/mentality.spec.ts tests/e2e/work-page.spec.ts
npm run build
```

- [ ] **Step 2: Capture and inspect screenshots**

Capture settled screenshots at 1440×1000, 768×1024, and 375×812, plus the second Work-page concept stage. Confirm:

- exact `#EDEEF5` field and supplied video;
- Outfit/Inter hierarchy and grey text progression;
- visible eye pill and search control;
- balanced fixed navigation;
- mobile drawer and no horizontal overflow;
- live browser-frame rendering with one remaining draft.

- [ ] **Step 3: Final branch check**

```bash
git diff --check
git status --short
```

Commit any tested visual correction with:

```bash
git add public/concepts/mentality tests/e2e/mentality.spec.ts
git commit -m "fix: polish mentality responsive concept"
```
