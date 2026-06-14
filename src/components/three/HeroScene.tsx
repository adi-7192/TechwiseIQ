'use client'

import { useRef, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

function Scene() {
  const meshRef = useRef<THREE.Mesh>(null)
  const mouse = useRef({ x: 0, y: 0 })
  const { viewport } = useThree()

  useEffect(() => {
    function onMove(e: MouseEvent) {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  useFrame((_, delta) => {
    if (!meshRef.current) return
    meshRef.current.rotation.y += delta * 0.15
    meshRef.current.rotation.x += delta * 0.08

    // Subtle mouse-follow drift
    const targetX = mouse.current.y * 0.3
    const targetY = mouse.current.x * 0.3
    meshRef.current.position.x +=
      (targetY * viewport.width * 0.05 - meshRef.current.position.x) * 0.02
    meshRef.current.position.y +=
      (targetX * viewport.height * 0.05 - meshRef.current.position.y) * 0.02
  })

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[2.2, 1]} />
      <meshBasicMaterial color="#101010" wireframe />
    </mesh>
  )
}

export default function HeroScene() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

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
        zIndex: -1,
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    >
      <Canvas
        frameloop={visible ? 'always' : 'never'}
        camera={{ position: [0, 0, 6], fov: 50 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: 'transparent' }}
      >
        <Scene />
      </Canvas>
    </div>
  )
}
