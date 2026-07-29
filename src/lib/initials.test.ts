import { describe, it, expect } from 'vitest'
import { getInitials } from './initials'

describe('getInitials', () => {
  it('skips a single middle initial', () => {
    expect(getInitials('Aubrey Mae L. Tomong')).toBe('AT')
  })

  it('skips a multi-letter middle initial', () => {
    expect(getInitials('David Isidore D.R. De Leon')).toBe('DL')
  })

  it('uses first and last token when there is no middle initial', () => {
    expect(getInitials('Ken S. Ordeniza')).toBe('KO')
    expect(getInitials('Kristel Ricalde')).toBe('KR')
  })

  it('returns a single letter for a single-token name', () => {
    expect(getInitials('Cher')).toBe('C')
  })

  it('trims surrounding whitespace and repeated spaces', () => {
    expect(getInitials('  Jhan Drei   T. Araña ')).toBe('JA')
  })
})
