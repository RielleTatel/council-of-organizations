import { useState } from 'react'
import { Info, X } from 'lucide-react'

const ITEMS: { label: string; color: string }[] = [
  { label: 'Booth', color: 'var(--color-canvas-cream)' },
  { label: 'Stage / Tent', color: 'var(--color-thread-green)' },
  { label: 'Pathway', color: 'var(--color-canvas-cream)' },
  { label: 'Landmark', color: 'var(--color-thread-yellow)' },
  { label: 'Statue', color: 'var(--color-stitch-gray)' },
]

function LegendList() {
  return (
    <>
      <p className="mb-2 font-display text-xs font-bold uppercase tracking-[0.1em] text-trust-blue">Legend</p>
      <ul className="space-y-1">
        {ITEMS.map((it) => (
          <li key={it.label} className="flex items-center gap-2 font-body text-xs text-fabric-dark">
            <span className="inline-block h-3 w-3 rounded-[3px] border border-trust-blue/30" style={{ backgroundColor: it.color }} />
            {it.label}
          </li>
        ))}
      </ul>
    </>
  )
}

export function MapLegend() {
  const [open, setOpen] = useState(false)

  return (
    <div className="absolute bottom-4 left-4 z-10">
      {/* Desktop/tablet: always visible */}
      <div className="hidden rounded-[8px] border border-trust-blue/10 bg-linen-white/90 p-3 shadow-[0_4px_20px_rgba(46,74,143,0.06)] backdrop-blur-sm sm:block">
        <LegendList />
      </div>

      {/* Mobile: collapsed behind a toggle so it never covers the map */}
      <div className="sm:hidden">
        <button
          aria-label={open ? 'Hide legend' : 'Show legend'}
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-trust-blue/10 bg-linen-white text-trust-blue shadow-[0_4px_20px_rgba(46,74,143,0.06)]"
        >
          {open ? <X size={16} /> : <Info size={16} />}
        </button>
        {open && (
          <div className="mt-2 max-w-[calc(100vw-4rem)] rounded-[8px] border border-trust-blue/10 bg-linen-white/95 p-3 shadow-[0_4px_20px_rgba(46,74,143,0.06)] backdrop-blur-sm">
            <LegendList />
          </div>
        )}
      </div>
    </div>
  )
}
