import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import type { Organization } from '../../lib/contentful/types'
import { boardStyleFor, type PaperStyle } from '../../lib/boardStyle'
import { EmbroideredAccent } from '../EmbroideredAccent'
import { PushPin } from './PushPin'
import { MaskingTape } from './MaskingTape'
import { CategorySticker } from './CategorySticker'
import { clusterBySlug } from '../../config/clusters'

/** Per-paper surface: base color + optional ruled/grid lines. Texture overlay added separately. */
function paperSurface(paper: PaperStyle): React.CSSProperties {
  switch (paper) {
    case 'notebook':
      return {
        backgroundColor: 'var(--color-linen-white)',
        backgroundImage:
          'repeating-linear-gradient(var(--color-linen-white) 0 26px, rgba(46,74,143,0.10) 26px 27px)',
      }
    case 'grid':
      return {
        backgroundColor: 'var(--color-linen-white)',
        backgroundImage:
          'repeating-linear-gradient(rgba(46,74,143,0.07) 0 1px, transparent 1px 22px), repeating-linear-gradient(90deg, rgba(46,74,143,0.07) 0 1px, transparent 1px 22px)',
      }
    case 'manila':
      return { backgroundColor: '#ece1c9' }
    case 'polaroid':
      return { backgroundColor: '#ffffff' }
    case 'plain':
    default:
      return { backgroundColor: 'var(--color-linen-white)' }
  }
}

function initials(name: string): string {
  return name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase()
}

interface PinnedCardProps {
  organization: Organization
  index: number
}

export function PinnedCard({ organization, index }: PinnedCardProps) {
  const shouldReduceMotion = useReducedMotion()
  const style = boardStyleFor(organization.id, organization.cluster.slug, Boolean(organization.logo))
  const cluster = clusterBySlug(organization.cluster.slug)

  const restRotate = shouldReduceMotion ? 0 : style.rotation
  const enter = { opacity: 1, y: 0, rotate: restRotate }
  const initial = shouldReduceMotion ? false : { opacity: 0, y: -24, rotate: 0 }

  const isPolaroid = style.paper === 'polaroid'

  return (
    <motion.div
      initial={initial}
      animate={enter}
      transition={{ duration: 0.45, ease: 'easeOut', delay: shouldReduceMotion ? 0 : Math.min(index, 14) * 0.04 }}
      whileHover={shouldReduceMotion ? undefined : { rotate: 0, y: -6, scale: 1.02 }}
      className="group relative"
      style={{ transformOrigin: 'center top' }}
    >
      {style.fastener === 'pin' ? (
        <PushPin hex={style.hex} offset={style.fastenerOffset} />
      ) : (
        <MaskingTape offset={style.fastenerOffset} />
      )}

      {/* corner flower — wiggles ambiently, more on hover */}
      {cluster && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -right-3 -bottom-3 z-20"
          animate={shouldReduceMotion ? undefined : { rotate: [-5, 5, -5] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          whileHover={shouldReduceMotion ? undefined : { rotate: 12 }}
        >
          <EmbroideredAccent color={cluster.color} index={0} size={30} opacity={85} />
        </motion.div>
      )}

      <Link
        to={`/organizations/${organization.slug}`}
        className="relative block overflow-hidden rounded-[6px] shadow-[0_6px_20px_rgba(46,74,143,0.10)] outline-offset-4 transition-shadow duration-300 group-hover:shadow-[0_16px_34px_rgba(46,74,143,0.20)]"
        style={{ ...paperSurface(style.paper), borderTop: `3px solid ${style.hex}` }}
      >
        {/* paper texture overlay */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-multiply"
          style={{ backgroundImage: "url('/textures/paper-texture-1.webp')", backgroundSize: '260px' }}
        />

        {isPolaroid && organization.logo ? (
          <div className="relative p-3 pb-0">
            <img
              src={organization.logo}
              alt={organization.name}
              loading="lazy"
              className="aspect-square w-full rounded-[3px] bg-canvas-cream object-contain p-4 transition-transform duration-500 group-hover:scale-[1.03]"
            />
            <div className="px-1 pb-4 pt-3">
              <p className="font-accent text-2xl leading-none text-trust-blue">{organization.name}</p>
              <div className="mt-3 flex flex-col gap-2.5">
                <CategorySticker slug={organization.cluster.slug} className="self-start" />
                <p className="line-clamp-2 font-body text-sm leading-relaxed text-fabric-dark">{organization.description}</p>
                <span className="inline-flex items-center gap-1.5 font-body text-sm font-medium text-trust-blue transition-colors group-hover:text-thread-red">
                  Learn more <ArrowRight size={15} strokeWidth={1.75} />
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative flex flex-col gap-3 p-5">
            <div className="flex items-center gap-3">
              {organization.logo ? (
                <img
                  src={organization.logo}
                  alt=""
                  loading="lazy"
                  className="h-11 w-11 shrink-0 rounded-full border border-trust-blue/10 bg-linen-white object-cover"
                />
              ) : (
                <span
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full font-display text-sm font-bold"
                  style={{ backgroundColor: `${style.hex}1a`, color: style.hex }}
                >
                  {initials(organization.name)}
                </span>
              )}
              <CategorySticker slug={organization.cluster.slug} />
            </div>
            <h3 className="font-display text-lg font-bold leading-tight text-trust-blue">{organization.name}</h3>
            <p className="line-clamp-2 font-body text-sm leading-relaxed text-fabric-dark">{organization.description}</p>
            <span className="inline-flex items-center gap-1.5 font-body text-sm font-medium text-trust-blue transition-colors group-hover:text-thread-red">
              Learn more <ArrowRight size={15} strokeWidth={1.75} />
            </span>
          </div>
        )}
      </Link>
    </motion.div>
  )
}
