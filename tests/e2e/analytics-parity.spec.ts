import { expect, test, type Locator, type Page } from '@playwright/test'

type CapturedEvent = [string, { props?: Record<string, string> }?]

async function installPlausibleSpy(page: Page) {
  await page.addInitScript(() => {
    const target = window as typeof window & {
      __plausibleEvents: unknown[][]
      plausible: (...args: unknown[]) => void
    }
    target.__plausibleEvents = JSON.parse(
      window.sessionStorage.getItem('plausible-test-events') ?? '[]',
    ) as unknown[][]
    target.plausible = (...args: unknown[]) => {
      target.__plausibleEvents.push(args)
      window.sessionStorage.setItem(
        'plausible-test-events',
        JSON.stringify(target.__plausibleEvents),
      )
    }
  })
}

async function capturedEvents(page: Page) {
  return page.evaluate(() => {
    const target = window as typeof window & {
      __plausibleEvents: CapturedEvent[]
    }
    return target.__plausibleEvents
  })
}

async function clickWithoutNavigation(locator: Locator) {
  await locator.evaluate((element) => {
    element.addEventListener('click', (event) => event.preventDefault(), {
      once: true,
    })
    ;(element as HTMLElement).click()
  })
}

test.beforeEach(async ({ page }) => {
  await installPlausibleSpy(page)
})

test('tracks only the meaningful conversion and discovery actions', async ({
  page,
}) => {
  await page.goto('/')
  await expect(page.locator('html')).toHaveAttribute('data-analytics-ready', 'true')

  await clickWithoutNavigation(
    page.locator('main [data-analytics-event="cta_start_project"]').first(),
  )
  await clickWithoutNavigation(page.getByRole('link', { name: 'Chat on WhatsApp' }))
  await clickWithoutNavigation(
    page.locator('main a[href="/work/aaskra-realty"]'),
  )
  await clickWithoutNavigation(
    page.locator('main a[href="/services/web"]').first(),
  )

  await page.goto('/work')
  await expect(page.locator('html')).toHaveAttribute('data-analytics-ready', 'true')
  await clickWithoutNavigation(
    page.locator('[data-concept-stage]').first().getByRole('link'),
  )

  await expect
    .poll(async () => (await capturedEvents(page)).map(([name]) => name))
    .toEqual([
      'cta_start_project',
      'cta_whatsapp',
      'work_open',
      'service_open',
      'concept_open',
    ])

  const events = await capturedEvents(page)
  expect(events[2][1]?.props?.item).toBe('aaskra-realty')
  expect(events[3][1]?.props?.item).toBe('web')
  expect(events[4][1]?.props?.item).toBe('terra-elix')
})

test('tracks contact form start, submit, and rendered success once', async ({
  page,
}) => {
  await page.goto('/contact')
  await expect(page.locator('html')).toHaveAttribute('data-analytics-ready', 'true')

  await page.getByLabel(/^Name/).fill('Ada Lovelace')
  await page.getByLabel(/^Email/).fill('ada@example.com')
  await page.getByLabel(/^Company/).fill('Analytical Engines')
  await page
    .getByLabel(/What.*slowing you down/i)
    .fill('We need a client portal with reporting.')
  await page.getByLabel(/Budget range/i).selectOption('AED 25,000 – 50,000')
  await page.locator('input[name="website"]').evaluate((input) => {
    ;(input as HTMLInputElement).value = 'bot-filled.example'
  })
  await page.getByRole('button', { name: 'Send message' }).click()

  await expect(page.getByRole('status')).toContainText('Message sent')
  await expect
    .poll(async () => (await capturedEvents(page)).map(([name]) => name))
    .toEqual([
      'contact_form_start',
      'contact_form_submit',
      'contact_form_success',
    ])
})

test('disables the submit control while one request is in flight', async ({
  page,
}) => {
  let submissions = 0
  await page.route('**/contact', async (route) => {
    if (route.request().method() !== 'POST') {
      await route.continue()
      return
    }
    submissions += 1
    await new Promise((resolve) => setTimeout(resolve, 300))
    await route.continue()
  })

  await page.goto('/contact')
  await page.getByLabel(/^Name/).fill('Ada Lovelace')
  await page.getByLabel(/^Email/).fill('ada@example.com')
  await page
    .getByLabel(/What.*slowing you down/i)
    .fill('We need a client portal with reporting.')
  await page.getByLabel(/Budget range/i).selectOption('AED 25,000 – 50,000')

  const submit = page.getByRole('button', { name: 'Send message' })
  await submit.click()
  await expect(page.getByRole('button', { name: 'Sending…' })).toBeDisabled()
  await page.getByRole('button', { name: 'Sending…' }).dispatchEvent('click')
  await expect(page.locator('form').getByRole('alert')).toContainText('was NOT sent')
  expect(submissions).toBe(1)
})
