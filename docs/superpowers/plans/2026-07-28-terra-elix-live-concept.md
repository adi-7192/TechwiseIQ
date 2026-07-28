# TerraElix Live Concept Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and publish the TerraElix standalone sample site, then replace its Work-page draft slot with a lazy-loaded, automatically scrolling live preview.

**Architecture:** TerraElix is a dependency-free static site served from `public/concepts/terra-elix/`. The Next.js Work page keeps its server-rendered Concept Lab and delegates iframe mounting, scrolling, media pausing, and failure state to one focused client component. The manifest publishes only TerraElix; the other two concepts remain drafts.

**Tech Stack:** Semantic HTML, CSS, vanilla JavaScript, Next.js 16 App Router, React 19 client component, TypeScript, Node test runner, Playwright.

**Working directory:** `/Users/adi7192/Documents/TechwiseIQ/website/.worktrees/concept-lab-samples`

---

## File map

- Create `public/concepts/terra-elix/index.html` — semantic TerraElix page structure and exact remote assets.
- Create `public/concepts/terra-elix/styles.css` — responsive layout, typography, and motion.
- Create `public/concepts/terra-elix/script.js` — mobile menu and formula carousel.
- Create `src/app/work/LiveConceptPreview.tsx` — lazy iframe lifecycle and automatic scroll controller.
- Modify `src/data/concept-sites.ts` — live-preview manifest contract and TerraElix metadata.
- Modify `src/app/work/concept-presentation.ts` — published-state validation for live previews.
- Modify `src/app/work/ConceptLab.tsx` — render the live preview for published concepts.
- Modify `src/app/work/work.module.css` — iframe, loading, ready, and unavailable presentation.
- Modify `tests/unit/concept-presentation.test.ts` — enforce the revised publishing contract.
- Create `tests/e2e/terra-elix.spec.ts` — standalone desktop/mobile/interaction coverage.
- Modify `tests/e2e/work-page.spec.ts` — one published live preview and two honest drafts.

### Task 1: Revise the Concept Lab publishing contract

**Files:**
- Modify: `tests/unit/concept-presentation.test.ts`
- Modify: `src/app/work/concept-presentation.ts`
- Modify: `src/data/concept-sites.ts`

- [ ] **Step 1: Read the repository-required Next.js guidance**

Run:

```bash
sed -n '1,240p' node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md
sed -n '1,200p' node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/public-folder.md
sed -n '1,180p' node_modules/next/dist/docs/01-app/03-api-reference/01-directives/use-client.md
```

Expected: documentation confirms that `public` files are served from the site root and that the iframe lifecycle component needs a `'use client'` boundary.

- [ ] **Step 2: Replace the unit tests with the live-preview contract**

Use:

```ts
import assert from 'node:assert/strict'
import test from 'node:test'
// @ts-expect-error Node's built-in TypeScript runner requires the file extension.
import { getConceptPresentationStatus } from '../../src/app/work/concept-presentation.ts'

test('keeps incomplete published concepts honest and noninteractive', () => {
  assert.equal(
    getConceptPresentationStatus({
      status: 'published',
      demoPath: '/concepts/terra-elix/index.html',
    }),
    'unavailable',
  )
  assert.equal(
    getConceptPresentationStatus({
      status: 'published',
      previewMode: 'live-auto-scroll',
    }),
    'unavailable',
  )
})

test('publishes a concept only with a demo and live preview mode', () => {
  assert.equal(
    getConceptPresentationStatus({
      status: 'published',
      demoPath: '/concepts/terra-elix/index.html',
      previewMode: 'live-auto-scroll',
    }),
    'published',
  )
})

test('preserves the draft state', () => {
  assert.equal(getConceptPresentationStatus({ status: 'draft' }), 'draft')
})
```

- [ ] **Step 3: Run the unit test and verify it fails**

Run:

```bash
npm run test:unit -- tests/unit/concept-presentation.test.ts
```

Expected: FAIL because `previewMode` is not accepted and the old implementation still requires `previewImage`.

- [ ] **Step 4: Implement the revised presentation input**

Use:

```ts
export type ConceptPresentationStatus = 'draft' | 'published' | 'unavailable'

type ConceptPresentationInput = {
  status: 'draft' | 'published'
  previewMode?: 'live-auto-scroll'
  demoPath?: string
}

export function getConceptPresentationStatus(
  concept: ConceptPresentationInput,
): ConceptPresentationStatus {
  if (concept.status === 'draft') return 'draft'
  return concept.previewMode === 'live-auto-scroll' && concept.demoPath
    ? 'published'
    : 'unavailable'
}
```

Update the manifest type but keep all entries draft until TerraElix itself passes:

```ts
export type ConceptSite = {
  slug: string
  title: string
  category: string
  summary: string
  tags: string[]
  demoPath?: string
  previewMode?: 'live-auto-scroll'
  status: 'draft' | 'published'
}
```

- [ ] **Step 5: Run unit tests and lint**

Run:

```bash
npm run test:unit
npm run lint
```

Expected: 13 tests pass and ESLint exits successfully.

- [ ] **Step 6: Commit the contract**

```bash
git add src/data/concept-sites.ts src/app/work/concept-presentation.ts tests/unit/concept-presentation.test.ts
git commit -m "refactor: support live concept previews"
```

