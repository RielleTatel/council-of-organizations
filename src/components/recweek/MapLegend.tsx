const ITEMS: { label: string; color: string }[] = [
  { label: 'Booth', color: 'var(--color-canvas-cream)' },
  { label: 'Stage / Tent', color: 'var(--color-thread-green)' },
  { label: 'Pathway', color: 'var(--color-canvas-cream)' },
  { label: 'Landmark', color: 'var(--color-thread-yellow)' },
  { label: 'Statue', color: 'var(--color-stitch-gray)' },
]

export function MapLegend() {
  return (
    <div className="absolute bottom-4 left-4 z-10 rounded-[8px] border border-trust-blue/10 bg-linen-white/90 p-3 shadow-[0_4px_20px_rgba(46,74,143,0.06)] backdrop-blur-sm">
      <p className="mb-2 font-display text-xs font-bold uppercase tracking-[0.1em] text-trust-blue">Legend</p>
      <ul className="space-y-1">
        {ITEMS.map((it) => (
          <li key={it.label} className="flex items-center gap-2 font-body text-xs text-fabric-dark">
            <span className="inline-block h-3 w-3 rounded-[3px] border border-trust-blue/30" style={{ backgroundColor: it.color }} />
            {it.label}
          </li>
        ))}
      </ul>
    </div>
  )
}
