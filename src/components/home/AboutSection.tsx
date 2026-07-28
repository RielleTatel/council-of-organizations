import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles, Award } from 'lucide-react'
import { buttonVariants } from '../ui/Button'
import { Reveal } from '../ui/Reveal'

export function AboutSection() {
  return (
    <section className="bg-canvas-cream py-16 md:py-20">
      <div className="mx-auto max-w-[1200px] px-6">
        <Reveal className="mx-auto max-w-[820px] text-center">
          <span className="mx-auto inline-flex items-center gap-2 rounded-full bg-thread-red/10 px-4 py-2 font-body text-xs font-medium uppercase tracking-[0.14em] text-thread-red">
            <Sparkles size={14} strokeWidth={1.75} />
            About COA-Z
          </span>
          <h2 className="mt-5 font-display text-3xl font-bold leading-tight tracking-[-0.02em] text-trust-blue md:text-4xl lg:text-5xl">
            Woven by <span className="text-thread-red">Purpose</span>,<br />
            United in <span className="text-thread-red">Service</span>
          </h2>
          <p className="mx-auto mt-6 max-w-[62ch] font-body text-lg leading-relaxed text-fabric-dark">
            The Council of the Organizations of the Ateneo - Zamboanga unites accredited student
            organizations under a shared commitment to leadership, collaboration, and community, building a
            stronger Ateneo through the people who serve it.
          </p>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <Reveal className="relative mx-auto w-full max-w-lg">
            <img
              src="/groupPicture.jpg"
              alt="COA-Z member organizations gathered together"
              className="aspect-[4/3] w-full rounded-[16px] object-cover shadow-[0_12px_40px_rgba(46,74,143,0.12)]"
              loading="lazy"
            />
            <div className="absolute -bottom-6 -right-4 flex items-center gap-3 rounded-[12px] bg-linen-white px-5 py-4 shadow-[0_8px_24px_rgba(46,74,143,0.12)] sm:-right-8">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-thread-red/10 text-thread-red">
                <Award size={20} strokeWidth={1.75} />
              </span>
              <span className="font-body text-sm font-semibold leading-tight text-trust-blue">
                Accredited
                <br />
                Council
              </span>
            </div>
          </Reveal>

          <Reveal delay={100} className="flex flex-col gap-5">
            <h3 className="font-display text-2xl font-bold text-trust-blue md:text-3xl">
              Our <span className="text-thread-red">Story</span>
            </h3>
            <p className="font-body text-lg leading-relaxed text-fabric-dark">
              COA-Z serves as the collective voice of accredited student organizations in Ateneo de
              Zamboanga University. By fostering collaboration, supporting organizational initiatives, and
              representing the interests of its member organizations, the council helps create
              opportunities for leadership, service, and holistic student formation.
            </p>
            <p className="font-body text-lg leading-relaxed text-fabric-dark">
              Rather than working independently, organizations become part of a united community that
              shares resources, develops future leaders, and contributes to a more vibrant Ateneo
              experience.
            </p>

            <Link to="/about" className={`${buttonVariants({ variant: 'secondary' })} mt-2 self-start`}>
              Learn More
              <ArrowRight size={18} strokeWidth={1.75} />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
