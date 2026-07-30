import { useEffect, useRef } from 'react'
import { TransformWrapper, TransformComponent, type ReactZoomPanPinchRef } from 'react-zoom-pan-pinch'
import type { Venue } from '../../data/recweekBooths'
import { LandmarkShape } from './LandmarkShape'
import { BoothShape } from './BoothShape'
import { MapControls } from './MapControls'
import { MapLegend } from './MapLegend'
import { BoothPreviewCard } from './BoothPreviewCard'

interface BoothMapProps {
  venue: Venue
  selectedBoothId: string | null
  hoveredBoothId: string | null
  onBoothSelect: (id: string) => void
  onBoothHover: (id: string | null) => void
}

export function BoothMap({ venue, selectedBoothId, hoveredBoothId, onBoothSelect, onBoothHover }: BoothMapProps) {
  const transformRef = useRef<ReactZoomPanPinchRef>(null)

  useEffect(() => {
    if (selectedBoothId) {
      transformRef.current?.zoomToElement(`booth-${selectedBoothId}`, 1.8, 400)
    }
  }, [selectedBoothId])

  const selectedBooth = venue.booths.find((b) => b.id === selectedBoothId) ?? null

  return (
    <div className="relative overflow-hidden rounded-[8px] border border-trust-blue/10 bg-linen-white shadow-[0_4px_20px_rgba(46,74,143,0.06)]">
      <TransformWrapper ref={transformRef} minScale={1} maxScale={3} doubleClick={{ mode: 'zoomIn' }} wheel={{ step: 0.15 }} centerOnInit>
        <TransformComponent wrapperClass="!w-full !h-full" contentClass="!w-full">
          <svg viewBox={venue.viewBox} className="h-auto w-full" role="img" aria-label={`${venue.label} booth map`}>
            {venue.landmarks.map((l) => <LandmarkShape key={l.id} landmark={l} />)}
            {venue.booths.map((b) => (
              <BoothShape
                key={b.id}
                booth={b}
                isSelected={selectedBoothId === b.id}
                isHovered={hoveredBoothId === b.id}
                onSelect={onBoothSelect}
                onHover={onBoothHover}
              />
            ))}
          </svg>
        </TransformComponent>
      </TransformWrapper>
      <MapControls
        onZoomIn={() => transformRef.current?.zoomIn()}
        onZoomOut={() => transformRef.current?.zoomOut()}
        onReset={() => transformRef.current?.resetTransform()}
      />
      <MapLegend />
      <BoothPreviewCard booth={selectedBooth} venueLabel={venue.label} onClose={() => onBoothSelect('')} />
    </div>
  )
}
