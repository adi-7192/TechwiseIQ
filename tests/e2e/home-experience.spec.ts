import { expect, test } from '@playwright/test'

test('keeps the hero and replaces the below-hero story', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')

  await expect(
    page.locator('header').first().locator('.marquee-track'),
  ).toHaveCount(3)
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'Techwise IQ — the AI-first engineering agency.',
  )

  const experience = page.getByTestId('home-experience')
  await expect(experience).toBeVisible()
  await expect(
    experience.getByRole('heading', {
      name: /shouldn.t feel this manual/i,
    }),
  ).toBeVisible()

  const serviceLinks = [
    ['Web Development', '/services/web'],
    ['Custom Software', '/services/software'],
    ['AI Automation', '/services/ai'],
  ] as const

  for (const [name, path] of serviceLinks) {
    const link = experience.getByRole('link', {
      name: new RegExp(`Explore ${name}`, 'i'),
    })
    await expect(link).toHaveAttribute('href', path)
  }

  await expect(
    experience.getByText('Fixed scope', { exact: true }),
  ).toBeVisible()
  await expect(
    experience.getByText('Weekly demos', { exact: true }),
  ).toBeVisible()
  await expect(
    experience.getByRole('link', { name: /book a call/i }),
  ).toHaveAttribute('href', /wa\.me\/971567760667/)
  await expect(
    experience.getByRole('link', { name: /whatsapp/i }),
  ).toHaveAttribute('href', 'https://wa.me/971567760667')
  await expect(
    experience.getByRole('link', { name: /enquiry/i }),
  ).toHaveAttribute('href', '/contact')

  await expect(
    experience.getByText('Selected work', { exact: true }),
  ).toHaveCount(0)
  await expect(experience.getByTestId('home-proof')).toHaveCount(0)
})
