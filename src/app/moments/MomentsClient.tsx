'use client';

import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import PageHero from '@/components/layout/PageHero';
import { Reveal, SplitReveal } from '@/components/fx/primitives';
import { photo } from '@/lib/photos';

/** Decisions only a captain could make: the situation, the call, and what followed. */
const calls = [
  {
    date: '2007-09-14',
    title: 'The bowl-out',
    situation: 'The World Twenty20 group game against Pakistan in Durban ended in a tie, and cricket’s first bowl-out decided it.',
    call: 'He sent Virender Sehwag, Harbhajan Singh and Robin Uthappa, and crouched right behind the stumps to give them a target.',
    result: 'India hit three out of three. Pakistan missed all three.',
    photo: photo('keeper-gloves-close'),
  },
  {
    date: '2007-09-24',
    title: 'Joginder’s over',
    situation: 'World Twenty20 final, Johannesburg. Pakistan needed 13 off the last over with Misbah-ul-Haq set.',
    call: 'Not Harbhajan, who had been hit hard, but the inexperienced Joginder Sharma.',
    result: 'Misbah scooped to Sreesanth at short fine leg. India won by 5 runs.',
    photo: photo('t20-trophy-2007'),
  },
  {
    date: '2011-04-02',
    title: 'Himself at No. 5',
    situation: 'World Cup final, Wankhede. India 114 for 3 chasing 275, against an attack built around Muttiah Muralitharan.',
    call: 'He walked in ahead of Yuvraj Singh, the player of the tournament, to take on the spinners himself.',
    result: '91 not out, finished with a six. India’s first World Cup in 28 years.',
    photo: photo('world-cup-final-six-2011'),
  },
  {
    date: '2011-07-31',
    title: 'Calling Ian Bell back',
    situation: 'Trent Bridge Test. Bell, on 137, wandered off for tea thinking the ball had gone for four, and was run out on appeal.',
    call: 'During the interval, Dhoni and his team withdrew the appeal.',
    result: 'Bell resumed after tea. The ICC gave Dhoni its Spirit of Cricket award for 2011.',
    photo: photo('test-whites'),
  },
  {
    date: '2013-06-23',
    title: 'The 18th over to Ishant',
    situation: 'Champions Trophy final at Edgbaston, cut to 20 overs a side. England needed 20 off 18 balls.',
    call: 'He brought Ishant Sharma back.',
    result: 'Ishant took Eoin Morgan and Ravi Bopara with consecutive balls. India won by 5 runs.',
    photo: photo('champions-trophy-2013'),
  },
  {
    date: '2016-03-23',
    title: 'The glove off',
    situation: 'World Twenty20, Bengaluru. Bangladesh needed two off the last ball.',
    call: 'He took off a glove before the delivery, so he could run and throw if the batters set off.',
    result: 'They ran; he sprinted to the stumps and ran out Mustafizur Rahman. India won by one run.',
    photo: photo('keeper-gloves-wide'),
  },
  {
    date: '2018-05-27',
    title: 'Backing “Dad’s Army”',
    situation: 'Chennai returned from a two-year suspension with a squad mocked for its age.',
    call: 'He trusted the veterans: Shane Watson and Ambati Rayudu at the top, experience everywhere else.',
    result: 'Watson made 117 not out in the final, and Chennai won their third title.',
    photo: photo('csk-launch'),
  },
];

const moments = [
  { year: '2005', title: '183* in Jaipur', detail: 'Chasing 299 against Sri Lanka, he finished unbeaten on 183: a wicketkeeper’s ODI record that still stands.', photo: photo('sahara-power-hit') },
  { year: '2006', title: 'World No. 1', detail: 'Little more than a year after debut, he went top of the ICC ODI batting rankings.', photo: photo('sahara-salute') },
  { year: '2007', title: 'The first World T20', detail: 'A young side, no favourites tag, and a last-over gamble on Joginder Sharma in Johannesburg.', photo: photo('t20-trophy-2007') },
  { year: '2011', title: 'Wankhede, 91*', detail: 'Promoted himself in the final and finished it with the most replayed six in Indian sport.', photo: photo('world-cup-final-six-2011') },
  { year: '2011', title: 'Recalling Ian Bell', detail: 'Bell was run out at Trent Bridge while wandering off for tea. Dhoni withdrew the appeal; the ICC gave him its Spirit of Cricket award.', photo: photo('keeper-gloves-close') },
  { year: '2013', title: 'The treble', detail: 'Champions Trophy at Edgbaston. Every ICC white-ball trophy, one captain.', photo: photo('champions-trophy-2013') },
  { year: '2016', title: 'One glove off, one ball left', detail: 'Bangladesh needed two off the last ball in Bengaluru. Dhoni took off a glove, sprinted, and ran Mustafizur out himself.', photo: photo('keeper-gloves-wide') },
  { year: '2018', title: 'The comeback season', detail: 'Chennai returned from a two-year ban and won the title anyway. Third IPL crown.', photo: photo('csk-launch') },
  { year: '2023', title: 'Five', detail: 'A rain-stretched final in Ahmedabad, a last-ball Jadeja boundary, and a fifth IPL title.', photo: photo('csk-seven-floodlights') },
];

