'use client';

import { AnimatePresence, motion, useInView, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { useReducedMotion } from '@/lib/motion';
import { Pause, Play, Search } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import Lightbox from '@/components/fx/Lightbox';
import { Reveal, SplitReveal, VelocityMarquee } from '@/components/fx/primitives';
import type { Photo } from '@/lib/photos';

const EXPO = [0.16, 1, 0.3, 1] as const;

const slide = (n: number, alt: string): Photo => ({
  src: `/fan-deck/slides/slide-${String(n).padStart(3, '0')}.webp`,
  alt: `Fan deck, slide ${n}: ${alt}`,
  tag: 'art',
  w: 800,
  h: 450,
});

const slides: Photo[] = [
  slide(1, 'Dynamic Hero Of Nation India'),
  slide(2, 'The legend, the greatest'),
  slide(3, 'The champion, with every trophy'),
  slide(5, 'Best captain'),
  slide(7, '2011 World Cup champion'),
  slide(8, 'Fact file: born 7 July 1981, jersey No. 7'),
  slide(9, 'His career in numbers'),
  slide(13, 'T20 glory in 2007'),
  slide(16, 'Champions Trophy 2013'),
  slide(23, 'Bikes, cars and fans'),
  slide(24, 'Fan portraits'),
  slide(28, 'The Dhoni Touch'),
  slide(29, 'CSK buses and the home of a Dhoni fan'),
  slide(30, 'A wall of Dhoni'),
  slide(32, 'Search for a replacement'),
  slide(33, 'Number seven'),
  slide(36, 'His bat stickers through the years'),
  slide(40, 'Birthday wishes from the world'),
  slide(42, 'Best player'),
  slide(43, 'The DHONI acronym, again'),
  slide(49, 'Records are meant to be broken'),
  slide(50, 'Dhonism'),
  slide(52, '17 years of Dhonism'),
  slide(53, 'The legacy of my favourite cricketer'),
  slide(77, 'Mr 360 and Mr Cool'),
  slide(102, 'Thala, crowned'),
  slide(105, 'With the silverware'),
  slide(106, 'With the World Cup at the Taj'),
  slide(107, 'With the IPL trophy'),
  slide(109, 'MS Dhoni in yellow'),
  slide(113, 'Trending Dhoni'),
  slide(117, 'Lifting the trophies'),
  slide(144, 'The trophy cabinet'),
  slide(147, 'Happy birthday, Mahendra Singh Dhoni'),
  slide(153, 'World Cup 2011'),
  slide(158, 'Dhoni takes India home'),
  slide(159, 'The only captain to win all ICC trophies'),
  slide(165, 'MSD! MSD! MSD!'),
];

const acronym = [
  { letter: 'D', word: 'ynamic' },
  { letter: 'H', word: 'ero' },
  { letter: 'O', word: 'f' },
  { letter: 'N', word: 'ation' },
  { letter: 'I', word: 'ndia' },
];

const searches = [
  { legend: 'Sachin Tendulkar', heir: 'Virat Kohli' },
  { legend: 'Rahul Dravid', heir: 'Cheteshwar Pujara' },
  { legend: 'Virender Sehwag', heir: 'Rohit Sharma' },
  { legend: 'Zaheer Khan', heir: 'Jasprit Bumrah' },
  { legend: 'MS Dhoni', heir: null },
];

const ownWords = [
  {
    when: 'World Twenty20 final, 2007',
    context: 'Harbhajan had been taken apart by Misbah. Pakistan needed 13 from the last over, and the ball went to Joginder Sharma.',
    quote: 'He chose, he said afterwards, someone who really wanted to do well in international cricket over a bowler short of confidence.',
    reported: true,
  },
  {
    when: 'World Cup final, 2011',
    context: 'Promoting himself to No. 5, ahead of an in-form Yuvraj Singh, chasing 275.',
    quote: '“…God helps those who help themselves. I said God is not coming to save us.”',
  },
  {
    when: 'Whitewashed in England and Australia, 2011–12',
    context: 'Asked which 4–0 hurt more.',
    quote: '“You die, you die. You don’t see which is the better way to die.”',
  },
  {
    when: 'On the Decision Review System',
    context: 'Never a fan of technology that was not foolproof, even as he became its master.',
    quote: '“If I am going to buy a life jacket which does not come with a warranty, that’s a bit of a hassle… I would prefer some kind of warranty for it.”',
    source: 'as quoted by Sportskeeda',
  },
];

const chants = ['MSD! MSD! MSD!', 'Mahi! Mahi!', 'Captain Cool', 'Mahi way', 'Dhoni! Dhoni!', 'MSDians forever', 'Thala for a reason'];

export default function FanDeckClient() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <main>
      <header className="relative isolate overflow-hidden bg-night">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_70%_10%,rgba(253,185,19,0.14),transparent_55%)]" />
        <div className="mx-auto max-w-[1500px] px-4 pb-10 pt-36 sm:px-8 md:pt-48">
          <SplitReveal
            as="h1"
            text="The fan deck"
            accent={['fan']}
            stagger={0.08}
            className="font-display text-[clamp(3.6rem,11vw,9rem)] font-black uppercase leading-[0.82] tracking-[-0.025em]"
          />
          <Reveal delay={0.4}>
            <p className="mt-8 max-w-[56ch] text-lg leading-relaxed text-chalk md:text-xl">
              167 slides, made in 2022 by the fan who built this site, titled <span className="text-flood">“God of cricket: my favourite”</span>. Here is
              the best of it, rebuilt for the floodlights. Every heading in it is opened up on{' '}
              <Link href="/the-greatest" className="text-gold underline underline-offset-4 hover:text-flood">The Legend, The Greatest</Link>.
            </p>
          </Reveal>
        </div>
      </header>

      <Acronym />
      <Film />
      <Replacement />

      {/* In his own words */}
      <section aria-labelledby="words-title" className="mx-auto max-w-[1500px] px-4 py-28 sm:px-8 md:py-40">
        <SplitReveal id="words-title"
          as="h2"
          text="In his own words"
          accent={['own']}
          className="font-display text-[clamp(3rem,8vw,6rem)] font-black uppercase leading-[0.85] tracking-[-0.02em]"
        />
        <ol className="mt-14 grid gap-px overflow-hidden rounded-[28px] border border-flood/10 bg-flood/10 md:grid-cols-2">
          {ownWords.map((w, i) => (
            <li key={w.when} className="bg-night p-7 md:p-10">
              <Reveal delay={(i % 2) * 0.08}>
                <p className="tnum font-display text-lg font-bold uppercase tracking-[0.08em] text-gold">{w.when}</p>
                <p className="mt-3 text-chalk">{w.context}</p>
                <blockquote className={`mt-6 font-display font-black uppercase leading-[0.98] text-flood ${w.reported ? 'text-[clamp(1.5rem,2.4vw,2rem)]' : 'text-[clamp(1.8rem,3vw,2.6rem)]'}`}>
                  {w.quote}
                </blockquote>
                {w.source && <p className="mt-4 text-sm text-dust">{w.source}</p>}
              </Reveal>
            </li>
          ))}
        </ol>
      </section>

      {/* The slides themselves, drifting past. */}
      <section aria-labelledby="slides-title" className="border-y border-flood/10 bg-pitch py-24 md:py-32">
        <div className="mx-auto mb-12 grid max-w-[1500px] gap-4 px-4 sm:px-8 md:grid-cols-[1fr_auto] md:items-end">
          <SplitReveal id="slides-title"
            as="h2"
            text="The original slides"
            accent={['original']}
            className="font-display text-[clamp(2.8rem,7vw,5.4rem)] font-black uppercase leading-[0.85] tracking-[-0.02em]"
          />
          <Reveal delay={0.15}>
            <p className="max-w-[36ch] text-chalk md:text-right">38 of the 167, exactly as made. Tap one to see it full size.</p>
          </Reveal>
        </div>
        {[0, 1].map((row) => (
          <VelocityMarquee
            key={row}
            baseVelocity={row ? 1.6 : -1.6}
            className={row ? 'mt-4' : ''}
            items={slides
              .map((s, i) => ({ s, i }))
              .filter(({ i }) => i % 2 === row)
              .map(({ s, i }) => (
                <button
                  key={s.src}
                  type="button"
                  onClick={() => setOpen(i)}
                  aria-label={`Open ${s.alt}`}
                  className="mx-2 block w-[min(70vw,380px)] overflow-hidden rounded-2xl border border-flood/10 transition-transform duration-500 hover:scale-[1.03] focus-visible:scale-[1.03]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={s.src} alt="" loading="lazy" decoding="async" width={800} height={450} className="aspect-video w-full object-cover" />
                </button>
              ))}
          />
        ))}
        <Lightbox photos={slides} index={open} onChange={setOpen} onClose={() => setOpen(null)} />
      </section>

      {/* Chants and the last word. */}
      <section aria-labelledby="thanks-title" className="overflow-hidden py-28 md:py-40">
        <VelocityMarquee
          baseVelocity={-3}
          items={chants.map((c) => (
            <span key={c} className="mx-6 font-display text-[clamp(2.6rem,7vw,6rem)] font-black uppercase leading-none text-outline">
              {c}
              <span className="ml-12 text-gold">·</span>
            </span>
          ))}
        />
        <div className="mx-auto mt-20 max-w-[1100px] px-4 text-center sm:px-8">
          <Reveal>
            <p className="font-display text-[clamp(1.6rem,3.4vw,2.6rem)] font-black uppercase leading-[1] text-chalk">
              Honi ko unhoni karde, unhoni ko honi.
              <br />
              <span className="text-flood">Aise hai apne Thala.</span>
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-10 text-lg text-chalk">Records are meant to be broken. The respect earned is forever.</p>
          </Reveal>
          <SplitReveal id="thanks-title"
            as="h2"
            text="Thank you, Dhoni"
            accent={['Dhoni']}
            className="mt-6 font-display text-[clamp(3.4rem,10vw,8.5rem)] font-black uppercase leading-[0.85] tracking-[-0.02em]"
          />
        </div>
      </section>
    </main>
  );
}

