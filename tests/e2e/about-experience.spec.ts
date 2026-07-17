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

for (const { viewport, expectedVisibleFragments } of [
  { viewport: { width: 320, height: 568 }, expectedVisibleFragments: 0 },
  { viewport: { width: 320, height: 667 }, expectedVisibleFragments: 0 },
  { viewport: { width: 375, height: 667 }, expectedVisibleFragments: 3 },
  { viewport: { width: 430, height: 932 }, expectedVisibleFragments: 3 },
]) {
  test(`keeps mobile fragments clear inside ${viewport.width}x${viewport.height}`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport)
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await page.goto('/about')

    const experience = page.getByTestId('about-experience')
    await expect(experience).toHaveAttribute('data-motion', 'active')
    const fragments = experience.locator('[data-about-fragment]')
    await expect
      .poll(() =>
        fragments.evaluateAll((elements) => {
          const visible = elements.filter((element) => {
            const style = getComputedStyle(element)
            const rect = element.getBoundingClientRect()
            return (
              style.display !== 'none' &&
              style.visibility !== 'hidden' &&
              style.visibility !== 'collapse' &&
              rect.width > 0 &&
              rect.height > 0
            )
          })
          return (
            visible.length === 0 ||
            visible.every(
              (element) =>
                Number.parseFloat(getComputedStyle(element).opacity) >= 0.99,
            )
          )
        }),
      )
      .toBe(true)

    const visibleFragments = []
    for (const fragment of await fragments.all()) {
      const box = await fragment.boundingBox()
      const displayed = await fragment.evaluate((element) => {
        const style = getComputedStyle(element)
        return (
          style.display !== 'none' &&
          style.visibility !== 'hidden' &&
          style.visibility !== 'collapse'
        )
      })
      if (box && displayed) visibleFragments.push({ fragment, box })
    }
    expect(visibleFragments).toHaveLength(expectedVisibleFragments)

    const h1Box = await experience
      .getByRole('heading', { level: 1 })
      .boundingBox()
    const heroBodyBox = await experience
      .locator('[data-about-hero] p')
      .filter({ hasText: 'Techwise IQ turns business bottlenecks' })
      .boundingBox()
    const scrollCueBox = await experience
      .locator('[data-about-hero] span')
      .filter({ hasText: 'Scroll to bring the pieces together' })
      .boundingBox()
    expect(h1Box).not.toBeNull()
    expect(heroBodyBox).not.toBeNull()
    if (viewport.width <= 340 && viewport.height <= 620) {
      expect(scrollCueBox).toBeNull()
    } else {
      expect(scrollCueBox).not.toBeNull()
    }

    for (const { fragment, box } of visibleFragments) {
      const fragmentText = await fragment.textContent()
      expect(
        box.x,
        `${fragmentText} starts outside the viewport`,
      ).toBeGreaterThanOrEqual(0)
      expect(
        box.y,
        `${fragmentText} starts above the viewport`,
      ).toBeGreaterThanOrEqual(0)
      expect(
        box.x + box.width,
        `${fragmentText} ends outside the viewport`,
      ).toBeLessThanOrEqual(viewport.width)
      expect(
        box.y + box.height,
        `${fragmentText} ends below the viewport`,
      ).toBeLessThanOrEqual(viewport.height)

      for (const [label, copyBox] of [
        ['heading', h1Box!],
        ['hero body', heroBodyBox!],
        ...(scrollCueBox ? ([['scroll cue', scrollCueBox]] as const) : []),
      ] as const) {
        const intersects =
          box.x < copyBox.x + copyBox.width &&
          box.x + box.width > copyBox.x &&
          box.y < copyBox.y + copyBox.height &&
          box.y + box.height > copyBox.y
        expect(intersects, `${fragmentText} intersects the ${label}`).toBe(
          false,
        )
      }
    }
  })
}

