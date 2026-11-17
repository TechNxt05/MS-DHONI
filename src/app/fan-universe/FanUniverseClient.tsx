'use client';

import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import { useReducedMotion } from '@/lib/motion';
import dynamic from 'next/dynamic';
import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Check, Copy, Download, Loader2, MapPin, RefreshCw, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import PageHero from '@/components/layout/PageHero';
import { Tilt } from '@/components/fx/primitives';
import { photo } from '@/lib/photos';
import { thalaReason } from '@/lib/thala';
import { cn } from '@/lib/utils';
import type { GlobePin } from '@/components/three/FanGlobe';
import FlatPinMap from '@/components/three/FlatPinMap';
import { useThreeD } from '@/lib/three-pref';
import { TABS, type Tab } from './tabs';

const FanGlobe = dynamic(() => import('@/components/three/FanGlobe'), {
  ssr: false,
  loading: () => <div className="flex h-full items-center justify-center text-sm text-dust">Spinning up the globe…</div>,
});

const EXPO = [0.16, 1, 0.3, 1] as const;

const fieldClass =
  'w-full rounded-2xl border border-flood/15 bg-night px-5 py-4 text-flood outline-none transition-colors placeholder:text-dust focus:border-gold';

/* ---------------------------------------------------------------- */
/* Thala                                                            */
/* ---------------------------------------------------------------- */
function Thala() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<{ ok: boolean; reason: string } | null>(null);
  const [attempt, setAttempt] = useState(0);
  const reduce = useReducedMotion();

  const check = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const reason = thalaReason(input);
    setAttempt((a) => a + 1);
    setResult(reason ? { ok: true, reason } : { ok: false, reason: 'Not even Thala can find the 7 in that. Try again.' });
    if (reason && !reduce) {
      confetti({ particleCount: 140, spread: 80, startVelocity: 45, origin: { y: 0.6 }, colors: ['#fdb913', '#3aa0ee', '#f4efe3'] });
    }
  };

  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_0.9fr] lg:items-center">
      <form onSubmit={check} className="space-y-5">
        <h2 className="font-display text-5xl font-black uppercase leading-[0.9] md:text-6xl">Type anything. We’ll find the 7.</h2>
        <p className="max-w-[48ch] text-chalk">A name, a number, a date, a sentence. The internet has proved everything leads back to Thala.</p>
        <label htmlFor="thala-input" className="sr-only">Your text</label>
        <input id="thala-input" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Try 2011, Raina, or your birthday" className={cn(fieldClass, 'text-xl font-semibold')} />
        <button type="submit" disabled={!input.trim()} className="rounded-full bg-gold px-8 py-4 text-sm font-bold uppercase tracking-[0.12em] text-night transition-colors hover:bg-flood disabled:cursor-not-allowed disabled:opacity-40">
          Check the reason
        </button>
      </form>

      <div className="relative flex aspect-square max-h-[460px] items-center justify-center overflow-hidden rounded-[32px] border border-flood/10 bg-night" aria-live="polite">
        <AnimatePresence mode="wait">
          {result ? (
            <motion.div key={attempt} className="px-8 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <motion.p
                className={cn('font-display text-[12rem] font-black leading-none md:text-[15rem]', result.ok ? 'text-gold' : 'text-outline')}
                initial={reduce ? false : { rotateY: -180, scale: 0.4 }}
                animate={{ rotateY: 0, scale: 1 }}
                transition={{ duration: 1.1, ease: EXPO }}
              >
                {result.ok ? '7' : '?'}
              </motion.p>
              <p className="font-display text-3xl font-black uppercase">{result.ok ? 'Thala for a reason' : 'No reason found'}</p>
              <p className="mt-2 text-chalk">{result.reason}</p>
            </motion.div>
          ) : (
            <motion.p key="idle" className="text-outline font-display text-[15rem] font-black leading-none" animate={reduce ? undefined : { rotate: [0, 4, -4, 0] }} transition={{ duration: 6, repeat: Infinity }}>
              7
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* Pressure Mode & Captaincy Lab                                     */
/* ---------------------------------------------------------------- */
type Q = { id: string; prompt: string; options: string[] };
type Result = {
  score: number;
  total: number;
  provider: string;
  feedback: string;
  breakdown: { id: string; correct: boolean; bestAnswerIndex: number; context: string }[];
};

function Challenge({ mode }: { mode: 'pressure' | 'captaincy' }) {
  const [questions, setQuestions] = useState<Q[]>([]);
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<Result | null>(null);
  const [state, setState] = useState<'loading' | 'ready' | 'grading' | 'error'>('loading');
  const [error, setError] = useState('');

  const request = useCallback(
    () =>
      fetch('/api/fan-universe/challenge', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'generate', mode }) })
        .then((res) => res.json())
        .then((data) => {
          if (!data.success) throw new Error();
          return data.data.questions as Q[];
        }),
    [mode],
  );

  const apply = useCallback((qs: Q[]) => {
    setQuestions(qs);
    setAnswers(new Array(qs.length).fill(-1));
    setState('ready');
  }, []);

  const fail = () => {
    setError('Could not load scenarios. Check your connection and deal again.');
    setState('error');
  };

  const generate = () => {
    setState('loading');
    setResult(null);
    request().then(apply).catch(fail);
  };

  useEffect(() => {
    // The panel remounts per tab, so state already starts at 'loading'.
    let alive = true;
    request()
      .then((qs) => alive && apply(qs))
      .catch(() => {
        if (!alive) return;
        setError('Could not load scenarios. Check your connection and deal again.');
        setState('error');
      });
    return () => {
      alive = false;
    };
  }, [request, apply]);

  const grade = async () => {
    setState('grading');
    try {
      const res = await fetch('/api/fan-universe/challenge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'evaluate', mode, answers: questions.map((q, i) => ({ id: q.id, answer: answers[i] })) }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setResult(data.data);
      setState('ready');
      if (data.data.score === data.data.total && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        confetti({ particleCount: 160, spread: 90, origin: { y: 0.7 }, colors: ['#fdb913', '#3aa0ee', '#f4efe3'] });
      }
    } catch (e) {
      setError(e instanceof Error && e.message ? e.message : 'Could not grade your calls. Try again.');
      setState('error');
    }
  };

  const allAnswered = answers.length > 0 && answers.every((a) => a >= 0);
  const title = mode === 'pressure' ? 'Last over. Your bat.' : 'Your field. Your call.';
  const intro = mode === 'pressure' ? 'Three death-over chases. Pick the play Dhoni would have picked.' : 'Three tactical moments in the field. Set it up like Mahi.';

  return (
    <div>
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="font-display text-5xl font-black uppercase leading-[0.9] md:text-6xl">{title}</h2>
          <p className="mt-3 max-w-[50ch] text-chalk">{intro}</p>
        </div>
        <button onClick={generate} disabled={state === 'loading' || state === 'grading'} className="inline-flex items-center gap-2 self-start rounded-full border border-flood/20 px-5 py-3 text-sm font-bold uppercase tracking-[0.12em] transition-colors hover:border-gold hover:text-gold disabled:opacity-40">
          <RefreshCw className={cn('h-4 w-4', state === 'loading' && 'animate-spin')} /> New scenarios
        </button>
      </div>

      {state === 'error' && (
        <p role="alert" className="mt-8 rounded-2xl border border-red-400/40 bg-red-500/10 p-4 text-red-200">
          {error}
        </p>
      )}

      <ol className="mt-10 grid gap-5">
        {state === 'loading'
          ? [0, 1, 2].map((i) => <li key={i} className="h-48 animate-pulse rounded-3xl bg-flood/[0.04]" />)
          : questions.map((q, qi) => {
              const verdict = result?.breakdown[qi];
              return (
                <motion.li key={q.id} className="rounded-3xl border border-flood/10 bg-night p-5 md:p-7" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EXPO, delay: qi * 0.08 }}>
                  <p className="font-display text-2xl font-bold uppercase leading-tight md:text-3xl">
                    <span className="tnum mr-3 text-gold">{qi + 1}</span>
                    {q.prompt}
                  </p>
                  <div role="radiogroup" aria-label={`Scenario ${qi + 1}`} className="mt-5 grid gap-2 md:grid-cols-3">
                    {q.options.map((opt, oi) => {
                      const chosen = answers[qi] === oi;
                      const best = verdict && verdict.bestAnswerIndex === oi;
                      const wrong = verdict && chosen && !verdict.correct;
                      return (
                        <button
                          key={opt}
                          role="radio"
                          aria-checked={chosen}
                          disabled={Boolean(result)}
                          onClick={() => setAnswers((prev) => prev.map((a, i) => (i === qi ? oi : a)))}
                          className={cn(
                            'flex items-start gap-3 rounded-2xl border p-4 text-left transition-colors duration-300',
                            best ? 'border-emerald-400/70 bg-emerald-400/10' : wrong ? 'border-red-400/70 bg-red-500/10' : chosen ? 'border-gold bg-gold/10' : 'border-flood/10 hover:border-flood/30',
                          )}
                        >
                          <span className={cn('mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border', chosen ? 'border-gold bg-gold text-night' : 'border-flood/30')}>
                            {best ? <Check className="h-3 w-3" /> : wrong ? <X className="h-3 w-3" /> : null}
                          </span>
                          <span className="text-flood">{opt}</span>
                        </button>
                      );
                    })}
                  </div>
                  {verdict && <p className="mt-4 text-sm text-chalk">{verdict.context}</p>}
                </motion.li>
              );
            })}
      </ol>

      <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-start">
        {!result && (
          <button onClick={grade} disabled={!allAnswered || state === 'grading'} className="inline-flex items-center justify-center gap-2 rounded-full bg-gold px-8 py-4 text-sm font-bold uppercase tracking-[0.12em] text-night transition-colors hover:bg-flood disabled:cursor-not-allowed disabled:opacity-40">
            {state === 'grading' && <Loader2 className="h-4 w-4 animate-spin" />}
            {state === 'grading' ? 'Reviewing your calls' : allAnswered ? 'Lock in my calls' : 'Answer all three'}
          </button>
        )}
        <AnimatePresence>
          {result && (
            <motion.div className="grid w-full gap-6 rounded-3xl border border-gold/30 bg-gold/[0.05] p-6 md:grid-cols-[auto_1fr] md:p-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EXPO }}>
              <p className="tnum font-display text-8xl font-black leading-none text-gold">
                {result.score}
                <span className="text-4xl text-dust">/{result.total}</span>
              </p>
              <div>
                <p className="whitespace-pre-wrap leading-relaxed text-flood">{result.feedback}</p>
                <p className="mt-3 text-xs uppercase tracking-[0.16em] text-dust">Reviewed by {result.provider === 'local' ? 'the tribute coach' : result.provider}</p>
                <button onClick={generate} className="mt-5 rounded-full bg-gold px-6 py-3 text-sm font-bold uppercase tracking-[0.12em] text-night hover:bg-flood">
                  Play again
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* Fan Globe                                                         */
/* ---------------------------------------------------------------- */
type Pin = { _id: string; name: string; city: string; country: string; message: string; lat: number; lon: number };

function FanMap() {
  const [pins, setPins] = useState<Pin[]>([]);
  const [loadState, setLoadState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [focus, setFocus] = useState<GlobePin | null>(null);
  const [form, setForm] = useState({ name: '', city: '', country: '', message: '', website: '' });
  const [status, setStatus] = useState<{ kind: 'idle' | 'busy' | 'error' | 'done'; text?: string }>({ kind: 'idle' });

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/fan-map');
      const data = await res.json();
      if (!data.success) throw new Error();
      setPins(data.data);
      setLoadState('ready');
    } catch {
      setLoadState('error');
    }
  }, []);

  useEffect(() => {
    let alive = true;
    fetch('/api/fan-map')
      .then((r) => r.json())
      .then((data) => {
        if (!alive) return;
        if (!data.success) throw new Error();
        setPins(data.data);
        setLoadState('ready');
      })
      .catch(() => alive && setLoadState('error'));
    return () => {
      alive = false;
    };
  }, []);

  const threeD = useThreeD();
  const globePins: GlobePin[] = useMemo(() => pins.map((p) => ({ id: p._id, lat: p.lat, lon: p.lon, label: `${p.city}, ${p.country}` })), [pins]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const { name, city, country, message } = form;
    if (!name.trim() || !city.trim() || !country.trim() || !message.trim()) {
      setStatus({ kind: 'error', text: 'Fill in all four fields so we can place your pin.' });
      return;
    }
    setStatus({ kind: 'busy' });
    try {
      const q = encodeURIComponent(`${city}, ${country}`);
      const geo = await fetch(`https://nominatim.openstreetmap.org/search?q=${q}&format=json&limit=1`, { headers: { Accept: 'application/json' } }).then((r) => r.json());
      if (!geo?.[0]) {
        setStatus({ kind: 'error', text: `We couldn’t find “${city}, ${country}” on the map. Check the spelling, or try a nearby larger city.` });
        return;
      }
      const res = await fetch('/api/fan-map', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, lat: Number(geo[0].lat), lon: Number(geo[0].lon) }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setForm({ name: '', city: '', country: '', message: '', website: '' });
      setStatus({ kind: 'done', text: `Pinned. ${city} is on the globe.` });
      await load();
      if (data.data?._id) setFocus({ id: data.data._id, lat: data.data.lat, lon: data.data.lon, label: city });
    } catch (err) {
      setStatus({ kind: 'error', text: err instanceof Error && err.message ? err.message : 'Could not save your pin. Please try again.' });
    }
  };

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
      <div>
        <h2 className="font-display text-5xl font-black uppercase leading-[0.9] md:text-6xl">One man. Every time zone.</h2>
        <p className="mt-3 max-w-[50ch] text-chalk">Every pin is a fan. Every arc starts in Ranchi, where he did. Drag to turn the planet.</p>
        <div className="relative mt-6 aspect-square w-full overflow-hidden rounded-[32px] border border-flood/10 bg-[radial-gradient(circle_at_50%_45%,#101826,#06070a_70%)]">
          {threeD ? (
            <FanGlobe pins={globePins} focus={focus} className="absolute inset-0" />
          ) : (
            <FlatPinMap pins={globePins} focus={focus} className="absolute inset-0" />
          )}
          <p className="pointer-events-none absolute bottom-4 left-5 flex items-center gap-4 text-xs uppercase tracking-[0.14em] text-dust">
            <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-blue" /> Ranchi</span>
            <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-gold" /> Fans</span>
            <span className="tnum">{pins.length} pinned</span>
          </p>
        </div>
      </div>

      <div className="space-y-8">
        <form onSubmit={submit} className="space-y-3 rounded-3xl border border-flood/10 bg-night p-5 md:p-6" noValidate>
          <p className="font-display text-2xl font-black uppercase">Pin your city</p>
          <input aria-label="Your name" value={form.name} onChange={set('name')} placeholder="Your name" maxLength={60} className={fieldClass} />
          <div className="grid gap-3 sm:grid-cols-2">
            <input aria-label="City" value={form.city} onChange={set('city')} placeholder="City" maxLength={100} className={fieldClass} />
            <input aria-label="Country" value={form.country} onChange={set('country')} placeholder="Country" maxLength={100} className={fieldClass} />
          </div>
          <textarea aria-label="Your tribute" value={form.message} onChange={set('message')} placeholder="A line for Thala" rows={3} maxLength={300} className={cn(fieldClass, 'resize-none')} />
          <input tabIndex={-1} autoComplete="off" aria-hidden className="hidden" value={form.website} onChange={set('website')} />
          <div className="flex flex-wrap items-center gap-4">
            <button disabled={status.kind === 'busy'} className="inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3.5 text-sm font-bold uppercase tracking-[0.12em] text-night transition-colors hover:bg-flood disabled:opacity-50">
              {status.kind === 'busy' ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}
              {status.kind === 'busy' ? 'Finding your city' : 'Pin it'}
            </button>
            {status.text && (
              <p role={status.kind === 'error' ? 'alert' : 'status'} className={cn('text-sm', status.kind === 'error' ? 'text-red-300' : 'text-emerald-300')}>
                {status.text}
              </p>
            )}
          </div>
        </form>

        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-dust">Latest pins</p>
          {loadState === 'loading' && <p className="text-chalk">Loading pins…</p>}
          {loadState === 'error' && <p className="text-chalk">Fan pins are unavailable right now. The globe still spins.</p>}
          {loadState === 'ready' && pins.length === 0 && <p className="text-chalk">No pins yet. Be the first city on the planet.</p>}
          <ul className="max-h-[420px] space-y-2 overflow-y-auto pr-1" data-lenis-prevent>
            {pins.map((p) => (
              <li key={p._id}>
                <button
                  onClick={() => setFocus({ id: p._id, lat: p.lat, lon: p.lon, label: p.city })}
                  className={cn('w-full rounded-2xl border p-4 text-left transition-colors', focus?.id === p._id ? 'border-gold/60 bg-gold/[0.06]' : 'border-flood/10 hover:border-flood/30')}
                >
                  <p className="font-semibold text-flood">
                    {p.name} <span className="font-normal text-dust">· {p.city}, {p.country}</span>
                  </p>
                  <p className="mt-1 text-sm text-chalk">{p.message}</p>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* Supremacy Cards                                                   */
/* ---------------------------------------------------------------- */
const templates = ['Calm mind. Ruthless finish.', 'In pressure, others panic. Thala calculates.', 'Captain Cool is not a style. It is a standard.', 'Some finish matches. He finished arguments.'];
const backgrounds = [photo('world-cup-final-six-2011'), photo('csk-seven-floodlights'), photo('storm-sky'), photo('keeper-gloves-close')];

function Cards() {
  const [name, setName] = useState('Thala Fan');
  const [line, setLine] = useState(templates[0]);
  const [bg, setBg] = useState(0);
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);
  const text = `“${line}”\n— ${name || 'A fan'}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* Clipboard blocked: nothing to do. */
    }
  };

  const download = async () => {
    setBusy(true);
    try {
      const img = new Image();
      img.src = backgrounds[bg].src;
      await img.decode();
      await document.fonts.ready;
      const c = document.createElement('canvas');
      c.width = 1200;
      c.height = 1500;
      const g = c.getContext('2d')!;
      const scale = Math.max(c.width / img.width, c.height / img.height);
      g.drawImage(img, (c.width - img.width * scale) / 2, 0, img.width * scale, img.height * scale);
      const shade = g.createLinearGradient(0, 0, 0, c.height);
      shade.addColorStop(0, 'rgba(6,7,10,0.1)');
      shade.addColorStop(0.45, 'rgba(6,7,10,0.55)');
      shade.addColorStop(1, 'rgba(6,7,10,0.97)');
      g.fillStyle = shade;
      g.fillRect(0, 0, c.width, c.height);
      const display = getComputedStyle(document.documentElement).getPropertyValue('--font-big-shoulders') || 'Arial Narrow';
      g.fillStyle = '#fdb913';
      g.font = `900 64px ${display}`;
      g.fillText('MSD 7', 80, 130);
      g.fillStyle = '#f4efe3';
      g.font = `900 108px ${display}`;
      const words = `“${line.toUpperCase()}”`.split(' ');
      const rows: string[] = [];
      let row = '';
      for (const w of words) {
        const next = row ? `${row} ${w}` : w;
        if (g.measureText(next).width > c.width - 160) {
          rows.push(row);
          row = w;
        } else row = next;
      }
      rows.push(row);
      const startY = c.height - 220 - rows.length * 104;
      rows.forEach((r, i) => g.fillText(r, 80, startY + i * 104));
      g.fillStyle = '#fdb913';
      g.font = `700 44px ${display}`;
      g.fillText(`— ${(name || 'A fan').toUpperCase()}`, 80, c.height - 120);
      const a = document.createElement('a');
      a.href = c.toDataURL('image/png');
      a.download = 'dhoni-supremacy-card.png';
      a.click();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_0.85fr] lg:items-center">
      <div className="space-y-6">
        <h2 className="font-display text-5xl font-black uppercase leading-[0.9] md:text-6xl">Make it yours. Post it everywhere.</h2>
        <div>
          <label htmlFor="card-name" className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-dust">Your fan name</label>
          <input id="card-name" value={name} onChange={(e) => setName(e.target.value)} maxLength={28} className={fieldClass} />
        </div>
        <fieldset>
          <legend className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-dust">Line</legend>
          <div className="grid gap-2">
            {templates.map((t) => (
              <button key={t} type="button" aria-pressed={t === line} onClick={() => setLine(t)} className={cn('rounded-2xl border px-5 py-3.5 text-left transition-colors', t === line ? 'border-gold bg-gold/10 text-flood' : 'border-flood/10 text-chalk hover:border-flood/30')}>
                {t}
              </button>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-dust">Photo</legend>
          <div className="flex gap-3">
            {backgrounds.map((b, i) => (
              <button key={b.src} type="button" aria-pressed={bg === i} aria-label={b.alt} onClick={() => setBg(i)} className={cn('h-16 w-16 overflow-hidden rounded-xl border-2 transition-all', bg === i ? 'scale-105 border-gold' : 'border-transparent opacity-60 hover:opacity-100')}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={b.src} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </fieldset>
        <div className="flex flex-wrap gap-3">
          <button onClick={download} disabled={busy} className="inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3.5 text-sm font-bold uppercase tracking-[0.12em] text-night transition-colors hover:bg-flood disabled:opacity-50">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />} Download PNG
          </button>
          <button onClick={copy} className="inline-flex items-center gap-2 rounded-full border border-flood/20 px-7 py-3.5 text-sm font-bold uppercase tracking-[0.12em] transition-colors hover:border-gold hover:text-gold">
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} {copied ? 'Copied' : 'Copy text'}
          </button>
        </div>
      </div>

      <Tilt max={12} className="mx-auto w-full max-w-[420px]">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] border border-gold/30 shadow-[0_40px_80px_-30px_rgba(253,185,19,0.35)]">
          <AnimatePresence mode="popLayout">
            <motion.img key={bg} src={backgrounds[bg].src} alt="" className="absolute inset-0 h-full w-full object-cover object-top" initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.7, ease: EXPO }} />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-b from-night/10 via-night/50 to-night" />
          <p className="absolute left-6 top-6 font-display text-2xl font-black text-gold">MSD 7</p>
          <div className="absolute inset-x-6 bottom-6" style={{ transform: 'translateZ(50px)' }}>
            <p className="font-display text-4xl font-black uppercase leading-[0.95] text-flood">“{line}”</p>
            <p className="mt-3 font-display text-xl font-bold uppercase text-gold">— {name || 'A fan'}</p>
          </div>
        </div>
      </Tilt>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/** The tab comes from the server (?tab=), so the page renders in full on first paint. */
export default function FanUniverseClient({ initialTab }: { initialTab: Tab }) {
  const [tab, setTab] = useState<Tab>(initialTab);
  const panel = useRef<HTMLDivElement>(null);

  const choose = (key: Tab) => {
    setTab(key);
    window.history.replaceState(null, '', `/fan-universe?tab=${key}`);
  };

  return (
    <main>
      <PageHero
        title="Fan universe"
        accent={['universe']}
        backdrop={photo('csk-walk-out')}
        position="50% 40%"
        intro="The interactive wing of the tribute. Play his calls, find your 7, pin your city, make a card."
      />

      <section className="mx-auto max-w-[1500px] px-4 pb-28 sm:px-8">
        <LayoutGroup>
          <div role="tablist" aria-label="Fan universe" className="no-scrollbar sticky top-20 z-30 -mx-4 flex gap-1 overflow-x-auto rounded-full border border-flood/10 bg-night/80 p-1.5 px-4 backdrop-blur-xl sm:mx-0 sm:w-fit sm:px-1.5">
            {TABS.map((t) => (
              <button
                key={t.key}
                role="tab"
                id={`tab-${t.key}`}
                aria-selected={tab === t.key}
                aria-controls="universe-panel"
                onClick={() => choose(t.key)}
                className={cn('relative shrink-0 rounded-full px-5 py-2.5 text-sm font-bold uppercase tracking-[0.08em] transition-colors', tab === t.key ? 'text-night' : 'text-chalk hover:text-flood')}
              >
                {tab === t.key && <motion.span layoutId="universe-tab" className="absolute inset-0 rounded-full bg-gold" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}
                <span className="relative">{t.label}</span>
              </button>
            ))}
          </div>
        </LayoutGroup>

        <div ref={panel} id="universe-panel" role="tabpanel" aria-labelledby={`tab-${tab}`} className="mt-10 rounded-[36px] border border-flood/10 bg-pitch p-5 md:p-10">
          <AnimatePresence mode="wait">
            <motion.div key={tab} initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, y: -12, filter: 'blur(8px)' }} transition={{ duration: 0.55, ease: EXPO }}>
              {tab === 'thala' && <Thala />}
              {tab === 'pressure' && <Challenge mode="pressure" />}
              {tab === 'captaincy' && <Challenge mode="captaincy" />}
              {tab === 'fanmap' && <FanMap />}
              {tab === 'cards' && <Cards />}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </main>
  );
}
