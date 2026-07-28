import { Seo } from '../components/Seo'
import { PageHeader } from '../components/shared/PageHeader'
import { Reveal } from '../components/ui/Reveal'
import { OfficerCard } from '../components/shared/OfficerCard'
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
        description="The Executive Board of COA-Z comprises five offices, each addressing distinct organizational concerns of the Council."
      />

      <section className="bg-canvas-cream py-12 md:py-16">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-16 px-6">
          {isLoading
            ? offices.map((office) => (
                <div key={office.name} className="flex flex-col gap-6">
                  <div className="h-8 w-72 animate-pulse rounded-[8px] bg-stitch-gray/20" />
                  <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-4">
                    {[0, 1, 2, 3].map((i) => (
                      <div key={i} className="flex flex-col items-center gap-3">
                        <div className="h-28 w-28 animate-pulse rounded-full bg-stitch-gray/20" />
                        <div className="h-4 w-24 animate-pulse rounded-[8px] bg-stitch-gray/20" />
                      </div>
                    ))}
                  </div>
                </div>
              ))
            : groups.map((group) => {
                const meta = offices.find((o) => o.name === group.office)
                return (
                  <Reveal key={group.office} className="flex flex-col gap-6">
                    <div className="flex items-start gap-4">
                      <FloatingAccent duration={6} distance={6} rotate={6} className="mt-1 shrink-0">
                        <EmbroideredAccent color={meta?.color ?? 'blue'} index={0} size={44} />
                      </FloatingAccent>
                      <div>
                        <h2 className="font-display text-2xl font-bold tracking-[-0.02em] text-trust-blue md:text-3xl">
                          {group.office}
                        </h2>
                        {meta && (
                          <p className="mt-2 max-w-[70ch] font-body leading-relaxed text-fabric-dark">
                            {meta.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-4">
                      {group.leaders.map((leader) => (
                        <OfficerCard key={leader.id} leader={leader} />
                      ))}
                    </div>
                  </Reveal>
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
