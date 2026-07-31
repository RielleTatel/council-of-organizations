import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

describe('site-wide semantic landmarks', () => {
  it('Navbar renders <header> and <nav>', () => {
    const source = readFileSync(resolve(__dirname, './Navbar.tsx'), 'utf-8')
    expect(source).toContain('<header')
    expect(source).toContain('<nav')
  })

  it('SiteLayout wraps routed page content in <main>', () => {
    const source = readFileSync(resolve(__dirname, './SiteLayout.tsx'), 'utf-8')
    expect(source).toContain('<main')
  })

  it('Footer renders <footer>', () => {
    const source = readFileSync(resolve(__dirname, './Footer.tsx'), 'utf-8')
    expect(source).toContain('<footer')
  })
})
