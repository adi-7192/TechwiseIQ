import { expect, test, type Locator, type Page } from '@playwright/test'
import { SERVICES } from '../../src/data/services'

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
  // Generous: CI forces this path on CPU-rendered WebGL, where frames are slow.
  await expect(canvas).toHaveAttribute('data-animation-running', 'false', { timeout: 25000 })
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
  const halo = page.locator('[data-home-experience] > div[aria-hidden="true"]:not([data-home-scene])')
  // Headless Linux (CI) reports no mouse: the halo must then stay off, as on touch.
  const finePointer = await page.evaluate(() => matchMedia('(hover: hover) and (pointer: fine)').matches)
  await page.mouse.move(400, 300)
  if (finePointer) await expect(halo).toHaveAttribute('data-active', 'true')
  else expect(await halo.evaluate((el) => getComputedStyle(el).display)).toBe('none')
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
  const chapters = page.getByRole('navigation', { name: 'Page chapters' })
  await expect(chapters).toHaveCount(1)
  expect(await chapters.getByRole('link').evaluateAll((links) =>
    links.map((a) => [a.textContent, a.getAttribute('href')]),
  )).toEqual([
    ['Intro', '#top'],
    ['Websites', '#websites'],
    ['Software', '#apps'],
    ['Automation', '#automation'],
    ['Work', '#selected-work'],
  ])
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

// The service demos (and their live reduced-motion stop) now live on /services/* only
// and are covered in service-detail-refinement.spec.ts.
test('a live reduced-motion change stops smooth scrolling and the skyline', async ({ page }) => {
  await page.goto('/')
  await page.emulateMedia({ reducedMotion: 'reduce' })
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
    // The feature spaces span the content column; their artifacts may bleed and are clipped.
    for (const space of await page.locator('[data-illustration]').all()) {
      const box = (await space.boundingBox())!
      expect(box.x).toBeGreaterThanOrEqual(0)
      expect(box.x + box.width).toBeLessThanOrEqual(width)
    }
  })
}

test('the page and its illustrations remain useful without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  })
  const page = await context.newPage()
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await expect(page.locator('[data-intro-overlay]')).toBeHidden()
  await expect(page.locator('[data-service-story]')).toHaveCount(3)
  await expect(page.locator('[data-illustration]')).toHaveCount(3)
  for (const space of await page.locator('[data-illustration]').all()) {
    await space.scrollIntoViewIfNeeded()
    await expect(space).toBeVisible()
    expect(await space.evaluate((n) => getComputedStyle(n).opacity)).toBe('1')
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
  // Opacity only — the pre-state must not take the reveals out of the Tab order.
  const firstReveal = page.locator('[data-home-reveal]').first()
  await expect(firstReveal).toHaveCSS('opacity', '0')
  await expect(firstReveal).toHaveCSS('visibility', 'visible')

  // Nothing may leave the page stuck in `pending`: the bootstrap arms a failsafe.
  await expect(world).toHaveAttribute('data-home-motion', 'static', { timeout: 6000 })
  await expect(firstReveal).toHaveCSS('opacity', '1')
})

test('the intro overlay releases the page if the bundle never runs', async ({ page }) => {
  await page.route(
    (url) => url.pathname.startsWith('/_next/static/') && url.pathname.endsWith('.js'),
    (route) => route.abort(),
  )
  await page.goto('/')
  const html = page.locator('html')
  await expect(html).toHaveAttribute('data-intro', 'loading')
  await expect(html).toHaveAttribute('data-intro', 'ready', { timeout: 6000 })
})

test('with motion on, the first Tab pass reaches unrevealed chapter links before the footer', async ({ page }) => {
  await openMotionHome(page, 1440, 900)
  for (let i = 0; i < 80; i++) {
    await page.keyboard.press('Tab')
    const where = await page.evaluate(() => {
      const el = document.activeElement
      if (el?.closest('footer')) return 'footer'
      return el?.textContent?.trim().startsWith('Explore web development') ? 'chapter' : null
    })
    if (where) {
      expect(where).toBe('chapter')
      // Focus scrolled it into view, which fires its reveal.
      await expect
        .poll(() => page.evaluate(() => parseFloat(getComputedStyle(document.activeElement!.closest('[data-home-reveal]') ?? document.activeElement!).opacity)))
        .toBeGreaterThan(0.98)
      return
    }
  }
  throw new Error('Tab never reached the first chapter link')
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

/* ─── 13.1 reference composition ─── */

type Box = { x: number; y: number; width: number; height: number }
const intersects = (a: Box, b: Box) =>
  Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x) > 0.5 &&
  Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y) > 0.5

