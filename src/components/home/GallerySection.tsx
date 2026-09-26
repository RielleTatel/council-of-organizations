import { useCmsCopy, useSingleton } from "../../lib/cms/public";
import { useEffect, useState, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import { X, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { Reveal } from "../ui/Reveal";
import { SectionGlow } from "../ui/SectionGlow";
import { cn } from "../../lib/utils";

const MOBILE_PREVIEW_COUNT = 4;

/** Deliberately uneven cell heights (in grid rows) so the grid reads as a hand-arranged
 * bento layout rather than a uniform grid — needed since the source photos are almost
 * all the same landscape aspect ratio and won't create variation on their own. */
const ROW_SPANS = [2, 1, 2, 1, 1, 2, 1, 1, 1] as const;

interface LightboxProps {
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

function Lightbox({ index, onClose, onPrev, onNext }: LightboxProps) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") onPrev();
      else if (e.key === "ArrowRight") onNext();
      else if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, onPrev, onNext]);

  const { gallery: GALLERY_IMAGES } = useSingleton("home");
  const image = GALLERY_IMAGES[index];
  if (!image) return null;

  function stop(e: MouseEvent, action: () => void) {
    e.stopPropagation();
    action();
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-fabric-dark/85 backdrop-blur-md"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <img
        src={image.src}
        alt={image.alt}
        className="pointer-events-none max-h-[88vh] max-w-[88vw] rounded-[10px] object-contain shadow-[0_20px_60px_rgba(0,0,0,0.4)]"
      />
      <button
        type="button"
        aria-label="Previous image"
        className="fixed left-2 top-1/2 -translate-y-1/2 p-4 text-linen-white/80 transition-colors hover:text-linen-white"
        onClick={(e) => stop(e, onPrev)}
      >
        <ChevronLeft size={36} strokeWidth={1.75} />
      </button>
      <button
        type="button"
        aria-label="Next image"
        className="fixed right-2 top-1/2 -translate-y-1/2 p-4 text-linen-white/80 transition-colors hover:text-linen-white"
        onClick={(e) => stop(e, onNext)}
      >
        <ChevronRight size={36} strokeWidth={1.75} />
      </button>
      <button
        type="button"
        aria-label="Close"
        className="fixed right-4 top-4 p-3 text-linen-white/80 transition-colors hover:text-linen-white"
        onClick={(e) => stop(e, onClose)}
      >
        <X size={28} strokeWidth={1.75} />
      </button>
    </div>,
    document.body,
  );
}

export function GallerySection() {
  const copy = useCmsCopy("home", "GallerySection");
  const { gallery: GALLERY_IMAGES } = useSingleton("home");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);

  return (
    <section
      id="gallery"
      className="relative scroll-mt-24 bg-linen-white py-16 md:py-20"
    >
      <div className="mx-auto max-w-[1200px] px-6">
        <Reveal className="relative mb-12 text-center">
          <SectionGlow className="left-1/2 top-0 -translate-x-1/2" />
          <span className="font-body text-xs font-medium uppercase tracking-[0.14em] text-thread-pink">
            {copy.text0}
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-[-0.02em] text-trust-blue md:text-4xl">
            {copy.text1}
          </h2>
        </Reveal>

        <Reveal className="grid grid-cols-2 gap-4 [grid-auto-flow:dense] auto-rows-[130px] sm:grid-cols-3 sm:auto-rows-[150px]">
          {GALLERY_IMAGES.map((item, index) => (
            <button
              key={item.src}
              type="button"
              onClick={() => setLightboxIndex(index)}
              aria-label={`View ${item.alt} in full size`}
              className={cn(
                "group relative overflow-hidden rounded-[8px] shadow-[0_4px_20px_rgba(46,74,143,0.06)]",
                index >= MOBILE_PREVIEW_COUNT && !showAll && "hidden sm:block",
              )}
              style={{ gridRow: `span ${ROW_SPANS[index % ROW_SPANS.length]}` }}
            >
              <img
                src={item.src}
                alt={item.alt}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              />
            </button>
          ))}
        </Reveal>

        {GALLERY_IMAGES.length > MOBILE_PREVIEW_COUNT && (
          <button
            type="button"
            onClick={() => setShowAll((v) => !v)}
            className="mx-auto mt-6 flex items-center gap-2 font-body text-sm font-medium text-trust-blue transition-colors hover:text-thread-red sm:hidden"
          >
            {showAll ? "Show Fewer Photos" : "Show More Photos"}
            <ChevronDown
              size={16}
              strokeWidth={1.75}
              className={cn(
                "transition-transform duration-300",
                showAll && "rotate-180",
              )}
            />
          </button>
        )}
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onPrev={() =>
            setLightboxIndex(
              (lightboxIndex - 1 + GALLERY_IMAGES.length) %
                GALLERY_IMAGES.length,
            )
          }
          onNext={() =>
            setLightboxIndex((lightboxIndex + 1) % GALLERY_IMAGES.length)
          }
        />
      )}
    </section>
  );
}
