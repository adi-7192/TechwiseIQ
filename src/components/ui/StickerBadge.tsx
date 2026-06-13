import { cn } from '@/lib/utils'
import styles from './StickerBadge.module.css'

interface StickerBadgeProps {
  children: React.ReactNode
  className?: string
}

export function StickerBadge({ children, className }: StickerBadgeProps) {
  return <span className={cn(styles.badge, className)}>{children}</span>
}
