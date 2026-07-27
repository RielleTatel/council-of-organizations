// Subtle woven-linen grain, per design system §1 (canvas texture at low opacity).
// Fixed + pointer-events-none so it never triggers repaints on scroll (taste §6.E).
const TEXTURE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"

export function FabricTexture() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[1] opacity-[0.04] mix-blend-multiply"
      style={{ backgroundImage: TEXTURE }}
    />
  )
}