test('keeps the fixed WhatsApp control clear of short-phone About copy', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 568 })
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/about')

  const experience = page.getByTestId('about-experience')
  await expect(experience).toHaveAttribute('data-motion', 'active')
  const heroBodyBox = await experience
    .locator('[data-about-hero] p')
    .filter({ hasText: 'Techwise IQ turns business bottlenecks' })
    .boundingBox()
  const whatsappBox = await page
    .getByRole('link', { name: 'Chat on WhatsApp' })
    .boundingBox()
  expect(heroBodyBox).not.toBeNull()
  expect(whatsappBox).not.toBeNull()

  const intersects =
    heroBodyBox!.x < whatsappBox!.x + whatsappBox!.width &&
    heroBodyBox!.x + heroBodyBox!.width > whatsappBox!.x &&
    heroBodyBox!.y < whatsappBox!.y + whatsappBox!.height &&
    heroBodyBox!.y + heroBodyBox!.height > whatsappBox!.y
  expect(intersects).toBe(false)
  expect(
    whatsappBox!.y - (heroBodyBox!.y + heroBodyBox!.height),
  ).toBeGreaterThanOrEqual(8)
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

test('keeps each desktop culture beat in the sticky viewport', async ({
  page,
}) => {
  const viewport = { width: 1440, height: 1000 }
  await page.setViewportSize(viewport)
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/about')

  const experience = page.getByTestId('about-experience')
  await expect(experience).toHaveAttribute('data-motion', 'active')
  const culture = experience.locator('[data-about-culture]')
  const panels = culture.locator('[data-about-culture-panel]')
  const panelsWrapper = culture.locator('[data-about-culture-panels]')
  const cultureRange = await culture.evaluate((element) => {
    const rect = element.getBoundingClientRect()
    return {
      start: rect.top + window.scrollY,
      distance: Math.max(rect.height - window.innerHeight, 1),
    }
  })
  const wrapperTops: number[] = []

  for (const [activeIndex, progress] of [0.02, 0.5, 0.98].entries()) {
    await page.evaluate(
      (y) => window.scrollTo(0, y),
      cultureRange.start + cultureRange.distance * progress,
    )
    await expect
      .poll(() =>
        panels.evaluateAll((elements) => {
          const opacities = elements.map((element) =>
            Number.parseFloat(getComputedStyle(element).opacity),
          )
          return opacities.indexOf(Math.max(...opacities))
        }),
      )
      .toBe(activeIndex)

    const opacities = await panels.evaluateAll((elements) =>
      elements.map((element) =>
        Number.parseFloat(getComputedStyle(element).opacity),
      ),
    )
    expect(opacities[activeIndex]).toBeGreaterThanOrEqual(0.8)
    expect(
      Math.max(...opacities.filter((_, index) => index !== activeIndex)),
    ).toBeLessThanOrEqual(0.2)

    const wrapperBox = await panelsWrapper.boundingBox()
    expect(wrapperBox).not.toBeNull()
    expect(wrapperBox!.y).toBeGreaterThanOrEqual(0)
    expect(wrapperBox!.y + wrapperBox!.height).toBeLessThanOrEqual(
      viewport.height,
    )
    wrapperTops.push(wrapperBox!.y)
  }

  expect(Math.max(...wrapperTops) - Math.min(...wrapperTops)).toBeLessThanOrEqual(
    2,
  )
})

test('uses accessible ink text on the hot CTA', async ({ page }) => {
  await page.goto('/about')

  const cta = page.getByTestId('about-experience').getByRole('link', {
    name: /bring us the business problem/i,
  })
  await expect(cta).toHaveCSS('color', 'rgb(16, 16, 16)')
  await expect(cta).toHaveCSS('background-color', 'rgb(255, 77, 0)')
})

