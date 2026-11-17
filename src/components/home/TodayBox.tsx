'use client';

import { AnimatePresence, motion, type PanInfo } from 'framer-motion';
import { ArrowLeft, ArrowRight, ArrowUpRight, Play } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import type { DayEvent } from '@/lib/onThisDay';
import { useReducedMotion } from '@/lib/motion';
import { eventVideo } from '@/lib/videos';
import { cn } from '@/lib/utils';
import SubscribeForm from './SubscribeBox';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const EXPO = [0.16, 1, 0.3, 1] as const;
const AUTOPLAY_MS = 6500;

const KIND_LABEL: Record<string, string> = {
  match: 'Match',
  'test-day': 'Test match day',
  life: 'Life',
  career: 'Career',
  honour: 'Honour',
  service: 'Army',
  culture: 'Culture',
};

function todayKey() {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', month: '2-digit', day: '2-digit' }).formatToParts(new Date());
  return `${parts.find((p) => p.type === 'month')?.value}-${parts.find((p) => p.type === 'day')?.value}`;
}
const label = (key: string) => {
  const [m, d] = key.split('-').map(Number);
  return `${d} ${MONTHS[m - 1]}`;
};

interface Loaded {
  key: string;
  events: DayEvent[];
  isToday: boolean;
}

async function fetchDay(key: string) {
  const r = await fetch(`/api/on-this-day?d=${key}&limit=8`);
  const payload = await r.json();
  if (!payload.success) throw new Error(payload.error);
  return payload.data as { day: string; events: DayEvent[]; next: string };
}

