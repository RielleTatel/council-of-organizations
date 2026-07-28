import { Link } from 'react-router-dom'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { buttonVariants } from '../ui/Button'
import { EmbroideredAccent } from '../EmbroideredAccent'
import { FloatingAccent } from '../ui/FloatingAccent'
import { ThreadBorder } from '../ThreadBorder'
import { Reveal } from '../ui/Reveal'

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
            Find Your Community. Discover Your Passion.
          </h1>
          <p className="mx-auto mt-6 max-w-[64ch] font-body text-lg leading-relaxed text-fabric-dark">
            Every journey at Ateneo begins with a single step. Recruitment Week is COA-Z&apos;s annual
            university-wide event where students discover accredited organizations, meet fellow Atenistas, and
            find communities that align with their passions, interests, and advocacies.
          </p>
          <p className="mx-auto mt-4 max-w-[60ch] font-body text-lg leading-relaxed text-fabric-dark">
            Whether you&apos;re passionate about technology, leadership, culture, service, faith, media, or
            wellness, there&apos;s an organization waiting for you.
          </p>

          <div className="mt-8 flex flex-col items-center gap-6">
            <Link to="/organizations" className={buttonVariants({ variant: 'primary' })}>
              Explore Organizations
              <ArrowRight size={18} strokeWidth={1.75} />
            </Link>

            <a
              href="#timeline"
              className="inline-flex flex-col items-center gap-1 font-body text-xs font-medium uppercase tracking-[0.14em] text-stitch-gray transition-colors hover:text-trust-blue"
            >
              Scroll to Begin
              <ChevronDown size={18} strokeWidth={1.75} />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
