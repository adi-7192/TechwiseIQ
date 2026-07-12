'use client'

import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function WorkMotion() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>('[data-work-experience]')
    if (!root) return

    const reveals = Array.from(
      root.querySelectorAll<HTMLElement>('[data-work-reveal]'),
    )
    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    if (reduced) {
      root.dataset.motion = 'reduced'
      reveals.forEach((element) => {
        element.dataset.visible = 'true'
      })
      return
    }

    root.dataset.motion = 'active'

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          ;(entry.target as HTMLElement).dataset.visible = 'true'
          observer.unobserve(entry.target)
        })
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.12 },
    )

    reveals.forEach((element) => observer.observe(element))

    const media = gsap.matchMedia()
    const context = gsap.context(() => {
      media.add('(min-width: 1024px)', () => {
        gsap.utils
          .toArray<HTMLElement>('[data-project-stage]')
          .forEach((stage, index) => {
            const image = stage.querySelector<HTMLElement>(
              '[data-project-image]',
            )
            const title = stage.querySelector<HTMLElement>(
              '[data-project-title]',
            )
            const proof = stage.querySelectorAll<HTMLElement>(
              '[data-project-proof]',
            )
            const direction = index % 2 === 0 ? -1 : 1
            const timeline = gsap.timeline({
              scrollTrigger: {
                trigger: stage,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 0.55,
              },
            })

            if (image) {
              timeline.fromTo(
                image,
                { scale: 0.94, rotate: direction * 4, xPercent: direction * 4 },
                { scale: 1, rotate: 0, xPercent: 0, ease: 'none' },
                0,
              )
            }
            if (title) {
              timeline.fromTo(
                title,
                { yPercent: 22 },
                { yPercent: -8, ease: 'none' },
                0,
              )
            }
            if (proof.length > 0) {
              timeline.fromTo(
                proof,
                { y: 24, opacity: 0.55 },
                {
                  y: -8,
                  opacity: 1,
                  stagger: 0.04,
                  ease: 'none',
                },
                0.1,
              )
            }
          })

      })
    }, root)

    ScrollTrigger.refresh()

    return () => {
      observer.disconnect()
      media.revert()
      context.revert()
      delete root.dataset.motion
    }
  }, [])

  return null
}
