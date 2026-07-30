import { clusterBySlug } from '../../config/clusters'
import { threadHex } from '../../lib/assets'
import { cn } from '../../lib/utils'

interface CategoryStickerProps {
  slug: string
  /** Slight rotation in degrees for the peeled-sticker feel. */
  rotate?: number
  className?: string
}

export function CategorySticker({ slug, rotate = -2, className }: CategoryStickerProps) {
  const cluster = clusterBySlug(slug)
  if (!cluster) return null
  const hex = threadHex[cluster.color]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-display text-[11px] font-bold uppercase tracking-[0.08em]',
        className,
      )}
      style={{
        backgroundColor: `${hex}1f`,
        color: hex,
        transform: `rotate(${rotate}deg)`,
        boxShadow: '0 1px 4px rgba(46,74,143,0.10)',
      }}
    >
      <span aria-hidden className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: hex }} />
      {cluster.name}
    </span>
  )
}