export default function MomentsClient() {
  const [hover, setHover] = useState<number | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 250, damping: 28, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 250, damping: 28, mass: 0.5 });

  return (
    <main>
      <PageHero
        title="Iconic moments"
        accent={['moments']}
        backdrop={photo('high-follow-through')}
        position="50% 25%"
        intro="The innings, decisions and finishes that built the legend. Hover a moment to see it."
      />

      <section
        className="relative mx-auto max-w-[1500px] px-4 pb-28 sm:px-8"
        onPointerMove={(e) => {
          x.set(e.clientX);
          y.set(e.clientY);
        }}
      >
        <ol className="border-t border-flood/10">
          {moments.map((m, i) => (
            <li key={m.title} onPointerEnter={(e) => e.pointerType === 'mouse' && setHover(i)} onPointerLeave={() => setHover(null)}>
              <Reveal delay={0.03 * i}>
                <article className="group grid gap-4 border-b border-flood/10 py-8 md:grid-cols-[8rem_1fr_minmax(0,36ch)] md:items-baseline md:gap-10 md:py-10">
                  <span className="tnum font-display text-3xl font-black text-dust transition-colors duration-500 group-hover:text-gold">{m.year}</span>
                  <h2 className="font-display text-[clamp(2.4rem,6vw,5.2rem)] font-black uppercase leading-[0.88] transition-transform duration-700 ease-[var(--ease-out-expo)] md:group-hover:translate-x-4">
                    {m.title}
                  </h2>
                  <p className="text-chalk">{m.detail}</p>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={m.photo.src} alt={m.photo.alt} loading="lazy" decoding="async" className="aspect-[16/10] w-full rounded-2xl object-cover object-top md:hidden" />
                </article>
              </Reveal>
            </li>
          ))}
        </ol>

        {/* Cursor-following preview (desktop). */}
        <motion.div
          aria-hidden
          className="pointer-events-none fixed left-0 top-0 z-40 hidden md:block"
          style={{ x: sx, y: sy }}
        >
          <AnimatePresence>
            {hover !== null && (
              <motion.div
                key={hover}
                className="-translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl shadow-[0_30px_60px_-20px_rgba(0,0,0,0.9)]"
                initial={{ opacity: 0, scale: 0.7, rotate: -6 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.85, rotate: 4 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={moments[hover].photo.src} alt="" className="h-[300px] w-[240px] object-cover object-top" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </section>

      <section id="captaincy" aria-labelledby="captaincy-title" className="scroll-mt-24 border-t border-flood/10 py-24 md:py-32">
        <div className="mx-auto max-w-[1500px] px-4 sm:px-8">
          <SplitReveal
            id="captaincy-title"
            as="h2"
            text="Captaincy masterclass"
            accent={['masterclass']}
            className="font-display text-[clamp(3rem,8vw,6rem)] font-black uppercase leading-[0.85] tracking-[-0.02em]"
          />
          <Reveal delay={0.1}>
            <p className="mt-5 max-w-[52ch] text-lg text-chalk">Seven calls only a captain could make: the situation, the decision, and what happened next.</p>
          </Reveal>
          <ol className="mt-14 grid gap-5 lg:grid-cols-2">
            {calls.map((c, i) => (
              <li key={c.date}>
                <Reveal delay={(i % 2) * 0.08} className="h-full">
                  <article className="group grid h-full overflow-hidden rounded-[26px] border border-flood/10 bg-pitch sm:grid-cols-[38%_1fr]">
                    <div className="relative min-h-48 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={c.photo.src} alt={c.photo.alt} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-105" />
                      <span className="tnum absolute left-4 top-4 rounded-full bg-night/75 px-3 py-1 font-display text-lg font-black text-gold backdrop-blur">{c.date.slice(0, 4)}</span>
                    </div>
                    <div className="p-6 md:p-7">
                      <h3 className="font-display text-3xl font-black uppercase leading-none">{c.title}</h3>
                      <dl className="mt-4 space-y-3 text-chalk">
                        <div>
                          <dt className="text-xs font-bold uppercase tracking-[0.14em] text-dust">The situation</dt>
                          <dd>{c.situation}</dd>
                        </div>
                        <div>
                          <dt className="text-xs font-bold uppercase tracking-[0.14em] text-gold">The call</dt>
                          <dd className="text-flood">{c.call}</dd>
                        </div>
                        <div>
                          <dt className="text-xs font-bold uppercase tracking-[0.14em] text-dust">What happened</dt>
                          <dd>{c.result}</dd>
                        </div>
                      </dl>
                      <Link href={`/on-this-day?d=${c.date.slice(5)}`} className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-blue transition-colors hover:text-gold">
                        On this day
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </article>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-t border-flood/10 bg-pitch py-24 md:py-32">
        <div className="mx-auto grid max-w-[1500px] gap-10 px-4 sm:px-8 md:grid-cols-3">
          {[
            ['Big-match aura', 'When the stakes rose, his heart rate didn’t.'],
            ['Clock control', 'He rarely rushed. He took chases deep because he trusted the arithmetic.'],
            ['Finisher DNA', 'Calculated acceleration in the last overs became the template for a generation.'],
          ].map(([t, d], i) => (
            <Reveal key={t} delay={i * 0.1}>
              <h3 className="font-display text-4xl font-black uppercase leading-none text-gold">{t}</h3>
              <p className="mt-3 max-w-[34ch] text-chalk">{d}</p>
            </Reveal>
          ))}
        </div>
      </section>
    </main>
  );
}
