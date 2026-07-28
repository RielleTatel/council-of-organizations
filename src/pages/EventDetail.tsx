import { useParams, Link } from 'react-router-dom'
import { Calendar, ArrowLeft, ExternalLink, Mail } from 'lucide-react'
import { Seo } from '../components/Seo'
import { Reveal } from '../components/ui/Reveal'
import { EventCard } from '../components/shared/EventCard'
import { EmbroideredAccent } from '../components/EmbroideredAccent'
import { ThreadBorder } from '../components/ThreadBorder'
import { SectionGlow } from '../components/ui/SectionGlow'
import { buttonVariants } from '../components/ui/Button'
import { useEvent } from '../hooks/useEvent'
import { useEvents } from '../hooks/useEvents'

function formatDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default function EventDetail() {
  const { slug = '' } = useParams()
  const { data: event, isLoading } = useEvent(slug)
  const { data: allEvents } = useEvents()

  if (isLoading) {
    return (
      <div className="mx-auto max-w-[1000px] px-6 pt-32 pb-20">
        <div className="aspect-[16/9] w-full animate-pulse rounded-[8px] bg-stitch-gray/20" />
      </div>
    )
  }

  if (!event) {
    return (
      <>
        <Seo title="Story Not Found | COA-Z" description="The story you are looking for could not be found." />
        <section className="mx-auto flex max-w-[700px] flex-col items-center gap-6 px-6 pt-32 pb-24 text-center">
          <EmbroideredAccent color="red" index={0} size={64} />
          <h1 className="font-display text-3xl font-bold text-trust-blue">Story Not Found</h1>
          <p className="font-body text-lg text-fabric-dark">
            We could not find that story. It may have been unpublished or moved.
          </p>
          <Link to="/events" className={buttonVariants({ variant: 'secondary' })}>
            Back to Event Highlights
          </Link>
        </section>
      </>
    )
  }

  const related = (allEvents ?? []).filter((e) => e.slug !== event.slug).slice(0, 3)
  const body = event.body ?? [event.description]

  return (
    <>
      <Seo title={`${event.title} | COA-Z`} description={event.excerpt ?? event.description} />

      <section className="bg-canvas-cream pt-24 md:pt-28">
        {event.image && (
          <div className="mx-auto max-w-[1200px] px-6">
            <img
              src={event.image}
              alt=""
              role="presentation"
              className="aspect-[16/9] w-full rounded-[8px] object-cover shadow-[0_4px_20px_rgba(46,74,143,0.06)]"
              loading="eager"
            />
          </div>
        )}
      </section>

      <section className="relative bg-canvas-cream py-12 md:py-16">
        <SectionGlow className="left-0 top-0 h-56 w-56" />
        <Reveal className="relative mx-auto max-w-[68ch] px-6">
          {event.organization && (
            <span className="font-body text-xs font-medium uppercase tracking-[0.1em] text-thread-red">
              {event.organization}
            </span>
          )}
          <h1 className="mt-2 font-display text-4xl font-bold tracking-[-0.02em] text-trust-blue md:text-5xl">
            {event.title}
          </h1>
          <p className="mt-4 flex items-center gap-2 font-body text-stitch-gray">
            <Calendar size={18} strokeWidth={1.75} />
            {formatDate(event.date)}
          </p>

          <div className="mt-8 flex flex-col gap-5 font-body text-lg leading-relaxed text-fabric-dark">
            {body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          {(event.credit || event.socialLinks) && (
            <div className="mt-10 flex flex-col gap-4 border-t border-dashed border-stitch-gray/40 pt-6">
              {event.credit && <p className="font-body text-sm text-stitch-gray">{event.credit}</p>}
              {event.socialLinks && (
                <div className="flex flex-wrap items-center gap-5">
                  {event.socialLinks.facebook && (
                    <a
                      href={event.socialLinks.facebook}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 font-body text-sm font-medium text-trust-blue transition-colors hover:text-thread-red"
                    >
                      <ExternalLink size={16} strokeWidth={1.75} />
                      Facebook
                    </a>
                  )}
                  {event.socialLinks.instagram && (
                    <a
                      href={event.socialLinks.instagram}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 font-body text-sm font-medium text-trust-blue transition-colors hover:text-thread-red"
                    >
                      <ExternalLink size={16} strokeWidth={1.75} />
                      Instagram
                    </a>
                  )}
                  {event.socialLinks.email && (
                    <a
                      href={`mailto:${event.socialLinks.email}`}
                      className="inline-flex items-center gap-1.5 font-body text-sm font-medium text-trust-blue transition-colors hover:text-thread-red"
                    >
                      <Mail size={16} strokeWidth={1.75} />
                      Email
                    </a>
                  )}
                </div>
              )}
            </div>
          )}
        </Reveal>
      </section>

      {related.length > 0 && (
        <section className="relative bg-linen-white py-16 md:py-20">
          <ThreadBorder
            color="green"
            edge="top"
            flip
            className="absolute left-[58%] top-0 w-60 max-w-none -translate-x-1/2 -translate-y-1/2"
          />
          <div className="mx-auto max-w-[1200px] px-6">
            <Reveal className="mb-8">
              <h2 className="font-display text-2xl font-bold tracking-[-0.02em] text-trust-blue md:text-3xl">
                You May Also Like
              </h2>
            </Reveal>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {related.map((e) => (
                <EventCard key={e.id} event={e} />
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="mx-auto max-w-[1200px] px-6 py-12">
        <Link
          to="/events"
          className="inline-flex items-center gap-2 font-body font-medium text-trust-blue transition-colors hover:text-thread-red"
        >
          <ArrowLeft size={18} strokeWidth={1.75} />
          Back to Event Highlights
        </Link>
      </div>
    </>
  )
}
