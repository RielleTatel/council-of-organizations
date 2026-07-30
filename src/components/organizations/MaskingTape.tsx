import { cn } from '../../lib/utils'

interface MaskingTapeProps {
  /** Horizontal jitter in px from center. */
  offset?: number
  className?: string
}

export function MaskingTape({ offset = 0, className }: MaskingTapeProps) {
  return (
    <span
      aria-hidden
      className={cn('pointer-events-none absolute -top-2 left-1/2 z-20 h-5 w-16 -translate-x-1/2 -rotate-3 rounded-[2px]', className)}
      style={{
        marginLeft: offset,
        background: 'repeating-linear-gradient(90deg, rgba(250,248,245,0.72) 0 6px, rgba(240,236,229,0.72) 6px 12px)',
        boxShadow: '0 1px 4px rgba(46,74,143,0.12)',
      }}
    />
  )
}