test('keeps both heading accents above large-text AA contrast', async ({
  page,
}) => {
  await page.goto('/about')

  const accents = await page
    .getByTestId('about-experience')
    .locator('[data-about-hero] h1 em, [data-about-closing] h2 em')
    .evaluateAll((elements) => {
      const parseColor = (color: string) => {
        const channels = color.match(/[\d.]+/g)?.map(Number)
        if (!channels || channels.length < 3) {
          throw new Error(`Unable to parse color: ${color}`)
        }
        return [...channels.slice(0, 3), channels[3] ?? 1]
      }
      const luminance = (channels: number[]) => {
        const [red, green, blue] = channels.slice(0, 3).map((channel) => {
          const value = channel / 255
          return value <= 0.04045
            ? value / 12.92
            : ((value + 0.055) / 1.055) ** 2.4
        })
        return 0.2126 * red + 0.7152 * green + 0.0722 * blue
      }

      return elements.map((element) => {
        const foreground = getComputedStyle(element).color
        let background = 'rgba(0, 0, 0, 0)'
        let ancestor: Element | null = element
        while (ancestor) {
          const candidate = getComputedStyle(ancestor).backgroundColor
          if (parseColor(candidate)[3] > 0) {
            background = candidate
            break
          }
          ancestor = ancestor.parentElement
        }

        const foregroundLuminance = luminance(parseColor(foreground))
        const backgroundLuminance = luminance(parseColor(background))
        const ratio =
          (Math.max(foregroundLuminance, backgroundLuminance) + 0.05) /
          (Math.min(foregroundLuminance, backgroundLuminance) + 0.05)

        return {
          background,
          foreground,
          label: element.closest('[data-about-hero]') ? 'hero' : 'closing',
          ratio,
        }
      })
    })

  expect(accents).toHaveLength(2)
  for (const accent of accents) {
    expect.soft(
      accent.ratio,
      `${accent.label} accent ${accent.foreground} on ${accent.background}`,
    ).toBeGreaterThanOrEqual(3)
  }
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
  await expect
    .poll(() =>
      fragment.evaluate((element) => getComputedStyle(element).transform),
    )
    .not.toBe(before)
})

test('progresses the desktop underline monotonically through the hero', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/about')
  await page.evaluate(() => window.scrollTo(0, 0))

  const experience = page.getByTestId('about-experience')
  const readUnderline = () =>
    experience.evaluate((element) =>
      Number.parseFloat(
        getComputedStyle(element).getPropertyValue('--about-underline'),
      ),
    )

  await expect
    .poll(async () => Math.abs((await readUnderline()) - 0.12))
    .toBeLessThanOrEqual(0.03)
  const top = await readUnderline()

  const heroRange = await experience.locator('[data-about-hero]').evaluate(
    (hero) => {
      const rect = hero.getBoundingClientRect()
      const start = rect.top + window.scrollY
      const distance = Math.max(rect.height - window.innerHeight, 1)
      return {
        middle: start + distance * 0.5,
        end: start + distance,
      }
    },
  )

  await page.evaluate((y) => window.scrollTo(0, y), heroRange.middle)
  await expect
    .poll(async () => {
      const value = await readUnderline()
      return value > 0.12 && value < 1
    })
    .toBe(true)
  const middle = await readUnderline()

  await page.evaluate((y) => window.scrollTo(0, y + 4), heroRange.end)
  await expect
    .poll(async () => Math.abs((await readUnderline()) - 1))
    .toBeLessThanOrEqual(0.03)
  const end = await readUnderline()

  expect(middle).toBeGreaterThanOrEqual(top)
  expect(end).toBeGreaterThanOrEqual(middle)
})

test('cleans up and reapplies About motion when preference changes', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/about')

  const experience = page.getByTestId('about-experience')
  const panels = experience.locator('[data-about-culture-panel]')
  const animatedElements = experience.locator(
    '[data-about-fragment], [data-about-path], [data-about-culture-panel], [data-about-closing-content]',
  )
  const fragment = experience.locator('[data-about-fragment]').first()
  const readUnderline = () =>
    experience.evaluate((element) =>
      Number.parseFloat(
        getComputedStyle(element).getPropertyValue('--about-underline'),
      ),
    )

  await expect(experience).toHaveAttribute('data-motion', 'active')
  await page.evaluate(() => window.scrollTo(0, window.innerHeight * 0.35))
  await expect
    .poll(() =>
      experience.evaluate(
        (element) => element.style.getPropertyValue('--about-underline') !== '',
      ),
    )
    .toBe(true)
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect(experience).toHaveAttribute('data-motion', 'reduced')
  await expect(experience.locator('[data-about-fragment-field]')).toHaveCSS(
    'display',
    'none',
  )
  await expect
    .poll(() =>
      experience.evaluate((element) =>
        element.style.getPropertyValue('--about-underline'),
      ),
    )
    .toBe('')
  await expect
    .poll(() =>
      experience.evaluate((element) =>
        getComputedStyle(element).getPropertyValue('--about-underline').trim(),
      ),
    )
    .toBe('1')
  await expect
    .poll(() =>
      panels.evaluateAll((elements) =>
        elements.every(
          (element) => getComputedStyle(element).opacity === '1',
        ),
      ),
    )
    .toBe(true)
  await expect
    .poll(() =>
      animatedElements.evaluateAll((elements) =>
        elements.every((element) => {
          const style = (element as HTMLElement).style
          return style.transform === '' && style.opacity === ''
        }),
      ),
    )
    .toBe(true)

  await page.evaluate(() => window.scrollTo(0, 0))
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await expect(experience).toHaveAttribute('data-motion', 'active')
  await expect
    .poll(async () => Math.abs((await readUnderline()) - 0.12))
    .toBeLessThanOrEqual(0.03)

  const before = await fragment.evaluate(
    (element) => getComputedStyle(element).transform,
  )
  await page.evaluate(() => window.scrollTo(0, window.innerHeight * 0.35))
  await expect
    .poll(() =>
      fragment.evaluate((element) => getComputedStyle(element).transform),
    )
    .not.toBe(before)
})

