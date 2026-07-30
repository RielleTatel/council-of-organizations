import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, X } from 'lucide-react'
import type { Venue } from '../../data/recweekBooths'
import { RecweekOrgCard } from './RecweekOrgCard'

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

  const selectAndClose = (id: string) => {
    onBoothSelect(id)
    setOpen(false)
  }

  const list = (onSelect: (id: string) => void) => (
    <div className="flex flex-col gap-2">
      {sorted.map((b) => (
        <RecweekOrgCard
          key={b.id}
          booth={b}
          isSelected={selectedBoothId === b.id}
          isHovered={hoveredBoothId === b.id}
          onSelect={onSelect}
          onHover={onBoothHover}
        />
      ))}
    </div>
  )

  return (
    <div>
      {/* Mobile: button opens a fixed bottom-sheet overlay — it never affects page layout/the map below */}
      <div className="md:hidden">
        <button
          onClick={() => setOpen(true)}
          className="flex w-full items-center justify-between rounded-[8px] border border-trust-blue/10 bg-linen-white p-3 font-display text-sm font-bold text-trust-blue shadow-[0_4px_20px_rgba(46,74,143,0.06)]"
        >
          Organizations ({venue.booths.length})
          <ChevronDown size={18} />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <div className="md:hidden">
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-fabric-dark/30"
              onClick={() => setOpen(false)}
            />
            <motion.div
              key="sheet"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="fixed inset-x-0 bottom-0 z-50 max-h-[75vh] overflow-y-auto rounded-t-[16px] border-t border-trust-blue/10 bg-linen-white p-4 shadow-[0_-8px_28px_rgba(46,74,143,0.18)]"
            >
              <div className="mb-3 flex items-center justify-between">
                <p className="font-display text-sm font-bold text-trust-blue">Organizations ({venue.booths.length})</p>
                <button aria-label="Close" onClick={() => setOpen(false)} className="text-stitch-gray hover:text-trust-blue">
                  <X size={18} />
                </button>
              </div>
              {list(selectAndClose)}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Desktop / tablet */}
      <div className="hidden md:block">
        <p className="mb-3 font-display text-sm font-bold uppercase tracking-[0.1em] text-trust-blue">Organizations</p>
        <div className="max-h-[560px] overflow-y-auto pr-1">{list(onBoothSelect)}</div>
      </div>
    </div>
  )
}
