import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { MapPin } from 'lucide-react'
import { EmbroideredAccent } from '../EmbroideredAccent'
import { FloatingAccent } from '../ui/FloatingAccent'
import { ThreadBorder } from '../ThreadBorder'
import { buttonVariants } from '../ui/Button'
import { orgFairLogo, flowersByColor, threadsByColor } from '../../lib/assets'
import { cn } from '../../lib/utils'

const HEADLINE_LINES = ['Discover Organizations.', 'Meet New People.', 'Find Your Community.']

/** A thread illustration with a barely-there opacity pulse — the "stitched" ambient layer. */
function DriftingThread({ src, className, duration = 5, delay = 0 }: { src: string; className?: string; duration?: number; delay?: number }) {
  const shouldReduceMotion = useReducedMotion()
  return (
    <motion.img
      src={src}
      alt=""
      role="presentation"
      className={cn('pointer-events-none select-none', className)}
      animate={shouldReduceMotion ? undefined : { opacity: [0.85, 1, 0.85] }}
      transition={{ duration, repeat: Infinity, ease: 'easeInOut', delay }}
    />
  )
}

export function RecWeekHero() {
  const [mapHovered, setMapHovered] = useState(false)
  const shouldReduceMotion = useReducedMotion()

  return (
    <section className="relative overflow-hidden bg-canvas-cream pb-20 pt-28 md:pb-28 md:pt-32">
      {/* Layered corner compositions: thread beneath, flower floating on top */}
      <div className="pointer-events-none absolute left-[4%] top-12 hidden opacity-80 md:block">
        <DriftingThread src={threadsByColor.blue[0]} className="w-20" duration={6} />
        <FloatingAccent duration={6} distance={7} rotate={2} className="absolute -right-3 -top-4">
          <EmbroideredAccent color="yellow" index={0} size={36} opacity={80} />
        </FloatingAccent>
        <FloatingAccent duration={7.5} delay={0.6} distance={6} rotate={-2} className="absolute -bottom-3 left-6">
          <EmbroideredAccent color="green" index={1} size={28} opacity={75} />
        </FloatingAccent>
      </div>

      <div className="pointer-events-none absolute right-[4%] top-16 hidden opacity-80 md:block">
        <DriftingThread src={threadsByColor.red[0]} className="w-16" duration={5.5} delay={0.3} />
        <FloatingAccent duration={7} delay={0.4} distance={8} rotate={-2} className="absolute -left-3 -top-3">
          <EmbroideredAccent color="purple" index={0} size={34} opacity={80} />
        </FloatingAccent>
      </div>

      <div className="pointer-events-none absolute bottom-16 left-[6%] hidden opacity-75 md:block">
        <DriftingThread src={threadsByColor.pink[0]} className="w-16" duration={6.5} delay={0.5} />
        <FloatingAccent duration={6.5} delay={0.8} distance={7} rotate={2} className="absolute -right-2 top-4">
          <EmbroideredAccent color="pink" index={0} size={32} opacity={80} />
        </FloatingAccent>
      </div>

      <div className="pointer-events-none absolute bottom-20 right-[6%] hidden opacity-75 md:block">
        <DriftingThread src={threadsByColor.yellow[1]} className="w-16" duration={5} delay={0.2} />
        <FloatingAccent duration={7.2} delay={1} distance={6} rotate={-2} className="absolute -left-2 top-3">
          <EmbroideredAccent color="blue" index={0} size={30} opacity={80} />
        </FloatingAccent>
      </div>

      <div className="relative mx-auto max-w-[800px] px-6 text-center">
        {/* Logo, flanked by flowers */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="relative mx-auto flex items-center justify-center gap-4"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 opacity-[0.12]"
            style={{ background: 'radial-gradient(50% 50% at 50% 50%, var(--color-thread-yellow), transparent 70%)' }}
          />
          <FloatingAccent duration={6} distance={6} rotate={3} className="hidden shrink-0 sm:block">
            <EmbroideredAccent color="yellow" index={0} size={72} opacity={80} />
          </FloatingAccent>
          <img
            src={orgFairLogo}
            alt="Dia de Colores OrgFair 2026"
            className="w-[70%] sm:w-[380px] lg:w-[460px]"
          />
          <FloatingAccent duration={7} delay={0.5} distance={6} rotate={-3} className="hidden shrink-0 sm:block">
            <EmbroideredAccent color="pink" index={0} size={72} opacity={80} />
          </FloatingAccent>
        </motion.div>

        {/* Staggered, line-by-line headline */}
        <h1 className="mt-10 font-display text-4xl font-bold leading-[1.15] tracking-[-0.02em] text-trust-blue md:text-5xl lg:text-6xl">
          {HEADLINE_LINES.map((line, i) => (
            <motion.span
              key={line}
              initial={shouldReduceMotion ? undefined : { opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.2, ease: 'easeOut' }}
              className="block"
            >
              {line}
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={shouldReduceMotion ? undefined : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9, ease: 'easeOut' }}
          className="mx-auto mt-6 max-w-[64ch] font-body text-lg leading-relaxed text-fabric-dark"
        >
          <strong className="font-bold text-trust-blue">RecWeek</strong> is Ateneo de Zamboanga
          University&apos;s annual organization recruitment week, where students explore accredited
          organizations, attend campus-wide activities, discover new opportunities, and find
          communities that inspire their college journey.
        </motion.p>

        <motion.div
          initial={shouldReduceMotion ? undefined : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.1, ease: 'easeOut' }}
          className="relative mt-9 inline-block"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 scale-150 opacity-[0.08]"
            style={{ background: 'radial-gradient(50% 50% at 50% 50%, var(--color-trust-blue), transparent 70%)' }}
          />
          <motion.div whileHover={{ y: -4, scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={{ duration: 0.2 }}>
            <Link
              to="/recweek/map"
              className={cn(buttonVariants({ variant: 'primary' }), 'transition-shadow hover:shadow-[0_14px_32px_rgba(46,74,143,0.22)]')}
            >
              <MapPin size={18} strokeWidth={1.75} />
              Explore Interactive Maps
            </Link>
          </motion.div>
        </motion.div>

        <DriftingThread src={threadsByColor.pink[0]} className="mx-auto mt-8 w-24" duration={5} />

        <Link
          to="/recweek/map"
          aria-label="Explore Booth Locations"
          className="relative mx-auto mt-2 block w-fit"
          onMouseEnter={() => setMapHovered(true)}
          onMouseLeave={() => setMapHovered(false)}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 scale-150 opacity-[0.1]"
            style={{ background: 'radial-gradient(50% 50% at 50% 50%, var(--color-thread-yellow), transparent 70%)' }}
          />
          <motion.div
            animate={shouldReduceMotion ? undefined : { rotate: [-2, 2, -2] }}
            whileHover={{ scale: 1.05 }}
            transition={{ rotate: { duration: 6, repeat: Infinity, ease: 'easeInOut' }, default: { duration: 0.25 } }}
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
          className="mt-14 inline-flex flex-col items-center gap-2 font-body text-xs font-medium uppercase tracking-[0.14em] text-stitch-gray transition-colors hover:text-trust-blue"
        >
          Scroll to Discover the Journey
          <motion.img
            src={flowersByColor.pink[0]}
            alt=""
            role="presentation"
            className="h-5 w-5"
            animate={shouldReduceMotion ? undefined : { y: [0, 6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          />
          <DriftingThread src={threadsByColor.pink[0]} className="w-16" duration={5} />
        </a>
      </div>

      <ThreadBorder
        color="blue"
        edge="bottom"
        className="absolute -bottom-2 left-1/2 w-72 max-w-none -translate-x-1/2 opacity-40"
      />
    </section>
  )
}
