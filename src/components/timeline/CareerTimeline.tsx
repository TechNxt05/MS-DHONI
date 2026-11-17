'use client';

import { motion, useScroll, useSpring, useTransform, type MotionValue } from 'framer-motion';
import { useReducedMotion } from '@/lib/motion';
import { useEffect, useRef, useState } from 'react';
import { milestones, type Milestone } from '@/lib/dhoni';
import { SplitReveal, Reveal } from '@/components/fx/primitives';

function useIsDesktop() {
  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 900px)');
    const update = () => setDesktop(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return desktop;
}

export default function CareerTimeline() {
  const desktop = useIsDesktop();
  const reduce = useReducedMotion();
  const pinned = desktop && !reduce;

  return (
    <section id="journey" aria-labelledby="journey-title" className="relative bg-night">
      <div className="mx-auto max-w-[1500px] px-4 pt-28 sm:px-8 md:pt-40">
        <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
          <SplitReveal id="journey-title"
            as="h2"
            text="Ticket collector to trophy collector"
            accent={['trophy']}
            className="font-display text-[clamp(3rem,8vw,6rem)] font-black uppercase leading-[0.85] tracking-[-0.02em]"
          />
          <Reveal delay={0.2}>
            <p className="max-w-[36ch] text-chalk md:text-right">
              Sixteen years at the top, told in ten nights. {pinned ? 'Keep scrolling; the season moves sideways.' : ''}
            </p>
          </Reveal>
        </div>
      </div>
      {pinned ? <PinnedTrack /> : <StackedList />}
    </section>
  );
}

function PinnedTrack() {
  const ref = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  const x = useTransform(smooth, [0, 1], [0, -distance]);
  const bar = useTransform(smooth, [0, 1], [0, 1]);

  useEffect(() => {
    const measure = () => {
      if (!track.current) return;
      setDistance(track.current.scrollWidth - window.innerWidth);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  return (
    <div ref={ref} style={{ height: `calc(100vh + ${distance}px)` }} className="relative">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <motion.div ref={track} style={{ x }} className="flex w-max gap-10 px-8 will-change-transform">
          {milestones.map((m, i) => (
            <Panel key={m.year + m.title} m={m} index={i} progress={smooth} />
          ))}
          <div className="w-[10vw] shrink-0" />
        </motion.div>

        {/* Season progress: one tick per milestone. */}
        <div className="mx-8 mt-10 flex items-center gap-4">
          <div className="relative h-px flex-1 bg-flood/15">
            <motion.div className="absolute inset-y-0 left-0 w-full origin-left bg-gold" style={{ scaleX: bar }} />
          </div>
          <span className="tnum font-display text-sm font-bold uppercase tracking-[0.2em] text-dust">
            2004 — 2023
          </span>
        </div>
      </div>
    </div>
  );
}

function Panel({ m, index, progress }: { m: Milestone; index: number; progress: MotionValue<number> }) {
  const n = milestones.length;
  const center = index / (n - 1);
  // The photograph drifts against the track for depth.
  const imgX = useTransform(progress, [center - 0.5, center + 0.5], ['12%', '-12%']);
  const tall = m.photo.h > m.photo.w;

  return (
    <article className="group relative grid h-[68vh] w-[min(78vw,1080px)] shrink-0 grid-cols-[1.15fr_1fr] overflow-hidden rounded-[28px] border border-flood/10 bg-pitch">
      <div className="relative overflow-hidden">
        <motion.div className="absolute inset-[-8%]" style={{ x: imgX }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={m.photo.src}
            alt={m.photo.alt}
            width={m.photo.w}
            height={m.photo.h}
            loading="lazy" decoding="async"
            className={`h-full w-full object-cover transition-transform duration-[1.4s] ease-[var(--ease-out-expo)] group-hover:scale-105 ${tall ? 'object-[50%_28%]' : 'object-center'}`}
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-pitch" />
      </div>
      <div className="relative flex flex-col justify-between p-8 lg:p-12">
        <span aria-hidden className="text-outline pointer-events-none absolute -right-4 -top-6 font-display text-[11rem] font-black leading-none lg:text-[14rem]">
          {m.year.slice(2)}
        </span>
        <span className="tnum relative font-display text-3xl font-bold text-gold">{m.year}</span>
        <div className="relative">
          <h3 className="font-display text-[clamp(2.2rem,3.6vw,3.6rem)] font-black uppercase leading-[0.9]">{m.title}</h3>
          <p className="mt-5 max-w-[40ch] text-base leading-relaxed text-chalk lg:text-lg">{m.detail}</p>
        </div>
      </div>
    </article>
  );
}

function StackedList() {
  return (
    <ol className="mx-auto mt-12 max-w-[1500px] space-y-6 px-4 pb-10 sm:px-8">
      {milestones.map((m) => (
        <li key={m.year + m.title}>
          <Reveal>
            <article className="overflow-hidden rounded-3xl border border-flood/10 bg-pitch">
              <div className="relative aspect-[16/10] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={m.photo.src} alt={m.photo.alt} width={m.photo.w} height={m.photo.h} loading="lazy" decoding="async" className="h-full w-full object-cover object-top" />
                <div className="absolute inset-0 bg-gradient-to-t from-pitch via-pitch/10 to-transparent" />
                <span className="tnum absolute bottom-3 left-5 font-display text-5xl font-black text-gold">{m.year}</span>
              </div>
              <div className="p-5 pt-3">
                <h3 className="font-display text-3xl font-black uppercase leading-none">{m.title}</h3>
                <p className="mt-3 leading-relaxed text-chalk">{m.detail}</p>
              </div>
            </article>
          </Reveal>
        </li>
      ))}
    </ol>
  );
}
