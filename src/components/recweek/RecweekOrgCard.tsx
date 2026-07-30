import { boothFullName } from '../../data/recweekBooths'
import type { BoothShape as BoothShapeData } from '../../data/recweekBooths'
import { cn } from '../../lib/utils'

interface RecweekOrgCardProps {
  booth: BoothShapeData
  isSelected: boolean
  isHovered: boolean
  onSelect: (id: string) => void
  onHover: (id: string | null) => void
}

export function RecweekOrgCard({ booth, isSelected, isHovered, onSelect, onHover }: RecweekOrgCardProps) {
  const fullName = boothFullName(booth)
  return (
    <button
      onClick={() => onSelect(booth.id)}
      onMouseEnter={() => onHover(booth.id)}
      onMouseLeave={() => onHover(null)}
      className={cn(
        'flex w-full items-start gap-3 rounded-[8px] border bg-linen-white p-3 text-left transition-all duration-300',
        'shadow-[0_4px_20px_rgba(46,74,143,0.06)] hover:-translate-y-0.5',
        isSelected ? 'border-trust-blue ring-1 ring-trust-blue/40' : 'border-trust-blue/10',
        isHovered && !isSelected && 'border-trust-blue/40',
      )}
    >
      <span className={cn('mt-1 h-2.5 w-2.5 shrink-0 rounded-full', fullName ? 'bg-trust-blue' : 'bg-stitch-gray')} />
      <span className="min-w-0">
        <span className="block font-display text-sm font-bold text-trust-blue">{booth.acronym}</span>
        <span className="block truncate font-body text-xs text-fabric-dark">
          {fullName ?? 'Exhibitor booth'}
        </span>
        {booth.boothNumber && <span className="mt-0.5 block font-body text-[11px] text-stitch-gray">Booth {booth.boothNumber}</span>}
      </span>
    </button>
  )
}
