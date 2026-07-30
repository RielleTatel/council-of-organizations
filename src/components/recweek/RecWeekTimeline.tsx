import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { buttonVariants } from '../ui/Button'
import { EmbroideredAccent } from '../EmbroideredAccent'
import { Reveal } from '../ui/Reveal'
import { milestones, type Milestone } from '../../data/recweek'

function TimelineItem({ milestone, index }: { milestone: Milestone; index: number }) {
  const isRight = index % 2 === 1
  const shouldReduceMotion = useReducedMotion()

  return (
    <div className="relative flex items-start gap-6 lg:gap-0">
      <div className="absolute left-5 top-1 z-10 -translate-x-1/2 lg:left-1/2">
        <motion.div
          initial={{ opacity: 0, scale: 0.4 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-linen-white shadow-[0_4px_16px_rgba(46,74,143,0.12)]"
        >
          <EmbroideredAccent color={milestone.color} index={0} size={28} />
        </motion.div>
      </div>

      <div className="w-full pl-16 lg:grid lg:grid-cols-2 lg:gap-16 lg:pl-0">
        <div className={isRight ? 'lg:col-start-2' : ''}>
          <motion.article
            initial={shouldReduceMotion ? undefined : { opacity: 0, y: 60, x: isRight ? 60 : -60, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, x: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="group overflow-hidden rounded-[8px] border border-trust-blue/10 bg-linen-white shadow-[0_4px_20px_rgba(46,74,143,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(46,74,143,0.12)]"
          >
            <div className="relative">
              <img
                src={milestone.image}
                alt=""
                role="presentation"
                loading="lazy"
                className="aspect-[16/10] w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
              />
              <EmbroideredAccent color={milestone.color} index={0} size={28} className="absolute right-3 top-3 opacity-90" />
            </div>

            <div className="p-7">
            <h3 className="font-display text-2xl font-bold text-trust-blue">{milestone.title}</h3>
            <p className="mt-2 flex items-center gap-1.5 font-body text-sm font-medium uppercase tracking-[0.1em] text-stitch-gray">
              📅 {milestone.dateLabel}
            </p>

            <div className="mt-4 flex flex-col gap-3 font-body leading-relaxed text-fabric-dark">
              {milestone.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            {milestone.bullets && (
              <>
                {milestone.bulletsLabel && (
                  <p className="mt-4 font-body text-xs font-medium uppercase tracking-[0.14em] text-thread-pink">
                    {milestone.bulletsLabel}
                  </p>
                )}
                <ul className="mt-2 grid grid-cols-1 gap-x-6 gap-y-1.5 font-body text-fabric-dark sm:grid-cols-2">
                  {milestone.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-2">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-thread-red" aria-hidden />
                      {bullet}
                    </li>
                  ))}
                </ul>
              </>
            )}

            {milestone.cta && (
              <Link
                to={milestone.cta.href}
                className="mt-5 inline-flex items-center gap-1.5 font-body font-medium text-trust-blue transition-colors group-hover:text-thread-red"
              >
                {milestone.cta.label}
                <ArrowRight size={16} strokeWidth={1.75} />
              </Link>
            )}
            </div>
          </motion.article>
        </div>
      </div>
    </div>
  )
}

export function RecWeekTimeline()  {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.25', 'end 0.75'],
  })
  const scaleY = useSpring(scrollYProgress, { stiffness: 60, damping: 20, restDelta: 0.001 })

  return (
    <section id="timeline" className="scroll-mt-24 bg-linen-white pb-20 pt-12 md:pb-28 md:pt-16">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="mx-auto mb-16 max-w-[700px] text-center">
          <span className="font-body text-xs font-medium uppercase tracking-[0.14em] text-thread-pink">
            The Journey
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-[-0.02em] text-trust-blue md:text-4xl">
            One Week, Woven Together
          </h2>
        </div>

        <div ref={containerRef} className="relative">
          <div className="absolute left-5 top-0 h-full w-[3px] border-l-2 border-dashed border-stitch-gray/30 lg:left-1/2 lg:-translate-x-1/2" />
          <motion.div
            aria-hidden
            style={{ scaleY, transformOrigin: 'top' }}
            className="absolute left-5 top-0 h-full w-[3px] rounded-full bg-thread-red lg:left-1/2 lg:-translate-x-1/2"
          />

          <div className="flex flex-col gap-16 lg:gap-20">
            {milestones.map((milestone, index) => (
              <TimelineItem key={milestone.title} milestone={milestone} index={index} />
            ))}
          </div>
        </div>

        <Reveal className="mx-auto mt-24 max-w-[700px] rounded-[8px] border border-trust-blue/10 bg-canvas-cream p-10 text-center shadow-[0_4px_20px_rgba(46,74,143,0.06)]">
          <h2 className="font-display text-2xl font-bold tracking-[-0.02em] text-trust-blue md:text-3xl">
            Ready to explore?
          </h2>
          <p className="mx-auto mt-3 max-w-[48ch] font-body leading-relaxed text-fabric-dark">
            Find your favorite organizations using the interactive booth maps.
          </p>
          <Link to="/recweek/map" className={`${buttonVariants({ variant: 'primary' })} mt-6`}>
            Explore Booth Maps
            <ArrowRight size={18} strokeWidth={1.75} />
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
