import { motion } from 'framer-motion'
import { ThreadBorder } from '../ThreadBorder'
import { EmbroideredAccent } from '../EmbroideredAccent'
import { FloatingAccent } from '../ui/FloatingAccent'
import { SectionGlow } from '../ui/SectionGlow'
import { heroAccents } from '../../lib/heroAccents'
import type { ThreadColor } from '../../lib/assets'

interface PageHeaderDecorProps {
  accent: ThreadColor
  variant: 'cream' | 'ink'
}

/** Ambient, non-interactive decoration for a page hero: woven edges, dashed
 *  corner motifs, a soft glow, and drifting embroidered flowers in the margins.
 *  All desktop-only except the top woven edge (design system §9). */
export function PageHeaderDecor({ accent, variant }: PageHeaderDecorProps) {
  const accents = heroAccents(accent)
  const circle = variant === 'ink' ? 'border-linen-white/10' : 'border-stitch-gray/[0.10]'

  return (
    <>
      {/* Woven thread edges — signature element (§5.A). Corner-anchored, well clear
          of the centered text column. Scaled down (not hidden) below lg so the
          header keeps its identity at mobile/tablet widths too. */}
      <ThreadBorder
        color={accent}
        edge="top"
        className="absolute -top-2 -left-2 w-20 max-w-none opacity-40 sm:-top-3 sm:-left-3 sm:w-32 lg:w-44"
      />
      <ThreadBorder
        color={accent}
        edge="bottom"
        flip
        className="absolute -bottom-2 -right-2 w-20 max-w-none opacity-40 sm:-bottom-3 sm:-right-3 sm:w-32 lg:w-44"
      />

      {/* Dashed stitch-circle corner motifs (mirrors landing hero) — depth + frame */}
      <motion.div
        aria-hidden
        className={`pointer-events-none absolute -right-10 -top-10 block h-36 w-36 rounded-full border-2 border-dashed sm:-right-16 sm:-top-16 sm:h-48 sm:w-48 lg:-right-24 lg:-top-24 lg:h-72 lg:w-72 ${circle}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      />
      <motion.div
        aria-hidden
        className={`pointer-events-none absolute -bottom-8 -left-8 block h-32 w-32 rounded-full border-2 border-dashed sm:-bottom-14 sm:-left-14 sm:h-44 sm:w-44 lg:-bottom-20 lg:-left-20 lg:h-64 lg:w-64 ${circle}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      />

      {/* Soft radial glow so the title sits on depth, not flat color */}
      <SectionGlow className="left-1/2 top-6 -translate-x-1/2" />

      {/* Drifting flowers in the side margins — never over the text (§1). Scaled
          down below lg rather than hidden, so mobile/tablet still get the accent. */}
      {accents.map((a, i) => (
        <div
          key={i}
          aria-hidden
          className="pointer-events-none absolute block scale-[0.65] sm:scale-90 lg:scale-100"
          style={{ top: `${a.top}%`, [a.side]: `${a.inset}%` } as React.CSSProperties}
        >
          <FloatingAccent duration={a.duration} delay={a.delay} distance={a.distance} rotate={a.rotate} className="opacity-70">
            <EmbroideredAccent color={a.color} index={0} size={a.size} />
          </FloatingAccent>
        </div>
      ))}
    </>
  )
}
