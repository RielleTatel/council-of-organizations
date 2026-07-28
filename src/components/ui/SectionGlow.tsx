import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '../../lib/utils'

/** Soft radial fabric-highlight glow, meant to sit behind a heading or card within a `relative` ancestor. */
export function SectionGlow({ className }: { className?: string }) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      aria-hidden
      className={cn(
        'pointer-events-none absolute -z-10 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(46,74,143,0.10),transparent_70%)] blur-2xl',
        className,
      )}
      animate={shouldReduceMotion ? undefined : { opacity: [0.7, 1, 0.7] }}
      transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
    />
  )
}
