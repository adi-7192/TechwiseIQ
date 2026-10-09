import type { CSSProperties, ReactNode } from 'react'
import { cn } from '@/lib/utils'
import SmoothScroll from '@/components/immersive/SmoothScroll'
import DepthMotion from '@/components/immersive/DepthMotion'

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
  // Raw violet is 4.1:1 on --tw-surface; 12% fg lifts it to 4.9:1 for accent text.
  automation: 'color-mix(in srgb, var(--tw-violet) 88%, var(--tw-fg))',
  apps: 'var(--tw-orange)',
  advisory: 'var(--tw-acid)',
  build: 'var(--tw-blue)',
}

type ImmersiveShellProps = {
  children: ReactNode
  /** Accent for the route's CSS atmosphere. Defaults to intro (acid). */
  scene?: SceneName
  /** Opt-in checkered backdrop with floating depth (D-043). Never on Home. */
  backdrop?: 'checker'
  className?: string
}

/**
 * Establishes the immersive dark world (`.tw-world`): background, foreground,
 * display type, the static radial scene-glow + grain atmosphere, and the
 * acid focus ring — all scoped so un-migrated Kinetic routes are untouched.
 *
 * `scene` only selects the CSS accent here. WebGL is no longer a shell concern:
 * the single renderer lives behind the home hero and is mounted by that hero
 * (see immersive/HeroScene). Every other route runs on the CSS atmosphere.
 */
export default function ImmersiveShell({
  children,
  scene = 'intro',
  backdrop,
  className,
}: ImmersiveShellProps) {
  const style = { '--tw-accent': SCENE_ACCENT[scene] } as CSSProperties

  return (
    <div className={cn('tw-world', className)} data-scene={scene} style={style}>
      <SmoothScroll />
      {backdrop === 'checker' && (
        <>
          <div className="tw-backdrop" aria-hidden="true">
            <div className="tw-backdrop__pattern" data-backdrop-pattern />
          </div>
          <DepthMotion />
        </>
      )}
      {children}
    </div>
  )
}
