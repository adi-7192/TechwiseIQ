'use client'

import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const ANIMATED_SELECTOR = [
  '[data-home-signal]',
  '[data-home-web-frame]',
  '[data-home-web-image]',
  '[data-home-software-dashboard]',
  '[data-home-software-status]',
  '[data-home-software-cursor]',
  '[data-home-ai-input]',
  '[data-home-ai-output]',
  '[data-home-ai-core]',
  '[data-home-ai-signal]',
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
    const loopScenes = Array.from(
      root.querySelectorAll<HTMLElement>(
        '[data-home-service="software"], [data-home-service="ai"]',
      ),
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
        loopScenes.forEach((scene) => {
          scene.dataset.loopState = 'reduced'
        })
        gsap.set(animated, { clearProps: 'all' })
        disposeMode = () => {}
        return
      }

      root.dataset.motion = 'active'
      loopScenes.forEach((scene) => {
        scene.dataset.loopState = 'paused'
      })
      const observer =
        typeof IntersectionObserver === 'undefined'
          ? null
          : new IntersectionObserver(
              (entries) => {
                entries.forEach((entry) => {
                  if (!entry.isIntersecting) return
                  ;(entry.target as HTMLElement).dataset.visible = 'true'
                  observer?.unobserve(entry.target)
                })
              },
              { rootMargin: '0px 0px -8% 0px', threshold: 0.1 },
            )

      reveals.forEach((element) => {
        if (observer) observer.observe(element)
        else element.dataset.visible = 'true'
      })

      const media = gsap.matchMedia()
      const context = gsap.context(() => {
        const attachServiceLoop = (
          scene: HTMLElement,
          timeline: gsap.core.Timeline,
        ) => {
          const run = () => {
            scene.dataset.loopState = 'running'
            timeline.play()
          }
          const pause = () => {
            scene.dataset.loopState = 'paused'
            timeline.pause(0)
          }

          scene.dataset.loopState = 'paused'
          ScrollTrigger.create({
            trigger: scene,
            start: 'top 78%',
            end: 'bottom 22%',
            onEnter: run,
            onEnterBack: run,
            onLeave: pause,
            onLeaveBack: pause,
          })
        }

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

        const softwareScene = root.querySelector<HTMLElement>(
          '[data-home-service="software"]',
        )
        const softwareDashboard = root.querySelector<HTMLElement>(
          '[data-home-software-dashboard]',
        )
        const softwareCursor = root.querySelector<HTMLElement>(
          '[data-home-software-cursor]',
        )
        const softwareStatuses = gsap.utils.toArray<HTMLElement>(
          '[data-home-software-status]',
        )
        const softwareTarget = softwareStatuses[1]

        if (
          softwareScene &&
          softwareDashboard &&
          softwareCursor &&
          softwareTarget
        ) {
          gsap.fromTo(
            softwareDashboard,
            { y: 30, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.58,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: softwareScene,
                start: 'top 72%',
                toggleActions: 'play none none reverse',
              },
            },
          )

          const cursorX = () => {
            const cursor = softwareCursor.getBoundingClientRect()
            const target = softwareTarget.getBoundingClientRect()
            return target.left + target.width / 2 - (cursor.left + cursor.width / 2)
          }
          const cursorY = () => {
            const cursor = softwareCursor.getBoundingClientRect()
            const target = softwareTarget.getBoundingClientRect()
            return target.top + target.height / 2 - (cursor.top + cursor.height / 2)
          }
          const softwareLoop = gsap.timeline({
            paused: true,
            repeat: -1,
            repeatDelay: 0.65,
            repeatRefresh: true,
          })
          softwareLoop
            .to(softwareCursor, {
              x: cursorX,
              y: cursorY,
              duration: 0.72,
              ease: 'power2.inOut',
            })
            .to(softwareCursor, { scale: 0.8, duration: 0.12 })
            .to(
              softwareTarget,
              { backgroundColor: '#ff4d00', duration: 0.18 },
              '<',
            )
            .to(softwareCursor, { scale: 1, duration: 0.12 })
            .to({}, { duration: 0.55 })
            .to(softwareTarget, {
              backgroundColor: '#101010',
              duration: 0.22,
            })
            .to(
              softwareCursor,
              { x: 0, y: 0, duration: 0.68, ease: 'power2.inOut' },
              '<',
            )
            .to({}, { duration: 1.9 })

          attachServiceLoop(softwareScene, softwareLoop)
        }

        const aiScene = root.querySelector<HTMLElement>(
          '[data-home-service="ai"]',
        )
        const aiVisual = root.querySelector<HTMLElement>(
          '[data-home-ai-orchestration]',
        )
        const aiCore = root.querySelector<HTMLElement>('[data-home-ai-core]')
        const aiSignal = root.querySelector<HTMLElement>(
          '[data-home-ai-signal]',
        )
        const aiInputs = gsap.utils.toArray<HTMLElement>(
          '[data-home-ai-input]',
        )
        const aiOutputs = gsap.utils.toArray<HTMLElement>(
          '[data-home-ai-output]',
        )

        if (aiScene && aiVisual && aiCore && aiSignal) {
          gsap.fromTo(
            aiVisual,
            { y: 28, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.58,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: aiScene,
                start: 'top 72%',
                toggleActions: 'play none none reverse',
              },
            },
          )

          const aiLoop = gsap.timeline({
            paused: true,
            repeat: -1,
            repeatRefresh: true,
          })
          const route = (index: number) => {
            const input = aiInputs[index]
            const output = aiOutputs[index]
            if (!input || !output) return

            const yOffset = () => {
              const visual = aiVisual.getBoundingClientRect()
              const source = input.getBoundingClientRect()
              return source.top + source.height / 2 - (visual.top + visual.height / 2)
            }

            aiLoop
              .set(aiSignal, { x: 0, y: yOffset, opacity: 0 })
              .to(input, { backgroundColor: '#ffd02f', duration: 0.1 })
              .to(aiSignal, { opacity: 1, duration: 0.08 }, '<')
              .to(aiSignal, {
                x: () => aiVisual.clientWidth * 0.32,
                duration: 0.28,
                ease: 'power2.inOut',
              })
              .to(aiCore, { scale: 1.04, duration: 0.12 })
              .to(aiCore, { scale: 1, duration: 0.12 })
              .to(aiSignal, {
                x: () => aiVisual.clientWidth * 0.64,
                duration: 0.28,
                ease: 'power2.inOut',
              })
              .to(
                output,
                { backgroundColor: '#ff4d00', duration: 0.1 },
                '-=0.08',
              )
              .to({}, { duration: 0.12 })
              .to([input, output], {
                clearProps: 'backgroundColor',
                duration: 0.08,
              })
              .to(aiSignal, { opacity: 0, duration: 0.08 }, '<')
          }

          route(0)
          route(1)
          route(2)
          aiLoop.to({}, { duration: 1.44 })
          attachServiceLoop(aiScene, aiLoop)
        }

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
        observer?.disconnect()
        media.revert()
        context.revert()
        loopScenes.forEach((scene) => delete scene.dataset.loopState)
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
      loopScenes.forEach((scene) => delete scene.dataset.loopState)
      delete root.dataset.motion
    }
  }, [])

  return null
}
