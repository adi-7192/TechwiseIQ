'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)'

/**
 * Module-level, not per-component. `ImmersiveShell` is rendered per route, so a
 * client-side navigation can leave two shells mounted for a moment; without this
 * guard each one instantiates its own Lenis and the two fight over the same
 * wheel events. Reference-counted: the last consumer to leave tears it down.
 */
let instance: Lenis | null = null
let rafHandler: ((time: number) => void) | null = null
let consumers = 0

function acquireLenis() {
  consumers += 1
  if (instance) return

  instance = new Lenis({
    duration: 0.85,
    smoothWheel: true,
    syncTouch: false,
    anchors: true,
  })

  instance.on('scroll', () => {
    ScrollTrigger.update()
  })

  rafHandler = (time: number) => {
    // gsap.ticker time is seconds; Lenis expects milliseconds.
    instance?.raf(time * 1000)
  }
  gsap.ticker.add(rafHandler)
  gsap.ticker.lagSmoothing(0)

  // A deep link's native jump is smooth (html scroll-behavior) and gets cut off a
  // few px in by Lenis starting and ScrollTrigger's refresh. Land it outright.
  const target = location.hash && document.getElementById(decodeURIComponent(location.hash.slice(1)))
  if (target) instance.scrollTo(target, { immediate: true })
}

function releaseLenis() {
  consumers = Math.max(0, consumers - 1)
  if (consumers > 0 || !instance) return

  if (rafHandler) {
    gsap.ticker.remove(rafHandler)
    rafHandler = null
  }
  gsap.ticker.lagSmoothing(500, 33)
  instance.destroy()
  instance = null
}

/**
 * The single smooth-scroll driver for the immersive world.
 *
 * Lenis is advanced from GSAP's one ticker (not its own RAF), and every Lenis
 * scroll event updates ScrollTrigger — so scrubbed proof parallax and chapter
 * reveals all ride the same source. That is the "one scroll driver" rule: the
 * hero renderer keeps its own render loop (a canvas must paint every frame) and
 * derives its exit progress from the scroll position, but nothing else runs a
 * competing scroll/RAF loop.
 *
 * Progressive enhancement only: under `prefers-reduced-motion` Lenis never
 * starts and the page uses native scroll. Native anchors, find-in-page,
 * keyboard scrolling and mobile touch are preserved (`syncTouch: false`,
 * `anchors: true`). The effect re-runs live when the motion preference flips.
 */
export default function SmoothScroll() {
  useEffect(() => {
    const media = window.matchMedia(REDUCED_MOTION)
    // Tracks whether *this* mount is holding a reference, so the reduced-motion
    // toggle can't double-acquire or double-release.
    let held = false

    const acquire = () => {
      if (held || media.matches) return
      held = true
      acquireLenis()
    }

    const release = () => {
      if (!held) return
      held = false
      releaseLenis()
    }

    const onPreferenceChange = () => {
      if (media.matches) release()
      else acquire()
    }

    acquire()
    media.addEventListener('change', onPreferenceChange)

    return () => {
      media.removeEventListener('change', onPreferenceChange)
      release()
    }
  }, [])

  return null
}
