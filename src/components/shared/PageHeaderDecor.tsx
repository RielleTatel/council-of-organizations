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
      {/* Woven thread edges — signature element (§5.A) */}
      <ThreadBorder
        color={accent}
        edge="top"
        className="absolute -top-2 left-1/2 w-72 max-w-none -translate-x-1/2 opacity-50"
      />
      <ThreadBorder
        color={accent}
        edge="bottom"
        flip
        className="absolute -bottom-2 left-1/2 hidden w-72 max-w-none -translate-x-1/2 opacity-50 lg:block"
      />

      {/* Dashed stitch-circle corner motifs (mirrors landing hero) — depth + frame */}
      <motion.div
        aria-hidden
        className={`pointer-events-none absolute -right-24 -top-24 hidden h-72 w-72 rounded-full border-2 border-dashed lg:block ${circle}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      />
      <motion.div
        aria-hidden
        className={`pointer-events-none absolute -bottom-20 -left-20 hidden h-64 w-64 rounded-full border-2 border-dashed lg:block ${circle}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      />

      {/* Soft radial glow so the title sits on depth, not flat color */}
      <SectionGlow className="left-1/2 top-6 -translate-x-1/2" />

      {/* Drifting flowers in the side margins — never over the text (§1) */}
      {accents.map((a, i) => (
        <div
          key={i}
          aria-hidden
          className="pointer-events-none absolute hidden lg:block"
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
