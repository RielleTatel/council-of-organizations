import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Seo } from '../components/Seo'
import { PageHeader } from '../components/shared/PageHeader'
import { VenueTabs } from '../components/recweek/VenueTabs'
import { BoothMap } from '../components/recweek/BoothMap'
import { OrganizationSidebar } from '../components/recweek/OrganizationSidebar'
import { venues, venueBySlug, type VenueId } from '../data/recweekBooths'

export default function RecWeekMap() {
  const [searchParams] = useSearchParams()
  const initialVenueId = venueBySlug(searchParams.get('venue'))?.id ?? venues[0].id

  const [activeVenueId, setActiveVenueId] = useState<VenueId>(initialVenueId)
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
        title="RecWeek Booth Map | COA-Z"
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
            <AnimatePresence mode="wait">
              <motion.div
                key={activeVenueId}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <BoothMap
                  venue={venue}
                  selectedBoothId={selectedBoothId}
                  hoveredBoothId={hoveredBoothId}
                  onBoothSelect={selectBooth}
                  onBoothHover={setHoveredBoothId}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>
    </>
  )
}
