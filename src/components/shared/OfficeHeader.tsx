import { EmbroideredAccent } from '../EmbroideredAccent'
import { ThreadDivider } from '../ThreadDivider'
import { FloatingAccent } from '../ui/FloatingAccent'
import type { ThreadColor } from '../../lib/assets'

interface OfficeHeaderProps {
  title: string
  description: string
  color: ThreadColor
}

export function OfficeHeader({ title, description, color }: OfficeHeaderProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start gap-4">
        <FloatingAccent duration={6} distance={6} rotate={6} className="mt-1 shrink-0">
          <EmbroideredAccent color={color} index={0} size={44} />
        </FloatingAccent>
        <div>
          <h2 className="font-display text-2xl font-bold tracking-[-0.02em] text-trust-blue md:text-3xl">
            {title}
          </h2>
          <p className="mt-2 max-w-[70ch] font-body leading-relaxed text-fabric-dark">{description}</p>
        </div>
      </div>
      <ThreadDivider className="mt-2 max-w-xs" />
    </div>
  )
}
