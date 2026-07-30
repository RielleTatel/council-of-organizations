import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '../../lib/utils'

/** A thread illustration with a barely-there opacity pulse — the "stitched" ambient layer. */
export function DriftingThread({ src, className, duration = 5, delay = 0 }: { src: string; className?: string; duration?: number; delay?: number }) {
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
