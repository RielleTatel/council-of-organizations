import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useSpotlightOrganizations } from '../../hooks/useHomeData'
import { ClusterBadge } from '../shared/ClusterBadge'
import { EmbroideredAccent } from '../EmbroideredAccent'
import { ThreadBorder } from '../ThreadBorder'
import { Reveal } from '../ui/Reveal'
import { SectionGlow } from '../ui/SectionGlow'
import { hoopFrames, threadHex } from '../../lib/assets'
import { clusterBySlug } from '../../config/clusters'

export function OrganizationSpotlight() {
  const { organizations, isLoading } = useSpotlightOrganizations(4)

  if (!isLoading && organizations.length === 0) return null

  return (
    <section className="relative bg-linen-white py-20 md:py-28">
      <ThreadBorder
        color="pink"
        edge="top"
        className="absolute left-1/2 top-0 w-60 max-w-none -translate-x-1/2 -translate-y-1/2"
      />
      <div className="mx-auto max-w-[1100px] px-6">
        <Reveal className="relative mb-14 text-center">
          <SectionGlow className="left-1/2 top-0 -translate-x-1/2" />
          <h2 className="font-display text-3xl font-bold tracking-[-0.02em] text-trust-blue md:text-4xl">
            Organization Spotlight
          </h2>
          <p className="mx-auto mt-4 max-w-[60ch] font-body text-lg leading-relaxed text-fabric-dark">
            Stories woven together through purpose, creativity, leadership, and service.
          </p>
        </Reveal>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-96 animate-pulse rounded-[8px] bg-canvas-cream" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {organizations.map((org, i) => {
              const color = clusterBySlug(org.cluster.slug)?.color ?? 'blue'
              const hex = threadHex[color]
              return (
                <Reveal key={org.id} delay={i * 100}>
                  <article
                    className="group relative flex h-full flex-col overflow-hidden rounded-[8px] border border-trust-blue/10 bg-canvas-cream shadow-[0_4px_20px_rgba(46,74,143,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(46,74,143,0.14)]"
                    style={{ '--accent': hex } as React.CSSProperties}
                  >
                    <div className="relative">
                      <img
                        src={hoopFrames[i % hoopFrames.length]}
                        alt=""
                        role="presentation"
                        loading="lazy"
                        className="aspect-[16/9] w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                      />
                      {org.logo && (
                        <div className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full border-4 border-linen-white bg-linen-white shadow-[0_4px_16px_rgba(46,74,143,0.16)]">
                          <img src={org.logo} alt={`${org.name} logo`} className="h-full w-full object-cover" loading="lazy" />
                        </div>
                      )}
                      <EmbroideredAccent
                        color={color}
                        index={0}
                        size={32}
                        className="absolute right-3 top-3 opacity-90"
                      />
                    </div>

                    <div className="flex flex-1 flex-col gap-3 p-6 text-center md:text-left">
                      <h3 className="font-display text-xl font-bold text-trust-blue">{org.name}</h3>
                      <ClusterBadge slug={org.cluster.slug} className="mx-auto md:mx-0" />
                      <p className="font-body leading-relaxed text-fabric-dark">{org.description}</p>

                      <Link
                        to={`/organizations/${org.slug}`}
                        className="mt-auto inline-flex items-center justify-center gap-1.5 self-center pt-2 font-body font-medium text-trust-blue transition-all duration-300 hover:gap-2.5 hover:text-[var(--accent)] md:justify-start md:self-start"
                      >
                        View Story
                        <ArrowRight size={16} strokeWidth={1.75} />
                      </Link>
                    </div>
                  </article>
                </Reveal>
              )
            })}
          </div>
        )}

        <div className="mt-14 text-center">
          <Link
            to="/organizations"
            className="inline-flex items-center gap-1.5 font-body font-medium text-trust-blue transition-colors hover:text-thread-red"
          >
            View All Organizations
            <ArrowRight size={16} strokeWidth={1.75} />
          </Link>
        </div>
      </div>
    </section>
  )
}
