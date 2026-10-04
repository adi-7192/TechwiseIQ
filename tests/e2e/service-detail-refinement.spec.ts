import { expect, test } from '@playwright/test'

const services = ['web', 'software', 'ai'] as const

for (const service of services) {
  test(`${service}: readable layouts, service links, and no WebGL`, async ({ page }, testInfo) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto(`/services/${service}`)
    for (const width of [320, 390, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 1000 })
      await page.evaluate(() => document.fonts.ready)
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true
      )
      await expect(page.locator('h1')).toBeVisible()
      if (width === 390 || width === 1440) {
        for (const image of await page.locator('#work img').all()) {
          await image.scrollIntoViewIfNeeded()
          await expect
            .poll(() => image.evaluate((element) => (element as HTMLImageElement).naturalWidth))
            .toBeGreaterThan(0)
        }
        await page.evaluate(() => window.scrollTo(0, 0))
        await page.screenshot({
          path: testInfo.outputPath(`${service}-${width}.png`),
          fullPage: true,
        })
        await page.screenshot({ path: testInfo.outputPath(`${service}-${width}-hero.png`) })
      }
    }
    await expect(page.locator('canvas')).toHaveCount(0)
    await expect(page.getByTestId('service-handover')).toContainText('What you take forward.')
    await expect(page.getByTestId('service-expertise')).toBeVisible()
    await expect(
      page.locator('main').getByRole('link', { name: 'Bring us the problem', exact: true })
    ).toHaveAttribute('href', '/contact')
    for (const other of services.filter((item) => item !== service)) {
      await expect(
        page.locator(`section[aria-label="Other services"] a[href="/services/${other}"]`)
      ).toHaveCount(1)
    }
  })

  test(`${service}: questions open by keyboard and match structured data`, async ({ page }) => {
    await page.goto(`/services/${service}`)
    const questions = page.locator('#questions details')
    const graph = await page.locator('script[type="application/ld+json"]').first().textContent()
    const faq = JSON.parse(graph!)['@graph'].find(
      (item: { '@type': string }) => item['@type'] === 'FAQPage'
    )
    await expect(questions).toHaveCount(faq.mainEntity.length)
    for (let i = 0; i < faq.mainEntity.length; i++) {
      const entry = questions.nth(i)
      await expect(entry.locator('summary')).toContainText(faq.mainEntity[i].name)
      await expect(entry.locator('p')).toHaveText(faq.mainEntity[i].acceptedAnswer.text)
    }
    await questions.last().locator('summary').focus()
    await page.keyboard.press('Enter')
    await expect(questions.last()).toHaveAttribute('open', '')
    await expect(questions.last().locator('p')).toBeVisible()
  })

  test(`${service}: demonstration loops and preserves manual pause`, async ({ page }) => {
    test.setTimeout(45000)
    await page.setViewportSize({ width: 1440, height: 1000 })
    await page.goto(`/services/${service}`)
    const demo = page.locator(`[data-demo="${service}"]`)
    await demo.scrollIntoViewIfNeeded()
    await expect(demo).toHaveAttribute('data-step', '3', { timeout: 14000 })
    await expect(demo).toHaveAttribute('data-step', '0', { timeout: 14000 })
    await expect(demo).toHaveAttribute('data-step', '3', { timeout: 14000 })
    await demo.getByRole('button', { name: 'Pause', exact: true }).click()
    const progress = () =>
      demo
        .locator('[data-stage-fill]')
        .evaluateAll((elements) =>
          elements.map((element) => element.getAttribute('style')).join('|')
        )
    const paused = await progress()
    await page.waitForTimeout(350)
    expect(await progress()).toBe(paused)
    await page.locator('#questions').scrollIntoViewIfNeeded()
    await demo.scrollIntoViewIfNeeded()
    expect(await progress()).toBe(paused)
    await demo.getByRole('button', { name: 'Play', exact: true }).click()
    await expect.poll(progress, { timeout: 7000 }).not.toBe(paused)
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await expect(demo.getByRole('button', { name: 'Pause', exact: true })).toHaveCount(0)
    await expect(demo).toHaveAttribute('data-step', '3')
  })

  test(`${service}: content and questions work without JavaScript`, async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false })
    const page = await context.newPage()
    await page.goto(`/services/${service}`)
    await expect(page.locator(`[data-demo="${service}"]`)).toHaveAttribute('data-step', '3')
    const question = page.locator('#questions details').last()
    await question.locator('summary').click()
    await expect(question.locator('p')).toBeVisible()
    await expect(page.getByTestId('service-handover')).toBeVisible()
    await context.close()
  })
}
