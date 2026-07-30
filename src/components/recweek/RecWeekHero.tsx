import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronDown, MapPin } from 'lucide-react'
import { EmbroideredAccent } from '../EmbroideredAccent'
import { FloatingAccent } from '../ui/FloatingAccent'
import { ThreadBorder } from '../ThreadBorder'
import { Reveal } from '../ui/Reveal'
import { buttonVariants } from '../ui/Button'
import { orgFairLogo } from '../../lib/assets'

export function RecWeekHero() {
  const [mapHovered, setMapHovered] = useState(false)

  return (
    <section className="relative overflow-hidden bg-canvas-cream pb-20 pt-28 md:pb-28 md:pt-32">
      <ThreadBorder
        color="red"
        edge="bottom"
        className="absolute -bottom-2 left-1/2 w-72 max-w-none -translate-x-1/2 opacity-40"
      />

      {/* Floating embroidered decorations */}
      <FloatingAccent duration={6} distance={8} rotate={6} className="absolute left-[6%] top-16 hidden opacity-70 md:block">
        <EmbroideredAccent color="yellow" index={0} size={40} />
      </FloatingAccent>
      <FloatingAccent duration={7} delay={0.4} distance={9} rotate={-6} className="absolute right-[8%] top-24 hidden opacity-70 md:block">
        <EmbroideredAccent color="pink" index={0} size={36} />
      </FloatingAccent>
      <FloatingAccent duration={6.5} delay={0.8} distance={7} rotate={-8} className="absolute left-[10%] bottom-16 hidden opacity-70 md:block">
        <EmbroideredAccent color="green" index={0} size={34} />
      </FloatingAccent>
      <FloatingAccent duration={7.5} delay={1.2} distance={8} rotate={7} className="absolute right-[12%] bottom-24 hidden opacity-70 md:block">
        <EmbroideredAccent color="purple" index={0} size={38} />
      </FloatingAccent>

      <div className="relative mx-auto max-w-[800px] px-6 text-center">
        <Reveal>
          <div className="relative mx-auto flex justify-center">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-10 opacity-[0.12]"
              style={{ background: 'radial-gradient(50% 50% at 50% 50%, var(--color-thread-yellow), transparent 70%)' }}
            />
            <img
              src={orgFairLogo}
              alt="Dia de Colores OrgFair 2026"
              className="w-[85%] sm:w-[480px] lg:w-[620px]"
            />
          </div>

          <h1 className="mt-10 font-display text-4xl font-bold leading-[1.1] tracking-[-0.02em] text-trust-blue md:text-5xl lg:text-6xl">
            Discover Organizations.
            <br />
            Meet New People.
            <br />
            Find Your Community.
          </h1>

          <p className="mx-auto mt-6 max-w-[64ch] font-body text-lg leading-relaxed text-fabric-dark">
            <strong className="font-bold text-trust-blue">RecWeek</strong> is Ateneo de Zamboanga
            University&apos;s annual organization recruitment week, where students explore accredited
            organizations, attend campus-wide activities, discover new opportunities, and find
            communities that inspire their college journey.
          </p>

          <div className="relative mt-9 inline-block">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-10 scale-150 opacity-[0.08]"
              style={{ background: 'radial-gradient(50% 50% at 50% 50%, var(--color-trust-blue), transparent 70%)' }}
            />
            <Link to="/recweek/map" className={buttonVariants({ variant: 'primary' })}>
              <MapPin size={18} strokeWidth={1.75} />
              Explore Interactive Maps
            </Link>
          </div>

          <Link
            to="/recweek/map"
            aria-label="Explore Booth Locations"
            className="relative mx-auto mt-10 block w-fit"
            onMouseEnter={() => setMapHovered(true)}
            onMouseLeave={() => setMapHovered(false)}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-10 scale-150 opacity-[0.1]"
              style={{ background: 'radial-gradient(50% 50% at 50% 50%, var(--color-thread-yellow), transparent 70%)' }}
            />
            <motion.div
              animate={{ y: [0, -8, 0], rotate: -6 }}
              whileHover={{ y: -10, scale: 1.03, rotate: -6 }}
              transition={{ y: { duration: 5, repeat: Infinity, ease: 'easeInOut' }, default: { duration: 0.25 } }}
              style={{ filter: 'drop-shadow(0 12px 24px rgba(46,74,143,0.16))' }}
            >
              <img src="/map.png" alt="" role="presentation" className="w-[260px] select-none" />
            </motion.div>
            <motion.span
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: mapHovered ? 1 : 0, y: mapHovered ? 0 : 4 }}
              transition={{ duration: 0.2 }}
              className="absolute left-1/2 top-full -translate-x-1/2 whitespace-nowrap rounded-full border border-trust-blue/10 bg-linen-white px-3 py-1 font-body text-xs font-medium text-trust-blue shadow-[0_4px_20px_rgba(46,74,143,0.1)]"
            >
              Explore Booth Locations
            </motion.span>
          </Link>

          <a
            href="#timeline"
            className="mt-14 inline-flex flex-col items-center gap-1 font-body text-xs font-medium uppercase tracking-[0.14em] text-stitch-gray transition-colors hover:text-trust-blue"
          >
            Scroll to Discover the Journey
            <ChevronDown size={18} strokeWidth={1.75} />
          </a>
        </Reveal>
      </div>
    </section>
  )
}
