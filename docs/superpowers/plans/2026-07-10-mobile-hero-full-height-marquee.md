> **Historical (written for the Kinetic design, deleted — D-028).** Kept for reference only; do not build from it.
> Current: `docs/site-spec.md`, `docs/design-system.md`, `docs/DECISIONS.md`.

# Mobile Hero Full-Height Marquee Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the three mobile hero marquee rows fill the first viewport behind a clean, readable overlay without changing the desktop composition.

**Architecture:** Add explicit row-position classes to the existing Hero markup, then use mobile-only CSS to absolutely distribute those rows across the hero field. Keep the existing semantic claim card, CTA components, marquee animation, and reduced-motion rules; add a Playwright geometry regression test that verifies field coverage, touch targets, collision safety, and horizontal-scroll containment at representative phone sizes.

**Tech Stack:** Next.js 16, React 19, CSS Modules, Playwright, TypeScript

**Design spec:** `docs/superpowers/specs/2026-07-10-mobile-hero-full-height-marquee-design.md`

---

## File Map

- Modify `package.json` and `package-lock.json`: add the browser regression-test dependency and command.
- Create `playwright.config.ts`: run the mobile layout test against the local Next.js development server using installed Chrome.
- Create `tests/e2e/mobile-hero.spec.ts`: assert full-height marquee distribution and collision-free overlay behavior.
- Modify `src/components/Hero/index.tsx`: attach explicit, stable CSS Module classes to the three marquee row wrappers.
- Modify `src/components/Hero/Hero.module.css`: replace the current mobile flow workaround with a full-height layered composition.
- Modify `docs/changelog.md`: replace the current uncommitted mobile-hero note with the final behavior and verification evidence.

### Task 1: Add the Mobile Hero Regression Test

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Create: `playwright.config.ts`
- Create: `tests/e2e/mobile-hero.spec.ts`

- [ ] **Step 1: Install the Playwright test runner**

Run:

```bash
npm install --save-dev @playwright/test
```

Expected: `@playwright/test` appears in `devDependencies`, `package-lock.json` updates, and the command exits successfully.

- [ ] **Step 2: Add the e2e script to `package.json`**

Add this script alongside `lint` and `build`:

```json
"test:e2e": "playwright test"
```

- [ ] **Step 3: Create `playwright.config.ts`**

```ts
import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:3100',
    channel: 'chrome',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'npm run dev -- --hostname 127.0.0.1 --port 3100',
    url: 'http://127.0.0.1:3100',
    reuseExistingServer: true,
    timeout: 120_000,
  },
})
```

- [ ] **Step 4: Create the failing geometry test in `tests/e2e/mobile-hero.spec.ts`**

