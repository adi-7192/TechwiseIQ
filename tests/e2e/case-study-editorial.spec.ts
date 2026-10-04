import { expect, test } from '@playwright/test'

const CASES = [
  {
    slug: 'supreme-universal',
    title: 'Supreme Universal Trading',
    storyTitle: 'Forty-nine commodities, one clear route.',
    proof: ['76', '49', '3 wks'],
    decisionCount: 5,
    nextTitle: 'AASKRA Realty',
    nextHref: '/work/aaskra-realty',
    status: 'Live',
  },
  {
    slug: 'aaskra-realty',
    title: 'AASKRA Realty',
    storyTitle: 'Trust before track record.',
    proof: ['11', '6', '6 wks'],
    decisionCount: 5,
    nextTitle: 'Express Trade Financing',
    nextHref: '/work/express-trade-financing',
    status: 'Preview build',
  },
  {
    slug: 'express-trade-financing',
    title: 'Express Trade Financing',
    storyTitle: 'Institutional weight, without the institution.',
    proof: ['USD 200M+', '25+', '5 wks'],
    decisionCount: 5,
    nextTitle: 'Express Petroleum',
    nextHref: '/work/express-petroleum',
    status: 'Live',
  },
  {
    slug: 'express-petroleum',
    title: 'Express Petroleum',
    storyTitle: 'From specification to enquiry.',
    proof: ['28', '14', '3 wks'],
    decisionCount: 5,
    nextTitle: 'RSiGHT Architectural Lighting',
    nextHref: '/work/rsight',
    status: 'Live',
  },
  {
    slug: 'rsight',
    title: 'RSiGHT Architectural Lighting',
    storyTitle: 'Work that only shows at night.',
    proof: ['6', '3', '3 wks'],
    decisionCount: 4,
    nextTitle: 'Supreme Universal Trading',
    nextHref: '/work/supreme-universal',
    status: 'Awaiting launch',
  },
] as const

test.describe('Immersive case studies', () => {
  for (const caseStudy of CASES) {
    test(`${caseStudy.title} renders the full evidence page`, async ({
      page,
    }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' })
      await page.goto(`/work/${caseStudy.slug}`)

      const experience = page.getByTestId('case-study-experience')
      await expect(experience).toBeVisible()
      await expect(
        page.getByRole('heading', { level: 1, name: caseStudy.title }),
      ).toHaveCount(1)

      // Project facts preserved.
      await expect(page.getByText('Client', { exact: true })).toBeVisible()
      await expect(page.getByText('Timeline', { exact: true })).toBeVisible()
      await expect(
        page.getByLabel('Project facts').locator('dd').last(),
      ).toHaveText(caseStudy.status)

      const proof = page.getByTestId('case-study-proof')
      for (const value of caseStudy.proof) {
        await expect(proof.getByText(value, { exact: true })).toBeVisible()
      }

      await expect(
        page.getByRole('heading', { level: 2, name: caseStudy.storyTitle }),
      ).toBeVisible()
      await expect(
        page.getByTestId('case-study-decisions').getByRole('listitem'),
      ).toHaveCount(caseStudy.decisionCount)
      await expect(page.getByTestId('case-study-system')).toBeVisible()

      const scroller = page.getByRole('region', {
        name: `Full-page screenshot of the ${caseStudy.title} website`,
      })
      await scroller.focus()
      await expect(scroller).toBeFocused()

      await expect(
        page.getByRole('link', {
          name: `Next case study: ${caseStudy.nextTitle}`,
        }),
      ).toHaveAttribute('href', caseStudy.nextHref)

      const liveSite = page.getByRole('link', {
        name: new RegExp(
          `Visit the live site for ${caseStudy.title}.*opens in a new tab`,
        ),
      })
      const preview = page.getByRole('link', { name: /View the preview/ })
      if (caseStudy.status === 'Live') {
        await expect(liveSite).toHaveAttribute('target', '_blank')
        await expect(preview).toHaveCount(0)
      } else {
        await expect(liveSite).toHaveCount(0)
        await expect(preview).toHaveAttribute('target', '_blank')
        await expect(preview).toHaveAccessibleName(
          new RegExp(`for ${caseStudy.title}.*opens in a new tab`),
        )
        await expect(
          page.getByText("Preview build. Not the client's live domain."),
        ).toBeVisible()
      }
    })
  }

  test('gives each case study its own accent treatment', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 })
    await page.emulateMedia({ reducedMotion: 'reduce' })

    // AASKRA — apps/orange signal.
    await page.goto('/work/aaskra-realty')
    await expect(page.getByText('01 / The challenge')).toHaveCSS(
      'color',
      'rgb(255, 101, 64)',
    )

    // Express Trade Financing — build/blue signal.
    await page.goto('/work/express-trade-financing')
    await expect(page.getByText('01 / The challenge')).toHaveCSS(
      'color',
      'rgb(112, 168, 255)',
    )
  })

  test('keeps the proof and editorial grids inside a mobile viewport', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/work/express-trade-financing')
    await page.evaluate(() => document.fonts.ready)

    const proofItems = page.getByTestId('case-study-proof').locator('> div')
    const first = await proofItems.nth(0).boundingBox()
    const second = await proofItems.nth(1).boundingBox()
    expect(first).not.toBeNull()
    expect(second).not.toBeNull()
    expect(second!.y).toBeGreaterThan(first!.y + first!.height - 1)

    const { scrollWidth, innerWidth } = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
    }))
    expect(scrollWidth).toBeLessThanOrEqual(innerWidth + 1)
  })
})
