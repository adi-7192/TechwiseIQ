'use client'

import { useEffect, useRef } from 'react'
import styles from './studio.module.css'

/**
 * Soft acid halo that follows a fine pointer over the Home page (D-039).
 * Decorative: one fixed element moved with `transform` in at most one rAF per
 * pointer move — no React state, no layout reads. CSS hides it on touch and
 * for reduced motion, so the listener does nothing visible there.
 */
export default function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const glow = ref.current
    if (!glow || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    let frame = 0
    let x = 0
    let y = 0
    const paint = () => {
      frame = 0
      glow.style.transform = `translate3d(${x}px, ${y}px, 0)`
    }
    const onMove = (event: PointerEvent) => {
      // Touchscreen laptops: a finger drag is not a cursor.
      if (event.pointerType === 'touch') return
      x = event.clientX
      y = event.clientY
      glow.dataset.active = 'true'
      frame ||= requestAnimationFrame(paint)
    }
    const onLeave = () => {
      glow.dataset.active = 'false'
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
      cancelAnimationFrame(frame)
    }
  }, [])

  return <div ref={ref} className={styles.cursorGlow} aria-hidden="true" />
}
