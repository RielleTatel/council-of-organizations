import { Link } from 'react-router-dom'
import { Calendar, ArrowRight } from 'lucide-react'
import { useUpcomingEvents } from '../../hooks/useHomeData'
import { EmbroideredAccent } from '../EmbroideredAccent'
import { Reveal } from '../ui/Reveal'

function formatDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' })
}

export function UpcomingEvents() {
  const { events, isLoading } = useUpcomingEvents(3)

  return (
    <section className="bg-canvas-cream py-20 md:py-28">
      <div className="mx-auto max-w-[1200px] px-6">
        <Reveal className="mb-12 text-center">
          <h2 className="font-display text-3xl font-bold tracking-[-0.02em] text-trust-blue md:text-4xl">
            Upcoming Activities
          </h2>
        </Reveal>

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
        ) : events.length === 0 ? (
          <Reveal className="flex flex-col items-center gap-4 py-8 text-center">
            <EmbroideredAccent color="yellow" index={1} size={56} />
            <p className="font-body text-lg text-stitch-gray">
              New activities are being woven together. Check back soon.
            </p>
          </Reveal>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {events.map((event, i) => (
              <Reveal key={event.id} delay={i * 80}>
                <article className="flex h-full flex-col overflow-hidden rounded-[8px] bg-linen-white shadow-[0_4px_20px_rgba(46,74,143,0.06)]">
                  {event.image ? (
                    <img
                      src={event.image}
                      alt={`${event.title} banner`}
                      className="aspect-[16/10] w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="aspect-[16/10] w-full bg-thread-yellow/15" />
                  )}
                  <div className="flex flex-1 flex-col gap-3 p-6">
                    <h3 className="font-display text-xl font-bold text-trust-blue">{event.title}</h3>
                    <p className="flex items-center gap-2 font-body text-sm text-stitch-gray">
                      <Calendar size={16} strokeWidth={1.75} />
                      {formatDate(event.date)}
                    </p>
                    <p className="line-clamp-3 font-body leading-relaxed text-fabric-dark">{event.description}</p>
                    <Link
                      to={`/events/${event.slug}`}
                      className="mt-auto inline-flex items-center gap-1.5 font-body font-medium text-trust-blue transition-colors hover:text-thread-red"
                    >
                      Learn More
                      <ArrowRight size={16} strokeWidth={1.75} />
                    </Link>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
