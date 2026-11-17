'use client';

import { ArrowUpRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import PageHero from '@/components/layout/PageHero';
import { Reveal, spotlightHandler } from '@/components/fx/primitives';
import { photo, photos } from '@/lib/photos';
import type { NewsArticle } from '@/lib/news';
import { cn } from '@/lib/utils';

// Our own photography stands in when a story has no image or its image fails.
const fallbacks = photos.filter((p) => p.tag === 'india' || p.tag === 'csk');

function StoryImage({ src, alt, index, className }: { src: string; alt: string; index: number; className?: string }) {
  const [failed, setFailed] = useState(!src);
  const fallback = fallbacks[index % fallbacks.length];
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={failed ? fallback.src : src}
      alt={failed ? fallback.alt : alt}
      loading="lazy" decoding="async"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}

export default function NewsClient() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    fetch('/api/news')
      .then((r) => r.json())
      .then((d) => {
        if (!d.success) throw new Error();
        setArticles(d.data);
        setState('ready');
      })
      .catch(() => setState('error'));
  }, []);

  const [lead, ...rest] = articles;
  const date = (iso: string) => new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <main>
      <PageHero title="Latest from the dressing room" accent={['dressing']} backdrop={photo('chase-mode')} position="50% 30%" intro="News, records and stories from around the cricket world." />

      <section className="mx-auto max-w-[1500px] px-4 pb-28 sm:px-8" aria-live="polite" aria-busy={state === 'loading'}>
        {state === 'loading' && (
          <div className="grid gap-5 md:grid-cols-3">
            <div className="h-[420px] animate-pulse rounded-[28px] bg-flood/[0.04] md:col-span-2" />
            <div className="h-[420px] animate-pulse rounded-[28px] bg-flood/[0.04]" />
          </div>
        )}
        {state === 'error' && <p className="text-chalk">The news feed is offline right now. Try again in a few minutes.</p>}

        {state === 'ready' && lead && (
          <>
            <Reveal>
              <a href={lead.url} target="_blank" rel="noreferrer" onPointerMove={spotlightHandler} data-cursor="Read" className="spotlight group relative grid overflow-hidden rounded-[32px] border border-flood/10 bg-pitch md:grid-cols-[1.4fr_1fr]">
                <div className="relative aspect-[16/10] overflow-hidden md:aspect-auto">
                  <StoryImage src={lead.urlToImage} alt={lead.title} index={0} className="h-full w-full object-cover transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-105" />
                </div>
                <div className="flex flex-col justify-end p-7 md:p-10">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
                    {lead.source.name} · <time dateTime={lead.publishedAt}>{date(lead.publishedAt)}</time>
                  </p>
                  <h2 className="mt-4 font-display text-4xl font-black uppercase leading-[0.92] md:text-5xl">{lead.title}</h2>
                  <p className="mt-4 text-chalk">{lead.description}</p>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.12em] text-flood transition-colors group-hover:text-gold">
                    Read the story <ArrowUpRight className="h-4 w-4" />
                    <span className="sr-only">(opens in a new tab)</span>
                  </span>
                </div>
              </a>
            </Reveal>

            <ul className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {rest.map((a, i) => (
                <li key={a.url + i}>
                  <Reveal delay={(i % 3) * 0.06}>
                    <a href={a.url} target="_blank" rel="noreferrer" className="group flex h-full flex-col overflow-hidden rounded-[24px] border border-flood/10 bg-pitch transition-colors hover:border-gold/40">
                      <div className="aspect-[16/9] overflow-hidden">
                        <StoryImage src={a.urlToImage} alt={a.title} index={i + 1} className="h-full w-full object-cover transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-105" />
                      </div>
                      <div className="flex flex-1 flex-col p-6">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
                          {a.source.name} · <time dateTime={a.publishedAt}>{date(a.publishedAt)}</time>
                        </p>
                        <h3 className={cn('mt-3 font-display text-2xl font-black uppercase leading-[0.95] transition-colors group-hover:text-gold')}>{a.title}</h3>
                        <p className="mt-3 line-clamp-3 text-sm text-chalk">{a.description}</p>
                      </div>
                    </a>
                  </Reveal>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>
    </main>
  );
}
