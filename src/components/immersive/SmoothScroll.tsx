'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { SceneEngine } from '@/lib/scene/engine'

gsap.registerPlugin(ScrollTrigger)

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)'

/**
 * The single smooth-scroll driver for the immersive world.
 *
 * Lenis is advanced from GSAP's one ticker (not its own RAF), and every Lenis
 * scroll event both updates ScrollTrigger and feeds the WebGL atmosphere's
 * drift — so scrubbed proof parallax, chapter reveals and scene movement all
 * ride the same source. That is the "one scroll driver" rule: the persistent
 * renderer keeps its own render loop (a canvas must paint every frame), but
 * nothing else runs a competing scroll/RAF loop.
 *
 * Progressive enhancement only: under `prefers-reduced-motion` Lenis never
 * starts and the page uses native scroll. Native anchors, find-in-page,
 * keyboard scrolling and mobile touch are preserved (`syncTouch: false`,
 * `anchors: true`). The effect re-runs live when the motion preference flips.
 */
export default function SmoothScroll({
  feedScene = false,
}: {
  /** Feed scroll progress to the WebGL atmosphere. Off on content-first routes
   *  so we never force-create the renderer where the scene is intentionally skipped. */
  feedScene?: boolean
}) {
  useEffect(() => {
    const media = window.matchMedia(REDUCED_MOTION)
    let lenis: Lenis | null = null
    let engine: SceneEngine | null = null
    let rafHandler: ((time: number) => void) | null = null

    const start = () => {
      if (lenis || media.matches) return

      lenis = new Lenis({
        duration: 0.85,
        smoothWheel: true,
        syncTouch: false,
        anchors: true,
      })

      if (feedScene) {
        void import('@/lib/scene/engine')
          .then(({ getSceneEngine }) => {
            if (lenis && !media.matches) {
              engine = getSceneEngine()
              engine?.setScrollProgress(lenis.progress)
            }
          })
          .catch(() => {
            /* CSS atmosphere remains available. */
          })
      }
      lenis.on('scroll', (instance: { progress: number }) => {
        ScrollTrigger.update()
        engine?.setScrollProgress(instance.progress)
      })

      rafHandler = (time: number) => {
        // gsap.ticker time is seconds; Lenis expects milliseconds.
        lenis?.raf(time * 1000)
      }
      gsap.ticker.add(rafHandler)
      gsap.ticker.lagSmoothing(0)
    }

    const stop = () => {
      if (rafHandler) {
        gsap.ticker.remove(rafHandler)
        rafHandler = null
      }
      gsap.ticker.lagSmoothing(500, 33)
      lenis?.destroy()
      lenis = null
      engine?.releaseScrollSource()
      engine = null
    }

    const onPreferenceChange = () => {
      if (media.matches) stop()
      else start()
    }

    start()
    media.addEventListener('change', onPreferenceChange)

    return () => {
      media.removeEventListener('change', onPreferenceChange)
      stop()
    }
  }, [feedScene])

  return null
}
