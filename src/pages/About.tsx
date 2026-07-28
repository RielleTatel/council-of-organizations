import { Seo } from '../components/Seo'
import { PageHeader } from '../components/shared/PageHeader'
import { Reveal } from '../components/ui/Reveal'
import { EmbroideredAccent } from '../components/EmbroideredAccent'
import { ThreadDivider } from '../components/ThreadDivider'
import { ThreadBorder } from '../components/ThreadBorder'
import { SectionGlow } from '../components/ui/SectionGlow'
import { FloatingAccent } from '../components/ui/FloatingAccent'
import type { ThreadColor } from '../lib/assets'

const FUNCTIONS: { title: string; body: string; color: ThreadColor }[] = [
  {
    title: 'As a Representative Body',
    color: 'red',
    body: 'COA-Z defends and advances the general welfare of its member organizations, ensuring their voices are heard in university-wide decision-making.',
  },
  {
    title: 'As an Administrative Body',
    color: 'blue',
    body: "COA-Z advances member organizations' welfare and advocacies, and upholds its rights within university committees such as the Central Assembly and El Consejo Atenista.",
  },
  {
    title: 'As an Administrative Body',
    color: 'purple',
    body: 'COA-Z streamlines processes and archives relevant data to preserve efficiency in transitions and operations, both for the Council as a whole and for individual member organizations.',
  },
  {
    title: 'As a Formative Body',
    color: 'green',
    body: 'COA-Z fosters the enrichment of core competencies, advocacies, and organizational development toward the holistic formation of members and constituents.',
  },
  {
    title: 'As a Unitive Body',
    color: 'yellow',
    body: 'COA-Z provides platforms and fosters purposeful collaboration among member organizations and institutions, within and beyond Ateneo.',
  },
  {
    title: 'Through Service',
    color: 'pink',
    body: 'COA-Z fulfills its purpose through essential, effective, and adequate support services and initiatives, and as collective representative and liaison to external entities.',
  },
]

const PRINCIPLES: { title: string; body: string; color: ThreadColor }[] = [
  {
    title: 'Representative Democracy',
    color: 'red',
    body: 'All Ateneo student organizations are present and united in creating a collaborative community that develops student leaders to become empowered, active, competent, and holistically formed.',
  },
  {
    title: 'Equality and Accessibility',
    color: 'green',
    body: 'All Ateneo student organizations and their constituents receive fair and equal treatment, and benefit from and with each other in order to form a progressive and effective coalition.',
  },
  {
    title: 'Transparency and Accountability',
    color: 'blue',
    body: 'All Ateneo student organizations are held fully responsible for decisions that impact the community, with no exemptions.',
  },
]

