import type { CSSProperties, ReactNode } from 'react'
import { cn } from '@/lib/utils'
import SceneLoader from '@/components/immersive/SceneLoader'

/** Scene accents from docs/03_DESIGN_SYSTEM.md — one accent dominates per viewport. */
export type SceneName =
  | 'intro'
  | 'web'
  | 'automation'
  | 'apps'
  | 'advisory'
  | 'build'

const SCENE_ACCENT: Record<SceneName, string> = {
  intro: 'var(--tw-acid)',
  web: 'var(--tw-acid)',
  automation: 'var(--tw-violet)',
  apps: 'var(--tw-orange)',
  advisory: 'var(--tw-acid)',
  build: 'var(--tw-blue)',
}

type ImmersiveShellProps = {
  children: ReactNode
  /** Initial scene accent for the static atmosphere. Defaults to intro (acid). */
  scene?: SceneName
  /** Skip the WebGL layer on content-first routes such as legal and 404 pages. */
  withScene?: boolean
  className?: string
}

/**
 * Establishes the immersive dark world (`.tw-world`): background, foreground,
 * display type, the static radial scene-glow + grain atmosphere, and the
 * acid focus ring — all scoped so un-migrated Kinetic routes are untouched.
 *
 * The persistent WebGL scene receives the same initial scene as the CSS
 * fallback, so non-home routes do not briefly reset to the intro treatment.
 */
export default function ImmersiveShell({
  children,
  scene = 'intro',
  withScene = true,
  className,
}: ImmersiveShellProps) {
  const style = { '--tw-accent': SCENE_ACCENT[scene] } as CSSProperties

  return (
    <div className={cn('tw-world', className)} data-scene={scene} style={style}>
      {withScene && <SceneLoader initialScene={scene} />}
      {children}
    </div>
  )
}
