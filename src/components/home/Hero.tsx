import { Link } from 'react-router-dom'
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform, type Variants } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { buttonVariants } from '../ui/Button'
import { EmbroideredAccent } from '../EmbroideredAccent'
import { ThreadBorder } from '../ThreadBorder'
import { SectionGlow } from '../ui/SectionGlow'
import { siteLogo } from '../../lib/assets'

const fabricNoise =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'>" +
      "<filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/>" +
      "<feColorMatrix type='matrix' values='0 0 0 0 0.24  0 0 0 0 0.24  0 0 0 0 0.24  0 0 0 0.5 0'/></filter>" +
      "<rect width='100%' height='100%' filter='url(#n)'/></svg>",
  )

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14, delayChildren: 0.05 } },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

export function Hero() {
  const shouldReduceMotion = useReducedMotion()

  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)

  const spring = { stiffness: 50, damping: 20, mass: 0.5 }
  const bgX = useSpring(useTransform(pointerX, [-0.5, 0.5], [-3, 3]), spring)
  const bgY = useSpring(useTransform(pointerY, [-0.5, 0.5], [-3, 3]), spring)
  const logoX = useSpring(useTransform(pointerX, [-0.5, 0.5], [-6, 6]), spring)
  const logoY = useSpring(useTransform(pointerY, [-0.5, 0.5], [-6, 6]), spring)
  const flowerX = useSpring(useTransform(pointerX, [-0.5, 0.5], [-10, 10]), spring)
  const flowerY = useSpring(useTransform(pointerY, [-0.5, 0.5], [-10, 10]), spring)

  function handleMouseMove(e: React.MouseEvent<HTMLElement>) {
    if (shouldReduceMotion) return
    const rect = e.currentTarget.getBoundingClientRect()
    pointerX.set((e.clientX - rect.left) / rect.width - 0.5)
    pointerY.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  function handleMouseLeave() {
    pointerX.set(0)
    pointerY.set(0)
  }

  return (
    <section
      className="relative flex min-h-[100dvh] items-center overflow-hidden bg-canvas-cream"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-multiply"
        style={{ backgroundImage: `url("${fabricNoise}")`, backgroundSize: '220px 220px' }}
      />

      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border-2 border-dashed border-stitch-gray/[0.08]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full border-2 border-dashed border-stitch-gray/[0.08]"
      />

      <ThreadBorder
        color="blue"
        edge="bottom"
        flip
        className="absolute -bottom-2 left-0 w-72 max-w-none opacity-40 hidden lg:block"
      />

      <motion.div
        aria-hidden
        className="pointer-events-none absolute right-0 top-1/2 h-[420px] w-[420px] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(46,74,143,0.12),transparent_70%)] blur-3xl lg:h-[600px] lg:w-[600px]"
        style={{ x: bgX, y: bgY }}
        animate={shouldReduceMotion ? undefined : { opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-6 px-10 py-20 lg:grid-cols-[1.1fr_0.9fr]">
        <motion.div
          className="relative flex flex-col gap-6 text-center lg:text-left"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <SectionGlow className="left-1/4 top-0 hidden lg:block" />

          <motion.h1
            variants={itemVariants}
            className="font-display text-4xl font-bold leading-[1.1] tracking-[-0.02em] text-trust-blue md:text-5xl lg:text-6xl"
          >
            Empowering Student Organizations. Inspiring Collaborative Leadership.
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mx-auto max-w-[60ch] font-body text-lg leading-relaxed text-fabric-dark lg:mx-0"
          >
            The official alliance of all accredited college organizations of Ateneo de Zamboanga
            University, strengthening collaboration and empowering student leaders to create meaningful impact.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-wrap items-center justify-center gap-4 pt-2 lg:justify-start"
          >
            <Link to="/organizations" className={buttonVariants({ variant: 'primary' })}>
              Explore Organizations
            </Link>
            <Link to="/about" className={buttonVariants({ variant: 'secondary' })}>
              Learn More About COA-Z
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          className="relative mx-auto w-full max-w-md"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.6, ease: 'easeOut' }}
        >
          <ThreadBorder
            color="blue"
            edge="bottom"
            className="pointer-events-none absolute -top-10 right-0 w-72 max-w-none rotate-12 opacity-30"
          />

          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-[-4%] rounded-full border-2 border-dashed border-stitch-gray/15"
            animate={shouldReduceMotion ? undefined : { rotate: 360 }}
            transition={{ duration: 90, repeat: Infinity, ease: 'linear' }}
          />

          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-[12%] bottom-[4%] h-6 rounded-full bg-fabric-dark/10 blur-xl"
          />

          <motion.div style={{ x: logoX, y: logoY }}>
            <motion.img
              src={siteLogo}
              alt="COA-Z logo"
              width={1200}
              height={1200}
              loading="eager"
              className="h-auto w-full"
              animate={shouldReduceMotion ? undefined : { y: [0, -10, 0], rotate: [-3, 3, -3] }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
            />
          </motion.div>

          <motion.svg
            aria-hidden
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.6, ease: 'easeOut' }}
          >
            <path
              d="M 8 14 C -8 48, 18 88, 40 82 S 88 78, 93 78"
              fill="none"
              stroke="var(--color-thread-blue)"
              strokeOpacity={0.35}
              strokeWidth={1.6}
              strokeLinecap="round"
              strokeDasharray="4 4"
            />
          </motion.svg>

          <motion.div
            className="absolute -left-4 top-8"
            style={{ x: flowerX, y: flowerY }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 1.3 }}
          >
            <motion.div
              animate={shouldReduceMotion ? undefined : { y: [0, -12, 0], rotate: [0, 8, 0], scale: [1, 1.08, 1] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <EmbroideredAccent color="yellow" index={0} size={64} />
            </motion.div>
          </motion.div>

          <motion.div
            className="absolute -right-2 bottom-10"
            style={{ x: flowerX, y: flowerY }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 1.5 }}
          >
            <motion.div
              animate={shouldReduceMotion ? undefined : { y: [0, 10, 0], rotate: [0, -10, 0], scale: [1, 1.06, 1] }}
              transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
            >
              <EmbroideredAccent color="pink" index={0} size={56} />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1 text-trust-blue/60"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: shouldReduceMotion ? 0 : [0, 8, 0] }}
        transition={{ opacity: { duration: 0.6, delay: 1.8 }, y: { duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 1.8 } }}
      >
        <span className="font-body text-[10px] font-medium uppercase tracking-[0.14em]">Scroll</span>
        <ChevronDown size={20} strokeWidth={1.75} />
      </motion.div>
    </section>
  )
}
