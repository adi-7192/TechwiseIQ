import type { CSSProperties } from 'react'
import { cn } from '@/lib/utils'
import styles from './ChapterArtifacts.module.css'

/**
 * Floating UI fragments that flank a chapter's proof object — score panels,
 * lead cards, code windows, roadmap slices — at varied size, rotation and
 * parallax depth. They give each chapter genuine spatial depth: the proof is
 * the bright hero, these are supporting artifacts drifting around it.
 *
 * All decorative (`aria-hidden`), lazy-loaded, and shed on narrow screens where
 * the proof needs the full width. Base rotation uses the CSS `rotate` property
 * so GSAP owns `transform` for the scroll parallax (`[data-chapter-artifact]`).
 * Assets are the tailored light-surface SVGs in /public/artifacts.
 */

type Slot =
  | 'topLeft'
  | 'topRight'
  | 'midLeft'
  | 'midRight'
  | 'bottomLeft'
  | 'bottomRight'

type Artifact = {
  src: string
  slot: Slot
  size: 'sm' | 'md' | 'lg'
  /** Base tilt in degrees (CSS `rotate` property). */
  rot: number
  /** Parallax multiplier — larger drifts further as the chapter scrolls. */
  depth: number
}

export type ArtifactScene =
  | 'web'
  | 'automation'
  | 'apps'
  | 'advisory'
  | 'developer'

const SETS: Record<ArtifactScene, readonly Artifact[]> = {
  web: [
    { src: 'tiny-site', slot: 'topLeft', size: 'md', rot: -6, depth: 1.3 },
    { src: 'tiny-score', slot: 'midRight', size: 'sm', rot: 5, depth: 1.6 },
    { src: 'tiny-dashboard', slot: 'bottomLeft', size: 'md', rot: 4, depth: 0.8 },
    { src: 'web-proof', slot: 'topRight', size: 'sm', rot: 7, depth: 1.1 },
  ],
  automation: [
    { src: 'automation-lead', slot: 'topRight', size: 'md', rot: 6, depth: 1.2 },
    { src: 'tiny-score', slot: 'topLeft', size: 'sm', rot: -7, depth: 1.5 },
    { src: 'tiny-chat', slot: 'bottomRight', size: 'sm', rot: 4, depth: 0.9 },
    { src: 'tiny-dashboard', slot: 'midLeft', size: 'sm', rot: -4, depth: 1.4 },
  ],
  apps: [
    { src: 'apps-mobile', slot: 'topLeft', size: 'md', rot: -6, depth: 1.2 },
    { src: 'tiny-dashboard', slot: 'topRight', size: 'sm', rot: 6, depth: 1.5 },
    { src: 'tiny-chat', slot: 'midRight', size: 'sm', rot: -5, depth: 0.9 },
    { src: 'tiny-roadmap', slot: 'bottomLeft', size: 'sm', rot: 5, depth: 1.3 },
  ],
  advisory: [
    { src: 'advisory-roadmap', slot: 'bottomRight', size: 'md', rot: 5, depth: 1.1 },
    { src: 'tiny-score', slot: 'topLeft', size: 'sm', rot: -6, depth: 1.5 },
    { src: 'tiny-roadmap', slot: 'topRight', size: 'sm', rot: 6, depth: 1.3 },
    { src: 'tiny-chat', slot: 'midLeft', size: 'sm', rot: -4, depth: 0.9 },
  ],
  developer: [
    { src: 'tiny-code', slot: 'topRight', size: 'md', rot: 6, depth: 1.3 },
    { src: 'tiny-roadmap', slot: 'topLeft', size: 'sm', rot: -6, depth: 1.5 },
    { src: 'tiny-dashboard', slot: 'bottomRight', size: 'sm', rot: 4, depth: 0.9 },
  ],
}

export default function ChapterArtifacts({ scene }: { scene: ArtifactScene }) {
  const items = SETS[scene]
  if (!items) return null

  return (
    <div className={styles.layer} aria-hidden="true">
      {items.map((a) => (
        // eslint-disable-next-line @next/next/no-img-element -- decorative fixed-size SVG fragment; next/image can't optimise inline SVG and would complicate the parallax layer
        <img
          key={a.src}
          src={`/artifacts/${a.src}.svg`}
          alt=""
          loading="lazy"
          decoding="async"
          width={1200}
          height={760}
          data-chapter-artifact
          data-depth={a.depth}
          className={cn(styles.artifact, styles[a.slot], styles[a.size])}
          style={{ '--rot': `${a.rot}deg` } as CSSProperties}
        />
      ))}
    </div>
  )
}
