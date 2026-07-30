import { describe, it, expect } from 'vitest'
import { heroAccents } from './heroAccents'
import type { ThreadColor } from './assets'

const ALL: ThreadColor[] = ['red', 'blue', 'green', 'yellow', 'pink', 'purple', 'gold', 'teal']

describe('heroAccents', () => {
  it('is deterministic for the same accent', () => {
    expect(heroAccents('blue')).toEqual(heroAccents('blue'))
  })

  it('returns exactly 3 balanced accents including the primary', () => {
    for (const c of ALL) {
      const specs = heroAccents(c)
      expect(specs).toHaveLength(3)
      expect(specs.some((s) => s.color === c)).toBe(true)
    }
  })

  it('never uses more than 3 distinct colors (design system §2)', () => {
    for (const c of ALL) {
      const colors = new Set(heroAccents(c).map((s) => s.color))
      expect(colors.size).toBeLessThanOrEqual(3)
    }
  })

  it('keeps every accent inside the side margins and band', () => {
    for (const c of ALL) {
      for (const s of heroAccents(c)) {
        expect(['left', 'right']).toContain(s.side)
        expect(s.top).toBeGreaterThanOrEqual(0)
        expect(s.top).toBeLessThanOrEqual(100)
        expect(s.inset).toBeGreaterThanOrEqual(0)
        expect(s.inset).toBeLessThanOrEqual(15)
      }
    }
  })
})
