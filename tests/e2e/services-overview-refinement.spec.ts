import { expect, test } from '@playwright/test'

test('overview illustration pauses, resumes, and respects manual pause offscreen', async ({
  page,
}) => {
  await page.goto('/services')
  const illustration = page.getByRole('figure', { name: /Illustrative journey/ })
  const pieces = illustration.locator('[data-system-piece]')
  const state = () =>
    pieces.evaluateAll((elements) =>
      elements.map((element) => element.getAttribute('style')).join('|')
    )
  await expect(illustration).toHaveAttribute('data-motion', 'active')
  await illustration.getByRole('button', { name: 'Pause animation' }).click()
  const frozen = await state()
  await page.waitForTimeout(400)
  expect(await state()).toBe(frozen)
  await page.locator('#problems').scrollIntoViewIfNeeded()
  await illustration.scrollIntoViewIfNeeded()
  expect(await state()).toBe(frozen)
  await illustration.getByRole('button', { name: 'Play animation' }).click()
  await expect.poll(state, { timeout: 10000 }).not.toBe(frozen)
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect(illustration).toHaveAttribute('data-motion', 'reduced')
  await expect(illustration.getByRole('button')).toBeHidden()
  for (const piece of await pieces.all()) await expect(piece).toHaveCSS('opacity', '1')
})

test('services overview is complete without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  const page = await context.newPage()
  await page.goto('/services')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Your next move.Built right.')
  await expect(page.locator('#service-web')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Pause animation' })).toBeHidden()
  await expect(page.getByRole('link', { name: 'Discuss your project' })).toHaveAttribute(
    'href',
    '/contact'
  )
  await context.close()
})

for (const width of [320, 390, 768, 880, 1024, 1440]) {
  test(`services overview layout at ${width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 950 })
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/services')
    await page.evaluate(() => document.fonts.ready)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    await expect(page.locator('canvas')).toHaveCount(0)
    for (const id of ['web', 'software', 'ai']) {
      await expect(page.locator(`#service-${id} a`).first()).toHaveAttribute(
        'href',
        `/services/${id}`
      )
    }
    if (width === 390 || width === 1440)
      await page.screenshot({ path: testInfo.outputPath(`services-${width}.png`), fullPage: true })
  })
}

test('connected journey completes and rebuilds across two cycles', async ({ page }) => {
  await page.goto('/services')
  const illustration = page.getByRole('figure', { name: /Illustrative journey/ })
  await illustration.scrollIntoViewIfNeeded()
  const output = illustration.locator('[data-system-piece]').last()
  const opacity = () => output.evaluate((element) => Number(getComputedStyle(element).opacity))
  for (let cycle = 0; cycle < 2; cycle++) {
    await expect.poll(opacity, { timeout: 10000 }).toBeGreaterThan(0.95)
    await expect.poll(opacity, { timeout: 10000 }).toBeLessThan(0.2)
  }
  await expect.poll(opacity, { timeout: 10000 }).toBeGreaterThan(0.95)
})
