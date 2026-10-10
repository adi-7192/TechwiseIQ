'use client'

import { useEffect, useLayoutEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// A vertical resize on mobile is usually just the URL bar showing/hiding. Left
// alone it fires a full ScrollTrigger refresh (and a full-document reflow) in
// the middle of a scroll. The parallax scrubs are measured against section
// boxes, which a URL-bar resize barely moves, so skipping those refreshes is safe.
ScrollTrigger.config({ ignoreMobileResize: true })

// Setup must land before paint on client-side navigation, otherwise the browser
// shows the finished page for a frame before the entry animations reset it.
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

// Pill nav (spec §7/§9 A): section → the link it lights.
const NAV_SECTIONS = [
  ['#top', 'top'],
  ['#services', 'top'],
  ['#websites', 'websites'],
  ['#apps', 'apps'],
  ['#automation', 'automation'],
  ['#selected-work', 'selected-work'],
  ['section[data-journey="model"]', 'selected-work'],
] as const

// Spec §9 — scroll depth (px over the hero) and pointer depth per orbit slot 1..5.
const ORBIT_SCROLL = [-70, -130, -40, -100, -160]
const ORBIT_SCROLL_NARROW = [-35, -65, 0, 0, 0] // only O1/O2 render ≤768
const ORBIT_POINTER = [13, 20, 9, 16, 7]
// Feature space (C1): card, a1, a2, a3 travel from +px to −px over the section's pass.
const FEATURE_SCROLL = { card: 40, a1: 90, a2: -60, a3: 50 }
const FEATURE_SCROLL_NARROW = { card: 16, a1: 40, a2: -30, a3: 25 }
const DEPTH_TARGETS = '[data-orbit-slot], [data-orbit-card], [data-feature-card], [data-artifact]'

export default function HomeMotion() {
  useIsomorphicLayoutEffect(() => {
    const root = document.querySelector<HTMLElement>('[data-home-experience]')
    if (!root) return
    // Hold the pre-animation frame for the scroll reveals while their triggers are
    // built. On a hard load the inline bootstrap in index.tsx already did this during
    // parse; on a client-side navigation this is the first chance, and it still
    // precedes paint. The hero is not covered by this — its entrance is CSS and owns
    // its own start frame from the first paint (HeroStage.module.css).
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      root.dataset.homeMotion = 'pending'
    }
    let refreshFrame = 0
    const media = gsap.matchMedia()
    media.add(
      {
        // gsap.matchMedia only runs the callback while at least one condition
        // matches; `all` keeps it running on touch phones, where the others are false.
        all: '(min-width: 0px)',
        reduce: '(prefers-reduced-motion: reduce)',
        fine: '(hover: hover) and (pointer: fine)',
        wide: '(min-width: 769px)',
      },
      (context) => {
        const { reduce, fine, wide } = context.conditions ?? {}

        // A — pill nav state. UI state, not motion, so it runs under reduce too.
        // Only ever set on activation: the gaps between sections keep the last link.
        const links = gsap.utils.toArray<HTMLElement>('nav[aria-label="Page chapters"] a[data-nav]', root)
        NAV_SECTIONS.forEach(([selector, nav]) => {
          const section = root.querySelector(selector)
          if (!section) return
          ScrollTrigger.create({
            trigger: section,
            start: 'top 45%',
            end: 'bottom 45%',
            onToggle: (self) => {
              if (!self.isActive) return
              links.forEach((a) =>
                a.dataset.nav === nav ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current')
              )
            },
          })
        })
        const clearNav = () => links.forEach((a) => a.removeAttribute('aria-current'))

        if (reduce) {
          root.dataset.homeMotion = 'reduced'
          return clearNav
        }

        // D / D2 — reveals. The clip variant also lifts its word inside the mask.
        // Opacity only, never visibility: a hidden link drops out of the Tab order,
        // and focusing an opacity-0 one scrolls it into view, which fires its reveal.
        gsap.utils.toArray<HTMLElement>('[data-home-reveal]', root).forEach((element) => {
          const scrollTrigger = { trigger: element, start: 'top 92%', once: true }
          gsap.fromTo(
            element,
            { opacity: 0, y: 28 },
            {
              opacity: 1,
              y: 0,
              duration: 0.9,
              ease: 'power3.out',
              clearProps: 'opacity,transform',
              scrollTrigger,
            }
          )
          const word = element.dataset.homeReveal === 'clip' && element.querySelector('[data-chapter-word]')
          if (word) {
            gsap.fromTo(
              word,
              { yPercent: 105 },
              { yPercent: 0, duration: 1, ease: 'expo.out', clearProps: 'transform', scrollTrigger }
            )
          }
        })

        // B1 — orbit scroll depth over the hero's exit.
        const hero = root.querySelector<HTMLElement>('#top')
        const slots = gsap.utils.toArray<HTMLElement>('[data-orbit-slot]', root)
        // GSAP folds an element's computed CSS `scale` into its own transform the
        // first time it touches it. The slots are mid-way through the CSS entrance
        // (B3, which animates `scale`) right now, so pin GSAP's copy at 1 or the
        // entrance's start frame would be baked in for good.
        gsap.set(slots, { scale: 1 })
        slots.forEach((slot) => {
          const n = Number(slot.dataset.orbitSlot) - 1
          gsap.to(slot, {
            y: (wide ? ORBIT_SCROLL : ORBIT_SCROLL_NARROW)[n],
            ease: 'none',
            scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
          })
        })

        // C1 — feature-space parallax: card and artifacts at differing rates.
        const range = wide ? FEATURE_SCROLL : FEATURE_SCROLL_NARROW
        const spaces = gsap.utils.toArray<HTMLElement>('[data-feature-space]', root).map((space) => {
          const card = space.querySelector<HTMLElement>('[data-feature-card]')
          const tl = gsap.timeline({
            scrollTrigger: { trigger: space, start: 'top bottom', end: 'bottom top', scrub: true },
          })
          ;([
            [card, range.card],
            [space.querySelector('[data-artifact="a1"]'), range.a1],
            [space.querySelector('[data-artifact="a2"]'), range.a2],
            [space.querySelector('[data-artifact="a3"]'), range.a3],
          ] as const).forEach(([el, px]) => el && tl.fromTo(el, { y: px }, { y: -px, ease: 'none' }, 0))
          return { trigger: tl.scrollTrigger!, card }
        })

        // B2 / C2 — pointer depth. Fine pointer + wide only; the listener lives and
        // dies with this context, so a switch to reduce leaves nothing listening.
        let removePointer: (() => void) | undefined
        if (fine && wide && hero) {
          const heroActive = ScrollTrigger.create({ trigger: hero, start: 'top bottom', end: 'bottom top' })
          const quick = (el: Element, prop: string, duration: number) =>
            gsap.quickTo(el, prop, { duration, ease: 'power3.out' })
          const orbit = gsap.utils.toArray<HTMLElement>('[data-orbit-card]', root).map((card) => {
            const slot = card.closest<HTMLElement>('[data-orbit-slot]')
            const depth = ORBIT_POINTER[Number(slot?.dataset.orbitSlot) - 1] ?? 0
            gsap.set(card, { transformPerspective: 1000 })
            const [x, y, rx, ry] = ['x', 'y', 'rotationX', 'rotationY'].map((p) => quick(card, p, 0.8))
            return (mx: number, my: number) => {
              x(mx * depth)
              y(my * depth)
              rx(my * -3)
              ry(mx * 4)
            }
          })
          const tilts = spaces.flatMap(({ trigger, card }) => {
            if (!card) return []
            gsap.set(card, { transformPerspective: 1400 })
            const rx = quick(card, 'rotationX', 0.9)
            const ry = quick(card, 'rotationY', 0.9)
            return [{ trigger, rx, ry }]
          })
          const onPointer = (event: PointerEvent) => {
            if (event.pointerType === 'touch') return
            const mx = event.clientX / window.innerWidth - 0.5
            const my = event.clientY / window.innerHeight - 0.5
            if (heroActive.isActive) orbit.forEach((move) => move(mx, my))
            tilts.forEach(({ trigger, rx, ry }) => {
              if (!trigger.isActive) return
              rx(my * -1.7)
              ry(mx * 2.2)
            })
          }
          window.addEventListener('pointermove', onPointer, { passive: true })
          removePointer = () => window.removeEventListener('pointermove', onPointer)
        }

        // The hero entrance (and B3, the orbit entrance) is CSS in
        // HeroStage.module.css; the skyline is WebGL (lib/scene/engine.ts).
        root.dataset.homeMotion = 'active'

        // Off the hydration commit: refresh() reflows the whole document, and
        // running it inline makes every other client component on this page wait.
        refreshFrame = requestAnimationFrame(() => ScrollTrigger.refresh())

        return () => {
          removePointer?.()
          clearNav()
          // GSAP folded the CSS tilt/scale of these into inline styles it doesn't
          // revert; drop them so the CSS `rotate` tilt is back in charge.
          root.querySelectorAll<HTMLElement>(DEPTH_TARGETS).forEach(({ style }) =>
            ['transform', 'scale', 'rotate', 'translate'].forEach((p) => style.removeProperty(p))
          )
        }
      },
      root
    )
    return () => {
      if (refreshFrame) cancelAnimationFrame(refreshFrame)
      media.revert()
      root.dataset.homeMotion = 'static'
    }
  }, [])
  return null
}
