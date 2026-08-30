import type { CSSProperties, ElementType, ReactNode } from 'react'
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
  /** Inline style on the outer element — used to set a per-chapter `--tw-accent`. */
  style?: CSSProperties
  'aria-label'?: string
  'aria-labelledby'?: string
  /** Scene marker for the future persistent-scene observer (Phase 2/5). */
  'data-scene'?: string
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
  style,
  ...rest
}: SectionProps) {
  const Tag = as ?? 'section'
  return (
    <Tag
      id={id}
      className={cn(styles.section, styles[density], ruled && styles.ruled, className)}
      style={style}
      {...rest}
    >
      <div className={cn(styles.inner, bleed && styles.bleed, innerClassName)}>
        {children}
      </div>
    </Tag>
  )
}
