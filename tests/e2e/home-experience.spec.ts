import { expect, test } from '@playwright/test'
import { scrollIntoViewHeld } from './helpers'

/** A settled transform is the identity — either the keyword or, once a filled CSS
 *  animation is holding its end frame, the equivalent matrix. */
const settled = (n: Element) => {
  const t = getComputedStyle(n).transform
  return t === 'none' || t === 'matrix(1, 0, 0, 1, 0, 0)'
}

test('the hero works without JavaScript: copy and actions, no canvas', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  const page = await context.newPage()
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 1000 })
    await page.goto('/')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await expect(page.locator('#top').getByRole('link', { name: 'Bring us the problem' })).toBeVisible()
    await expect(page.locator('[data-home-scene] canvas')).toHaveCount(0)
  }
  await context.close()
})

test('the skyline appears on its first drawn frame, without a fade-in', async ({ page }) => {
  await page.goto('/')
  const canvas = page.locator('[data-home-scene] canvas')
  await expect(canvas).toHaveAttribute('data-painted', 'true')
  expect(await canvas.evaluate((element) => ({
    opacity: getComputedStyle(element).opacity,
    transition: getComputedStyle(element).transitionDuration,
  }))).toEqual({ opacity: '1', transition: '0s' })
})

test('the skyline follows the whole page: each section reaches its stop', async ({ page }) => {
  // CI renders WebGL in software, where the journey is off by design (lite budget);
  // force the full journey so its behaviour is still covered.
  await page.addInitScript(() => ((window as Window & { __twSceneFull?: boolean }).__twSceneFull = true))
  await page.goto('/')
  const canvas = page.locator('[data-home-scene] canvas')
  await expect(canvas).toHaveAttribute('data-painted', 'true')
  await expect(canvas).toHaveAttribute('data-stop', 'hero')
  for (const [selector, stop] of [['#apps', 'apps'], ['#selected-work', 'work']]) {
    await page.evaluate((s) => {
      const el = document.querySelector(s)!
      window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.2)
    }, selector)
    await expect(canvas).toHaveAttribute('data-stop', stop)
  }
  // Render on demand: once the camera settles below the hero, the loop sleeps.
  await expect(canvas).toHaveAttribute('data-animation-running', 'false', { timeout: 8000 })
  await expect(canvas).toBeVisible()
})

test('reduced motion: one still frame of the hero, hidden below it', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  const canvas = page.locator('[data-home-scene] canvas')
  await expect(canvas).toHaveAttribute('data-painted', 'true')
  await expect(canvas).toHaveAttribute('data-animation-running', 'false')
  await page.evaluate(() => window.scrollTo(0, document.querySelector('#selected-work')!.getBoundingClientRect().top + window.scrollY))
  await expect(canvas).toBeHidden()
})

test('the cursor halo is desktop-only decoration', async ({ page, browser }) => {
  await page.goto('/')
  await page.mouse.move(400, 300)
  const halo = page.locator('[data-home-experience] > div[aria-hidden="true"][data-active]')
  await expect(halo).toHaveAttribute('data-active', 'true')
  const touch = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true })
  const phone = await touch.newPage()
  await phone.goto('/')
  expect(await phone.evaluate(() =>
    [...document.querySelectorAll('[data-home-experience] > div[aria-hidden="true"]:not([data-home-scene])')]
      .every((el) => getComputedStyle(el).display === 'none'),
  )).toBe(true)
  await touch.close()
})

test('introduces three services before client evidence with useful destinations', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Technology that')
  await expect(page.locator('#top').getByRole('link', { name: 'Bring us the problem' })).toHaveAttribute(
    'href',
    '/contact'
  )
  await expect(
    page.locator('#top').getByRole('link', { name: 'Explore our work' })
  ).toHaveAttribute('href', '/work')
  await expect(page.locator('[data-service-story]')).toHaveCount(3)
  await expect(page.getByRole('navigation', { name: 'Page chapters' })).toHaveCount(0)
  for (const [id, href] of [
    ['websites', '/services/web'],
    ['apps', '/services/software'],
    ['automation', '/services/ai'],
  ]) {
    await expect(page.locator(`#${id}`).getByRole('link')).toHaveAttribute('href', href)
  }
  const order = await page
    .locator('main section[id]')
    .evaluateAll((nodes) => nodes.map((n) => n.id))
  expect(order).toEqual(['top', 'services', 'websites', 'apps', 'automation', 'selected-work'])
  await expect(
    page.locator('#selected-work').getByRole('link', { name: /Supreme Universal/ })
  ).toHaveAttribute('href', '/work/supreme-universal')
  await expect(
    page.getByRole('heading', { name: 'A clear plan. A working product.' })
  ).toBeVisible()
})