### Task 2: Build the TerraElix standalone page

**Files:**
- Create: `tests/e2e/terra-elix.spec.ts`
- Create: `public/concepts/terra-elix/index.html`
- Create: `public/concepts/terra-elix/styles.css`
- Create: `public/concepts/terra-elix/script.js`

- [ ] **Step 1: Write the failing standalone-page tests**

Use:

```ts
import { expect, test } from '@playwright/test'

test.describe('TerraElix concept', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/concepts/terra-elix/index.html')
  })

  test('renders the specified wellness composition', async ({ page }) => {
    await expect(page).toHaveTitle('TerraElix — Plant-based wellness')
    await expect(page.getByRole('link', { name: 'TerraElix' })).toBeVisible()
    await expect(
      page.getByRole('heading', {
        level: 1,
        name: 'The Power of Nature in Every Capsule',
      }),
    ).toBeVisible()
    await expect(page.getByRole('link', { name: /Explore Now/ })).toBeVisible()
    await expect(page.locator('[data-terra-panel]')).toHaveCount(3)
    await expect(page.locator('[data-formula-card]')).toHaveCount(4)
  })

  test('rotates formula cards and marks the active indicator', async ({
    page,
  }) => {
    const cards = page.locator('[data-formula-card]')
    await expect(cards.nth(0)).toHaveAttribute('aria-hidden', 'false')
    await expect(page.locator('[data-formula-dot]').nth(0)).toHaveAttribute(
      'data-active',
      'true',
    )
    await expect(cards.nth(1)).toHaveAttribute('aria-hidden', 'false', {
      timeout: 4_500,
    })
  })

  test('provides an accessible mobile menu without horizontal overflow', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    const toggle = page.getByRole('button', { name: 'Open menu' })
    await toggle.click()
    await expect(toggle).toHaveAttribute('aria-expanded', 'true')
    await expect(page.getByRole('dialog', { name: 'Site menu' })).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(toggle).toHaveAttribute('aria-expanded', 'false')

    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    )
    expect(overflow).toBeLessThanOrEqual(1)
  })

  test('stops non-essential movement under reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.reload()
    await expect(page.locator('[data-formula-card]').nth(0)).toHaveAttribute(
      'aria-hidden',
      'false',
    )
    await page.waitForTimeout(3_700)
    await expect(page.locator('[data-formula-card]').nth(0)).toHaveAttribute(
      'aria-hidden',
      'false',
    )
  })
})
```

- [ ] **Step 2: Run the direct-page test and verify it fails**

Run:

```bash
npx playwright test tests/e2e/terra-elix.spec.ts
```

Expected: FAIL with a 404 page or missing `TerraElix` content.

- [ ] **Step 3: Create the semantic HTML**

