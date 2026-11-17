'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useReducedMotion } from '@/lib/motion';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import PageHero from '@/components/layout/PageHero';
import SubscribeBox from '@/components/home/SubscribeBox';
import { Reveal } from '@/components/fx/primitives';
import type { DayEvent, DaySummary } from '@/lib/onThisDay';
import { photo } from '@/lib/photos';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const EXPO = [0.16, 1, 0.3, 1] as const;

const FILTERS = [
  { id: 'a', label: 'Everything' },
  { id: 'i', label: 'India' },
  { id: 'c', label: 'Chennai' },
  { id: 'b', label: 'Big nights' },
  { id: 'l', label: 'Life & honours' },
] as const;
type FilterId = (typeof FILTERS)[number]['id'];

const KIND_LABEL: Record<string, string> = {
  match: 'Match',
  'test-day': 'Test match day',
  life: 'Life',
  career: 'Career',
  honour: 'Honour',
  service: 'Army',
  culture: 'Culture',
};

const ALL_DAYS = MONTHS.map((_, m) => {
  const n = new Date(Date.UTC(2024, m + 1, 0)).getUTCDate();
  return Array.from({ length: n }, (_, d) => `${String(m + 1).padStart(2, '0')}-${String(d + 1).padStart(2, '0')}`);
});
const FLAT = ALL_DAYS.flat();

const label = (key: string) => {
  const [m, d] = key.split('-').map(Number);
  return `${d} ${MONTHS[m - 1]}`;
};

