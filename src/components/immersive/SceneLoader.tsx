'use client'

import dynamic from 'next/dynamic'

const PersistentScene = dynamic(
  () => import('@/components/immersive/PersistentScene'),
  { ssr: false },
)

/** Load the decorative Three.js scene only after the useful DOM has hydrated. */
export default function SceneLoader({ initialScene }: { initialScene: string }) {
  return <PersistentScene initialScene={initialScene} />
}
