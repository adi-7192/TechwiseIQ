import { expect, test } from '@playwright/test'

test('keeps the hero and replaces the below-hero story', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')

  await expect(
    page.locator('header').first().locator('.marquee-track'),
  ).toHaveCount(3)
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'Techwise IQ — the AI-first engineering agency.',
  )

  const experience = page.getByTestId('home-experience')
  await expect(experience).toBeVisible()
  await expect(
    experience.getByRole('heading', {
      name: /shouldn.t feel this manual/i,
    }),
  ).toBeVisible()

  const serviceLinks = [
    ['Web Development', '/services/web'],
    ['Custom Software', '/services/software'],
    ['AI Automation', '/services/ai'],
  ] as const

  for (const [name, path] of serviceLinks) {
    const link = experience.getByRole('link', {
      name: new RegExp(`Explore ${name}`, 'i'),
    })
    await expect(link).toHaveAttribute('href', path)
  }

  await expect(
    experience.getByText('Fixed scope', { exact: true }),
  ).toBeVisible()
  await expect(
    experience.getByText('Weekly demos', { exact: true }),
  ).toBeVisible()
  await expect(
    experience.getByRole('link', { name: /book a call/i }),
  ).toHaveAttribute('href', /wa\.me\/971567760667/)
  await expect(
    experience.getByRole('link', { name: /whatsapp/i }),
  ).toHaveAttribute('href', 'https://wa.me/971567760667')
  await expect(
    experience.getByRole('link', { name: /enquiry/i }),
  ).toHaveAttribute('href', '/contact')

  await expect(
    experience.getByText('Selected work', { exact: true }),
  ).toHaveCount(0)
  await expect(experience.getByTestId('home-proof')).toHaveCount(0)
})

for (const viewport of [
  { width: 375, height: 667 },
  { width: 768, height: 900 },
  { width: 1440, height: 1000 },
]) {
  test(`keeps the compact experience inside ${viewport.width}px`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport)
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')

    const experience = page.getByTestId('home-experience')
    await expect(experience).toBeVisible()
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true)

    const ctas = experience.locator('[data-home-cta-link]')
    await expect(ctas).toHaveCount(3)
    for (const cta of await ctas.all()) {
      const box = await cta.boundingBox()
      expect(box).not.toBeNull()
      expect(box!.height).toBeGreaterThanOrEqual(44)
    }

    const sections = experience.locator(':scope > section')
    expect(await sections.count()).toBe(7)

    await expect(experience.locator('[data-home-problem]')).toHaveCSS(
      'background-color',
      'rgb(16, 16, 16)',
    )
    await expect(experience.locator('[data-home-service="software"]')).toHaveCSS(
      'background-color',
      'rgb(16, 16, 16)',
    )
    await expect(experience.locator('[data-home-service="ai"]')).toHaveCSS(
      'background-color',
      'rgb(255, 208, 47)',
    )
    await expect(sections.last()).toHaveCSS(
      'background-color',
      'rgb(255, 77, 0)',
    )

    const webCopy = experience
      .locator('[data-home-service="web"] [data-home-reveal]')
      .first()
    const webVisual = experience.locator('[data-home-web-frame]')
    const copyBox = await webCopy.boundingBox()
    const visualBox = await webVisual.boundingBox()
    expect(copyBox).not.toBeNull()
    expect(visualBox).not.toBeNull()

    if (viewport.width < 768) {
      expect(copyBox!.y + copyBox!.height).toBeLessThanOrEqual(visualBox!.y)
    } else {
      expect(visualBox!.x).toBeGreaterThan(copyBox!.x)
      expect(visualBox!.y).toBeLessThan(copyBox!.y + copyBox!.height)
    }
  })
}
