import type { Landmark, LandmarkType } from '../../data/recweekBooths'

const FILL: Record<LandmarkType, string> = {
  stage: 'var(--color-thread-green)',
  tent: 'var(--color-thread-green)',
  pond: 'var(--color-thread-green)',
  pathway: 'var(--color-canvas-cream)',
  church: 'var(--color-thread-yellow)',
  statue: 'var(--color-stitch-gray)',
  podium: 'var(--color-stitch-gray)',
  entrance: 'var(--color-thread-yellow)',
}

export function LandmarkShape({ landmark }: { landmark: Landmark }) {
  const { x, y, width, height, rotation = 0, label, type } = landmark
  const cx = x + width / 2
  const cy = y + height / 2
  return (
    <g transform={`rotate(${rotation} ${cx} ${cy})`} opacity={type === 'entrance' ? 0.35 : 0.7}>
      <rect x={x} y={y} width={width} height={height} rx={2} fill={FILL[type]} stroke="var(--color-trust-blue)" strokeOpacity={0.15} strokeWidth={0.3} />
      {label && (
        <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central" fontSize={type === 'entrance' ? 3.5 : 4.5} fontWeight={700} fill="var(--color-fabric-dark)" style={{ fontFamily: 'var(--font-display)' }}>
          {label}
        </text>
      )}
    </g>
  )
}
