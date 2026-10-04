'use client'

import { useEffect, useRef } from 'react'
import { getSceneEngine } from '@/lib/scene/engine'

/**
 * Controller for the hero depth field. Mounts the shared canvas (one renderer
 * for the whole session — see lib/scene/engine.ts) into this hero's own layer
 * rather than into a fixed full-viewport element, and hands it back on unmount.
 *
 * Creating the renderer and generating the field is synchronous work, so it is
 * deferred to idle time rather than run inline with hydration — the decorative
 * layer must never sit on the critical path or push a long task into the first
 * interaction. The engine then gates its own render loop on an
 * IntersectionObserver over this container, so scrolling past the hero stops
 * the GPU work entirely.
 *
 * If WebGL is unsupported the engine is null and this renders an inert element,
 * leaving the server-rendered field and CSS atmosphere as the fallback. All
 * meaningful content stays in the DOM; this layer is decorative and aria-hidden.
 */
export default function HeroScene({ className }: { className?: string }) {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    let attached: ReturnType<typeof getSceneEngine> = null
    let cancelled = false

    const start = () => {
      if (cancelled) return
      attached = getSceneEngine()
      attached?.attach(mount)
    }

    // Safari only shipped requestIdleCallback recently; fall back to a timeout.
    const idle = typeof window.requestIdleCallback === 'function'
    const handle = idle
      ? window.requestIdleCallback(start, { timeout: 1200 })
      : window.setTimeout(start, 200)

    return () => {
      cancelled = true
      if (idle) window.cancelIdleCallback(handle)
      else window.clearTimeout(handle)
      attached?.detach(mount)
    }
  }, [])

  return (
    <div ref={mountRef} className={className} data-hero-scene aria-hidden="true" />
  )
}
