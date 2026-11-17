'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import PageHero from '@/components/layout/PageHero';
import { Reveal, Tilt, SplitReveal } from '@/components/fx/primitives';
import { photo } from '@/lib/photos';

const crown = [
  { year: '2007', name: 'ICC World Twenty20', line: 'The inaugural edition, Johannesburg', img: photo('t20-trophy-2007'), date: '2007-09-24' },
  { year: '2011', name: 'ICC Cricket World Cup', line: 'A 28-year wait ended at Wankhede', img: photo('champions-2011'), date: '2011-04-02' },
  { year: '2013', name: 'ICC Champions Trophy', line: 'The treble, completed at Edgbaston', img: photo('champions-trophy-2013'), date: '2013-06-23' },
];

const dayHref = (iso: string) => `/on-this-day?d=${iso.slice(5)}`;

/** The whole shelf at a glance. */
const tally = [
  { n: 3, label: 'ICC trophies' },
  { n: 5, label: 'IPL titles' },
  { n: 2, label: 'Champions League T20s' },
  { n: 3, label: 'Asia Cups' },
  { n: 3, label: 'Series wins in Australia, Sri Lanka and the West Indies' },
];

type Item = { year: string; name: string; note: string; date?: string };

const cabinet: { group: string; items: Item[] }[] = [
  {
    group: 'India: Asia Cups & series',
    items: [
      { year: '2008', name: 'CB Series, Australia', note: 'Finals won 2–0 against the world champions, as captain', date: '2008-03-04' },
      { year: '2009', name: 'Compaq Cup, Sri Lanka', note: 'His 56 set up the final win in Colombo, as captain', date: '2009-09-14' },
      { year: '2010', name: 'Asia Cup', note: 'Beat Sri Lanka by 81 runs in Dambulla, as captain', date: '2010-06-24' },
      { year: '2013', name: 'West Indies Tri-Series', note: '45* and the last-over hitting against Sri Lanka, as captain', date: '2013-07-11' },
      { year: '2016', name: 'Asia Cup (T20)', note: '20* off 6 balls to close out the final in Mirpur, as captain', date: '2016-03-06' },
      { year: '2018', name: 'Asia Cup', note: 'Won under Rohit Sharma, as a player', date: '2018-09-28' },
    ],
  },
  {
    group: 'India: No. 1 in Tests',
    items: [
      { year: '2009', name: 'Top of the ICC Test rankings', note: 'For the first time, after the Brabourne win', date: '2009-12-06' },
      { year: '2010', name: 'ICC Test Championship mace', note: 'India No. 1 at the April cut-off' },
      { year: '2011', name: 'ICC Test Championship mace', note: 'No. 1 retained' },
    ],
  },
  {
    group: 'Chennai Super Kings',
    items: [
      { year: '2010', name: 'IPL champions', note: 'First title', date: '2010-04-25' },
      { year: '2010', name: 'Champions League T20', note: 'Winners in Johannesburg', date: '2010-09-26' },
      { year: '2011', name: 'IPL champions', note: 'Back to back', date: '2011-05-28' },
      { year: '2014', name: 'Champions League T20', note: 'Winners in Bengaluru', date: '2014-10-04' },
      { year: '2018', name: 'IPL champions', note: 'The comeback season', date: '2018-05-27' },
      { year: '2021', name: 'IPL champions', note: 'Fourth title', date: '2021-10-15' },
      { year: '2023', name: 'IPL champions', note: 'Fifth title', date: '2023-05-29' },
    ],
  },
  {
    group: 'National honours',
    items: [
      { year: '2008', name: 'Rajiv Gandhi Khel Ratna', note: 'India’s highest sporting honour (for 2007)' },
      { year: '2009', name: 'Padma Shri', note: 'Fourth-highest civilian award' },
      { year: '2011', name: 'Honorary Lieutenant Colonel', note: 'Parachute Regiment, Territorial Army' },
      { year: '2018', name: 'Padma Bhushan', note: 'Third-highest civilian award' },
    ],
  },
  {
    group: 'ICC honours',
    items: [
      { year: '2008', name: 'ICC ODI Player of the Year', note: 'First Indian to win it' },
      { year: '2009', name: 'ICC ODI Player of the Year', note: 'Won it again' },
      { year: '2009–14', name: 'Captain, ICC ODI Team of the Year', note: '2009, 2011, 2012, 2013, 2014' },
      { year: '2011', name: 'ICC Spirit of Cricket Award', note: 'For recalling Ian Bell at Trent Bridge' },
      { year: '2020', name: 'Captain, ICC ODI Team of the Decade', note: 'Also wicketkeeper' },
      { year: '2020', name: 'Captain, ICC T20I Team of the Decade', note: 'Also wicketkeeper' },
      { year: '2020', name: 'ICC Spirit of Cricket Award of the Decade', note: '2011–2020' },
      { year: '2025', name: 'ICC Hall of Fame', note: 'Inducted in London, the 11th Indian', date: '2025-06-09' },
    ],
  },
  {
    group: 'Match & series awards',
    items: [
      { year: '2005', name: 'Player of the Match', note: '148 vs Pakistan, Visakhapatnam' },
      { year: '2005', name: 'Player of the Match', note: '183* vs Sri Lanka, Jaipur' },
      { year: '2011', name: 'Player of the Match, World Cup final', note: '91* vs Sri Lanka, Mumbai' },
      { year: '2011', name: 'Player of the Series', note: 'ODIs vs England, India won 5–0' },
      { year: '2013', name: 'Player of the Match', note: '224 vs Australia, Chennai' },
      { year: '2019', name: 'Player of the Series', note: 'ODIs in Australia, India’s first bilateral ODI series win there' },
    ],
  },
  {
    group: 'Other recognition',
    items: [
      { year: '2006', name: 'MTV Youth Icon of the Year', note: '' },
      { year: '2011', name: 'Honorary doctorate', note: 'De Montfort University' },
      { year: '2013', name: 'LG People’s Choice Award', note: 'Fan voted' },
    ],
  },
];

