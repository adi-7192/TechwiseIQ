import { useEffect, useRef } from 'react'
import { clamp, lerp } from '@/lib/utils'

/**
 * The home-page showpiece: kinetic rows skew with scroll velocity.
 * Applies `skewY(Ndeg)` to all elements matching `selector` (.skew by default).
 * Velocity is lerped at 0.12 and clamped to ±7°.
 * No-ops under prefers-reduced-motion.
 */
export function useVelocitySkew(selector = '.skew') {
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    let lastY = window.scrollY
    let vel = 0

    function frame() {
      const dy = window.scrollY - lastY
      lastY = window.scrollY
      // vel += (dy - vel) * 0.12  ↔  lerp(vel, dy, 0.12)
      vel = lerp(vel, dy, 0.12)
      const sk = clamp(vel * 0.14, -7, 7)
      document.querySelectorAll<HTMLElement>(selector).forEach(el => {
        el.style.transform = `skewY(${sk.toFixed(2)}deg)`
      })
      rafRef.current = requestAnimationFrame(frame)
    }

    rafRef.current = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(rafRef.current)
  }, [selector])
}