test('each demonstration can be completed manually with reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await expect(page.locator('[data-home-experience]')).toHaveAttribute(
    'data-home-motion',
    'reduced'
  )
  for (const kind of ['web', 'software', 'ai']) {
    const demo = page.locator(`[data-demo="${kind}"]`)
    await demo.scrollIntoViewIfNeeded()
    await expect(demo).toHaveAttribute('data-step', '3')
    await demo.getByRole('button', { name: 'Try it yourself' }).click()
    await expect(demo).toHaveAttribute('data-step', '0')
    await demo.getByRole('button', { name: 'Next step' }).click()
    await demo.getByRole('button', { name: 'Next step' }).click()
    await demo
      .getByRole('button', { name: kind === 'software' ? 'Approve request' : 'Next step' })
      .click()
    await expect(demo).toHaveAttribute('data-step', '3')
    await expect(demo.getByRole('status')).toContainText(
      kind === 'web'
        ? 'Enquiry received'
        : kind === 'software'
          ? 'Approved and recorded'
          : 'Ready for human review'
    )
  }
})

test('playback pauses on demand and offscreen, then can replay', async ({ page }) => {
  await page.goto('/')
  const demo = page.locator('[data-demo="web"]')
  // Play only resumes while the demo is ≥30% in view.
  await scrollIntoViewHeld(demo)
  await expect(demo).toHaveAttribute('data-playing', 'true')
  await demo.getByRole('button', { name: 'Replay website demo' }).click()
  await demo.getByRole('button', { name: 'Pause', exact: true }).click()
  const step = await demo.getAttribute('data-step')
  await page.waitForTimeout(1900)
  await expect(demo).toHaveAttribute('data-step', step!)
  await demo.getByRole('button', { name: 'Play', exact: true }).click()
  await expect(demo).toHaveAttribute('data-step', '3', { timeout: 11000 })
  // Continuous playback should return to construction after holding the result.
  await expect(demo).toHaveAttribute('data-step', '0', { timeout: 7000 })
  await demo.getByRole('button', { name: 'Replay website demo' }).click()
  await page.locator('#top').scrollIntoViewIfNeeded()
  await page.waitForTimeout(400)
  const offscreenStep = await demo.getAttribute('data-step')
  await page.waitForTimeout(1900)
  await expect(demo).toHaveAttribute('data-step', offscreenStep!)
})

test('live reduced-motion changes stop demos and smooth scrolling', async ({ page }) => {
  await page.goto('/')
  const demo = page.locator('[data-demo="ai"]')
  await demo.scrollIntoViewIfNeeded()
  await demo.getByRole('button', { name: 'Replay ai workflow demo' }).click()
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect(demo).toHaveAttribute('data-step', '3')
  await expect(page.locator('html')).not.toHaveClass(/lenis-smooth/)
  await expect(page.locator('canvas')).toHaveAttribute('data-animation-running', 'false')
})

for (const width of [320, 390, 768, 1024, 1440]) {
  test(`homepage fits at ${width}px and keeps hero actions clear`, async ({ page }) => {
    await page.setViewportSize({ width, height: width > 1000 ? 900 : 844 })
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)
    ).toBeLessThanOrEqual(1)
    for (const button of await page
      .locator('#top')
      .getByRole('link', { name: /Bring us the problem|Explore our work/ })
      .all()) {
      const box = (await button.boundingBox())!
      expect(box.height).toBeGreaterThanOrEqual(44)
      expect(box.x).toBeGreaterThanOrEqual(0)
      expect(box.x + box.width).toBeLessThanOrEqual(width)
      if (width >= 1024) expect(box.y + box.height).toBeLessThanOrEqual(900)
    }
    for (const demo of await page.locator('[data-demo]').all()) {
      const box = (await demo.boundingBox())!
      expect(box.x).toBeGreaterThanOrEqual(0)
      expect(box.x + box.width).toBeLessThanOrEqual(width)
    }
  })
}

test('the page and demo conclusions remain useful without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  })
  const page = await context.newPage()
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await expect(page.locator('[data-intro-overlay]')).toBeHidden()
  await expect(page.locator('[data-service-story]')).toHaveCount(3)
  for (const demo of await page.locator('[data-demo]').all()) {
    await expect(demo).toHaveAttribute('data-step', '3')
    await expect(demo.getByRole('button').first()).toBeHidden()
  }
  await expect(page.getByRole('heading', { name: 'Real projects, shipped.' })).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  await context.close()
})

/*
 * The home page used to paint its fully-revealed layout and only then run
 * HomeMotion's effect, which snapped everything back to the start of the entry
 * animation — a visible flash on every client-side navigation to `/`. The
 * pre-animation state now lands before paint: an inline bootstrap script in
 * immersive/home/index.tsx on a hard load, HomeMotion's layout effect on a
 * client-side navigation.
 *
 * These assert the mechanism rather than trying to catch the frame — a
 * rAF sampler races hydration and cannot detect a one-frame flash reliably.
 */

