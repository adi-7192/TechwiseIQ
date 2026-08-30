import type { ElementType, ReactNode } from 'react'
import { cn } from '@/lib/utils'
import styles from './primitives.module.css'

type DisplayHeadingProps = {
  children: ReactNode
  /** Type role from the scale in docs/03_DESIGN_SYSTEM.md. */
  size?: 'hero' | 'chapter' | 'statement' | 'h2'
  /** Rendered element. Defaults to h2; set explicitly to keep one h1 per page. */
  as?: ElementType
  id?: string
  className?: string
}

/**
 * The large display type that carries the design. Size (visual) and element
 * (semantic) are decoupled so document outline stays correct — a page's single
 * h1 can render at `hero` while a chapter title renders `chapter` as an h2.
 *
 * Wrap an accented run in <em> and it renders in the active scene accent
 * (non-italic) via the .headingAccent style.
 */
export default function DisplayHeading({
  children,
  size = 'chapter',
  as,
  id,
  className,
}: DisplayHeadingProps) {
  const Tag = as ?? 'h2'
  return (
    <Tag id={id} className={cn(styles.heading, styles[size], className)}>
      {children}
    </Tag>
  )
}
