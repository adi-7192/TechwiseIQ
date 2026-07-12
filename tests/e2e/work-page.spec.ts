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
    await expect(page.getByRole('article')).toHaveCount(2)
    await expect(page.getByText('21', { exact: true })).toBeVisible()
    await expect(page.getByText('Pages shipped', { exact: true })).toBeVisible()
    await expect(
      page.getByRole('heading', {
        level: 2,
        name: 'What else could we build?',
      }),
    ).toBeVisible()
    await expect(page.getByText('Brief pending', { exact: true })).toHaveCount(3)
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
      page.getByRole('link', { name: /Read AASKRA Realty case study/ }),
    ).toHaveAttribute('href', '/work/aaskra-realty')
    await expect(
      page.getByRole('link', {
        name: /Read Express Trade Financing case study/,
      }),
    ).toHaveAttribute('href', '/work/express-trade-financing')

    await expect(
      page.getByRole('link', {
        name: 'Discuss your project (opens in a new tab)',
      }),
    ).toHaveAttribute('target', '_blank')
  })

  test('draft concept slots are honest and non-interactive', async ({ page }) => {
    const lab = page.getByTestId('concept-lab')
    await expect(lab.getByRole('link')).toHaveCount(0)
    const draftSlots = lab.locator('[data-concept-status="draft"]')
    await expect(draftSlots).toHaveCount(3)
    await expect(draftSlots).toContainText([
      'Demo slot 01',
      'Demo slot 02',
      'Demo slot 03',
    ])
    await expect(
      lab.getByText('Concept work — not client commissions'),
    ).toBeVisible()
  })
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
