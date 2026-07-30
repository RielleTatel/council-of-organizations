import { describe, it, expect } from 'vitest'
import { boardStyleFor } from './boardStyle'
import { threadHex } from './assets'

describe('boardStyleFor', () => {
  it('is deterministic for the same inputs', () => {
    const a = boardStyleFor('ateneo-debate-union', 'publications-communications', true)
    const b = boardStyleFor('ateneo-debate-union', 'publications-communications', true)
    expect(a).toEqual(b)
  })

  it('keeps rotation within ±3 degrees and non-zero', () => {
    for (const id of ['a', 'bb', 'ccc', 'org-x', 'the-beacon-publications']) {
      const { rotation } = boardStyleFor(id, 'academics', true)
      expect(Math.abs(rotation)).toBeGreaterThanOrEqual(1)
      expect(Math.abs(rotation)).toBeLessThanOrEqual(3)
    }
  })

  it('never returns the polaroid paper when the org has no logo', () => {
    for (const id of ['a', 'bb', 'ccc', 'no-logo-org', 'zzz-1', 'zzz-2']) {
      expect(boardStyleFor(id, 'academics', false).paper).not.toBe('polaroid')
    }
  })

  it('derives color+hex from the cluster, not the id', () => {
    const s = boardStyleFor('anything', 'faith-formation', true)
    expect(s.color).toBe('purple')
    expect(s.hex).toBe(threadHex.purple)
  })

  it('falls back to blue for an unknown cluster slug', () => {
    const s = boardStyleFor('x', 'nonexistent-cluster', true)
    expect(s.color).toBe('blue')
  })

  it('only ever returns pin or tape', () => {
    for (const id of ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']) {
      expect(['pin', 'tape']).toContain(boardStyleFor(id, 'academics', true).fastener)
    }
  })
})
