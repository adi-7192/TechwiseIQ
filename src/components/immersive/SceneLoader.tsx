'use client'

import dynamic from 'next/dynamic'

const HeroScene = dynamic(() => import('@/components/immersive/HeroScene'), {
  ssr: false,
})

/** Load the decorative Three.js hero field only after the useful DOM hydrates. */
export default function SceneLoader({ className }: { className?: string }) {
  return <HeroScene className={className} />
}
