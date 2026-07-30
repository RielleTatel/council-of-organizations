import { Search } from 'lucide-react'
import { PushPin } from './PushPin'
import { threadHex } from '../../lib/assets'

interface PinnedSearchNoteProps {
  value: string
  onChange: (v: string) => void
}

export function PinnedSearchNote({ value, onChange }: PinnedSearchNoteProps) {
  return (
    <div className="relative mx-auto max-w-md -rotate-1">
      <PushPin hex={threadHex.red} />
      <div className="rounded-[6px] border border-trust-blue/10 bg-linen-white p-4 shadow-[0_8px_22px_rgba(46,74,143,0.12)]">
        <p className="mb-2 font-accent text-xl text-trust-blue">Find your organization</p>
        <div className="relative">
          <Search size={18} strokeWidth={1.75} className="absolute left-3 top-1/2 -translate-y-1/2 text-stitch-gray" />
          <input
            type="search"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Find an organization"
            aria-label="Find an organization"
            className="w-full rounded-[6px] border border-trust-blue/15 bg-canvas-cream py-2.5 pl-10 pr-3 font-body text-fabric-dark placeholder:text-stitch-gray focus-visible:border-trust-blue"
          />
        </div>
      </div>
    </div>
  )
}
