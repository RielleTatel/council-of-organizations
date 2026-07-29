import { ThreadDivider } from '../ThreadDivider'
import { EmbroideredAccent } from '../EmbroideredAccent'
import { FloatingAccent } from '../ui/FloatingAccent'
import { Reveal } from '../ui/Reveal'
import { SectionGlow } from '../ui/SectionGlow'
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
}

export function PageHeader({ eyebrow, title, description, accent = 'blue', emblem, spacious = false }: PageHeaderProps) {
  return (
    <section
      className={cn(
        'bg-canvas-cream',
        spacious ? 'pt-32 pb-16 md:pt-40 md:pb-20' : 'pt-28 pb-12 md:pt-32 md:pb-16',
      )}
    >
      <Reveal className="relative mx-auto max-w-[1200px] px-6 text-center">
        <SectionGlow className="left-1/2 top-8 -translate-x-1/2" />
        {emblem && (
          <FloatingAccent duration={6.5} distance={8} rotate={-6} className="mb-4 flex justify-center">
            <EmbroideredAccent color={emblem} index={0} size={64} />
          </FloatingAccent>
        )}
        {eyebrow && (
          <span className="font-body text-xs font-medium uppercase tracking-[0.14em] text-stitch-gray">
            {eyebrow}
          </span>
        )}
        <h1 className="mt-3 font-display text-4xl font-bold tracking-[-0.02em] text-trust-blue md:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="mx-auto mt-5 max-w-[62ch] font-body text-lg leading-relaxed text-fabric-dark">
            {description}
          </p>
        )}
        <div className="mt-8 flex items-center justify-center">
          <ThreadDivider flowerColor={accent} className="w-full max-w-xs" />
        </div>
      </Reveal>
    </section>
  )
}
