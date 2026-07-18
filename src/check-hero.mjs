import { chromium } from '@playwright/test'
const browser = await chromium.launch({ channel: 'chrome' })
for (const width of [320, 360, 430, 500]) {
  const ctx = await browser.newContext({ viewport: { width, height: 800 }, reducedMotion: 'reduce' })
  const page = await ctx.newPage()
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(400)
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
  console.log(`${width}px overflow: ${overflow}px`)
  await page.screenshot({ path: `/tmp/hero-${width}.png` })
  await ctx.close()
}
await browser.close()
