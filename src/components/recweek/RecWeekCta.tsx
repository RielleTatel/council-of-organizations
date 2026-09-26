import { useCmsCopy, CmsRichText } from "../../lib/cms/public";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "../ui/Button";
import { EmbroideredAccent } from "../EmbroideredAccent";
import { Reveal } from "../ui/Reveal";

export function RecWeekCta() {
  const copy = useCmsCopy("recweek", "RecWeekCta");
  return (
    <section className="relative overflow-hidden bg-trust-blue py-24 md:py-28">
      <EmbroideredAccent
        color="red"
        index={0}
        size={72}
        className="absolute left-8 top-10 opacity-70"
      />
      <EmbroideredAccent
        color="yellow"
        index={0}
        size={64}
        className="absolute bottom-10 right-10 opacity-70"
      />

      <Reveal className="mx-auto flex max-w-[800px] flex-col items-center gap-6 px-6 text-center">
        <h2 className="font-display text-3xl font-bold leading-tight tracking-[-0.02em] text-linen-white md:text-4xl">
          {copy.text0}
        </h2>
        <div className="max-w-[60ch] font-body text-lg leading-relaxed text-linen-white/85">
          <CmsRichText value={copy.paragraph1} />
        </div>
        <Link
          to={copy.link2}
          className={`${buttonVariants({ variant: "primary" })} bg-linen-white text-trust-blue hover:bg-thread-yellow hover:text-fabric-dark`}
        >
          {copy.text3}
          <ArrowRight size={18} strokeWidth={1.75} />
        </Link>
      </Reveal>
    </section>
  );
}
