import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useRecentEvents } from '../../hooks/useHomeData'
import { EmbroideredAccent } from '../EmbroideredAccent'
import { EventCard } from '../shared/EventCard'
import { ThreadBorder } from '../ThreadBorder'
import { Reveal } from '../ui/Reveal'
import { SectionGlow } from '../ui/SectionGlow'

export function EventHighlights() {
  const { events, isLoading } = useRecentEvents(3)

  return (
    <section className="relative bg-canvas-cream py-20 md:py-28">
      <ThreadBorder
        color="green"
        edge="top"
        flip
        className="absolute left-[38%] top-0 w-64 max-w-none -translate-x-1/2 -translate-y-1/2"
      />
      <div className="mx-auto max-w-[1200px] px-6">
        <Reveal className="relative mb-12 text-center">
          <SectionGlow className="left-1/2 top-0 -translate-x-1/2" />
          <h2 className="font-display text-3xl font-bold tracking-[-0.02em] text-trust-blue md:text-4xl">
            Event Highlights
          </h2>
          <p className="mx-auto mt-4 max-w-[60ch] font-body text-lg leading-relaxed text-fabric-dark">
            Stories celebrating the accomplishments and initiatives of accredited student organizations.
          </p>
        </Reveal>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="overflow-hidden rounded-[8px] bg-linen-white shadow-[0_4px_20px_rgba(46,74,143,0.06)]">
                <div className="aspect-[4/3] animate-pulse bg-stitch-gray/20" />
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
              New stories are being woven together. Check back soon.
            </p>
          </Reveal>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {events.map((event, i) => (
              <Reveal key={event.id} delay={i * 80}>
                <EventCard event={event} />
              </Reveal>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link
            to="/events"
            className="inline-flex items-center gap-1.5 font-body font-medium text-trust-blue transition-colors hover:text-thread-red"
          >
            View All Event Highlights
            <ArrowRight size={16} strokeWidth={1.75} />
          </Link>
        </div>
      </div>
    </section>
  )
}