/** Line boxes of the text inside each element (Range rects of its text nodes, so glyph runs only). */
const textLines = (locator: Locator) =>
  locator.evaluateAll((nodes) =>
    nodes.flatMap((node) => {
      const rects: { x: number; y: number; width: number; height: number }[] = []
      const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT)
      while (walker.nextNode()) {
        const range = document.createRange()
        range.selectNodeContents(walker.currentNode)
        for (const { x, y, width, height } of range.getClientRects()) rects.push({ x, y, width, height })
      }
      return rects
    }),
  )
const lineCount = async (locator: Locator) =>
  new Set((await textLines(locator)).map((r) => Math.round(r.y))).size

async function openHome(page: Page, width: number, height: number) {
  await page.setViewportSize({ width, height })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await page.evaluate(() => document.fonts.ready)
}

for (const width of [320, 390, 768, 769, 1024, 1440]) {
  for (const height of [700, 900]) {
    test(`orbit cards never cover the hero copy at ${width}x${height}`, async ({ page }) => {
      await openHome(page, width, height)
      const cards = await page.locator('[data-orbit-card]').evaluateAll((nodes) =>
        nodes
          .filter((n) => n.getClientRects().length > 0)
          .map((n) => {
            const { x, y, width, height } = n.getBoundingClientRect()
            return { x, y, width, height }
          }),
      )
      if (width <= 768) expect(cards.length).toBeLessThanOrEqual(height < 760 ? 0 : 2)
      const copy = [
        ...(await textLines(page.locator('[data-hero-line]'))),
        (await page.locator('#top p').boundingBox())!,
        (await page.locator('#top a[href="/contact"]').locator('..').boundingBox())!,
      ]
      for (const card of cards) for (const box of copy) expect(intersects(card, box)).toBe(false)
    })
  }
}

for (const width of [320, 1440]) {
  test(`the h1 is exactly two lines and chapter words fit at ${width}px`, async ({ page }) => {
    await openHome(page, width, 900)
    for (const line of await page.locator('[data-hero-line]').all()) expect(await lineCount(line)).toBe(1)
    await expect(page.getByRole('heading', { level: 1 })).toHaveAccessibleName(
      'Technology that moves the work.',
    )
    for (const word of await page.locator('[data-chapter-word]').all()) {
      expect(await lineCount(word)).toBe(1)
      const box = (await word.boundingBox())!
      expect(box.x + box.width).toBeLessThanOrEqual(width)
    }
  })
}

test('every illustration is tagged and uses only service copy', async ({ page }) => {
  await openHome(page, 1440, 900)
  const allowed = new Set(['Illustrative', 'Sample', '→'])
  for (const service of Object.values(SERVICES)) {
    service.fitSignals.forEach((t) => allowed.add(t))
    service.capabilities.forEach((c) => allowed.add(c.title))
    service.process.forEach((p) => allowed.add(p.title))
  }
  for (const story of await page.locator('[data-service-story]').all()) {
    const space = story.locator('[data-illustration]')
    await expect(space).toHaveAttribute('role', 'img')
    await expect(space).toHaveAttribute('aria-label', /^Illustrative example: /)
    const tags = space.getByText('Illustrative', { exact: true })
    expect(await tags.count()).toBeGreaterThanOrEqual(2)
    for (const tag of await tags.all()) {
      await expect(tag).toBeVisible()
      expect(parseFloat(await tag.evaluate((n) => getComputedStyle(n).fontSize))).toBeGreaterThanOrEqual(10)
    }
    const strings = await space.evaluate((root) => {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
      const out: string[] = []
      while (walker.nextNode()) if (walker.currentNode.textContent!.trim()) out.push(walker.currentNode.textContent!.trim())
      return out
    })
    for (const text of strings) expect(allowed, `unexpected mock text "${text}"`).toContain(text)
  }
})

