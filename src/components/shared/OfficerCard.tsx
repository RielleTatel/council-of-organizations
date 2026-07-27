import type { Leader } from '../../lib/contentful/types'

interface OfficerCardProps {
  leader: Leader
}

export function OfficerCard({ leader }: OfficerCardProps) {
  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <img
        src={leader.image}
        alt={leader.name}
        width={200}
        height={200}
        loading="lazy"
        className="aspect-square w-28 rounded-full object-cover shadow-[0_4px_20px_rgba(46,74,143,0.06)]"
      />
      <div>
        <p className="font-display text-base font-bold text-trust-blue">{leader.name}</p>
        <p className="mt-1 font-body text-sm text-stitch-gray">{leader.role}</p>
      </div>
    </div>
  )
}
