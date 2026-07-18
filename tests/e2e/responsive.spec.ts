import { test, expect } from '@playwright/test'

/**
 * Responsive guardrail sweep (docs/responsive-audit-plan.md §6 Phase 4).
 *
 * Asserts no route produces horizontal overflow at any breakpoint.
 * html/body use overflow-x: clip as a safety net, but clip does NOT reset
 * scrollWidth — so this assertion still catches real overflow the net is
 * visually masking. Runs with reduced motion for determinism.
 */

const ROUTES = [
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
  '/this-page-does-not-exist', // 404
]

const WIDTHS = [320, 375, 390, 414, 768, 834, 1024, 1280, 1440]

for (const width of WIDTHS) {
  test.describe(`@ ${width}px`, () => {
    test.use({ viewport: { width, height: 844 } })

    for (const route of ROUTES) {
      test(`no horizontal overflow on ${route}`, async ({ page }) => {
        await page.emulateMedia({ reducedMotion: 'reduce' })
        await page.goto(route, { waitUntil: 'networkidle' })
        await page.evaluate(() => document.fonts.ready)

        // Scroll through the page to mount lazy/scroll-triggered content.
        await page.evaluate(async () => {
          const step = window.innerHeight
          for (let y = 0; y <= document.body.scrollHeight; y += step) {
            window.scrollTo(0, y)
            await new Promise((r) => setTimeout(r, 40))
          }
          window.scrollTo(0, 0)
        })

        const { scrollWidth, innerWidth } = await page.evaluate(() => ({
          scrollWidth: document.documentElement.scrollWidth,
          innerWidth: window.innerWidth,
        }))

        expect(
          scrollWidth,
          `document.scrollWidth ${scrollWidth} exceeds viewport ${innerWidth}`,
        ).toBeLessThanOrEqual(innerWidth + 1)
      })
    }
  })
}
