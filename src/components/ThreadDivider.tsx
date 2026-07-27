import { EmbroideredAccent } from './EmbroideredAccent'
import { cn } from '../lib/utils'
import type { ThreadColor } from '../lib/assets'

interface ThreadDividerProps {
  /** Show a small embroidered flower flanked by stitch dashes (design system §5.E). */
  flowerColor?: ThreadColor
  className?: string
}

export function ThreadDivider({ flowerColor, className }: ThreadDividerProps) {
  if (!flowerColor) {
    return <hr className={cn('stitch-divider', className)} />
  }

  return (
    <div className={cn('flex items-center gap-4', className)} role="separator">
      <hr className="stitch-divider flex-1" />
      <EmbroideredAccent color={flowerColor} size={28} />
      <hr className="stitch-divider flex-1" />
    </div>
  )
}
