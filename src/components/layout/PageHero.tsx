'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useReducedMotion } from '@/lib/motion';
import { useRef, type ReactNode } from 'react';
import type { Photo } from '@/lib/photos';
import { SplitReveal } from '@/components/fx/primitives';

/** Shared header for inner pages: a graded backdrop photo, a giant title and a short intro. */
export default function PageHero({
  title,
  accent,
  intro,
  backdrop,
  position = 'center',
  children,
}: {
  title: string;
  accent?: string[];
  intro?: ReactNode;
  backdrop?: Photo;
  position?: string;
  children?: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const scale = useTransform(scrollYProgress, [0, 1], [1.05, 1.2]);

  return (
    <header ref={ref} className="relative isolate overflow-hidden bg-night">
      {backdrop && (
        <motion.div className="absolute inset-0 -z-10" style={reduce ? undefined : { y, scale }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={backdrop.src}
            alt=""
            fetchPriority="high"
            className="h-full w-full object-cover opacity-40 grayscale-[30%]"
            style={{ objectPosition: position }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-night via-night/70 to-night/30" />
        </motion.div>
      )}
      <div className="mx-auto max-w-[1500px] px-4 pb-16 pt-36 sm:px-8 md:pb-24 md:pt-48">
        <SplitReveal
          as="h1"
          text={title}
          accent={accent}
          stagger={0.08}
          className="max-w-[16ch] font-display text-[clamp(3.6rem,11vw,9rem)] font-black uppercase leading-[0.82] tracking-[-0.025em]"
        />
        {intro && (
          <motion.div
            className="mt-8 max-w-[56ch] text-lg leading-relaxed text-chalk md:text-xl"
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
          >
            {intro}
          </motion.div>
        )}
        {children}
      </div>
    </header>
  );
}