export default function CalendarClient({
  calendar,
  coverage,
  initialDay,
  today,
}: {
  calendar: Record<string, DaySummary>;
  coverage: { days: number; total: number; matches: number };
  /** Chosen on the server from ?d= or today's date in India, so the first paint is complete. */
  initialDay: string;
  today: string;
}) {
  const reduce = useReducedMotion();
  const [selected, setSelected] = useState(initialDay);
  const [filter, setFilter] = useState<FilterId>('a');
  const [details, setDetails] = useState<{ key: string; events: DayEvent[] } | null>(null);

  const max = useMemo(() => Math.max(1, ...Object.values(calendar).map((d) => d[filter])), [calendar, filter]);
  const matchingDays = useMemo(() => FLAT.filter((k) => (calendar[k]?.[filter] ?? 0) > 0).length, [calendar, filter]);

  // Fetch the full story for the chosen day. Results land asynchronously, keyed by day.
  useEffect(() => {
    let alive = true;
    fetch(`/api/on-this-day?d=${selected}&limit=12`)
      .then((r) => r.json())
      .then((p) => alive && p.success && setDetails({ key: selected, events: p.data.events }))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [selected]);

  const choose = (k: string) => {
    setSelected(k);
    window.history.replaceState(null, '', `?d=${k}`);
    if (window.innerWidth < 1024) document.getElementById('day-detail')?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  };
  const step = (dir: 1 | -1) => {
    const i = FLAT.indexOf(selected);
    for (let n = 1; n <= FLAT.length; n++) {
      const k = FLAT[(i + dir * n + FLAT.length) % FLAT.length];
      if ((calendar[k]?.[filter] ?? 0) > 0) return choose(k);
    }
  };

  const loading = details?.key !== selected;
  const events = details?.key === selected ? details.events : [];
  const summary = calendar[selected];

  return (
    <main>
      <PageHero
        title="Every day is a Dhoni day"
        accent={['Dhoni']}
        backdrop={photo('seven-under-lights')}
        position="50% 30%"
        intro={
          <>
            {coverage.days} of the {coverage.total} days in the calendar carry a memory: {coverage.matches} matches from the scorecards, plus the
            debuts, honours and family days in between. Pick a date.
          </>
        }
      />

      <section aria-label="Calendar of memories" className="mx-auto max-w-[1500px] px-4 pb-28 sm:px-8">
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Show">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              aria-pressed={filter === f.id}
              onClick={() => setFilter(f.id)}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                filter === f.id ? 'border-gold bg-gold text-night' : 'border-flood/20 text-flood hover:border-gold hover:text-gold'
              }`}
            >
              {f.label}
            </button>
          ))}
          <span className="tnum ml-auto text-sm text-dust" aria-live="polite">
            {matchingDays} days lit
          </span>
        </div>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
          {/* The year, one cell per day, lit by how much happened on it. */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 xl:grid-cols-4">
            {ALL_DAYS.map((days, m) => (
              <Reveal key={MONTHS[m]} delay={(m % 4) * 0.04}>
                <h2 className="mb-2 font-display text-lg font-black uppercase tracking-wide text-chalk">{MONTHS[m]}</h2>
                <ol className="grid grid-cols-7 gap-1">
                  {days.map((k) => {
                    const s = calendar[k];
                    const n = s?.[filter] ?? 0;
                    const glow = n ? 0.22 + 0.78 * Math.min(1, n / max) : 0;
                    const isSel = k === selected;
                    return (
                      <li key={k}>
                        <button
                          type="button"
                          onClick={() => choose(k)}
                          aria-pressed={isSel}
                          aria-label={`${label(k)}: ${n ? `${n} ${n === 1 ? 'memory' : 'memories'}${s ? `, including ${s.top}` : ''}` : 'no memories'}`}
                          title={s && n ? `${label(k)} · ${s.top} (${s.year})` : label(k)}
                          className={`tnum relative grid aspect-square w-full place-items-center rounded-[6px] text-[0.65rem] font-semibold transition-transform duration-200 hover:scale-110 ${
                            isSel ? 'z-[1] scale-110 ring-2 ring-flood ring-offset-2 ring-offset-night' : ''
                          } ${k === today && !isSel ? 'ring-1 ring-blue' : ''} ${n ? 'text-night' : 'text-dust/60'}`}
                          style={{ background: n ? `rgba(253,185,19,${glow})` : 'rgba(244,239,227,0.04)' }}
                        >
                          {Number(k.slice(3))}
                        </button>
                      </li>
                    );
                  })}
                </ol>
              </Reveal>
            ))}
          </div>

          {/* The chosen day. */}
          <div id="day-detail" className="scroll-mt-24 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:self-start lg:overflow-y-auto lg:pr-2">
            <div className="flex items-end justify-between gap-4">
              <div>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.h2
                    key={selected}
                    className="font-display text-[clamp(2.6rem,5vw,4.2rem)] font-black uppercase leading-[0.85] text-gold"
                    initial={reduce ? false : { opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduce ? undefined : { opacity: 0, y: -12 }}
                    transition={{ duration: 0.4, ease: EXPO }}
                  >
                    {label(selected)}
                  </motion.h2>
                </AnimatePresence>
                <p className="mt-2 text-chalk">
                  {summary ? `${summary.a} ${summary.a === 1 ? 'memory' : 'memories'}` : 'No recorded memory on this date.'}
                  {selected === today && <span className="text-blue"> · Today</span>}
                </p>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => step(-1)} aria-label="Previous lit day" className="grid h-11 w-11 place-items-center rounded-full border border-flood/20 text-flood transition-colors hover:border-gold hover:text-gold">
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <button type="button" onClick={() => step(1)} aria-label="Next lit day" className="grid h-11 w-11 place-items-center rounded-full border border-flood/20 text-flood transition-colors hover:border-gold hover:text-gold">
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="mt-6" aria-busy={loading} aria-live="polite">
              {loading && summary ? (
                <div className="space-y-3">
                  <div className="aspect-[16/9] animate-pulse rounded-3xl bg-flood/[0.04]" />
                  <div className="h-24 animate-pulse rounded-2xl bg-flood/[0.04]" />
                </div>
              ) : events.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-flood/15 p-8">
                  <p className="font-display text-3xl font-black uppercase">A rest day</p>
                  <p className="mt-2 text-chalk">Not every date has a scorecard. Use the arrows to jump to the nearest lit day.</p>
                </div>
              ) : (
                <ol className="space-y-4">
                  {events.map((e, i) => (
                    <motion.li
                      key={e.date + e.title}
                      initial={reduce ? false : { opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, ease: EXPO, delay: Math.min(i, 6) * 0.05 }}
                    >
                      <EventCard e={e} lead={i === 0} />
                    </motion.li>
                  ))}
                </ol>
              )}
            </div>
          </div>
        </div>
      </section>

      <section aria-label="Daily email" className="mx-auto max-w-[900px] px-4 pb-28 sm:px-8">
        <SubscribeBox />
      </section>
    </main>
  );
}

function EventCard({ e, lead }: { e: DayEvent; lead: boolean }) {
  return (
    <article className="overflow-hidden rounded-3xl border border-flood/10 bg-pitch">
      {lead && e.photo && (
        <div className="relative aspect-[16/9] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={e.photo} alt="" className="h-full w-full object-cover object-[50%_30%]" />
          <div className="absolute inset-0 bg-gradient-to-t from-pitch via-pitch/10 to-transparent" />
          {!e.photoExact && (
            <span className="absolute right-3 top-3 rounded-full bg-night/70 px-3 py-1 text-xs font-semibold text-chalk backdrop-blur">Illustrative photo</span>
          )}
        </div>
      )}
      <div className={`p-5 md:p-6 ${lead && e.photo ? '-mt-14 relative' : ''}`}>
        <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className={`tnum font-display font-black text-gold ${lead ? 'text-5xl' : 'text-3xl'}`}>{e.year}</span>
          <span className="text-sm font-semibold text-dust">{e.match ? `${e.match.format} · ${e.match.competition}` : KIND_LABEL[e.kind]}</span>
        </p>
        <h3 className={`mt-2 font-display font-black uppercase leading-[0.92] ${lead ? 'text-[clamp(1.8rem,3vw,2.6rem)]' : 'text-2xl'}`}>{e.title}</h3>
        <p className="mt-3 leading-relaxed text-chalk">{e.description}</p>
        <a href={e.source.url} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-blue transition-colors hover:text-gold">
          {e.source.name === 'Cricsheet' ? 'Scorecard data: Cricsheet' : e.source.name}
          <ArrowUpRight className="h-4 w-4" />
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      </div>
    </article>
  );
}