```ts
import { expect, test, type Locator } from '@playwright/test'

const viewports = [
  { width: 320, height: 568 },
  { width: 375, height: 667 },
  { width: 390, height: 844 },
  { width: 430, height: 932 },
  { width: 600, height: 900 },
]

type Rect = NonNullable<Awaited<ReturnType<Locator['boundingBox']>>>

function overlaps(a: Rect, b: Rect) {
  const horizontal =
    Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x)
  const vertical =
    Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y)

  return horizontal > 1 && vertical > 1
}

for (const viewport of viewports) {
  test(`fills the mobile hero field at ${viewport.width}x${viewport.height}`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport)
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')

    const hero = page.locator('header').first()
    const marqueeTracks = hero.locator('.marquee-track')
    const heading = page.getByRole('heading', { level: 1 })
    const primaryCta = page.getByRole('link', { name: 'Book a call' })
    const secondaryCta = page.getByRole('link', { name: /What we do/ })
    const badge = hero.locator('span[aria-hidden="true"]').filter({
      hasText: 'AI-FIRST',
    })
    const cue = hero.locator('span').filter({ hasText: 'Scroll' }).first()
    const nav = page.locator('nav').first()
    const whatsapp = page.getByRole('link', { name: 'Chat on WhatsApp' })
    const nextSection = hero.locator('xpath=following-sibling::*[1]')

    await expect(marqueeTracks).toHaveCount(3)

    const heroBox = await hero.boundingBox()
    const rowBoxes = await marqueeTracks.evaluateAll((tracks) =>
      tracks.map((track) => {
        const rect = track.getBoundingClientRect()
        return {
          top: rect.top,
          bottom: rect.bottom,
        }
      }),
    )

    expect(heroBox).not.toBeNull()
    expect(heroBox!.height).toBeGreaterThanOrEqual(viewport.height - 1)

    const rowFieldTop = Math.min(...rowBoxes.map((box) => box.top))
    const rowFieldBottom = Math.max(...rowBoxes.map((box) => box.bottom))
    expect(rowFieldBottom - rowFieldTop).toBeGreaterThanOrEqual(
      heroBox!.height * 0.55,
    )

    const [
      headingBox,
      primaryBox,
      secondaryBox,
      badgeBox,
      cueBox,
      navBox,
      whatsappBox,
      nextSectionBox,
    ] =
      await Promise.all([
        heading.boundingBox(),
        primaryCta.boundingBox(),
        secondaryCta.boundingBox(),
        badge.boundingBox(),
        cue.boundingBox(),
        nav.boundingBox(),
        whatsapp.boundingBox(),
        nextSection.boundingBox(),
      ])

    for (const box of [
      headingBox,
      primaryBox,
      secondaryBox,
      badgeBox,
      cueBox,
      navBox,
      whatsappBox,
      nextSectionBox,
    ]) {
      expect(box).not.toBeNull()
    }

    expect(primaryBox!.height).toBeGreaterThanOrEqual(44)
    expect(secondaryBox!.height).toBeGreaterThanOrEqual(44)
    expect(overlaps(badgeBox!, primaryBox!)).toBe(false)
    expect(overlaps(badgeBox!, secondaryBox!)).toBe(false)
    expect(overlaps(badgeBox!, whatsappBox!)).toBe(false)
    expect(overlaps(cueBox!, whatsappBox!)).toBe(false)
    expect(overlaps(navBox!, headingBox!)).toBe(false)
    expect(overlaps(navBox!, primaryBox!)).toBe(false)
    expect(overlaps(navBox!, secondaryBox!)).toBe(false)
    expect(
      Math.abs(nextSectionBox!.y - (heroBox!.y + heroBox!.height)),
    ).toBeLessThanOrEqual(1)

    await page.evaluate(() => window.scrollTo(100, 0))
    expect(await page.evaluate(() => window.scrollX)).toBe(0)
  })
}

test('keeps the desktop marquee in normal flow', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')

  const positions = await page
    .locator('header')
    .first()
    .locator('.marquee-track')
    .evaluateAll((tracks) =>
      tracks.map((track) =>
        getComputedStyle(
          track.parentElement!.parentElement!.parentElement!,
        ).position,
      ),
    )

  expect(positions).toEqual(['static', 'static', 'static'])
})
```

- [ ] **Step 5: Run the mobile test and verify RED**

Run:

```bash
npm run test:e2e -- tests/e2e/mobile-hero.spec.ts
```

Expected: the five mobile cases fail on the `0.55` marquee-field coverage assertion because the current rows occupy only a shallow band. The desktop case passes. If the command cannot find Chrome, set `use.launchOptions.executablePath` in `playwright.config.ts` to the installed Chrome path and rerun until the test reaches the intended coverage failure.

- [ ] **Step 6: Commit the failing regression test**

```bash
git add package.json package-lock.json playwright.config.ts tests/e2e/mobile-hero.spec.ts
git commit -m "test: cover full-height mobile hero marquee"
```

### Task 2: Implement the Full-Height Mobile Marquee

**Files:**
- Modify: `src/components/Hero/index.tsx:15-41`
- Modify: `src/components/Hero/Hero.module.css:32-180`
- Test: `tests/e2e/mobile-hero.spec.ts`

- [ ] **Step 1: Add stable row-position classes in `src/components/Hero/index.tsx`**

Replace the three outer marquee wrappers with the following class names while leaving their children unchanged:

```tsx
<div className={`${styles.enter} ${styles.marqueeRow} ${styles.rowOne}`}>
  <div className="skew">
    <Marquee duration={26}>
      <span className={styles.rowText}>
        Websites · Software · AI ·&nbsp;
      </span>
    </Marquee>
  </div>
</div>
<div
  className={`${styles.enter} ${styles.enterD1} ${styles.marqueeRow} ${styles.rowTwo}`}
>
  <div className="skew">
    <Marquee direction="right" duration={30}>
      <span className={`${styles.rowText} ${styles.outlined}`}>
        Built in Dubai · Shipped worldwide ·&nbsp;
      </span>
    </Marquee>
  </div>
</div>
<div
  className={`${styles.enter} ${styles.enterD2} ${styles.marqueeRow} ${styles.rowThree}`}
>
  <div className="skew">
    <Marquee duration={22}>
      <span className={`${styles.rowText} ${styles.hotText}`}>
        Weeks not quarters ·&nbsp;
      </span>
    </Marquee>
  </div>
</div>
```

