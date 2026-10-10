import { expect, test, type Locator, type Page } from '@playwright/test'
import {
  getClientCountries,
  getDeliveryMetrics,
  getProjectStatus,
  partitionProjects,
} from '../../src/app/work/work-projects'
import { CASE_STUDIES } from '../../src/data/case-studies'

// /about ACs (docs/specs/10.1-about.md): content and layout first, then motion
// (AboutMotion: ACs 26–30, UX U2–U6) at the end of the file.
const totals = getDeliveryMetrics(CASE_STUDIES)
const countries = getClientCountries(CASE_STUDIES)
const { featured, remaining } = partitionProjects(CASE_STUDIES)
const ordered = [...featured, ...remaining]
const HONESTY = /note from the founder|founder, techwise iq|freelancer|trusted by/i

const experience = (page: Page) => page.getByTestId('about-experience')

test('metadata, JSON-LD and honesty rules', async ({ page }) => {
  await page.goto('/about')
  await expect(page).toHaveTitle('About Techwise IQ | Websites, Software & AI in Dubai')

  const description = await page.locator('meta[name="description"]').getAttribute('content')
  const ogDescription = await page.locator('meta[property="og:description"]').getAttribute('content')
  expect(description).toBe(
    'A team of experts in Dubai building websites, custom software and AI automation for businesses in Dubai and beyond. Clients in the UAE and India.',
  )
  expect(ogDescription!.length).toBeGreaterThanOrEqual(20)
  for (const text of [description!, ogDescription!, await page.locator('main').innerText()]) {
    expect(text).not.toMatch(HONESTY)
  }

  const ld = JSON.parse((await page.locator('script[type="application/ld+json"]').first().textContent())!)
  expect(ld['@type']).toBe('AboutPage')
  expect(ld.mainEntity['@id']).toBe('https://techwiseiq.com/#organization')
  expect(JSON.stringify(ld)).not.toMatch(/founder|numberOfEmployees|aggregateRating|review|award|priceRange|price/i)

  const main = await page.locator('main').innerText()
  expect(main).not.toMatch(/USD 200M|25\+ countries|guarantee|weekly demo|SLA\b/i)
})

test('heading outline: one h1, section h2s, item h3s', async ({ page }) => {
  await page.goto('/about')
  const root = experience(page)
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1)
  await expect(root.getByRole('heading', { level: 1 })).toHaveText(
    'Websites, software and AI automation. Minus the agency theatre.',
  )
  await expect(root.getByRole('heading', { level: 2 })).toHaveText([
    'Agencies sell hours. We sell outcomes.',
    'Work you can open and check.',
    'You decide. We deliver.',
    'The non-negotiables.',
    'Pick your problem.',
    'Got a problem worth fixing?',
  ])
  await expect(root.locator('#track-record h3')).toHaveText(ordered.map((cs) => cs.title))
  await expect(root.locator('#process h3')).toHaveCount(4)
  await expect(root.locator('#services h3')).toHaveText(['Websites.', 'Custom software.', 'AI automation.'])
  for (const id of ['short-version', 'track-record', 'process', 'commitments', 'services', 'about-cta']) {
    const labelledBy = await root.locator(`section#${id}`).getAttribute('aria-labelledby')
    await expect(root.locator(`#${labelledBy}`)).toHaveCount(1)
  }
})

test('hero copy and fact sheet', async ({ page }) => {
  await page.goto('/about')
  const root = experience(page)
  await expect(root.getByText(/a team of experts/i)).toBeVisible()
  await expect(root.getByText('You bring the goal. We sweat the technical path.')).toBeVisible()

  const facts = root.locator('dl[aria-label="Company facts"]')
  const rows = await facts.locator(':scope > div').evaluateAll((divs) =>
    divs.map((div) => [
      div.querySelector('dt')!.textContent!.trim(),
      (div.querySelector('dd [aria-hidden="true"]') ?? div.querySelector('dd'))!.textContent!.replace(/ /g, ' ').trim(),
    ]),
  )
  expect(rows).toEqual([
    ['Based', 'Dubai, UAE'],
    ['We build', 'Websites · Custom software · AI automation'],
    ['Clients in', countries.map((c) => c.country).join(' · ')],
    ['Live client sites', totals[0].value],
    ['Live sites, brief to launch', `${totals[2].value} weeks`],
    ['First reply', 'Within 24 hours'],
  ])
  expect(await facts.innerText()).not.toMatch(/typical/i)
})

