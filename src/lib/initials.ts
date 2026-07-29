const MIDDLE_INITIAL = /^[A-Z](\.[A-Z])*\.$/

/** Derives a 1-2 letter monogram from a full name, skipping middle initials like "L." or "D.R.". */
export function getInitials(name: string): string {
  const tokens = name
    .trim()
    .split(/\s+/)
    .filter((t) => t.length > 0 && !MIDDLE_INITIAL.test(t))

  if (tokens.length === 0) return ''
  if (tokens.length === 1) return tokens[0][0].toUpperCase()

  const first = tokens[0][0]
  const last = tokens[tokens.length - 1][0]
  return (first + last).toUpperCase()
}
