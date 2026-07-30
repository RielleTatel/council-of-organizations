import { EmbroideredAccent } from '../EmbroideredAccent'
import { FloatingAccent } from '../ui/FloatingAccent'
import { DriftingThread } from '../ui/DriftingThread'
import { Reveal } from '../ui/Reveal'
import { ThreadDivider } from '../ThreadDivider'
import { orgFairLogo, threadsByColor } from '../../lib/assets'

/** Compact hero for the booth-map page — same logo/flower/thread language as the RecWeek story hero. */
export function RecWeekMapHero() {
  return (
    <section className="relative overflow-hidden bg-canvas-cream pb-12 pt-28 md:pb-16 md:pt-32">
      <FloatingAccent duration={6} distance={6} rotate={3} className="absolute left-[8%] top-16 hidden opacity-70 md:block">
        <EmbroideredAccent color="yellow" index={0} size={36} opacity={80} />
      </FloatingAccent>
      <FloatingAccent duration={7} delay={0.4} distance={7} rotate={-3} className="absolute right-[10%] top-20 hidden opacity-70 md:block">
        <EmbroideredAccent color="pink" index={0} size={32} opacity={80} />
      </FloatingAccent>
      <DriftingThread src={threadsByColor.blue[0]} className="absolute left-[4%] bottom-6 hidden w-16 opacity-70 md:block" duration={6} />
      <DriftingThread src={threadsByColor.red[0]} className="absolute right-[4%] bottom-8 hidden w-14 opacity-70 md:block" duration={5.5} delay={0.3} />

      <Reveal className="relative mx-auto max-w-[720px] px-6 text-center">
        <img
          src={orgFairLogo}
          alt="Dia de Colores OrgFair 2026"
          className="mx-auto w-[70%] sm:w-[300px] lg:w-[340px]"
        />
        <span className="mt-6 block font-body text-xs font-medium uppercase tracking-[0.14em] text-stitch-gray">
          Org Fair 2026
        </span>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-[-0.02em] text-trust-blue md:text-5xl">
          RecWeek Booth Locations
        </h1>
        <p className="mx-auto mt-5 max-w-[62ch] font-body text-lg leading-relaxed text-fabric-dark">
          Explore booth locations across the three RecWeek venues.
        </p>
        <div className="mt-8 flex items-center justify-center">
          <ThreadDivider flowerColor="blue" className="w-full max-w-xs" />
        </div>
      </Reveal>
    </section>
  )
}