test('short version keeps the approved lines and a plain accessible name', async ({ page }) => {
  await page.goto('/about')
  const root = experience(page)
  const h2 = root.locator('#short-version-title')
  await expect(h2).toHaveAccessibleName('Agencies sell hours. We sell outcomes.')
  await expect(h2.locator('[data-lit-word]')).toHaveCount(6)
  await expect(root.getByText('Building for businesses in Dubai and beyond.')).toBeVisible()
})

test('track record: data-derived totals, every build, honest status', async ({ page }) => {
  // Content check on the final markup; the count-up itself is covered by the motion tests.
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/about')
  const root = experience(page)

  const totalsDl = root.locator('dl[aria-label="Live client work totals"]')
  await expect(totalsDl.locator('dt')).toHaveText(totals.map((t) => t.label))
  await expect(totalsDl.locator('[data-count]')).toHaveText(totals.map((t) => t.value))
  for (const dd of await totalsDl.locator('dd').all()) {
    await expect(dd.locator('[data-count]')).toHaveAttribute('aria-hidden', 'true')
    const spoken = (await dd.locator('.sr-only').textContent())!
    expect(spoken.replace(' to ', '–')).toBe(await dd.locator('[data-count]').textContent())
    expect(await dd.getAttribute('aria-live')).toBeNull()
  }

  const cards = root.locator('[data-card]')
  await expect(cards).toHaveCount(CASE_STUDIES.length)
  for (const [i, cs] of ordered.entries()) {
    const card = cards.nth(i)
    await expect(card.getByText(getProjectStatus(cs), { exact: true })).toBeVisible()
    const links = card.locator('a:not([tabindex="-1"])')
    await expect(links).toHaveCount(1)
    await expect(links).toHaveAttribute('href', `/work/${cs.slug}`)
    await expect(links).toHaveAccessibleName(`Read full case study for ${cs.title}`)
    const cover = card.locator('a[tabindex="-1"]')
    await expect(cover).toHaveAttribute('aria-hidden', 'true')
    await expect(cover).toHaveAttribute('href', `/work/${cs.slug}`)
  }
  await expect(root.locator('[data-card]', { hasText: 'AASKRA' }).getByText('Preview build')).toBeVisible()
  await expect(root.locator('[data-card]', { hasText: 'RSiGHT' }).getByText('Awaiting launch')).toBeVisible()
  await expect(root.locator('#track-record a[target="_blank"]')).toHaveCount(0)

  // Map: only getClientCountries output, counts derived, SVG hidden, sr-only text present.
  const map = root.locator('[data-route-map]')
  await expect(map.locator('svg')).toHaveAttribute('aria-hidden', 'true')
  const plural = (n: number) => `${n} build${n === 1 ? '' : 's'}`
  await expect(map.locator('.sr-only')).toHaveText(
    countries.map((c) => `${c.country}: ${plural(c.count)}.`).join(' '),
  )
  const svgText = (await map.locator('svg text').allTextContents()).join(' ')
  expect(svgText.replace(/Dubai \(hub\)|UAE|India|·|\d+ builds?/g, '').trim()).toBe('')
  await expect(map.locator('figcaption')).toHaveText('Run from Dubai. Clients in the UAE and India.')
})

