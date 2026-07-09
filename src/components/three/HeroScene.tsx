'use client'

import { useRef, useEffect } from 'react'
import * as THREE from 'three'

// Design system palette
const COL_SOFT = new THREE.Color('#7A776E')
const COL_INK = new THREE.Color('#101010')
const COL_HOT = new THREE.Color('#FF4D00')

function getParticleCount() {
  return window.innerWidth < 768 ? 55 : 110
}

export default function HeroScene() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const elRaw = containerRef.current
    if (!elRaw) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const el: HTMLDivElement = elRaw

    let w = el.clientWidth
    let h = el.clientHeight
    const N = getParticleCount()
    const diagonal = Math.sqrt(w * w + h * h)
    let CONNECT_DIST = diagonal * 0.14
    let MOUSE_RADIUS = CONNECT_DIST * 1.5

    // --- Scene ---
    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-w / 2, w / 2, h / 2, -h / 2, 0.1, 10)
    camera.position.z = 1

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false })
    renderer.setSize(w, h)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    renderer.setClearColor(0x000000, 0)
    el.appendChild(renderer.domElement)

    // --- Particle state (flat arrays — no GC pressure) ---
    const px = new Float32Array(N)
    const py = new Float32Array(N)
    const vx = new Float32Array(N)
    const vy = new Float32Array(N)
    for (let i = 0; i < N; i++) {
      px[i] = (Math.random() - 0.5) * w
      py[i] = (Math.random() - 0.5) * h
      vx[i] = (Math.random() - 0.5) * 0.5
      vy[i] = (Math.random() - 0.5) * 0.5
    }

    // --- Points geometry ---
    const ptPos = new Float32Array(N * 3)
    const ptCol = new Float32Array(N * 3)
    const ptGeo = new THREE.BufferGeometry()
    ptGeo.setAttribute('position', new THREE.BufferAttribute(ptPos, 3))
    ptGeo.setAttribute('color', new THREE.BufferAttribute(ptCol, 3))
    const ptMat = new THREE.PointsMaterial({
      size: 3.5,
      vertexColors: true,
      sizeAttenuation: false,
    })
    scene.add(new THREE.Points(ptGeo, ptMat))

    // --- Lines geometry (pre-allocated max possible) ---
    const MAX_LINES = (N * (N - 1)) / 2
    const linePos = new Float32Array(MAX_LINES * 6)
    const lineCol = new Float32Array(MAX_LINES * 6)
    const lineGeo = new THREE.BufferGeometry()
    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePos, 3))
    lineGeo.setAttribute('color', new THREE.BufferAttribute(lineCol, 3))
    const lineMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.55,
    })
    const linesMesh = new THREE.LineSegments(lineGeo, lineMat)
    scene.add(linesMesh)

    // --- Mouse ---
    const mouse = { x: 99999, y: 99999 }

    function onMouseMove(e: MouseEvent) {
      const rect = el.getBoundingClientRect()
      mouse.x = e.clientX - rect.left - w / 2
      mouse.y = -(e.clientY - rect.top - h / 2)
    }
    window.addEventListener('mousemove', onMouseMove, { passive: true })

    // Reset mouse when it leaves the hero
    function onMouseLeave() {
      mouse.x = 99999
      mouse.y = 99999
    }
    el.addEventListener('mouseleave', onMouseLeave)

    // --- Resize ---
    function onResize() {
      w = el.clientWidth
      h = el.clientHeight
      const d = Math.sqrt(w * w + h * h)
      CONNECT_DIST = d * 0.14
      MOUSE_RADIUS = CONNECT_DIST * 1.5
      camera.left = -w / 2
      camera.right = w / 2
      camera.top = h / 2
      camera.bottom = -h / 2
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', onResize, { passive: true })

    const MAX_SPEED = 1.4
    const tmp = new THREE.Color()
    let rafId: number

    function tick() {
      rafId = requestAnimationFrame(tick)

      // Update each particle
      for (let i = 0; i < N; i++) {
        // Mouse gravity
        const mdx = mouse.x - px[i]
        const mdy = mouse.y - py[i]
        const md = Math.sqrt(mdx * mdx + mdy * mdy)

        if (md < MOUSE_RADIUS && md > 0.5) {
          const t = 1 - md / MOUSE_RADIUS
          const force = t * t * 0.7
          vx[i] += (mdx / md) * force
          vy[i] += (mdy / md) * force
        }

        // Damping
        vx[i] *= 0.97
        vy[i] *= 0.97

        // Clamp speed
        const spd = Math.sqrt(vx[i] * vx[i] + vy[i] * vy[i])
        if (spd > MAX_SPEED) {
          vx[i] = (vx[i] / spd) * MAX_SPEED
          vy[i] = (vy[i] / spd) * MAX_SPEED
        }

        px[i] += vx[i]
        py[i] += vy[i]

        // Wrap at edges
        const hw = w / 2
        const hh = h / 2
        if (px[i] < -hw) px[i] += w
        else if (px[i] > hw) px[i] -= w
        if (py[i] < -hh) py[i] += h
        else if (py[i] > hh) py[i] -= h

        // Write to position buffer
        ptPos[i * 3] = px[i]
        ptPos[i * 3 + 1] = py[i]
        // ptPos[i * 3 + 2] = 0 (already zero)

        // Particle color — hot when near mouse
        const hot = md < MOUSE_RADIUS ? Math.max(0, 1 - md / MOUSE_RADIUS) : 0
        tmp.lerpColors(COL_SOFT, COL_HOT, hot * hot * 1.5 > 1 ? 1 : hot * hot * 1.5)
        ptCol[i * 3] = tmp.r
        ptCol[i * 3 + 1] = tmp.g
        ptCol[i * 3 + 2] = tmp.b
      }

      // Build connection lines
      let li = 0
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const dx = px[i] - px[j]
          const dy = py[i] - py[j]
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < CONNECT_DIST) {
            // Fade based on distance
            const fade = 1 - dist / CONNECT_DIST

            // Hot if either endpoint is near mouse
            const mi = Math.sqrt((mouse.x - px[i]) ** 2 + (mouse.y - py[i]) ** 2)
            const mj = Math.sqrt((mouse.x - px[j]) ** 2 + (mouse.y - py[j]) ** 2)
            const hotI = mi < MOUSE_RADIUS ? 1 - mi / MOUSE_RADIUS : 0
            const hotJ = mj < MOUSE_RADIUS ? 1 - mj / MOUSE_RADIUS : 0
            const hotness = Math.min(1, (Math.max(hotI, hotJ)) * 2)

            tmp.lerpColors(COL_INK, COL_HOT, hotness * hotness)
            const r = tmp.r * fade
            const g = tmp.g * fade
            const b = tmp.b * fade

            const base = li * 6
            linePos[base] = px[i];     linePos[base + 1] = py[i];     linePos[base + 2] = 0
            linePos[base + 3] = px[j]; linePos[base + 4] = py[j];     linePos[base + 5] = 0
            lineCol[base] = r;         lineCol[base + 1] = g;         lineCol[base + 2] = b
            lineCol[base + 3] = r;     lineCol[base + 4] = g;         lineCol[base + 5] = b
            li++
          }
        }
      }

      // Only render active line count
      lineGeo.setDrawRange(0, li * 2)

      ptGeo.attributes.position.needsUpdate = true
      ptGeo.attributes.color.needsUpdate = true
      lineGeo.attributes.position.needsUpdate = true
      lineGeo.attributes.color.needsUpdate = true

      renderer.render(scene, camera)
    }

    tick()

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize', onResize)
      el.removeEventListener('mouseleave', onMouseLeave)
      ptGeo.dispose()
      lineGeo.dispose()
      ptMat.dispose()
      lineMat.dispose()
      renderer.dispose()
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      style={{ position: 'absolute', inset: 0, zIndex: -1, pointerEvents: 'none' }}
      aria-hidden="true"
    />
  )
}
