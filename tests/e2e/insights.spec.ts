import { expect, test } from '@playwright/test'

test('/insights lists all six articles', async ({ page }) => {
  await page.goto('/insights')
  await expect(page.locator('main ol > li h2 a[href^="/insights/"]')).toHaveCount(6)
})

test('an article has one h1, the team byline and working citations', async ({ page }) => {
  await page.goto('/insights/who-owns-your-website')
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1)
  await expect(page.locator('main')).toContainText('Techwise IQ team')

  const citations = await page
    .locator('main sup a')
    .evaluateAll((links) => links.map((link) => link.getAttribute('href') ?? ''))
  expect(citations.length).toBeGreaterThan(0)
  for (const href of citations) {
    expect(href).toMatch(/^#source-\d+$/)
    await expect(page.locator(href)).toHaveCount(1)
  }

  const sources = page.locator('li[id^="source-"] a')
  expect(await sources.count()).toBeGreaterThan(0)
  for (const link of await sources.all()) {
    await expect(link).toHaveAttribute('target', '_blank')
    await expect(link).toHaveAttribute('rel', /noopener/)
  }
})

test('unknown insight slug is a 404', async ({ page }) => {
  const response = await page.goto('/insights/not-a-real-article')
  expect(response?.status()).toBe(404)
})

for (const [service, count] of [['web', 3], ['software', 2], ['ai', 1]] as const) {
  test(`/services/${service} shows ${count} "Worth a read" links`, async ({ page }) => {
    await page.goto(`/services/${service}`)
    await expect(page.locator('#questions a[href^="/insights/"]')).toHaveCount(count)
    await expect(page.locator('#questions')).toContainText('Worth a read')
  })
}
