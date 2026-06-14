'use client'

import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const ANIMATION_MAP: Record<string, gsap.TweenVars> = {
  'slide-up': { y: 50, opacity: 0 },
  'rotate-x': { rotateX: 90, opacity: 0, transformPerspective: 800 },
  'slide-left': { x: -80, opacity: 0 },
  'slide-right': { x: 80, opacity: 0 },
  scale: { scale: 0.85, opacity: 0 },
}

export default function ScrollAnimator() {
  useEffect(() => {
    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    if (reduced) return

    const ctx = gsap.context(() => {
      // Handle data-animate elements
      document.querySelectorAll<HTMLElement>('[data-animate]').forEach((el) => {
        const type = el.dataset.animate ?? 'slide-up'
        const from = ANIMATION_MAP[type]
        if (!from) return

        const stagger = parseFloat(el.dataset.stagger || '0')

        // If element has stagger, animate its direct children
        if (stagger > 0) {
          const children = Array.from(el.children) as HTMLElement[]
          gsap.set(children, from)
          ScrollTrigger.create({
            trigger: el,
            start: 'top 85%',
            once: true,
            onEnter: () => {
              gsap.to(children, {
                ...Object.fromEntries(
                  Object.keys(from).map((k) => [
                    k,
                    k === 'opacity' ? 1 : 0,
                  ]),
                ),
                opacity: 1,
                y: 0,
                x: 0,
                rotateX: 0,
                scale: 1,
                duration: 0.8,
                stagger,
                ease: 'power3.out',
              })
            },
          })
        } else {
          gsap.set(el, from)
          ScrollTrigger.create({
            trigger: el,
            start: 'top 85%',
            once: true,
            onEnter: () => {
              gsap.to(el, {
                opacity: 1,
                y: 0,
                x: 0,
                rotateX: 0,
                scale: 1,
                duration: 0.8,
                ease: 'power3.out',
              })
            },
          })
        }
      })

      // Handle data-parallax elements
      document.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => {
        const speed = parseFloat(el.dataset.parallax || '0.3')
        gsap.to(el, {
          y: () => (1 - speed) * ScrollTrigger.maxScroll(window) * 0.1,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        })
      })
    })

    return () => ctx.revert()
  }, [])

  return null
}
