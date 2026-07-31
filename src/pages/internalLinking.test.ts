import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

describe('internal linking', () => {
  it('Leadership.tsx links to Organizations', () => {
    const source = readFileSync(resolve(__dirname, 'Leadership.tsx'), 'utf-8')
    expect(source).toContain('to="/organizations"')
  })

  it('About.tsx links to Leadership', () => {
    const source = readFileSync(resolve(__dirname, 'About.tsx'), 'utf-8')
    expect(source).toContain('to="/leadership"')
  })

  it('RecWeek.tsx links to Organizations', () => {
    const source = readFileSync(resolve(__dirname, 'RecWeek.tsx'), 'utf-8')
    expect(source).toContain('to="/organizations"')
  })
})
