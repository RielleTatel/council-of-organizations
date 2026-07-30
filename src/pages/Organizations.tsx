import { useRef, useState } from 'react'
import { Seo } from '../components/Seo'
import { PageHeader } from '../components/shared/PageHeader'
import { Reveal } from '../components/ui/Reveal'
import { EmbroideredAccent } from '../components/EmbroideredAccent'
import { clusters } from '../config/clusters'
import { threadHex } from '../lib/assets'
import { useOrganizations } from '../hooks/useOrganizations'
import { DiscoveryBoard } from '../components/organizations/DiscoveryBoard'

export default function Organizations() {
  const { data, isLoading } = useOrganizations()
  const orgs = data ?? []
  const [activeCluster, setActiveCluster] = useState<string | null>(null)
  const boardRef = useRef<HTMLDivElement>(null)

  const jumpToCluster = (slug: string) => {
    setActiveCluster(slug)
    boardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      <Seo
        title="Organizations | COA-Z"
        description="Explore the accredited member organizations of COA-Z, grouped into six clusters of student formation at Ateneo de Zamboanga University."
      />

      <PageHeader
        eyebrow="Organizations"
        title="Member Organizations"
        accent="blue"
        description="COA-Z member organizations are grouped into six clusters based on their organizational vision and focus. Each cluster fosters a distinct sphere of student formation."
      />

      <section className="bg-linen-white py-16 md:py-20">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {clusters.map((cluster, i) => {
              const count = orgs.filter((o) => o.cluster.slug === cluster.slug).length
              return (
                <Reveal key={cluster.slug} delay={(i % 3) * 80}>
                  <button
                    type="button"
                    onClick={() => jumpToCluster(cluster.slug)}
                    className="flex h-full w-full flex-col gap-3 rounded-[8px] border border-trust-blue/10 bg-canvas-cream p-6 text-left shadow-[0_4px_20px_rgba(46,74,143,0.06)] transition-transform hover:-translate-y-1"
                    style={{ borderTop: `4px solid ${threadHex[cluster.color]}` }}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="font-display text-lg font-bold text-trust-blue">{cluster.name}</h3>
                      <EmbroideredAccent color={cluster.color} index={0} size={36} />
                    </div>
                    <p className="font-body text-sm leading-relaxed text-fabric-dark">{cluster.description}</p>
                    {!isLoading && (
                      <span className="mt-auto font-body text-xs font-medium text-stitch-gray">
                        {count} {count === 1 ? 'organization' : 'organizations'}
                      </span>
                    )}
                  </button>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      <div ref={boardRef}>
        <DiscoveryBoard organizations={orgs} isLoading={isLoading} activeCluster={activeCluster} onClusterChange={setActiveCluster} />
      </div>
    </>
  )
}
