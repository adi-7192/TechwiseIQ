'use client'

import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './ServiceMotion.module.css'

gsap.registerPlugin(ScrollTrigger)

export default function ServiceMotion() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(
      '[data-service-experience]',
    )
    if (!root) return

    const reveals = Array.from(
      root.querySelectorAll<HTMLElement>('[data-service-reveal]'),
    )
    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    if (reduced) {
      reveals.forEach((element) => {
        element.dataset.visible = 'true'
      })
      root.dataset.motion = 'reduced'
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          ;(entry.target as HTMLElement).dataset.visible = 'true'
          observer.unobserve(entry.target)
        })
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.12 },
    )

    reveals.forEach((element) => observer.observe(element))

    const fill = root.querySelector<HTMLElement>('[data-current-fill]')
    const tween = fill
      ? gsap.fromTo(
          fill,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: root,
              start: 'top top',
              end: 'bottom bottom',
              scrub: 0.6,
            },
          },
        )
      : null

    root.dataset.motion = 'active'

    return () => {
      observer.disconnect()
      tween?.scrollTrigger?.kill()
      tween?.kill()
    }
  }, [])

  return null
}

export function ServiceCurrent() {
  return (
    <div className={styles.track} aria-hidden="true">
      <span data-current-fill />
    </div>
  )
}
