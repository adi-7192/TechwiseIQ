import { expect, type Locator } from '@playwright/test'

/**
 * scrollIntoViewIfNeeded is a native jump that Lenis can carry past the target
 * (a demo was seen at 8% visible). Retry the jump until the page holds it.
 */
export async function scrollIntoViewHeld(target: Locator, offset = 40) {
  await expect
    .poll(() =>
      target.evaluate((el, off) => {
        const y = Math.round(el.getBoundingClientRect().top + window.scrollY - off)
        window.scrollTo(0, y)
        return Math.abs(window.scrollY - y) <= 1
      }, offset),
    )
    .toBe(true)
}
