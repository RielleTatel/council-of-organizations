import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { CalendarDays, MapPin, PartyPopper, Compass, ArrowRight } from 'lucide-react'
import { EmbroideredAccent } from '../EmbroideredAccent'
import { FloatingAccent } from '../ui/FloatingAccent'
import { DriftingThread } from '../ui/DriftingThread'
import { buttonVariants } from '../ui/Button'
import { orgFairLogo, threadsByColor } from '../../lib/assets'
import { cn } from '../../lib/utils'

const HEADLINE_LINES = ['Discover Organizations.', 'Meet New People.', 'Find Your Community.']

const BADGES = [
  { icon: CalendarDays, label: 'August 11–13, 2026', border: 'border-thread-pink/50' },
  { icon: MapPin, label: 'Ateneo de Zamboanga University', border: 'border-trust-blue/40' },
  { icon: PartyPopper, label: 'Open to All Students', border: 'border-thread-green/50' },
] as const

export function RecWeekHero() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section className="relative overflow-hidden bg-canvas-cream pb-6 pt-28 md:pb-14 md:pt-32">
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
          transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
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
              transition={{ duration: 0.5, delay: 0.35 + i * 0.1, ease: 'easeOut' }}
              className="block"
            >
              {line}
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={shouldReduceMotion ? undefined : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5, ease: 'easeOut' }}
          className="mx-auto mt-6 max-w-[64ch] font-body text-lg leading-relaxed text-fabric-dark"
        >
          <strong className="font-bold text-trust-blue">RecWeek</strong> is Ateneo de Zamboanga
          University&apos;s annual organization recruitment week, where students explore accredited
          organizations, attend campus-wide activities, discover new opportunities, and find
          communities that inspire their college journey.
        </motion.p>

        {/* Event info badges */}
        <motion.div
          initial={shouldReduceMotion ? undefined : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.65, ease: 'easeOut' }}
          className="mt-7 flex flex-wrap items-center justify-center gap-3"
        >
          {BADGES.map(({ icon: Icon, label, border }) => (
            <span
              key={label}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full border-2 bg-linen-white px-4 py-1.5 font-body text-sm font-medium text-fabric-dark shadow-[0_2px_10px_rgba(46,74,143,0.08)] transition-transform duration-300 hover:-translate-y-1',
                border,
              )}
            >
              <Icon size={15} strokeWidth={1.75} className="text-trust-blue" />
              {label}
            </span>
          ))}
        </motion.div>

        {/* Explore the Organization Fair */}
        <div className="relative mt-16">
          <FloatingAccent duration={5} distance={6} rotate={0} className="absolute -left-2 top-0 hidden sm:block">
            <EmbroideredAccent color="pink" index={0} size={44} opacity={80} />
          </FloatingAccent>
          <FloatingAccent duration={6} delay={0.3} distance={0} rotate={3} className="absolute -right-2 top-0 hidden sm:block">
            <EmbroideredAccent color="yellow" index={1} size={44} opacity={80} />
          </FloatingAccent>

          <motion.h2
            initial={shouldReduceMotion ? undefined : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8, ease: 'easeOut' }}
            className="font-display text-2xl font-bold tracking-[-0.02em] text-trust-blue md:text-3xl"
          >
            Explore the Organization Fair
          </motion.h2>

          <DriftingThread src={threadsByColor.red[0]} className="mx-auto mt-3 w-20" duration={5} />

          <motion.p
            initial={shouldReduceMotion ? undefined : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.95, ease: 'easeOut' }}
            className="mx-auto mt-4 max-w-[52ch] font-body leading-relaxed text-fabric-dark"
          >
            Looking for a specific organization? Explore our interactive campus maps to locate
            booths, discover featured organizations, and plan your RecWeek journey with ease.
          </motion.p>

          <motion.div
            initial={shouldReduceMotion ? undefined : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.1, ease: 'easeOut' }}
            className="relative mt-7 inline-block"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-10 scale-150 opacity-[0.08]"
              style={{ background: 'radial-gradient(50% 50% at 50% 50%, var(--color-trust-blue), transparent 70%)' }}
            />
            <motion.div whileHover={{ y: -4, scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={{ duration: 0.2 }}>
              <Link
                to="/recweek/map"
                className={cn(buttonVariants({ variant: 'primary' }), 'group transition-shadow hover:shadow-[0_14px_32px_rgba(46,74,143,0.22)]')}
              >
                <Compass size={18} strokeWidth={1.75} />
                Recweek Map!
                <motion.span className="inline-flex" whileHover={{ x: 6 }} transition={{ duration: 0.2 }}>
                  <ArrowRight size={18} strokeWidth={1.75} />
                </motion.span>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
