import { expect, test } from '@playwright/test'

test.describe('mėntality concept', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/concepts/mentality/index.html')
  })

  test('renders the editorial mental-wellbeing hero', async ({ page }) => {
    await expect(page).toHaveTitle('mėntality — Mental wellbeing resources')
    await expect(page.getByRole('link', { name: 'mėntality' })).toBeVisible()
    await expect(
      page.getByRole('heading', {
        level: 1,
        name: /Mentality offers information and resources/,
      }),
    ).toBeVisible()
    await expect(page.getByLabel('Ask mėntality')).toHaveAttribute(
      'placeholder',
      'Ask me anything...',
    )
    await expect(page.locator('video')).toHaveAttribute(
      'src',
      'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260603_132049_036591b8-6e92-4760-b94c-a7ea6eef315c.mp4',
    )
    await expect(page.getByText('pl — en')).toBeVisible()
    await expect(page.getByText('2024', { exact: true })).toBeVisible()
    await expect(page.getByText('mental health tools')).toBeVisible()
  })

  test('opens and closes the mobile navigation accessibly', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    const toggle = page.locator('.menu-toggle')
    await expect(toggle).toHaveAccessibleName('Open menu')
    await toggle.click()
    await expect(toggle).toHaveAttribute('aria-expanded', 'true')
    await expect(page.getByRole('dialog', { name: 'Site menu' })).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(
      await page.evaluate(
        () =>
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth,
      ),
    ).toBeLessThanOrEqual(1)
  })

  test('keeps the exact base background and reduced-motion fallback', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.reload()
    await expect(page.locator('body')).toHaveCSS(
      'background-color',
      'rgb(237, 238, 245)',
    )
    await expect(page.getByRole('heading', { level: 1 })).toHaveCSS(
      'opacity',
      '1',
    )
  })
})
