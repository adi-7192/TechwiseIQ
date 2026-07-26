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
    })
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
