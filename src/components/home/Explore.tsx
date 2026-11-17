'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { photo } from '@/lib/photos';
import { Reveal, SplitReveal, spotlightHandler, Tilt } from '@/components/fx/primitives';
import { cn } from '@/lib/utils';

const tiles = [
  { href: '/biography', title: 'The Biography', line: 'Ranchi, Kharagpur, the world.', img: 'portrait-2016', span: 'md:col-span-7 md:row-span-2', tall: true },
  { href: '/moments', title: 'Iconic Moments', line: 'The nights, and the captain’s calls, that wrote the legend.', img: 'world-cup-final-six-2011', span: 'md:col-span-5' },
  { href: '/legacy', title: 'Legends on the Legend', line: 'Faces, sources, and his own best lines.', img: 'with-kohli', span: 'md:col-span-5' },
  { href: '/fan-universe?tab=pressure', title: 'Pressure Mode', line: 'Twelve off six. Your call.', img: 'chase-mode', span: 'md:col-span-4' },
  { href: '/fan-universe?tab=captaincy', title: 'Captaincy Lab', line: 'Set the field like Mahi.', img: 'field-marshal', span: 'md:col-span-4' },
  { href: '/fan-universe?tab=fanmap', title: 'Fan Globe', line: 'Pin your city on the planet.', img: 'csk-walk-out', span: 'md:col-span-4' },
  { href: '/awards', title: 'Trophy Cabinet', line: 'Every title and honour, in one room.', img: 'champions-trophy-2013', span: 'md:col-span-6' },
  { href: '/fan-universe?tab=thala', title: 'Thala for a Reason', line: 'Everything leads back to 7.', img: 'seven-under-lights', span: 'md:col-span-6' },
] as const;

export default function Explore() {
  return (
    <section aria-labelledby="explore-title" className="bg-night py-28 md:py-40">
      <div className="mx-auto max-w-[1500px] px-4 sm:px-8">
        <SplitReveal id="explore-title"
          as="h2"
          text="Step into the stadium"
          accent={['stadium']}
          className="font-display text-[clamp(3rem,8vw,6rem)] font-black uppercase leading-[0.85] tracking-[-0.02em]"
        />

        <div className="mt-14 grid auto-rows-[minmax(220px,auto)] grid-cols-1 gap-4 md:grid-cols-12 md:gap-5">
          {tiles.map((t, i) => {
            const p = photo(t.img);
            return (
              <Reveal key={t.href} delay={(i % 3) * 0.08} className={cn(t.span)}>
                <Tilt max={5} className="h-full">
                  <Link
                    href={t.href}
                    onPointerMove={spotlightHandler}
                    data-cursor="Enter"
                    className="spotlight group relative flex h-full min-h-[240px] flex-col justify-end overflow-hidden rounded-[24px] border border-flood/10 bg-pitch p-6 md:p-8"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.src}
                      alt=""
                      loading="lazy" decoding="async"
                      className={cn(
                        'absolute inset-0 -z-10 h-full w-full object-cover opacity-50 grayscale-[40%] transition-all duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-105 group-hover:opacity-70 group-hover:grayscale-0',
                        p.h > p.w ? 'object-top' : 'object-center',
                      )}
                    />
                    <div className="absolute inset-0 -z-10 bg-gradient-to-t from-night via-night/60 to-transparent" />
                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <h3 className={cn('font-display font-black uppercase leading-[0.9]', 'tall' in t ? 'text-5xl md:text-7xl' : 'text-3xl md:text-4xl')}>{t.title}</h3>
                        <p className="mt-2 text-chalk">{t.line}</p>
                      </div>
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-flood/25 transition-all duration-500 group-hover:rotate-45 group-hover:border-gold group-hover:bg-gold group-hover:text-night">
                        <ArrowUpRight className="h-5 w-5" />
                      </span>
                    </div>
                  </Link>
                </Tilt>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
