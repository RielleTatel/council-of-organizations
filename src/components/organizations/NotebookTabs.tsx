import { clusters } from '../../config/clusters'
import { threadHex } from '../../lib/assets'
import { cn } from '../../lib/utils'

interface NotebookTabsProps {
  activeCluster: string | null
  onSelect: (slug: string | null) => void
  counts: Record<string, number>
}

export function NotebookTabs({ activeCluster, onSelect, counts }: NotebookTabsProps) {
  const tab = (active: boolean) =>
    cn(
      'rounded-t-[8px] border border-b-0 px-4 py-2 font-body text-sm font-medium transition-all duration-200',
      active
        ? 'translate-y-0 bg-linen-white text-trust-blue shadow-[0_-3px_12px_rgba(46,74,143,0.10)]'
        : 'translate-y-1 border-trust-blue/15 bg-canvas-cream text-fabric-dark hover:-translate-y-0 hover:text-trust-blue',
    )

  return (
    <div role="tablist" aria-label="Filter by cluster" className="flex flex-wrap items-end gap-1.5 border-b border-trust-blue/15">
      <button
        role="tab"
        aria-pressed={activeCluster === null}
        onClick={() => onSelect(null)}
        className={tab(activeCluster === null)}
        style={activeCluster === null ? { borderTop: `3px solid ${threadHex.blue}` } : undefined}
      >
        All
      </button>
      {clusters.map((c) => {
        const active = activeCluster === c.slug
        return (
          <button
            key={c.slug}
            role="tab"
            aria-pressed={active}
            onClick={() => onSelect(c.slug)}
            className={tab(active)}
            style={active ? { borderTop: `3px solid ${threadHex[c.color]}` } : undefined}
          >
            {c.name}
            <span className="ml-1.5 text-xs text-stitch-gray">{counts[c.slug] ?? 0}</span>
          </button>
        )
      })}
    </div>
  )
}