test('rebuilds About motion across the desktop breakpoint', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/about')

  const experience = page.getByTestId('about-experience')
  const cultureStage = experience.locator('[data-about-culture] > div')
  const panels = experience.locator('[data-about-culture-panel]')
  const panelsWrapper = experience.locator('[data-about-culture-panels]')

  await expect(experience).toHaveAttribute('data-motion', 'active')
  await expect(cultureStage).toHaveCSS('position', 'sticky')

  await page.setViewportSize({ width: 768, height: 900 })
  await expect
    .poll(() =>
      cultureStage.evaluate(
        (element) => getComputedStyle(element).position,
      ),
    )
    .toBe('relative')

  const mobilePanelOffsets = await panels.evaluateAll((elements) =>
    elements.map((element) => (element as HTMLElement).offsetTop),
  )
  expect(mobilePanelOffsets[1]).toBeGreaterThan(mobilePanelOffsets[0])
  expect(mobilePanelOffsets[2]).toBeGreaterThan(mobilePanelOffsets[1])
  for (const panel of await panels.all()) {
    await panel.scrollIntoViewIfNeeded()
    await expect
      .poll(() =>
        panel.evaluate(
          (element) => Number.parseFloat(getComputedStyle(element).opacity),
        ),
      )
      .toBeGreaterThan(0.95)
  }

  await page.setViewportSize({ width: 1440, height: 1000 })
  await expect(experience).toHaveAttribute('data-motion', 'active')
  await expect
    .poll(() =>
      cultureStage.evaluate(
        (element) => getComputedStyle(element).position,
      ),
    )
    .toBe('sticky')
  await expect
    .poll(() =>
      panelsWrapper.evaluate(
        (element) =>
          (element as HTMLElement).clientWidth > 0 &&
          (element as HTMLElement).clientHeight > 0,
      ),
    )
    .toBe(true)
  await expect
    .poll(() =>
      panels.evaluateAll((elements) =>
        elements.every(
          (element) =>
            (element as HTMLElement).offsetWidth > 0 &&
            (element as HTMLElement).offsetHeight > 0,
        ),
      ),
    )
    .toBe(true)
})

test('remounts one active About experience after client navigation', async ({
  page,
}) => {
  const pageErrors: Error[] = []
  page.on('pageerror', (error) => pageErrors.push(error))

  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/about')

  const experience = page.getByTestId('about-experience')
  await expect(experience).toHaveCount(1)
  await expect(experience).toHaveAttribute('data-motion', 'active')

  await page
    .getByRole('link', { name: 'Services', exact: true })
    .first()
    .click()
  await expect(page).toHaveURL(/\/services$/)
  await page.goBack()
  await expect(page).toHaveURL(/\/about$/)

  await expect(experience).toHaveCount(1)
  await expect(experience).toHaveAttribute('data-motion', 'active')
  await page.evaluate(() => window.scrollTo(0, 0))
  const fragment = experience.locator('[data-about-fragment]').first()
  const before = await fragment.evaluate(
    (element) => getComputedStyle(element).transform,
  )
  await page.evaluate(() => window.scrollTo(0, window.innerHeight * 0.35))
  await expect
    .poll(() =>
      fragment.evaluate((element) => getComputedStyle(element).transform),
    )
    .not.toBe(before)

  expect(pageErrors).toHaveLength(0)
})
