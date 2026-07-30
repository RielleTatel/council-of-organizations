import { cn } from '../../lib/utils'

interface PushPinProps {
  hex: string
  /** Horizontal jitter in px from center. */
  offset?: number
  className?: string
}

export function PushPin({ hex, offset = 0, className }: PushPinProps) {
  return (
    <span
      aria-hidden
      className={cn('pointer-events-none absolute -top-2 left-1/2 z-20 h-4 w-4 -translate-x-1/2 rounded-full', className)}
      style={{
        marginLeft: offset,
        background: `radial-gradient(circle at 32% 30%, #ffffff9c, ${hex} 55%, ${hex} 100%)`,
        boxShadow: `0 2px 3px rgba(46,74,143,0.35), inset 0 -1px 2px rgba(0,0,0,0.25)`,
      }}
    />
  )
}
