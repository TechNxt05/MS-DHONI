'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Check, Loader2, Mail } from 'lucide-react';
import { useId, useState, type FormEvent } from 'react';
import { cn } from '@/lib/utils';

/** Sign up for the daily On This Day email (double opt-in via /api/subscribe). */
export default function SubscribeBox({ className }: { className?: string }) {
  const id = useId();
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setState('sending');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, website: form.get('website') }),
      });
      const data = await res.json();
      setMessage(data.message ?? data.error ?? '');
      setState(data.success ? 'done' : 'error');
    } catch {
      setMessage('Couldn’t reach the server. Please try again.');
      setState('error');
    }
  };

  return (
    <div className={cn('relative overflow-hidden rounded-[26px] border border-gold/25 bg-night p-6 md:p-7', className)}>
      <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gold/15 blur-3xl" />
      <p className="relative flex items-center gap-2 text-sm font-semibold text-gold">
        <Mail className="h-4 w-4" />
        Daily email
      </p>
      <h3 className="relative mt-3 font-display text-[clamp(1.7rem,3vw,2.4rem)] font-black uppercase leading-[0.92]">
        Start your morning with a <span className="text-gold">helicopter shot.</span>
      </h3>
      <p className="relative mt-3 max-w-[44ch] text-chalk">
        Some people need coffee. You need Thala. One MS Dhoni memory lands in your inbox every morning: the match, the moment and the video to relive it.
      </p>

      <AnimatePresence mode="wait" initial={false}>
        {state === 'done' ? (
          <motion.p
            key="done"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative mt-5 flex items-start gap-2 rounded-2xl bg-gold/10 p-4 font-semibold text-flood"
            role="status"
          >
            <Check className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
            {message}
          </motion.p>
        ) : (
          <motion.form key="form" onSubmit={submit} exit={{ opacity: 0, y: -8 }} className="relative mt-5" noValidate>
            <label htmlFor={`${id}-email`} className="sr-only">
              Your email address
            </label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                id={`${id}-email`}
                type="email"
                inputMode="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                aria-invalid={state === 'error'}
                aria-describedby={`${id}-msg`}
                className="min-w-0 flex-1 rounded-full border border-flood/20 bg-pitch px-5 py-3.5 text-base text-flood placeholder:text-dust focus:border-gold focus:outline-none"
              />
              <button
                type="submit"
                disabled={state === 'sending' || !email}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gold px-6 py-3.5 text-sm font-bold uppercase tracking-[0.1em] text-night transition-colors hover:bg-flood disabled:opacity-60"
              >
                {state === 'sending' ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                Count me in
              </button>
            </div>
            {/* Honeypot: hidden from people, irresistible to bots. */}
            <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden className="absolute -left-[9999px] h-px w-px opacity-0" />
            <p id={`${id}-msg`} className={cn('mt-3 text-sm', state === 'error' ? 'text-[#ff7a70]' : 'text-dust')} aria-live="polite">
              {state === 'error' ? message : 'Free. One email a day around 7 am IST. Leave whenever you like.'}
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