/** D·H·O·N·I: each letter grows its word as the section scrolls past. */
function Acronym() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });

  return (
    <section ref={ref} aria-label="Dynamic Hero Of Nation India" className={reduce ? 'py-20' : 'relative h-[260vh]'}>
      <div className={reduce ? '' : 'sticky top-0 flex h-screen items-center overflow-hidden'}>
        <ul className="mx-auto w-full max-w-[1500px] px-4 sm:px-8">
          {acronym.map((a, i) => (
            <AcronymLine key={a.letter} {...a} index={i} progress={scrollYProgress} reduce={!!reduce} />
          ))}
        </ul>
      </div>
    </section>
  );
}

function AcronymLine({ letter, word, index, progress, reduce }: { letter: string; word: string; index: number; progress: MotionValue<number>; reduce: boolean }) {
  const start = 0.08 + index * 0.15;
  const clip = useTransform(progress, [start, start + 0.14], ['inset(0 100% 0 0)', 'inset(0 0% 0 0)']);
  const x = useTransform(progress, [start, start + 0.14], ['-0.15em', '0em']);
  const dim = useTransform(progress, [start - 0.04, start + 0.04], [0.25, 1]);
  return (
    <li className="flex items-baseline font-display text-[clamp(3rem,min(13vh,17vw),9.5rem)] font-black uppercase leading-[0.86] tracking-[-0.02em]">
      <motion.span className="text-gold" style={reduce ? undefined : { opacity: dim }}>
        {letter}
      </motion.span>
      <motion.span className="text-flood" style={reduce ? undefined : { clipPath: clip, x }}>
        {word}
      </motion.span>
    </li>
  );
}

