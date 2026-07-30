import { threadHex, type ThreadColor } from './assets'
import { clusterBySlug } from '../config/clusters'

export type PaperStyle = 'polaroid' | 'notebook' | 'manila' | 'grid' | 'plain'
export type Fastener = 'pin' | 'tape'
export type DecorationCorner = 'top-right' | 'bottom-left' | 'bottom-right'

export interface BoardStyle {
  /** Stable tilt in degrees, within ±2, never 0. */
  rotation: number
  /** Paper texture only — every card shares the same universal layout. */
  paper: PaperStyle
  fastener: Fastener
  /** Horizontal jitter (px) for tape only — pins stay centered. */
  fastenerOffset: number
  /** Accent color — always the org's cluster color, never random. */
  color: ThreadColor
  hex: string
  /** ~35% of cards get a corner flourish, to avoid repetition. */
  hasDecoration: boolean
  decorationCorner: DecorationCorner
}

const ROTATIONS = [-2, -1, 1, 2]
/** Papers usable when there is no logo (polaroid needs a photo). */
const NON_POLAROID: PaperStyle[] = ['notebook', 'manila', 'grid', 'plain']
const CORNERS: DecorationCorner[] = ['top-right', 'bottom-left', 'bottom-right']

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
  const fastenerOffset = fastener === 'tape' ? ((h >>> 5) % 25) - 12 : 0
  const paper: PaperStyle =
    hasLogo && (h >>> 7) % 3 === 0 ? 'polaroid' : NON_POLAROID[(h >>> 9) % NON_POLAROID.length]
  const color = (clusterBySlug(clusterSlug)?.color ?? 'blue') as ThreadColor
  const hasDecoration = (h >>> 11) % 100 < 35
  const decorationCorner = CORNERS[(h >>> 13) % CORNERS.length]
  return { rotation, paper, fastener, fastenerOffset, color, hex: threadHex[color], hasDecoration, decorationCorner }
}
