'use client'

import { useEffect, useLayoutEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// A vertical resize on mobile is usually just the URL bar showing/hiding. Left
// alone it fires a full ScrollTrigger refresh (and a full-document reflow) in
// the middle of a scroll. Every trigger here is a `once: true` reveal, so
// nothing visible depends on those refreshes.
ScrollTrigger.config({ ignoreMobileResize: true })

// Setup must land before paint on client-side navigation, otherwise the browser
// shows the finished page for a frame before the entry animations reset it.
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

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
      { reduce: '(prefers-reduced-motion: reduce)', all: '(min-width: 0px)' },
      (context) => {
        if (context.conditions?.reduce) {
          root.dataset.homeMotion = 'reduced'
          return
        }
        gsap.utils.toArray<HTMLElement>('[data-home-reveal]', root).forEach((element) => {
          gsap.fromTo(
            element,
            { autoAlpha: 0, y: 28 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.9,
              ease: 'power3.out',
              clearProps: 'opacity,visibility,transform',
              scrollTrigger: { trigger: element, start: 'top 92%', once: true },
            }
          )
        })
        // The hero entrance is CSS (HeroStage.module.css) and the skyline is
        // WebGL (lib/scene/engine.ts); GSAP owns only the scroll reveals.
        root.dataset.homeMotion = 'active'

        // Off the hydration commit: refresh() reflows the whole document, and
        // running it inline makes every other client component on this page wait.
        refreshFrame = requestAnimationFrame(() => ScrollTrigger.refresh())
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
