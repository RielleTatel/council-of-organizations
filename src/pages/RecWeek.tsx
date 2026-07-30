import { useState } from 'react'
import { Seo } from '../components/Seo'
import { PageHeader } from '../components/shared/PageHeader'
import { VenueTabs } from '../components/recweek/VenueTabs'
import { BoothMap } from '../components/recweek/BoothMap'
import { OrganizationSidebar } from '../components/recweek/OrganizationSidebar'
import { venues, type VenueId } from '../data/recweekBooths'

export default function RecWeek() {
  const [activeVenueId, setActiveVenueId] = useState<VenueId>('bc-lobby-quad')
  const [selectedBoothId, setSelectedBoothId] = useState<string | null>(null)
  const [hoveredBoothId, setHoveredBoothId] = useState<string | null>(null)

  const venue = venues.find((v) => v.id === activeVenueId) ?? venues[0]

  const changeVenue = (id: VenueId) => {
    setActiveVenueId(id)
    setSelectedBoothId(null)
    setHoveredBoothId(null)
  }

  const selectBooth = (id: string) => setSelectedBoothId(id === '' ? null : id)

  return (
    <>
      <Seo
        title="RecWeek | COA-Z"
        description="Explore booth locations across the three RecWeek venues at Ateneo de Zamboanga University."
      />
      <PageHeader
        eyebrow="Org Fair 2026"
        title="RecWeek Booth Locations"
        description="Explore booth locations across the three RecWeek venues."
        accent="blue"
      />
      <section className="bg-canvas-cream pb-24">
        <div className="mx-auto max-w-[1200px] px-6">
          <VenueTabs venues={venues} activeVenueId={activeVenueId} onSelect={changeVenue} />

          <div className="mt-10 grid gap-6 lg:grid-cols-[35%_65%]">
            <OrganizationSidebar
              venue={venue}
              selectedBoothId={selectedBoothId}
              hoveredBoothId={hoveredBoothId}
              onBoothSelect={selectBooth}
              onBoothHover={setHoveredBoothId}
            />
            <BoothMap
              venue={venue}
              selectedBoothId={selectedBoothId}
              hoveredBoothId={hoveredBoothId}
              onBoothSelect={selectBooth}
              onBoothHover={setHoveredBoothId}
            />
          </div>
        </div>
      </section>
    </>
  )
}
