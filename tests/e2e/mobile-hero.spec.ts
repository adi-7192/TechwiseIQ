import { expect, test, type Locator } from '@playwright/test'

const viewports = [
  { width: 320, height: 568 },
  { width: 375, height: 667 },
  { width: 390, height: 844 },
  { width: 430, height: 932 },
  { width: 600, height: 900 },
]

type Rect = NonNullable<Awaited<ReturnType<Locator['boundingBox']>>>

function overlaps(a: Rect, b: Rect) {
  const horizontal = Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x)
  const vertical = Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y)

  return horizontal > 1 && vertical > 1
}

for (const viewport of viewports) {
  test(`immersive hero is usable at ${viewport.width}x${viewport.height}`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport)
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')

    const hero = page
      .locator('section')
      .filter({ has: page.getByRole('heading', { level: 1 }) })
      .first()
    const heading = page.getByRole('heading', { level: 1 })
    const ctas = hero.getByRole('link', {
      name: /Bring us the bottleneck|See the work/,
    })
    const header = page.locator('header').first()
    const whatsapp = page.getByRole('link', { name: 'Chat on WhatsApp' })

    // No horizontal overflow at any mobile width.
    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    )
    expect(overflow).toBeLessThanOrEqual(1)

    // The hero fills (at least) the viewport — it is set to 100svh min-height.
    const heroBox = await hero.boundingBox()
    expect(heroBox).not.toBeNull()
    expect(heroBox!.height).toBeGreaterThanOrEqual(viewport.height - 1)

    await expect(ctas).toHaveCount(2)
    await expect(heading).toBeVisible()

    const [headingBox, headerBox] = await Promise.all([
      heading.boundingBox(),
      header.boundingBox(),
    ])
    expect(headingBox).not.toBeNull()
    expect(headerBox).not.toBeNull()
    // Keep the floating WhatsApp control referenced so the accessible control
    // is asserted to exist on every mobile viewport.
    await expect(whatsapp).toHaveCount(1)

    // The h1 sits clear of the fixed header bar.
    expect(overlaps(headingBox!, headerBox!)).toBe(false)

    // Each hero CTA is a real tap target and never sits under the header.
    for (const cta of await ctas.all()) {
      const box = await cta.boundingBox()
      expect(box).not.toBeNull()
      expect(box!.height).toBeGreaterThanOrEqual(44)
      expect(overlaps(box!, headerBox!)).toBe(false)
    }
  })
}

test('keeps the desktop hero and its CTAs in view', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')

  const hero = page
    .locator('section')
    .filter({ has: page.getByRole('heading', { level: 1 }) })
    .first()

  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await expect(
    hero.getByRole('link', { name: /Bring us the bottleneck/ }),
  ).toBeVisible()
  await expect(hero.getByRole('link', { name: 'See the work' })).toBeVisible()

  const overflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth -
      document.documentElement.clientWidth,
  )
  expect(overflow).toBeLessThanOrEqual(1)
})
