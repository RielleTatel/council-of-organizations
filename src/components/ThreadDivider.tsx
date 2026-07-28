import { EmbroideredAccent } from './EmbroideredAccent'
import { FloatingAccent } from './ui/FloatingAccent'
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
      <FloatingAccent duration={5.5} distance={5} rotate={8}>
        <EmbroideredAccent color={flowerColor} size={28} />
      </FloatingAccent>
      <hr className="stitch-divider flex-1" />
    </div>
  )
}
