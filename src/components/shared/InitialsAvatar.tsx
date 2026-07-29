import { getInitials } from '../../lib/initials'
import { threadHex, type ThreadColor } from '../../lib/assets'

interface InitialsAvatarProps {
  name: string
  color: ThreadColor
  size?: number
}

/** Stitched-ring monogram badge used in place of a profile photo. */
export function InitialsAvatar({ name, color, size = 96 }: InitialsAvatarProps) {
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full bg-linen-white font-display font-bold text-trust-blue shadow-[0_4px_20px_rgba(46,74,143,0.06)]"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.32,
        border: `2px dashed ${threadHex[color]}`,
      }}
    >
      {getInitials(name)}
    </div>
  )
}