/** The deck as a film, rendered from PowerPoint with its own transitions. */
function Film() {
  const video = useRef<HTMLVideoElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const inView = useInView(box, { amount: 0.5 });
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    if (!inView && !v.paused) v.pause();
  }, [inView]);

  const toggle = () => {
    const v = video.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  };

  return (
    <section aria-labelledby="film-title" className="mx-auto max-w-[1500px] px-4 pb-10 sm:px-8">
      <div className="mb-8 grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
        <SplitReveal id="film-title"
          as="h2"
          text="The deck, as a film"
          accent={['film']}
          className="font-display text-[clamp(2.8rem,7vw,5.4rem)] font-black uppercase leading-[0.85] tracking-[-0.02em]"
        />
        <Reveal delay={0.15}>
          <p className="max-w-[38ch] text-chalk md:text-right">35 slides in two and a half minutes, rendered with the deck’s own transitions. No sound.</p>
        </Reveal>
      </div>
      <Reveal>
        <div ref={box} className="group relative overflow-hidden rounded-[28px] border border-flood/10 bg-pitch">
          <video
            ref={video}
            src="/fan-deck/highlights.mp4"
            poster="/fan-deck/poster.webp"
            muted
            playsInline
            preload="none"
            controls={playing}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            className="aspect-video w-full bg-night"
            aria-label="Fan deck highlights, a silent slideshow of 35 slides"
          />
          <AnimatePresence>
            {!playing && (
              <motion.button
                type="button"
                onClick={toggle}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 grid place-items-center bg-night/30 transition-colors hover:bg-night/10"
                aria-label="Play the fan deck film"
              >
                <span className="grid h-24 w-24 place-items-center rounded-full bg-gold text-night shadow-[0_12px_40px_-12px_rgba(253,185,19,0.7)] transition-transform duration-500 group-hover:scale-110">
                  <Play className="ml-1 h-9 w-9 fill-current" />
                </span>
              </motion.button>
            )}
          </AnimatePresence>
          {playing && (
            <button
              type="button"
              onClick={toggle}
              className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-night/70 text-flood backdrop-blur transition-colors hover:text-gold"
              aria-label="Pause"
            >
              <Pause className="h-5 w-5 fill-current" />
            </button>
          )}
        </div>
      </Reveal>
    </section>
  );
}

