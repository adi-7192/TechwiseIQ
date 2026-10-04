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

  test('explains how we engage: custom quote, no packages', async ({
    page,
  }) => {
    const engage = page.locator('#engage')
    await expect(
      engage.getByRole('heading', {
        level: 2,
        name: 'You decide. We deliver.',
      }),
    ).toBeVisible()
    await expect(engage.getByRole('listitem')).toHaveText([
      /^01We gather your requirements/,
      /^02We bring you options/,
      /^03You choose/,
      /^04We build your choice/,
    ])
    await expect(
      engage.getByRole('link', { name: /Bring us your requirement/ }),
    ).toHaveAttribute('href', '/contact')
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

test('AI shows our own automation stack, labelled as not client work', async ({
  page,
}) => {
  await page.goto('/services/ai')
  const own = page.getByTestId('own-automation')
  await expect(own).toBeVisible()
  await expect(
    own.getByRole('heading', { level: 2, name: 'What we automate for ourselves.' }),
  ).toBeVisible()
  await expect(own.getByText('Our own use. Not client work.')).toBeVisible()
})

test('web proof links only to live client sites', async ({ page }) => {
  await page.goto('/services/web')
  const hrefs = await page
    .getByTestId('service-proof')
    .locator('a[href^="/work/"]')
    .evaluateAll((links) => links.map((link) => link.getAttribute('href')))
  expect(hrefs).toEqual([
    '/work/supreme-universal',
    '/work/express-trade-financing',
    '/work/express-petroleum',
  ])
})

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
    .getByRole('link', { name: /Bring us the problem/ })
    .last()
    .boundingBox()

  expect(box).not.toBeNull()
  expect(box!.height).toBeGreaterThanOrEqual(44)
})
