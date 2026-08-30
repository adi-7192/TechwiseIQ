import type { CSSProperties, ReactNode } from 'react'
import { cn } from '@/lib/utils'

/** Scene accents from docs/03_DESIGN_SYSTEM.md — one accent dominates per viewport. */
export type SceneName = 'intro' | 'web' | 'automation' | 'apps' | 'advisory' | 'build'

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
  className?: string
}

/**
 * Establishes the immersive dark world (`.tw-world`): background, foreground,
 * display type, the static radial scene-glow + grain atmosphere, and the
 * acid focus ring — all scoped so un-migrated Kinetic routes are untouched.
 *
 * CSS/static fallback only. The persistent WebGL scene mounts later (Phase 2)
 * and reads the same `--tw-accent` custom property this sets.
 */
export default function ImmersiveShell({
  children,
  scene = 'intro',
  className,
}: ImmersiveShellProps) {
  const style = { '--tw-accent': SCENE_ACCENT[scene] } as CSSProperties

  return (
    <div className={cn('tw-world', className)} data-scene={scene} style={style}>
      {children}
    </div>
  )
}
