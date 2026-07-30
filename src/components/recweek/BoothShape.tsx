import { motion } from 'framer-motion'
import type { BoothShape as BoothShapeData } from '../../data/recweekBooths'

interface BoothShapeProps {
  booth: BoothShapeData
  isSelected: boolean
  isHovered: boolean
  onSelect: (id: string) => void
  onHover: (id: string | null) => void
}

// Visual gap inset applied to every booth rect so adjacent booths never touch
// or overlap, regardless of how tightly their data coordinates are packed.
const GAP_INSET = 0.8

export function BoothShape({ booth, isSelected, isHovered, onSelect, onHover }: BoothShapeProps) {
  const { id, acronym, x, y, width, height, rotation = 0 } = booth
  const cx = x + width / 2
  const cy = y + height / 2
  const active = isSelected || isHovered
  const rectX = x + GAP_INSET / 2
  const rectY = y + GAP_INSET / 2
  const rectWidth = width - GAP_INSET
  const rectHeight = height - GAP_INSET

  // Only the label rotates (matching the source floor plans, where narrow
  // booths keep an axis-aligned outline and just turn the text vertical) —
  // rotating the whole group would fight framer-motion's own transform.
  const available = rotation ? height : width
  const fontSize = Math.min(2.6, Math.max(1.1, (available - 1) / (acronym.length * 0.62)))

  return (
    <motion.g
      id={`booth-${id}`}
      role="button"
      aria-label={acronym}
      tabIndex={0}
      style={{ cursor: 'pointer', transformBox: 'fill-box', transformOrigin: 'center' }}
      onClick={() => onSelect(id)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(id) } }}
      onMouseEnter={() => onHover(id)}
      onMouseLeave={() => onHover(null)}
      animate={
        isSelected
          ? { scale: [1, 1.12, 1.05] }
          : { scale: isHovered ? 1.03 : 1 }
      }
      transition={isSelected ? { duration: 0.5, times: [0, 0.5, 1] } : { duration: 0.2 }}
    >
      <rect
        x={rectX} y={rectY} width={rectWidth} height={rectHeight} rx={1.6}
        fill="var(--color-canvas-cream)"
        stroke="var(--color-trust-blue)"
        strokeOpacity={active ? 0.9 : 0.5}
        strokeWidth={active ? 0.7 : 0.4}
        style={{ filter: isSelected
          ? 'drop-shadow(0 0 3px rgba(46,74,143,0.55))'
          : active ? 'drop-shadow(0 1px 2px rgba(46,74,143,0.25))' : 'drop-shadow(0 0.5px 1px rgba(46,74,143,0.12))' }}
      />
      <text
        x={cx} y={cy} textAnchor="middle" dominantBaseline="central"
        fontSize={fontSize} fontWeight={700} fill="var(--color-trust-blue)"
        transform={rotation ? `rotate(${rotation} ${cx} ${cy})` : undefined}
        style={{ fontFamily: 'var(--font-display)', pointerEvents: 'none' }}
      >
        {acronym}
      </text>
    </motion.g>
  )
}
