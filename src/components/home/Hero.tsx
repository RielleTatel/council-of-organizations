import { Link } from 'react-router-dom'
import { buttonVariants } from '../ui/Button'
import { EmbroideredAccent } from '../EmbroideredAccent'
import { ThreadBorder } from '../ThreadBorder'
import { Reveal } from '../ui/Reveal'
import { hoopFrames } from '../../lib/assets'

export function Hero() {
  return (
    <section className="relative flex min-h-[100dvh] items-center overflow-hidden bg-canvas-cream">
      <ThreadBorder color="purple" edge="top" className="absolute left-6 top-24 hidden lg:block" />

      <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-12 px-6 py-24 lg:grid-cols-[1.1fr_0.9fr]">
        <Reveal className="flex flex-col gap-6 text-center lg:text-left">
          <span className="mx-auto inline-flex items-center gap-2 rounded-full bg-linen-white px-4 py-2 font-body text-xs font-medium uppercase tracking-[0.14em] text-trust-blue shadow-[0_4px_20px_rgba(46,74,143,0.06)] lg:mx-0">
            Council of the Organizations of the Ateneo - Zamboanga
          </span>

          <h1 className="font-display text-4xl font-bold leading-[1.1] tracking-[-0.02em] text-trust-blue md:text-5xl lg:text-6xl">
            Empowering Student Organizations. Inspiring Collaborative Leadership.
          </h1>

          <p className="mx-auto max-w-[60ch] font-body text-lg leading-relaxed text-fabric-dark lg:mx-0">
            The official alliance of all accredited college organizations of Ateneo de Zamboanga
            University, strengthening collaboration and empowering student leaders to create meaningful impact.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2 lg:justify-start">
            <Link to="/organizations" className={buttonVariants({ variant: 'primary' })}>
              Explore Organizations
            </Link>
            <Link to="/about" className={buttonVariants({ variant: 'secondary' })}>
              Learn More About COA-Z
            </Link>
          </div>
        </Reveal>

        <Reveal delay={150} className="relative mx-auto w-full max-w-md">
          <img
            src={hoopFrames[0]}
            alt="Embroidery hoop stretched with linen canvas, symbolizing the COA-Z community fabric"
            width={1200}
            height={1200}
            loading="eager"
            className="h-auto w-full"
          />
          <EmbroideredAccent color="yellow" index={0} size={64} className="absolute -left-4 top-8" />
          <EmbroideredAccent color="pink" index={0} size={56} className="absolute -right-2 bottom-10" />
        </Reveal>
      </div>
    </section>
  )
}