// Spec §3b safe zones, with the parallax running: sample each feature space
// through its scroll range and check no artifact ever lands on card text.
for (const width of [390, 768, 1024, 1440]) {
  test(`feature artifacts never cover card text through the parallax at ${width}px`, async ({ page }) => {
    await openMotionHome(page, width, 900)
    await expect(page.locator('[data-home-experience]')).toHaveAttribute('data-home-motion', 'active')
    const spaces = await page.locator('[data-feature-space]').count()
    let moved = false
    for (let i = 0; i < spaces; i++) {
      for (const progress of [0.15, 0.35, 0.5, 0.65, 0.85]) {
        const target = await page.evaluate(
          ([i, p]) => {
            const space = document.querySelectorAll('[data-feature-space]')[i]
            const r = space.getBoundingClientRect()
            const y = Math.round(r.top + scrollY - innerHeight + p * (innerHeight + r.height))
            window.scrollTo(0, y)
            return Math.min(y, document.documentElement.scrollHeight - innerHeight)
          },
          [i, progress] as const,
        )
        // Let the scrub settle: scroll position reached and the a1 transform unchanged across frames.
        await expect
          .poll(() =>
            page.evaluate(
              ([i, target]) =>
                new Promise<boolean>((done) => {
                  const a1 = document.querySelectorAll('[data-feature-space]')[i].querySelector('[data-artifact="a1"]')!
                  const before = getComputedStyle(a1).transform
                  requestAnimationFrame(() =>
                    requestAnimationFrame(() =>
                      done(Math.abs(scrollY - target) < 2 && getComputedStyle(a1).transform === before),
                    ),
                  )
                }),
              [i, target] as const,
            ),
          )
          .toBe(true)
        const { hits, transformed } = await page.evaluate((i) => {
          const space = document.querySelectorAll('[data-feature-space]')[i]
          const card = space.querySelector('[data-feature-card]')!
          const text: DOMRect[] = []
          const walker = document.createTreeWalker(card, NodeFilter.SHOW_TEXT)
          while (walker.nextNode()) {
            if (!walker.currentNode.textContent!.trim()) continue
            const range = document.createRange()
            range.selectNodeContents(walker.currentNode)
            text.push(...[...range.getClientRects()].filter((r) => r.width && r.height))
          }
          const artifacts = [...space.querySelectorAll<HTMLElement>('[data-artifact]')].filter((a) => a.getClientRects().length)
          const hits: string[] = []
          for (const a of artifacts) {
            const r = a.getBoundingClientRect()
            for (const t of text)
              if (
                Math.min(r.right, t.right) - Math.max(r.left, t.left) > 0.5 &&
                Math.min(r.bottom, t.bottom) - Math.max(r.top, t.top) > 0.5
              )
                hits.push(`${a.dataset.artifact} covers text at ${Math.round(t.x)},${Math.round(t.y)}`)
          }
          return { hits, transformed: artifacts.some((a) => getComputedStyle(a).transform !== 'none') }
        }, i)
        moved ||= transformed
        expect(hits, `space ${i} at progress ${progress}`).toEqual([])
      }
    }
    // Guard against a vacuous pass: the parallax really moved the artifacts.
    expect(moved).toBe(true)
  })
}

test('every chapter link is a 44px tap target on touch screens', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })
  const page = await context.newPage()
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  expect(await page.evaluate(() => matchMedia('(pointer: coarse)').matches)).toBe(true)
  const links = page.getByRole('link', {
    name: /^(Explore web development|Explore custom software|Explore AI services|See all work)/,
  })
  await expect(links).toHaveCount(4)
  for (const link of await links.all()) expect((await link.boundingBox())!.height).toBeGreaterThanOrEqual(44)
  await context.close()
})

for (const width of [320, 390]) {
  test(`the scroll note clears the WhatsApp control at ${width}px`, async ({ page }) => {
    await openHome(page, width, 844)
    const note = page.locator('#top a[href="#services"]')
    await expect(note).toBeVisible()
    const box = (await note.boundingBox())!
    expect(box.height).toBeGreaterThanOrEqual(44)
    const fab = (await page.getByRole('link', { name: 'WhatsApp — chat' }).boundingBox())!
    expect(intersects(box, fab)).toBe(false)
    await expect(page.getByRole('navigation', { name: 'Page chapters' })).toBeHidden()
  })
}

for (const width of [769, 880, 1024, 1440]) {
  test(`the pill nav shows and clears the WhatsApp control at ${width}px`, async ({ page }) => {
    await openHome(page, width, 900)
    const nav = page.getByRole('navigation', { name: 'Page chapters' })
    await expect(nav).toBeVisible()
    await expect(page.locator('#top a[href="#services"]')).toBeHidden()
    const fab = (await page.getByRole('link', { name: 'WhatsApp — chat' }).boundingBox())!
    expect(intersects((await nav.boundingBox())!, fab)).toBe(false)
  })
}

