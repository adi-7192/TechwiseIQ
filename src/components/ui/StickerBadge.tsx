import { cn } from '@/lib/utils'
import styles from './StickerBadge.module.css'

interface StickerBadgeProps {
  children: React.ReactNode
  className?: string
}

export function StickerBadge({ children, className }: StickerBadgeProps) {
  // decorative flourish — the ★ reads as "black star" to screen readers
  return (
    <span className={cn(styles.badge, className)} aria-hidden="true">
      {children}
    </span>
  )
}
