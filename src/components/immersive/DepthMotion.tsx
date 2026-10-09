'use client'

import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/** Backdrop speed as a fraction of page scroll: lower = further behind the content. */
const BACKDROP_RATE = 0.3
const BACKDROP_RATE_PHONE = 0.15
const DEFAULT_DEPTH = 20

/**
 * Depth for routes that use the checkered backdrop (D-043). Two layers:
 *
 * - The backdrop pattern drifts up at a fraction of scroll speed, wrapping one
 *   checker tile, so it reads as a plane behind the page.
 * - `[data-depth="<px>"]` panels drift ±px across their pass through the
 *   viewport, ahead of the copy beside them — proof-object depth (§5.3).
 *
 * Both write only the compositor-friendly `transform` / `translate`, ride the
 * one Lenis → ScrollTrigger feed (no scroll listener of their own), and read no
 * layout per frame. Panels use the standalone `translate` property so their own
 * hover `transform`s still compose. Phones keep a slower backdrop and drop the
 * panel drift; reduced motion gets a still backdrop and no drift at all.
 *
 * Don't GSAP-tween `x`/`y` on a `[data-depth]` element: CSSPlugin folds the
 * standalone `translate` into `transform`, double-counting the drift.
 */
export default function DepthMotion() {
  useEffect(() => {
    const media = gsap.matchMedia()

    media.add(
      // `all` always matches: matchMedia skips the callback when no condition does.
      {
        reduce: '(prefers-reduced-motion: reduce)',
        phone: '(max-width: 768px)',
        all: '(min-width: 0px)',
      },
      (context) => {
        const { reduce, phone } = context.conditions ?? {}
        if (reduce) return

        const pattern = document.querySelector<HTMLElement>('[data-backdrop-pattern]')
        const panels = phone ? [] : gsap.utils.toArray<HTMLElement>('[data-depth]')
        const cleanups: Array<() => void> = []

        if (pattern) {
          const rate = phone ? BACKDROP_RATE_PHONE : BACKDROP_RATE
          const tile =
            (parseFloat(getComputedStyle(pattern).getPropertyValue('--tw-checker')) || 48) * 2
          const place = (scroll: number) => {
            pattern.style.transform = `translate3d(0, ${-((scroll * rate) % tile)}px, 0)`
          }
          place(window.scrollY)
          ScrollTrigger.create({
            start: 0,
            end: 'max',
            onUpdate: (self) => place(self.scroll()),
          })
          cleanups.push(() => pattern.style.removeProperty('transform'))
        }

        const drifts = panels.map((panel) => {
          const range = Number(panel.dataset.depth) || DEFAULT_DEPTH
          const trigger = ScrollTrigger.create({
            trigger: panel,
            start: 'top bottom',
            end: 'bottom top',
            onUpdate: (self) => place(self.progress),
          })
          function place(progress: number) {
            panel.style.translate = `0 ${((0.5 - progress) * 2 * range).toFixed(1)}px`
          }
          place(trigger.progress)
          return { panel, trigger, place }
        })

        if (drifts.length > 0) {
          // Measure trigger positions without our own offsets baked in, then re-apply.
          const clear = () => drifts.forEach(({ panel }) => panel.style.removeProperty('translate'))
          const reapply = () => drifts.forEach(({ trigger, place }) => place(trigger.progress))
          ScrollTrigger.addEventListener('refreshInit', clear)
          ScrollTrigger.addEventListener('refresh', reapply)
          cleanups.push(() => {
            ScrollTrigger.removeEventListener('refreshInit', clear)
            ScrollTrigger.removeEventListener('refresh', reapply)
            clear()
          })
        }

        return () => cleanups.forEach((cleanup) => cleanup())
      }
    )

    return () => media.revert()
  }, [])

  return null
}
