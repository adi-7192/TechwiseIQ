'use client'

import { useEffect, useRef } from 'react'
import { getSceneEngine } from '@/lib/scene/engine'

/**
 * Controller for the Home skyline (D-039). Mounts the shared canvas (one
 * renderer for the whole session — see lib/scene/engine.ts) into the page's
 * fixed scene layer, and hands it back on unmount.
 *
 * Creating the renderer is synchronous work, so it is deferred to idle time
 * rather than run inline with hydration — the decorative layer must never sit
 * on the critical path. The engine then renders on demand (continuously only
 * while the hero is on screen) and sleeps when nothing changes.
 *
 * If WebGL is unsupported the engine is null and this renders an inert element,
 * leaving the CSS atmosphere as the fallback. All
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
    <div ref={mountRef} className={className} data-home-scene aria-hidden="true" />
  )
}