/* ─── 13.1 motion (spec §9) ─── */

const chapterNav = (page: Page) => page.getByRole('navigation', { name: 'Page chapters' })
const currentChapter = (page: Page) =>
  chapterNav(page).locator('[aria-current="true"]').evaluateAll((links) => links.map((a) => a.textContent))

/** Skip the once-per-session intro overlay, then wait for every finite entrance animation. */
async function openMotionHome(page: Page, width: number, height: number, url = '/') {
  await page.addInitScript(() => sessionStorage.setItem('tw-intro-seen', '1'))
  await page.setViewportSize({ width, height })
  await page.goto(url)
  await expect(page.locator('[data-home-experience]')).toHaveAttribute('data-home-motion', /active|reduced/)
  await page.evaluate(() =>
    Promise.all(
      document
        .getAnimations()
        .filter((a) => a.effect?.getComputedTiming().endTime !== Infinity)
        .map((a) => a.finished),
    ),
  )
}

const scrollToSection = (page: Page, selector: string) =>
  page.evaluate((s) => {
    const el = document.querySelector(s)!
    window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.2)
  }, selector)

for (const reducedMotion of ['no-preference', 'reduce'] as const) {
  test(`the pill nav lights one chapter at a time (${reducedMotion})`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion })
    await openMotionHome(page, 1440, 900)
    await expect.poll(() => currentChapter(page)).toEqual(['Intro'])
    for (const [selector, label] of [
      ['#services', 'Intro'],
      ['#apps', 'Software'],
      ['section[data-journey="model"]', 'Work'],
    ]) {
      await scrollToSection(page, selector)
      await expect.poll(() => currentChapter(page)).toEqual([label])
    }
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight))
    await expect(page.locator('footer').first()).toBeInViewport()
    await expect.poll(() => currentChapter(page)).toEqual(['Work'])
  })

  test(`keyboard chapter jump lands below the header and moves focus (${reducedMotion})`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion })
    await openMotionHome(page, 1440, 900)
    const software = chapterNav(page).getByRole('link', { name: 'Software' })
    for (let i = 0; i < 40 && !(await software.evaluate((a) => a === document.activeElement)); i++) {
      await page.keyboard.press('Tab')
    }
    await expect(software).toBeFocused()
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(/#apps$/)
    const heading = page.locator('#apps h2')
    const headerBottom = () => page.locator('header').first().evaluate((h) => h.getBoundingClientRect().bottom)
    await expect.poll(async () => (await heading.boundingBox())!.y >= (await headerBottom()) - 1, { timeout: 5000 }).toBe(true)
    // Settled: the heading is in view and stays put.
    await expect(heading).toBeInViewport()
    await page.keyboard.press('Tab')
    expect(await page.evaluate(() => !!document.activeElement?.closest('#apps'))).toBe(true)
  })
}

test('a deep link lights its chapter', async ({ page }) => {
  await openMotionHome(page, 1440, 900, '/#automation')
  await expect.poll(() => currentChapter(page)).toEqual(['Automation'])
})

const DEPTH_TARGETS = '[data-orbit-slot], [data-orbit-card], [data-feature-card], [data-artifact]'
const depthTransforms = (page: Page) =>
  page.locator(DEPTH_TARGETS).evaluateAll((nodes) =>
    nodes.map((n) => ({ transform: getComputedStyle(n).transform, rotate: getComputedStyle(n).rotate, card: n.matches('[data-orbit-card], [data-artifact]') })),
  )

test('reduced motion: no smooth scroll, still skyline, depth objects at rest with their tilt', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await openMotionHome(page, 1440, 900)
  await expect(page.locator('[data-home-experience]')).toHaveAttribute('data-home-motion', 'reduced')
  await expect(page.locator('html')).not.toHaveClass(/lenis-smooth/)
  await expect(page.locator('[data-home-scene] canvas')).toHaveAttribute('data-animation-running', 'false')
  await page.mouse.move(100, 100)
  await page.mouse.move(1300, 800, { steps: 4 })
  await scrollToSection(page, '#apps')
  await page.mouse.move(200, 300, { steps: 4 })
  await page.waitForTimeout(400)
  for (const { transform, rotate, card } of await depthTransforms(page)) {
    expect(transform).toBe('none')
    if (card) expect(rotate).not.toBe('none')
  }
})

