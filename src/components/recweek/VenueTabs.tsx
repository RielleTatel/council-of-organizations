import type { Venue, VenueId } from '../../data/recweekBooths'
import { cn } from '../../lib/utils'

interface VenueTabsProps {
  venues: Venue[]
  activeVenueId: VenueId
  onSelect: (id: VenueId) => void
}

export function VenueTabs({ venues, activeVenueId, onSelect }: VenueTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="RecWeek venues"
      className="mx-auto flex max-w-fit flex-wrap items-center justify-center gap-2 rounded-full border border-trust-blue/10 bg-linen-white p-1.5 shadow-[0_4px_20px_rgba(46,74,143,0.06)]"
    >
      {venues.map((v) => {
        const active = v.id === activeVenueId
        return (
          <button
            key={v.id}
            role="tab"
            aria-selected={active}
            onClick={() => onSelect(v.id)}
            className={cn(
              'rounded-full px-5 py-2 font-body text-sm font-medium transition-all duration-300',
              active
                ? 'bg-trust-blue text-linen-white shadow-[0_2px_10px_rgba(46,74,143,0.18)]'
                : 'text-fabric-dark hover:text-trust-blue',
            )}
          >
            {v.label}
          </button>
        )
      })}
    </div>
  )
}
