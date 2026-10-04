import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import styles from './ProofFrame.module.css'

export type ProofSurface = 'dark' | 'light'

type ProofFrameProps = {
  /** Mono label in the frame bar, e.g. "preview / marketing-site". */
  label: string
  /** One-line caption under the frame. */
  caption?: string
  /**
   * Interface tone. `light` remaps the interior tokens to an off-white product
   * surface so the proof reads as a sophisticated demonstration floating in the
   * dark scene (homepage chapters). `dark` keeps the ambient surface for
   * content-first service pages. Default `dark`.
   */
  surface?: ProofSurface
  /** Accessible description of the artifact (the frame is a labelled figure). */
  'aria-label'?: string
  className?: string
  children: ReactNode
}

/**
 * The shared technical frame every proof object renders inside. Provides the
 * bordered surface, a mono label bar, an honest "Illustrative" tag (these are
 * demonstrations, not real dashboards), and an optional caption. The accent
 * follows the ambient `--tw-accent`, so a proof object adopts its chapter's
 * scene colour on the homepage and a neutral acid on service pages.
 */
export default function ProofFrame({
  label,
  caption,
  surface = 'dark',
  className,
  children,
  ...aria
}: ProofFrameProps) {
  return (
    <figure className={cn(styles.wrap, className)}>
      <div
        className={cn(styles.frame, surface === 'light' && styles.light)}
        {...aria}
      >
        <div className={styles.bar}>
          <span className={styles.label}>{label}</span>
          <span className={styles.tag}>Illustrative</span>
        </div>
        <div className={styles.body}>{children}</div>
      </div>
      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
    </figure>
  )
}
