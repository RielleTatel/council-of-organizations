import { ThreadDivider } from '../ThreadDivider'
import { EmbroideredAccent } from '../EmbroideredAccent'
import { FloatingAccent } from '../ui/FloatingAccent'
import { Reveal } from '../ui/Reveal'
import { PageHeaderDecor } from './PageHeaderDecor'
import { threadHex } from '../../lib/assets'
import { cn } from '../../lib/utils'
import type { ThreadColor } from '../../lib/assets'

interface PageHeaderProps {
  eyebrow?: string
  title: string
  description?: string
  accent?: ThreadColor
  /** Renders a larger floating embroidered emblem above the eyebrow. */
  emblem?: ThreadColor
  /** Extra vertical padding for pages that want a more prominent hero. */
  spacious?: boolean
  /** 'cream' (default) = light canvas; 'ink' = trust-blue band with inverted text. */
  variant?: 'cream' | 'ink'
}

export function PageHeader({
  eyebrow,
  title,
  description,
  accent = 'blue',
  emblem,
  spacious = false,
  variant = 'cream',
}: PageHeaderProps) {
  const ink = variant === 'ink'

  return (
    <section
      className={cn(
        'relative overflow-hidden',
        ink ? 'bg-trust-blue' : 'bg-canvas-cream',
        spacious ? 'pt-32 pb-20 md:pt-40 md:pb-24' : 'pt-28 pb-16 md:pt-32 md:pb-20',
      )}
    >
      <PageHeaderDecor accent={accent} variant={variant} />

      <Reveal className="relative mx-auto max-w-[760px] px-6 text-center">
        {emblem && (
          <FloatingAccent duration={6.5} distance={8} rotate={-6} className="mb-5 flex justify-center">
            <EmbroideredAccent color={emblem} index={0} size={64} />
          </FloatingAccent>
        )}

        {eyebrow && (
          <span
            className={cn(
              'inline-flex items-center gap-2 font-body text-xs font-medium uppercase tracking-[0.14em]',
              ink ? 'text-linen-white/70' : 'text-stitch-gray',
            )}
          >
            <span aria-hidden className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: threadHex[accent] }} />
            {eyebrow}
          </span>
        )}

        <h1
          className={cn(
            'mt-4 font-display text-4xl font-bold leading-[1.1] tracking-[-0.02em] md:text-5xl',
            ink ? 'text-linen-white' : 'text-trust-blue',
          )}
        >
          {title}
        </h1>

        {description && (
          <p
            className={cn(
              'mx-auto mt-5 max-w-[60ch] font-body text-lg leading-relaxed',
              ink ? 'text-linen-white/85' : 'text-fabric-dark',
            )}
          >
            {description}
          </p>
        )}

        {!ink && (
          <div className="mt-8 flex items-center justify-center">
            <ThreadDivider flowerColor={accent} className="w-full max-w-xs" />
          </div>
        )}
      </Reveal>
    </section>
  )
}
