import { useHomeStats } from '../../hooks/useHomeData'
import { Reveal } from '../ui/Reveal'
import { ThreadBorder } from '../ThreadBorder'

const LABELS = [
  { key: 'organizations', label: 'Accredited Organizations' },
  { key: 'clusters', label: 'Organization Clusters' },
  { key: 'offices', label: 'Officers' },
  { key: 'leaders', label: 'Students' },
] as const

// Hardcoded rather than derived — represents the wider AdZU student body, not the leadership count `stats.leaders` tracks.
const STUDENTS_COUNT = '6000+'

export function QuickStats() {
  const { stats, isLoading } = useHomeStats()

  return (
    <section className="relative bg-linen-white py-16 md:py-20">
      <ThreadBorder
        color="blue"
        edge="top"
        className="absolute left-[42%] top-0 -z-10 w-56 max-w-none -translate-x-1/2 -translate-y-1/2"
      />
      <Reveal className="relative z-10 mx-auto grid max-w-[1200px] grid-cols-2 gap-y-10 px-6 md:grid-cols-4 md:divide-x md:divide-dashed md:divide-stitch-gray/40">
        {LABELS.map(({ key, label }) => (
          <div key={key} className="flex flex-col items-center gap-2 px-4 text-center">
            {isLoading ? (
              <span className="h-12 w-16 animate-pulse rounded-[8px] bg-stitch-gray/20" aria-hidden />
            ) : (
              <span className="font-display text-5xl font-black tracking-[-0.02em] text-trust-blue">
                {key === 'leaders' ? STUDENTS_COUNT : stats[key]}
              </span>
            )}
            <span className="font-body text-sm font-medium text-stitch-gray">{label}</span>
          </div>
        ))}
      </Reveal>
    </section>
  )
}
