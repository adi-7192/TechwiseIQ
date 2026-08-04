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
})
