import { threadHex, type ThreadColor } from './assets'
import { clusterBySlug } from '../config/clusters'

export type PaperStyle = 'polaroid' | 'notebook' | 'manila' | 'grid' | 'plain'
export type Fastener = 'pin' | 'tape'

export interface BoardStyle {
  /** Stable tilt in degrees, within ±3, never 0. */
  rotation: number
  paper: PaperStyle
  fastener: Fastener
  /** Horizontal jitter (px) for the pin/tape, -18..18. */
  fastenerOffset: number
  /** Accent color — always the org's cluster color, never random. */
  color: ThreadColor
  hex: string
}

const ROTATIONS = [-3, -2, -1, 1, 2, 3]
/** Papers usable when there is no logo (polaroid needs a photo). */
const NON_POLAROID: PaperStyle[] = ['notebook', 'manila', 'grid', 'plain']

/** FNV-1a-style stable 32-bit hash → non-negative int. No deps, no randomness. */
function hash(id: string): number {
  let h = 2166136261
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

export function boardStyleFor(orgId: string, clusterSlug: string, hasLogo: boolean): BoardStyle {
  const h = hash(orgId)
  const rotation = ROTATIONS[h % ROTATIONS.length]
  const fastener: Fastener = ((h >>> 3) & 3) === 0 ? 'tape' : 'pin' // ~1 in 4 taped
  const fastenerOffset = ((h >>> 5) % 37) - 18
  const paper: PaperStyle =
    hasLogo && (h >>> 7) % 3 !== 0 ? 'polaroid' : NON_POLAROID[(h >>> 9) % NON_POLAROID.length]
  const color = (clusterBySlug(clusterSlug)?.color ?? 'blue') as ThreadColor
  return { rotation, paper, fastener, fastenerOffset, color, hex: threadHex[color] }
}
