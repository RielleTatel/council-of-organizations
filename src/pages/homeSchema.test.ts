import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

describe('Home page structured data', () => {
  it('renders the Organization JSON-LD schema', () => {
    const source = readFileSync(resolve(__dirname, 'Home.tsx'), 'utf-8')
    expect(source).toContain('organizationSchema()')
    expect(source).toContain('<JsonLd')
  })
})
