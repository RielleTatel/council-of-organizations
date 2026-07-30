import { AnimatePresence, motion } from 'framer-motion'
import { MapPin, ExternalLink, X } from 'lucide-react'
import { boothFullName, boothHref } from '../../data/recweekBooths'
import type { BoothShape as BoothShapeData } from '../../data/recweekBooths'

interface BoothPreviewCardProps {
  booth: BoothShapeData | null
  venueLabel: string
  onClose: () => void
}

export function BoothPreviewCard({ booth, venueLabel, onClose }: BoothPreviewCardProps) {
  return (
    <AnimatePresence>
      {booth && (
        <motion.div
          key={booth.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.25 }}
          className="absolute left-1/2 top-4 z-20 w-[min(90%,320px)] -translate-x-1/2 rounded-[8px] border border-trust-blue/10 bg-linen-white/95 p-4 shadow-[0_10px_28px_rgba(46,74,143,0.18)] backdrop-blur-sm"
        >
          <button aria-label="Close" onClick={onClose} className="absolute right-2 top-2 text-stitch-gray hover:text-trust-blue"><X size={16} /></button>
          <p className="font-display text-lg font-bold text-trust-blue">{booth.acronym}</p>
          <p className="mt-0.5 font-body text-sm text-fabric-dark">{boothFullName(booth) ?? 'Exhibitor booth'}</p>
          <p className="mt-2 flex items-center gap-1.5 font-body text-xs text-stitch-gray"><MapPin size={13} /> {venueLabel}{booth.boothNumber ? ` · Booth ${booth.boothNumber}` : ''}</p>
          {boothHref(booth) && (
            <a href={boothHref(booth)} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-trust-blue px-4 py-1.5 font-body text-xs font-medium text-linen-white transition-all hover:-translate-y-0.5 hover:bg-thread-green">
              View Organization <ExternalLink size={13} />
            </a>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
