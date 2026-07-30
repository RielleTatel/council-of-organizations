/**
 * Registry of decorative assets from /public/ELEMENTS, organized to match the
 * thread-color language in docs/COA-Z_Interwoven_Beyond_Design_System.md.
 */

export type ThreadColor = 'red' | 'blue' | 'green' | 'yellow' | 'pink' | 'purple' | 'gold' | 'teal'

const flowerBase = '/ELEMENTS/flowers'
const yarnBase = '/ELEMENTS/yarn'
const hoopBase = '/ELEMENTS'

export const flowersByColor: Record<ThreadColor, string[]> = {
  red: [`${flowerBase}/flower-red-bud-1.png`],
  blue: [`${flowerBase}/flower-blue-bud-2.png`],
  green: [
    `${flowerBase}/flower-green-clover-1.png`,
    `${flowerBase}/flower-green-leaf-1.png`,
    `${flowerBase}/flower-green-bud-1.png`,
    `${flowerBase}/flower-green-bud-3.png`,
  ],
  yellow: [`${flowerBase}/flower-yellow-1.png`, `${flowerBase}/flower-yellow-2.png`, `${flowerBase}/flower-yellow-3.png`],
  pink: [`${flowerBase}/flower-pink-bloom-1.png`],
  purple: [
    `${flowerBase}/flower-purple-bloom-1.png`,
    `${flowerBase}/flower-purple-bud-1.png`,
    `${flowerBase}/flower-purple-bud-2.png`,
  ],
  // No dedicated embroidery art yet — EmbroideredAccent falls back to a plain dot for these.
  gold: [],
  teal: [],
}

export const threadsByColor: Record<ThreadColor, string[]> = {
  red: [`${yarnBase}/thread-red-loop.png`],
  blue: [`${yarnBase}/thread-blue-wave-1.png`, `${yarnBase}/thread-blue-wave-2.png`, `${yarnBase}/thread-blue-wave-pale.png`],
  green: [`${yarnBase}/thread-teal-loop.png`],
  yellow: [`${yarnBase}/thread-yellow-wave-1.png`, `${yarnBase}/thread-yellow-wave-2.png`],
  pink: [`${yarnBase}/thread-pink-wave.png`],
  purple: [],
  gold: [],
  teal: [],
}

/** Blank embroidery-hoop frames on varying fabric tones, used to frame photos/content. */
export const hoopFrames: string[] = Array.from({ length: 10 }, (_, i) => `${hoopBase}/hoop-${i + 1}.jpg`)

/** OrgFair 2026 event wordmark. */
export const orgFairLogo = `${hoopBase}/OrgFair.png`

/** Site logo / favicon icon. */
export const siteLogo = '/Icon.png'

export function randomFrom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)]
}

export const threadHex: Record<ThreadColor, string> = {
  red: '#c41e3a',
  blue: '#1e5aa8',
  green: '#2d8a3e',
  yellow: '#e4c41a',
  pink: '#e85a9a',
  purple: '#7b3fa0',
  gold: '#b8860b',
  teal: '#1f7a72',
}
