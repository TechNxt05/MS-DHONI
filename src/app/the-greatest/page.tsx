import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import PageHero from '@/components/layout/PageHero';
import { Counter, Reveal, SplitReveal } from '@/components/fx/primitives';
import { photo } from '@/lib/photos';
import { captaincyByFormat, career, dayLink, finishing, g, keeping, records, trophies, worldCup2011 } from '@/lib/greatest';
import ChapterNav from './ChapterNav';

export const metadata: Metadata = {
  title: 'The Legend, The Greatest',
  description:
    'The headings of the fan deck, opened up: the champion, the wicketkeeper, the captain, the finisher, 2011, his career chapter by chapter, and the records.',
};

const chapters = [
  { id: 'champion', label: 'The champion' },
  { id: 'keeper', label: 'Best wicketkeeper' },
  { id: 'captain', label: 'Best captain' },
  { id: 'finisher', label: 'Best finisher' },
  { id: 'world-cup-2011', label: '2011 World Cup' },
  { id: 'career', label: 'His career' },
  { id: 'duo', label: 'Captain & vice-captain' },
  { id: 'bat', label: 'His bat' },
  { id: 'records', label: 'Records' },
];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const short = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
};

/* ------------------------------------------------------------------ shared pieces */

function Heading({ id, n, title, accent, kicker }: { id: string; n: number; title: string; accent: string[]; kicker?: string }) {
  return (
    <div className="grid gap-4 md:grid-cols-[auto_1fr] md:items-end md:gap-10">
      <span aria-hidden className="tnum text-outline font-display text-[clamp(4rem,10vw,8rem)] font-black leading-[0.8]">
        {String(n).padStart(2, '0')}
      </span>
      <div>
        <SplitReveal
          id={`${id}-title`}
          as="h2"
          text={title}
          accent={accent}
          className="font-display text-[clamp(2.8rem,7vw,5.6rem)] font-black uppercase leading-[0.85] tracking-[-0.02em]"
        />
        {kicker && (
          <Reveal delay={0.1}>
            <p className="mt-4 max-w-[58ch] text-lg text-chalk">{kicker}</p>
          </Reveal>
        )}
      </div>
    </div>
  );
}

/** The deck's own pictures for a heading, as a strip of small frames. */
function DeckStrip({ images, label }: { images: { src: string; alt: string }[]; label: string }) {
  return (
    <figure className="mt-10">
      <ul className="flex snap-x gap-3 overflow-x-auto pb-2 [scrollbar-width:thin]">
        {images.map((im, i) => (
          <li key={im.src} className="shrink-0 snap-start">
            <Reveal delay={i * 0.05}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={im.src} alt={im.alt} loading="lazy" decoding="async" className="h-44 w-auto min-w-24 rounded-2xl border border-flood/10 object-cover md:h-52" />
            </Reveal>
          </li>
        ))}
      </ul>
      <figcaption className="mt-2 text-sm text-dust">{label}</figcaption>
    </figure>
  );
}

function DayLink({ iso, children }: { iso: string; children?: React.ReactNode }) {
  return (
    <Link href={dayLink(iso)} className="inline-flex items-center gap-1 text-sm font-semibold text-blue transition-colors hover:text-gold">
      {children ?? short(iso)}
      <ArrowUpRight className="h-3.5 w-3.5" />
    </Link>
  );
}

function Stat({ value, label, sub }: { value: string; label: string; sub?: string }) {
  return (
    <div className="border-t border-flood/15 pt-4">
      <Counter value={value} className="tnum block font-display text-[clamp(3rem,6vw,5rem)] font-black leading-none text-gold" />
      <p className="mt-2 font-semibold text-flood">{label}</p>
      {sub && <p className="text-sm text-dust">{sub}</p>}
    </div>
  );
}

const section = 'mx-auto max-w-[1500px] scroll-mt-36 px-4 py-24 sm:px-8 md:py-32';

/* ------------------------------------------------------------------ page */

