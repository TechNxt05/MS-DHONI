'use client';

import dynamic from 'next/dynamic';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useReducedMotion } from '@/lib/motion';
import { useThreeD } from '@/lib/three-pref';
import { ArrowDown, Play } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Magnetic } from '@/components/fx/primitives';
import { scrollToTarget } from '@/components/fx/SmoothScroll';
import { photo } from '@/lib/photos';

const BallScene = dynamic(() => import('@/components/three/BallScene'), {
  ssr: false,
  loading: () => <StaticBall />,
});

/** Shown while WebGL loads, and the whole time under reduced motion. */
function StaticBall() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div
        className="aspect-square w-[34%] rounded-full"
        style={{
          background:
            'radial-gradient(circle at 34% 30%, #e0464a 0%, #9c1519 38%, #4d0709 75%, #240305 100%)',
          boxShadow: 'inset -0.08em -0.1em 0.3em rgba(0,0,0,0.6), 0 0.2em 0.6em rgba(253,185,19,0.18)',
        }}
      />
    </div>
  );
}

const EXPO = [0.16, 1, 0.3, 1] as const;
const backdrop = photo('field-marshal');

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const threeD = useThreeD();
  // Load the 3D ball once the browser is idle after first paint; the static ball stands in until then.
  const [idle, setIdle] = useState(false);
  useEffect(() => {
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number; cancelIdleCallback?: (id: number) => void };
    if (w.requestIdleCallback) {
      const id = w.requestIdleCallback(() => setIdle(true), { timeout: 1500 });
      return () => w.cancelIdleCallback?.(id);
    }
    const t = setTimeout(() => setIdle(true), 300);
    return () => clearTimeout(t);
  }, []);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.08, 1.25]);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '-35%']);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const letter = (ch: string, i: number) => (
    <span key={i} className="inline-block overflow-hidden align-bottom">
      <motion.span
        className="inline-block"
        initial={reduce ? false : { y: '105%' }}
        animate={{ y: '0%' }}
        transition={{ duration: 1.3, ease: EXPO, delay: 0.35 + i * 0.07 }}
      >
        {ch}
      </motion.span>
    </span>
  );

  return (
    <section ref={ref} className="relative isolate flex min-h-[100svh] items-end overflow-hidden bg-night" aria-labelledby="hero-title">
      {/* Backdrop photograph, graded down to a night sky. */}
      <motion.div className="absolute inset-0 -z-20" style={{ y: reduce ? 0 : bgY, scale: reduce ? 1 : bgScale }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={backdrop.src}
          alt=""
          width={backdrop.w}
          height={backdrop.h}
          fetchPriority="high"
          className="h-full w-full object-cover object-[70%_30%] opacity-45 grayscale-[35%]"
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_20%,transparent_0%,rgba(6,7,10,0.55)_45%,var(--color-night)_85%)]" />
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-night via-night/80 to-transparent" />
      </motion.div>

      {/* Floodlight beams from the two towers. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div
          className="absolute -left-[10%] -top-[30%] h-[140%] w-[45%] origin-top-left animate-beam bg-[conic-gradient(from_200deg_at_0%_0%,transparent_0deg,rgba(255,226,168,0.16)_14deg,transparent_30deg)] blur-2xl"
          style={{ ['--beam-from' as string]: '-6deg', ['--beam-to' as string]: '5deg' }}
        />
        <div
          className="absolute -right-[10%] -top-[30%] h-[140%] w-[45%] origin-top-right animate-beam bg-[conic-gradient(from_130deg_at_100%_0%,transparent_0deg,rgba(255,240,210,0.12)_16deg,transparent_32deg)] blur-2xl [animation-delay:-4s]"
          style={{ ['--beam-from' as string]: '5deg', ['--beam-to' as string]: '-6deg' }}
        />
      </div>

      <motion.div
        className="relative mx-auto w-full max-w-[1500px] px-4 pb-14 pt-32 sm:px-8 md:pb-20"
        style={{ y: reduce ? 0 : textY, opacity: fade }}
      >
        <h1 id="hero-title" className="font-display uppercase leading-[0.8]">
          <motion.span
            className="block text-[clamp(1.6rem,4.4vw,3.6rem)] font-bold tracking-[0.02em] text-chalk"
            initial={reduce ? false : { opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: EXPO, delay: 0.2 }}
          >
            Mahendra Singh
          </motion.span>
          <span className="sr-only">Dhoni</span>
          <span aria-hidden className="flex items-end text-[clamp(6rem,27vw,25rem)] font-black tracking-[-0.03em] text-flood">
            {letter('D', 0)}
            {letter('H', 1)}
            {/* The O is a cricket ball, rendered live. */}
            <span className="relative inline-block h-[0.74em] w-[0.7em] self-center">
              <motion.span
                className="absolute left-1/2 top-1/2 block h-[260%] w-[260%] -translate-x-1/2 -translate-y-1/2"
                // Opacity only: R3F measures this box, and a CSS scale would freeze the canvas at the wrong size.
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.2, delay: 0.6 }}
              >
                {reduce || !idle || !threeD ? <StaticBall /> : <BallScene progress={scrollYProgress} className="absolute inset-0" />}
              </motion.span>
            </span>
            {letter('N', 3)}
            {letter('I', 4)}
          </span>
        </h1>

        <div className="mt-8 grid items-end gap-8 md:mt-10 md:grid-cols-[1.1fr_1fr]">
          <motion.p
            className="max-w-[46ch] text-lg leading-relaxed text-chalk md:text-xl"
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EXPO, delay: 1.1 }}
          >
            A ticket collector from Ranchi who became the calmest man in the loudest stadiums on earth.
            <span className="text-flood"> Three ICC trophies. Five IPL titles. One unhurried heartbeat.</span>
          </motion.p>

          <motion.div
            className="flex flex-wrap items-center gap-4 md:justify-end"
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EXPO, delay: 1.25 }}
          >
            <Magnetic>
              <button
                type="button"
                onClick={() => scrollToTarget('#journey')}
                className="group inline-flex items-center gap-3 rounded-full bg-gold px-7 py-4 text-sm font-bold uppercase tracking-[0.12em] text-night shadow-[0_12px_40px_-12px_rgba(253,185,19,0.7)] transition-colors hover:bg-flood"
              >
                Begin the journey
                <ArrowDown className="h-4 w-4 transition-transform duration-500 group-hover:translate-y-1" />
              </button>
            </Magnetic>
            <Magnetic>
              <button
                type="button"
                onClick={() => scrollToTarget('#reel')}
                className="group inline-flex items-center gap-3 rounded-full border border-flood/25 px-6 py-4 text-sm font-bold uppercase tracking-[0.12em] text-flood transition-colors hover:border-gold hover:text-gold"
              >
                <Play className="h-4 w-4 fill-current" />
                Watch the finishes
              </button>
            </Magnetic>
          </motion.div>
        </div>

        {/* A broadcast caption from the night it all came together. */}
        <motion.div
          className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-flood/10 pt-5 text-xs uppercase tracking-[0.18em] text-dust md:mt-16"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 1.6 }}
        >
          <span className="inline-flex items-center gap-2 text-gold">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
            </span>
            Wankhede · 2 April 2011
          </span>
          <span className="tnum text-chalk">IND 277/4 (48.2)</span>
          <span className="tnum text-chalk">Dhoni 91* (79)</span>
          <span className="hidden sm:inline">India win by 6 wickets</span>
        </motion.div>
      </motion.div>
    </section>
  );
}
