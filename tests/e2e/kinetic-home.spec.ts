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

test('reduced motion bypasses the intro', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await expect(page.locator('[data-intro-overlay]')).toBeHidden()
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
