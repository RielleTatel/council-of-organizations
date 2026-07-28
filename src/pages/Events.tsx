import { Seo } from '../components/Seo'
import { PageHeader } from '../components/shared/PageHeader'
import { Reveal } from '../components/ui/Reveal'
import { EventCard } from '../components/shared/EventCard'
import { EmbroideredAccent } from '../components/EmbroideredAccent'
import { SectionGlow } from '../components/ui/SectionGlow'
import { useEvents } from '../hooks/useEvents'
import { splitEventsByTime } from '../lib/directory'

export default function Events() {
  const { data, isLoading } = useEvents()
  const { upcoming, past } = splitEventsByTime(data ?? [], new Date())

  return (
    <>
      <Seo
        title="Events | COA-Z"
        description="Upcoming and past activities of COA-Z and its member organizations at Ateneo de Zamboanga University."
      />

      <PageHeader
        eyebrow="Events"
        title="Activities"
        accent="yellow"
        description="Programs, formations, and gatherings that bring COA-Z member organizations together throughout the year."
      />

      <section className="bg-canvas-cream py-16 md:py-20">
        <div className="mx-auto max-w-[1200px] px-6">
          {isLoading ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="overflow-hidden rounded-[8px] bg-linen-white shadow-[0_4px_20px_rgba(46,74,143,0.06)]">
                  <div className="aspect-[16/10] animate-pulse bg-stitch-gray/20" />
                  <div className="space-y-3 p-6">
                    <div className="h-5 w-3/4 animate-pulse rounded-[8px] bg-stitch-gray/20" />
                    <div className="h-4 w-1/2 animate-pulse rounded-[8px] bg-stitch-gray/20" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-20">
              <div>
                <Reveal className="relative mb-8">
                  <SectionGlow className="left-0 top-0 h-48 w-48" />
                  <h2 className="font-display text-2xl font-bold tracking-[-0.02em] text-trust-blue md:text-3xl">
                    Upcoming
                  </h2>
                </Reveal>
                {upcoming.length === 0 ? (
                  <Reveal className="flex flex-col items-center gap-4 py-8 text-center">
                    <EmbroideredAccent color="yellow" index={1} size={56} />
                    <p className="font-body text-lg text-stitch-gray">
                      New activities are being woven together. Check back soon.
                    </p>
                  </Reveal>
                ) : (
                  <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                    {upcoming.map((event, i) => (
                      <Reveal key={event.id} delay={(i % 3) * 80}>
                        <EventCard event={event} />
                      </Reveal>
                    ))}
                  </div>
                )}
              </div>

              {past.length > 0 && (
                <div>
                  <Reveal className="mb-8">
                    <h2 className="font-display text-2xl font-bold tracking-[-0.02em] text-trust-blue md:text-3xl">
                      Past Activities
                    </h2>
                  </Reveal>
                  <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                    {past.map((event, i) => (
                      <Reveal key={event.id} delay={(i % 3) * 80}>
                        <EventCard event={event} muted />
                      </Reveal>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
