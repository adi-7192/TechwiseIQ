'use client'

import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function HomeMotion() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>('[data-home-experience]')
    if (!root) return
    const media = gsap.matchMedia()
    media.add(
      { reduce: '(prefers-reduced-motion: reduce)', all: '(min-width: 0px)' },
      (context) => {
        root.dataset.homeMotion = context.conditions?.reduce ? 'reduced' : 'active'
        if (context.conditions?.reduce) return
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
        ScrollTrigger.refresh()
        return () => {
          window.removeEventListener('tw:intro-complete', start)
          document.removeEventListener('visibilitychange', sync)
          observer.disconnect()
        }
      },
      root
    )
    return () => {
      media.revert()
      delete root.dataset.homeMotion
    }
  }, [])
  return null
}
