import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useFeaturedOrganization } from '../../hooks/useHomeData'
import { buttonVariants } from '../ui/Button'
import { EmbroideredAccent } from '../EmbroideredAccent'
import { ThreadBorder } from '../ThreadBorder'
import { Reveal } from '../ui/Reveal'
import { SectionGlow } from '../ui/SectionGlow'
import { FloatingAccent } from '../ui/FloatingAccent'
import { hoopFrames } from '../../lib/assets'

export function FeaturedOrganization() {
  const { organization, isLoading } = useFeaturedOrganization()

  if (!isLoading && !organization) return null

  return (
    <section className="relative bg-linen-white py-20 md:py-28">
      <ThreadBorder
        color="pink"
        edge="top"
        className="absolute left-1/2 top-0 w-60 max-w-none -translate-x-1/2 -translate-y-1/2"
      />
      <div className="mx-auto max-w-[1200px] px-6">
        <Reveal className="relative mb-12 text-center">
          <SectionGlow className="left-1/2 top-0 -translate-x-1/2" />
          <h2 className="font-display text-3xl font-bold tracking-[-0.02em] text-trust-blue md:text-4xl">
            Organization Spotlight
          </h2>
        </Reveal>

        <Reveal className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
          <div className="relative mx-auto w-full max-w-sm">
            <SectionGlow className="left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
            <img
              src={hoopFrames[2]}
              alt=""
              role="presentation"
              width={1200}
              height={1200}
              loading="lazy"
              className="h-auto w-full"
            />
            {isLoading ? (
              <span
                className="absolute left-1/2 top-1/2 h-[55%] w-[55%] -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-stitch-gray/20"
                aria-hidden
              />
            ) : organization?.logo ? (
              <div className="absolute left-1/2 top-1/2 h-[60%] w-[60%] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full bg-linen-white shadow-[0_2px_12px_rgba(46,74,143,0.1)]">
                <img
                  src={organization.logo}
                  alt={`${organization.name} logo`}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
            ) : null}
            <FloatingAccent duration={6.5} distance={9} rotate={-6} className="absolute -right-3 top-6">
              <EmbroideredAccent color="pink" index={0} size={52} />
            </FloatingAccent>
          </div>

          <div className="flex flex-col gap-4 text-center md:text-left">
            {isLoading ? (
              <>
                <span className="mx-auto h-8 w-56 animate-pulse rounded-[8px] bg-stitch-gray/20 md:mx-0" />
                <span className="mx-auto h-4 w-32 animate-pulse rounded-[8px] bg-stitch-gray/20 md:mx-0" />
              </>
            ) : organization ? (
              <>
                <h3 className="font-display text-3xl font-bold text-trust-blue">{organization.name}</h3>
                <span className="font-accent text-2xl text-thread-pink">{organization.cluster.name}</span>
                <p className="max-w-[52ch] font-body leading-relaxed text-fabric-dark">
                  {organization.description}
                </p>
                <Link
                  to={`/organizations/${organization.slug}`}
                  className={`${buttonVariants({ variant: 'secondary' })} mt-2 self-center md:self-start`}
                >
                  View Organization
                  <ArrowRight size={18} strokeWidth={1.75} />
                </Link>
              </>
            ) : null}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