test('process: four illustrative frames, no focusables, no price digits', async ({ page }) => {
  // Unpinned layout (the rail only shows while pinned; see the motion tests).
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/about')
  const root = experience(page)
  await expect(root.locator('#process ol > li[data-step]')).toHaveCount(4)
  const frames = root.locator('#process figure')
  await expect(frames).toHaveCount(4)
  const names = ['Requirements', 'Options', 'Scope', 'Build log']
  for (const [i, name] of names.entries()) {
    const frame = frames.nth(i)
    await expect(frame).toHaveAccessibleName(`${name} Illustrative`)
    await expect(frame.getByText('Illustrative', { exact: true })).toBeVisible()
    await expect(frame.locator('figcaption')).toHaveText('Sample brief, not a client project.')
    await expect(frame.locator('a, button, [tabindex], input')).toHaveCount(0)
    expect(await frame.innerText()).not.toMatch(/AED|USD|\$|€|£|dirham/i)
  }
  const price = frames.nth(2).locator('div', { has: page.locator('dt', { hasText: 'Price' }) }).last()
  expect(await price.innerText()).not.toMatch(/\d/)
  await expect(frames.nth(1).getByText('Our pick')).toBeVisible()
  await expect(root.locator('[data-rail]')).toHaveAttribute('aria-hidden', 'true')
  await expect(root.locator('[data-rail]')).toBeHidden()
})

test('commitments: exactly five, each traced to a decision', async ({ page }) => {
  await page.goto('/about')
  const rows = experience(page).locator('[data-commitment]')
  await expect(rows).toHaveCount(5)
  expect(await rows.evaluateAll((els) => els.map((el) => el.getAttribute('data-commitment')))).toEqual([
    'D-027', 'D-033', 'D-033', 'D-041', 'D-037',
  ])
  await expect(rows.nth(3)).toContainText(/no game of telephone/i)
  for (const svg of await experience(page).locator('svg:has([data-draw])').all()) {
    await expect(svg).toHaveAttribute('aria-hidden', 'true')
  }
})

test('service rows link to the three services with the KEEP copy', async ({ page }) => {
  await page.goto('/about')
  const rows = experience(page).locator('[data-path]')
  const expected = [
    ['Websites.', '/services/web', 'A website that undersells you', 'A website that gets noticed and gets people to act.'],
    ['Custom software.', '/services/software', 'Work trapped in spreadsheets', 'Software built around how your business really runs.'],
    ['AI automation.', '/services/ai', 'Repetitive work slowing people down', 'Automation that does the busywork, with a person in charge.'],
  ]
  await expect(rows).toHaveCount(3)
  for (const [i, [name, href, problem, outcome]] of expected.entries()) {
    const row = rows.nth(i)
    const link = row.getByRole('link')
    await expect(link).toHaveCount(1)
    await expect(link).toHaveAttribute('href', href)
    await expect(link).toHaveAccessibleName(name)
    await expect(row.locator('dl').first().locator('dd')).toHaveText(problem)
    await expect(row.locator('dl').last().locator('dd')).toHaveText(outcome)
  }
})

test('keyboard: exactly nine tab stops in main, in order', async ({ page }) => {
  await page.goto('/about')
  await page.locator('#about-title').click()
  const stops: string[] = []
  for (let i = 0; i < 20; i++) {
    await page.keyboard.press('Tab')
    const href = await page.evaluate(() => {
      const el = document.activeElement
      return el?.closest('main') ? el.getAttribute('href') ?? el.tagName : null
    })
    if (href === null) break
    stops.push(href)
  }
  expect(stops).toEqual([
    ...ordered.map((cs) => `/work/${cs.slug}`),
    '/services/web',
    '/services/software',
    '/services/ai',
    '/contact',
  ])
})

