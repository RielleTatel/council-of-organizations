import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

interface FloatingAccentProps {
  children: ReactNode
  duration?: number
  delay?: number
  distance?: number
  rotate?: number
  className?: string
}

/** Wraps a decorative accent (flower, thread) in a slow, ambient float + sway loop. */
export function FloatingAccent({ children, duration = 6, delay = 0, distance = 10, rotate = 6, className }: FloatingAccentProps) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      className={className}
      animate={shouldReduceMotion ? undefined : { y: [0, -distance, 0], rotate: [0, rotate, 0] }}
      transition={{ duration, repeat: Infinity, ease: 'easeInOut', delay }}
    >
      {children}
    </motion.div>
  )
}
