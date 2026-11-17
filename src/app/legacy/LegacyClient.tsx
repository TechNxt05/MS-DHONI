'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useReducedMotion } from '@/lib/motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import PageHero from '@/components/layout/PageHero';
import { Reveal, SplitReveal, spotlightHandler } from '@/components/fx/primitives';
import { photo } from '@/lib/photos';
import { portrait } from '@/lib/people';
import { fanCollection, ownWords, tributes, type Tribute } from '@/lib/quotes';
import { cn } from '@/lib/utils';

const EXPO = [0.16, 1, 0.3, 1] as const;
const featured = [0, 1, 2, 3, 4];

function Face({ t, size }: { t: Tribute; size: 'lg' | 'sm' }) {
  const src = t.portrait ? portrait(t.portrait) : null;
  const box = size === 'lg' ? 'h-40 w-40 md:h-56 md:w-56' : 'h-14 w-14';
  if (!src) {
    const initials = t.author
      .split(' ')
      .map((w) => w[0])
      .join('')
      .slice(0, 2);
    return (
      <span aria-hidden className={cn('grid shrink-0 place-items-center rounded-full border border-gold/30 bg-pitch font-display font-black text-gold', box, size === 'lg' ? 'text-6xl' : 'text-xl')}>
        {initials}
      </span>
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt="" loading="lazy" decoding="async" className={cn('shrink-0 rounded-full border border-flood/15 object-cover grayscale-[20%]', box)} />;
}

function QuoteStage() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();
  const q = tributes[featured[i]];

  useEffect(() => {
    if (paused || reduce) return;
    const t = setTimeout(() => setI((n) => (n + 1) % featured.length), 7000);
    return () => clearTimeout(t);
  }, [i, paused, reduce]);

  return (
    <section
      aria-label="Featured quotes"
      className="relative overflow-hidden border-y border-flood/10 bg-pitch"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
    >
      <div className="mx-auto flex min-h-[70vh] max-w-[1300px] flex-col justify-center px-4 py-24 sm:px-8">
        <AnimatePresence mode="wait">
          <motion.figure key={q.text} initial="hide" animate="show" exit="out" className="relative grid items-center gap-10 md:grid-cols-[auto_1fr]">
            <motion.div
              variants={{
                hide: { opacity: 0, scale: 0.85, rotate: -6 },
                show: { opacity: 1, scale: 1, rotate: 0, transition: { duration: 0.9, ease: EXPO } },
                out: { opacity: 0, scale: 0.9, transition: { duration: 0.3 } },
              }}
            >
              <Face t={q} size="lg" />
            </motion.div>
            <div>
              <blockquote className="font-display text-[clamp(2rem,4.6vw,4.2rem)] font-black uppercase leading-[0.95]">
                {q.text.split(' ').map((w, k) => (
                  <span key={k} className="inline-block overflow-hidden align-bottom">
                    <motion.span
                      className="inline-block"
                      variants={{
                        hide: { y: '105%' },
                        show: { y: '0%', transition: { duration: 0.9, ease: EXPO, delay: k * 0.03 } },
                        out: { y: '-105%', transition: { duration: 0.4, ease: [0.7, 0, 0.84, 0], delay: k * 0.01 } },
                      }}
                    >
                      {w}&nbsp;
                    </motion.span>
                  </span>
                ))}
              </blockquote>
              <motion.figcaption
                className="mt-8"
                variants={{ hide: { opacity: 0, x: -10 }, show: { opacity: 1, x: 0, transition: { delay: 0.4 } }, out: { opacity: 0 } }}
              >
                <span className="block text-lg font-semibold text-gold">{q.author}</span>
                <span className="block text-sm text-dust">{q.role}</span>
              </motion.figcaption>
            </div>
          </motion.figure>
        </AnimatePresence>

        <div className="mt-12 flex gap-2" role="tablist" aria-label="Choose a featured quote">
          {featured.map((qi, k) => (
            <button key={qi} role="tab" aria-selected={k === i} aria-label={`Quote by ${tributes[qi].author}`} onClick={() => setI(k)} className="group relative h-11 w-14">
              <span className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 overflow-hidden rounded-full bg-flood/15">
                {k === i && (
                  <motion.span
                    className="block h-full origin-left bg-gold"
                    initial={{ scaleX: reduce ? 1 : 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: paused || reduce ? 0 : 7, ease: 'linear' }}
                  />
                )}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

const ownWordsPhotos = ['gaze-skyward', 'storm-sky', 'world-cup-final-six-2011', 'test-whites', 'csk-seven-floodlights', 'title-celebration', 'chase-mode', 'red-room-portrait', 'keeper-directs-field', 'star-india-portrait'];

export default function LegacyClient() {
  return (
    <main>
      <PageHero
        title="Legends on the legend"
        accent={['legend']}
        backdrop={photo('with-kohli')}
        position="50% 30%"
        intro="What the game has said about him, and what he has said back: with faces, moments and where each line is recorded."
      />
      <QuoteStage />

      {/* Words on him, with faces */}
      <section aria-labelledby="tributes-title" className="mx-auto max-w-[1500px] px-4 py-24 sm:px-8 md:py-32">
        <SplitReveal
          id="tributes-title"
          as="h2"
          text="Words on him"
          accent={['him']}
          className="font-display text-[clamp(3rem,8vw,6rem)] font-black uppercase leading-[0.85] tracking-[-0.02em]"
        />
        <ul className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {tributes.map((t, i) => (
            <li key={t.author}>
              <Reveal delay={(i % 3) * 0.06} className="h-full">
                <figure
                  onPointerMove={spotlightHandler}
                  className="spotlight group flex h-full flex-col rounded-[22px] border border-flood/10 bg-pitch p-7 transition-colors duration-500 hover:border-gold/40"
                >
                  <blockquote className={cn('flex-1 font-display font-bold uppercase leading-[1.02] text-flood', t.text.length < 60 ? 'text-3xl' : 'text-2xl')}>
                    “{t.text}”
                  </blockquote>
                  <figcaption className="mt-6 flex items-center gap-4">
                    <Face t={t} size="sm" />
                    <span>
                      <span className="block font-semibold text-gold">{t.author}</span>
                      <span className="block text-sm text-chalk">{t.role}</span>
                      <span className="block text-xs text-dust">{t.provenance}</span>
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      {/* In his own words */}
      <section aria-labelledby="own-title" className="border-y border-flood/10 bg-pitch py-24 md:py-32">
        <div className="mx-auto max-w-[1500px] px-4 sm:px-8">
          <SplitReveal
            id="own-title"
            as="h2"
            text="In his own words"
            accent={['own']}
            className="font-display text-[clamp(3rem,8vw,6rem)] font-black uppercase leading-[0.85] tracking-[-0.02em]"
          />
          <Reveal delay={0.1}>
            <p className="mt-5 max-w-[50ch] text-lg text-chalk">Few words, chosen carefully. Ten of the lines that stuck.</p>
          </Reveal>
          <ol className="mt-16 space-y-16 md:space-y-24">
            {ownWords.map((w, i) => {
              const p = photo(ownWordsPhotos[i % ownWordsPhotos.length]);
              return (
                <li key={w.text} className={cn('grid items-center gap-8 md:grid-cols-[1fr_1.5fr] md:gap-14', i % 2 && 'md:[&>*:first-child]:order-2')}>
                  <Reveal>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.src} alt={p.alt} loading="lazy" decoding="async" className="aspect-[4/3] w-full rounded-[28px] border border-flood/10 object-cover object-[50%_25%]" />
                  </Reveal>
                  <Reveal delay={0.1}>
                    <p className="tnum font-display text-xl font-bold uppercase tracking-[0.08em] text-gold">{w.when}</p>
                    <blockquote className="mt-3 font-display text-[clamp(1.9rem,3.6vw,3.2rem)] font-black uppercase leading-[0.95] text-flood">“{w.text}”</blockquote>
                    <p className="mt-5 max-w-[52ch] text-chalk">{w.context}</p>
                    <p className="mt-1 text-sm text-dust">{w.provenance}</p>
                  </Reveal>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* The rest of the original collection */}
      <section aria-labelledby="fans-title" className="mx-auto max-w-[1500px] px-4 py-24 sm:px-8 md:py-32">
        <SplitReveal
          id="fans-title"
          as="h2"
          text="From the fans’ collection"
          accent={['fans’']}
          className="font-display text-[clamp(2.6rem,6vw,4.6rem)] font-black uppercase leading-[0.85] tracking-[-0.02em]"
        />
        <Reveal delay={0.1}>
          <p className="mt-5 max-w-[60ch] text-chalk">
            Lines gathered for the original tribute. They circulate widely among fans, but we could not trace each one to a recorded source, so read them as fan lore.
          </p>
        </Reveal>
        <ul className="mt-12 columns-1 gap-4 md:columns-2 xl:columns-3">
          {fanCollection.map((q, i) => (
            <li key={q.author + i} className="mb-4 break-inside-avoid rounded-[18px] border border-flood/10 p-5">
              <p className="font-display text-xl font-bold uppercase leading-[1.05] text-chalk">“{q.text}”</p>
              <p className="mt-3 text-xs font-semibold uppercase tracking-[0.12em] text-dust">{q.author}</p>
            </li>
          ))}
        </ul>
        <p className="mt-10 text-sm text-dust">
          Portraits from Wikimedia Commons; photographers and licences are on the{' '}
          <Link href="/credits" className="text-blue underline">
            credits page
          </Link>
          .
        </p>
      </section>
    </main>
  );
}
