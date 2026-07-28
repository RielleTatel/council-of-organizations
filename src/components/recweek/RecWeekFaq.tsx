import { ChevronDown } from 'lucide-react'
import { Reveal } from '../ui/Reveal'
import { faqs } from '../../data/recweek'

export function RecWeekFaq() {
  return (
    <section className="bg-canvas-cream py-20 md:py-28">
      <div className="mx-auto max-w-[800px] px-6">
        <Reveal className="mb-12 text-center">
          <span className="font-body text-xs font-medium uppercase tracking-[0.14em] text-thread-pink">
            Good to Know
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-[-0.02em] text-trust-blue md:text-4xl">
            Frequently Asked Questions
          </h2>
        </Reveal>

        <Reveal className="flex flex-col divide-y divide-dashed divide-stitch-gray/40 rounded-[8px] border border-trust-blue/10 bg-linen-white px-6 shadow-[0_4px_20px_rgba(46,74,143,0.06)]">
          {faqs.map((faq) => (
            <details key={faq.question} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-lg font-bold text-trust-blue">
                {faq.question}
                <ChevronDown
                  size={20}
                  strokeWidth={1.75}
                  className="shrink-0 text-stitch-gray transition-transform duration-300 group-open:rotate-180"
                />
              </summary>
              <p className="mt-3 font-body leading-relaxed text-fabric-dark">{faq.answer}</p>
            </details>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
