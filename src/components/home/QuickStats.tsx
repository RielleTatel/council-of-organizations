import { useHomeStats } from '../../hooks/useHomeData'
import { Reveal } from '../ui/Reveal'

const LABELS = [
  { key: 'organizations', label: 'Accredited Organizations' },
  { key: 'clusters', label: 'Organization Clusters' },
  { key: 'offices', label: 'Executive Offices' },
  { key: 'leaders', label: 'Student Leaders' },
] as const

export function QuickStats() {
  const { stats, isLoading } = useHomeStats()

  return (
    <section className="bg-linen-white py-16 md:py-20">
      <Reveal className="mx-auto grid max-w-[1200px] grid-cols-2 gap-y-10 px-6 md:grid-cols-4 md:divide-x md:divide-dashed md:divide-stitch-gray/40">
        {LABELS.map(({ key, label }) => (
          <div key={key} className="flex flex-col items-center gap-2 px-4 text-center">
            {isLoading ? (
              <span className="h-12 w-16 animate-pulse rounded-[8px] bg-stitch-gray/20" aria-hidden />
            ) : (
              <span className="font-display text-5xl font-black tracking-[-0.02em] text-trust-blue">
                {stats[key]}
              </span>
            )}
            <span className="font-body text-sm font-medium text-stitch-gray">{label}</span>
          </div>
        ))}
      </Reveal>
    </section>
  )
}
