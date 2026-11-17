'use client';

import { motion } from 'framer-motion';
import { useReducedMotion } from '@/lib/motion';
import Link from 'next/link';
import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import type { Photo } from '@/lib/photos';
import Lightbox from '@/components/fx/Lightbox';
import { SplitReveal } from '@/components/fx/primitives';

export function MasonryGrid({ photos, initial = photos.length }: { photos: Photo[]; initial?: number }) {
  const [open, setOpen] = useState<number | null>(null);
  const [visible, setVisible] = useState(initial);
  const reduce = useReducedMotion();
  const shown = photos.slice(0, visible);

  return (
    <>
      <ul className="columns-2 gap-3 md:columns-3 md:gap-5 xl:columns-4">
        {shown.map((p, i) => (
          <motion.li
            key={p.src}
            className="mb-3 break-inside-avoid md:mb-5"
            initial={reduce ? false : { opacity: 0, y: 40, clipPath: 'inset(18% 0% 0% 0% round 18px)' }}
            whileInView={{ opacity: 1, y: 0, clipPath: 'inset(0% 0% 0% 0% round 18px)' }}
            viewport={{ once: true, margin: '0px 0px -8% 0px' }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: (i % 4) * 0.06 }}
          >
            <button
              type="button"
              onClick={() => setOpen(i)}
              data-cursor="View"
              className="group relative block w-full overflow-hidden rounded-[18px] bg-pitch"
              aria-label={`Open photo: ${p.alt}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.src}
                alt={p.alt}
                width={p.w}
                height={p.h}
                loading="lazy"
                decoding="async"
                className="h-auto w-full transition-[transform,filter] duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-[1.06] group-hover:brightness-110"
              />
              <span className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-night/95 to-transparent p-4 pt-10 text-left text-sm text-flood transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-y-0 group-focus-visible:translate-y-0">
                {p.alt}
              </span>
            </button>
          </motion.li>
        ))}
      </ul>

      {visible < photos.length && (
        <div className="mt-12 text-center">
          <button
            type="button"
            onClick={() => setVisible((v) => v + 12)}
            className="rounded-full border border-flood/20 px-8 py-4 text-sm font-bold uppercase tracking-[0.14em] text-flood transition-colors hover:border-gold hover:text-gold"
          >
            Show {Math.min(12, photos.length - visible)} more
          </button>
        </div>
      )}

      <Lightbox photos={shown} index={open} onChange={setOpen} onClose={() => setOpen(null)} />
    </>
  );
}

export default function Gallery({ photos }: { photos: Photo[] }) {
  return (
    <section id="gallery" aria-labelledby="gallery-title" className="bg-night py-28 md:py-40">
      <div className="mx-auto max-w-[1500px] px-4 sm:px-8">
        <div className="mb-14 grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
          <SplitReveal id="gallery-title"
            as="h2"
            text="From the stands"
            accent={['stands']}
            className="font-display text-[clamp(3rem,8vw,6rem)] font-black uppercase leading-[0.85] tracking-[-0.02em]"
          />
          <Link href="/gallery" className="group inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.14em] text-gold">
            Full gallery
            <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>
        <MasonryGrid photos={photos} initial={12} />
      </div>
    </section>
  );
}
