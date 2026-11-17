'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useReducedMotion } from '@/lib/motion';
import { ArrowLeft, ArrowRight, ArrowUpRight, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { Reveal } from '@/components/fx/primitives';
import type { DayEvent } from '@/lib/onThisDay';

interface DayPayload {
  day: string;
  total: number;
  events: DayEvent[];
  prev: string;
  next: string;
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const EXPO = [0.16, 1, 0.3, 1] as const;

/** Today as MM-DD in India Standard Time (kept here so the dataset stays off the client bundle). */
function todayKey() {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', month: '2-digit', day: '2-digit' }).formatToParts(new Date());
  return `${parts.find((p) => p.type === 'month')?.value}-${parts.find((p) => p.type === 'day')?.value}`;
}

function label(key: string) {
  const [m, d] = key.split('-').map(Number);
  return `${d} ${MONTHS[m - 1]}`;
}

const KIND_LABEL: Record<string, string> = {
  match: 'Match',
  'test-day': 'Test match day',
  life: 'Life',
  career: 'Career',
  honour: 'Honour',
  service: 'Army',
  culture: 'Culture',
};

export default function OnThisDay() {
  const reduce = useReducedMotion();
  const [today] = useState(todayKey);
  const [key, setKey] = useState(today);
  const [day, setDay] = useState<DayPayload | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  const load = useCallback((k: string) => {
    setKey(k);
    return fetch(`/api/on-this-day?d=${k}`)
      .then((r) => r.json())
      .then((payload) => {
        if (!payload.success) throw new Error(payload.error);
        setDay(payload.data);
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  }, []);

  useEffect(() => {
    let alive = true;
    fetch(`/api/on-this-day?d=${today}`)
      .then((r) => r.json())
      .then((payload) => {
        if (!alive) return;
        if (payload.success) {
          setDay(payload.data);
          setStatus('ready');
        } else setStatus('error');
      })
      .catch(() => alive && setStatus('error'));
    return () => {
      alive = false;
    };
  }, [today]);

  const [lead, ...rest] = day?.events ?? [];
  const years = [...new Set((day?.events ?? []).map((e) => e.year))].sort((a, b) => a - b);

  return (
    <section aria-labelledby="otd-title" className="border-y border-flood/10 bg-pitch py-24 md:py-32">
      <div className="mx-auto grid max-w-[1500px] gap-12 px-4 sm:px-8 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <h2 id="otd-title" className="font-display text-[clamp(2.8rem,6vw,5rem)] font-black uppercase leading-[0.85] tracking-[-0.02em]">
            <span className="block text-chalk">On</span>
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={key}
                className="block text-gold"
                initial={reduce ? false : { y: '40%', opacity: 0 }}
                animate={{ y: '0%', opacity: 1 }}
                exit={reduce ? undefined : { y: '-40%', opacity: 0 }}
                transition={{ duration: 0.45, ease: EXPO }}
              >
                {label(key)}
              </motion.span>
            </AnimatePresence>
          </h2>

          <Reveal delay={0.1}>
            <p className="mt-5 max-w-[38ch] text-chalk" aria-live="polite">
              {status === 'ready' && day
                ? day.total
                  ? `${day.total} ${day.total === 1 ? 'memory' : 'memories'}${years.length ? `, from ${years[0]}${years.length > 1 ? ` to ${years.at(-1)}` : ''}` : ''}.`
                  : 'No recorded memory on this date. The nearest ones are a step away.'
                : 'Every day of the year, from the scorecards of 789 matches and the moments in between.'}
            </p>
          </Reveal>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => day && load(day.prev)}
              disabled={!day}
              aria-label={day ? `Previous memory: ${label(day.prev)}` : 'Previous memory'}
              className="grid h-12 w-12 place-items-center rounded-full border border-flood/20 text-flood transition-colors hover:border-gold hover:text-gold disabled:opacity-40"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => day && load(day.next)}
              disabled={!day}
              aria-label={day ? `Next memory: ${label(day.next)}` : 'Next memory'}
              className="grid h-12 w-12 place-items-center rounded-full border border-flood/20 text-flood transition-colors hover:border-gold hover:text-gold disabled:opacity-40"
            >
              <ArrowRight className="h-5 w-5" />
            </button>
            {key !== today && (
              <button
                type="button"
                onClick={() => load(today)}
                className="inline-flex h-12 items-center gap-2 rounded-full border border-flood/20 px-5 text-sm font-semibold text-flood transition-colors hover:border-gold hover:text-gold"
              >
                <RotateCcw className="h-4 w-4" />
                Back to today
              </button>
            )}
          </div>
          <Link
            href={`/on-this-day?d=${key}`}
            className="mt-8 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.12em] text-gold transition-colors hover:text-flood"
          >
            Open the full calendar
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div aria-busy={status === 'loading'}>
          {status === 'loading' && !day && <div className="aspect-[16/10] animate-pulse rounded-3xl bg-flood/[0.04]" />}
          {status === 'error' && <p className="text-chalk">The archive is quiet right now. Try again in a moment.</p>}
          {day && (
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={day.day}
                initial={reduce ? false : { opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -16 }}
                transition={{ duration: 0.5, ease: EXPO }}
              >
                {lead ? (
                  <>
                    <LeadCard e={lead} />
                    {rest.length > 0 && (
                      <ol className="mt-4 divide-y divide-flood/10 border-y border-flood/10">
                        {rest.map((e) => (
                          <li key={e.date + e.title} className="grid grid-cols-[4.5rem_1fr] gap-5 py-6 md:grid-cols-[6rem_1fr]">
                            <span className="tnum font-display text-3xl font-black text-gold md:text-4xl">{e.year}</span>
                            <div>
                              <h3 className="font-display text-2xl font-black uppercase leading-none">{e.title}</h3>
                              <p className="mt-2 leading-relaxed text-chalk">{e.description}</p>
                              <SourceLink e={e} />
                            </div>
                          </li>
                        ))}
                      </ol>
                    )}
                    {day.total > day.events.length && (
                      <p className="mt-4 text-sm text-dust">
                        Plus {day.total - day.events.length} more {day.total - day.events.length === 1 ? 'match' : 'matches'} on this date.
                      </p>
                    )}
                  </>
                ) : (
                  <div className="grid aspect-[16/10] place-items-center rounded-3xl border border-dashed border-flood/15 p-8 text-center">
                    <div>
                      <p className="font-display text-3xl font-black uppercase">A rest day</p>
                      <p className="mt-2 text-chalk">
                        Nearest memories: {label(day.prev)} and {label(day.next)}.
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </section>
  );
}

function LeadCard({ e }: { e: DayEvent }) {
  return (
    <article className="overflow-hidden rounded-3xl border border-flood/10 bg-night">
      {e.photo && (
        <div className="relative aspect-[16/9] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={e.photo} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover object-[50%_30%]" />
          <div className="absolute inset-0 bg-gradient-to-t from-night via-night/20 to-transparent" />
          {!e.photoExact && (
            <span className="absolute right-4 top-4 rounded-full bg-night/70 px-3 py-1 text-xs font-semibold text-chalk backdrop-blur">
              Illustrative photo
            </span>
          )}
        </div>
      )}
      <div className={`relative p-6 md:p-8 ${e.photo ? '-mt-20' : ''}`}>
        <p className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <span className="tnum font-display text-5xl font-black text-gold md:text-6xl">{e.year}</span>
          <span className="text-sm font-semibold text-dust">
            {e.match ? `${e.match.format} · ${e.match.competition}` : KIND_LABEL[e.kind]}
          </span>
        </p>
        <h3 className="mt-3 font-display text-[clamp(2rem,3.4vw,3rem)] font-black uppercase leading-[0.92]">{e.title}</h3>
        <p className="mt-4 max-w-[62ch] text-lg leading-relaxed text-chalk">{e.description}</p>
        <SourceLink e={e} />
      </div>
    </article>
  );
}

function SourceLink({ e }: { e: DayEvent }) {
  return (
    <a
      href={e.source.url}
      target="_blank"
      rel="noreferrer"
      className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-blue transition-colors hover:text-gold"
    >
      {e.source.name === 'Cricsheet' ? 'Scorecard data: Cricsheet' : e.source.name}
      <ArrowUpRight className="h-4 w-4" />
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  );
}
