import { expect, test } from '@playwright/test'

const socialRoutes = [
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

test.describe('launch metadata', () => {
  for (const route of socialRoutes) {
    test(`${route} has complete share metadata`, async ({ page }) => {
      await page.goto(route)

      await expect(page.locator('link[rel="canonical"]')).toHaveCount(1)
      await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
        'content',
        /\/opengraph-image(?:\?|$)/,
      )
      await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
        'content',
        'summary_large_image',
      )
      await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute(
        'content',
        /\/opengraph-image(?:\?|$)/,
      )
      await expect(page.locator('meta[property="og:title"]')).not.toHaveAttribute(
        'content',
        'Techwise IQ — Web, Software & AI Engineering',
      )
      await expect(page.locator('meta[property="og:description"]')).toHaveAttribute(
        'content',
        /.{20,}/,
      )
    })
  }
})

test('publishes the complete canonical sitemap and permissive robots rules', async ({
  page,
}) => {
  const sitemap = await page.request.get('/sitemap.xml')
  expect(sitemap.ok()).toBe(true)
  const sitemapText = await sitemap.text()
  for (const route of socialRoutes) {
    const url = route === '/' ? 'https://techwiseiq.com' : `https://techwiseiq.com${route}`
    expect(sitemapText).toContain(`<loc>${url}</loc>`)
  }

  const robots = await page.request.get('/robots.txt')
  expect(robots.ok()).toBe(true)
  const robotsText = await robots.text()
  expect(robotsText).toContain('Allow: /')
  expect(robotsText).toContain('Sitemap: https://techwiseiq.com/sitemap.xml')
})

test('keeps all published structured data parseable and factual', async ({ page }) => {
  for (const route of [
    '/',
    '/services/web',
    '/services/software',
    '/services/ai',
    '/work',
    '/work/aaskra-realty',
    '/work/express-trade-financing',
    '/about',
  ]) {
    await page.goto(route)
    const blocks = await page.locator('script[type="application/ld+json"]').allTextContents()
    expect(blocks.length, `${route} should retain structured data`).toBeGreaterThan(0)
    for (const block of blocks) {
      const parsed = JSON.parse(block) as Record<string, unknown>
      expect(parsed['@context']).toBe('https://schema.org')
      expect(block).not.toMatch(/PriceSpecification|priceCurrency|"price"/i)
    }
  }
})

test('declares smooth-scroll behavior for Next navigation', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('html')).toHaveAttribute(
    'data-scroll-behavior',
    'smooth',
  )
})

test('prioritizes the first work image and case-study cover', async ({
  page,
}) => {
  await page.goto('/work')
  await expect(
    page.locator('[data-client-project] img').first(),
  ).toHaveAttribute('loading', 'eager')
  await expect(
    page.locator('[data-client-project] img').first(),
  ).toHaveAttribute('fetchpriority', 'high')

  await page.goto('/work/aaskra-realty')
  await expect(page.locator('main img').first()).toHaveAttribute(
    'loading',
    'eager',
  )
  await expect(page.locator('main img').first()).toHaveAttribute(
    'fetchpriority',
    'high',
  )
})

test('critical service and work copy exists without JavaScript', async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  const page = await context.newPage()

  await page.goto('/services')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()

  await page.goto('/services/web')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()

  await page.goto('/work')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()

  await page.goto('/work/aaskra-realty')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()

  await context.close()
})
