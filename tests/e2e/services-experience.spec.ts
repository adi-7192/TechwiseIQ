import { expect, test } from '@playwright/test'

const detailRoutes = [
  { path: '/services/web', heading: 'Web Development' },
  { path: '/services/software', heading: 'Custom Software' },
  { path: '/services/ai', heading: 'AI Automation' },
]

test.describe('Services overview', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/services')
  })

  test('starts with the bottleneck and keeps every service visible', async ({
    page,
  }) => {
    await expect(
      page.getByRole('heading', {
        level: 1,
        name: "What's slowing you down?",
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
