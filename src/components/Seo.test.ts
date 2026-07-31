import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const source = readFileSync(resolve(__dirname, './Seo.tsx'), 'utf-8')

describe('Seo', () => {
  it('sets the page title and description', () => {
    expect(source).toContain('<title>{title}</title>')
    expect(source).toContain('name="description" content={description}')
  })

  it('does not set og:* or twitter:* tags, since those are static in index.html', () => {
    expect(source).not.toContain('og:title')
    expect(source).not.toContain('og:description')
    expect(source).not.toContain('twitter:card')
  })
})
