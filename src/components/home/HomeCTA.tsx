import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { buttonVariants } from '../ui/Button'
import { EmbroideredAccent } from '../EmbroideredAccent'
import { ThreadBorder } from '../ThreadBorder'
import { Reveal } from '../ui/Reveal'
import { FloatingAccent } from '../ui/FloatingAccent'

export function HomeCTA() {
  return (
    <section className="relative overflow-hidden bg-trust-blue py-24 md:py-28">
      <ThreadBorder
        color="yellow"
        edge="top"
        className="absolute left-[60%] top-0 w-56 max-w-none -translate-x-1/2 -translate-y-1/2 opacity-90"
      />
      <FloatingAccent duration={7} distance={10} rotate={7} className="absolute left-8 top-10 opacity-70">
        <EmbroideredAccent color="red" index={0} size={72} />
      </FloatingAccent>
      <FloatingAccent duration={5.5} delay={0.6} distance={8} rotate={-7} className="absolute bottom-10 right-10 opacity-70">
        <EmbroideredAccent color="yellow" index={2} size={64} />
      </FloatingAccent>

      <Reveal className="mx-auto flex max-w-[800px] flex-col items-center gap-6 px-6 text-center">
        <h2 className="font-display text-3xl font-bold leading-tight tracking-[-0.02em] text-linen-white md:text-4xl">
          Discover the Organizations That Make Ateneo Thrive
        </h2>
        <p className="max-w-[60ch] font-body text-lg leading-relaxed text-linen-white/85">
          From academic and professional organizations to cultural, socio-civic, faith-based, and
          environmental groups, COA-Z brings together diverse communities that shape student life at
          Ateneo de Zamboanga University. Explore their advocacies and discover ways to get involved.
        </p>
        <Link
          to="/organizations"
          className={`${buttonVariants({ variant: 'primary' })} bg-linen-white text-trust-blue hover:bg-thread-yellow hover:text-fabric-dark`}
        >
          Explore Organizations
          <ArrowRight size={18} strokeWidth={1.75} />
        </Link>
      </Reveal>
    </section>
  )
}
