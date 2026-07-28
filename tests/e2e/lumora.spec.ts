import { expect, test } from '@playwright/test'

const videoUrls = [
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260702_081127_0992a171-d3c6-4978-8213-0ec5df8b6d63.mp4',
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260702_092026_dd05b805-ea0f-40b2-8c52-332b88502592.mp4',
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260702_081042_df7202bf-bd80-4b2b-bbc6-1f09ba2870e9.mp4',
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260702_080959_4cac5234-3573-464e-a5b7-76b94b8a7d61.mp4',
]

test.describe('Lumora concept', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/concepts/lumora/index.html')
  })

  test('renders the complete fullscreen mindfulness composition', async ({
    page,
  }) => {
    await expect(page).toHaveTitle('Lumora — Focus with intention')
    await expect(page.getByRole('link', { name: 'Lumora' })).toBeVisible()
    await expect(
      page.getByText('Over 10,000 minds already finding their clarity'),
    ).toBeVisible()
    await expect(
      page.getByRole('heading', {
        level: 1,
        name: 'Clarity in an Endlessly Noisy Universe',
      }),
    ).toBeVisible()
    await expect(page.getByLabel('Email address')).toHaveAttribute(
      'placeholder',
      'Your Best Email',
    )
    await expect(page.getByText('60+ Deep Sessions')).toBeVisible()
    await expect(page.getByText('12,000+ Creators')).toBeVisible()
    await expect(page.getByText('4.8 User Satisfaction')).toBeVisible()
    await expect(page.getByText('Intentional-First Design')).toBeVisible()

    await expect(page.locator('.video-layer video')).toHaveCount(4)
    expect(
      await page.locator('.video-layer video').evaluateAll((videos) =>
        videos.map((video) => video.getAttribute('src')),
      ),
    ).toEqual(videoUrls)
    await expect(page.locator('.scene-overlay')).toHaveAttribute(
      'src',
      'https://soft-zoom-63098134.figma.site/_assets/v11/0b4a435b2df2747593c43d7a1c9b4578f7d8d90c.png',
    )

    const geometry = await page.evaluate(() => ({
      horizontal:
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
      vertical:
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight,
    }))
    expect(geometry.horizontal).toBeLessThanOrEqual(1)
    expect(geometry.vertical).toBeLessThanOrEqual(1)
  })

  test('switches scenes, applies Deep Woods colors, and enforces cooldown', async ({
    page,
  }) => {
    const golden = page.getByRole('button', { name: 'Golden Hour' })
    const woods = page.getByRole('button', { name: 'Deep Woods' })
    const dawn = page.getByRole('button', { name: 'Quiet Dawn' })

    await expect(golden).toHaveAttribute('aria-pressed', 'true')
    const guardedState = await page.evaluate(() => {
      const deepWoods = document.querySelector<HTMLButtonElement>(
        '[data-scene-button="2"]',
      )
      const quietDawn = document.querySelector<HTMLButtonElement>(
        '[data-scene-button="3"]',
      )
      deepWoods?.click()
      quietDawn?.click()
      return {
        deepWoods: deepWoods?.getAttribute('aria-pressed'),
        quietDawn: quietDawn?.getAttribute('aria-pressed'),
      }
    })
    expect(guardedState).toEqual({
      deepWoods: 'true',
      quietDawn: 'false',
    })
    await expect(woods).toHaveAttribute('aria-pressed', 'true')
    await expect(page.locator('.hero-content')).toHaveCSS(
      'color',
      'rgb(24, 44, 65)',
    )

    await page.waitForTimeout(1_050)
    await dawn.click()
    await expect(dawn).toHaveAttribute('aria-pressed', 'true')
  })

  test('opens and closes the staggered mobile menu accessibly', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    const toggle = page.locator('.menu-toggle')
    await expect(toggle).toHaveAccessibleName('Open menu')
    await toggle.click()
    await expect(toggle).toHaveAttribute('aria-expanded', 'true')
    const dialog = page.getByRole('dialog', { name: 'Site menu' })
    await expect(dialog).toBeVisible()
    await expect(dialog.getByRole('link').nth(0)).toHaveCSS(
      'transition-delay',
      '0.1s',
    )
    await expect(dialog.getByRole('link').nth(1)).toHaveCSS(
      'transition-delay',
      '0.15s',
    )
    await expect(toggle).toHaveAccessibleName('Close menu')
    await expect(toggle).toBeVisible()
    await toggle.click()
    await expect(toggle).toHaveAttribute('aria-expanded', 'false')

    await toggle.click()
    await expect(dialog).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(toggle).toHaveAttribute('aria-expanded', 'false')
    await expect(toggle).toBeFocused()
    expect(
      await page.evaluate(
        () =>
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth,
      ),
    ).toBeLessThanOrEqual(1)
  })

  test('removes non-essential motion when reduced motion is requested', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.reload()
    await expect(page.locator('.scene-overlay')).toHaveCSS(
      'animation-name',
      'none',
    )
    await expect(page.locator('.video-layer video').first()).toHaveCSS(
      'transition-duration',
      '0s',
    )
  })
})
