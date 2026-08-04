import { expect, test } from '@playwright/test'

const CASES = [
  {
    slug: 'aaskra-realty',
    title: 'AASKRA Realty',
    storyTitle: 'Trust before track record.',
    proof: ['11', '6', '6 wks'],
    decisionCount: 5,
    nextTitle: 'Express Trade Financing',
    nextHref: '/work/express-trade-financing',
    hasLiveSite: false,
  },
  {
    slug: 'express-trade-financing',
    title: 'Express Trade Financing',
    storyTitle: 'Institutional weight, without the institution.',
    proof: ['USD 200M+', '25+', '5 wks'],
    decisionCount: 5,
    nextTitle: 'AASKRA Realty',
    nextHref: '/work/aaskra-realty',
    hasLiveSite: true,
  },
] as const

test.describe('Editorial Kinetic case studies', () => {
  for (const caseStudy of CASES) {
    test(`${caseStudy.title} renders the approved editorial story`, async ({
      page,
    }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' })
      await page.goto(`/work/${caseStudy.slug}`)

      const experience = page.getByTestId('case-study-experience')
      await expect(experience).toBeVisible()
      await expect(
        page.getByRole('heading', { level: 1, name: caseStudy.title }),
      ).toHaveCount(1)

      const proof = page.getByTestId('case-study-proof')
      for (const value of caseStudy.proof) {
        await expect(proof.getByText(value, { exact: true })).toBeVisible()
      }

      await expect(
        page.getByRole('heading', {
          level: 2,
          name: caseStudy.storyTitle,
        }),
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
        name: `Visit the ${caseStudy.title} live site (opens in a new tab)`,
      })
      if (caseStudy.hasLiveSite) {
        await expect(liveSite).toHaveAttribute('target', '_blank')
      } else {
        await expect(liveSite).toHaveCount(0)
      }
    })
  }

  test('uses the approved Kinetic chapter treatments on desktop', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 900 })
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/work/aaskra-realty')

    const experience = page.getByTestId('case-study-experience')
    const hero = experience.locator('section').first()
    expect((await hero.boundingBox())!.height).toBeGreaterThanOrEqual(895)
    await expect(
      page.getByRole('heading', { level: 1, name: 'AASKRA Realty' }),
    ).toHaveCSS('font-family', /Anton/)
    await expect(page.getByText('01 / The challenge')).toHaveCSS(
      'color',
      'rgb(154, 154, 146)',
    )
    await expect(page.getByTestId('case-study-system')).toHaveCSS(
      'background-color',
      'rgb(255, 208, 47)',
    )
  })

  test('turns the proof and editorial grids into a deliberate mobile story', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/work/express-trade-financing')
    await page.evaluate(() => document.fonts.ready)

    const hero = page
      .getByTestId('case-study-experience')
      .locator('section')
      .first()
    expect((await hero.boundingBox())!.height).toBeGreaterThanOrEqual(839)

    const proofItems = page.getByTestId('case-study-proof').locator('div')
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
