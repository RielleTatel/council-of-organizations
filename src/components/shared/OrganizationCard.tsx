import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import type { Organization } from '../../lib/contentful/types'
import { ClusterBadge } from './ClusterBadge'
import { EmbroideredAccent } from '../EmbroideredAccent'
import { threadHex } from '../../lib/assets'
import { clusterBySlug } from '../../config/clusters'

interface OrganizationCardProps {
  organization: Organization
}

export function OrganizationCard({ organization }: OrganizationCardProps) {
  const cluster = clusterBySlug(organization.cluster.slug)
  const hex = cluster ? threadHex[cluster.color] : '#8a8a8a'

  return (
    <Link
      to={`/organizations/${organization.slug}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-[8px] border border-trust-blue/10 bg-linen-white shadow-[0_4px_20px_rgba(46,74,143,0.06)] transition-transform hover:-translate-y-1"
    >
      {cluster && (
        <EmbroideredAccent
          color={cluster.color}
          index={0}
          size={28}
          className="absolute right-2 top-2 z-10 opacity-90"
        />
      )}
      {organization.logo ? (
        <img
          src={organization.logo}
          alt={organization.name}
          width={600}
          height={400}
          loading="lazy"
          className="aspect-[3/2] w-full object-contain bg-canvas-cream p-6"
        />
      ) : (
        <div
          className="flex aspect-[3/2] w-full items-center justify-center p-6 font-display text-2xl font-bold"
          style={{ backgroundColor: `${hex}14`, color: hex }}
        >
          {organization.name
            .split(' ')
            .slice(0, 2)
            .map((w) => w[0])
            .join('')
            .toUpperCase()}
        </div>
      )}
      <div className="flex flex-1 flex-col gap-3 p-6">
        <ClusterBadge slug={organization.cluster.slug} className="self-start" />
        <h3 className="font-display text-xl font-bold text-trust-blue">{organization.name}</h3>
        <p className="line-clamp-3 font-body leading-relaxed text-fabric-dark">{organization.description}</p>
        <span className="mt-auto inline-flex items-center gap-1.5 font-body font-medium text-trust-blue transition-colors group-hover:text-thread-red">
          View Organization
          <ArrowRight size={16} strokeWidth={1.75} />
        </span>
      </div>
    </Link>
  )
}
