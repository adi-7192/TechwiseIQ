import { expect, test } from '@playwright/test'

const routes = [
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
]

for (const route of routes) {
  test(`${route} meets launch invariants`, async ({ page }) => {
    const errors: string[] = []
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text())
    })
    page.on('pageerror', (error) => errors.push(error.message))

    const response = await page.goto(route, { waitUntil: 'domcontentloaded' })

    expect(response?.status()).toBe(200)
    await expect(page.locator('main')).toHaveCount(1)
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1)
    expect(await page.title()).not.toBe('')
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      'content',
      /.+/,
    )

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    )
    expect(overflow).toBeLessThanOrEqual(1)

    const invalidJsonLd = await page
      .locator('script[type="application/ld+json"]')
      .evaluateAll((scripts) =>
        scripts
          .map((script) => script.textContent ?? '')
          .filter((value) => {
            try {
              JSON.parse(value)
              return false
            } catch {
              return true
            }
          }),
      )
    expect(invalidJsonLd).toEqual([])
    expect(errors).toEqual([])
  })
}

test('returns the designed semantic 404', async ({ page }) => {
  const response = await page.goto('/launch-audit-missing-route')

  expect(response?.status()).toBe(404)
  await expect(
    page.getByRole('heading', { level: 1, name: '404' }),
  ).toBeVisible()
})

test('serves parseable crawler files', async ({ request }) => {
  const robots = await request.get('/robots.txt')
  expect(robots.status()).toBe(200)
  expect(await robots.text()).toContain(
    'Sitemap: https://techwiseiq.com/sitemap.xml',
  )

  const sitemap = await request.get('/sitemap.xml')
  expect(sitemap.status()).toBe(200)
  const xml = await sitemap.text()
  for (const route of routes) {
    const expected =
      route === '/'
        ? '<loc>https://techwiseiq.com</loc>'
        : `<loc>https://techwiseiq.com${route}</loc>`
    expect(xml).toContain(expected)
  }
})
