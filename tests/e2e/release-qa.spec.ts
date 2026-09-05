import { expect, test } from '@playwright/test'

const PUBLIC_ROUTES = [
  '/',
  '/services',
  '/services/web',
  '/services/software',
  '/services/ai',
  '/work',
  '/work/aaskra-realty',
  '/work/express-trade-financing',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
]

test('keeps every rendered internal destination reachable', async ({
  page,
  request,
}) => {
  const destinations = new Set<string>()

  for (const route of PUBLIC_ROUTES) {
    await page.goto(route)
    const hrefs = await page.locator('a[href]').evaluateAll((anchors) =>
      anchors.map((anchor) => (anchor as HTMLAnchorElement).href),
    )
    for (const href of hrefs) {
      const url = new URL(href)
      if (url.origin !== new URL(page.url()).origin) continue
      if (url.hash && url.pathname === new URL(page.url()).pathname) continue
      destinations.add(`${url.pathname}${url.search}`)
    }
  }

  for (const destination of destinations) {
    const response = await request.get(destination)
    expect(
      response.status(),
      `${destination} should resolve from an internal link`,
    ).toBeLessThan(400)
  }
})

test('preserves browser back and forward navigation across route shells', async ({
  page,
}) => {
  await page.goto('/')
  await page.getByRole('link', { name: 'Services', exact: true }).first().click()
  await expect(page).toHaveURL(/\/services$/)
  await page.getByRole('link', { name: 'About', exact: true }).first().click()
  await expect(page).toHaveURL(/\/about$/)

  await page.goBack()
  await expect(page).toHaveURL(/\/services$/)
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await page.goForward()
  await expect(page).toHaveURL(/\/about$/)
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
})

test('shows keyboard focus and keeps the shared mobile menu trapped', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')

  await page.keyboard.press('Tab')
  const skip = page.getByRole('link', { name: 'Skip to content' })
  await expect(skip).toBeFocused()
  await expect(skip).toBeVisible()
  await expect(skip).not.toHaveCSS('outline-style', 'none')

  // Use the stable disclosure relationship: the accessible name intentionally
  // changes from "Open menu" to "Close menu" after activation.
  const menuButton = page.locator('button[aria-controls="mobile-nav"]')
  await menuButton.click()
  await expect(menuButton).toHaveAttribute('aria-expanded', 'true')
  const mobileNav = page.locator('#mobile-nav')
  await expect(mobileNav.getByRole('navigation', { name: 'Primary' })).toBeVisible()
  await expect(
    mobileNav.getByRole('link', { name: 'Services', exact: true }),
  ).toBeFocused()

  await page.keyboard.press('Escape')
  await expect(menuButton).toHaveAttribute('aria-expanded', 'false')
  await expect(menuButton).toBeFocused()
  await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden')
})

test('retains meaningful DOM and CSS atmosphere when WebGL is unavailable', async ({
  page,
}) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext
    HTMLCanvasElement.prototype.getContext = function getContext(
      this: HTMLCanvasElement,
      contextId: string,
      ...args: unknown[]
    ) {
      if (contextId === 'webgl' || contextId === 'webgl2') return null
      return Reflect.apply(original, this, [contextId, ...args])
    } as typeof HTMLCanvasElement.prototype.getContext
  })

  await page.goto('/')
  await expect(page.locator('.tw-world')).toBeVisible()
  await expect(
    page.getByRole('heading', { level: 1, name: /Technology that/i }),
  ).toBeVisible()
  await expect(page.locator('[data-persistent-scene] canvas')).toHaveCount(0)
  await expect(page.locator('#top').getByRole('link', { name: 'Start a project' })).toBeVisible()
})

test('keeps shared navigation, contact, legal, and indexing contracts', async ({
  page,
}) => {
  await page.goto('/')

  const header = page.getByRole('banner')
  for (const label of ['Services', 'Work', 'About', 'Contact']) {
    await expect(header.getByRole('link', { name: label, exact: true })).toHaveCount(1)
  }

  const footer = page.getByRole('contentinfo')
  await expect(footer.getByRole('link', { name: 'Privacy' })).toHaveAttribute(
    'href',
    '/privacy',
  )
  await expect(footer.getByRole('link', { name: 'Terms' })).toHaveAttribute(
    'href',
    '/terms',
  )
  await expect(footer.getByRole('link', { name: /Info@/i })).toHaveAttribute(
    'href',
    'mailto:Info@techwiseiqtechnologies.ae',
  )
  await expect(footer.getByRole('link', { name: /WhatsApp/i })).toHaveAttribute(
    'href',
    'https://wa.me/971567760667',
  )
  await expect(page.locator('meta[name="robots"][content*="noindex"]')).toHaveCount(0)
})
