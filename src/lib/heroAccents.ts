import type { ThreadColor } from './assets'

export interface AccentSpec {
  color: ThreadColor
  size: number
  /** Which margin the accent floats in. */
  side: 'left' | 'right'
  /** Vertical position within the header band, % from top. */
  top: number
  /** Horizontal inset from the edge, % of band width (kept small → stays in margin). */
  inset: number
  duration: number
  delay: number
  distance: number
  rotate: number
}

/**
 * Two supporting hues per primary that "weave together" with it (design system
 * §2: never more than 2–3 accents, woven not scattered). Analogous/adjacent
 * picks keep each viewport harmonious rather than rainbow.
 */
const COMPANIONS: Record<ThreadColor, [ThreadColor, ThreadColor]> = {
  blue: ['green', 'yellow'],
  red: ['pink', 'yellow'],
  green: ['blue', 'yellow'],
  yellow: ['green', 'pink'],
  pink: ['purple', 'blue'],
  purple: ['pink', 'blue'],
}

/**
 * Deterministic set of 3 ambient embroidered accents framing the centered hero
 * content from the side margins — never overlapping it. Pure (no Math.random)
 * so reloads stay stable and balanced.
 */
export function heroAccents(accent: ThreadColor): AccentSpec[] {
  const [c1, c2] = COMPANIONS[accent]
  return [
    { color: accent, size: 30, side: 'left', top: 24, inset: 6, duration: 6, delay: 0.2, distance: 8, rotate: 6 },
    { color: c1, size: 22, side: 'left', top: 68, inset: 12, duration: 7, delay: 0.5, distance: 7, rotate: -8 },
    { color: c2, size: 26, side: 'right', top: 34, inset: 8, duration: 6.5, delay: 0.35, distance: 9, rotate: 7 },
  ]
}
