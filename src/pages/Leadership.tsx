import { Seo } from '../components/Seo'
import { PageHeader } from '../components/shared/PageHeader'
import { OfficeSection } from '../components/shared/OfficeSection'
import { Reveal } from '../components/ui/Reveal'
import { EmbroideredAccent } from '../components/EmbroideredAccent'
import { ThreadBorder } from '../components/ThreadBorder'
import { FloatingAccent } from '../components/ui/FloatingAccent'
import { offices, buklodCommittee } from '../config/leadership'
import { useLeadership } from '../hooks/useLeadership'
import { groupLeadersByOffice } from '../lib/directory'

export default function Leadership() {
  const { data, isLoading } = useLeadership()
  const officeOrder = offices.map((o) => o.name)
  const groups = groupLeadersByOffice(data ?? [], officeOrder)

  return (
    <>
      <Seo
        title="Leadership | COA-Z"
        description="The Executive Board of COA-Z: five offices and the Buklod Atenista Envoy Committee serving the Council and its member organizations."
      />

      <PageHeader
        eyebrow="Leadership"
        title="Executive Board"
        accent="red"
        emblem="red"
        spacious
        description="The Executive Board of COA-Z comprises five offices, each addressing distinct organizational concerns of the Council and its member organizations."
      />

      <section className="bg-canvas-cream py-16 md:py-20">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-12 px-6 md:gap-16">
          {isLoading
            ? offices.map((office) => (
                <div key={office.name} className="flex flex-col gap-6 rounded-2xl bg-linen-white p-8 md:p-12">
                  <div className="h-8 w-72 animate-pulse rounded-[8px] bg-stitch-gray/20" />
                  <div className="grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-3 lg:grid-cols-4">
                    {[0, 1, 2, 3].map((i) => (
                      <div key={i} className="flex flex-col items-center gap-3">
                        <div className="h-24 w-24 animate-pulse rounded-full bg-stitch-gray/20" />
                        <div className="h-4 w-24 animate-pulse rounded-[8px] bg-stitch-gray/20" />
                      </div>
                    ))}
                  </div>
                </div>
              ))
            : groups.map((group, i) => {
                const meta = offices.find((o) => o.name === group.office)
                if (!meta) return null
                return (
                  <OfficeSection
                    key={group.office}
                    title={group.office}
                    description={meta.description}
                    color={meta.color}
                    leaders={group.leaders}
                    flip={i % 2 === 1}
                  />
                )
              })}
        </div>
      </section>

      <section className="relative bg-trust-blue py-20 md:py-24">
        <ThreadBorder
          color="yellow"
          edge="top"
          className="absolute left-1/2 top-0 w-56 max-w-none -translate-x-1/2 -translate-y-1/2 opacity-90"
        />
        <Reveal className="mx-auto flex max-w-[800px] flex-col items-center gap-5 px-6 text-center">
          <FloatingAccent duration={6.5} distance={8} rotate={-6}>
            <EmbroideredAccent color="yellow" index={0} size={56} />
          </FloatingAccent>
          <h2 className="font-display text-2xl font-bold tracking-[-0.02em] text-linen-white md:text-3xl">
            {buklodCommittee.title}
          </h2>
          <p className="max-w-[60ch] font-body text-lg leading-relaxed text-linen-white/85">
            {buklodCommittee.description}
          </p>
        </Reveal>
      </section>
    </>
  )
}
