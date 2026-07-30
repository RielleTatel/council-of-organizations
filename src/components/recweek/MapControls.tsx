import { Plus, Minus, RotateCcw } from 'lucide-react'

interface MapControlsProps {
  onZoomIn: () => void
  onZoomOut: () => void
  onReset: () => void
}

export function MapControls({ onZoomIn, onZoomOut, onReset }: MapControlsProps) {
  const btn = 'flex h-9 w-9 items-center justify-center rounded-full border border-trust-blue/10 bg-linen-white text-trust-blue shadow-[0_4px_20px_rgba(46,74,143,0.06)] transition-all hover:-translate-y-0.5 hover:text-thread-green'
  return (
    <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-2">
      <button aria-label="Zoom in" className={btn} onClick={onZoomIn}><Plus size={18} /></button>
      <button aria-label="Zoom out" className={btn} onClick={onZoomOut}><Minus size={18} /></button>
      <button aria-label="Reset zoom" className={btn} onClick={onReset}><RotateCcw size={16} /></button>
    </div>
  )
}
