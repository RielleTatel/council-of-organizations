import { useRef, useState } from 'react'
import { Seo } from '../components/Seo'
import { PageHeader } from '../components/shared/PageHeader'
import { Reveal } from '../components/ui/Reveal'
import { EmbroideredAccent } from '../components/EmbroideredAccent'
import { PushPin } from '../components/organizations/PushPin'
import { clusters } from '../config/clusters'
import { threadHex } from '../lib/assets'
import { paperSurface, type PaperStyle } from '../lib/boardStyle'
import { useOrganizations } from '../hooks/useOrganizations'
import { DiscoveryBoard } from '../components/organizations/DiscoveryBoard'

/** Rotates through non-photo paper textures — cluster cards never need the polaroid variant. */
const CLUSTER_PAPERS: PaperStyle[] = ['notebook', 'manila', 'grid', 'plain']

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
              const hex = threadHex[cluster.color]
              const paper = CLUSTER_PAPERS[i % CLUSTER_PAPERS.length]
              return (
                <Reveal key={cluster.slug} delay={(i % 3) * 80}>
                  <div className="group relative h-full">
                    <PushPin hex={hex} offset={0} />
                    <button
                      type="button"
                      onClick={() => jumpToCluster(cluster.slug)}
                      className="relative flex h-full w-full flex-col gap-3 overflow-hidden rounded-[6px] p-6 text-left shadow-[0_6px_20px_rgba(46,74,143,0.10)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_34px_rgba(46,74,143,0.20)]"
                      style={{ ...paperSurface(paper), borderTop: `4px solid ${hex}` }}
                    >
                      <span
                        aria-hidden
                        className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-multiply"
                        style={{ backgroundImage: "url('/textures/paper-texture-1.webp')", backgroundSize: '260px' }}
                      />
                      <h3 className="relative font-display text-lg font-bold text-trust-blue">{cluster.name}</h3>
                      <p className="relative font-body text-sm leading-relaxed text-fabric-dark">{cluster.description}</p>
                      {!isLoading && (
                        <span className="relative mt-auto font-body text-xs font-medium text-stitch-gray">
                          {count} {count === 1 ? 'organization' : 'organizations'}
                        </span>
                      )}
                    </button>
                    <span className="pointer-events-none absolute -bottom-3 -right-3 z-20 transition-transform duration-300 group-hover:rotate-12">
                      <EmbroideredAccent color={cluster.color} index={0} size={30} opacity={85} />
                    </span>
                  </div>
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
