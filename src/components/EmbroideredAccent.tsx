import { flowersByColor, randomFrom, threadHex, type ThreadColor } from '../lib/assets'
import { cn } from '../lib/utils'

interface EmbroideredAccentProps {
  color: ThreadColor
  /** Pick a specific asset index, otherwise a stable random one is chosen from that color's set. */
  index?: number
  size?: number
  /** 100 for decorative elements, 60-80 for background watermarks (design system §5.B). */
  opacity?: number
  className?: string
}

export function EmbroideredAccent({ color, index, size = 48, opacity = 100, className }: EmbroideredAccentProps) {
  const options = flowersByColor[color]

  if (options.length === 0) {
    return (
      <span
        aria-hidden
        role="presentation"
        className={cn('inline-block select-none rounded-full', className)}
        style={{ width: size, height: size, backgroundColor: threadHex[color], opacity: opacity / 100 }}
      />
    )
  }

  const src = index !== undefined ? options[index % options.length] : randomFrom(options)

  return (
    <img
      src={src}
      alt=""
      role="presentation"
      width={size}
      height={size}
      className={cn('select-none', className)}
      style={{ width: size, height: size, opacity: opacity / 100 }}
    />
  )
}