for (const [width, height] of [[390, 844], [1440, 900]]) {
  test(`one compact CTA at ${width}px, at most half the footer heading`, async ({ page }) => {
    await page.setViewportSize({ width, height })
    await page.goto('/about')
    const cta = page.locator('main a[href="/contact"]')
    await expect(cta).toHaveCount(1)
    await expect(cta).toHaveAccessibleName(/^Bring us the problem/)
    const size = (sel: string) =>
      page.locator(sel).evaluate((el) => Number.parseFloat(getComputedStyle(el).fontSize))
    expect(await size('#about-cta-title')).toBeLessThanOrEqual((await size('#footer-title')) * 0.5)
  })
}

test('fact sheet sits right of the h1, both above the fold at 1440×900', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/about')
  const h1 = (await page.locator('#about-title').boundingBox())!
  const facts = (await page.locator('dl[aria-label="Company facts"]').boundingBox())!
  expect(h1.y + h1.height).toBeLessThanOrEqual(900)
  expect(facts.y + facts.height).toBeLessThanOrEqual(900)
  expect(facts.x).toBeGreaterThanOrEqual(h1.x + h1.width)
})

test('at 390 the problem → outcome relationship is visible text', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/about')
  const row = experience(page).locator('[data-path]').first()
  await expect(row.getByText('The problem')).toBeVisible()
  await expect(row.getByText('What you get')).toBeVisible()
})

for (const [width, height] of [[320, 568], [375, 667], [390, 844], [768, 1024], [1024, 768], [1280, 800], [1440, 900]]) {
  test(`stays inside ${width}px with a 44px CTA`, async ({ page }) => {
    await page.setViewportSize({ width, height })
    await page.goto('/about')
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
    const box = await page.locator('main a[href="/contact"]').boundingBox()
    expect(box!.height).toBeGreaterThanOrEqual(44)
  })
}

test('card links are 44px tap targets on touch at 390', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true })
  const page = await context.newPage()
  await page.goto('/about')
  // Asserted, not skipped: if emulation stops reporting a coarse pointer the 44px
  // guard (B1) would go untested without anyone noticing.
  expect(await page.evaluate(() => matchMedia('(pointer: coarse)').matches)).toBe(true)
  const links = experience(page).locator('[data-card] a:not([tabindex="-1"])')
  await expect(links).toHaveCount(CASE_STUDIES.length)
  for (const link of await links.all()) {
    expect((await link.boundingBox())!.height).toBeGreaterThanOrEqual(44)
  }
  await context.close()
})

test('everything is visible and final without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  const page = await context.newPage()
  await page.goto('/about')
  const root = experience(page)
  await expect(root).toHaveAttribute('data-about-motion', 'static')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await expect(root.locator('[data-count]')).toHaveText(totals.map((t) => t.value))
  for (const sel of ['[data-about-reveal]', '[data-lit-word]', '#process figure', '[data-commitment]', '[data-path]']) {
    for (const el of await root.locator(sel).all()) {
      await expect(el).toBeVisible()
      expect(await el.evaluate((node) => getComputedStyle(node).opacity)).toBe('1')
    }
  }
  await expect(root.getByText(/no game of telephone/i)).toBeVisible()
  await expect(root.locator('[data-process]')).not.toHaveAttribute('data-process-pinned')
  expect(await drawnState(root)).toEqual({ undrawn: 0 })
  await context.close()
})

// ─── Motion (AboutMotion) ───────────────────────────────────────────────────

const PIN_VIEWPORT = { width: 1440, height: 900 }
const finePointer = (page: Page) => page.evaluate(() => matchMedia('(pointer: fine)').matches)

/** Every drawn path outside the hidden rail is fully drawn (offset 0 or no dash at all). */
function drawnState(root: Locator) {
  return root.evaluate((el) => ({
    undrawn: [...el.querySelectorAll<SVGPathElement>('[data-draw]')]
      .filter((path) => path.getClientRects().length > 0)
      .filter((path) => {
        const cs = getComputedStyle(path)
        return cs.strokeDasharray !== 'none' && Number.parseFloat(cs.strokeDashoffset) !== 0
      }).length,
  }))
}

