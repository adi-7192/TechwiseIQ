import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import styles from './primitives.module.css'

type SectionLabelProps = {
  children: ReactNode
  /** Optional chapter index, e.g. "01" — rendered in the accent colour. */
  index?: string
  /** Hide the leading rule mark (for inline / tight placements). */
  hideMark?: boolean
  className?: string
}

/** Mono uppercase eyebrow with a leading accent rule — the technical meta label. */
export default function SectionLabel({
  children,
  index,
  hideMark = false,
  className,
}: SectionLabelProps) {
  return (
    <span className={cn(styles.label, className)}>
      {!hideMark && <span className={styles.labelMark} aria-hidden="true" />}
      {index && <span className={styles.labelIndex}>{index}</span>}
      {children}
    </span>
  )
}
