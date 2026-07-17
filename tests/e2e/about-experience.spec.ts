import { expect, test } from '@playwright/test'

test('renders the approved four-scene About story', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/about')

  await expect(page).toHaveTitle(
    'About Techwise IQ | Business-First Engineering in Dubai',
  )

  const experience = page.getByTestId('about-experience')
  await expect(experience).toBeVisible()
  await expect(
    experience.getByRole('heading', {
      level: 1,
      name: 'We make complex feel clear.',
    }),
  ).toBeVisible()

  const scenes = experience.locator(':scope > section')
  await expect(scenes).toHaveCount(4)
  await expect(
    scenes.evaluateAll((sections) =>
      sections.map((section) =>
        [
          'data-about-hero',
          'data-about-expertise',
          'data-about-culture',
          'data-about-closing',
        ].find((attribute) => section.hasAttribute(attribute)),
      ),
    ),
  ).resolves.toEqual([
    'data-about-hero',
    'data-about-expertise',
    'data-about-culture',
    'data-about-closing',
  ])

  const problemList = experience.getByRole('list', {
    name: 'Business bottlenecks we help resolve',
  })
  await expect(
    problemList.locator('li').evaluateAll((items) =>
      items.map((item) => item.textContent?.trim()),
    ),
  ).resolves.toEqual([
    'Underperforming website',
    'Manual daily work',
    'Disconnected systems',
    'Technical uncertainty',
    'Growth bottlenecks',
  ])

  await expect(
    experience.locator('[data-about-path]').evaluateAll((paths) =>
      paths.map((path) => ({
        problem: path.querySelector('strong')?.textContent?.trim(),
        outcome: path.querySelector('p')?.textContent?.trim(),
      })),
    ),
  ).resolves.toEqual([
    {
      problem: 'A website that undersells you',
      outcome: 'A digital presence built to earn attention and action.',
    },
    {
      problem: 'Work trapped in spreadsheets',
      outcome: 'Software shaped around how your operation actually runs.',
    },
    {
      problem: 'Repetitive work slowing people down',
      outcome: 'AI automation with clear human control.',
    },
  ])

  await expect(
    experience.locator('[data-about-culture-panel]').evaluateAll((panels) =>
      panels.map((panel) => ({
        title: panel.querySelector('h3')?.textContent?.trim(),
        body: panel.querySelector('p')?.textContent?.trim(),
      })),
    ),
  ).resolves.toEqual([
    {
      title: 'Ownership',
      body: 'We recommend the path and take responsibility for delivery.',
    },
    {
      title: 'Clarity',
      body: 'Plain language, written scope, and progress you can see.',
    },
    {
      title: 'Momentum',
      body: 'Fewer hand-offs. Working progress. Decisions turned into useful outcomes.',
    },
  ])

  await expect(
    experience.getByRole('heading', {
      name: /technology should make the business simpler/i,
    }),
  ).toBeVisible()
  await expect(experience.getByText('Ownership', { exact: true })).toBeVisible()
  await expect(experience.getByText('Clarity', { exact: true })).toBeVisible()
  await expect(experience.getByText('Momentum', { exact: true })).toBeVisible()
  await expect(
    experience.getByRole('heading', {
      name: 'Built in Dubai. Working beyond borders.',
    }),
  ).toBeVisible()

  const cta = experience.getByRole('link', {
    name: /bring us the business problem/i,
  })
  await expect(experience.getByRole('link')).toHaveCount(1)
  await expect(cta).toHaveAttribute('href', /wa\.me\/971567760667/)

  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1)
})

test('keeps About proof qualitative and removes individual profiles', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/about')

  const main = page.locator('main')
  await expect(
    main.getByText('Trusted by businesses in Dubai and beyond', {
      exact: false,
    }),
  ).toBeVisible()

  for (const forbidden of [
    /note from the founder/i,
    /small team/i,
    /founder, techwise iq/i,
    /two hundred/i,
  ]) {
    await expect(main.getByText(forbidden)).toHaveCount(0)
  }
})

for (const viewport of [
  { width: 375, height: 667 },
  { width: 768, height: 900 },
  { width: 1440, height: 1000 },
]) {
  test(`keeps About centered and inside ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport)
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/about')

    const experience = page.getByTestId('about-experience')
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true)

    const h1 = experience.getByRole('heading', { level: 1 })
    await expect(h1).toHaveCSS('text-align', 'center')

    const cta = experience.getByRole('link', {
      name: /bring us the business problem/i,
    })
    const ctaBox = await cta.boundingBox()
    expect(ctaBox).not.toBeNull()
    expect(ctaBox!.height).toBeGreaterThanOrEqual(44)

    await expect(experience.locator('[data-about-culture]')).toHaveCSS(
      'background-color',
      'rgb(16, 16, 16)',
    )
    await expect(experience.locator('[data-about-closing]')).toHaveCSS(
      'background-color',
      'rgb(255, 208, 47)',
    )
  })
}
