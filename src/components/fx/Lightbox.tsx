'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useCallback, useEffect, useRef } from 'react';
import type { Photo } from '@/lib/photos';
import { setScrollLocked } from './SmoothScroll';

export default function Lightbox({
  photos,
  index,
  onChange,
  onClose,
}: {
  photos: Photo[];
  index: number | null;
  onChange: (i: number) => void;
  onClose: () => void;
}) {
  const open = index !== null;
  const closeBtn = useRef<HTMLButtonElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  const step = useCallback(
    (dir: 1 | -1) => {
      if (index === null) return;
      onChange((index + dir + photos.length) % photos.length);
    },
    [index, onChange, photos.length],
  );

  useEffect(() => {
    if (!open) return;
    lastFocus.current = document.activeElement as HTMLElement;
    setScrollLocked(true);
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      setScrollLocked(false);
      lastFocus.current?.focus?.();
    };
  }, [open, onClose, step]);

  const current = index !== null ? photos[index] : null;

  return (
    <AnimatePresence>
      {open && current && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={current.alt}
          className="fixed inset-0 z-[90] flex flex-col bg-night/95 backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          onClick={onClose}
        >
          <div className="flex items-center justify-between px-4 py-4 sm:px-8" onClick={(e) => e.stopPropagation()}>
            <p className="tnum text-sm uppercase tracking-[0.18em] text-dust">
              {String(index! + 1).padStart(2, '0')} / {String(photos.length).padStart(2, '0')}
            </p>
            <button
              ref={closeBtn}
              type="button"
              onClick={onClose}
              aria-label="Close photo"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-flood/20 text-flood transition-colors hover:border-gold hover:text-gold"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 sm:px-20">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.figure
                key={current.src}
                className="flex max-h-full flex-col items-center"
                initial={{ opacity: 0, scale: 0.96, filter: 'blur(8px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 1.02, filter: 'blur(8px)' }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.4}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -80) step(1);
                  else if (info.offset.x > 80) step(-1);
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={current.src}
                  alt={current.alt}
                  width={current.w}
                  height={current.h}
                  draggable={false}
                  className="max-h-[74vh] w-auto rounded-2xl object-contain shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)]"
                />
                <figcaption className="mt-4 max-w-[60ch] text-center text-sm text-chalk">{current.alt}</figcaption>
              </motion.figure>
            </AnimatePresence>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                step(-1);
              }}
              aria-label="Previous photo"
              className="absolute left-2 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-flood/20 text-flood transition-colors hover:border-gold hover:text-gold sm:flex md:left-6"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                step(1);
              }}
              aria-label="Next photo"
              className="absolute right-2 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-flood/20 text-flood transition-colors hover:border-gold hover:text-gold sm:flex md:right-6"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
          <p className="pb-5 text-center text-xs uppercase tracking-[0.18em] text-dust sm:hidden">Swipe for more</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
