import { expect, test } from '@playwright/test'

test('renders the approved four-scene About story', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/about')

  const experience = page.getByTestId('about-experience')
  await expect(experience).toBeVisible()
  await expect(
    experience.getByRole('heading', {
      level: 1,
      name: 'We make complex feel clear.',
    }),
  ).toBeVisible()

  await expect(experience.locator(':scope > section')).toHaveCount(4)
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