/** Lenis can carry a native jump past its target: re-apply until the page holds it. */
async function holdScroll(page: Page, y: number) {
  await expect
    .poll(() =>
      page.evaluate((target) => {
        window.scrollTo(0, target)
        return Math.abs(window.scrollY - target) <= 1
      }, Math.round(y)),
    )
    .toBe(true)
}

/** Scroll to a point in the 03 pin (0 = pin start, 1 = pin end). */
async function scrollPin(page: Page, fraction: number) {
  const { top, length } = await page.evaluate(() => {
    const spacer = document.querySelector('[data-process-stage]')!.parentElement!
    return { top: spacer.getBoundingClientRect().top + window.scrollY, length: spacer.offsetHeight - window.innerHeight }
  })
  await holdScroll(page, top + length * fraction)
}

const stepOpacities = (root: Locator) =>
  root.locator('[data-step]').evaluateAll((steps) => steps.map((step) => getComputedStyle(step).opacity))

/** Stacked steps: each one starts at or below the previous one's bottom. */
const stepsOverlap = (root: Locator) =>
  root.locator('[data-step]').evaluateAll((steps) =>
    steps.slice(1).some((step, i) => step.getBoundingClientRect().top < steps[i].getBoundingClientRect().bottom - 1),
  )

test('the 03 pin arms at 1440×900 and keeps all four steps in the accessibility tree', async ({ page }) => {
  await page.setViewportSize(PIN_VIEWPORT)
  await page.goto('/about')
  test.skip(!(await finePointer(page)), 'this browser reports no fine pointer (headless Linux)')
  const root = experience(page)
  await expect(root).toHaveAttribute('data-about-motion', 'active')
  const process = root.locator('[data-process]')
  await expect(process).toHaveAttribute('data-process-pinned', '')
  await expect(root.locator('[data-process-stage]')).toHaveCount(1)
  // At most 3 extra viewport heights of scroll (AC26).
  const spacer = await page.evaluate(() => document.querySelector('[data-process-stage]')!.parentElement!.offsetHeight)
  expect(spacer).toBeLessThanOrEqual(PIN_VIEWPORT.height * 4 + 1)

  await scrollPin(page, 0.5)
  await expect.poll(async () => Math.abs((await root.locator('[data-process-stage]').boundingBox())!.y)).toBeLessThanOrEqual(1)
  await expect(root.locator('[data-rail]')).toBeVisible()
  // Hidden steps are opacity only: still headings, figures and list items to AT.
  await expect(process.getByRole('heading', { level: 3 })).toHaveCount(4)
  await expect(process.getByRole('figure')).toHaveCount(4)
  expect(await stepOpacities(root)).toContain('0')
  for (const step of await root.locator('[data-step]').all()) {
    expect(
      await step.evaluate((el) => {
        const cs = getComputedStyle(el)
        return [cs.visibility, cs.display, el.closest('[aria-hidden="true"], [inert], [hidden]') === null]
      }),
    ).toEqual(['visible', 'grid', true])
  }
})

test('the 03 pin ends on step 04 with every check drawn, and reverses', async ({ page }) => {
  await page.setViewportSize(PIN_VIEWPORT)
  await page.goto('/about')
  test.skip(!(await finePointer(page)), 'this browser reports no fine pointer (headless Linux)')
  const root = experience(page)
  await expect(root.locator('[data-process]')).toHaveAttribute('data-process-pinned', '')

  await scrollPin(page, 1)
  await expect.poll(() => stepOpacities(root)).toEqual(['0', '0', '0', '1'])
  await expect(root.locator('[data-step]').nth(3)).toHaveAttribute('data-step-active', '')
  await expect(root.locator('[data-rail-fill]')).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, 0)')
  expect(
    await root.locator('[data-process] [data-draw]').evaluateAll((paths) =>
      paths.map((path) => getComputedStyle(path).strokeDashoffset),
    ),
  ).toEqual(Array(9).fill('0px'))

  await scrollPin(page, 0)
  await expect.poll(() => stepOpacities(root)).toEqual(['1', '0', '0', '0'])
  await expect(root.locator('[data-step]').first()).toHaveAttribute('data-step-active', '')
})

