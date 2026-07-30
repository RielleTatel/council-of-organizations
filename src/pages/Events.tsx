import { Link } from 'react-router-dom'
import { Calendar, ArrowRight } from 'lucide-react'
import { Seo } from '../components/Seo'
import { Reveal } from '../components/ui/Reveal'
import { EventCard } from '../components/shared/EventCard'
import { EmbroideredAccent } from '../components/EmbroideredAccent'
import { SectionGlow } from '../components/ui/SectionGlow'
import { buttonVariants } from '../components/ui/Button'
import { PageHeader } from '../components/shared/PageHeader'
import { useEvents } from '../hooks/useEvents'

function formatDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default function Events() {
  const { data, isLoading } = useEvents()
  const stories = data ?? []
  const featured = stories.find((s) => s.isFeatured) ?? stories[0]
  const rest = stories.filter((s) => s.id !== featured?.id)

  return (
    <>
      <Seo
        title="Event Highlights | COA-Z"
        description="COA-Z's editorial newsroom: curated stories celebrating the accomplishments, initiatives, and activities of accredited student organizations."
      />

      <PageHeader
        variant="ink"
        eyebrow="Event Highlights"
        accent="yellow"
        title="Celebrating student leadership, service, innovation, and the stories that shape the COA-Z community."
      />

      <section className="bg-canvas-cream py-16 md:py-20">
        <div className="mx-auto max-w-[1200px] px-6">
          {isLoading ? (
            <div className="aspect-[16/9] w-full animate-pulse rounded-[8px] bg-stitch-gray/20" />
          ) : !featured ? (
            <Reveal className="flex flex-col items-center gap-4 py-12 text-center">
              <EmbroideredAccent color="yellow" index={1} size={56} />
              <p className="font-body text-lg text-stitch-gray">
                New stories are being woven together. Check back soon.
              </p>
            </Reveal>
          ) : (
            <>
              <Reveal className="relative mb-20 overflow-hidden rounded-[8px] bg-linen-white shadow-[0_8px_40px_rgba(46,74,143,0.1)]">
                <img
                  src={featured.image}
                  alt=""
                  role="presentation"
                  className="aspect-[16/9] w-full object-cover"
                  loading="eager"
                />
                <div className="flex flex-col gap-4 p-8 md:p-12">
                  {featured.organization && (
                    <span className="font-body text-xs font-medium uppercase tracking-[0.1em] text-thread-red">
                      {featured.organization}
                    </span>
                  )}
                  <h2 className="font-display text-3xl font-bold leading-tight tracking-[-0.02em] text-trust-blue md:text-4xl">
                    {featured.title}
                  </h2>
                  <p className="flex items-center gap-2 font-body text-sm text-stitch-gray">
                    <Calendar size={16} strokeWidth={1.75} />
                    {formatDate(featured.date)}
                  </p>
                  <p className="max-w-[70ch] font-body text-lg leading-relaxed text-fabric-dark">
                    {featured.excerpt ?? featured.description}
                  </p>
                  <Link
                    to={`/events/${featured.slug}`}
                    className={`${buttonVariants({ variant: 'primary' })} mt-2 self-center md:self-start`}
                  >
                    Read Story
                    <ArrowRight size={18} strokeWidth={1.75} />
                  </Link>
                </div>
              </Reveal>

              {rest.length > 0 && (
                <div>
                  <Reveal className="relative mb-8">
                    <SectionGlow className="left-0 top-0 h-48 w-48" />
                    <h2 className="font-display text-2xl font-bold tracking-[-0.02em] text-trust-blue md:text-3xl">
                      More Stories
                    </h2>
                  </Reveal>
                  <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    {rest.map((story, i) => (
                      <Reveal key={story.id} delay={(i % 2) * 100}>
                        <EventCard event={story} />
                      </Reveal>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  )
}
