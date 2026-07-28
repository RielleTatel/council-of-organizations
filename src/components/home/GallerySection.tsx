import { useEffect, useState, type MouseEvent } from 'react'
import { createPortal } from 'react-dom'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { Reveal } from '../ui/Reveal'
import { SectionGlow } from '../ui/SectionGlow'

const GALLERY_FILES = [
  '739118430_1074677254957266_5028353376119372688_n.jpg',
  '736007994_1074677201623938_5558962443347028691_n.jpg',
  '738904413_1074677421623916_8931029527660133770_n.jpg',
  '735945329_1073973625027629_1897203848609486417_n.jpg',
  '737438238_1073973151694343_1061286527293346826_n.jpg',
  '739165019_1074677154957276_5148322198685524243_n.jpg',
  '730749060_1071153625309629_8181401420283714825_n.jpg',
  '735687372_1073974718360853_3070773254197654702_n.jpg',
  '735563327_1074677331623925_8378960752112579917_n.jpg',
  
]

const GALLERY_IMAGES = GALLERY_FILES.map((file, i) => ({
  src: `/gallery/${file}`,
  alt: `COA-Z community moment ${i + 1}`,
}))

/** Deliberately uneven cell heights (in grid rows) so the grid reads as a hand-arranged
 * bento layout rather than a uniform grid — needed since the source photos are almost
 * all the same landscape aspect ratio and won't create variation on their own. */
const ROW_SPANS = [2, 1, 2, 1, 1, 2, 1, 1, 1] as const

interface LightboxProps {
  index: number
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}

function Lightbox({ index, onClose, onPrev, onNext }: LightboxProps) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft') onPrev()
      else if (e.key === 'ArrowRight') onNext()
      else if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose, onPrev, onNext])

  const image = GALLERY_IMAGES[index]

  function stop(e: MouseEvent, action: () => void) {
    e.stopPropagation()
    action()
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
  )
}

export function GallerySection() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  return (
    <section className="relative bg-linen-white py-16 md:py-20">
      <div className="mx-auto max-w-[1200px] px-6">
        <Reveal className="relative mb-12 text-center">
          <SectionGlow className="left-1/2 top-0 -translate-x-1/2" />
          <span className="font-body text-xs font-medium uppercase tracking-[0.14em] text-thread-pink">
            Gallery
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-[-0.02em] text-trust-blue md:text-4xl">
            Moments We&apos;ve Woven Together
          </h2>
        </Reveal>

        <Reveal className="grid grid-cols-2 gap-4 [grid-auto-flow:dense] auto-rows-[130px] sm:grid-cols-3 sm:auto-rows-[150px]">
          {GALLERY_IMAGES.map((item, index) => (
            <button
              key={item.src}
              type="button"
              onClick={() => setLightboxIndex(index)}
              aria-label={`View ${item.alt} in full size`}
              className="group relative overflow-hidden rounded-[8px] shadow-[0_4px_20px_rgba(46,74,143,0.06)]"
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
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onPrev={() => setLightboxIndex((lightboxIndex - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length)}
          onNext={() => setLightboxIndex((lightboxIndex + 1) % GALLERY_IMAGES.length)}
        />
      )}
    </section>
  )
}