Create `index.html` with:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta
      name="description"
      content="TerraElix plant-based supplements for daily balance and clean energy."
    />
    <title>TerraElix — Plant-based wellness</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500&family=Inter:wght@400;500&display=swap"
      rel="stylesheet"
    />
    <link rel="stylesheet" href="./styles.css" />
    <script src="./script.js" defer></script>
  </head>
  <body>
    <div class="site-shell">
      <header class="site-header animate-fade-in">
        <a class="brand animate-slide-left delay-200" href="#top">TerraElix</a>
        <nav class="desktop-nav animate-fade-in delay-400" aria-label="Primary">
          <a href="#about">About</a>
          <a href="#products">Products</a>
          <a href="#promotions">Promotions</a>
          <a href="#contact">Contact</a>
        </nav>
        <div class="header-actions animate-slide-right delay-300">
          <button class="icon-button" type="button" aria-label="Search">
            <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
          </button>
          <button class="icon-button" type="button" aria-label="Shopping bag">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18M16 10a4 4 0 0 1-8 0" /></svg>
          </button>
          <button class="icon-button return-button" type="button" aria-label="Return">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 14-5-5 5-5" /><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11" /></svg>
          </button>
          <img class="avatar" src="https://polo-pecan-73837341.figma.site/_assets/v11/ca8093996e970200cbcf8bde8744175e52da5a79.png" alt="" />
          <button class="menu-toggle" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-menu">
            <svg class="menu-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
            <svg class="close-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m18 6-12 12M6 6l12 12" /></svg>
          </button>
        </div>
      </header>

      <div id="mobile-menu" class="mobile-menu" role="dialog" aria-label="Site menu" aria-modal="true" hidden>
        <nav aria-label="Mobile primary">
          <a href="#about">About</a><a href="#products">Products</a>
          <a href="#promotions">Promotions</a><a href="#contact">Contact</a>
        </nav>
      </div>

      <main id="top" class="hero">
        <h1 class="hero-title" aria-label="The Power of Nature in Every Capsule">
          <span class="headline-line">
            <span class="word animate-word-reveal delay-300"><span>The</span></span>
            <span class="word animate-word-reveal delay-400"><span>Power</span></span>
            <span class="word dim animate-word-reveal delay-500"><span>of</span></span>
          </span>
          <span class="headline-line">
            <span class="word dim animate-word-reveal delay-600"><span>Nature</span></span>
            <span class="word dim animate-word-reveal delay-700"><span>in</span></span>
            <span class="word animate-word-reveal delay-800"><span>Every</span></span>
          </span>
          <span class="headline-line capsule-line">
            <span class="word animate-word-reveal delay-900"><span>Capsule</span></span>
            <img class="capsule-inline animate-scale-in delay-1000" src="https://polo-pecan-73837341.figma.site/_assets/v11/6a7de4fbe9c9e2315040607320a9ff5e93117bf4.png" alt="" />
          </span>
        </h1>
        <div class="cta-row animate-fade-up delay-600">
          <a class="primary-cta" href="#products">Explore Now
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M7 7h10v10" /></svg>
          </a>
          <p>Discover our new plant-based supplements for daily balance and clean energy.</p>
        </div>
      </main>

      <img class="mobile-product animate-scale-in delay-800" src="https://polo-pecan-73837341.figma.site/_assets/v11/50ad042b3cd48a2e120ea3ba17c8cfeaf3cc334c.png" alt="TerraElix supplement pouch" />

      <section class="panel-grid" aria-label="TerraElix highlights">
        <article id="about" class="panel assessment-panel animate-fade-up delay-900" data-terra-panel>
          <h2>Start your personalized path to natural balance</h2>
          <a href="#contact">Personal Assessment</a>
          <img src="https://polo-pecan-73837341.figma.site/_assets/v11/6736cbe6e26afa2cd7c04a91892a79f7640785b5.png" alt="" />
        </article>
        <article id="promotions" class="panel formula-panel animate-fade-up delay-1000" data-terra-panel aria-label="Formula highlights">
          <div class="formula-stack" aria-live="off">
            <div class="formula-card active" data-formula-card aria-hidden="false"><span class="formula-icon black"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 3h6M10 9V3h4v6l5 9a2 2 0 0 1-1.7 3H6.7A2 2 0 0 1 5 18Z" /><path d="M7.5 15h9" /></svg></span><p>Experience our newly enhanced natural formula</p></div>
            <div class="formula-card" data-formula-card aria-hidden="true"><span class="formula-icon green"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 18 2 18 2c1 5.5-.2 10-3 12.5C13 16.3 11 18 11 20Z" /><path d="M2 21c0-3 1.9-5.4 5-7" /></svg></span><p>Pure organic ingredients sourced sustainably</p></div>
            <div class="formula-card" data-formula-card aria-hidden="true"><span class="formula-icon cyan"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 16.5A3.5 3.5 0 1 1 3.5 13 3.5 3.5 0 0 1 7 16.5Z" /><path d="M21 14.5a4.5 4.5 0 1 1-9 0C12 11 16.5 5 16.5 5S21 11 21 14.5Z" /></svg></span><p>Advanced bioavailability for maximum absorption</p></div>
            <div class="formula-card" data-formula-card aria-hidden="true"><span class="formula-icon amber"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" /></svg></span><p>Clinically tested for daily energy &amp; vitality</p></div>
          </div>
          <div class="formula-dots" aria-hidden="true">
            <span data-formula-dot data-active="true"></span><span data-formula-dot data-active="false"></span>
            <span data-formula-dot data-active="false"></span><span data-formula-dot data-active="false"></span>
          </div>
        </article>
        <article id="products" class="panel proof-panel animate-fade-up delay-1100" data-terra-panel>
          <img src="https://polo-pecan-73837341.figma.site/_assets/v11/30e8f38d1f993c357a3be2721557fc899d5640fc.png" alt="TerraElix daily supplement" />
          <div><strong>+14K</strong><p>People have already optimized their wellness</p></div>
        </article>
      </section>

      <img class="desktop-product animate-scale-in delay-700" src="https://polo-pecan-73837341.figma.site/_assets/v11/50ad042b3cd48a2e120ea3ba17c8cfeaf3cc334c.png" alt="TerraElix supplement pouch" />
      <span id="contact" class="contact-anchor" aria-hidden="true"></span>
    </div>
  </body>
