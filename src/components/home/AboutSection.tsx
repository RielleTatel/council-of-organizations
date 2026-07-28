import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { buttonVariants } from '../ui/Button'
import { EmbroideredAccent } from '../EmbroideredAccent'
import { ThreadDivider } from '../ThreadDivider'
import { ThreadBorder } from '../ThreadBorder'
import { Reveal } from '../ui/Reveal'
import { SectionGlow } from '../ui/SectionGlow'
import { FloatingAccent } from '../ui/FloatingAccent'

export function AboutSection() {
  return (
    <section className="relative bg-canvas-cream py-20 md:py-28">
      <ThreadBorder
        color="yellow"
        edge="top"
        flip
        className="absolute left-[58%] top-0 w-72 max-w-none -translate-x-1/2 -translate-y-1/2"
      />
      <div className="mx-auto max-w-[1200px] px-6">
        <Reveal className="relative mx-auto max-w-[68ch]">
          <SectionGlow className="left-1/2 -top-8 -translate-x-1/2" />
          <FloatingAccent duration={6} distance={8} rotate={6} className="absolute -left-6 -top-10 hidden md:block">
            <EmbroideredAccent color="green" index={0} size={56} />
          </FloatingAccent>

          <h2 className="font-display text-3xl font-bold tracking-[-0.02em] text-trust-blue md:text-4xl">
            Building a Stronger Community of Student Organizations
          </h2>

          <ThreadDivider flowerColor="green" className="my-8 max-w-xs" />

          <div className="flex flex-col gap-5 font-body text-lg leading-relaxed text-fabric-dark">
            <p>
              COA-Z serves as the collective voice of accredited student organizations in Ateneo de
              Zamboanga University. By fostering collaboration, supporting organizational initiatives,
              and representing the interests of its member organizations, the council helps create
              opportunities for leadership, service, and holistic student formation.
            </p>
            <p>
              Rather than working independently, organizations become part of a united community that
              shares resources, develops future leaders, and contributes to a more vibrant Ateneo
              experience.
            </p>
          </div>

          <Link to="/about" className={`${buttonVariants({ variant: 'secondary' })} mt-8`}>
            Learn More
            <ArrowRight size={18} strokeWidth={1.75} />
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
