'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Pause, Play, Volume2, VolumeX } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { clips } from '@/lib/dhoni';
import { Reveal, SplitReveal } from '@/components/fx/primitives';
import { cn } from '@/lib/utils';

export default function HighlightReel() {
  const [active, setActive] = useState(0);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const video = useRef<HTMLVideoElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const inView = useRef(false);
  const clip = clips[active];

  // Autoplay (muted) only while the player is on screen, and never under reduced motion.
  useEffect(() => {
    const el = frame.current;
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const io = new IntersectionObserver(
      ([entry]) => {
        inView.current = entry.isIntersecting;
        const v = video.current;
        if (!v) return;
        if (entry.isIntersecting && !reduce) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.45 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    setProgress(0);
    v.load();
    if (inView.current) v.play().catch(() => {});
  }, [active]);

  const toggle = () => {
    const v = video.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  };

  return (
    <section id="reel" aria-labelledby="reel-title" className="relative bg-pitch py-28 md:py-40">
      <div className="mx-auto max-w-[1500px] px-4 sm:px-8">
        <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
          <SplitReveal id="reel-title"
            as="h2"
            text="Finishes in full"
            accent={['full']}
            className="font-display text-[clamp(3rem,8vw,6rem)] font-black uppercase leading-[0.85] tracking-[-0.02em]"
          />
          <Reveal delay={0.2}>
            <p className="max-w-[34ch] text-chalk md:text-right">Six reels. Sound on for the commentary; it earns it.</p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-[1.7fr_1fr]">
          <Reveal>
            <div ref={frame} className="group relative aspect-video overflow-hidden rounded-[28px] border border-flood/10 bg-night" data-cursor={playing ? 'Pause' : 'Play'}>
              <video
                ref={video}
                className="h-full w-full cursor-pointer object-cover"
                poster={`/reel/${clip.slug}.webp`}
                muted={muted}
                playsInline
                loop
                preload="none"
                onClick={toggle}
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
                onTimeUpdate={(e) => {
                  const v = e.currentTarget;
                  if (v.duration) setProgress(v.currentTime / v.duration);
                }}
              >
                <source src={`/reel/${clip.slug}.mp4`} type="video/mp4" />
              </video>

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-night/90 via-transparent to-transparent" />

              <AnimatePresence mode="wait">
                <motion.div
                  key={clip.slug}
                  className="pointer-events-none absolute bottom-0 left-0 p-5 md:p-8"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  <p className="font-display text-4xl font-black uppercase leading-none md:text-6xl">{clip.title}</p>
                  <p className="mt-2 max-w-[44ch] text-sm text-chalk md:text-base">{clip.blurb}</p>
                </motion.div>
              </AnimatePresence>

              <div className="absolute right-4 top-4 flex gap-2">
                <button
                  type="button"
                  onClick={toggle}
                  aria-label={playing ? 'Pause video' : 'Play video'}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-night/70 text-flood backdrop-blur-md transition-colors hover:bg-gold hover:text-night"
                >
                  {playing ? <Pause className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 fill-current" />}
                </button>
                <button
                  type="button"
                  onClick={() => setMuted((m) => !m)}
                  aria-label={muted ? 'Turn sound on' : 'Mute'}
                  aria-pressed={!muted}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-night/70 text-flood backdrop-blur-md transition-colors hover:bg-gold hover:text-night"
                >
                  {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </button>
              </div>

              <div className="absolute inset-x-0 bottom-0 h-[3px] bg-flood/10">
                <div className="h-full origin-left bg-gold" style={{ transform: `scaleX(${progress})` }} />
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1" aria-label="Choose a highlight reel">
              {clips.map((c, i) => (
                <li key={c.slug}>
                  <button
                    type="button"
                    onClick={() => setActive(i)}
                    aria-current={i === active}
                    className={cn(
                      'group flex w-full items-center gap-4 rounded-2xl border p-2.5 text-left transition-colors duration-300',
                      i === active ? 'border-gold/60 bg-gold/[0.08]' : 'border-flood/10 hover:border-flood/30 hover:bg-flood/[0.03]',
                    )}
                  >
                    <span className="relative aspect-video w-28 shrink-0 overflow-hidden rounded-xl bg-night">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={`/reel/${c.slug}.webp`} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      {i === active && playing && (
                        <span className="absolute inset-0 flex items-end justify-center gap-[3px] bg-night/40 pb-2">
                          {[0, 1, 2].map((b) => (
                            <motion.span
                              key={b}
                              className="w-[3px] rounded-full bg-gold"
                              animate={{ height: [6, 16, 8, 14, 6] }}
                              transition={{ duration: 1, repeat: Infinity, delay: b * 0.15 }}
                            />
                          ))}
                        </span>
                      )}
                    </span>
                    <span>
                      <span className={cn('block font-display text-xl font-black uppercase leading-none', i === active ? 'text-gold' : 'text-flood')}>{c.title}</span>
                      <span className="mt-1 block text-sm text-dust">{c.blurb}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