test('switching to reduced motion live puts every depth object back at rest', async ({ page }) => {
  await openMotionHome(page, 1440, 900)
  const finePointer = await page.evaluate(() => matchMedia('(hover: hover) and (pointer: fine)').matches)
  await page.mouse.move(100, 100)
  await page.mouse.move(1300, 800, { steps: 4 })
  if (finePointer) {
    await expect.poll(() => page.locator('[data-orbit-card]').first().evaluate((n) => getComputedStyle(n).transform)).not.toBe('none')
  }
  await scrollToSection(page, '#websites')
  await page.waitForTimeout(300)
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect(page.locator('[data-home-experience]')).toHaveAttribute('data-home-motion', 'reduced')
  await page.mouse.move(200, 200, { steps: 4 })
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.mouse.move(1200, 700, { steps: 4 })
  await page.waitForTimeout(1000)
  for (const { transform, rotate, card } of await depthTransforms(page)) {
    expect(transform).toBe('none')
    if (card) expect(rotate).not.toBe('none')
  }
})

test('orbit cards clear the hero copy with the pointer in every corner at 1025', async ({ page }) => {
  await openMotionHome(page, 1025, 900)
  const heroHeight = (await page.locator('#top').boundingBox())!.height
  for (const scrollY of [0, Math.round(heroHeight / 2)]) {
    await page.evaluate((y) => window.scrollTo(0, y), scrollY)
    for (const [x, y] of [[1, 1], [1024, 1], [1, 899], [1024, 899]]) {
      await page.mouse.move(x, y, { steps: 3 })
      await page.waitForTimeout(1100)
      const cards = await page.locator('[data-orbit-card]').evaluateAll((nodes) =>
        nodes.filter((n) => n.getClientRects().length > 0).map((n) => {
          const { x, y, width, height } = n.getBoundingClientRect()
          return { x, y, width, height }
        }),
      )
      const copy = [
        ...(await textLines(page.locator('[data-hero-line]'))),
        (await page.locator('#top p').boundingBox())!,
        (await page.locator('#top a[href="/contact"]').locator('..').boundingBox())!,
      ]
      for (const card of cards) for (const box of copy) expect(intersects(card, box), `scrollY ${scrollY}, pointer ${x},${y}`).toBe(false)
    }
  }
})

for (const [width, height] of [[1440, 900], [769, 800]]) {
  test(`focused controls are never hidden behind fixed UI at ${width}x${height}`, async ({ page }) => {
    await openMotionHome(page, width, height)
    const check = () =>
      page.evaluate(() => {
        const el = document.activeElement
        if (!el || !el.closest('main, footer')) return null
        const r = el.getBoundingClientRect()
        const overlap = (o: Element | null) => {
          if (!o || !o.getClientRects().length) return 0
          const b = o.getBoundingClientRect()
          return Math.max(0, Math.min(r.right, b.right) - Math.max(r.left, b.left)) * Math.max(0, Math.min(r.bottom, b.bottom) - Math.max(r.top, b.top))
        }
        const covered = [
          document.querySelector('nav[aria-label="Page chapters"]'),
          document.querySelector('a[aria-label="WhatsApp — chat"]'),
          document.querySelector('header'),
        ]
          .filter((o) => o && !o.contains(el))
          .reduce((sum, o) => sum + overlap(o), 0)
        return { label: el.textContent?.trim().slice(0, 40) || el.tagName, covered, area: r.width * r.height }
      })
    const seen = new Set<string>()
    for (const key of ['Tab', 'Shift+Tab']) {
      for (let i = 0; i < 160; i++) {
        await page.keyboard.press(key)
        await page.waitForTimeout(30)
        const result = await check()
        if (!result) continue
        seen.add(result.label)
        expect(result.covered, `${key} → "${result.label}"`).toBeLessThan(result.area)
      }
    }
    expect(seen.size).toBeGreaterThan(10)
  })
}

test('touch phones get the scroll depth but no pointer depth', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })
  const page = await context.newPage()
  await openMotionHome(page, 390, 844)
  await expect(page.locator('[data-home-experience]')).toHaveAttribute('data-home-motion', 'active')
  const slot = page.locator('[data-orbit-slot="1"]')
  await page.evaluate(() => window.scrollTo(0, 300))
  await expect.poll(() => slot.evaluate((n) => getComputedStyle(n).transform)).not.toBe('none')
  await expect(page.locator('[data-orbit-card]').first()).toHaveCSS('transform', 'none')
  await context.close()
})
