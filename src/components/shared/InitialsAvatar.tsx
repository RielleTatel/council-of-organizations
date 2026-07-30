import { threadHex, type ThreadColor } from '../../lib/assets'

interface InitialsAvatarProps {
  name: string
  color: ThreadColor
  size?: number
}

/** Cute emoji + soft pastel palette, picked deterministically per name so it's stable across renders. */
const CUTE_ICONS = ['🌸', '🐣', '🍀', '🦋', '🌟', '🐝', '🌈', '🍄', '🐞', '🦄', '🐬', '🌻', '🎀', '✨', '🐢', '🦊', '🐰', '🐙', '🐨', '🦉']
const PASTEL_COLORS = ['#FADADD', '#FFE5B4', '#D4F0F0', '#E0BBE4', '#C1E1C1', '#FFF5BA', '#B5EAD7', '#FFDAC1', '#C7CEEA', '#F6DFEB']

/** FNV-1a-style stable 32-bit hash → non-negative int. No deps, no randomness. */
function hash(str: string): number {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

/** Stitched-ring avatar badge used in place of a profile photo — a cute icon on a pastel field. */
export function InitialsAvatar({ name, color, size = 96 }: InitialsAvatarProps) {
  const h = hash(name)
  const icon = CUTE_ICONS[h % CUTE_ICONS.length]
  const background = PASTEL_COLORS[(h >>> 8) % PASTEL_COLORS.length]

  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full shadow-[0_4px_20px_rgba(46,74,143,0.06)]"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.44,
        backgroundColor: background,
        border: `2px dashed ${threadHex[color]}`,
      }}
    >
      <span role="img" aria-label={name}>
        {icon}
      </span>
    </div>
  )
}
