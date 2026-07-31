import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import type { Organization } from '../../lib/contentful/types'
import { boardStyleFor, paperSurface, type DecorationCorner } from '../../lib/boardStyle'
import { EmbroideredAccent } from '../EmbroideredAccent'
import { PushPin } from './PushPin'
import { MaskingTape } from './MaskingTape'
import { CategorySticker } from './CategorySticker'
import { clusterBySlug } from '../../config/clusters'
import { cn } from '../../lib/utils'

function initials(name: string): string {
  return name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase()
}

const CORNER_CLASS: Record<DecorationCorner, string> = {
  'top-right': '-right-3 -top-3',
  'bottom-left': '-left-3 -bottom-3',
  'bottom-right': '-right-3 -bottom-3',
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

  return (
    <motion.div
      initial={initial}
      animate={enter}
      transition={{ duration: 0.45, ease: 'easeOut', delay: shouldReduceMotion ? 0 : Math.min(index, 14) * 0.04 }}
      whileHover={shouldReduceMotion ? undefined : { rotate: 0, y: -6, scale: 1.02 }}
      className="group relative h-full"
      style={{ transformOrigin: 'center top' }}
    >
      {style.fastener === 'pin' ? (
        <PushPin hex={style.hex} offset={0} />
      ) : (
        <MaskingTape offset={style.fastenerOffset} />
      )}

      {/* corner flourish — only a minority of cards, to avoid repetition */}
      {style.hasDecoration && cluster && (
        <motion.div
          aria-hidden
          className={cn('pointer-events-none absolute z-20', CORNER_CLASS[style.decorationCorner])}
          animate={shouldReduceMotion ? undefined : { rotate: [-5, 5, -5] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          whileHover={shouldReduceMotion ? undefined : { rotate: 12 }}
        >
          <EmbroideredAccent color={cluster.color} index={0} size={30} opacity={85} />
        </motion.div>
      )}

      <Link
        to={`/organizations/${organization.slug}`}
        className="relative flex h-full flex-col overflow-hidden rounded-[6px] shadow-[0_6px_20px_rgba(46,74,143,0.10)] outline-offset-4 transition-shadow duration-300 group-hover:shadow-[0_16px_34px_rgba(46,74,143,0.20)]"
        style={{ ...paperSurface(style.paper), borderTop: `3px solid ${style.hex}` }}
      >
        {/* paper texture overlay */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-multiply"
          style={{ backgroundImage: "url('/textures/paper-texture-1.webp')", backgroundSize: '260px' }}
        />

        {/* fixed logo frame — every card, regardless of logo shape, sits in the same box */}
        <div className="relative flex h-[168px] shrink-0 items-center justify-center p-6">
          {organization.logo ? (
            <img
              src={organization.logo}
              alt={organization.name}
              loading="lazy"
              className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <span
              className="flex h-20 w-20 items-center justify-center rounded-full font-display text-2xl font-bold"
              style={{ backgroundColor: `${style.hex}1a`, color: style.hex }}
            >
              {initials(organization.name)}
            </span>
          )}
        </div>

        <div className="relative flex flex-1 flex-col gap-2.5 border-t border-dashed border-trust-blue/10 p-5">
          <CategorySticker slug={organization.cluster.slug} className="self-start" />
          <h3 className="line-clamp-3 font-display text-lg font-bold leading-tight text-trust-blue">
            {organization.name}
          </h3>
          <p className="line-clamp-3 font-body text-sm leading-relaxed text-fabric-dark">{organization.description}</p>
          <span className="mt-auto inline-flex items-center gap-1.5 pt-1 font-body text-sm font-medium text-trust-blue transition-colors group-hover:text-thread-red">
            Learn more
            <ArrowRight size={15} strokeWidth={1.75} className="transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </div>
      </Link>
    </motion.div>
  )
}
