import { expect, test } from '@playwright/test'

/**
 * The immersive homepage: a persistent-scene hero, four capability chapters
 * (each with a static, interactive proof object), real selected work, the
 * operating model, and a final CTA. Static-first with progressive motion, so
 * the full experience remains present under reduced motion and without JavaScript.
 */

test.describe('Immersive homepage', () => {
  test('renders the hero and four capability chapters', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')
    const main = page.locator('main#main')

    // Hero — the single page h1 and both hero CTAs.
    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      'moves the work.',
    )
    await expect(
      main.getByRole('link', { name: /Bring us the bottleneck/i }),
    ).toHaveAttribute('href', '/contact')
    await expect(
      main.getByRole('link', { name: 'See the work' }),
    ).toHaveAttribute('href', '/work')

    // Studio framing statement.
    await expect(
      main.getByRole('heading', { name: /business friction\./i }),
    ).toBeVisible()

    // Four capability chapters, each linking to the right service page.
    const chapters = [
      {
        id: '#websites',
        link: 'Explore web development',
        href: '/services/web',
      },
      {
        id: '#automation',
        link: 'Explore AI automation',
        href: '/services/ai',
      },
      {
        id: '#apps',
        link: 'Explore custom software',
        href: '/services/software',
      },
      { id: '#advisory', link: 'Explore AI services', href: '/services/ai' },
    ] as const

    for (const chapter of chapters) {
      await expect(main.locator(chapter.id)).toBeVisible()
      await expect(
        main.getByRole('link', { name: chapter.link }),
      ).toHaveAttribute('href', chapter.href)
    }

    // Each chapter carries one honest, illustrative proof object.
    await expect(main.getByText('Illustrative', { exact: true })).toHaveCount(4)
  })

  test('keeps chapter navigation native, compact, and synchronized to scroll', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 900 })
    await page.goto('/')

    const nav = page.getByRole('navigation', { name: 'Page chapters' })
    await expect(nav).toBeVisible()
    await expect(nav.getByRole('link')).toHaveCount(5)
    await expect(nav.getByRole('link', { name: 'Intro' })).toHaveAttribute(
      'href',
      '#top',
    )
    await expect(nav.getByRole('link', { name: 'Automation' })).toHaveAttribute(
      'href',
      '#automation',
    )

    await page.locator('#automation').scrollIntoViewIfNeeded()
    await expect(nav.getByRole('link', { name: 'Automation' })).toHaveAttribute(
      'aria-current',
      'location',
    )
    expect(await page.evaluate(() => window.scrollX)).toBe(0)
  })

  test('removes enhanced motion when reduced motion is requested', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')

    await expect(page.locator('[data-home-experience]')).toHaveAttribute(
      'data-home-motion',
      'reduced',
    )
    await expect(page.locator('[data-home-reveal]').first()).toBeVisible()
  })

  test('leads with real work and the operating model', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')
    const main = page.locator('main#main')

    await expect(
      main.getByRole('heading', { name: 'Real projects, shipped.' }),
    ).toBeVisible()
    await expect(
      page.getByRole('navigation', { name: 'Page chapters' }),
    ).toBeVisible()
    await expect(
      main.getByRole('link', { name: /AASKRA Realty/ }).first(),
    ).toHaveAttribute('href', '/work/aaskra-realty')
    await expect(
      main.getByRole('link', { name: /Express Trade Financing/ }).first(),
    ).toHaveAttribute('href', '/work/express-trade-financing')
    await expect(
      main.getByRole('link', { name: 'See all work' }),
    ).toHaveAttribute('href', '/work')

    // Operating model — the studio's four promises.
    await expect(
      main.getByRole('heading', { name: 'Small studio. Legible process.' }),
    ).toBeVisible()
    for (const promise of [
      'Written scope',
      'Weekly demos',
      'Direct access',
      'Clean ownership',
    ]) {
      await expect(main.getByText(promise, { exact: true })).toBeVisible()
    }

    // Final CTA preserves the real contact destinations.
    await expect(
      main.getByRole('link', { name: 'Start a project' }),
    ).toHaveAttribute('href', '/contact')
    await expect(main.getByRole('link', { name: 'WhatsApp' })).toHaveAttribute(
      'href',
      'https://wa.me/971567760667',
    )
    await expect(
      main.getByRole('link', { name: /techwiseiqtechnologies\.ae/i }),
    ).toHaveAttribute('href', /^mailto:/)
  })

  for (const viewport of [
    { width: 375, height: 812 },
    { width: 768, height: 1024 },
    { width: 1440, height: 1000 },
  ]) {
    test(`stays inside the ${viewport.width}px viewport with accessible CTAs`, async ({
      page,
    }) => {
      await page.setViewportSize(viewport)
      await page.emulateMedia({ reducedMotion: 'reduce' })
      await page.goto('/')

      const overflow = await page.evaluate(
        () =>
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth,
      )
      expect(overflow).toBeLessThanOrEqual(1)

      // Hero pill CTAs meet the 44px tap target.
      const heroCtas = page
        .locator('main#main')
        .getByRole('link', { name: /Bring us the bottleneck|See the work/ })
      for (const cta of await heroCtas.all()) {
        const box = await cta.boundingBox()
        expect(box).not.toBeNull()
        expect(box!.height).toBeGreaterThanOrEqual(44)
        expect(box!.x).toBeGreaterThanOrEqual(0)
        expect(box!.x + box!.width).toBeLessThanOrEqual(viewport.width + 1)
      }

      if (viewport.width === 375) {
        const chapterNav = await page
          .getByRole('navigation', { name: 'Page chapters' })
          .boundingBox()
        const whatsapp = await page
          .getByRole('link', { name: /WhatsApp/i })
          .last()
          .boundingBox()
        expect(chapterNav).not.toBeNull()
        expect(whatsapp).not.toBeNull()
        const controlsOverlap = !(
          chapterNav!.x + chapterNav!.width <= whatsapp!.x ||
          whatsapp!.x + whatsapp!.width <= chapterNav!.x ||
          chapterNav!.y + chapterNav!.height <= whatsapp!.y ||
          whatsapp!.y + whatsapp!.height <= chapterNav!.y
        )
        expect(controlsOverlap).toBe(false)
      }
    })
  }

  test('serves the critical experience without JavaScript', async ({
    browser,
  }) => {
    const context = await browser.newContext({ javaScriptEnabled: false })
    const page = await context.newPage()
    await page.goto('/')
    const main = page.locator('main#main')

    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await expect(main.locator('#websites')).toBeVisible()
    await expect(main.locator('#advisory')).toBeVisible()
    await expect(main.getByText('Illustrative', { exact: true })).toHaveCount(4)
    await expect(
      main.getByRole('heading', { name: 'Real projects, shipped.' }),
    ).toBeVisible()

    const noOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    )
    expect(noOverflow).toBe(true)

    await context.close()
  })
})
