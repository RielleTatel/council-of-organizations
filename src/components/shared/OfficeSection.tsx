import { Reveal } from '../ui/Reveal'
import { SectionGlow } from '../ui/SectionGlow'
import { ThreadBorder } from '../ThreadBorder'
import { OfficeHeader } from './OfficeHeader'
import { OfficerCard } from './OfficerCard'
import type { Leader } from '../../lib/contentful/types'
import type { ThreadColor } from '../../lib/assets'

interface OfficeSectionProps {
  title: string
  description: string
  color: ThreadColor
  leaders: Leader[]
  /** Alternates the thread border's curve direction so consecutive sections don't repeat identically. */
  flip?: boolean
}

export function OfficeSection({ title, description, color, leaders, flip = false }: OfficeSectionProps) {
  return (
    <Reveal className="relative overflow-hidden rounded-2xl bg-linen-white p-8 shadow-[0_4px_24px_rgba(46,74,143,0.06)] md:p-12">
      <ThreadBorder
        color={color}
        edge="top"
        flip={flip}
        className="absolute left-1/2 top-0 w-56 max-w-none -translate-x-1/2 -translate-y-1/2 opacity-90"
      />
      <SectionGlow className="left-1/2 top-8 -translate-x-1/2" />
      <div className="flex flex-col gap-8">
        <OfficeHeader title={title} description={description} color={color} />
        <div className="grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-3 lg:grid-cols-4">
          {leaders.map((leader) => (
            <OfficerCard key={leader.id} leader={leader} color={color} />
          ))}
        </div>
      </div>
    </Reveal>
  )
}