test('reduced motion: final states, no pin, no transforms', async ({ page }) => {
  await page.setViewportSize(PIN_VIEWPORT)
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/about')
  const root = experience(page)
  await expect(root).toHaveAttribute('data-about-motion', 'reduced')
  await expect(root.locator('[data-process]')).not.toHaveAttribute('data-process-pinned')
  await expect(page.locator('.pin-spacer')).toHaveCount(0)
  await expect(root.locator('[data-rail]')).toBeHidden()
  await expect(root.locator('[data-count]')).toHaveText(totals.map((t) => t.value))
  const styled = await root.evaluate((el) =>
    [...el.querySelectorAll('[data-about-reveal], [data-lit-word], [data-step], [data-cover-depth], [data-map-remote]')]
      .filter((node) => getComputedStyle(node).opacity !== '1' || getComputedStyle(node).transform !== 'none').length,
  )
  expect(styled).toBe(0)
  expect(await drawnState(root)).toEqual({ undrawn: 0 })
  expect(await stepsOverlap(root)).toBe(false)
})

test('resizing below 1024px mid-pin unpins and restacks the steps', async ({ page }) => {
  await page.setViewportSize(PIN_VIEWPORT)
  await page.goto('/about')
  test.skip(!(await finePointer(page)), 'this browser reports no fine pointer (headless Linux)')
  const root = experience(page)
  await expect(root.locator('[data-process]')).toHaveAttribute('data-process-pinned', '')
  await scrollPin(page, 0.5)
  await expect.poll(() => stepOpacities(root)).not.toEqual(['1', '0', '0', '0'])

  await page.setViewportSize({ width: 900, height: 900 })
  await expect(root.locator('[data-process]')).not.toHaveAttribute('data-process-pinned')
  await expect(page.locator('.pin-spacer')).toHaveCount(0)
  await expect(root.locator('[data-step][data-step-active]')).toHaveCount(0)
  await expect(root.locator('[data-rail]')).toBeHidden()
  expect(await stepsOverlap(root)).toBe(false)
  await expect(root.locator('[data-count]')).toHaveText(totals.map((t) => t.value))
})