export default function TheGreatestPage() {
  const totalDismissals = keeping.catches + keeping.stumpings;

  return (
    <main>
      <PageHero
        title="The legend, the greatest"
        accent={['greatest']}
        backdrop={photo('title-celebration')}
        position="50% 30%"
        intro="The headings from the fan deck, each opened up: more facts from the scorecards, and the pictures collected under each one."
      />
      <ChapterNav items={chapters} />

      {/* 01 The champion */}
      <section id="champion" aria-labelledby="champion-title" className={section}>
        <Heading id="champion" n={1} title="The champion" accent={['champion']} kicker={`${trophies.length} titles and summits as captain or player, from Johannesburg 2007 to Ahmedabad 2023.`} />
        <div className="mt-14 grid gap-12 lg:grid-cols-[1fr_1.1fr]">
          <Reveal>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={g('csk-four-trophies')} width={1000} height={534} alt="Four IPL trophies, 2010, 2011, 2018 and 2021, lined up on stage at a Chennai Super Kings celebration" loading="lazy" decoding="async" className="w-full rounded-[28px] border border-flood/10" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={g('trophy-cabinet')} width={1000} height={989} alt="Dhoni in CSK yellow and India blue beside a cabinet of trophies" loading="lazy" decoding="async" className="mt-4 w-full rounded-[28px] border border-flood/10" />
          </Reveal>
          <ol className="divide-y divide-flood/10 border-y border-flood/10">
            {trophies.map((t, i) => (
              <li key={t.date}>
                <Reveal delay={Math.min(i, 8) * 0.03} className="grid grid-cols-[4.5rem_1fr] gap-4 py-4">
                  <span className="tnum font-display text-3xl font-black text-gold">{t.year}</span>
                  <div>
                    <p className="flex flex-wrap items-center gap-2">
                      <span className="font-display text-xl font-black uppercase leading-none">{t.title}</span>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${t.role === 'Captain' ? 'bg-gold/15 text-gold' : 'bg-flood/10 text-chalk'}`}>{t.role}</span>
                    </p>
                    <p className="mt-1 text-chalk">{t.detail}</p>
                    <DayLink iso={t.date} />
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
        <DeckStrip
          label="From the fan deck: with the World Cup at the Gateway of India, the Champions Trophy, Chennai’s silverware and the World Twenty20."
          images={[
            { src: g('wc-trophy-gateway'), alt: 'Dhoni with the World Cup at the Gateway of India' },
            { src: g('ct-trophy-blazer'), alt: 'Dhoni in an India blazer with the Champions Trophy' },
            { src: g('csk-trophies'), alt: 'Dhoni in CSK yellow with two trophies' },
            { src: g('wt20-trophy-white'), alt: 'Dhoni in a white suit with the World Twenty20 trophy' },
            { src: g('wt20-champagne'), alt: 'Dhoni sprayed with champagne holding the World Twenty20 trophy' },
          ]}
        />
      </section>

      {/* 02 Best wicketkeeper */}
      <section id="keeper" aria-labelledby="keeper-title" className={`${section} border-t border-flood/10`}>
        <Heading id="keeper" n={2} title="Best wicketkeeper" accent={['wicketkeeper']} kicker="Hands faster than the replay: the most stumpings in international cricket, and the first keeper to 100 in ODIs." />
        <div className="mt-14 grid gap-8 sm:grid-cols-3">
          <Stat value={totalDismissals.toLocaleString('en-IN')} label="International dismissals" sub="Tests, ODIs and T20Is" />
          <Stat value={String(keeping.catches)} label="Catches" />
          <Stat value={String(keeping.stumpings)} label="Stumpings" sub="The most by any keeper" />
        </div>
        <div className="mt-14 grid gap-12 lg:grid-cols-2">
          <div>
            <h3 className="font-display text-2xl font-black uppercase">By format</h3>
            <ul className="mt-4 space-y-4">
              {keeping.byFormat.map((f) => {
                const total = f.catches + f.stumpings;
                return (
                  <li key={f.format}>
                    <div className="flex justify-between text-sm">
                      <span className="font-semibold text-flood">{f.format}</span>
                      <span className="tnum text-chalk">
                        {f.catches} ct · {f.stumpings} st
                      </span>
                    </div>
                    <div className="mt-2 flex h-2 overflow-hidden rounded-full bg-flood/10" aria-hidden>
                      <div className="bg-flood/70" style={{ width: `${(f.catches / totalDismissals) * 100}%` }} />
                      <div className="bg-gold" style={{ width: `${(f.stumpings / totalDismissals) * 100}%` }} />
                    </div>
                    <span className="sr-only">{total} dismissals</span>
                  </li>
                );
              })}
            </ul>
            <p className="mt-6 text-chalk">
              In the IPL, across the {keeping.ipl.matches} matches in the scorecard archive, he took {keeping.ipl.catches} catches and made {keeping.ipl.stumpings} stumpings.
            </p>
          </div>
          <div>
            <h3 className="font-display text-2xl font-black uppercase">His busiest days behind the stumps</h3>
            <ol className="mt-4 divide-y divide-flood/10 border-y border-flood/10">
              {keeping.bestDays.map((d) => (
                <li key={d.date} className="flex items-baseline justify-between gap-4 py-3">
                  <span>
                    <span className="font-semibold text-flood">
                      {d.format} vs {d.opponent}
                    </span>
                    <span className="block text-sm text-dust">{d.venue}</span>
                  </span>
                  <span className="text-right">
                    <span className="tnum block font-display text-2xl font-black text-gold">{d.catches + d.stumpings}</span>
                    <DayLink iso={d.date} />
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
        <DeckStrip
          label="From the fan deck: stumpings in a blur, including the famous 0.08-second reaction."
          images={[
            { src: g('stumping-reaction'), alt: 'Split screen of a stumping with a reaction time of 0.08 seconds' },
            { src: g('stumping-quick'), alt: 'Dhoni whips the bails off' },
            { src: g('stumping-dive'), alt: 'A batter dives back as Dhoni breaks the stumps' },
            { src: g('stumping-nz'), alt: 'Dhoni stumps a New Zealand batter' },
            { src: photo('keeper-gloves-wide').src, alt: photo('keeper-gloves-wide').alt },
          ]}
        />
      </section>

      {/* 03 Best captain */}
      <section id="captain" aria-labelledby="captain-title" className={`${section} border-t border-flood/10`}>
        <Heading id="captain" n={3} title="Best captain" accent={['captain']} kicker="332 internationals in charge, more than anyone in the game’s history, and a habit of making the decision nobody else would." />
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {captaincyByFormat.map((c, i) => (
            <Reveal key={c.format} delay={i * 0.06} className="rounded-3xl border border-flood/10 bg-pitch p-6">
              <p className="font-display text-xl font-black uppercase text-chalk">{c.format}</p>
              <p className="tnum mt-2 font-display text-6xl font-black text-gold">{c.won}</p>
              <p className="text-flood">wins from {c.matches}</p>
              <div className="mt-4 flex h-2 overflow-hidden rounded-full bg-flood/10" aria-hidden>
                <div className="bg-gold" style={{ width: `${(c.won / c.matches) * 100}%` }} />
                <div className="bg-[#ff5a4f]/70" style={{ width: `${(c.lost / c.matches) * 100}%` }} />
              </div>
              <p className="tnum mt-3 text-sm text-dust">
                {c.lost} lost · {c.other}
              </p>
            </Reveal>
          ))}
        </div>
        <div className="mt-14 grid gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <h3 className="font-display text-2xl font-black uppercase">The calls</h3>
            <ul className="mt-4 divide-y divide-flood/10 border-y border-flood/10">
              {[
                { date: '2007-09-24', t: 'The last over to Joginder Sharma', d: 'Pakistan needed 13 in the World Twenty20 final; the rookie got the ball and India won by 5 runs.' },
                { date: '2011-04-02', t: 'Himself at No. 5', d: 'Above an in-form Yuvraj in the World Cup final, to take on Muralitharan. 91 not out.' },
                { date: '2013-06-23', t: 'The 18th over to Ishant', d: 'England needed 20 from 18. He brought Ishant Sharma back, Ishant took two wickets in two balls, and the Champions Trophy turned.' },
                { date: '2016-03-23', t: 'The glove off', d: 'One ball, two to win for Bangladesh. He took off a glove to be ready to run, and ran out Mustafizur.' },
              ].map((c) => (
                <li key={c.t} className="py-4">
                  <p className="font-display text-xl font-black uppercase">{c.t}</p>
                  <p className="mt-1 text-chalk">{c.d}</p>
                  <DayLink iso={c.date} />
                </li>
              ))}
            </ul>
            <Link href="/moments#captaincy" className="mt-5 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.12em] text-gold transition-colors hover:text-flood">
              All seven calls, in full
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
          <Reveal>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photo('keeper-directs-field').src} alt={photo('keeper-directs-field').alt} loading="lazy" decoding="async" className="aspect-[4/5] w-full rounded-[28px] border border-flood/10 object-cover object-top" />
          </Reveal>
        </div>
        <DeckStrip
          label="From the fan deck: the captain, behind the glasses and the gloves."
          images={[
            { src: g('captain-gloves'), alt: 'Dhoni in sunglasses and keeping gloves' },
            { src: g('captain-poster'), alt: 'Best Captain poster of Dhoni' },
          ]}
        />
      </section>

      {/* 04 Best finisher */}
      <section id="finisher" aria-labelledby="finisher-title" className={`${section} border-t border-flood/10`}>
        <Heading id="finisher" n={4} title="Best finisher" accent={['finisher']} kicker="Take it deep, then take it home. These figures are counted from the ball-by-ball scorecards." />
        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <Stat value={finishing.odiWonChases.average} label="Average in ODI chases India won" sub={`${finishing.odiWonChases.runs.toLocaleString('en-IN')} runs, ${finishing.odiWonChases.notOut} not out in ${finishing.odiWonChases.inns} innings`} />
          <Stat value={String(finishing.odiWonChases.notOut)} label="Times unbeaten at the end of a won chase" sub="ODIs" />
          <Stat value={String(finishing.winningHits)} label="Times he hit the winning runs" sub={finishing.byFormat.map((f) => `${f.count} ${f.format}`).join(' · ')} />
          <Stat value={String(finishing.withSix)} label="Finished with a six" sub="International and IPL" />
        </div>
        <div className="mt-14">
          <h3 className="font-display text-2xl font-black uppercase">Every chase he ended with a six</h3>
          <ol className="mt-4 grid gap-px overflow-hidden rounded-3xl border border-flood/10 bg-flood/10 sm:grid-cols-2 lg:grid-cols-3">
            {finishing.sixes.map((s) => (
              <li key={s.date} className="bg-night p-5">
                <p className="tnum font-display text-2xl font-black text-gold">{s.score}</p>
                <p className="font-semibold text-flood">
                  {s.format} · {s.team === 'India' ? '' : `${s.team} `}vs {s.opponent}
                </p>
                <DayLink iso={s.date} />
              </li>
            ))}
          </ol>
          <p className="mt-3 text-sm text-dust">The archive covers 331 of his 350 ODIs, so the real counts may be a little higher.</p>
        </div>
        <DeckStrip
          label="From the fan deck: the helicopter, in blue and in yellow."
          images={[
            { src: g('helicopter-pitch'), alt: 'Dhoni’s helicopter shot from behind the bowler' },
            { src: g('helicopter-csk'), alt: 'Dhoni plays the helicopter shot for Chennai' },
            { src: g('csk-big-hit'), alt: 'Dhoni hits big in CSK yellow' },
            { src: g('finisher-blue'), alt: 'Dhoni drives in India blue' },
            { src: g('spartan-swing'), alt: 'Dhoni swings a Spartan bat' },
            { src: g('wc-six-sequence'), alt: 'The 2011 World Cup winning six, in sequence' },
          ]}
        />
      </section>

      {/* 05 2011 World Cup */}
      <section id="world-cup-2011" aria-labelledby="world-cup-2011-title" className={`${section} border-t border-flood/10`}>
        <Heading id="world-cup-2011" n={5} title="2011 World Cup champion" accent={['champion']} kicker="Nine games, one tie, one defeat, and a final that ended 28 years of waiting." />
        <div className="mt-14 grid gap-12 lg:grid-cols-[1.1fr_1fr]">
          <ol className="divide-y divide-flood/10 border-y border-flood/10">
            {worldCup2011.map((m) => (
              <li key={m.date} className="grid grid-cols-[1fr_auto] items-baseline gap-4 py-3">
                <span>
                  <span className="font-semibold text-flood">
                    {m.stage && !/group/i.test(m.stage) ? `${m.stage}: ` : ''}vs {m.opponent}
                  </span>
                  <span className="block text-sm text-chalk">{m.result}</span>
                  <DayLink iso={m.date} />
                </span>
                <span className="tnum font-display text-3xl font-black text-gold">{m.score ?? 'DNB'}</span>
              </li>
            ))}
          </ol>
          <div className="grid grid-cols-2 gap-3 self-start">
            {[
              { src: g('wc-champions-banner'), alt: 'India celebrate under the World Champions banner' },
              { src: g('wc-trophy-huddle'), alt: 'Sachin Tendulkar and teammates with the World Cup' },
              { src: g('wc-flag'), alt: 'Sachin Tendulkar waves the Indian flag on a lap of honour' },
              { src: g('wc-sachin-trophy'), alt: 'Sachin Tendulkar with the World Cup at the Gateway of India' },
              { src: g('wc-final-swing'), alt: 'Dhoni swings during the final' },
              { src: g('wc-embrace'), alt: 'Dhoni and Yuvraj embrace after the winning hit' },
            ].map((im, i) => (
              <Reveal key={im.src} delay={i * 0.05}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={im.src} alt={im.alt} loading="lazy" decoding="async" className="aspect-[4/3] w-full rounded-2xl border border-flood/10 object-cover" />
              </Reveal>
            ))}
            <p className="col-span-2 text-sm text-dust">Pictures from the fan deck’s World Cup 2011 slides.</p>
          </div>
        </div>
      </section>

      {/* 06 His career */}
      <section id="career" aria-labelledby="career-title" className={`${section} border-t border-flood/10`}>
        <Heading id="career" n={6} title="His career" accent={['career']} kicker={`The deck told it in ${career.length} moments. Each one is checked against the scorecard and links to its day.`} />
        <ol className="mt-16 space-y-20 md:space-y-28">
          {career.map((c, i) => (
            <li key={c.date + c.heading} className={`grid items-center gap-8 md:grid-cols-2 md:gap-14 ${i % 2 ? 'md:[&>*:first-child]:order-2' : ''}`}>
              <Reveal>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={g(c.image)} alt="" loading="lazy" decoding="async" width={650} height={488} className="aspect-[4/3] w-full rounded-[28px] border border-flood/10 object-cover object-[50%_30%]" />
              </Reveal>
              <Reveal delay={0.1}>
                <p className="tnum font-display text-6xl font-black leading-none text-gold md:text-7xl">{c.date.slice(0, 4)}</p>
                <h3 className="mt-3 font-display text-[clamp(2rem,3.4vw,3rem)] font-black uppercase leading-[0.92]">{c.heading}</h3>
                <p className="mt-4 max-w-[52ch] text-lg leading-relaxed text-chalk">{c.body}</p>
                <div className="mt-3">
                  <DayLink iso={c.date}>{short(c.date)}</DayLink>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>

      {/* 07 Captain and vice-captain */}
      <section id="duo" aria-labelledby="duo-title" className={`${section} border-t border-flood/10`}>
        <Heading id="duo" n={7} title="Captain and vice-captain" accent={['vice-captain']} kicker="The deck called it the greatest captain and vice-captain duo: no insecurity, no jealousy, pure bond." />
        <div className="mt-14 grid gap-12 lg:grid-cols-[1fr_1.1fr]">
          <ul className="space-y-6 text-lg leading-relaxed text-chalk">
            <li>
              <span className="font-semibold text-flood">2008.</span> Virat Kohli made his ODI debut in Dambulla, in a side led by Dhoni.
            </li>
            <li>
              <span className="font-semibold text-flood">2011.</span> Both were in the XI that won the World Cup at Wankhede.
            </li>
            <li>
              <span className="font-semibold text-flood">2014.</span> When Dhoni retired from Tests mid-series in Australia, Kohli took the Test captaincy.
            </li>
            <li>
              <span className="font-semibold text-flood">2017.</span> Dhoni handed over the white-ball captaincy and played on under Kohli until the 2019 World Cup.
            </li>
            <li className="border-l-2 border-gold pl-5 font-display text-2xl font-black uppercase leading-tight text-flood">“He will always remain my captain.” — Virat Kohli</li>
          </ul>
          <div className="grid grid-cols-2 gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={g('duo-collage')} width={966} height={1000} alt="A collage of Dhoni and Kohli on the field together" loading="lazy" decoding="async" className="w-full rounded-2xl border border-flood/10" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={g('duo-years')} width={975} height={1000} alt="Dhoni and Kohli year by year, 2005 to 2020" loading="lazy" decoding="async" className="w-full rounded-2xl border border-flood/10" />
          </div>
        </div>
      </section>

      {/* 08 His bat */}
      <section id="bat" aria-labelledby="bat-title" className={`${section} border-t border-flood/10`}>
        <Heading id="bat" n={8} title="His bat, through the years" accent={['bat']} kicker="The fan deck tracked the stickers on his bat, World Cup by World Cup and season by season." />
        <div className="mt-14 grid items-center gap-12 lg:grid-cols-[1fr_1fr]">
          <Reveal>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={g('bat-stickers')} width={800} height={800} alt="Six photos of Dhoni’s bat: BAS in 2005, RBK in 2007, Reebok in 2009 and 2011, Spartan in 2015, SS in 2019" loading="lazy" decoding="async" className="w-full max-w-[560px] rounded-[28px] border border-flood/10" />
          </Reveal>
          <ol className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {[
              ['2005', 'BAS'],
              ['2007', 'RBK'],
              ['2009', 'Reebok'],
              ['2011', 'Reebok'],
              ['2015', 'Spartan'],
              ['2019', 'SS'],
            ].map(([y, b]) => (
              <li key={y} className="rounded-2xl border border-flood/10 bg-pitch p-5">
                <p className="tnum font-display text-3xl font-black text-gold">{y}</p>
                <p className="font-display text-2xl font-black uppercase">{b}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 09 Records */}
      <section id="records" aria-labelledby="records-title" className={`${section} border-t border-flood/10`}>
        <Heading id="records" n={9} title="Records are meant to be broken" accent={['broken']} kicker="The deck’s line, finished: the respect earned is forever. These are the ones still standing, or worth remembering." />
        <ul className="mt-14 grid gap-px overflow-hidden rounded-[28px] border border-flood/10 bg-flood/10 sm:grid-cols-2 lg:grid-cols-4">
          {records.map((r, i) => (
            <li key={r.label} className="bg-night p-6 md:p-8">
              <Reveal delay={(i % 4) * 0.05}>
                <p className="tnum font-display text-[clamp(2.8rem,4.6vw,4rem)] font-black leading-none text-gold">{r.value}</p>
                <p className="mt-3 font-semibold text-flood">{r.label}</p>
                <p className="mt-1 text-sm text-chalk">{r.note}</p>
              </Reveal>
            </li>
          ))}
        </ul>
        <p className="mt-10 text-sm text-dust">
          Pictures marked “from the fan deck” were collected for the 2022 tribute presentation and remain the property of their photographers. Match figures are computed from{' '}
          <a href="https://cricsheet.org/" target="_blank" rel="noreferrer" className="text-blue underline">
            Cricsheet
          </a>{' '}
          scorecards.{' '}
          <Link href="/fan-deck" className="text-blue underline">
            See the fan deck itself
          </Link>
          .
        </p>
      </section>
    </main>
  );
}
