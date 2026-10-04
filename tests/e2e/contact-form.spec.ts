import { expect, test, type Page } from '@playwright/test'

async function fillRequiredFields(page: Page) {
  await page.getByLabel(/^Name/).fill('Ada Lovelace')
  await page.getByLabel(/^Email/).fill('ada@example.com')
  await page.getByLabel(/^Company/).fill('Analytical Engines')
  await page
    .getByLabel(/What.*slowing you down/i)
    .fill('We need a client portal with reporting.')
  await page.getByLabel(/Budget range/i).selectOption('AED 25,000 – 50,000')
}

test('focuses the invalid field and preserves the submission', async ({
  page,
}) => {
  await page.goto('/contact')
  await fillRequiredFields(page)
  await page.getByLabel(/^Email/).fill('ada@')
  await page.getByRole('button', { name: 'Send message' }).click()

  await expect(page.locator('form').getByRole('alert')).toContainText(
    'Please enter a valid email address.',
  )
  await expect(page.getByLabel(/^Email/)).toBeFocused()
  await expect(page.getByLabel(/^Name/)).toHaveValue('Ada Lovelace')
  await expect(page.getByLabel(/^Company/)).toHaveValue('Analytical Engines')
  await expect(page.getByLabel(/What.*slowing you down/i)).toHaveValue(
    'We need a client portal with reporting.',
  )
  await expect(page.getByLabel(/Budget range/i)).toHaveValue(
    'AED 25,000 – 50,000',
  )
})

test('honestly reports missing delivery configuration', async ({ page }) => {
  await page.goto('/contact')
  await fillRequiredFields(page)
  await page.getByRole('button', { name: 'Send message' }).click()

  await expect(page.locator('form').getByRole('alert')).toContainText(
    'was NOT sent',
  )
  await expect(page.getByLabel(/^Name/)).toHaveValue('Ada Lovelace')
  await expect(page.getByLabel(/^Company/)).toHaveValue('Analytical Engines')
  await expect(page.getByLabel(/Budget range/i)).toHaveValue(
    'AED 25,000 – 50,000',
  )
})

test('honeypot is not keyboard reachable', async ({ page }) => {
  await page.goto('/contact')
  await expect(page.locator('input[name="website"]')).toHaveAttribute(
    'tabindex',
    '-1',
  )
})

test('shows the three next steps on the page and after sending', async ({
  page,
}) => {
  await page.goto('/contact')
  const steps = page
    .getByRole('heading', { level: 2, name: 'What happens next' })
    .locator('xpath=following-sibling::ol[1]')
    .getByRole('listitem')
  await expect(steps).toHaveText([
    /^We reply\./,
    /^20-minute call\./,
    /^Options, then your call\./,
  ])
  await expect(
    page.getByRole('link', { name: 'How we engage' }),
  ).toHaveAttribute('href', '/services#engage')
  await expect(page.getByText('Response guarantee')).toHaveCount(0)
  await expect(page.getByText(/scope, timeline, and cost/i)).toHaveCount(0)

  // The honeypot path returns success without sending, so no mail config is needed.
  await fillRequiredFields(page)
  await page.locator('input[name="website"]').fill('bot', { force: true })
  await page.getByRole('button', { name: 'Send message' }).click()

  const status = page.getByRole('status')
  await expect(status).toHaveText(/Message sent/)
  await expect(status).toBeFocused()
  // The sidebar copy hides, leaving one list directly under the status.
  await expect(
    page.getByRole('heading', { level: 2, name: 'What happens next' }),
  ).toHaveCount(1)
  await expect(page.getByRole('main').getByRole('listitem')).toHaveCount(3)
})