test('a stage that stops fitting mid-pin restacks in place, with no smooth glide', async ({ page }) => {
  // The fit guard (S1) and its instant compensation (B2), isolated from the pin
  // media query: the viewport stays 1440×900, so matchMedia never re-runs and only
  // the refresh-time fit check can restack.
  await page.setViewportSize(PIN_VIEWPORT)
  await page.goto('/about')
  test.skip(!(await finePointer(page)), 'this browser reports no fine pointer (headless Linux)')
  const root = experience(page)
  const process = root.locator('[data-process]')
  await expect(process).toHaveAttribute('data-process-pinned', '')
  await scrollPin(page, 0.5)
  await expect.poll(async () => Math.abs((await root.locator('[data-process-stage]').boundingBox())!.y)).toBeLessThanOrEqual(1)
  await expect(root.locator('[data-step][data-step-active]')).toHaveCount(1)

  // Frame-accurate, in the page: the active step's top on the last pinned frame
  // (after the refresh, before the rebuild), then on the first unpinned frame and
  // the two after it. Sampling from Playwright would be too late: a smooth
  // compensation could already have glided most of the way back.
  type Restack = { index: number; before: number; after: number[] }
  await page.evaluate(() => {
    const w = window as typeof window & { __restack?: Promise<Restack> }
    const process = document.querySelector('[data-process]')!
    const steps = [...document.querySelectorAll('[data-step]')]
    w.__restack = new Promise<Restack>((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('the stage never restacked')), 5000)
      let last: { index: number; top: number } | null = null
      const record = () => {
        if (process.hasAttribute('data-process-pinned')) {
          const index = steps.findIndex((step) => step.hasAttribute('data-step-active'))
          if (index >= 0) last = { index, top: steps[index].getBoundingClientRect().top }
          requestAnimationFrame(record)
          return
        }
        clearTimeout(timeout)
        if (!last) return reject(new Error('unpinned before any active step was recorded'))
        const { index, top: before } = last
        const sample = () => steps[index].getBoundingClientRect().top
        const after = [sample()]
        requestAnimationFrame(() => {
          after.push(sample())
          requestAnimationFrame(() => resolve({ index, before, after: [...after, sample()] }))
        })
      }
      requestAnimationFrame(record)
    })
    // Rejections surface through the await below, not as an unhandled error.
    w.__restack.catch(() => {})
  })
  // Make the pinned stage taller than the viewport without moving anything above
  // 03 (so the pin's start and the scroll progress stay put), then fire the resize
  // a zoom would: ScrollTrigger refreshes and the fit guard sees the overflow.
  await page.addStyleTag({ content: '[data-step-text] { padding-bottom: 100vh; }' })
  await page.evaluate(() => window.dispatchEvent(new Event('resize')))
  const { index, before, after } = await page.evaluate(
    () => (window as typeof window & { __restack?: Promise<Restack> }).__restack!,
  )

  expect(index).toBeGreaterThan(0) // mid-pin, past step 01: the compensation path ran
  for (const top of after) expect(Math.abs(top - before)).toBeLessThanOrEqual(2)
  await expect(process).not.toHaveAttribute('data-process-pinned')
  await expect(page.locator('.pin-spacer')).toHaveCount(0)
  await expect(root.locator('[data-step-active]')).toHaveCount(0)
  const step = root.locator('[data-step]').nth(index)
  expect(await step.evaluate((el) => getComputedStyle(el).opacity)).toBe('1')
  await expect(root.locator('[data-count]')).toHaveText(totals.map((t) => t.value))
  // Nothing (Lenis, a late refresh) drags the page away afterwards.
  await page.waitForTimeout(500)
  expect(Math.abs((await step.evaluate((el) => el.getBoundingClientRect().top)) - before)).toBeLessThanOrEqual(2)
})

test('a reduced-motion flip mid-count leaves the final digits', async ({ page }) => {
  await page.setViewportSize(PIN_VIEWPORT)
  await page.goto('/about')
  const root = experience(page)
  await expect(root).toHaveAttribute('data-about-motion', 'active')
  const counts = root.locator('[data-totals] [data-count]')
  // Below the fold at load, so the count-up is armed from zero.
  await expect(counts.first()).toHaveText('0')
  await holdScroll(page, await root.locator('[data-totals]').evaluate((el) => el.getBoundingClientRect().top + window.scrollY - 300))
  await page.waitForTimeout(150)
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect(root).toHaveAttribute('data-about-motion', 'reduced')
  await expect(counts).toHaveText(totals.map((t) => t.value))
  await page.waitForTimeout(1200) // longer than the count: nothing writes after the flip
  await expect(counts).toHaveText(totals.map((t) => t.value))
  for (const dd of await root.locator('[data-totals] dd').all()) {
    expect((await dd.locator('.sr-only').textContent())!.replace(' to ', '–')).toBe(await dd.locator('[data-count]').textContent())
  }
})

/** Tab from the header CTA until focus enters main; return that first stop's href. */
async function firstMainStop(page: Page) {
  await page.locator('header a[href="/contact"]').last().focus()
  for (let i = 0; i < 15; i++) {
    await page.keyboard.press('Tab')
    const href = await page.evaluate(() => {
      const el = document.activeElement
      return el?.closest('main') ? el.getAttribute('href') : null
    })
    if (href) return href
  }
  return null
}

