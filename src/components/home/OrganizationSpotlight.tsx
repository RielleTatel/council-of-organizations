import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, ArrowLeft, Users } from 'lucide-react'
import { useSpotlightOrganizations } from '../../hooks/useHomeData'
import { buttonVariants } from '../ui/Button'
import { ClusterBadge } from '../shared/ClusterBadge'
import { EmbroideredAccent } from '../EmbroideredAccent'
import { ThreadBorder } from '../ThreadBorder'
import { Reveal } from '../ui/Reveal'
import { SectionGlow } from '../ui/SectionGlow'
import { FloatingAccent } from '../ui/FloatingAccent'
import { hoopFrames, threadHex } from '../../lib/assets'
import { clusterBySlug } from '../../config/clusters'
import { cn } from '../../lib/utils'

const AUTOPLAY_MS = 9000

export function OrganizationSpotlight() {
  const { organizations, isLoading } = useSpotlightOrganizations()
  const shouldReduceMotion = useReducedMotion()
  const [activeIndex, setActiveIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (organizations.length === 0) setActiveIndex(0)
    else if (activeIndex >= organizations.length) setActiveIndex(0)
  }, [organizations.length, activeIndex])

  useEffect(() => {
    if (shouldReduceMotion || paused || organizations.length < 2) return
    const id = setInterval(() => {
      setActiveIndex((i) => (i + 1) % organizations.length)
    }, AUTOPLAY_MS)
    return () => clearInterval(id)
  }, [shouldReduceMotion, paused, organizations.length])

  if (!isLoading && organizations.length === 0) return null

  const active = organizations[activeIndex]

  function goPrev() {
    setActiveIndex((i) => (i - 1 + organizations.length) % organizations.length)
  }
  function goNext() {
    setActiveIndex((i) => (i + 1) % organizations.length)
  }

  return (
    <section
      className="relative bg-linen-white py-20 md:py-28"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <ThreadBorder
        color="pink"
        edge="top"
        className="absolute left-1/2 top-0 w-60 max-w-none -translate-x-1/2 -translate-y-1/2"
      />
      <div className="mx-auto max-w-[1200px] px-6">
        <Reveal className="relative mb-10 text-center">
          <SectionGlow className="left-1/2 top-0 -translate-x-1/2" />
          <h2 className="font-display text-3xl font-bold tracking-[-0.02em] text-trust-blue md:text-4xl">
            Organization Spotlight
          </h2>
          <p className="mx-auto mt-4 max-w-[60ch] font-body text-lg leading-relaxed text-fabric-dark">
            Every organization is a unique thread woven into the fabric of our Ateneo community. Discover the
            stories behind a few of them.
          </p>
        </Reveal>

        {isLoading ? (
          <div className="mx-auto h-96 max-w-3xl animate-pulse rounded-[8px] bg-canvas-cream" />
        ) : (
          <>
            <Reveal delay={80} className="mb-10">
              <div
                className="flex justify-center gap-3 overflow-x-auto px-1 pb-2"
                role="tablist"
                aria-label="Featured organizations"
              >
              {organizations.map((org, i) => {
                const isActive = i === activeIndex
                const hex = threadHex[clusterBySlug(org.cluster.slug)?.color ?? 'blue']
                return (
                  <button
                    key={org.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveIndex(i)}
                    className={cn(
                      'flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 font-body text-sm font-medium transition-all duration-300',
                      isActive
                        ? 'border-transparent text-linen-white shadow-[0_4px_16px_rgba(46,74,143,0.18)]'
                        : 'border-trust-blue/15 text-trust-blue hover:scale-105 hover:border-trust-blue/40',
                    )}
                    style={isActive ? { backgroundColor: hex } : undefined}
                  >
                    {org.logo && (
                      <img src={org.logo} alt="" aria-hidden className="h-5 w-5 rounded-full object-cover" />
                    )}
                    {org.name.length > 28 ? `${org.name.slice(0, 26)}…` : org.name}
                  </button>
                )
              })}
              </div>
            </Reveal>

            <div className="relative mx-auto max-w-4xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active.id}
                  initial={shouldReduceMotion ? undefined : { opacity: 0, y: 24, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={shouldReduceMotion ? undefined : { opacity: 0, y: -16, scale: 0.98 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className="grid grid-cols-1 items-center gap-12 rounded-[8px] border border-trust-blue/10 bg-canvas-cream p-8 shadow-[0_4px_20px_rgba(46,74,143,0.06)] md:grid-cols-2 md:p-10"
                >
                  <div className="relative mx-auto w-full max-w-sm">
                    <SectionGlow className="left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
                    <img
                      src={hoopFrames[2]}
                      alt=""
                      role="presentation"
                      width={1200}
                      height={1200}
                      loading="lazy"
                      className="h-auto w-full"
                    />
                    {active.logo ? (
                      <div className="absolute left-1/2 top-1/2 h-[60%] w-[60%] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full bg-linen-white shadow-[0_2px_12px_rgba(46,74,143,0.1)]">
                        <img
                          src={active.logo}
                          alt={`${active.name} logo`}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    ) : null}
                    <FloatingAccent duration={6.5} distance={9} rotate={-6} className="absolute -right-3 top-6">
                      <EmbroideredAccent
                        color={clusterBySlug(active.cluster.slug)?.color ?? 'blue'}
                        index={0}
                        size={52}
                      />
                    </FloatingAccent>
                  </div>

                  <div className="flex flex-col gap-4 text-center md:text-left">
                    <h3 className="font-display text-2xl font-bold text-trust-blue md:text-3xl">
                      {active.name}
                    </h3>
                    <ClusterBadge slug={active.cluster.slug} className="mx-auto md:mx-0" />
                    <p className="max-w-[52ch] font-body leading-relaxed text-fabric-dark">
                      {active.description}
                    </p>
                    {active.officers.length > 0 && (
                      <p className="flex items-center justify-center gap-2 font-body text-sm text-stitch-gray md:justify-start">
                        <Users size={16} strokeWidth={1.75} />
                        {active.officers.length} Listed Officers
                      </p>
                    )}
                    <Link
                      to={`/organizations/${active.slug}`}
                      className={`${buttonVariants({ variant: 'secondary' })} group mt-2 self-center md:self-start`}
                    >
                      View Organization
                      <ArrowRight
                        size={18}
                        strokeWidth={1.75}
                        className="transition-transform duration-300 group-hover:translate-x-1"
                      />
                    </Link>
                  </div>
                </motion.div>
              </AnimatePresence>

              {organizations.length > 1 && (
                <div className="mt-8 flex items-center justify-center gap-6">
                  <button
                    type="button"
                    onClick={goPrev}
                    aria-label="Previous organization"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-trust-blue/15 text-trust-blue transition-colors hover:border-thread-red hover:text-thread-red"
                  >
                    <ArrowLeft size={18} strokeWidth={1.75} />
                  </button>

                  <div className="flex items-center gap-2">
                    {organizations.map((org, i) => (
                      <button
                        key={org.id}
                        type="button"
                        aria-label={`Go to ${org.name}`}
                        onClick={() => setActiveIndex(i)}
                        className={cn(
                          'h-2 rounded-full transition-all duration-300',
                          i === activeIndex ? 'w-6 bg-thread-red' : 'w-2 bg-stitch-gray/30 hover:bg-stitch-gray/50',
                        )}
                      />
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={goNext}
                    aria-label="Next organization"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-trust-blue/15 text-trust-blue transition-colors hover:border-thread-red hover:text-thread-red"
                  >
                    <ArrowRight size={18} strokeWidth={1.75} />
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        <div className="mt-10 text-center">
          <Link
            to="/organizations"
            className="inline-flex items-center gap-1.5 font-body font-medium text-trust-blue transition-colors hover:text-thread-red"
          >
            View All Organizations
            <ArrowRight size={16} strokeWidth={1.75} />
          </Link>
        </div>
      </div>
    </section>
  )
}