- [ ] **Step 2: Add the desktop-safe row class declarations after `.enterD3`**

```css
.marqueeRow {
  position: static;
}

.rowOne,
.rowTwo,
.rowThree {
  inset: auto;
}
```

- [ ] **Step 3: Replace the current `@media (max-width: 600px)` and `@media (max-width: 360px)` blocks**

```css
@media (max-width: 600px) {
  .hero {
    min-height: 100svh;
    justify-content: flex-start;
    padding: 0;
  }

  .marqueeRow {
    position: absolute;
    left: 0;
    right: 0;
    z-index: 1;
  }

  .rowOne {
    top: 16%;
  }

  .rowTwo {
    top: 42%;
  }

  .rowThree {
    top: 70%;
  }

  .rowText {
    font-size: clamp(72px, 18vw, 108px);
  }

  .card {
    position: absolute;
    inset: 0;
    gap: 20px;
    padding: 0 20px;
  }

  .claim {
    font-size: 12.5px;
    max-width: min(90vw, 52ch);
  }

  .ctas {
    flex-wrap: nowrap;
  }

  .ctas > a {
    min-height: 44px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .sticker {
    top: auto;
    right: 20px;
    bottom: 112px;
  }
}

@media (max-width: 339px) {
  .ctas {
    width: min(82vw, 300px);
    flex-direction: column;
  }

  .ctas > a {
    width: 100%;
    text-align: center;
  }
}
```

The base `.hero { min-height: 100vh; }` remains the fallback for browsers without small-viewport units. Do not change desktop sizing or marquee timing.

- [ ] **Step 4: Run the focused e2e test and verify GREEN**

Run:

```bash
npm run test:e2e -- tests/e2e/mobile-hero.spec.ts
```

Expected: all six cases pass. If a verified viewport exposes a collision, adjust only the mobile row percentages, badge bottom offset, or narrow CTA breakpoint; do not move the claim card back into normal flow.

- [ ] **Step 5: Run lint after the TSX change**

Run:

```bash
npm run lint
```

Expected: zero ESLint errors.

- [ ] **Step 6: Commit the implementation**

```bash
git add src/components/Hero/index.tsx src/components/Hero/Hero.module.css
git commit -m "fix: fill mobile hero with kinetic marquee"
```

### Task 3: Document and Verify the Final Result

**Files:**
- Modify: `docs/changelog.md:7-12`
- Test: `tests/e2e/mobile-hero.spec.ts`

- [ ] **Step 1: Replace the current uncommitted mobile-hero changelog entry**

Use this final entry:

```markdown
## 2026-07-10 — fix: full-height mobile hero marquee

- **Full-field type:** the three kinetic marquee rows are distributed across the complete mobile hero rather than collapsing into a shallow band.
- **Readable overlay:** the semantic claim card and CTAs remain centered above the moving type, with 44px minimum touch targets and a narrow-phone stacked fallback.
- **Collision safety:** the sticker, CTAs, scroll cue, and fixed WhatsApp control retain clear separation across the supported phone sizes.
- **Desktop preserved:** all row positioning changes are scoped to viewports at or below 600px; desktop and tablet retain the original composition.
- **Regression coverage:** Playwright verifies 320×568, 375×667, 390×844, 430×932, 600×900, desktop flow, and horizontal-scroll containment.
```

- [ ] **Step 2: Run the complete verification set**

Run:

```bash
npm run test:e2e
npm run lint
npm run build
```

Expected: all Playwright tests pass, ESLint reports zero errors, and the Next.js production build completes successfully.

- [ ] **Step 3: Inspect the final diff**

Run:

```bash
git diff --check
git status --short
git diff -- src/components/Hero/index.tsx src/components/Hero/Hero.module.css docs/changelog.md
```

Expected: no whitespace errors; only the planned hero, test-harness, lockfile, and changelog changes remain. `.superpowers/` stays untracked and is not committed.

- [ ] **Step 4: Commit the final documentation update**

```bash
git add docs/changelog.md
git commit -m "docs: record mobile hero marquee fix"
```
