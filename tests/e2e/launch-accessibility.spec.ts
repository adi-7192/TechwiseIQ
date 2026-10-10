import { expect, test } from '@playwright/test'

test.describe('launch accessibility hardening', () => {
  test('removes the redundant floating WhatsApp control from contact', async ({
    page,
  }) => {
    await page.goto('/contact')

    await expect(
      page.getByRole('link', { name: 'WhatsApp — chat', exact: true }),
    ).toBeHidden()
    await expect(
      page.getByRole('link', { name: /WhatsApp.*Chat on WhatsApp/i }),
    ).toBeVisible()
  })

  test('uses the visual 404 as the page heading', async ({ page }) => {
    const response = await page.goto('/this-page-does-not-exist')

    expect(response?.status()).toBe(404)
    await expect(
      page.getByRole('heading', { level: 1, name: '404' }),
    ).toHaveCount(1)
  })

  test('uses contrast-safe headline accents and work labels', async ({
    page,
  }) => {
    // Immersive dark world: the h1 accent run is the muted foreground
    // (contrast-safe on the near-black background), not a light-theme ink.
    // /services sets its h1 second line as the muted "ghost" line (D-045/D-046).
    await page.goto('/services')
    await expect(
      page.getByRole('heading', { level: 1 }).locator('[data-ref-line]').last(),
    ).toHaveCSS('color', 'rgb(138, 145, 140)')
    await expect(page.getByTestId('problem-navigator')).toBeVisible()

    await page.goto('/work')
    await expect(
      page.getByRole('heading', { level: 1 }).locator('span'),
    ).toHaveCSS('color', 'rgb(138, 145, 140)')
    await expect(page.getByText('Selected client work')).toBeVisible()
  })

  test('keeps visible work-action copy in each accessible name', async ({
    page,
  }) => {
    await page.goto('/work')

    await expect(
      page.getByRole('link', {
        name: /Read full case study.*AASKRA Realty/i,
      }),
    ).toBeVisible()
    await expect(
      page.getByRole('link', {
        name: /Visit live site.*Express Trade Financing.*opens in a new tab/i,
      }),
    ).toBeVisible()
    await expect(
      page.getByRole('link', {
        name: /View preview.*RSiGHT.*opens in a new tab/i,
      }),
    ).toBeVisible()
  })

  test('moves focus to the destination heading after client navigation', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 900 })
    await page.goto('/')
    await page
      .getByRole('link', { name: 'Services', exact: true })
      .first()
      .click()

    await expect(page).toHaveURL(/\/services$/)
    await expect(page.getByRole('heading', { level: 1 })).toBeFocused()
  })

  test('names and focuses the case-study screenshot scroller', async ({
    page,
  }) => {
    await page.goto('/work/aaskra-realty')
    const scroller = page.getByRole('region', {
      name: /Full-page screenshot of the AASKRA Realty website/i,
    })

    await scroller.focus()
    await expect(scroller).toBeFocused()
  })
})
