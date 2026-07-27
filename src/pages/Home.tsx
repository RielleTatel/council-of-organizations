import { siteConfig } from '../config/site'
import { ThreadBorder } from '../components/ThreadBorder'
import { EmbroideredAccent } from '../components/EmbroideredAccent'
import { ThreadDivider } from '../components/ThreadDivider'
import { hoopFrames } from '../lib/assets'

export default function Home() {
  return (
    <main className="bg-canvas-cream">
      <section className="relative mx-auto flex max-w-[1200px] flex-col items-center gap-8 px-6 py-24 text-center sm:py-32">
        <ThreadBorder color="purple" edge="top" className="absolute left-1/2 top-4 -translate-x-1/2" />

        <div className="flex items-center gap-3">
          <EmbroideredAccent color="yellow" index={0} size={40} />
          <p className="font-accent text-2xl text-thread-purple">Interwoven Beyond</p>
          <EmbroideredAccent color="pink" index={0} size={40} />
        </div>

        <h1 className="font-display text-5xl font-bold leading-tight tracking-[-0.02em] text-trust-blue sm:text-6xl">
          {siteConfig.fullName}
        </h1>

        <p className="max-w-2xl text-lg leading-relaxed text-fabric-dark">
          {siteConfig.description} Every organization is a thread. Together, we are stitched into one
          fabric — woven by shared purpose.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <button className="rounded-full bg-trust-blue px-8 py-3 font-body font-medium text-linen-white transition hover:-translate-y-0.5 hover:bg-thread-green">
            Join the Weave
          </button>
          <button className="rounded-full border-2 border-trust-blue px-8 py-3 font-body font-medium text-trust-blue transition hover:-translate-y-0.5 hover:border-thread-red hover:text-thread-red">
            Meet the Organizations
          </button>
        </div>

        <ThreadBorder color="blue" edge="bottom" className="absolute bottom-4 left-1/2 -translate-x-1/2" />
      </section>

      <ThreadDivider flowerColor="green" className="mx-auto max-w-xs px-6" />

      <section className="mx-auto grid max-w-[1200px] grid-cols-1 gap-12 px-6 py-20 sm:grid-cols-2 sm:items-center">
        <div className="relative mx-auto aspect-square w-full max-w-sm">
          <img src={hoopFrames[0]} alt="Embroidery hoop frame" className="h-full w-full object-cover" />
          <EmbroideredAccent
            color="red"
            index={2}
            size={56}
            className="absolute -right-4 -top-4 drop-shadow-[0_4px_10px_rgba(46,74,143,0.15)]"
          />
        </div>

        <div className="flex flex-col gap-4 text-left">
          <h2 className="font-display text-3xl font-semibold text-trust-blue">Threads of Unity</h2>
          <p className="text-base leading-relaxed text-fabric-dark">
            The Council of Organizations of the Ateneo - Zamboanga brings every student organization
            together as one interwoven community — diverse in color, unified in purpose.
          </p>
        </div>
      </section>
    </main>
  )
}
