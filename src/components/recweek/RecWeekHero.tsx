import { Link } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'
import { EmbroideredAccent } from '../EmbroideredAccent'
import { FloatingAccent } from '../ui/FloatingAccent'
import { ThreadBorder } from '../ThreadBorder'
import { Reveal } from '../ui/Reveal'
import { venues } from '../../data/recweekBooths'
import { cn } from '../../lib/utils'

export function RecWeekHero() {
  return (
    <section className="relative overflow-hidden bg-canvas-cream pb-20 pt-32 md:pb-28 md:pt-36">
      <ThreadBorder
        color="red"
        edge="bottom"
        className="absolute -bottom-2 left-1/2 w-72 max-w-none -translate-x-1/2 opacity-40"
      />

      <FloatingAccent duration={6} distance={8} rotate={6} className="absolute left-[8%] top-24 hidden md:block">
        <EmbroideredAccent color="yellow" index={0} size={44} />
      </FloatingAccent>
      <FloatingAccent duration={7} delay={0.4} distance={9} rotate={-6} className="absolute right-[10%] top-40 hidden md:block">
        <EmbroideredAccent color="pink" index={0} size={40} />
      </FloatingAccent>

      <div className="relative mx-auto max-w-[800px] px-6 text-center">
        <Reveal>
          <span className="font-accent text-2xl text-thread-red">RecWeek 2026</span>
          <h1 className="mt-2 font-display text-4xl font-bold leading-[1.1] tracking-[-0.02em] text-trust-blue md:text-5xl lg:text-6xl">
            Discover organizations.
            <br />
            Meet new people.
            <br />
            Find your community.
          </h1>
          <p className="mx-auto mt-6 font-body text-lg font-medium uppercase tracking-[0.1em] text-stitch-gray">
            August 11–13, 2026
          </p>

          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            {venues.map((venue) => (
              <Link
                key={venue.id}
                to={`/recweek/map?venue=${venue.slug}`}
                className={cn(
                  'w-full rounded-full border-2 border-trust-blue px-6 py-3 text-center font-body font-medium text-trust-blue',
                  'transition-all duration-300 hover:-translate-y-1 hover:bg-trust-blue hover:text-linen-white sm:w-auto',
                )}
              >
                {venue.label}
              </Link>
            ))}
          </div>

          <a
            href="#timeline"
            className="mt-10 inline-flex flex-col items-center gap-1 font-body text-xs font-medium uppercase tracking-[0.14em] text-stitch-gray transition-colors hover:text-trust-blue"
          >
            Scroll to Begin
            <ChevronDown size={18} strokeWidth={1.75} />
          </a>
        </Reveal>
      </div>
    </section>
  )
}
