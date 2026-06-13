'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'
import styles from './Button.module.css'

interface ButtonProps {
  variant?: 'primary' | 'secondary'
  href?: string
  children: React.ReactNode
  className?: string
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
}

export function Button({
  variant = 'primary',
  href,
  children,
  className,
  onClick,
  type = 'button',
  disabled,
}: ButtonProps) {
  const cls = cn(styles.btn, variant === 'secondary' && styles.secondary, className)

  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    )
  }

  return (
    <button type={type} className={cls} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  )
}
