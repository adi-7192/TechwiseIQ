import { expect, test } from '@playwright/test'

test('introduces three services before client evidence with useful destinations', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Technology that')
  await expect(page.locator('#top').getByRole('link', { name: 'Start a project' })).toHaveAttribute(
    'href',
    '/contact'
  )
  await expect(
    page.locator('#top').getByRole('link', { name: 'Explore our work' })
  ).toHaveAttribute('href', '/work')
  await expect(page.locator('[data-service-story]')).toHaveCount(3)
  await expect(page.getByRole('navigation', { name: 'Page chapters' })).toHaveCount(0)
  for (const [id, href] of [
    ['websites', '/services/web'],
    ['apps', '/services/software'],
    ['automation', '/services/ai'],
  ]) {
    await expect(page.locator(`#${id}`).getByRole('link')).toHaveAttribute('href', href)
  }
  const order = await page
    .locator('main section[id]')
    .evaluateAll((nodes) => nodes.map((n) => n.id))
  expect(order).toEqual(['top', 'services', 'websites', 'apps', 'automation', 'selected-work'])
  await expect(
    page.locator('#selected-work').getByRole('link', { name: /AASKRA Realty/ })
  ).toHaveAttribute('href', '/work/aaskra-realty')
  await expect(
    page.getByRole('heading', { name: 'A clear plan. A working product.' })
  ).toBeVisible()
})

test('each demonstration can be completed manually with reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await expect(page.locator('[data-home-experience]')).toHaveAttribute(
    'data-home-motion',
    'reduced'
  )
  for (const kind of ['web', 'software', 'ai']) {
    const demo = page.locator(`[data-demo="${kind}"]`)
    await demo.scrollIntoViewIfNeeded()
    await expect(demo).toHaveAttribute('data-step', '3')
    await demo.getByRole('button', { name: 'Try it yourself' }).click()
    await expect(demo).toHaveAttribute('data-step', '0')
    await demo.getByRole('button', { name: 'Next step' }).click()
    await demo.getByRole('button', { name: 'Next step' }).click()
    await demo
      .getByRole('button', { name: kind === 'software' ? 'Approve request' : 'Next step' })
      .click()
    await expect(demo).toHaveAttribute('data-step', '3')
    await expect(demo.getByRole('status')).toContainText(
      kind === 'web'
        ? 'Enquiry received'
        : kind === 'software'
          ? 'Approved and recorded'
          : 'Ready for human review'
    )
  }
})

test('playback pauses on demand and offscreen, then can replay', async ({ page }) => {
  await page.goto('/')
  const demo = page.locator('[data-demo="web"]')
  await demo.scrollIntoViewIfNeeded()
  await demo.getByRole('button', { name: 'Replay website demo' }).click()
  await demo.getByRole('button', { name: 'Pause', exact: true }).click()
  const step = await demo.getAttribute('data-step')
  await page.waitForTimeout(1900)
  await expect(demo).toHaveAttribute('data-step', step!)
  await demo.getByRole('button', { name: 'Play', exact: true }).click()
  await expect(demo).toHaveAttribute('data-step', '3', { timeout: 11000 })
  // Continuous playback should return to construction after holding the result.
  await expect(demo).toHaveAttribute('data-step', '0', { timeout: 7000 })
  await demo.getByRole('button', { name: 'Replay website demo' }).click()
  await page.locator('#top').scrollIntoViewIfNeeded()
  await page.waitForTimeout(400)
  const offscreenStep = await demo.getAttribute('data-step')
  await page.waitForTimeout(1900)
  await expect(demo).toHaveAttribute('data-step', offscreenStep!)
})

test('live reduced-motion changes stop demos and smooth scrolling', async ({ page }) => {
  await page.goto('/')
  const demo = page.locator('[data-demo="ai"]')
  await demo.scrollIntoViewIfNeeded()
  await demo.getByRole('button', { name: 'Replay ai workflow demo' }).click()
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect(demo).toHaveAttribute('data-step', '3')
  await expect(page.locator('html')).not.toHaveClass(/lenis-smooth/)
  await expect(page.locator('canvas')).toHaveAttribute('data-animation-running', 'false')
})

for (const width of [320, 390, 768, 1024, 1440]) {
  test(`homepage fits at ${width}px and keeps hero actions clear`, async ({ page }) => {
    await page.setViewportSize({ width, height: width > 1000 ? 900 : 844 })
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)
    ).toBeLessThanOrEqual(1)
    for (const button of await page
      .locator('#top')
      .getByRole('link', { name: /Start a project|Explore our work/ })
      .all()) {
      const box = (await button.boundingBox())!
      expect(box.height).toBeGreaterThanOrEqual(44)
      expect(box.x).toBeGreaterThanOrEqual(0)
      expect(box.x + box.width).toBeLessThanOrEqual(width)
      if (width >= 1024) expect(box.y + box.height).toBeLessThanOrEqual(900)
    }
    for (const demo of await page.locator('[data-demo]').all()) {
      const box = (await demo.boundingBox())!
      expect(box.x).toBeGreaterThanOrEqual(0)
      expect(box.x + box.width).toBeLessThanOrEqual(width)
    }
  })
}

test('the page and demo conclusions remain useful without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  })
  const page = await context.newPage()
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await expect(page.locator('[data-intro-overlay]')).toBeHidden()
  await expect(page.locator('[data-service-story]')).toHaveCount(3)
  for (const demo of await page.locator('[data-demo]').all()) {
    await expect(demo).toHaveAttribute('data-step', '3')
    await expect(demo.getByRole('button').first()).toBeHidden()
  }
  await expect(page.getByRole('heading', { name: 'Real projects, shipped.' })).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  await context.close()
})
