import { expect, test } from '@playwright/test'

test('presents Techwise IQ as a direct, outcome-focused studio', async ({
  page,
}) => {
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

  await expect(experience.getByText(/a team of experts/i)).toBeVisible()
  await expect(experience.getByText('Direct ownership')).toBeVisible()
  await expect(experience.getByText('Small-studio speed')).toBeVisible()
  await expect(
    experience.getByText(/no game of telephone/i),
  ).toBeVisible()
  await expect(experience.getByText('Ownership', { exact: true })).toBeVisible()
  await expect(experience.getByText('Clarity', { exact: true })).toBeVisible()
  await expect(experience.getByText('Momentum', { exact: true })).toBeVisible()

  for (const forbidden of [
    /note from the founder/i,
    /founder, techwise iq/i,
    /freelancer/i,
    /trusted by/i,
  ]) {
    await expect(experience.getByText(forbidden)).toHaveCount(0)
  }
})

test('preserves the approved About service paths and qualitative proof', async ({
  page,
}) => {
  await page.goto('/about')
  const experience = page.getByTestId('about-experience')

  await expect(
    experience.locator('[data-about-path]').evaluateAll((paths) =>
      paths.map((path) => ({
        problem: path.querySelector('h3')?.textContent?.trim(),
        outcome: path.querySelector('p')?.textContent?.trim(),
      })),
    ),
  ).resolves.toEqual([
    {
      problem: 'A website that undersells you',
      outcome: 'A website that gets noticed and gets people to act.',
    },
    {
      problem: 'Work trapped in spreadsheets',
      outcome: 'Software built around how your business really runs.',
    },
    {
      problem: 'Repetitive work slowing people down',
      outcome: 'Automation that does the busywork, with a person in charge.',
    },
  ])

  await expect(
    experience.getByText('Building for businesses in Dubai and beyond', {
      exact: false,
    }),
  ).toBeVisible()

  const cta = experience.getByRole('link', {
    name: /bring us the problem/i,
  })
  await expect(cta).toHaveAttribute('href', '/contact')
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1)
})

for (const viewport of [
  { width: 320, height: 568 },
  { width: 375, height: 667 },
  { width: 768, height: 900 },
  { width: 1440, height: 1000 },
]) {
  test(`keeps About readable and inside ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport)
    await page.goto('/about')

    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true)

    const experience = page.getByTestId('about-experience')
    const cta = experience.getByRole('link', {
      name: /bring us the problem/i,
    })
    const ctaBox = await cta.boundingBox()
    expect(ctaBox).not.toBeNull()
    expect(ctaBox!.height).toBeGreaterThanOrEqual(44)
  })
}

test('keeps the About story available without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  const page = await context.newPage()
  await page.goto('/about')

  await expect(
    page.getByRole('heading', {
      level: 1,
      name: 'We make complex feel clear.',
    }),
  ).toBeVisible()
  await expect(page.getByText('Direct ownership')).toBeVisible()

  await context.close()
})
