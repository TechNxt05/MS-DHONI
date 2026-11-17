'use client';

import { motion, useAnimationFrame, useInView, useMotionValue, useScroll, useTransform, useVelocity } from 'framer-motion';
import { useReducedMotion } from '@/lib/motion';
import { useThreeD } from '@/lib/three-pref';
import { useEffect, useRef, useState } from 'react';
import { photo } from '@/lib/photos';
import { Reveal, SplitReveal } from '@/components/fx/primitives';
import Lightbox from '@/components/fx/Lightbox';

const ring = [
  'bat-raised-milestone',
  'helicopter-shot',
  'keeper-gloves-close',
  't20-trophy-2007',
  'csk-launch',
  'storm-sky',
  'champions-2011',
  'portrait-2016',
  'keeper-directs-field',
  'victory-bike-ride',
  'floodlit-strike',
  'padma-bhushan-2018',
  'csk-keeper-command',
  'title-celebration',
].map(photo);

export default function PhotoRing() {
  const reduce = useReducedMotion();
  const threeD = useThreeD();
  const [open, setOpen] = useState<number | null>(null);
  const [radius, setRadius] = useState(560);
  const [card, setCard] = useState(240);
  const rotation = useMotionValue(0);
  // Only spin while the ring is on screen.
  const section = useRef<HTMLElement>(null);
  const inView = useInView(section, { margin: '200px 0px' });
  const velocity = useRef(0);
  const dragging = useRef<{ x: number; moved: number } | null>(null);
  const { scrollY } = useScroll();
  const scrollVel = useVelocity(scrollY);
  const tilt = useTransform(scrollVel, [-3000, 0, 3000], [6, -8, -22]);

  useEffect(() => {
    const size = () => {
      const w = window.innerWidth;
      const c = w < 640 ? 140 : w < 1024 ? 190 : 230;
      setCard(c);
      // Radius that seats the cards edge to edge, with a little air.
      setRadius(Math.round((c / 2 / Math.tan(Math.PI / ring.length)) * 1.12));
    };
    size();
    window.addEventListener('resize', size);
    return () => window.removeEventListener('resize', size);
  }, []);

  useAnimationFrame((_, delta) => {
    if (dragging.current || !inView || !threeD) return;
    const auto = reduce ? 0 : 0.006 * delta;
    velocity.current *= 0.94;
    rotation.set(rotation.get() - auto + velocity.current);
  });

  const onDown = (e: React.PointerEvent) => {
    dragging.current = { x: e.clientX, moved: 0 };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    const dx = e.clientX - dragging.current.x;
    dragging.current.x = e.clientX;
    dragging.current.moved += Math.abs(dx);
    const deg = dx * 0.25;
    rotation.set(rotation.get() + deg);
    velocity.current = deg;
  };
  const onUp = (e: React.PointerEvent) => {
    const wasClick = dragging.current && dragging.current.moved < 6;
    dragging.current = null;
    if (wasClick) {
      const target = (e.target as HTMLElement).closest<HTMLElement>('[data-index]');
      if (target) setOpen(Number(target.dataset.index));
    }
  };

  const step = 360 / ring.length;

  return (
    <section ref={section} aria-labelledby="ring-title" className="relative overflow-hidden bg-night py-28 md:py-40">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_60%,rgba(253,185,19,0.08),transparent_60%)]" />
      <div className="relative mx-auto max-w-[1500px] px-4 text-center sm:px-8">
        <SplitReveal id="ring-title"
          as="h2"
          text="Hall of frames"
          accent={['frames']}
          className="font-display text-[clamp(3rem,8vw,6rem)] font-black uppercase leading-[0.85] tracking-[-0.02em]"
        />
        <Reveal delay={0.15}>
          <p className="mx-auto mt-5 max-w-[44ch] text-chalk">
            {threeD ? 'Drag to spin the stand.' : 'Scroll along the stand.'} Tap a frame to step inside it.
          </p>
        </Reveal>
      </div>

      {!threeD ? (
        // Flat strip used when 3D is off: same frames, no perspective.
        <div className="relative mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-6 sm:px-8 [scrollbar-width:thin]">
          {ring.map((p, i) => (
            <button
              key={p.src}
              type="button"
              onClick={() => setOpen(i)}
              aria-label={`Open photo: ${p.alt}`}
              className="relative shrink-0 snap-center overflow-hidden rounded-2xl border border-flood/15 bg-pitch transition-colors hover:border-gold"
              style={{ width: card, height: card * 1.35 }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.src} alt="" loading="lazy" decoding="async" draggable={false} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-night/70 via-transparent to-transparent" />
            </button>
          ))}
        </div>
      ) : (
      <div
        className="relative mx-auto mt-4 flex h-[min(62vh,560px)] touch-pan-y select-none items-center justify-center"
        style={{ perspective: 2400 }}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={() => (dragging.current = null)}
        data-cursor="Drag"
      >
        <motion.div style={{ rotateX: tilt, transformStyle: 'preserve-3d' }} className="relative">
          <motion.div style={{ rotateY: rotation, transformStyle: 'preserve-3d', width: card, height: card * 1.35 }} className="relative">
            {ring.map((p, i) => (
              <div
                key={p.src}
                data-index={i}
                role="button"
                tabIndex={0}
                aria-label={`Open photo: ${p.alt}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setOpen(i);
                  }
                }}
                className="absolute inset-0 overflow-hidden rounded-2xl border border-flood/15 bg-pitch shadow-[0_20px_50px_-20px_rgba(0,0,0,0.9)] [backface-visibility:hidden]"
                style={{ transform: `rotateY(${i * step}deg) translateZ(${radius}px)` }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.src} alt="" loading="lazy" decoding="async" draggable={false} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-night/70 via-transparent to-transparent" />
              </div>
            ))}
          </motion.div>
        </motion.div>
        {/* Pitch-light reflection beneath the ring. */}
        <div aria-hidden className="pointer-events-none absolute bottom-0 left-1/2 h-24 w-[70%] -translate-x-1/2 rounded-[50%] bg-gold/10 blur-3xl" />
      </div>
      )}

      <Lightbox photos={ring} index={open} onChange={setOpen} onClose={() => setOpen(null)} />
    </section>
  );
}
