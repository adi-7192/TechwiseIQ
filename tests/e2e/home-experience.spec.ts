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

test('renders distinct software and AI service illustrations', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')

  const experience = page.getByTestId('home-experience')
  const software = experience.locator('[data-home-software-dashboard]')
  const automation = experience.locator('[data-home-ai-orchestration]')

  await expect(software).toBeVisible()
  await expect(software.locator('[data-home-software-status]')).toHaveCount(3)
  await expect(software.locator('[data-home-software-cursor]')).toHaveCount(1)

  await expect(automation).toBeVisible()
  await expect(automation.locator('[data-home-ai-input]')).toHaveCount(3)
  await expect(automation.locator('[data-home-ai-output]')).toHaveCount(3)
  await expect(automation.locator('[data-home-ai-core]')).toHaveCount(1)
  await expect(automation.locator('[data-home-ai-signal]')).toHaveCount(1)

  await expect(experience.locator('[data-home-system-node]')).toHaveCount(0)
  await expect(experience.locator('[data-home-system-core]')).toHaveCount(0)
  await expect(experience.locator('[data-home-ai-review]')).toHaveCount(0)
  await expect(experience.locator('[data-home-ai-result]')).toHaveCount(0)
})

test('keeps service illustrations complete without JavaScript', async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  const page = await context.newPage()
  await page.goto('/')

  await expect(page.locator('[data-home-software-dashboard]')).toBeVisible()
  await expect(page.locator('[data-home-ai-orchestration]')).toBeVisible()
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true)

  await context.close()
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

test('settles every reveal when reduced motion is requested', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')

  const experience = page.getByTestId('home-experience')
  await expect(experience).toHaveAttribute('data-motion', 'reduced')

  const unsettled = await experience.locator('[data-home-reveal]').evaluateAll(
    (elements) =>
      elements.filter((element) => {
        const style = window.getComputedStyle(element)
        return style.opacity !== '1' || style.transform !== 'none'
      }).length,
  )
  expect(unsettled).toBe(0)
})

test('keeps service illustrations static when reduced motion is requested', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')

  const softwareScene = page.locator('[data-home-service="software"]')
  const aiScene = page.locator('[data-home-service="ai"]')

  await expect(softwareScene).toHaveAttribute('data-loop-state', 'reduced')
  await expect(aiScene).toHaveAttribute('data-loop-state', 'reduced')

  for (const selector of [
    '[data-home-software-dashboard]',
    '[data-home-ai-orchestration]',
  ]) {
    const visual = page.locator(selector)
    await expect(visual).toBeVisible()
    await expect(visual).toHaveCSS('opacity', '1')
  }
})

test('reveals each scene as it enters the viewport', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/')

  const experience = page.getByTestId('home-experience')
  await expect(experience).toHaveAttribute('data-motion', 'active')

  const webCopy = experience
    .locator('[data-home-service="web"] [data-home-reveal]')
    .first()
  await webCopy.scrollIntoViewIfNeeded()
  await expect(webCopy).toHaveAttribute('data-visible', 'true')
  await expect(webCopy).toHaveCSS('opacity', '1')
})

test('runs only the service loop that is in the viewport', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/')

  const softwareScene = page.locator('[data-home-service="software"]')
  const aiScene = page.locator('[data-home-service="ai"]')

  await softwareScene.scrollIntoViewIfNeeded()
  await expect(softwareScene).toHaveAttribute('data-loop-state', 'running')

  await aiScene.scrollIntoViewIfNeeded()
  await expect(aiScene).toHaveAttribute('data-loop-state', 'running')
  await expect(softwareScene).toHaveAttribute('data-loop-state', 'paused')
})
