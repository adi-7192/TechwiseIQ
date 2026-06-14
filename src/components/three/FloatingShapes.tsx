'use client'

import React, { useRef, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function DriftingShape({
  geometry,
  position,
  speed,
  reducedRef,
}: {
  geometry: 'tetra' | 'torus' | 'octa'
  position: [number, number, number]
  speed: number
  reducedRef: React.MutableRefObject<boolean>
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const baseY = position[1]

  useFrame(({ clock }) => {
    if (!meshRef.current || reducedRef.current) return
    meshRef.current.rotation.x = clock.elapsedTime * speed * 0.3
    meshRef.current.rotation.y = clock.elapsedTime * speed * 0.2
    meshRef.current.position.y =
      baseY + Math.sin(clock.elapsedTime * speed * 0.5) * 0.3
  })

  return (
    <mesh ref={meshRef} position={position}>
      {geometry === 'tetra' && <tetrahedronGeometry args={[0.8, 0]} />}
      {geometry === 'torus' && <torusGeometry args={[0.6, 0.2, 8, 16]} />}
      {geometry === 'octa' && <octahedronGeometry args={[0.7, 0]} />}
      <meshBasicMaterial color="#9A9A92" wireframe opacity={0.5} transparent />
    </mesh>
  )
}

export default function FloatingShapes() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const reducedRef = useRef(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    reducedRef.current = mq.matches
    const handler = (e: MediaQueryListEvent) => {
      reducedRef.current = e.matches
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    >
      <Canvas
        frameloop={visible ? 'always' : 'never'}
        camera={{ position: [0, 0, 8], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: 'transparent' }}
      >
        <DriftingShape geometry="tetra" position={[-3.5, 1.2, 0]} speed={0.8} reducedRef={reducedRef} />
        <DriftingShape geometry="torus" position={[3.2, -0.8, -1]} speed={0.6} reducedRef={reducedRef} />
        <DriftingShape geometry="octa" position={[-2, -1.5, 0.5]} speed={0.7} reducedRef={reducedRef} />
      </Canvas>
    </div>
  )
}
