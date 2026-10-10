'use client'

import { useEffect, useRef, useState } from 'react'
import BrowserBar from '@/components/BrowserBar'
import styles from './work.module.css'

const LOAD_TIMEOUT_MS = 10_000
const SCROLL_SPEED_PX_PER_MS = 24 / 1000
const END_PAUSE_MS = 2_000

type PreviewState = 'idle' | 'loading' | 'ready' | 'unavailable'

export default function LiveConceptPreview({
  demoPath,
  title,
}: {
  demoPath: string
  title: string
}) {
  const rootRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<HTMLIFrameElement>(null)
  const animationFrameRef = useRef<number | null>(null)
  const loadTimeoutRef = useRef<number | null>(null)
  const mountedRef = useRef(false)
  const visibleRef = useRef(false)
  const directionRef = useRef<1 | -1>(1)
  const pauseUntilRef = useRef(0)
  const previousTimeRef = useRef(0)
  const scrollPositionRef = useRef(0)
  const [mounted, setMounted] = useState(false)
  const [state, setState] = useState<PreviewState>('idle')

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const setMediaPlayback = (shouldPlay: boolean) => {
      try {
        const media =
          frameRef.current?.contentDocument?.querySelectorAll<HTMLMediaElement>(
            'video, audio',
          )
        media?.forEach((item) => {
          if (shouldPlay) {
            void item.play().catch(() => undefined)
          } else {
            item.pause()
          }
        })
      } catch {
        // The owned demos are same-origin; keep the card usable if that changes.
      }
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting

        if (entry.isIntersecting && !mountedRef.current) {
          mountedRef.current = true
          setMounted(true)
          setState('loading')
          loadTimeoutRef.current = window.setTimeout(() => {
            setState((current) =>
              current === 'ready' ? current : 'unavailable',
            )
          }, LOAD_TIMEOUT_MS)
        }

        setMediaPlayback(entry.isIntersecting && !document.hidden)
      },
      { rootMargin: '300px 0px', threshold: 0.05 },
    )

    const handleVisibilityChange = () => {
      setMediaPlayback(visibleRef.current && !document.hidden)
    }

    observer.observe(root)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      setMediaPlayback(false)
      if (loadTimeoutRef.current !== null) {
        window.clearTimeout(loadTimeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (state !== 'ready') return

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    )

    const tick = (time: number) => {
      const frameWindow = frameRef.current?.contentWindow
      const frameDocument = frameRef.current?.contentDocument
      if (!frameWindow || !frameDocument) return

      if (previousTimeRef.current === 0) {
        pauseUntilRef.current = time + END_PAUSE_MS
      }

      if (
        visibleRef.current &&
        !document.hidden &&
        !reducedMotion.matches &&
        time >= pauseUntilRef.current
      ) {
        const maxY = Math.max(
          0,
          frameDocument.documentElement.scrollHeight - frameWindow.innerHeight,
        )
        const elapsed = previousTimeRef.current
          ? time - previousTimeRef.current
          : 0
        const nextY =
          scrollPositionRef.current +
          elapsed * SCROLL_SPEED_PX_PER_MS * directionRef.current
        const boundedY = Math.min(maxY, Math.max(0, nextY))
        scrollPositionRef.current = boundedY
        frameWindow.scrollTo(0, boundedY)

        if (
          (directionRef.current === 1 && boundedY >= maxY) ||
          (directionRef.current === -1 && boundedY <= 0)
        ) {
          directionRef.current = directionRef.current === 1 ? -1 : 1
          pauseUntilRef.current = time + END_PAUSE_MS
        }
      }

      previousTimeRef.current = time
      animationFrameRef.current = window.requestAnimationFrame(tick)
    }

    animationFrameRef.current = window.requestAnimationFrame(tick)

    return () => {
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [state])

  const markReady = () => {
    try {
      const loadedUrl = frameRef.current?.contentWindow?.location.href
      const expectedUrl = new URL(demoPath, window.location.href).href
      if (loadedUrl !== expectedUrl) {
        markUnavailable()
        return
      }
    } catch {
      markUnavailable()
      return
    }

    if (loadTimeoutRef.current !== null) {
      window.clearTimeout(loadTimeoutRef.current)
    }
    directionRef.current = 1
    pauseUntilRef.current = 0
    previousTimeRef.current = 0
    scrollPositionRef.current = 0
    setState('ready')
  }

  const markUnavailable = () => {
    if (loadTimeoutRef.current !== null) {
      window.clearTimeout(loadTimeoutRef.current)
    }
    setState('unavailable')
  }

  return (
    <div className={styles.conceptPreview} ref={rootRef}>
      <BrowserBar label={demoPath} />
      <div
        className={styles.livePreviewStatus}
        data-state={state}
        aria-hidden="true"
      >
        {state === 'unavailable'
          ? 'Preview unavailable'
          : 'Loading live preview'}
      </div>
      {mounted && (
        <iframe
          ref={frameRef}
          src={demoPath}
          title={`${title} automated website preview`}
          tabIndex={-1}
          aria-hidden="true"
          loading="lazy"
          allow="autoplay"
          data-preview-state={state}
          className={styles.conceptFrame}
          onLoad={markReady}
          onError={markUnavailable}
        />
      )}
    </div>
  )
}
