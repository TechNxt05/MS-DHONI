'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Loader2, Send } from 'lucide-react';
import { useEffect, useState } from 'react';
import PageHero from '@/components/layout/PageHero';
import { photo } from '@/lib/photos';
import { cn } from '@/lib/utils';

interface Message {
  _id: string;
  name: string;
  message: string;
  createdAt: string;
}

const field =
  'w-full rounded-2xl border border-flood/15 bg-night px-5 py-4 text-flood outline-none transition-colors placeholder:text-dust focus:border-gold disabled:opacity-60';

export default function FansClient() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [load, setLoad] = useState<'loading' | 'ready' | 'error'>('loading');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [website, setWebsite] = useState('');
  const [status, setStatus] = useState<{ kind: 'idle' | 'busy' | 'error' | 'done'; text?: string }>({ kind: 'idle' });

  useEffect(() => {
    fetch('/api/fans')
      .then((r) => r.json())
      .then((d) => {
        if (!d.success) throw new Error();
        setMessages(d.data);
        setLoad('ready');
      })
      .catch(() => setLoad('error'));
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) {
      setStatus({ kind: 'error', text: 'Add your name and a message first.' });
      return;
    }
    setStatus({ kind: 'busy' });
    try {
      const res = await fetch('/api/fans', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, message, website }) });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      if (data.data) setMessages((m) => [data.data, ...m]);
      setName('');
      setMessage('');
      setStatus({ kind: 'done', text: 'Posted. Thala thanks you.' });
    } catch (err) {
      setStatus({ kind: 'error', text: err instanceof Error && err.message ? err.message : 'Could not post your message. Please try again.' });
    }
  };

  return (
    <main>
      <PageHero
        title="The fan wall"
        accent={['wall']}
        backdrop={photo('csk-trio')}
        position="50% 35%"
        intro="Your favourite memory, a thank-you, a last-over prayer. Leave it here for Captain Cool."
      />

      <section className="mx-auto grid max-w-[1500px] gap-12 px-4 pb-28 sm:px-8 lg:grid-cols-[0.8fr_1.2fr]">
        <form onSubmit={submit} noValidate className="space-y-4 self-start rounded-[32px] border border-flood/10 bg-pitch p-6 md:p-8 lg:sticky lg:top-28">
          <p className="font-display text-3xl font-black uppercase">Write on the wall</p>
          <div>
            <label htmlFor="fan-name" className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-dust">Your name</label>
            <input id="fan-name" value={name} onChange={(e) => setName(e.target.value)} maxLength={50} disabled={status.kind === 'busy'} className={field} placeholder="How should we sign it?" />
          </div>
          <div>
            <label htmlFor="fan-message" className="mb-2 flex justify-between text-xs font-semibold uppercase tracking-[0.16em] text-dust">
              Your message <span className="tnum normal-case tracking-normal">{message.length}/500</span>
            </label>
            <textarea id="fan-message" value={message} onChange={(e) => setMessage(e.target.value)} maxLength={500} rows={5} disabled={status.kind === 'busy'} className={cn(field, 'resize-none')} placeholder="Wankhede, 2011. I was…" />
          </div>
          <input tabIndex={-1} autoComplete="off" aria-hidden className="hidden" value={website} onChange={(e) => setWebsite(e.target.value)} />
          <button type="submit" disabled={status.kind === 'busy'} className="flex w-full items-center justify-center gap-2 rounded-full bg-gold py-4 text-sm font-bold uppercase tracking-[0.12em] text-night transition-colors hover:bg-flood disabled:opacity-50">
            {status.kind === 'busy' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            {status.kind === 'busy' ? 'Posting' : 'Post message'}
          </button>
          {status.text && (
            <p role={status.kind === 'error' ? 'alert' : 'status'} className={cn('text-sm', status.kind === 'error' ? 'text-red-300' : 'text-emerald-300')}>
              {status.text}
            </p>
          )}
        </form>

        <div aria-live="polite">
          {load === 'loading' && (
            <ul className="space-y-4">
              {[0, 1, 2, 3].map((i) => (
                <li key={i} className="h-32 animate-pulse rounded-3xl bg-flood/[0.04]" />
              ))}
            </ul>
          )}
          {load === 'error' && <p className="rounded-3xl border border-flood/10 p-8 text-chalk">The wall is resting right now. Messages will be back shortly.</p>}
          {load === 'ready' && messages.length === 0 && (
            <p className="rounded-3xl border border-dashed border-flood/20 p-10 text-center font-display text-3xl font-black uppercase text-chalk">Empty wall. Be the first name on it.</p>
          )}
          <ul className="columns-1 gap-4 md:columns-2">
            <AnimatePresence initial={false}>
              {messages.map((m) => (
                <motion.li
                  key={m._id}
                  layout
                  initial={{ opacity: 0, y: -20, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="mb-4 break-inside-avoid rounded-3xl border border-flood/10 bg-pitch p-6"
                >
                  <p className="leading-relaxed text-flood">{m.message}</p>
                  <div className="mt-5 flex items-center justify-between gap-3 text-sm">
                    <span className="flex items-center gap-3 font-semibold text-gold">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gold/15 font-display text-lg font-black">{m.name.charAt(0).toUpperCase()}</span>
                      {m.name}
                    </span>
                    <time dateTime={m.createdAt} className="tnum text-dust">
                      {new Date(m.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </time>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </div>
      </section>
    </main>
  );
}