test('Tab from the header reaches card link 1 while the motion is active', async ({ page }) => {
  await page.setViewportSize(PIN_VIEWPORT)
  await page.goto('/about')
  const root = experience(page)
  await expect(root).toHaveAttribute('data-about-motion', 'active')
  expect(await firstMainStop(page)).toBe(`/work/${ordered[0].slug}`)
  // The focus net finishes the card's reveal: the focused link is never invisible.
  await expect.poll(() => root.locator('[data-card]').first().evaluate((el) => getComputedStyle(el).opacity)).toBe('1')
})

test('Tab from the header reaches card link 1 while the motion is pending', async ({ page }) => {
  await page.setViewportSize(PIN_VIEWPORT)
  // No bundle: the inline bootstrap arms "pending" and nothing ever resolves it early.
  await page.route('**/_next/static/chunks/**', (route) => route.abort())
  await page.goto('/about', { waitUntil: 'domcontentloaded' })
  const root = experience(page)
  await expect(root).toHaveAttribute('data-about-motion', 'pending')
  expect(await firstMainStop(page)).toBe(`/work/${ordered[0].slug}`)
  expect(await root.locator('[data-card]').first().evaluate((el) => getComputedStyle(el).opacity)).toBe('1')
  // Fail open: the content comes back on its own.
  await expect(root).toHaveAttribute('data-about-motion', 'static', { timeout: 5000 })
})

test('coarse pointer at 390: no pin, steps stack', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true })
  const page = await context.newPage()
  await page.goto('/about')
  const root = experience(page)
  await expect(root).toHaveAttribute('data-about-motion', 'active')
  await holdScroll(page, await root.locator('[data-process]').evaluate((el) => el.getBoundingClientRect().top + window.scrollY))
  await expect(root.locator('[data-process]')).not.toHaveAttribute('data-process-pinned')
  await expect(page.locator('.pin-spacer')).toHaveCount(0)
  await expect(root.locator('[data-rail]')).toBeHidden()
  expect(await stepsOverlap(root)).toBe(false)
  await context.close()
})

test('coarse pointer at desktop width: no pin', async ({ browser }) => {
  const context = await browser.newContext({ viewport: PIN_VIEWPORT, hasTouch: true, isMobile: true })
  const page = await context.newPage()
  await page.goto('/about')
  test.skip(!(await page.evaluate(() => matchMedia('(pointer: coarse)').matches)), 'touch emulation did not report a coarse pointer')
  await expect(experience(page)).toHaveAttribute('data-about-motion', 'active')
  await expect(experience(page).locator('[data-process]')).not.toHaveAttribute('data-process-pinned')
  await expect(page.locator('.pin-spacer')).toHaveCount(0)
  await context.close()
})

test('a reload with scroll restored below 03 shifts nothing (CLS < 0.05)', async ({ page }) => {
  await page.setViewportSize(PIN_VIEWPORT)
  await page.goto('/about')
  await expect(experience(page)).toHaveAttribute('data-about-motion', 'active')
  await holdScroll(page, await page.locator('#commitments').evaluate((el) => el.getBoundingClientRect().top + window.scrollY + 100))
  await page.addInitScript(() => {
    const w = window as typeof window & { __cls: number }
    w.__cls = 0
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as (PerformanceEntry & { value: number; hadRecentInput: boolean })[]) {
        if (!entry.hadRecentInput) w.__cls += entry.value
      }
    }).observe({ type: 'layout-shift', buffered: true })
  })
  await page.reload()
  const root = experience(page)
  await expect(root).toHaveAttribute('data-about-motion', 'active')
  await page.waitForTimeout(1500)
  expect(await page.evaluate(() => (window as typeof window & { __cls: number }).__cls)).toBeLessThan(0.05)
  // Already passed is final: the ledger in view is not waiting on a reveal.
  if (await page.evaluate(() => window.scrollY > 0)) {
    expect(await root.locator('[data-commitment]').evaluateAll((rows) => rows.map((row) => getComputedStyle(row).opacity))).toEqual(
      Array(5).fill('1'),
    )
  }
})