test('the pre-animation state is applied before hydration, and fails open', async ({ page }) => {
  // Block the JS bundle — but not the stylesheets, which live in the same
  // directory — so only the inline bootstrap script runs. That isolates the
  // first-paint state from anything React does afterwards.
  await page.route(
    (url) => url.pathname.startsWith('/_next/static/') && url.pathname.endsWith('.js'),
    (route) => route.abort(),
  )
  await page.goto('/')

  const world = page.locator('[data-home-experience]')
  await expect(world).toHaveAttribute('data-home-motion', 'pending')
  await expect(page.locator('[data-home-reveal]').first()).toBeHidden()

  // Nothing may leave the page stuck in `pending`: the bootstrap arms a failsafe.
  await expect(world).toHaveAttribute('data-home-motion', 'static', { timeout: 6000 })
  await expect(page.locator('[data-home-reveal]').first()).toBeVisible()
})

test('the pre-animation state is never armed when scripts do not run', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  const page = await context.newPage()
  await page.goto('/')
  await expect(page.locator('[data-home-experience]')).toHaveAttribute(
    'data-home-motion',
    'static',
  )
  await expect(page.locator('[data-home-reveal]').first()).toBeVisible()
  await context.close()
})

test('handing the pre-animation state over to GSAP leaves nothing hidden', async ({ page }) => {
  // The reveal tweens end with `clearProps`. If the CSS pre-state were still
  // matching when the inline styles are stripped it would re-hide the element,
  // so the `pending` -> `active` handover has to happen at tween-build time.
  await page.goto('/about')
  await page.click('header a[aria-label="TechwiseIQ home"]')

  const world = page.locator('[data-home-experience]')
  await expect(world).toHaveAttribute('data-home-motion', 'active')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()

  const reveals = page.locator('[data-home-reveal]')
  for (let i = 0; i < (await reveals.count()); i++) {
    const el = reveals.nth(i)
    await el.scrollIntoViewIfNeeded()
    await expect(el).toBeVisible()
    await expect
      .poll(async () => el.evaluate((n) => parseFloat(getComputedStyle(n).opacity)))
      .toBeGreaterThan(0.98)
  }

  // The hero settles too — its lines are clipped by the parent until they land.
  await expect
    .poll(() => page.locator('[data-hero-line]').first().evaluate(settled))
    .toBe(true)
})

test('the hero animates itself in without waiting for the bundle', async ({ page }) => {
  // The entrance is CSS (HeroStage.module.css), not GSAP. Driven from JS it could
  // not start until the bundle had booted, which left the hero blank for ~300ms of
  // every load — a dark screen then a pop on any repeat visit, where the intro
  // overlay is not there to cover it. With the bundle blocked entirely the hero
  // must still play its entrance and end fully settled.
  await page.addInitScript(() => sessionStorage.setItem('tw-intro-seen', '1'))
  await page.route(
    (url) => url.pathname.startsWith('/_next/static/') && url.pathname.endsWith('.js'),
    (route) => route.abort(),
  )
  await page.goto('/')

  const line = page.locator('[data-hero-line]').first()
  const body = page.locator('[data-hero-support]').nth(1)

  // Settles on its own, with no JavaScript running at all.
  await expect.poll(() => line.evaluate(settled)).toBe(true)
  await expect
    .poll(() => body.evaluate((n) => parseFloat(getComputedStyle(n).opacity)))
    .toBeGreaterThan(0.98)
})

test('the hero entrance holds until the intro overlay lifts', async ({ page }) => {
  // Behind the overlay the hero must not be part-way through its entrance, or it
  // pops in half-finished the moment the overlay clears.
  await page.goto('/')
  await expect(page.locator('[data-intro-overlay]')).toBeVisible()
  expect(
    await page
      .locator('[data-hero-line]')
      .first()
      .evaluate((n) => getComputedStyle(n).animationPlayState),
  ).toBe('paused')

  // And it does eventually run.
  await expect
    .poll(() => page.locator('[data-hero-line]').first().evaluate(settled), { timeout: 10000 })
    .toBe(true)
})

test('without a GPU the city stays in the hero and fades out below it', async ({ page }) => {
  await page.goto('/')
  const canvas = page.locator('[data-home-scene] canvas')
  await expect(canvas).toHaveAttribute('data-painted', 'true')
  test.skip((await canvas.getAttribute('data-render')) !== 'software', 'GPU renderer: full journey runs')
  await page.evaluate(() => window.scrollTo(0, document.querySelector('#selected-work')!.getBoundingClientRect().top + window.scrollY))
  await expect(canvas).toBeHidden()
  await expect(canvas).toHaveAttribute('data-animation-running', 'false')
})
