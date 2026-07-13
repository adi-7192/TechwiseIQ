'use client'

import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const ANIMATED_SELECTOR = [
  '[data-home-signal]',
  '[data-home-web-frame]',
  '[data-home-web-image]',
  '[data-home-system-node]',
  '[data-home-system-line] i',
  '[data-home-system-core]',
  '[data-home-ai-input]',
  '[data-home-ai-review]',
  '[data-home-ai-result]',
  '[data-home-strike]',
  '[data-home-outcomes]',
  '[data-home-promise]',
  '[data-home-process-current]',
  '[data-home-process-marker]',
].join(',')

export default function HomeMotion() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>('[data-home-experience]')
    if (!root) return

    const reveals = Array.from(
      root.querySelectorAll<HTMLElement>('[data-home-reveal]'),
    )
    const animated = Array.from(
      root.querySelectorAll<HTMLElement>(ANIMATED_SELECTOR),
    )
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    let disposeMode = () => {}

    const applyMode = (reduced: boolean) => {
      disposeMode()
      reveals.forEach((element) => delete element.dataset.visible)

      if (reduced) {
        root.dataset.motion = 'reduced'
        reveals.forEach((element) => {
          element.dataset.visible = 'true'
        })
        gsap.set(animated, { clearProps: 'all' })
        disposeMode = () => {}
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
        { rootMargin: '0px 0px -8% 0px', threshold: 0.1 },
      )

      reveals.forEach((element) => observer.observe(element))

      const media = gsap.matchMedia()
      const context = gsap.context(() => {
        const signals = gsap.utils.toArray<HTMLElement>('[data-home-signal]')
        gsap.fromTo(
          signals,
          { x: (index) => (index % 2 === 0 ? 55 : -42), opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.72,
            stagger: 0.09,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: '[data-home-problem]',
              start: 'top 72%',
              toggleActions: 'play none none reverse',
            },
          },
        )

        const webFrame = root.querySelector<HTMLElement>(
          '[data-home-web-frame]',
        )
        const webImage = root.querySelector<HTMLElement>(
          '[data-home-web-image]',
        )
        if (webFrame && webImage) {
          const webTimeline = gsap.timeline({
            scrollTrigger: {
              trigger: '[data-home-service="web"]',
              start: 'top 90%',
              end: 'bottom 25%',
              scrub: 0.6,
            },
          })
          webTimeline.fromTo(
            webFrame,
            { y: 42, rotate: 4.5 },
            { y: -14, rotate: 0.6, ease: 'none' },
            0,
          )
          webTimeline.fromTo(
            webImage,
            { scale: 1.08 },
            { scale: 1, ease: 'none' },
            0,
          )
        }

        const systemNodes = gsap.utils.toArray<HTMLElement>(
          '[data-home-system-node]',
        )
        const systemLines = gsap.utils.toArray<HTMLElement>(
          '[data-home-system-line] i',
        )
        const systemCore = root.querySelector<HTMLElement>(
          '[data-home-system-core]',
        )
        const systemTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: '[data-home-service="software"]',
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        })
        systemTimeline
          .fromTo(
            systemNodes,
            { scale: 0.75, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              duration: 0.48,
              stagger: 0.07,
              ease: 'back.out(1.8)',
            },
          )
          .fromTo(
            systemLines,
            { scaleX: 0 },
            { scaleX: 1, duration: 0.5, stagger: 0.08, ease: 'power2.out' },
            0.18,
          )
        if (systemCore) {
          systemTimeline.fromTo(
            systemCore,
            { scale: 0.65, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.55, ease: 'back.out(1.7)' },
            0.42,
          )
        }

        const aiTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: '[data-home-service="ai"]',
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        })
        aiTimeline
          .fromTo(
            '[data-home-ai-input]',
            { x: -50, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.55, ease: 'power3.out' },
          )
          .fromTo(
            '[data-home-ai-review]',
            { scale: 0.65, rotate: -8, opacity: 0 },
            {
              scale: 1,
              rotate: 5,
              opacity: 1,
              duration: 0.52,
              ease: 'back.out(1.8)',
            },
            0.25,
          )
          .fromTo(
            '[data-home-ai-result]',
            { y: 38, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' },
            0.5,
          )

        const differenceTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: '[data-home-difference]',
            start: 'top 68%',
            toggleActions: 'play none none reverse',
          },
        })
        differenceTimeline
          .fromTo(
            '[data-home-strike]',
            { scaleX: 0 },
            { scaleX: 1, duration: 0.5, transformOrigin: 'left center' },
          )
          .fromTo(
            '[data-home-outcomes]',
            { yPercent: 45, opacity: 0 },
            { yPercent: 0, opacity: 1, duration: 0.5, ease: 'power3.out' },
            0.16,
          )
          .fromTo(
            '[data-home-promise]',
            { y: 25, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.45,
              stagger: 0.08,
              ease: 'power2.out',
            },
            0.32,
          )
          .fromTo(
            '[data-home-process-marker]',
            { scale: 0.65, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              duration: 0.4,
              stagger: 0.08,
              ease: 'back.out(1.7)',
            },
            0.54,
          )

        media.add('(min-width: 768px)', () => {
          gsap.fromTo(
            '[data-home-process-current]',
            { scaleX: 0 },
            {
              scaleX: 1,
              duration: 1,
              ease: 'power2.inOut',
              transformOrigin: 'left center',
              scrollTrigger: {
                trigger: '[data-home-process-current]',
                start: 'top 82%',
                toggleActions: 'play none none reverse',
              },
            },
          )
        })

        media.add('(max-width: 767px)', () => {
          gsap.fromTo(
            '[data-home-process-current]',
            { scaleY: 0 },
            {
              scaleY: 1,
              duration: 1,
              ease: 'power2.inOut',
              transformOrigin: 'top center',
              scrollTrigger: {
                trigger: '[data-home-process-current]',
                start: 'top 82%',
                toggleActions: 'play none none reverse',
              },
            },
          )
        })
      }, root)

      ScrollTrigger.refresh()
      disposeMode = () => {
        observer.disconnect()
        media.revert()
        context.revert()
      }
    }

    const handlePreferenceChange = (event: MediaQueryListEvent) => {
      applyMode(event.matches)
    }

    applyMode(preference.matches)
    preference.addEventListener('change', handlePreferenceChange)

    return () => {
      preference.removeEventListener('change', handlePreferenceChange)
      disposeMode()
      delete root.dataset.motion
    }
  }, [])

  return null
}
