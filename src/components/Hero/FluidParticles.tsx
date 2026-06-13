"use client"

import { useEffect, useRef } from "react"
import styles from "./FluidParticles.module.css"

// Kinetic design tokens — not configurable, always on bone background
const IDLE   = "#7A776E" // --soft: muted dots on cream
const ACTIVE = "#101010" // --ink: sharp on proximity

interface Props {
  /** Higher = fewer particles (sq px per particle). Default 1200. */
  density?: number
  /** Max particle radius in px. Default 1.4. */
  maxSize?: number
  /** Mouse repel radius in px. Default 85. */
  repelRadius?: number
}

type Particle = {
  x: number; y: number; bx: number; by: number
  r: number; d: number; vx: number; vy: number; fr: number; c: string
}

export default function FluidParticles({
  density = 1200,
  maxSize = 1.4,
  repelRadius = 85,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    // canvasRef.current is non-null in useEffect (mounted, always rendered).
    // getContext("2d") is universally supported; cast avoids closure-narrowing issues.
    const canvas = canvasRef.current!
    const ctx    = canvas.getContext("2d") as CanvasRenderingContext2D

    const mouse = { x: -9999, y: -9999 }
    let raf = 0
    let pts: Particle[] = []

    function make(x: number, y: number): Particle {
      const d = Math.random() * 3 + 1
      return { x, y, bx: x, by: y, r: Math.random() * maxSize + 0.4, d, vx: 0, vy: 0, fr: 0.9 - 0.01 * d, c: IDLE }
    }

    function resize() {
      const pr = window.devicePixelRatio || 1
      const w = window.innerWidth
      const h = window.innerHeight
      canvas.width  = w * pr
      canvas.height = h * pr
      canvas.style.width  = `${w}px`
      canvas.style.height = `${h}px`
      ctx.scale(pr, pr)
      pts = Array.from(
        { length: Math.floor((w * h) / density) },
        () => make(Math.random() * w, Math.random() * h)
      )
    }

    function draw() {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)

      for (const p of pts) {
        p.x += p.vx; p.y += p.vy
        p.vx *= p.fr;  p.vy *= p.fr

        const dx   = mouse.x - p.x
        const dy   = mouse.y - p.y
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < repelRadius && dist > 0) {
          const f = (repelRadius - dist) / repelRadius
          p.x -= (dx / dist) * f * p.d * 0.6
          p.y -= (dy / dist) * f * p.d * 0.6
          p.c = ACTIVE
        } else {
          p.x -= (p.x - p.bx) / 20
          p.y -= (p.y - p.by) / 20
          p.c = IDLE
        }

        ctx.fillStyle = p.c
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
      }

      raf = requestAnimationFrame(draw)
    }

    resize()
    draw()

    const onMove   = (e: MouseEvent) => { mouse.x = e.clientX; mouse.y = e.clientY }
    const onLeave  = ()              => { mouse.x = -9999; mouse.y = -9999 }
    const onResize = ()              => resize()

    window.addEventListener("mousemove",  onMove)
    window.addEventListener("mouseleave", onLeave)
    window.addEventListener("resize",     onResize)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("mousemove",  onMove)
      window.removeEventListener("mouseleave", onLeave)
      window.removeEventListener("resize",     onResize)
    }
  }, [density, maxSize, repelRadius])

  return <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
}