/** Home page: today's Dhoni memories as a slideshow, then the daily-email sign-up. */
export default function TodayBox({ day }: { day?: string }) {
  const reduce = useReducedMotion();
  const [data, setData] = useState<Loaded | null>(null);
  const [failed, setFailed] = useState(false);
  const [[index, dir], setSlide] = useState<[number, number]>([0, 1]);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    let alive = true;
    const today = day ?? todayKey();
    fetchDay(today)
      .then(async (d) => {
        // A rest day: show the next date that has memories instead of an empty box.
        if (!d.events.length) {
          const n = await fetchDay(d.next);
          return { key: n.day, events: n.events, isToday: false };
        }
        return { key: d.day, events: d.events, isToday: true };
      })
      .then((l) => alive && setData(l))
      .catch(() => alive && setFailed(true));
    return () => {
      alive = false;
    };
  }, [day]);

  const count = data?.events.length ?? 0;
  const go = useCallback(
    (step: number) => setSlide(([i]) => [(i + step + count) % count, step]),
    [count],
  );

  useEffect(() => {
    if (count < 2 || paused || reduce) return;
    const t = setTimeout(() => go(1), AUTOPLAY_MS);
    return () => clearTimeout(t);
  }, [count, paused, reduce, go, index]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -60 || info.velocity.x < -400) go(1);
    else if (info.offset.x > 60 || info.velocity.x > 400) go(-1);
  };

  const e = data?.events[index];

  return (
    <div className="relative overflow-hidden rounded-[28px] border border-gold/25 bg-night">
      <div aria-hidden className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gold/10 blur-3xl" />

      {/* Today's memories */}
      <section
        aria-roledescription="carousel"
        aria-label={data ? `MS Dhoni on ${label(data.key)}` : 'MS Dhoni on this day'}
        className="relative p-5 md:p-8"
        onPointerEnter={() => setPaused(true)}
        onPointerLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-gold">
              {data && !data.isToday ? 'Next memory' : 'On this day'}
            </p>
            <h2 className="mt-1 font-display text-[clamp(2rem,4vw,3.2rem)] font-black uppercase leading-[0.9]">
              {data ? label(data.key) : ' '}
            </h2>
          </div>
          {count > 1 && (
            <div className="flex items-center gap-3">
              <span className="tnum text-sm text-dust" aria-live="polite">
                {index + 1} / {count}
              </span>
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Previous memory"
                className="grid h-11 w-11 place-items-center rounded-full border border-flood/20 text-flood transition-colors hover:border-gold hover:text-gold"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Next memory"
                className="grid h-11 w-11 place-items-center rounded-full border border-flood/20 text-flood transition-colors hover:border-gold hover:text-gold"
              >
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>

        <div className="relative mt-6 overflow-hidden rounded-3xl">
          {!data && !failed && <div className="aspect-[16/10] animate-pulse rounded-3xl bg-flood/[0.04] md:aspect-[21/8]" />}
          {failed && <p className="py-10 text-chalk">The archive is quiet right now. Try again in a moment.</p>}
          {e && (
            <AnimatePresence mode="popLayout" initial={false} custom={dir}>
              <motion.article
                key={`${data!.key}-${index}`}
                custom={dir}
                variants={{
                  enter: (d: number) => ({ x: reduce ? 0 : `${d * 100}%`, opacity: reduce ? 0 : 1 }),
                  center: { x: '0%', opacity: 1 },
                  exit: (d: number) => ({ x: reduce ? 0 : `${d * -100}%`, opacity: reduce ? 0 : 1 }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: reduce ? 0.2 : 0.7, ease: EXPO }}
                drag={count > 1 ? 'x' : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={onDragEnd}
                aria-roledescription="slide"
                aria-label={`${index + 1} of ${count}`}
                className="grid cursor-grab gap-0 overflow-hidden rounded-3xl border border-flood/10 bg-pitch active:cursor-grabbing md:grid-cols-[1.1fr_1fr]"
              >
                <Slide e={e} dayKey={data!.key} />
              </motion.article>
            </AnimatePresence>
          )}
        </div>

        {count > 1 && (
          <div className="mt-4 flex justify-center gap-2">
            {data!.events.map((ev, i) => (
              <button
                key={ev.date + ev.title}
                type="button"
                onClick={() => setSlide(([cur]) => [i, i >= cur ? 1 : -1])}
                aria-label={`Show memory ${i + 1}: ${ev.title}`}
                aria-current={i === index}
                className="group grid h-6 place-items-center px-0.5"
              >
                <span className={cn('block h-1.5 rounded-full transition-all duration-300', i === index ? 'w-8 bg-gold' : 'w-3 bg-flood/25 group-hover:bg-flood/50')} />
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Daily email */}
      <div className="relative border-t border-flood/10 bg-[linear-gradient(180deg,rgba(253,185,19,0.05),transparent)] p-5 md:p-8">
        <SubscribeForm bare />
      </div>
    </div>
  );
}

function Slide({ e, dayKey }: { e: DayEvent; dayKey: string }) {
  const yt = eventVideo(e);
  return (
    <>
      <div className="relative aspect-[16/10] overflow-hidden md:aspect-auto md:min-h-[340px]">
        {e.photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={e.photo} alt="" draggable={false} decoding="async" className="absolute inset-0 h-full w-full object-cover object-[50%_30%]" />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_30%,#1f2430,#06070a)]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-pitch via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-pitch" />
        {e.photo && !e.photoExact && (
          <span className="absolute left-4 top-4 rounded-full bg-night/70 px-3 py-1 text-xs font-semibold text-chalk backdrop-blur">Illustrative photo</span>
        )}
      </div>
      <div className="relative flex flex-col p-6 md:p-8">
        <p className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <span className="tnum font-display text-5xl font-black text-gold">{e.year}</span>
          <span className="text-sm font-semibold text-dust">{e.match ? `${e.match.format} · ${e.match.competition}` : KIND_LABEL[e.kind]}</span>
        </p>
        <h3 className="mt-3 font-display text-[clamp(1.7rem,2.6vw,2.4rem)] font-black uppercase leading-[0.95]">{e.title}</h3>
        <p className="mt-3 line-clamp-4 leading-relaxed text-chalk">{e.description}</p>
        <div className="mt-auto flex flex-wrap items-center gap-3 pt-6">
          <a
            href={yt.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[#ff0033] px-5 py-3 text-sm font-bold text-white transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98]"
          >
            <Play className="h-4 w-4 fill-current" />
            {yt.verified ? 'Watch on YouTube' : 'Find it on YouTube'}
            <span className="sr-only">(opens in a new tab)</span>
          </a>
          <Link
            href={`/on-this-day?d=${dayKey}`}
            className="inline-flex items-center gap-1 text-sm font-semibold text-flood transition-colors hover:text-gold"
          >
            The full day
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </>
  );
}
