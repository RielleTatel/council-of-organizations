import { useCmsCopy, CmsRichText, useSingleton } from "../lib/cms/public";
import { Link } from "react-router-dom";
import { Seo } from "../components/Seo";
import { PageHeader } from "../components/shared/PageHeader";
import { Reveal } from "../components/ui/Reveal";
import { EmbroideredAccent } from "../components/EmbroideredAccent";
import { ThreadDivider } from "../components/ThreadDivider";
import { ThreadBorder } from "../components/ThreadBorder";
import { SectionGlow } from "../components/ui/SectionGlow";
import { FloatingAccent } from "../components/ui/FloatingAccent";

export default function About() {
  const copy = useCmsCopy("about", "About");
  const { functions: FUNCTIONS, principles: PRINCIPLES } =
    useSingleton("about");
  return (
    <>
      <Seo
        title={copy.title0}
        description={copy.description1}
        canonical="/about"
      />

      <PageHeader
        eyebrow={copy.eyebrow2}
        title={copy.title3}
        accent="green"
        emblem="green"
        description={copy.description4}
      />

      <section className="relative bg-canvas-cream py-16 md:py-20">
        <ThreadBorder
          color="green"
          edge="top"
          className="absolute left-[45%] top-0 w-56 max-w-none -translate-x-1/2 -translate-y-1/2"
        />
        <Reveal className="mx-auto max-w-[68ch] px-6">
          <div className="flex flex-col gap-5 font-body text-lg leading-relaxed text-fabric-dark">
            <div>
              <CmsRichText value={copy.paragraph5} />
            </div>
            <div>
              <CmsRichText value={copy.paragraph6} />
            </div>
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
              {copy.text7}
            </h2>
            <div className="mx-auto mt-4 max-w-[60ch] font-body text-lg leading-relaxed text-fabric-dark">
              <CmsRichText value={copy.paragraph8} />
            </div>
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
                  <h3 className="max-w-[16ch] font-display text-xl font-bold text-trust-blue">
                    {f.title}
                  </h3>
                  <div className="mt-3 font-body leading-relaxed text-fabric-dark"><CmsRichText value={f.body}/></div>
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
            <span className="font-accent text-3xl text-thread-purple">
              {copy.text9}
            </span>
            <div className="font-body leading-relaxed text-fabric-dark">
              <CmsRichText value={copy.paragraph10} />
            </div>
          </Reveal>
          <Reveal
            delay={120}
            className="flex flex-col gap-4 rounded-[8px] bg-linen-white p-8 shadow-[0_4px_20px_rgba(46,74,143,0.06)]"
          >
            <span className="font-accent text-3xl text-thread-green">
              {copy.text11}
            </span>
            <div className="font-body leading-relaxed text-fabric-dark">
              <CmsRichText value={copy.paragraph12} />
            </div>
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
              {copy.text13}
            </h2>
          </Reveal>
          <div className="flex flex-col">
            {PRINCIPLES.map((p, i) => (
              <Reveal key={p.title}>
                <div className="flex flex-col items-center gap-3 py-8 text-center md:flex-row md:items-start md:gap-6 md:text-left">
                  <FloatingAccent
                    duration={5.5 + i * 0.5}
                    delay={i * 0.3}
                    distance={6}
                    rotate={i % 2 === 0 ? 6 : -6}
                    className="shrink-0"
                  >
                    <EmbroideredAccent color={p.color} index={0} size={48} />
                  </FloatingAccent>
                  <div>
                    <h3 className="font-display text-2xl font-bold text-trust-blue">
                      {p.title}
                    </h3>
                    <div className="mt-2 max-w-[60ch] font-body leading-relaxed text-fabric-dark"><CmsRichText value={p.body}/></div>
                  </div>
                </div>
                {i < PRINCIPLES.length - 1 && (
                  <ThreadDivider className="mx-auto max-w-2xl" />
                )}
              </Reveal>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              to={copy.link14}
              className="inline-flex items-center gap-1.5 font-body font-medium text-trust-blue transition-colors hover:text-thread-red"
            >
              {copy.text15}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