export default function AwardsClient({ potm }: { potm: { format: string; count: number }[] }) {
  return (
    <main>
      <PageHero
        title="The trophy cabinet"
        accent={['trophy']}
        backdrop={photo('trophy-haul-art')}
        position="50% 30%"
        intro="Every title he won, as captain or player, and a shelf of honours from the nation and the game."
      />

      <section className="mx-auto max-w-[1500px] px-4 sm:px-8">
        <div className="grid gap-5 md:grid-cols-3">
          {crown.map((c, i) => (
            <Reveal key={c.name} delay={i * 0.1}>
              <Tilt max={8} className="h-full">
                <article className="relative flex aspect-[3/4] flex-col justify-end overflow-hidden rounded-[28px] border border-gold/25 bg-pitch p-7">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={c.img.src} alt={c.img.alt} loading="lazy" decoding="async" className="absolute inset-0 -z-0 h-full w-full object-cover object-top opacity-70" />
                  <div className="absolute inset-0 bg-gradient-to-t from-night via-night/50 to-transparent" />
                  <div className="relative" style={{ transform: 'translateZ(40px)' }}>
                    <p className="tnum font-display text-7xl font-black leading-none text-gold">{c.year}</p>
                    <h2 className="mt-3 font-display text-3xl font-black uppercase leading-none">{c.name}</h2>
                    <p className="mt-2 text-chalk">{c.line}</p>
                    <Link href={dayHref(c.date)} className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-gold transition-colors hover:text-flood">
                      Relive the final
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </div>
                </article>
              </Tilt>
            </Reveal>
          ))}
        </div>
        <ul className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-[28px] border border-flood/10 bg-flood/10 md:grid-cols-5">
          {tally.map((t, i) => (
            <li key={t.label} className="bg-night p-6">
              <Reveal delay={i * 0.05}>
                <p className="tnum font-display text-6xl font-black leading-none text-gold">{t.n}</p>
                <p className="mt-2 text-chalk">{t.label}</p>
              </Reveal>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-chalk">
          Player of the Match {potm.reduce((n, p) => n + p.count, 0)} times in the scorecard archive:{' '}
          {potm.map((p) => `${p.count} in ${p.format === 'Test' ? 'Tests' : p.format === 'IPL' ? 'the IPL' : p.format + 's'}`).join(', ')}.
        </p>
      </section>

      <section className="mx-auto max-w-[1500px] px-4 py-24 sm:px-8 md:py-32">
        {cabinet.map((shelf) => (
          <div key={shelf.group} className="grid gap-6 border-t border-flood/10 py-12 lg:grid-cols-[22rem_1fr]">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <SplitReveal as="h2" text={shelf.group} className="font-display text-4xl font-black uppercase leading-none md:text-5xl" />
              <p className="tnum mt-2 text-sm uppercase tracking-[0.16em] text-dust">{shelf.items.length} entries</p>
            </div>
            <ul className="divide-y divide-flood/10">
              {shelf.items.map((it, i) => (
                <li key={it.name + it.year + it.note}>
                  <Reveal delay={i * 0.03} className="group grid grid-cols-[5.5rem_1fr] gap-4 py-5 md:grid-cols-[7rem_1fr]">
                    <span className="tnum font-display text-2xl font-black text-dust transition-colors group-hover:text-gold">{it.year}</span>
                    <div>
                      <p className="text-lg font-semibold text-flood">{it.name}</p>
                      {it.note && <p className="text-chalk">{it.note}</p>}
                      {it.date && (
                        <Link href={dayHref(it.date)} className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-blue transition-colors hover:text-gold">
                          On this day
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </Link>
                      )}
                    </div>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </main>
  );
}
