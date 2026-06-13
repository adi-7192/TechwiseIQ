import { cn } from '@/lib/utils'

interface MarqueeProps {
  /** The single copy of content. Duplicated internally for seamless loop. */
  children: React.ReactNode
  direction?: 'left' | 'right'
  /** Loop duration in seconds. Default 26. */
  duration?: number
  /** Extra classes on the outer overflow wrapper. */
  className?: string
  /** Default true — kinetic rows and ticker are decorative. */
  ariaHidden?: boolean
}

/**
 * Generic marquee row primitive.
 * Wraps children in a CSS-animated flex track (marquee-l / marquee-r).
 * Content is duplicated once for a seamless infinite loop.
 * Static under prefers-reduced-motion (handled by globals.css).
 */
export default function Marquee({
  children,
  direction = 'left',
  duration = 26,
  className,
  ariaHidden = true,
}: MarqueeProps) {
  return (
    <div
      className={cn('overflow-hidden', className)}
      aria-hidden={ariaHidden ? 'true' : undefined}
    >
      <div
        className="marquee-track"
        style={{
          animation: `${direction === 'right' ? 'marquee-r' : 'marquee-l'} ${duration}s linear infinite`,
        }}
      >
        {/* Content doubled for seamless loop — children must not have explicit `key` props */}
        {children}
        {children}
      </div>
    </div>
  )
}
