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
  test(`fills the mobile hero field at ${viewport.width}x${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport)
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')

    const hero = page.locator('header').first()
    const marqueeTracks = hero.locator('.marquee-track')
    const heading = page.getByRole('heading', { level: 1 })
    const primaryCta = hero.getByRole('link', {
      name: 'Book a call',
      exact: true,
    })
    const secondaryCta = hero.getByRole('link', { name: /What we do/ })
    const badge = hero.locator('span[aria-hidden="true"]').filter({
      hasText: 'AI-FIRST',
    })
    const cue = hero.locator('span').filter({ hasText: 'Scroll' }).first()
    const nav = page.locator('nav').first()
    const whatsapp = page.getByRole('link', { name: 'Chat on WhatsApp' })
    const nextSection = hero.locator('xpath=following-sibling::*[1]')

    await expect(marqueeTracks).toHaveCount(3)

    const heroBox = await hero.boundingBox()
    const rowBoxes = await marqueeTracks.evaluateAll((tracks) =>
      tracks.map((track) => {
        const rect = track.getBoundingClientRect()
        return {
          top: rect.top,
          bottom: rect.bottom,
        }
      })
    )

    expect(heroBox).not.toBeNull()
    expect(heroBox!.height).toBeGreaterThanOrEqual(viewport.height - 1)

    const rowFieldTop = Math.min(...rowBoxes.map((box) => box.top))
    const rowFieldBottom = Math.max(...rowBoxes.map((box) => box.bottom))
    expect(rowFieldBottom - rowFieldTop).toBeGreaterThanOrEqual(heroBox!.height * 0.55)

    const [
      headingBox,
      primaryBox,
      secondaryBox,
      badgeBox,
      cueBox,
      navBox,
      whatsappBox,
      nextSectionBox,
    ] = await Promise.all([
      heading.boundingBox(),
      primaryCta.boundingBox(),
      secondaryCta.boundingBox(),
      badge.boundingBox(),
      cue.boundingBox(),
      nav.boundingBox(),
      whatsapp.boundingBox(),
      nextSection.boundingBox(),
    ])

    for (const box of [
      headingBox,
      primaryBox,
      secondaryBox,
      badgeBox,
      cueBox,
      navBox,
      whatsappBox,
      nextSectionBox,
    ]) {
      expect(box).not.toBeNull()
    }

    expect(primaryBox!.height).toBeGreaterThanOrEqual(44)
    expect(secondaryBox!.height).toBeGreaterThanOrEqual(44)
    expect(overlaps(badgeBox!, primaryBox!)).toBe(false)
    expect(overlaps(badgeBox!, secondaryBox!)).toBe(false)
    expect(overlaps(badgeBox!, whatsappBox!)).toBe(false)
    expect(overlaps(cueBox!, whatsappBox!)).toBe(false)
    expect(overlaps(navBox!, headingBox!)).toBe(false)
    expect(overlaps(navBox!, primaryBox!)).toBe(false)
    expect(overlaps(navBox!, secondaryBox!)).toBe(false)
    expect(Math.abs(nextSectionBox!.y - (heroBox!.y + heroBox!.height))).toBeLessThanOrEqual(1)

    expect(await hero.evaluate((element) => getComputedStyle(element).overflowX)).toBe('hidden')
  })
}

test('keeps the desktop marquee in normal flow', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')

  const positions = await page
    .locator('header')
    .first()
    .locator('.marquee-track')
    .evaluateAll((tracks) =>
      tracks.map(
        (track) => getComputedStyle(track.parentElement!.parentElement!.parentElement!).position
      )
    )

  expect(positions).toEqual(['static', 'static', 'static'])
})
