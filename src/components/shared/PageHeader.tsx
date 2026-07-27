import { ThreadDivider } from '../ThreadDivider'
import { Reveal } from '../ui/Reveal'
import type { ThreadColor } from '../../lib/assets'

interface PageHeaderProps {
  eyebrow?: string
  title: string
  description?: string
  accent?: ThreadColor
}

export function PageHeader({ eyebrow, title, description, accent = 'blue' }: PageHeaderProps) {
  return (
    <section className="bg-canvas-cream pt-28 pb-12 md:pt-32 md:pb-16">
      <Reveal className="mx-auto max-w-[1200px] px-6 text-center">
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
