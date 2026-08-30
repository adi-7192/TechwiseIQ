'use client'

import { useEffect, useRef } from 'react'
import { getSceneEngine } from '@/lib/scene/engine'
import { DEFAULT_SCENE, resolveSceneName } from '@/lib/scene/presets'

/**
 * Controller for the persistent WebGL atmosphere. Mounts the shared canvas
 * (one renderer for the whole session — see lib/scene/engine.ts) into the
 * current `.tw-world`, then watches chapter `[data-scene]` markers and tells the
 * engine which preset to interpolate toward.
 *
 * If WebGL is unsupported the engine is null and this renders an inert element,
 * leaving the CSS radial atmosphere as the working fallback. All meaningful
 * content stays in the DOM; this layer is decorative and `aria-hidden`.
 */
export default function PersistentScene() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const engine = getSceneEngine()
    const mount = mountRef.current
    if (!engine || !mount) return

    engine.attach(mount)
    engine.setScene(DEFAULT_SCENE)

    // Publish active scene from chapter markers (exclude the world root, which
    // always intersects). Whichever marker crosses the viewport middle wins.
    const markers = Array.from(
      document.querySelectorAll<HTMLElement>('[data-scene]'),
    ).filter((el) => !el.classList.contains('tw-world'))

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            engine.setScene(resolveSceneName(entry.target.getAttribute('data-scene')))
          }
        }
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: 0 },
    )
    markers.forEach((m) => observer.observe(m))

    return () => {
      observer.disconnect()
      engine.detach(mount)
    }
  }, [])

  return <div ref={mountRef} aria-hidden="true" />
}
