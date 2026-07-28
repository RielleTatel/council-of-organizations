import { useEffect, useRef, type CSSProperties } from 'react'

const FONTS = ['Caveat', 'Indie Flower', 'Nothing You Could Do', 'Reenie Beanie', 'Shadows Into Light']

/** Some fonts don't render certain letters well. */
const BLACKLIST: Record<string, string[]> = {
  l: ['Nothing You Could Do'],
}

function seededRandom(seedValue: number): number {
  const x = Math.sin(seedValue) * 1e4
  return x - Math.floor(x)
}

function wrapLetters(str: string, element: HTMLElement, seedValue: number) {
  const lastUsed: Record<string, string> = {}
  element.innerHTML = ''
  let currentSeed = seedValue

  for (const char of str) {
    const span = document.createElement('span')

    if (char === ' ') {
      span.textContent = ' '
      span.style.display = 'inline-block'
      span.style.whiteSpace = 'pre'
      element.appendChild(span)
      currentSeed++
      continue
    }

    const lowerChar = char.toLowerCase()
    let availableFonts = FONTS
    if (BLACKLIST[lowerChar]) {
      availableFonts = availableFonts.filter((f) => !BLACKLIST[lowerChar].includes(f))
    }
    if (lastUsed[lowerChar]) {
      availableFonts = availableFonts.filter((f) => f !== lastUsed[lowerChar])
    }

    const fontIndex = Math.floor(seededRandom(currentSeed) * availableFonts.length)
    const font = availableFonts[fontIndex] || FONTS[0]
    lastUsed[lowerChar] = font

    span.style.fontFamily = `"${font}", cursive`
    span.textContent = char
    element.appendChild(span)
    currentSeed++
  }
}

interface BadHandwritingProps {
  text: string
  fontSize?: number
  color?: string
  letterSpacing?: number
  lineHeight?: number
  fontWeight?: number
  seed?: number
  /** Omit to let the parent control alignment (e.g. responsive Tailwind classes). */
  alignment?: 'left' | 'center' | 'right'
  className?: string
}

/** Renders text with each letter in a random handwriting font, for a hand-scrawled, imperfect feel. */
export function BadHandwriting({
  text,
  fontSize = 20,
  color = 'currentColor',
  letterSpacing = 0,
  lineHeight = 1.4,
  fontWeight = 400,
  seed = 12,
  alignment,
  className,
}: BadHandwritingProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (containerRef.current) wrapLetters(text, containerRef.current, seed)
  }, [text, seed])

  const style: CSSProperties = {
    fontSize: `${fontSize}px`,
    color,
    letterSpacing: `${letterSpacing}px`,
    lineHeight,
    fontWeight,
    width: '100%',
    wordWrap: 'break-word',
    overflowWrap: 'break-word',
  }
  if (alignment) style.textAlign = alignment

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Caveat:wght@400..700&family=Indie+Flower&family=Nothing+You+Could+Do&family=Reenie+Beanie&family=Shadows+Into+Light&display=swap"
      />
      <div ref={containerRef} className={className} style={style} />
    </>
  )
}