export default function About() {
  return (
    <>
      <Seo
        title="About COA-Z | COA-Z"
        description="Who we are, our purpose, vision, mission, and core principles as the alliance of accredited organizations of Ateneo de Zamboanga University."
      />

      <PageHeader
        eyebrow="About"
        title="Who We Are"
        accent="green"
        description="The sole alliance of all Ateneo de Zamboanga University College-accredited organizations, and the primary bridge between El Consejo Atenista and the campus organizations it oversees."
      />

      <section className="relative bg-canvas-cream py-16 md:py-20">
        <ThreadBorder
          color="green"
          edge="top"
          className="absolute left-[45%] top-0 w-56 max-w-none -translate-x-1/2 -translate-y-1/2"
        />
        <Reveal className="mx-auto max-w-[68ch] px-6">
          <div className="flex flex-col gap-5 font-body text-lg leading-relaxed text-fabric-dark">
            <p>
              The Council of the Organizations of the Ateneo - Zamboanga (COA-Z) unites all accredited
              organizations under a shared commitment to leadership, collaboration, and community. We serve
              as the primary bridge between El Consejo Atenista and the campus organizations it oversees.
            </p>
            <p>
              For years, COA-Z has been the central body that creates platforms and programs for meaningful
              collaboration among member organizations and with external institutions alike. We amplify
              proactive leadership, support student organizations' initiatives, and build spaces where
              Ateneans can work together toward a greater good.
            </p>
          </div>
        </Reveal>
      </section>

      <section className="relative bg-linen-white py-20 md:py-28">
        <ThreadBorder
          color="yellow"
          edge="top"
          flip
          className="absolute left-[56%] top-0 w-64 max-w-none -translate-x-1/2 -translate-y-1/2"
        />
        <div className="mx-auto max-w-[1200px] px-6">
          <Reveal className="relative mb-12 text-center">
            <SectionGlow className="left-1/2 top-0 -translate-x-1/2" />
            <h2 className="font-display text-3xl font-bold tracking-[-0.02em] text-trust-blue md:text-4xl">
              Our Purpose
            </h2>
            <p className="mx-auto mt-4 max-w-[60ch] font-body text-lg leading-relaxed text-fabric-dark">
              COA-Z fulfills six core functions as the governing alliance of AdZU's accredited organizations.
            </p>
          </Reveal>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {FUNCTIONS.map((f, i) => (
              <Reveal key={`${f.title}-${i}`} delay={(i % 3) * 80}>
                <article className="relative h-full overflow-hidden rounded-[8px] border border-trust-blue/10 bg-canvas-cream p-8 shadow-[0_4px_20px_rgba(46,74,143,0.06)]">
                  <FloatingAccent
                    duration={5 + (i % 3) * 0.6}
                    delay={(i % 3) * 0.3}
                    distance={6}
                    rotate={i % 2 === 0 ? 6 : -6}
                    className="absolute right-5 top-5 opacity-90"
                  >
                    <EmbroideredAccent color={f.color} index={0} size={40} />
                  </FloatingAccent>
                  <h3 className="max-w-[16ch] font-display text-xl font-bold text-trust-blue">{f.title}</h3>
                  <p className="mt-3 font-body leading-relaxed text-fabric-dark">{f.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="relative bg-canvas-cream py-20 md:py-28">
        <ThreadBorder
          color="pink"
          edge="top"
          className="absolute left-[40%] top-0 w-56 max-w-none -translate-x-1/2 -translate-y-1/2"
        />
        <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-10 px-6 md:grid-cols-2">
          <Reveal className="flex flex-col gap-4 rounded-[8px] bg-linen-white p-8 shadow-[0_4px_20px_rgba(46,74,143,0.06)]">
            <span className="font-accent text-3xl text-thread-purple">Our Vision</span>
            <p className="font-body leading-relaxed text-fabric-dark">
              The Council of Organizations of Ateneo - Zamboanga envisions itself as an empowered and
              collaborative community of competent organizations and holistically-formed students, ready to
              proactively respond to the challenges of their time and initiate positive changes within the
              Ateneo community and in greater society, through the Ignatian tradition of service and excellence.
            </p>
          </Reveal>
          <Reveal delay={120} className="flex flex-col gap-4 rounded-[8px] bg-linen-white p-8 shadow-[0_4px_20px_rgba(46,74,143,0.06)]">
            <span className="font-accent text-3xl text-thread-green">Our Mission</span>
            <p className="font-body leading-relaxed text-fabric-dark">
              We develop organizations as formative spaces, providing Ateneans venues for critical
              socio-political discourse, business engagement, spiritual growth, environmental action, physical
              and mental health, cultural exploration, creative communication, artistic expression, social
              immersion, and innovation through science and technology. We empower organizations to be united,
              effective, collaborative, and sustainable through proper guidance, dialogue, and support.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="relative bg-linen-white py-20 md:py-28">
        <ThreadBorder
          color="blue"
          edge="top"
          flip
          className="absolute left-[60%] top-0 w-60 max-w-none -translate-x-1/2 -translate-y-1/2"
        />
        <div className="mx-auto max-w-[1000px] px-6">
          <Reveal className="relative mb-10 text-center">
            <SectionGlow className="left-1/2 top-0 -translate-x-1/2" />
            <h2 className="font-display text-3xl font-bold tracking-[-0.02em] text-trust-blue md:text-4xl">
              Core Principles
            </h2>
          </Reveal>
          <div className="flex flex-col">
            {PRINCIPLES.map((p, i) => (
              <Reveal key={p.title}>
                <div className="flex flex-col items-center gap-3 py-8 text-center md:flex-row md:items-start md:gap-6 md:text-left">
                  <FloatingAccent duration={5.5 + i * 0.5} delay={i * 0.3} distance={6} rotate={i % 2 === 0 ? 6 : -6} className="shrink-0">
                    <EmbroideredAccent color={p.color} index={0} size={48} />
                  </FloatingAccent>
                  <div>
                    <h3 className="font-display text-2xl font-bold text-trust-blue">{p.title}</h3>
                    <p className="mt-2 max-w-[60ch] font-body leading-relaxed text-fabric-dark">{p.body}</p>
                  </div>
                </div>
                {i < PRINCIPLES.length - 1 && <ThreadDivider className="mx-auto max-w-2xl" />}
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
