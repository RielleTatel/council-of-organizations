import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

describe('RecWeek structured data', () => {
  it('renders Event JSON-LD with the correct dates', () => {
    const source = readFileSync(resolve(__dirname, 'RecWeek.tsx'), 'utf-8')
    expect(source).toContain('eventSchema(')
    expect(source).toContain("startDate: '2026-08-03'")
    expect(source).toContain("endDate: '2026-08-07'")
  })
})
