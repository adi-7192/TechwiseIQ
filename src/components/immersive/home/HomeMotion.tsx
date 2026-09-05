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
    // Hold the pre-animation frame while the tweens are built. On a hard load the
    // inline bootstrap in index.tsx already did this during parse; on a client-side
    // navigation this is the first chance, and it still precedes paint.
    //
    // Same exemption as the bootstrap: while the intro overlay covers the viewport
    // there is no flash to prevent, and withholding the hero copy from the first
    // paint would only delay the LCP the browser records.
    if (
      document.documentElement.dataset.intro !== 'loading' &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
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
        const artifacts = gsap.utils.toArray<HTMLElement>('[data-home-artifact]', root)
        const drift = gsap.timeline({ paused: true, repeat: -1, yoyo: true })
        artifacts.forEach((artifact, i) =>
          drift.to(
            artifact,
            {
              y: i % 2 ? 12 : -15,
              rotationY: i % 2 ? -5 : 5,
              duration: 4.5 + i * 0.4,
              ease: 'sine.inOut',
            },
            0
          )
        )
        const intro = gsap.timeline({
          paused: true,
          onComplete: () => {
            if (!document.hidden) drift.play()
          },
        })
        intro
          .from(
            '[data-hero-line]',
            {
              yPercent: 115,
              rotate: 3,
              duration: 1.15,
              stagger: 0.13,
              ease: 'power4.out',
              clearProps: 'transform',
            },
            0
          )
          .from(
            '[data-hero-support]',
            {
              autoAlpha: 0,
              y: 18,
              duration: 0.85,
              stagger: 0.1,
              ease: 'power3.out',
              clearProps: 'opacity,visibility,transform',
            },
            0.35
          )
          .from(
            artifacts,
            {
              autoAlpha: 0,
              scale: 0.88,
              duration: 1.2,
              stagger: 0.13,
              ease: 'power3.out',
              clearProps: 'opacity,visibility,scale',
            },
            0.2
          )
        // Every tween above renders its start values on creation, so GSAP's inline
        // styles now hold the pre-animation frame. Handing over here — and not
        // earlier — is what makes the tweens' trailing `clearProps` safe: if the
        // CSS pre-state were still matching it would re-hide these elements the
        // moment the inline styles were stripped.
        root.dataset.homeMotion = 'active'
        const start = () => intro.play()
        if (document.documentElement.dataset.intro !== 'loading') start()
        window.addEventListener('tw:intro-complete', start)
        let visible = true
        const sync = () => {
          if (visible && !document.hidden && intro.progress() === 1) drift.play()
          else drift.pause()
        }
        const observer = new IntersectionObserver((entries) => {
          visible = entries[0].isIntersecting
          sync()
        })
        const hero = root.querySelector('#top')
        if (hero) observer.observe(hero)
        document.addEventListener('visibilitychange', sync)
        // Off the hydration commit: refresh() reflows the whole document, and
        // running it inline makes every other client component on this page wait.
        refreshFrame = requestAnimationFrame(() => ScrollTrigger.refresh())
        return () => {
          window.removeEventListener('tw:intro-complete', start)
          document.removeEventListener('visibilitychange', sync)
          observer.disconnect()
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
