import { EmbroideredAccent } from '../EmbroideredAccent'
import { Reveal } from '../ui/Reveal'
import type { ThreadColor } from '../../lib/assets'

interface Purpose {
  title: string
  body: string
  color: ThreadColor
}

const PURPOSES: Purpose[] = [
  { title: 'Represent', body: 'Advocate for the welfare, interests, and voices of accredited student organizations within the university.', color: 'red' },
  { title: 'Support', body: 'Provide guidance, administrative assistance, and essential resources that strengthen organizational operations.', color: 'blue' },
  { title: 'Develop', body: 'Promote leadership formation, organizational growth, and the continuous development of student leaders.', color: 'green' },
  { title: 'Connect', body: 'Create opportunities for collaboration among organizations, university offices, and external partners.', color: 'purple' },
]

export function PurposeSection() {
  return (
    <section className="bg-canvas-cream py-20 md:py-28">
      <div className="mx-auto max-w-[1200px] px-6">
        <Reveal className="mb-12 text-center">
          <span className="font-body text-xs font-medium uppercase tracking-[0.14em] text-thread-purple">
            Our Purpose
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-[-0.02em] text-trust-blue md:text-4xl">
            What We Do
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {PURPOSES.map((p, i) => (
            <Reveal key={p.title} delay={i * 80}>
              <article className="group relative h-full overflow-hidden rounded-[8px] border border-trust-blue/10 bg-linen-white p-8 shadow-[0_4px_20px_rgba(46,74,143,0.06)]">
                <EmbroideredAccent color={p.color} index={0} size={44} className="absolute right-5 top-5 opacity-90" />
                <h3 className="font-display text-2xl font-bold text-trust-blue">{p.title}</h3>
                <p className="mt-3 max-w-[42ch] font-body leading-relaxed text-fabric-dark">{p.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
