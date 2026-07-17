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
  { width: 769, height: 900 },
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
    const h1Box = await h1.boundingBox()
    expect(h1Box).not.toBeNull()
    expect(
      Math.abs(h1Box!.x + h1Box!.width / 2 - viewport.width / 2),
    ).toBeLessThanOrEqual(2)

    await experience.evaluate((element) =>
      element.removeAttribute('data-motion'),
    )
    await expect(experience.locator('[data-about-fragment-field]')).toHaveCSS(
      'display',
      'none',
    )

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

test('keeps narrow-desktop fragments clear of core hero copy', async ({
  page,
}) => {
  const viewport = { width: 769, height: 900 }
  await page.setViewportSize(viewport)
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/about')

  const experience = page.getByTestId('about-experience')
  const h1Box = await experience
    .getByRole('heading', { level: 1 })
    .boundingBox()
  const heroBodyBox = await experience
    .locator('[data-about-hero] p')
    .filter({ hasText: 'Techwise IQ turns business bottlenecks' })
    .boundingBox()
  expect(h1Box).not.toBeNull()
  expect(heroBodyBox).not.toBeNull()

  const fragments = experience.locator('[data-about-fragment]:visible')
  expect(await fragments.count()).toBeGreaterThan(0)
  for (const fragment of await fragments.all()) {
    const fragmentBox = await fragment.boundingBox()
    const fragmentText = await fragment.textContent()
    expect(fragmentBox).not.toBeNull()
    expect(
      fragmentBox!.x,
      `${fragmentText} starts outside the viewport`,
    ).toBeGreaterThanOrEqual(0)
    expect(
      fragmentBox!.x + fragmentBox!.width,
      `${fragmentText} ends outside the viewport`,
    ).toBeLessThanOrEqual(viewport.width)

    for (const [label, copyBox] of [
      ['heading', h1Box!],
      ['hero body', heroBodyBox!],
    ] as const) {
      const intersects =
        fragmentBox!.x < copyBox.x + copyBox.width &&
        fragmentBox!.x + fragmentBox!.width > copyBox.x &&
        fragmentBox!.y < copyBox.y + copyBox.height &&
        fragmentBox!.y + fragmentBox!.height > copyBox.y
      expect(
        intersects,
        `${fragmentText} intersects the ${label}`,
      ).toBe(false)
    }
  }
})

test('keeps active culture panels in one stable visual grid area', async ({
  page,
}) => {
  await page.setViewportSize({ width: 769, height: 900 })
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/about')

  const experience = page.getByTestId('about-experience')
  await experience.evaluate((element) =>
    element.setAttribute('data-motion', 'active'),
  )

  const panelsWrapper = experience.locator('[data-about-culture-panels]')
  const wrapperBox = await panelsWrapper.evaluate((wrapper) => ({
    width: (wrapper as HTMLElement).clientWidth,
    height: (wrapper as HTMLElement).clientHeight,
  }))
  expect(wrapperBox.height).toBeGreaterThanOrEqual(100)

  const panelBoxes = await experience
    .locator('[data-about-culture-panel]')
    .evaluateAll((panels) =>
      panels.map((panel) => ({
        x: (panel as HTMLElement).offsetLeft,
        y: (panel as HTMLElement).offsetTop,
        width: (panel as HTMLElement).offsetWidth,
        height: (panel as HTMLElement).offsetHeight,
      })),
    )
  expect(panelBoxes).toHaveLength(3)
  for (const panelBox of panelBoxes) {
    expect(panelBox.height).toBeGreaterThanOrEqual(100)
    expect(Math.abs(panelBox.x)).toBeLessThanOrEqual(2)
    expect(Math.abs(panelBox.y)).toBeLessThanOrEqual(2)
    expect(Math.abs(panelBox.width - wrapperBox.width)).toBeLessThanOrEqual(2)
    expect(Math.abs(panelBox.height - wrapperBox.height)).toBeLessThanOrEqual(2)
  }
})

test('uses accessible ink text on the hot CTA', async ({ page }) => {
  await page.goto('/about')

  const cta = page.getByTestId('about-experience').getByRole('link', {
    name: /bring us the business problem/i,
  })
  await expect(cta).toHaveCSS('color', 'rgb(16, 16, 16)')
  await expect(cta).toHaveCSS('background-color', 'rgb(255, 77, 0)')
})

test('settles the complete About story for reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/about')

  const experience = page.getByTestId('about-experience')
  await expect(experience).toHaveAttribute('data-motion', 'reduced')

  const panels = experience.locator('[data-about-culture-panel]')
  await expect(panels).toHaveCount(3)
  for (const panel of await panels.all()) {
    await expect(panel).toHaveCSS('opacity', '1')
  }
})

test('keeps About complete without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  const page = await context.newPage()
  await page.goto('/about')

  await expect(page.getByTestId('about-experience')).toBeVisible()
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await expect(page.locator('[data-about-culture-panel]')).toHaveCount(3)
  await expect(
    page.getByRole('link', { name: /bring us the business problem/i }),
  ).toBeVisible()
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true)

  await context.close()
})

test('activates the hero convergence when motion is allowed', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/about')

  const experience = page.getByTestId('about-experience')
  await expect(experience).toHaveAttribute('data-motion', 'active')

  const fragment = experience.locator('[data-about-fragment]').first()
  const before = await fragment.evaluate(
    (element) => getComputedStyle(element).transform,
  )
  await page.evaluate(() => window.scrollTo(0, window.innerHeight * 0.35))
  await page.waitForTimeout(250)
  const after = await fragment.evaluate(
    (element) => getComputedStyle(element).transform,
  )

  expect(after).not.toBe(before)
})
