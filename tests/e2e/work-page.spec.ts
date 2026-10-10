import { expect, test } from '@playwright/test'
import { scrollIntoViewHeld } from './helpers'

test.describe('Work proof archive (immersive)', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/work')
  })

  test('leads with real client work, then a labelled concept lab', async ({
    page,
  }) => {
    const experience = page.getByTestId('work-experience')
    await expect(experience).toBeVisible()

    // Real client work is dominant and comes first.
    await expect(page.getByTestId('featured-project-rail')).toBeVisible()
    await expect(page.locator('[data-featured-project]')).toHaveCount(3)
    await expect(page.locator('[data-client-project]')).toHaveCount(5)

    // Concept Lab is a separate, clearly-labelled self-initiated exhibition.
    const lab = page.getByTestId('concept-lab')
    await expect(page.getByTestId('concept-exhibition')).toBeVisible()
    await expect(page.locator('[data-concept-stage]')).toHaveCount(3)
    await expect(
      lab.getByText('Concept work — not client commissions'),
    ).toBeVisible()
  })

  test('presents real work, delivery proof, concepts, and working style', async ({
    page,
  }) => {
    await expect(
      page.getByRole('heading', { level: 1, name: 'Proof, not promises.' }),
    ).toHaveCount(1)
    await expect(
      page.getByRole('heading', { level: 2, name: 'Live client sites.' }),
    ).toBeVisible()

    await expect(
      page.getByRole('heading', { level: 4, name: 'AASKRA Realty' }),
    ).toBeVisible()
    await expect(
      page.getByRole('heading', { level: 3, name: 'Express Trade Financing' }),
    ).toBeVisible()

    // Delivery totals derived from the real case-study data.
    // Totals count live sites only; previews are shown but never counted.
    const totals = page.getByLabel('Published work totals')
    await expect(totals.getByText('114', { exact: true })).toBeVisible()
    await expect(totals.getByText('Pages shipped', { exact: true })).toBeVisible()
    await expect(totals.locator('div', { hasText: 'Live client sites' }).locator('dd')).toHaveText('3')
    await expect(totals.locator('dt')).toHaveText([
      'Live client sites',
      'Pages shipped',
      'Weeks, brief to launch',
    ])

    // Live cards show the client-reported result; preview builds never do.
    await expect(
      page.locator('[data-featured-project]').getByText('Client-reported'),
    ).toHaveCount(3)
    await expect(
      page.getByTestId('more-client-work').getByText('Client-reported'),
    ).toHaveCount(0)

    await expect(
      page.getByRole('heading', {
        level: 2,
        name: 'What else could we build?',
      }),
    ).toBeVisible()
    await expect(
      page.getByText(
        'Sites we built for ourselves to try new looks, industries and ideas.',
      ),
    ).toBeVisible()
    await expect(page.getByText('Brief pending', { exact: true })).toHaveCount(
      0,
    )

    await expect(
      page.getByRole('heading', {
        level: 2,
        name: 'Clear from kickoff to launch.',
      }),
    ).toBeVisible()
  })

  test('links both projects to stable case-study pages', async ({ page }) => {
    await expect(
      page.getByRole('link', { name: /Read full case study.*AASKRA Realty/i }),
    ).toHaveAttribute('href', '/work/aaskra-realty')
    await expect(
      page.getByRole('link', {
        name: /Read full case study.*Express Trade Financing/,
      }),
    ).toHaveAttribute('href', '/work/express-trade-financing')
  })

  test('publishes a live-site action only for reachable project domains', async ({
    page,
  }) => {
    // AASKRA has no public live URL — no live-site link on the card.
    await expect(
      page.getByRole('link', {
        name: /Visit live site.*AASKRA Realty/,
      }),
    ).toHaveCount(0)

    const etfLive = page.getByRole('link', {
      name: /Visit live site.*Express Trade Financing.*opens in a new tab/,
    })
    await expect(etfLive).toHaveAttribute(
      'href',
      'https://www.expresstradefinancing.ae',
    )
    await expect(etfLive).toHaveAttribute('target', '_blank')
  })

  test('lists preview builds after the featured rail, never as live', async ({
    page,
  }) => {
    const more = page.getByTestId('more-client-work')
    await expect(more).toBeVisible()
    const railFirst = await page.evaluate(() => {
      const rail = document.querySelector('[data-testid="featured-project-rail"]')
      const list = document.querySelector('[data-testid="more-client-work"]')
      return Boolean(
        rail && list && rail.compareDocumentPosition(list) & Node.DOCUMENT_POSITION_FOLLOWING,
      )
    })
    expect(railFirst).toBe(true)

    await expect(more.getByRole('heading', { level: 4 })).toHaveText([
      'AASKRA Realty',
      'RSiGHT Architectural Lighting',
    ])
    const rsight = more.locator('[data-more-project]').nth(1)
    await expect(rsight.locator('[data-project-status]')).toHaveAttribute(
      'data-project-status',
      'awaiting-launch',
    )
    await expect(rsight.locator('[data-project-status]')).toHaveText('Awaiting launch')
    await expect(
      more.getByRole('link', { name: /View preview.*RSiGHT.*opens in a new tab/ }),
    ).toHaveAttribute('href', 'https://rsight-opal.vercel.app')
    await expect(more.getByRole('link', { name: /Visit live site/ })).toHaveCount(0)
  })

  test('publishes all three live concept samples', async ({ page }) => {
    const lab = page.getByTestId('concept-lab')
    const slots = lab.locator('[data-concept-stage]')
    await expect(slots).toHaveCount(3)
    await expect(slots.nth(0)).toHaveAttribute(
      'data-concept-status',
      'published',
    )
    await expect(slots.nth(1)).toHaveAttribute(
      'data-concept-status',
      'published',
    )
    await expect(slots.nth(2)).toHaveAttribute(
      'data-concept-status',
      'published',
    )
    await expect(
      slots.nth(0).getByRole('heading', { name: 'TerraElix' }),
    ).toBeVisible()
    await expect(
      slots.nth(0).getByRole('link', {
        name: 'Open the live demo: TerraElix (opens in a new tab)',
      }),
    ).toHaveAttribute('href', '/concepts/terra-elix/index.html')
    await expect(
      slots.nth(1).getByRole('link', {
        name: 'Open the live demo: mėntality (opens in a new tab)',
      }),
    ).toHaveAttribute('href', '/concepts/mentality/index.html')
    await expect(
      slots.nth(2).getByRole('link', {
        name: 'Open the live demo: Lumora (opens in a new tab)',
      }),
    ).toHaveAttribute('href', '/concepts/lumora/index.html')
    await expect(page.getByText('Brief pending', { exact: true })).toHaveCount(
      0,
    )
    await expect(slots.nth(1).getByText('Glass UI')).toBeVisible()
    await expect(slots.nth(2).getByText('Ambient video')).toBeVisible()
  })

  test('loads the mėntality live preview in its second stage', async ({
    page,
  }) => {
    const stage = page.locator('[data-concept-stage]').nth(1)
    await stage.scrollIntoViewIfNeeded()
    const frame = stage.locator('iframe')
    await expect(frame).toHaveAttribute('src', '/concepts/mentality/index.html')
    await expect(frame).toHaveAttribute('data-preview-state', 'ready')
  })

  test('runs the TerraElix live preview and respects reduced motion', async ({
    page,
  }) => {
    const stage = page.locator('[data-concept-stage]').first()
    await stage.scrollIntoViewIfNeeded()
    const frame = stage.locator('iframe')
    await expect(frame).toHaveAttribute(
      'src',
      '/concepts/terra-elix/index.html',
    )
    await expect(frame).toHaveAttribute('data-preview-state', 'ready')
    const reducedY = await frame.evaluate(
      (node: HTMLIFrameElement) => node.contentWindow?.scrollY ?? -1,
    )
    await page.waitForTimeout(1_200)
    expect(
      await frame.evaluate(
        (node: HTMLIFrameElement) => node.contentWindow?.scrollY ?? -1,
      ),
    ).toBe(reducedY)

    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await page.reload()
    const activeStage = page.locator('[data-concept-stage]').first()
    // After reload Lenis can carry the native jump away from the demo, so its
    // observer never sees it and it never starts scrolling (CI flake, 7.6).
    await scrollIntoViewHeld(activeStage)
    const activeFrame = activeStage.locator('iframe')
    await expect(activeFrame).toHaveAttribute('data-preview-state', 'ready')
    await expect
      .poll(
        () =>
          activeFrame.evaluate(
            (node: HTMLIFrameElement) => node.contentWindow?.scrollY ?? 0,
          ),
        {
          // The live iframe competes with the responsive matrix in a full run;
          // allow its observer and first auto-scroll frame to settle under load.
          timeout: 12_000,
        },
      )
      .toBeGreaterThan(0)

    // Scroll the concept stage well offscreen (page top) — it must pause.
    // Lenis smooths the native jump, so wait until the page is really at the
    // top before sampling (same fix as performance-mobile.spec.ts).
    await expect
      .poll(() => page.evaluate(() => (window.scrollTo(0, 0), window.scrollY)))
      .toBe(0)
    await page.waitForTimeout(400)
    const pausedY = await activeFrame.evaluate(
      (node: HTMLIFrameElement) => node.contentWindow?.scrollY ?? -1,
    )
    await page.waitForTimeout(1_200)
    const offscreenY = await activeFrame.evaluate(
      (node: HTMLIFrameElement) => node.contentWindow?.scrollY ?? -1,
    )
    expect(Math.abs(offscreenY - pausedY)).toBeLessThanOrEqual(1)
  })
})

test('keeps the full-demo action usable when a preview cannot load', async ({
  page,
}) => {
  await page.route('**/concepts/terra-elix/index.html', (route) =>
    route.abort(),
  )
  await page.goto('/work')
  const stage = page.locator('[data-concept-stage]').first()
  await stage.scrollIntoViewIfNeeded()
  await expect(stage.getByText('Preview unavailable')).toBeVisible({
    timeout: 11_500,
  })
  await expect(
    stage.getByRole('link', {
      name: 'Open the live demo: TerraElix (opens in a new tab)',
    }),
  ).toHaveAttribute('href', '/concepts/terra-elix/index.html')
})

test('keeps the work page inside a 375px viewport', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/work')

  const overflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth -
      document.documentElement.clientWidth,
  )
  expect(overflow).toBeLessThanOrEqual(1)

  const firstProject = page.locator('[data-client-project]').first()
  const imageBox = await firstProject.locator('img').boundingBox()
  const headingBox = await firstProject
    .getByRole('heading', { level: 3 })
    .boundingBox()
  expect(imageBox).not.toBeNull()
  expect(headingBox).not.toBeNull()
  // Image leads the story on a stacked mobile card.
  expect(imageBox!.y).toBeLessThan(headingBox!.y)
})
