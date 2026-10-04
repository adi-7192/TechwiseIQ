import { expect, test } from '@playwright/test'

const detailRoutes = [
  { path: '/services/web', heading: 'Made to stand out.' },
  { path: '/services/software', heading: 'Built around your business.' },
  { path: '/services/ai', heading: 'Make room for better work.' },
]

test.describe('Services overview', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/services')
  })

  test('introduces the offer and keeps every service visible', async ({
    page,
  }) => {
    await expect(
      page.getByRole('heading', {
        level: 1,
        name: "Your next move. Built right.",
      }),
    ).toHaveCount(1)
    await expect(page.getByTestId('problem-navigator')).toBeVisible()
    await expect(page.locator('#service-web')).toBeVisible()
    await expect(page.locator('#service-software')).toBeVisible()
    await expect(page.locator('#service-ai')).toBeVisible()
    await expect(page.getByText(/AED|starting from/i)).toHaveCount(0)
  })

  test('maps a selected problem to the matching service', async ({ page }) => {
    await page
      .getByRole('link', { name: /Manual work is eating the week/ })
      .click()
    const recommendation = page.getByTestId('service-recommendation')
    await expect(recommendation).toContainText('AI Automation')
    await expect(
      recommendation.getByRole('link', { name: /Explore AI Automation/ }),
    ).toHaveAttribute('href', '/services/ai')
  })

  test('renders its full diagnostic state with reduced motion', async ({
    page,
  }) => {
    // Static-first immersive build: everything is present without motion.
    await expect(page.locator('[data-service-experience]')).toBeVisible()
    await expect(page.getByTestId('problem-navigator')).toBeVisible()
    await expect(page.getByTestId('service-recommendation')).toBeVisible()
    await expect(page.locator('#service-web')).toBeVisible()
  })
})

for (const route of detailRoutes) {
  test(`${route.path} presents the complete decision journey`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto(route.path)

    await expect(
      page.getByRole('heading', { level: 1, name: route.heading }),
    ).toHaveCount(1)
    await expect(page.getByTestId('service-fit')).toBeVisible()
    await expect(page.getByTestId('outcome-flow')).toBeVisible()
    await expect(page.getByTestId('service-proof')).toBeVisible()
    await expect(page.getByTestId('capability-river')).toBeVisible()
    await expect(page.getByTestId('connected-process')).toBeVisible()
    await expect(page.getByTestId('service-faq')).toBeVisible()
    await expect(page.getByText(/AED|starting from/i)).toHaveCount(0)
  })
}

test('carries the route accent on the shell without a WebGL scene', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/services/ai')

  // WebGL is hero-only now; service routes run on the CSS atmosphere, whose
  // accent is published by the shell's data-scene marker.
  await expect(page.locator('.tw-world').first()).toHaveAttribute(
    'data-scene',
    'automation',
  )
  await expect(page.locator('canvas')).toHaveCount(0)
})

for (const path of ['/services', ...detailRoutes.map((route) => route.path)]) {
  test(`${path} stays inside a 375px viewport`, async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto(path)

    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    )
    expect(overflow).toBeLessThanOrEqual(1)
  })
}

test('service structured data does not publish pricing', async ({ page }) => {
  await page.goto('/services/web')
  const jsonLd = await page
    .locator('script[type="application/ld+json"]')
    .allTextContents()
  expect(jsonLd.join(' ')).not.toMatch(
    /Offer|PriceSpecification|minPrice|priceCurrency/,
  )
})

test('navigator is keyboard operable and exposes the selected state', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/services')
  const first = page.getByRole('link', {
    name: /Our website is underperforming/,
  })
  const second = page.getByRole('link', {
    name: /Manual work is eating the week/,
  })

  await first.focus()
  await expect(first).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(second).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(second).toHaveAttribute('aria-current', 'true')
  await expect(page.getByTestId('service-recommendation')).toContainText(
    'AI Automation',
  )
})

test('mobile primary actions meet the 44px target', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/services/web')
  const box = await page
    .getByRole('link', { name: /Start the conversation/ })
    .last()
    .boundingBox()

  expect(box).not.toBeNull()
  expect(box!.height).toBeGreaterThanOrEqual(44)
})
