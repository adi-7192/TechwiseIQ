import type { ButtonHTMLAttributes, ReactNode } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import styles from './PrimaryCTA.module.css'

type Variant = 'primary' | 'secondary' | 'ghost'

type CommonProps = {
  children: ReactNode
  variant?: Variant
  /** Trailing arrow glyph (animates on hover). Defaults to true. */
  arrow?: boolean
  className?: string
}

type LinkProps = CommonProps & {
  href: string
  /** External targets (mailto, wa.me, http) render a plain anchor with rel. */
  external?: boolean
  onClick?: () => void
}

type ButtonProps = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps> & {
    href?: undefined
  }

function isLink(props: LinkProps | ButtonProps): props is LinkProps {
  return typeof (props as LinkProps).href === 'string'
}

/**
 * Pill CTA control. `primary` = light on dark, `secondary` = translucent with a
 * technical border, `ghost` = inline text link. Renders a Next `Link` for
 * internal routes, a plain `<a>` for external targets, or a `<button>`.
 * No gradients — per docs/03_DESIGN_SYSTEM.md.
 */
export default function PrimaryCTA(props: LinkProps | ButtonProps) {
  const { children, variant = 'primary', arrow = true, className } = props
  const classes = cn(styles.cta, styles[variant], className)
  const inner = (
    <>
      {children}
      {arrow && (
        <span className={styles.arrow} aria-hidden="true">
          →
        </span>
      )}
    </>
  )

  if (isLink(props)) {
    const { href, external, onClick } = props
    if (external || /^(https?:|mailto:|tel:)/.test(href)) {
      const isHttp = /^https?:/.test(href)
      return (
        <a
          href={href}
          className={classes}
          onClick={onClick}
          {...(isHttp ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          {inner}
        </a>
      )
    }
    return (
      <Link href={href} className={classes} onClick={onClick}>
        {inner}
      </Link>
    )
  }

  const reserved = ['children', 'variant', 'arrow', 'className', 'href', 'external', 'onClick']
  const buttonProps = Object.fromEntries(
    Object.entries(props).filter(([key]) => !reserved.includes(key)),
  ) as ButtonHTMLAttributes<HTMLButtonElement>
  return (
    <button className={classes} {...buttonProps}>
      {inner}
    </button>
  )
}
