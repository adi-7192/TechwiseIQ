import { test } from '@playwright/test'

/**
 * Desktop baseline capture for the responsive overhaul
 * (docs/responsive-audit-plan.md). Captures full-page screenshots at
 * 1280/1440 so every fix phase can be diffed against the pre-change
 * desktop rendering. Runs only when CAPTURE_BASELINE=1:
 *   CAPTURE_BASELINE=1 npx playwright test desktop-baseline
 * Screenshots land in tests/e2e/baseline-desktop/.
 */

const ROUTES: Array<[name: string, path: string]> = [
  ['home', '/'],
  ['services', '/services'],
  ['services-web', '/services/web'],
  ['services-software', '/services/software'],
  ['services-ai', '/services/ai'],
  ['work', '/work'],
  ['work-aaskra', '/work/aaskra-realty'],
  ['work-etf', '/work/express-trade-financing'],
  ['about', '/about'],
  ['contact', '/contact'],
  ['privacy', '/privacy'],
  ['terms', '/terms'],
  ['not-found', '/this-page-does-not-exist'],
]

const WIDTHS = [1280, 1440]

test.describe('desktop baseline capture', () => {
  test.skip(
    process.env.CAPTURE_BASELINE !== '1',
    'baseline capture only runs with CAPTURE_BASELINE=1',
  )

  for (const width of WIDTHS) {
    for (const [name, path] of ROUTES) {
      test(`${name} @ ${width}`, async ({ page }) => {
        await page.emulateMedia({ reducedMotion: 'reduce' })
        await page.setViewportSize({ width, height: 900 })
        await page.goto(path, { waitUntil: 'networkidle' })
        // settle fonts/images before the full-page capture
        await page.evaluate(() => document.fonts.ready)
        await page.waitForTimeout(500)
        await page.screenshot({
          path: `tests/e2e/baseline-desktop/${name}-${width}.png`,
          fullPage: true,
        })
      })
    }
  }
})
