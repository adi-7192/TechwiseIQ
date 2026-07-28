import { expect, test } from '@playwright/test'

test.describe('TerraElix concept', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/concepts/terra-elix/index.html')
  })

  test('renders the specified wellness composition', async ({ page }) => {
    await expect(page).toHaveTitle('TerraElix — Plant-based wellness')
    await expect(page.getByRole('link', { name: 'TerraElix' })).toBeVisible()
    await expect(
      page.getByRole('heading', {
        level: 1,
        name: 'The Power of Nature in Every Capsule',
      }),
    ).toBeVisible()
    await expect(page.getByRole('link', { name: /Explore Now/ })).toBeVisible()
    await expect(page.locator('[data-terra-panel]')).toHaveCount(3)
    await expect(page.locator('[data-formula-card]')).toHaveCount(4)
  })

  test('rotates formula cards and marks the active indicator', async ({
    page,
  }) => {
    const cards = page.locator('[data-formula-card]')
    await expect(cards.nth(0)).toHaveAttribute('aria-hidden', 'false')
    await expect(page.locator('[data-formula-dot]').nth(0)).toHaveAttribute(
      'data-active',
      'true',
    )
    await expect(cards.nth(1)).toHaveAttribute('aria-hidden', 'false', {
      timeout: 4_500,
    })
  })

  test('provides an accessible mobile menu without horizontal overflow', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    const toggle = page.locator('.menu-toggle')
    await expect(toggle).toHaveAccessibleName('Open menu')
    await toggle.click()
    await expect(toggle).toHaveAttribute('aria-expanded', 'true')
    await expect(toggle).toHaveAccessibleName('Close menu')
    await expect(page.getByRole('dialog', { name: 'Site menu' })).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(toggle).toHaveAttribute('aria-expanded', 'false')

    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    )
    expect(overflow).toBeLessThanOrEqual(1)
  })

  test('stops non-essential movement under reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.reload()
    await expect(page.locator('[data-formula-card]').nth(0)).toHaveAttribute(
      'aria-hidden',
      'false',
    )
    await page.waitForTimeout(3_700)
    await expect(page.locator('[data-formula-card]').nth(0)).toHaveAttribute(
      'aria-hidden',
      'false',
    )
  })
})
