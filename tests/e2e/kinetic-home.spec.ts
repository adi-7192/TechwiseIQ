import { expect, test } from '@playwright/test'

test('intro opens the hero and runs only once per tab', async ({ page }) => {
  await page.addInitScript(() => {
    const seen: string[] = []
    Object.assign(window, { introStates: seen })
    new MutationObserver(() => {
      seen.push(document.documentElement.dataset.intro ?? '')
    }).observe(document, { subtree: true, attributes: true, attributeFilter: ['data-intro'] })
  })
  await page.goto('/')
  await expect(page.locator('html')).toHaveAttribute('data-intro', 'ready', { timeout: 5000 })
  await expect(page.locator('[data-intro-overlay]')).toBeHidden()
  expect(
    await page.evaluate(() => (window as unknown as { introStates: string[] }).introStates)
  ).toContain('loading')
  expect(await page.evaluate(() => sessionStorage.getItem('tw-intro-seen'))).toBe('1')
  await expect(page.locator('#hero-title')).toBeVisible()
  await page.reload()
  await expect(page.locator('html')).toHaveAttribute('data-intro', 'ready')
  expect(
    await page.evaluate(() => (window as unknown as { introStates: string[] }).introStates)
  ).not.toContain('loading')
})

test('reduced motion bypasses the intro and shows complete service illustrations', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await expect(page.locator('[data-intro-overlay]')).toBeHidden()
  for (const kind of ['web', 'software', 'ai']) {
    const demo = page.locator(`[data-demo="${kind}"]`)
    await demo.scrollIntoViewIfNeeded()
    await expect(demo).toHaveAttribute('data-step', '3')
    const pieces = demo.locator('[data-build-piece], [data-review], [data-output]')
    for (const piece of await pieces.all()) await expect(piece).toBeVisible()
  }
})

test('the software construction is visibly animated, and pause freezes it', async ({ page }) => {
  await page.goto('/')
  const demo = page.locator('[data-demo="software"]')
  await demo.scrollIntoViewIfNeeded()
  await demo.getByRole('button', { name: 'Replay software demo' }).click()
  await expect(demo).toHaveAttribute('data-playing', 'true')
  const piece = demo.locator('[data-app-piece]').first()
  await expect
    .poll(async () => piece.evaluate((el) => parseFloat(getComputedStyle(el).opacity)))
    .toBeGreaterThan(0.1)
  await demo.getByRole('button', { name: 'Pause', exact: true }).click()
  const snapshot = await piece.getAttribute('style')
  await page.waitForTimeout(600)
  expect(await piece.getAttribute('style')).toBe(snapshot)
  await expect(demo).toHaveAttribute('data-playing', 'false')
})

for (const width of [320, 390, 768, 1440]) {
  test(`footer invitation and destinations fit at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')
    const footer = page.getByRole('contentinfo')
    await footer.scrollIntoViewIfNeeded()
    await expect(footer.getByRole('link', { name: /Let’s build what’s next/ })).toHaveAttribute(
      'href',
      '/contact'
    )
    await expect(footer.getByRole('link', { name: /Info@/ })).toHaveAttribute('href', /^mailto:/)
    await expect(footer.getByRole('link', { name: 'Privacy', exact: true })).toHaveAttribute(
      'href',
      '/privacy'
    )
    await expect(footer.getByRole('link', { name: 'Terms', exact: true })).toHaveAttribute(
      'href',
      '/terms'
    )
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)
    ).toBeLessThanOrEqual(1)
    const title = (await footer.locator('h2').boundingBox())!
    expect(title.x + title.width).toBeLessThanOrEqual(width)
  })
}