type Phase = 'idle' | 'running' | 'done';

/** "Search for a replacement": every legend has an heir, except one. */
function Replacement() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { amount: 0.4, once: true });
  const [run, setRun] = useState(0);
  const [shown, setShown] = useState(0);
  const phase: Phase = run === 0 ? 'idle' : shown < searches.length + 1 ? 'running' : 'done';

  // Start the first search when the section arrives; each run reveals one row at a time.
  useEffect(() => {
    if (inView && run === 0) {
      const t = setTimeout(() => setRun(1), 300);
      return () => clearTimeout(t);
    }
  }, [inView, run]);

  useEffect(() => {
    if (run === 0 || shown > searches.length) return;
    const last = shown === searches.length; // the spinner holds before the verdict
    const t = setTimeout(() => setShown((s) => s + 1), reduce ? 60 : last ? 2200 : 650);
    return () => clearTimeout(t);
  }, [run, shown, reduce]);

  const restart = () => {
    setShown(0);
    setRun((r) => r + 1);
  };

  return (
    <section ref={ref} aria-labelledby="replace-title" className="mx-auto max-w-[1500px] px-4 py-28 sm:px-8 md:py-40">
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div>
          <SplitReveal id="replace-title"
            as="h2"
            text="Search for a replacement"
            accent={['replacement']}
            className="font-display text-[clamp(2.8rem,7vw,5.4rem)] font-black uppercase leading-[0.85] tracking-[-0.02em]"
          />
          <Reveal delay={0.15}>
            <p className="mt-5 max-w-[38ch] text-chalk">Every great Indian cricketer has had an heir. The search engine tried them all.</p>
          </Reveal>
          <button
            type="button"
            onClick={restart}
            disabled={phase === 'running'}
            className="mt-8 inline-flex items-center gap-3 rounded-full border border-flood/25 px-6 py-3 text-sm font-bold uppercase tracking-[0.12em] text-flood transition-colors hover:border-gold hover:text-gold disabled:opacity-40"
          >
            <Search className="h-4 w-4" />
            {phase === 'running' ? 'Searching…' : 'Search again'}
          </button>
        </div>

        <ol className="divide-y divide-flood/10 border-y border-flood/10" aria-live="polite">
          {searches.map((s, i) => {
            const visible = i < shown;
            const searching = s.heir === null && i === shown - 1 && shown === searches.length;
            return (
              <li key={s.legend} className="grid min-h-[5.5rem] grid-cols-[1fr_auto_1fr] items-center gap-4 py-4">
                <span className={`font-display text-[clamp(1.4rem,2.6vw,2.2rem)] font-black uppercase leading-none ${s.heir ? 'text-chalk' : 'text-gold'}`}>{s.legend}</span>
                <span aria-hidden className="text-dust">→</span>
                <span className="min-w-0 text-right">
                  <AnimatePresence mode="wait">
                    {!visible ? (
                      <motion.span key="wait" className="inline-block h-3 w-24 rounded-full bg-flood/[0.06]" />
                    ) : s.heir ? (
                      <motion.span
                        key={`heir-${run}`}
                        className="font-display text-[clamp(1.4rem,2.6vw,2.2rem)] font-black uppercase leading-none text-flood"
                        initial={reduce ? false : { opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, ease: EXPO }}
                      >
                        {s.heir}
                      </motion.span>
                    ) : searching ? (
                      <motion.span key={`searching-${run}`} className="inline-flex items-center gap-3 text-chalk" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-gold border-t-transparent motion-reduce:animate-none" />
                        Searching 8 billion people
                      </motion.span>
                    ) : (
                      <motion.span
                        key={`fail-${run}`}
                        className="block font-display font-black uppercase leading-[0.95]"
                        initial={reduce ? false : { opacity: 0, scale: 1.3, filter: 'blur(8px)' }}
                        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                        transition={{ duration: 0.6, ease: EXPO }}
                      >
                        <span className="block text-[clamp(1.4rem,2.6vw,2.2rem)] text-[#ff5a4f]">Error 404</span>
                        <span className="block text-sm tracking-[0.08em] text-chalk">No match found. All search engines failed.</span>
                      </motion.span>
                    )}
                  </AnimatePresence>
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
