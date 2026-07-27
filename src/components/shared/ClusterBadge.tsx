import { clusterBySlug } from '../../config/clusters'
import { threadHex } from '../../lib/assets'
import { cn } from '../../lib/utils'

interface ClusterBadgeProps {
  slug: string
  className?: string
}

export function ClusterBadge({ slug, className }: ClusterBadgeProps) {
  const cluster = clusterBySlug(slug)
  if (!cluster) return null
  const hex = threadHex[cluster.color]
  return (
    <span
      className={cn('inline-flex items-center rounded-full px-3 py-1 font-body text-xs font-medium', className)}
      style={{ backgroundColor: `${hex}1a`, color: hex }}
    >
      {cluster.name}
    </span>
  )
}
