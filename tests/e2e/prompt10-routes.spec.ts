import { expect, test } from '@playwright/test'

for (const route of ['/privacy', '/terms']) {
  test(`${route} uses the immersive chrome without a WebGL scene`, async ({
    page,
  }) => {
    await page.goto(route)

    await expect(page.locator('.tw-world')).toBeVisible()
    await expect(page.getByRole('banner')).toBeVisible()
    await expect(page.getByRole('contentinfo')).toBeVisible()
    await expect(page.locator('canvas')).toHaveCount(0)
    await expect(page.getByText('Last updated: June 2026')).toBeVisible()
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1)
  })
}

test('contact uses the immersive system and preserves direct channels', async ({
  page,
}) => {
  await page.goto('/contact')

  await expect(page.locator('.tw-world')).toBeVisible()
  await expect(page.locator('form[data-testid="contact-form"]')).toBeVisible()
  const main = page.locator('main')
  await expect(
    main.getByRole('link', { name: /whatsapp/i }),
  ).toHaveAttribute('href', 'https://wa.me/971567760667')
  await expect(
    main.getByRole('link', { name: /info@techwiseiqtechnologies\.ae/i }),
  ).toHaveAttribute('href', 'mailto:Info@techwiseiqtechnologies.ae')
})

test('the designed 404 uses the new shell without WebGL', async ({ page }) => {
  const response = await page.goto('/prompt-10-missing-page')

  expect(response?.status()).toBe(404)
  await expect(page.locator('.tw-world')).toBeVisible()
  await expect(page.getByRole('heading', { level: 1, name: '404' })).toBeVisible()
  await expect(page.locator('canvas')).toHaveCount(0)
  await expect(page.getByRole('link', { name: /what we do/i })).toHaveAttribute(
    'href',
    '/services',
  )
})
