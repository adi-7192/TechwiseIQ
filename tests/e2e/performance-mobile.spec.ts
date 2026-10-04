import { expect, test } from '@playwright/test'

test('does not reallocate the canvas for resize events with unchanged dimensions', async ({ page }) => {
  await page.goto('/')
  const canvas = page.locator('[data-hero-scene] canvas')
  await expect(canvas).toHaveAttribute('data-animation-running', 'true')
  const mutations = await canvas.evaluate(async (element) => {
    let writes = 0
    const observer = new MutationObserver((records) => { writes += records.length })
    observer.observe(element, { attributes: true, attributeFilter: ['width', 'height'] })
    for (let i = 0; i < 5; i++) window.dispatchEvent(new Event('resize'))
    await new Promise(requestAnimationFrame)
    observer.disconnect()
    return writes
  })
  expect(mutations).toBe(0)
  await page.locator('#selected-work').scrollIntoViewIfNeeded()
  await expect(canvas).toHaveAttribute('data-animation-running', 'false')
  // Lenis (the single scroll driver) can still be settling from the previous
  // scroll and put a native jump back on slow CI runners; retry until it holds.
  await expect
    .poll(() => page.evaluate(() => (window.scrollTo(0, 0), window.scrollY)))
    .toBe(0)
  await expect(canvas).toHaveAttribute('data-animation-running', 'true')
})

test('uses the intentionally reduced mobile scene budget', async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
    hasTouch: true,
    isMobile: true,
  })
  const page = await context.newPage()
  await page.goto('/')

  const canvas = page.locator('[data-hero-scene] canvas')
  await expect(canvas).toHaveCount(1)
  await expect(canvas).toHaveAttribute('data-mobile', 'true')
  await expect(canvas).toHaveAttribute('data-point-limit', '300')
  await expect(canvas).toHaveAttribute('data-pixel-ratio', '1')
  await expect(canvas).toHaveAttribute('data-target-fps', '30')
  await expect(canvas).toHaveAttribute('data-animation-running', 'true')

  await expect(page.locator('[data-home-artifact]:visible')).toHaveCount(0)
  await context.close()
})

test('caps high-DPR desktop rendering without dropping the full scene', async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    deviceScaleFactor: 3,
  })
  const page = await context.newPage()
  await page.goto('/')

  const canvas = page.locator('[data-hero-scene] canvas')
  await expect(canvas).toHaveAttribute('data-mobile', 'false')
  await expect(canvas).toHaveAttribute('data-point-limit', '900')
  await expect(canvas).toHaveAttribute('data-pixel-ratio', '1.5')
  await expect(canvas).toHaveAttribute('data-target-fps', '60')

  await page.setViewportSize({ width: 390, height: 844 })
  await expect(canvas).toHaveAttribute('data-mobile', 'true')
  await expect(canvas).toHaveAttribute('data-point-limit', '300')
  await expect(canvas).toHaveAttribute('data-pixel-ratio', '1')
  await expect(canvas).toHaveAttribute('data-target-fps', '30')

  await context.close()
})

test('freezes the scene completely for reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')

  const canvas = page.locator('[data-hero-scene] canvas')
  await expect(canvas).toHaveAttribute('data-animation-running', 'false')
  await expect(page.locator('[data-home-experience]')).toHaveAttribute(
    'data-home-motion',
    'reduced',
  )
})

test('loads WebGL only for the home hero, never on other routes', async ({ page }) => {
  const loadedChunks = () =>
    page.evaluate(() =>
      performance
        .getEntriesByType('resource')
        .map((entry) => entry.name)
        .filter((name) => name.includes('/_next/static/chunks/')),
    )

  for (const route of ['/privacy', '/about', '/services/ai', '/work']) {
    await page.goto(route)
    await expect(page.locator('canvas')).toHaveCount(0)
    await expect(page.locator('[data-hero-scene]')).toHaveCount(0)
    expect(
      (await loadedChunks()).some((name) => /three/i.test(name)),
      `three.js must not load on ${route}`,
    ).toBe(false)
  }

  await page.goto('/')
  await expect(page.locator('[data-hero-scene] canvas')).toHaveCount(1)
})

test('keeps one canvas and bounded heap across repeated route changes', async ({
  page,
}) => {
  await page.goto('/')
  const session = await page.context().newCDPSession(page)
  await session.send('HeapProfiler.enable')
  await session.send('HeapProfiler.collectGarbage')
  const before = await session.send('Runtime.getHeapUsage')

  // The renderer is a session singleton that is detached and re-attached, never
  // rebuilt — leaving the hero must drop the canvas without leaking a context.
  for (let index = 0; index < 4; index += 1) {
    await page.getByRole('link', { name: 'About' }).first().click()
    await expect(page).toHaveURL(/\/about$/)
    await expect(page.locator('canvas')).toHaveCount(0)
    await page.getByLabel('TechwiseIQ home').click()
    await expect(page).toHaveURL(/\/$/)
    await expect(page.locator('canvas')).toHaveCount(1)
  }

  await session.send('HeapProfiler.collectGarbage')
  const after = await session.send('Runtime.getHeapUsage')
  expect(after.usedSize - before.usedSize).toBeLessThan(12 * 1024 * 1024)
})

test('keeps mobile layout shift and main-thread stalls bounded', async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
  })
  const page = await context.newPage()
  await page.addInitScript(() => {
    const metrics = { cls: 0, longTasks: [] as number[] }
    ;(window as typeof window & { __performanceMetrics: typeof metrics }).__performanceMetrics =
      metrics
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const shift = entry as PerformanceEntry & {
          value: number
          hadRecentInput: boolean
        }
        if (!shift.hadRecentInput) metrics.cls += shift.value
      }
    }).observe({ type: 'layout-shift', buffered: true })
    new PerformanceObserver((list) => {
      metrics.longTasks.push(...list.getEntries().map((entry) => entry.duration))
    }).observe({ type: 'longtask', buffered: true })
  })

  await page.goto('/')
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  await page.waitForTimeout(500)
  const metrics = await page.evaluate(
    () =>
      (
        window as typeof window & {
          __performanceMetrics: { cls: number; longTasks: number[] }
        }
      ).__performanceMetrics,
  )

  expect(metrics.cls).toBeLessThan(0.1)
  expect(Math.max(0, ...metrics.longTasks)).toBeLessThan(200)
  await context.close()
})
