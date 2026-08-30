import type { ElementType, ReactNode } from 'react'
import { cn } from '@/lib/utils'
import styles from './primitives.module.css'

type SectionProps = {
  children: ReactNode
  /** Vertical rhythm. Alternate sparse/dense — never stack many mediums. */
  density?: 'sparse' | 'dense' | 'flush'
  /** Full-bleed inner (opt out of the max-width content rail). */
  bleed?: boolean
  /** Hairline top rule to separate stacked sections. */
  ruled?: boolean
  as?: ElementType
  id?: string
  className?: string
  innerClassName?: string
  'aria-label'?: string
  'aria-labelledby'?: string
}

/**
 * Immersive section wrapper: owns the sparse/dense vertical rhythm and the
 * centred max-width content rail. Semantic element is configurable (`section`
 * by default) so headings/landmarks stay correct.
 */
export default function Section({
  children,
  density = 'sparse',
  bleed = false,
  ruled = false,
  as,
  id,
  className,
  innerClassName,
  ...aria
}: SectionProps) {
  const Tag = as ?? 'section'
  return (
    <Tag
      id={id}
      className={cn(styles.section, styles[density], ruled && styles.ruled, className)}
      {...aria}
    >
      <div className={cn(styles.inner, bleed && styles.bleed, innerClassName)}>
        {children}
      </div>
    </Tag>
  )
}
