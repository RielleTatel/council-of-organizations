import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import { Seo } from '../components/Seo'
import { Reveal } from '../components/ui/Reveal'
import { ClusterBadge } from '../components/shared/ClusterBadge'
import { OrganizationCard } from '../components/shared/OrganizationCard'
import { EmbroideredAccent } from '../components/EmbroideredAccent'
import { ThreadBorder } from '../components/ThreadBorder'
import { SectionGlow } from '../components/ui/SectionGlow'
import { FloatingAccent } from '../components/ui/FloatingAccent'
import { buttonVariants } from '../components/ui/Button'
import { useOrganization } from '../hooks/useOrganization'
import { useOrganizations } from '../hooks/useOrganizations'
import { relatedOrganizations } from '../lib/directory'
import { clusterBySlug } from '../config/clusters'
import { threadHex } from '../lib/assets'

export default function OrganizationProfile() {
  const { slug = '' } = useParams()
  const { data: organization, isLoading } = useOrganization(slug)
  const { data: allOrgs } = useOrganizations()

  if (isLoading) {
    return (
      <div className="mx-auto max-w-[1200px] px-6 pt-32 pb-20">
        <div className="h-80 w-full animate-pulse rounded-[8px] bg-stitch-gray/20" />
      </div>
    )
  }

  if (!organization) {
    return (
      <>
        <Seo title="Organization Not Found | COA-Z" description="The organization you are looking for could not be found." />
        <section className="mx-auto flex max-w-[700px] flex-col items-center gap-6 px-6 pt-32 pb-24 text-center">
          <EmbroideredAccent color="red" index={0} size={64} />
          <h1 className="font-display text-3xl font-bold text-trust-blue">Organization Not Found</h1>
          <p className="font-body text-lg text-fabric-dark">
            We could not find that organization. It may have been renamed or is no longer accredited.
          </p>
          <Link to="/organizations" className={buttonVariants({ variant: 'secondary' })}>
            Back to Organizations
          </Link>
        </section>
      </>
    )
  }

  const related = relatedOrganizations(allOrgs ?? [], organization, 3)
  const clusterMeta = clusterBySlug(organization.cluster.slug)
  const hex = clusterMeta ? threadHex[clusterMeta.color] : '#8a8a8a'

  return (
    <>
      <Seo title={`${organization.name} | COA-Z`} description={organization.description} />

      <section className="relative bg-canvas-cream pt-28 pb-16 md:pt-32 md:pb-20">
        <SectionGlow className="right-0 top-1/3 h-72 w-72" />
        <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-12 px-6 md:grid-cols-2">
          <Reveal className="relative mx-auto w-full max-w-sm">
            {organization.logo ? (
              <img
                src={organization.logo}
                alt={organization.name}
                width={600}
                height={400}
                loading="eager"
                className="aspect-[3/2] w-full rounded-[8px] object-contain bg-linen-white p-8 shadow-[0_4px_20px_rgba(46,74,143,0.06)]"
              />
            ) : (
              <div
                className="flex aspect-[3/2] w-full items-center justify-center rounded-[8px] p-8 font-display text-4xl font-bold shadow-[0_4px_20px_rgba(46,74,143,0.06)]"
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
            <FloatingAccent duration={6.5} distance={9} rotate={-6} className="absolute -right-3 -top-4">
              <EmbroideredAccent color="pink" index={0} size={52} />
            </FloatingAccent>
          </Reveal>

          <Reveal delay={120} className="flex flex-col items-start gap-4">
            <ClusterBadge slug={organization.cluster.slug} />
            <h1 className="font-display text-4xl font-bold tracking-[-0.02em] text-trust-blue md:text-5xl">
              {organization.name}
            </h1>
            <p className="max-w-[54ch] font-body text-lg leading-relaxed text-fabric-dark">
              {organization.description}
            </p>
            {organization.link && (
              <a
                href={organization.link}
                target="_blank"
                rel="noreferrer"
                className={buttonVariants({ variant: 'secondary' })}
              >
                Visit Facebook Page
                <ExternalLink size={18} strokeWidth={1.75} />
              </a>
            )}
          </Reveal>
        </div>
      </section>

      {organization.officers.length > 0 && (
        <section className="relative bg-linen-white py-16 md:py-20">
          <ThreadBorder
            color="blue"
            edge="top"
            className="absolute left-[42%] top-0 w-56 max-w-none -translate-x-1/2 -translate-y-1/2"
          />
          <div className="mx-auto max-w-[1000px] px-6">
            <Reveal>
              <h2 className="font-display text-2xl font-bold tracking-[-0.02em] text-trust-blue md:text-3xl">
                Officers
              </h2>
              <ul className="mt-6 flex flex-col divide-y divide-dashed divide-stitch-gray/40">
                {organization.officers.map((officer) => (
                  <li key={officer} className="py-3 font-body text-lg text-fabric-dark">
                    {officer}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="relative bg-canvas-cream py-16 md:py-20">
          <ThreadBorder
            color="yellow"
            edge="top"
            flip
            className="absolute left-[58%] top-0 w-60 max-w-none -translate-x-1/2 -translate-y-1/2"
          />
          <div className="mx-auto max-w-[1200px] px-6">
            <Reveal className="mb-8">
              <h2 className="font-display text-2xl font-bold tracking-[-0.02em] text-trust-blue md:text-3xl">
                More in {organization.cluster.name}
              </h2>
            </Reveal>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((org) => (
                <OrganizationCard key={org.slug} organization={org} />
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="mx-auto max-w-[1200px] px-6 pb-20">
        <Link
          to="/organizations"
          className="inline-flex items-center gap-2 font-body font-medium text-trust-blue transition-colors hover:text-thread-red"
        >
          <ArrowLeft size={18} strokeWidth={1.75} />
          Back to Organizations
        </Link>
      </div>
    </>
  )
}
