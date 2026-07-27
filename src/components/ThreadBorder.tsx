import { threadsByColor, randomFrom, type ThreadColor } from '../lib/assets'
import { cn } from '../lib/utils'

interface ThreadBorderProps {
  color: ThreadColor
  /** Which edge of the section this thread decorates (design system §5.A). */
  edge?: 'top' | 'bottom'
  flip?: boolean
  className?: string
}

/**
 * Signature decorative thread element for section tops/bottoms, using the
 * hand-embroidered yarn curves from /public/ELEMENTS/yarn.
 */
export function ThreadBorder({ color, edge = 'top', flip = false, className }: ThreadBorderProps) {
  const options = threadsByColor[color]
  if (options.length === 0) return null
  const src = randomFrom(options)

  return (
    <img
      src={src}
      alt=""
      role="presentation"
      className={cn(
        'pointer-events-none select-none w-full max-w-xs opacity-80',
        edge === 'top' ? 'mb-[-8px]' : 'mt-[-8px] rotate-180',
        flip && 'scale-x-[-1]',
        className,
      )}
    />
  )
}
