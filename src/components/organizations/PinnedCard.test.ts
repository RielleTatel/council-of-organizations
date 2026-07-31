import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

describe('PinnedCard', () => {
  it('gives the organization logo a descriptive alt, not an empty one', () => {
    const source = readFileSync(resolve(__dirname, './PinnedCard.tsx'), 'utf-8')
    expect(source).toContain('alt={organization.name}')
  })
})
