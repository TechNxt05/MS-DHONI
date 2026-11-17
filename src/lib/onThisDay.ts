import dataset from '@/data/dhoni-days.json';

/**
 * Every calendar day with a documented Dhoni memory. Built by scripts/dhoni-days/build.mjs
 * from Cricsheet scorecards plus hand-curated life events; see that script to regenerate.
 */
export type DayEventKind = 'match' | 'test-day' | 'life' | 'career' | 'honour' | 'service' | 'culture';

export interface DayEvent {
  date: string;
  year: number;
  kind: DayEventKind;
  title: string;
  description: string;
  highlights: string[];
  weight: number;
  photo: string | null;
  photoExact: boolean;
  match: {
    format: string;
    competition: string;
    stage: string | null;
    team: string;
    opponent: string;
    venue: string;
    dates: string[];
    result: string;
    won: boolean | null;
    bestScore: string | null;
    playerOfMatch: boolean;
  } | null;
  source: { name: string; url: string; matchId?: string };
}

interface Dataset {
  generated: string;
  about: string;
  coverage: { daysWithEvents: number; totalDays: number; emptyDays: string[]; matches: number; lifeEvents: number };
  undated: { period: string; title: string; description: string }[];
  days: Record<string, DayEvent[]>;
}

const data = dataset as unknown as Dataset;
const keys = Object.keys(data.days).sort();

export const dayCoverage = data.coverage;

/** "MM-DD" for a date, in India Standard Time so the day matches the subject's calendar. */
export function dayKey(date = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', month: '2-digit', day: '2-digit' }).formatToParts(date);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '01';
  return `${get('month')}-${get('day')}`;
}

export function isDayKey(value: string | null): value is string {
  if (!value || !/^\d{2}-\d{2}$/.test(value)) return false;
  const [m, d] = value.split('-').map(Number);
  return m >= 1 && m <= 12 && d >= 1 && d <= new Date(Date.UTC(2024, m, 0)).getUTCDate();
}

/** Events for a day, plus the nearest days either side that have something. */
export function getDay(key: string, limit = 6) {
  const events = data.days[key] ?? [];
  const after = keys.find((k) => k > key) ?? keys[0];
  const before = [...keys].reverse().find((k) => k < key) ?? keys.at(-1)!;
  return {
    day: key,
    total: events.length,
    events: events.slice(0, limit),
    prev: before,
    next: after,
  };
}

/** Compact per-day counts for the calendar: all, India, Chennai, life and honours, big nights. */
export interface DaySummary {
  a: number;
  i: number;
  c: number;
  l: number;
  b: number;
  top: string;
  year: number;
}

const BIG = new Set(['hundred', 'final-won', 'player-of-the-match', 'milestone', 'finisher']);

export function getCalendar(): Record<string, DaySummary> {
  const out: Record<string, DaySummary> = {};
  for (const [key, events] of Object.entries(data.days)) {
    const lead = events[0];
    out[key] = {
      a: events.length,
      i: events.filter((e) => e.match?.team === 'India' || e.kind === 'test-day').length,
      c: events.filter((e) => e.match?.team === 'Chennai Super Kings').length,
      l: events.filter((e) => e.kind !== 'match' && e.kind !== 'test-day').length,
      b: events.filter((e) => e.highlights.some((h) => BIG.has(h))).length,
      top: lead.title,
      year: lead.year,
    };
  }
  return out;
}
