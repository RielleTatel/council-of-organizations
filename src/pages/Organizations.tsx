import { useState } from 'react'
import { Search } from 'lucide-react'
import { Seo } from '../components/Seo'
import { PageHeader } from '../components/shared/PageHeader'
import { Reveal } from '../components/ui/Reveal'
import { OrganizationCard } from '../components/shared/OrganizationCard'
import { EmbroideredAccent } from '../components/EmbroideredAccent'
import { clusters } from '../config/clusters'
import { threadHex } from '../lib/assets'
import { useOrganizations } from '../hooks/useOrganizations'
import { filterOrganizations } from '../lib/directory'
import { cn } from '../lib/utils'

export default function Organizations() {
  const { data, isLoading } = useOrganizations()
  const [query, setQuery] = useState('')
  const [activeCluster, setActiveCluster] = useState<string | null>(null)
  const orgs = data ?? []
  const results = filterOrganizations(orgs, query, activeCluster)

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
                    onClick={() => setActiveCluster(cluster.slug)}
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

      <section className="bg-canvas-cream py-16 md:py-20">
        <div className="mx-auto max-w-[1200px] px-6">
          <Reveal className="mb-8 flex flex-col gap-6">
            <h2 className="font-display text-3xl font-bold tracking-[-0.02em] text-trust-blue md:text-4xl">
              Organization Directory
            </h2>

            <div className="relative max-w-md">
              <Search size={18} strokeWidth={1.75} className="absolute left-4 top-1/2 -translate-y-1/2 text-stitch-gray" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search organizations"
                aria-label="Search organizations"
                className="w-full rounded-[8px] border border-trust-blue/15 bg-linen-white py-3 pl-11 pr-4 font-body text-fabric-dark placeholder:text-stitch-gray focus-visible:border-trust-blue"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setActiveCluster(null)}
                className={cn(
                  'rounded-full border px-4 py-2 font-body text-sm font-medium transition-colors',
                  activeCluster === null
                    ? 'border-trust-blue bg-trust-blue text-linen-white'
                    : 'border-trust-blue/20 text-trust-blue hover:border-trust-blue',
                )}
              >
                All
              </button>
              {clusters.map((cluster) => (
                <button
                  key={cluster.slug}
                  type="button"
                  onClick={() => setActiveCluster(cluster.slug)}
                  className={cn(
                    'rounded-full border px-4 py-2 font-body text-sm font-medium transition-colors',
                    activeCluster === cluster.slug
                      ? 'border-trust-blue bg-trust-blue text-linen-white'
                      : 'border-trust-blue/20 text-trust-blue hover:border-trust-blue',
                  )}
                >
                  {cluster.name}
                </button>
              ))}
            </div>
          </Reveal>

          {isLoading ? (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="overflow-hidden rounded-[8px] bg-linen-white shadow-[0_4px_20px_rgba(46,74,143,0.06)]">
                  <div className="aspect-[3/2] animate-pulse bg-stitch-gray/20" />
                  <div className="space-y-3 p-6">
                    <div className="h-5 w-3/4 animate-pulse rounded-[8px] bg-stitch-gray/20" />
                    <div className="h-4 w-full animate-pulse rounded-[8px] bg-stitch-gray/20" />
                  </div>
                </div>
              ))}
            </div>
          ) : results.length === 0 ? (
            <Reveal className="flex flex-col items-center gap-4 py-12 text-center">
              <EmbroideredAccent color="yellow" index={1} size={56} />
              <p className="font-body text-lg text-stitch-gray">
                No organizations match your search. Try a different term or cluster.
              </p>
            </Reveal>
          ) : (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((org, i) => (
                <Reveal key={org.slug} delay={(i % 3) * 60}>
                  <OrganizationCard organization={org} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