</html>
```

- [ ] **Step 4: Create the responsive visual system**

Implement `styles.css` with the exact values below; retain the supplied asset URLs from the HTML:

```css
:root { color-scheme: dark; --ease: cubic-bezier(.16,1,.3,1); }
* { box-sizing: border-box; margin: 0; padding: 0; }
html { overflow-x: clip; scroll-behavior: smooth; }
body { min-width: 320px; overflow-x: clip; background: #557354; color: #fff; font-family: Inter, sans-serif; }
button, input, a { font: inherit; }
a { color: inherit; }
button { border: 0; color: inherit; }
.site-shell {
  position: relative; display: flex; min-height: 100vh; min-height: 100svh;
  flex-direction: column; overflow: hidden; isolation: isolate;
  background: #557354 url("https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260624_110248_b62f758d-f68c-4045-a7b4-91771d6d0a0f.png&w=1280&q=85") center/cover no-repeat;
}
.site-shell::before { position: absolute; z-index: -1; inset: 0; content: ""; background: linear-gradient(90deg,rgba(0,0,0,.12),transparent 58%); }
.site-header { z-index: 40; display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; padding: 20px 40px; }
.brand { font: 500 30px/1 "DM Sans",sans-serif; letter-spacing: -.05em; text-decoration: none; }
.desktop-nav { display: flex; gap: 40px; font: 500 18px/1 "DM Sans",sans-serif; }
.desktop-nav a { color: rgb(255 255 255/.9); text-decoration: none; }
.header-actions { display: flex; justify-content: flex-end; align-items: center; gap: 12px; }
.icon-button,.menu-toggle { display: grid; width: 40px; height: 44px; place-items: center; cursor: pointer; background: transparent; }
.icon-button svg,.menu-toggle svg,.primary-cta svg { width: 20px; fill: none; stroke: currentColor; stroke-linecap: round; stroke-linejoin: round; stroke-width: 1.5; }
.avatar { width: 40px; height: 40px; border-radius: 50%; object-fit: cover; }
.menu-toggle { position: relative; display: none; }
.menu-toggle svg { position: absolute; transition: .25s var(--ease); }
.menu-toggle .close-icon { opacity: 0; transform: rotate(-90deg) scale(.75); }
.menu-toggle[aria-expanded="true"] .menu-icon { opacity: 0; transform: rotate(90deg) scale(.75); }
.menu-toggle[aria-expanded="true"] .close-icon { opacity: 1; transform: none; }
.mobile-menu { position: fixed; z-index: 30; inset: 0; background: rgb(0 0 0/.9); }
.mobile-menu nav { display: flex; height: 100%; align-items: center; justify-content: center; flex-direction: column; gap: 28px; }
.mobile-menu a { font: 400 28px/1.1 "DM Sans",sans-serif; text-decoration: none; }
.hero { z-index: 2; display: flex; flex: 1; justify-content: center; flex-direction: column; padding: 5vh 40px 7vh; }
.hero-title { max-width: 1460px; font: 400 clamp(48px,10.75vw,155px)/.81 "DM Sans",sans-serif; letter-spacing: -.05em; }
.headline-line { display: flex; align-items: center; gap: .16em; white-space: nowrap; }
.word { display: inline-block; overflow: hidden; }
.word > span { display: inline-block; }
.word.dim { color: rgb(255 255 255/.45); }
.capsule-inline { display: inline-block; width: auto; height: clamp(60px,10vw,160px); margin-left: 8px; vertical-align: middle; }
.cta-row { display: flex; align-items: center; gap: 50px; margin-top: 75px; }
.primary-cta { display: flex; width: 310px; height: 72px; align-items: center; justify-content: space-between; padding: 0 24px; border-radius: 6px; background: #000; font-size: 24px; font-weight: 500; letter-spacing: -.03em; text-decoration: none; }
.primary-cta svg { width: 24px; }
.cta-row p { max-width: 310px; font-size: 18px; line-height: 1.45; letter-spacing: -.03em; }
.desktop-product { position: absolute; z-index: 0; right: clamp(-400px,-20vw,-100px); bottom: -10%; display: block; width: clamp(600px,80vw,1412px); height: auto; filter: drop-shadow(0 28px 35px rgb(0 0 0/.28)); }
.mobile-product { display: none; }
.panel-grid { z-index: 10; display: grid; grid-template-columns: 2fr 1fr 2fr; }
.panel { position: relative; min-height: 190px; padding: 30px 34px; overflow: hidden; color: #0b0b0b; }
.assessment-panel { display: flex; justify-content: space-between; flex-direction: column; background: #ecedec; }
.assessment-panel h2 { z-index: 1; max-width: 350px; font: 400 35px/1.1 "DM Sans",sans-serif; letter-spacing: -.05em; }
.assessment-panel a { z-index: 1; width: fit-content; font-size: 18px; letter-spacing: -.03em; }
.assessment-panel img { position: absolute; right: 0; bottom: 0; height: 100%; mix-blend-mode: multiply; }
.formula-panel { display: flex; justify-content: space-between; flex-direction: column; background: #fefdf9; }
.formula-stack { position: relative; min-height: 100px; }
.formula-card { position: absolute; inset: 0; display: flex; align-items: center; gap: 16px; opacity: 0; transform: translateY(16px); transition: .55s var(--ease); }
.formula-card.active { position: relative; opacity: 1; transform: none; }
.formula-icon { display: grid; width: 48px; height: 48px; flex: 0 0 48px; place-items: center; border-radius: 50%; color: #fff; font-size: 22px; }
.formula-icon svg { width: 22px; fill: none; stroke: currentColor; stroke-linecap: round; stroke-linejoin: round; stroke-width: 1.5; }
.formula-icon.black { background: #000; }.formula-icon.green { background: #065f46; }.formula-icon.cyan { background: #155e75; }.formula-icon.amber { background: #b45309; }
.formula-card p { font-size: 18px; line-height: 1.2; letter-spacing: -.03em; color: rgb(0 0 0/.8); }
.formula-dots { display: flex; gap: 6px; }
.formula-dots span { height: 2px; flex: 1; border-radius: 10px; background: rgb(0 0 0/.2); }
.formula-dots span[data-active="true"] { background: #000; }
.proof-panel { display: flex; align-items: center; gap: 28px; background: #000; color: #fff; }
.proof-panel img { width: 208px; height: 142px; object-fit: contain; }
.proof-panel strong { font-size: 35px; font-weight: 400; letter-spacing: -.05em; }
.proof-panel p { margin-top: 8px; max-width: 230px; color: rgb(255 255 255/.6); font-size: 18px; line-height: 1.2; }
.contact-anchor { position: absolute; bottom: 0; }
@keyframes fadeUp { from { opacity:0; transform:translateY(30px) } to { opacity:1; transform:none } }
@keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
@keyframes slideInLeft { from { opacity:0; transform:translateX(-40px) } to { opacity:1; transform:none } }
@keyframes slideInRight { from { opacity:0; transform:translateX(40px) } to { opacity:1; transform:none } }
@keyframes scaleIn { from { opacity:0; transform:scale(.9) } to { opacity:1; transform:scale(1) } }
@keyframes wordReveal { from { opacity:0; transform:translateY(100%); filter:blur(4px) } to { opacity:1; transform:none; filter:blur(0) } }
.animate-fade-up { animation: fadeUp .8s var(--ease) both; }.animate-fade-in { animation: fadeIn .7s var(--ease) both; }
.animate-slide-left { animation: slideInLeft .8s var(--ease) both; }.animate-slide-right { animation: slideInRight .8s var(--ease) both; }
.animate-scale-in { animation: scaleIn 1s var(--ease) both; }.animate-word-reveal > span { animation: wordReveal .7s var(--ease) both; }
.delay-200 { animation-delay:.2s!important }.delay-300 { animation-delay:.3s!important }.delay-400 { animation-delay:.4s!important }
.delay-500 { animation-delay:.5s!important }.delay-600 { animation-delay:.6s!important }.delay-700 { animation-delay:.7s!important }
.delay-800 { animation-delay:.8s!important }.delay-900 { animation-delay:.9s!important }.delay-1000 { animation-delay:1s!important }.delay-1100 { animation-delay:1.1s!important }
@media (max-width:1024px) {
  .site-header { padding: 16px 32px; }
  .desktop-nav { gap: 24px; font-size: 16px; }
  .hero { padding: 6vh 32px 0; }
  .hero-title { font-size: 110px; line-height: 95px; }
  .cta-row { margin-top: 48px; gap: 32px; }
  .primary-cta { width: 280px; height: 64px; font-size: 20px; }
  .mobile-product { position: relative; z-index: 1; display: block; width: 151%; max-width: 1296px; height: auto; margin: 10px auto -220px; filter: drop-shadow(0 28px 35px rgb(0 0 0/.35)); }
  .desktop-product { display: none; }
  .panel { min-height: 170px; padding: 26px; }
  .assessment-panel h2 { font-size: 28px; }.formula-card p,.proof-panel p { font-size: 16px; }
  .proof-panel img { width: 160px; height: 110px; }.proof-panel strong { font-size: 30px; }
}
@media (max-width:768px) {
  .site-header { grid-template-columns: 1fr auto; padding: 16px 20px; }
  .brand { font-size: 30px; }.desktop-nav { display: none; }.return-button { display: none; }.avatar { width: 32px; height: 32px; }.menu-toggle { display: grid; }
  .hero { min-height: 610px; padding: 80px 20px 24px; }
  .hero-title { font-size: 48px; line-height: 50px; }
  .capsule-inline { display: none; }
  .cta-row { align-items: flex-start; flex-direction: column; gap: 20px; margin-top: 32px; }
  .primary-cta { width: 100%; height: 56px; font-size: 18px; }.cta-row p { max-width: 310px; font-size: 14px; }
  .mobile-product { width: 180%; margin-bottom: -180px; }
  .panel-grid { grid-template-columns: 1fr; }
  .panel { min-height: 184px; padding: 24px 20px; }.assessment-panel h2 { max-width: 260px; font-size: 24px; }
  .formula-card p { font-size: 14px; }.formula-icon { width: 40px; height: 40px; flex-basis: 40px; }
  .proof-panel { justify-content: center; }.proof-panel img { width: 120px; height: 82px; }.proof-panel strong { font-size: 24px; }.proof-panel p { font-size: 14px; }
}
@media (pointer:coarse) { .desktop-nav a,.assessment-panel a { min-height:44px; display:inline-flex; align-items:center; } }
@media (prefers-reduced-motion:reduce) {
  html { scroll-behavior:auto; }
  *,*::before,*::after { animation-duration:.01ms!important; animation-delay:0s!important; transition-duration:.01ms!important; }
}
```

- [ ] **Step 5: Add menu and carousel behavior**

Use:

```js
const menuToggle = document.querySelector('.menu-toggle')
const mobileMenu = document.querySelector('#mobile-menu')
const menuLinks = mobileMenu.querySelectorAll('a')
const cards = [...document.querySelectorAll('[data-formula-card]')]
const dots = [...document.querySelectorAll('[data-formula-dot]')]
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
let activeCard = 0
let carouselTimer

function setMenu(open) {
  menuToggle.setAttribute('aria-expanded', String(open))
  menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu')
  mobileMenu.hidden = !open
  document.body.style.overflow = open ? 'hidden' : ''
  if (open) mobileMenu.querySelector('a').focus()
  if (!open && mobileMenu.contains(document.activeElement)) menuToggle.focus()
}

function showCard(index) {
  activeCard = index
  cards.forEach((card, cardIndex) => {
    const active = cardIndex === activeCard
    card.classList.toggle('active', active)
    card.setAttribute('aria-hidden', String(!active))
    dots[cardIndex].dataset.active = String(active)
  })
}

function syncCarousel() {
  window.clearInterval(carouselTimer)
  showCard(0)
  if (!reduceMotion.matches) {
    carouselTimer = window.setInterval(
      () => showCard((activeCard + 1) % cards.length),
      3500,
    )
  }
}

menuToggle.addEventListener('click', () => {
  setMenu(menuToggle.getAttribute('aria-expanded') !== 'true')
})
menuLinks.forEach((link) => link.addEventListener('click', () => setMenu(false)))
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') setMenu(false)
})
reduceMotion.addEventListener('change', syncCarousel)
syncCarousel()
```

- [ ] **Step 6: Run TerraElix tests**

Run:

```bash
npx playwright test tests/e2e/terra-elix.spec.ts
```

Expected: 4 tests pass.

- [ ] **Step 7: Commit the standalone demo**

```bash
git add public/concepts/terra-elix tests/e2e/terra-elix.spec.ts
git commit -m "feat: build TerraElix concept demo"
```

### Task 3: Publish TerraElix with the reusable live-preview controller

**Files:**
- Create: `src/app/work/LiveConceptPreview.tsx`
- Modify: `src/data/concept-sites.ts`
- Modify: `src/app/work/ConceptLab.tsx`
- Modify: `src/app/work/work.module.css`
- Modify: `tests/e2e/work-page.spec.ts`

- [ ] **Step 1: Add failing Work-page live-preview and mixed-state tests**

Append a new test to `tests/e2e/work-page.spec.ts`:

```ts
test('runs the TerraElix live preview and respects reduced motion', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/work')
  const stage = page.locator('[data-concept-stage]').first()
  await stage.scrollIntoViewIfNeeded()
  const frame = stage.locator('iframe')
  await expect(frame).toHaveAttribute(
    'src',
    '/concepts/terra-elix/index.html',
  )
  await expect(frame).toHaveAttribute('data-preview-state', 'ready')
  const reducedY = await frame.evaluate(
    (node: HTMLIFrameElement) => node.contentWindow?.scrollY ?? -1,
  )
  await page.waitForTimeout(1_200)
  expect(
    await frame.evaluate(
      (node: HTMLIFrameElement) => node.contentWindow?.scrollY ?? -1,
    ),
  ).toBe(reducedY)

  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.reload()
  const activeStage = page.locator('[data-concept-stage]').first()
  await activeStage.scrollIntoViewIfNeeded()
  const activeFrame = activeStage.locator('iframe')
  await expect(activeFrame).toHaveAttribute('data-preview-state', 'ready')
  await expect
    .poll(() =>
      activeFrame.evaluate(
        (node: HTMLIFrameElement) => node.contentWindow?.scrollY ?? 0,
      ),
    )
    .toBeGreaterThan(0)

  await page.getByTestId('featured-project-rail').scrollIntoViewIfNeeded()
  const pausedY = await activeFrame.evaluate(
    (node: HTMLIFrameElement) => node.contentWindow?.scrollY ?? -1,
  )
  await page.waitForTimeout(1_200)
  expect(
    await activeFrame.evaluate(
      (node: HTMLIFrameElement) => node.contentWindow?.scrollY ?? -1,
    ),
  ).toBe(pausedY)
})
```

Add failure isolation coverage:

```ts
test('keeps the full-demo action usable when a preview cannot load', async ({
  page,
}) => {
  await page.route('**/concepts/terra-elix/index.html', (route) => route.abort())
  await page.goto('/work')
  const stage = page.locator('[data-concept-stage]').first()
  await stage.scrollIntoViewIfNeeded()
  await expect(stage.getByText('Preview unavailable')).toBeVisible({
    timeout: 11_500,
  })
  await expect(
    stage.getByRole('link', {
      name: 'Open TerraElix live HTML demo (opens in a new tab)',
    }),
  ).toHaveAttribute('href', '/concepts/terra-elix/index.html')
})
```

Replace the draft-only test with:

```ts
test('publishes TerraElix while keeping later concepts honest', async ({
  page,
}) => {
  const lab = page.getByTestId('concept-lab')
  const slots = lab.locator('[data-concept-stage]')
  await expect(slots).toHaveCount(3)
  await expect(slots.nth(0)).toHaveAttribute('data-concept-status', 'published')
  await expect(slots.nth(1)).toHaveAttribute('data-concept-status', 'draft')
  await expect(slots.nth(2)).toHaveAttribute('data-concept-status', 'draft')
  await expect(
    slots.nth(0).getByRole('heading', { name: 'TerraElix' }),
  ).toBeVisible()
  await expect(
    slots.nth(0).getByRole('link', {
      name: 'Open TerraElix live HTML demo (opens in a new tab)',
    }),
  ).toHaveAttribute('href', '/concepts/terra-elix/index.html')
  await expect(page.getByText('Brief pending', { exact: true })).toHaveCount(2)
  await expect(
    lab.getByText('Concept work — not client commissions'),
  ).toBeVisible()
})
```

Update the earlier content assertion from three to two `Brief pending` instances.

- [ ] **Step 2: Run the focused Work-page tests and verify they fail**

Run:

```bash
npx playwright test tests/e2e/work-page.spec.ts -g "TerraElix|preview cannot load"
```

Expected: FAIL because the first manifest entry remains a draft and no concept iframe exists.

- [ ] **Step 3: Implement `LiveConceptPreview`**

Create a client component with these complete behaviors:

```tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './work.module.css'

const LOAD_TIMEOUT_MS = 10_000
const SCROLL_SPEED_PX_PER_MS = 24 / 1000
const END_PAUSE_MS = 2_000

type PreviewState = 'idle' | 'loading' | 'ready' | 'unavailable'

export default function LiveConceptPreview({
  demoPath,
  title,
}: {
  demoPath: string
  title: string
}) {
  const rootRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<HTMLIFrameElement>(null)
  const frameId = useRef<number | null>(null)
  const visible = useRef(false)
  const direction = useRef<1 | -1>(1)
  const pauseUntil = useRef(0)
  const previousTime = useRef(0)
  const [mounted, setMounted] = useState(false)
  const [state, setState] = useState<PreviewState>('idle')

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible.current = entry.isIntersecting
        if (entry.isIntersecting) {
          setMounted(true)
          const media = frameRef.current?.contentDocument?.querySelectorAll('video, audio')
          media?.forEach((item) => void (item as HTMLMediaElement).play().catch(() => {}))
        } else {
          const media = frameRef.current?.contentDocument?.querySelectorAll('video, audio')
          media?.forEach((item) => (item as HTMLMediaElement).pause())
        }
      },
      { rootMargin: '300px 0px', threshold: 0.05 },
    )
    observer.observe(root)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!mounted) return
    setState('loading')
    const timeout = window.setTimeout(
      () => setState((current) => (current === 'ready' ? current : 'unavailable')),
      LOAD_TIMEOUT_MS,
    )
    return () => window.clearTimeout(timeout)
  }, [mounted])

  useEffect(() => {
    if (state !== 'ready') return
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

    const tick = (time: number) => {
      const frameWindow = frameRef.current?.contentWindow
      const frameDocument = frameRef.current?.contentDocument
      if (!frameWindow || !frameDocument) return

      if (
        visible.current &&
        !document.hidden &&
        !reducedMotion.matches &&
        time >= pauseUntil.current
      ) {
        const maxY = Math.max(
          0,
          frameDocument.documentElement.scrollHeight - frameWindow.innerHeight,
        )
        const elapsed = previousTime.current ? time - previousTime.current : 0
        const nextY =
          frameWindow.scrollY +
          elapsed * SCROLL_SPEED_PX_PER_MS * direction.current
        const boundedY = Math.min(maxY, Math.max(0, nextY))
        frameWindow.scrollTo(0, boundedY)
        if (
          (direction.current === 1 && boundedY >= maxY) ||
          (direction.current === -1 && boundedY <= 0)
        ) {
          direction.current = direction.current === 1 ? -1 : 1
          pauseUntil.current = time + END_PAUSE_MS
        }
      }
      previousTime.current = time
      frameId.current = window.requestAnimationFrame(tick)
    }

    frameId.current = window.requestAnimationFrame(tick)
    return () => {
      if (frameId.current !== null) window.cancelAnimationFrame(frameId.current)
    }
  }, [state])

  return (
    <div className={styles.conceptPreview} ref={rootRef}>
      <div className={styles.browserBar} aria-hidden="true">
        <span /><span /><span /><b>{demoPath}</b>
      </div>
      <div className={styles.livePreviewStatus} data-state={state} aria-hidden="true">
        {state === 'unavailable' ? 'Preview unavailable' : 'Loading live preview'}
      </div>
      {mounted && (
        <iframe
          ref={frameRef}
          src={demoPath}
          title={`${title} automated website preview`}
          tabIndex={-1}
          aria-hidden="true"
          loading="lazy"
          allow="autoplay"
          data-preview-state={state}
          className={styles.conceptFrame}
          onLoad={() => {
            direction.current = 1
            pauseUntil.current = performance.now() + END_PAUSE_MS
            previousTime.current = 0
            setState('ready')
          }}
          onError={() => setState('unavailable')}
        />
      )}
    </div>
  )
}
```

- [ ] **Step 4: Add live-preview CSS**

Add:

```css
.conceptFrame {
  position: absolute;
  inset: 38px 0 0;
  width: 100%;
  height: calc(100% - 38px);
  border: 0;
  background: #557354;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.35s ease;
}

.conceptFrame[data-preview-state='ready'] {
  opacity: 1;
}

.livePreviewStatus {
  position: absolute;
  inset: 38px 0 0;
  display: grid;
  place-items: center;
  background:
    linear-gradient(135deg, rgb(255 69 0 / 0.12), transparent 55%),
    var(--paper);
  color: var(--ink);
  font-family: var(--font-mono), monospace;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.livePreviewStatus[data-state='ready'] {
  display: none;
}
```

Extend the reduced-motion selector to include `.conceptFrame`.

- [ ] **Step 5: Publish only the first manifest entry**

Use:

```ts
{
  slug: 'terra-elix',
  title: 'TerraElix',
  category: 'Wellness / supplements',
  summary:
    'A cinematic plant-based supplement launch built around natural balance and clean energy.',
  tags: ['Art direction', 'Responsive UI', 'Motion'],
  demoPath: '/concepts/terra-elix/index.html',
  previewMode: 'live-auto-scroll',
  status: 'published',
}
```

Keep the second and third entries unchanged and draft.

- [ ] **Step 6: Integrate the client preview without making Concept Lab a client component**

Remove the `next/image` import and old static `ConceptPreview`. Import:

```tsx
import LiveConceptPreview from './LiveConceptPreview'
```

For a published concept, render an article with the decorative preview and a separate accessible link:

```tsx
<article
  key={concept.slug}
  className={`${styles.conceptStage} ${styles.conceptPublished}`}
  data-concept-stage
  data-concept-status="published"
  data-concept-index={index}
>
  <LiveConceptPreview demoPath={concept.demoPath} title={concept.title} />
  <a
    href={concept.demoPath}
    className={styles.conceptPublishedLink}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={`Open ${concept.title} live HTML demo (opens in a new tab)`}
  >
    <ConceptCopy concept={concept} index={index} status="published" />
  </a>
</article>
```

This prevents an iframe from being nested inside a link. Add:

```css
.conceptPublishedLink {
  display: flex;
  min-width: 0;
  color: inherit;
  text-decoration: none;
}

.conceptPublishedLink .conceptCopy {
  width: 100%;
}
```

Replace the obsolete published-card hover rules with:

```css
@media (hover: hover) and (pointer: fine) {
  .conceptPublished:has(.conceptPublishedLink:hover) .conceptTitle,
  .conceptPublished:has(.conceptPublishedLink:focus-visible) .conceptTitle {
    color: transparent;
    -webkit-text-stroke: 2px currentColor;
  }
}

.conceptPublishedLink:focus-visible {
  outline: 3px solid var(--hot);
  outline-offset: -6px;
}
```

- [ ] **Step 7: Run lint and the focused suites**

Run:

```bash
npm run lint
npx playwright test tests/e2e/work-page.spec.ts tests/e2e/terra-elix.spec.ts
```

Expected: ESLint exits successfully and all focused tests pass.

- [ ] **Step 8: Commit publication and preview**

```bash
git add src/app/work/LiveConceptPreview.tsx src/app/work/ConceptLab.tsx src/app/work/work.module.css src/data/concept-sites.ts tests/e2e/work-page.spec.ts
git commit -m "feat: publish TerraElix live concept"
```

### Task 4: Visual and responsive verification

**Files:**
- Modify if verification exposes defects: `public/concepts/terra-elix/index.html`
- Modify if verification exposes defects: `public/concepts/terra-elix/styles.css`
- Modify if verification exposes defects: `public/concepts/terra-elix/script.js`
- Modify if verification exposes defects: `src/app/work/LiveConceptPreview.tsx`
- Modify if verification exposes defects: `src/app/work/work.module.css`

- [ ] **Step 1: Run all deterministic checks**

Run:

```bash
npm run test:unit
npm run lint
npx playwright test tests/e2e/terra-elix.spec.ts tests/e2e/work-page.spec.ts tests/e2e/responsive.spec.ts
npm run build
```

Expected: 13 unit tests pass, ESLint passes, all selected Playwright tests pass, and the production build completes.

- [ ] **Step 2: Capture standalone screenshots**

Start the development server in a persistent terminal:

```bash
npm run dev -- --hostname 127.0.0.1 --port 3100
```

Expected: Next.js reports that `http://127.0.0.1:3100` is ready. While it remains running, execute:

```bash
npx playwright screenshot --channel chrome --viewport-size 1440,1000 --full-page http://127.0.0.1:3100/concepts/terra-elix/index.html /tmp/terra-elix-desktop.png
npx playwright screenshot --channel chrome --viewport-size 768,1024 --full-page http://127.0.0.1:3100/concepts/terra-elix/index.html /tmp/terra-elix-tablet.png
npx playwright screenshot --channel chrome --viewport-size 375,812 --full-page http://127.0.0.1:3100/concepts/terra-elix/index.html /tmp/terra-elix-mobile.png
```

Expected: screenshots show the prompt's exact background/media, responsive headline, CTA, product composition, and three panels with no clipped controls or horizontal overflow.

- [ ] **Step 3: Capture the embedded preview**

Use Playwright to open `/work`, scroll `[data-concept-stage]` first card into view, wait for `iframe[data-preview-state="ready"]`, and save `/tmp/terra-elix-work-preview.png`.

Expected: the browser frame contains the real TerraElix page, the copy panel remains legible, and two later cards still show blueprint draft states.

- [ ] **Step 4: Inspect all four screenshots**

Open each image with the workspace image viewer. Check typography, colors, media placement, desktop/tablet/mobile composition, Work-card framing, and loading-state removal. Fix any mismatch and rerun the affected tests and screenshot.

- [ ] **Step 5: Run the completion verification again**

Run:

```bash
npm run test:unit
npm run lint
npx playwright test tests/e2e/terra-elix.spec.ts tests/e2e/work-page.spec.ts tests/e2e/responsive.spec.ts
npm run build
git diff --check
git status --short
```

Expected: all checks pass; only intentional TerraElix/live-preview changes or the plan file are present.

- [ ] **Step 6: Commit any verification fixes**

If verification changed files:

```bash
git add public/concepts/terra-elix src/app/work src/data/concept-sites.ts tests/e2e/terra-elix.spec.ts tests/e2e/work-page.spec.ts
git commit -m "fix: polish TerraElix responsive preview"
```

If no files changed, do not create an empty commit.
