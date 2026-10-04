import { expect, test } from '@playwright/test'

for (const service of ['web', 'software', 'ai']) {
  test(`${service}: every capability preview works on desktop and mobile`, async ({
    page,
  }, testInfo) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto(`/services/${service}`)
    const workbench = page.locator('[data-workbench]')
    const choices = workbench.locator('button[aria-controls="capability-preview"]')
    for (const width of [1440, 390, 320]) {
      await page.setViewportSize({ width, height: 1000 })
      for (let i = 0; i < 6; i++) {
        await choices.nth(i).click()
        await expect(choices.nth(i)).toHaveAttribute('aria-pressed', 'true')
        await expect(workbench.locator('#capability-preview h3')).not.toBeEmpty()
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
          true
        )
      }
      if (width !== 320) {
        await choices.nth(service === 'software' ? 4 : service === 'web' ? 1 : 2).click()
        await workbench.screenshot({ path: testInfo.outputPath(`${service}-studio-${width}.png`) })
      }
    }
    const delivery = page.locator('[data-delivery-controls] button')
    for (let i = 0; i < 4; i++) {
      await delivery.nth(i).click()
      await expect(delivery.nth(i)).toHaveAttribute('aria-pressed', 'true')
      await expect(page.locator('#delivery-preview h3')).toHaveText(
        await delivery.nth(i).locator('strong').innerText()
      )
    }
  })
}

test('design labs demonstrate real responsive, role, and exception behavior', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/services/web')
  let lab = page.locator('[data-decision-lab]')
  await lab.getByRole('button', { name: 'Mobile', exact: true }).click()
  await expect(lab.locator('[data-mobile]')).toHaveAttribute('data-mobile', 'true')
  await lab.getByRole('button', { name: 'Desktop', exact: true }).click()
  await expect(lab.locator('[data-mobile]')).toHaveAttribute('data-mobile', 'false')
  await page.goto('/services/software')
  lab = page.locator('[data-decision-lab]')
  await expect(lab.getByRole('button', { name: 'Approval requires an approver' })).toBeDisabled()
  await lab.getByRole('button', { name: 'Approver', exact: true }).click()
  await lab.getByRole('button', { name: 'Approve sample request' }).click()
  await expect(lab).toContainText('Approved and recorded')
  await page.goto('/services/ai')
  lab = page.locator('[data-decision-lab]')
  await lab.getByRole('button', { name: 'Missing details' }).click()
  await expect(lab.locator('[data-active="true"]')).toContainText('Ask for clarity')
  await lab.getByRole('button', { name: 'Complete enquiry' }).click()
  await expect(lab.locator('[data-active="true"]')).toContainText('Route to the team')
})

test('workbench motion preserves pause through scrolling and respects reduced motion', async ({
  page,
}) => {
  await page.goto('/services/web')
  const workbench = page.locator('[data-workbench]')
  await workbench.scrollIntoViewIfNeeded()
  const styles = () =>
    workbench
      .locator('[data-piece]')
      .evaluateAll((elements) => elements.map((el) => el.getAttribute('style')).join('|'))
  await workbench.getByRole('button', { name: 'Pause preview' }).click()
  const frozen = await styles()
  await page.waitForTimeout(350)
  expect(await styles()).toBe(frozen)
  await page.locator('#questions').scrollIntoViewIfNeeded()
  await workbench.scrollIntoViewIfNeeded()
  expect(await styles()).toBe(frozen)
  await workbench.getByRole('button', { name: 'Play preview' }).click()
  await expect.poll(styles, { timeout: 7000 }).not.toBe(frozen)
  await page.emulateMedia({ reducedMotion: 'reduce' })
  for (const piece of await workbench.locator('[data-piece]').all())
    await expect(piece).toHaveCSS('opacity', '1')
})
