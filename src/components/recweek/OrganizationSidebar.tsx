import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import type { Venue } from '../../data/recweekBooths'
import { RecweekOrgCard } from './RecweekOrgCard'
import { cn } from '../../lib/utils'

interface OrganizationSidebarProps {
  venue: Venue
  selectedBoothId: string | null
  hoveredBoothId: string | null
  onBoothSelect: (id: string) => void
  onBoothHover: (id: string | null) => void
}

export function OrganizationSidebar({ venue, selectedBoothId, hoveredBoothId, onBoothSelect, onBoothHover }: OrganizationSidebarProps) {
  const [open, setOpen] = useState(false)
  const sorted = [...venue.booths].sort((a, b) => a.acronym.localeCompare(b.acronym))

  const list = (
    <div className="flex flex-col gap-2">
      {sorted.map((b) => (
        <RecweekOrgCard
          key={b.id}
          booth={b}
          isSelected={selectedBoothId === b.id}
          isHovered={hoveredBoothId === b.id}
          onSelect={onBoothSelect}
          onHover={onBoothHover}
        />
      ))}
    </div>
  )

  return (
    <div>
      {/* Mobile accordion */}
      <div className="md:hidden">
        <button
          onClick={() => setOpen((v) => !v)}
          className="mb-2 flex w-full items-center justify-between rounded-[8px] border border-trust-blue/10 bg-linen-white p-3 font-display text-sm font-bold text-trust-blue shadow-[0_4px_20px_rgba(46,74,143,0.06)]"
        >
          Organizations ({venue.booths.length})
          <ChevronDown size={18} className={cn('transition-transform', open && 'rotate-180')} />
        </button>
        {open && list}
      </div>
      {/* Desktop / tablet */}
      <div className="hidden md:block">
        <p className="mb-3 font-display text-sm font-bold uppercase tracking-[0.1em] text-trust-blue">Organizations</p>
        <div className="max-h-[560px] overflow-y-auto pr-1">{list}</div>
      </div>
    </div>
  )
}
