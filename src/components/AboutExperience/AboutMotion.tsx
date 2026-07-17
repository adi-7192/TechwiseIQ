'use client'

import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const CHIP_VECTORS = [
  [0.2, 0.15],
  [-0.22, 0.14],
  [0.22, -0.15],
  [-0.2, -0.16],
  [0.28, -0.02],
] as const

export default function AboutMotion() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>('[data-about-experience]')
    if (!root) return

    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const fragments = Array.from(
      root.querySelectorAll<HTMLElement>('[data-about-fragment]'),
    )
    const paths = Array.from(
      root.querySelectorAll<HTMLElement>('[data-about-path]'),
    )
    const panels = Array.from(
      root.querySelectorAll<HTMLElement>('[data-about-culture-panel]'),
    )
    const closing = root.querySelector<HTMLElement>(
      '[data-about-closing-content]',
    )
    let disposeMode = () => {}

    const applyMode = (reduced: boolean) => {
      disposeMode()
      gsap.set([...fragments, ...paths, ...panels, closing].filter(Boolean), {
        clearProps: 'transform,opacity',
      })

      if (reduced) {
        root.dataset.motion = 'reduced'
        disposeMode = () => {}
        return
      }

      root.dataset.motion = 'active'
      const media = gsap.matchMedia()
      const context = gsap.context(() => {
        gsap.fromTo(
          paths,
          { x: (index) => (index % 2 === 0 ? 46 : -46), opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.72,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: '[data-about-expertise]',
              start: 'top 70%',
              toggleActions: 'play none none reverse',
            },
          },
        )

        media.add('(min-width: 769px)', () => {
          const hero = root.querySelector<HTMLElement>('[data-about-hero]')
          if (hero) {
            const heroTimeline = gsap.timeline({
              scrollTrigger: {
                trigger: hero,
                start: 'top top',
                end: 'bottom bottom',
                scrub: 0.65,
                invalidateOnRefresh: true,
              },
            })
            heroTimeline.to(
              fragments,
              {
                x: (index) =>
                  window.innerWidth * (CHIP_VECTORS[index]?.[0] ?? 0),
                y: (index) =>
                  window.innerHeight * (CHIP_VECTORS[index]?.[1] ?? 0),
                rotate: 0,
                scale: 0.88,
                opacity: 0.16,
                stagger: 0.025,
                ease: 'none',
              },
              0,
            )
            heroTimeline.fromTo(
              root,
              { '--about-underline': 0.12 },
              { '--about-underline': 1, duration: 0.7, ease: 'none' },
              0.15,
            )
          }

          const culture = root.querySelector<HTMLElement>(
            '[data-about-culture]',
          )
          if (!culture || panels.length !== 3) return

          gsap.set(panels, { opacity: 0, y: 42 })
          gsap.set(panels[0], { opacity: 1, y: 0 })
          const cultureTimeline = gsap.timeline({
            scrollTrigger: {
              trigger: culture,
              start: 'top top',
              end: 'bottom bottom',
              scrub: 0.65,
            },
          })
          cultureTimeline
            .to(panels[0], { opacity: 0, y: -42, duration: 0.3 })
            .to(panels[1], { opacity: 1, y: 0, duration: 0.3 }, '<')
            .to(panels[1], { opacity: 0, y: -42, duration: 0.3 }, '+=0.2')
            .to(panels[2], { opacity: 1, y: 0, duration: 0.3 }, '<')
        })

        media.add('(max-width: 768px)', () => {
          gsap.fromTo(
            fragments,
            { y: 18, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.58,
              stagger: 0.06,
              ease: 'power3.out',
            },
          )
          panels.forEach((panel) => {
            gsap.fromTo(
              panel,
              { y: 28, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.58,
                ease: 'power3.out',
                scrollTrigger: {
                  trigger: panel,
                  start: 'top 82%',
                  toggleActions: 'play none none reverse',
                },
              },
            )
          })
        })

        if (closing) {
          gsap.fromTo(
            closing,
            { y: 34, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.72,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: '[data-about-closing]',
                start: 'top 68%',
                toggleActions: 'play none none reverse',
              },
            },
          )
        }
      }, root)

      disposeMode = () => {
        media.revert()
        context.revert()
      }
    }

    const handlePreference = (event: MediaQueryListEvent) => {
      applyMode(event.matches)
    }

    applyMode(preference.matches)
    preference.addEventListener('change', handlePreference)

    return () => {
      preference.removeEventListener('change', handlePreference)
      disposeMode()
      delete root.dataset.motion
      root.style.removeProperty('--about-underline')
    }
  }, [])

  return null
}
