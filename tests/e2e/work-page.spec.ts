import { expect, test } from '@playwright/test'

test.describe('Work credibility page', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/work')
  })

  test('renders a continuous client and concept exhibition', async ({
    page,
  }) => {
    const experience = page.getByTestId('work-experience')

    await expect(experience).toHaveAttribute('data-motion', 'reduced')
    await expect(page.getByTestId('featured-project-rail')).toBeVisible()
    await expect(page.locator('[data-featured-project]')).toHaveCount(2)
    await expect(page.getByTestId('project-index')).toHaveCount(0)
    await expect(page.getByTestId('concept-exhibition')).toBeVisible()
    await expect(page.locator('[data-concept-stage]')).toHaveCount(3)
    await expect(
      page.locator('[data-work-reveal][data-visible="true"]'),
    ).not.toHaveCount(0)
  })

  test('enhances motion progressively and exposes the reduced fallback', async ({
    page,
  }) => {
    await expect(page.getByTestId('work-experience')).toHaveAttribute(
      'data-motion',
      'reduced',
    )
    await expect(
      page.locator('[data-work-reveal]:not([data-visible="true"])'),
    ).toHaveCount(0)

    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await page.reload()
    await expect(page.getByTestId('work-experience')).toHaveAttribute(
      'data-motion',
      'active',
    )

    await page.emulateMedia({ reducedMotion: 'reduce' })
    await expect(page.getByTestId('work-experience')).toHaveAttribute(
      'data-motion',
      'reduced',
    )
    await expect(
      page.locator('[data-work-reveal]:not([data-visible="true"])'),
    ).toHaveCount(0)
  })

  test('presents real work, delivery proof, concepts, and working style', async ({
    page,
  }) => {
    await expect(
      page.getByRole('heading', { level: 1, name: 'Proof, not promises.' }),
    ).toHaveCount(1)
    await expect(
      page.getByRole('heading', {
        level: 2,
        name: 'Built for real business.',
      }),
    ).toBeVisible()
    await expect(page.locator('[data-client-project]')).toHaveCount(2)
    await expect(page.getByText('21', { exact: true })).toBeVisible()
    await expect(page.getByText('Pages shipped', { exact: true })).toBeVisible()
    await expect(
      page.getByRole('heading', {
        level: 2,
        name: 'What else could we build?',
      }),
    ).toBeVisible()
    await expect(
      page.getByText(
        'Live coded website explorations across industries, visual languages and interaction patterns.',
      ),
    ).toBeVisible()
    await expect(page.getByText('Brief pending', { exact: true })).toHaveCount(0)
    await expect(
      page.getByRole('heading', {
        level: 2,
        name: 'Clear from kickoff to launch.',
      }),
    ).toBeVisible()
    await expect(
      page.getByRole('heading', { level: 2, name: 'Bring us the problem.' }),
    ).toBeVisible()
  })

  test('links both projects to stable case-study pages', async ({ page }) => {
    await expect(
      page.getByRole('link', {
        name: /Read full case study.*AASKRA Realty/,
      }),
    ).toHaveAttribute('href', '/work/aaskra-realty')
    await expect(
      page.getByRole('link', {
        name: /Read full case study.*Express Trade Financing/,
      }),
    ).toHaveAttribute('href', '/work/express-trade-financing')

    await expect(
      page.getByRole('link', {
        name: 'Discuss your project (opens in a new tab)',
      }),
    ).toHaveAttribute('target', '_blank')
  })

  test('publishes live-site actions only for reachable project domains', async ({
    page,
  }) => {
    await page.goto('/work/aaskra-realty')
    await expect(
      page.getByRole('link', {
        name: 'Visit the AASKRA Realty live site (opens in a new tab)',
      }),
    ).toHaveCount(0)

    await page.goto('/work/express-trade-financing')
    const liveSite = page.getByRole('link', {
      name: 'Visit the Express Trade Financing live site (opens in a new tab)',
    })
    await expect(liveSite).toHaveAttribute(
      'href',
      'https://www.expresstradefinancing.ae',
    )
    await expect(liveSite).toHaveAttribute('target', '_blank')
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
        name: 'Open TerraElix live HTML demo (opens in a new tab)',
      }),
    ).toHaveAttribute('href', '/concepts/terra-elix/index.html')
    await expect(
      slots.nth(1).getByRole('link', {
        name: 'Open mėntality live HTML demo (opens in a new tab)',
      }),
    ).toHaveAttribute('href', '/concepts/mentality/index.html')
    await expect(
      slots.nth(2).getByRole('link', {
        name: 'Open Lumora live HTML demo (opens in a new tab)',
      }),
    ).toHaveAttribute('href', '/concepts/lumora/index.html')
    await expect(page.getByText('Brief pending', { exact: true })).toHaveCount(0)
    await expect(slots.nth(1).getByText('Glass UI')).toBeVisible()
    await expect(slots.nth(2).getByText('Ambient video')).toBeVisible()
    await expect(
      lab.getByText('Concept work — not client commissions'),
    ).toBeVisible()
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

  test('loads the Lumora live preview in its third stage', async ({ page }) => {
    const stage = page.locator('[data-concept-stage]').nth(2)
    await stage.scrollIntoViewIfNeeded()
    const frame = stage.locator('iframe')
    await expect(frame).toHaveAttribute('src', '/concepts/lumora/index.html')
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
    await activeStage.scrollIntoViewIfNeeded()
    const activeFrame = activeStage.locator('iframe')
    await expect(activeFrame).toHaveAttribute('data-preview-state', 'ready')
    await expect
      .poll(() =>
        activeFrame.evaluate(
          (node: HTMLIFrameElement) => node.contentWindow?.scrollY ?? 0,
        ),
      )
      .toBeGreaterThan(0)

    await page.getByTestId('featured-project-rail').scrollIntoViewIfNeeded()
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
  await page.route('**/concepts/terra-elix/index.html', (route) => route.abort())
  await page.goto('/work')
  const stage = page.locator('[data-concept-stage]').first()
  await stage.scrollIntoViewIfNeeded()
  await expect(stage.getByText('Preview unavailable')).toBeVisible({
    timeout: 11_500,
  })
  await expect(
    stage.getByRole('link', {
      name: 'Open TerraElix live HTML demo (opens in a new tab)',
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

  const firstArticle = page.getByRole('article').first()
  const imageBox = await firstArticle.locator('img').boundingBox()
  const headingBox = await firstArticle
    .getByRole('heading', { level: 3 })
    .boundingBox()
  expect(imageBox).not.toBeNull()
  expect(headingBox).not.toBeNull()
  expect(imageBox!.y).toBeLessThan(headingBox!.y)
})
