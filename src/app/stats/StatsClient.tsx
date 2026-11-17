'use client';

import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import { useState } from 'react';
import PageHero from '@/components/layout/PageHero';
import StatsDashboard from '@/components/stats/StatsDashboard';
import { Counter } from '@/components/fx/primitives';
import { photo } from '@/lib/photos';
import { cn } from '@/lib/utils';

type Row = { label: string; value: string; note?: string };

const book: Record<string, Row[]> = {
  Batting: [
    { label: 'ODI runs', value: '10,773', note: 'Avg 50.57' },
    { label: 'Test runs', value: '4,876', note: 'Avg 38.09' },
    { label: 'T20I runs', value: '1,617', note: 'SR 126.13' },
    { label: 'IPL runs', value: '5,000+' },
    { label: 'ODI hundreds', value: '10' },
    { label: 'Test hundreds', value: '6' },
    { label: 'ODI fifties', value: '73' },
    { label: 'Test fifties', value: '33' },
    { label: 'Highest ODI score', value: '183*', note: 'vs Sri Lanka, Jaipur 2005' },
    { label: 'Highest Test score', value: '224', note: 'vs Australia, Chennai 2013' },
    { label: 'International sixes', value: '359' },
    { label: 'ODI not-outs', value: '84', note: 'Most in ODI history' },
  ],
  Keeping: [
    { label: 'International dismissals', value: '829' },
    { label: 'Catches', value: '634' },
    { label: 'Stumpings', value: '195', note: 'Most in international cricket' },
    { label: 'ODI stumpings', value: '123' },
    { label: 'Test stumpings', value: '38' },
    { label: 'T20I stumpings', value: '34' },
    { label: 'ODI catches', value: '321' },
    { label: 'Test catches', value: '256' },
    { label: 'T20I catches', value: '57' },
    { label: 'Quickest recorded stumping', value: '0.08s', note: 'vs West Indies, 2018' },
  ],
  Captaincy: [
    { label: 'Internationals as captain', value: '332' },
    { label: 'International wins', value: '178' },
    { label: 'ODIs as captain', value: '200' },
    { label: 'ODI wins', value: '110' },
    { label: 'Test wins', value: '27', note: 'From 60 Tests' },
    { label: 'T20I wins', value: '41', note: 'From 72 T20Is' },
    { label: 'ICC trophies', value: '3', note: '2007 · 2011 · 2013' },
    { label: 'IPL titles', value: '5', note: '2010 · 2011 · 2018 · 2021 · 2023' },
    { label: 'Champions League T20', value: '2', note: '2010 · 2014' },
  ],
  Honours: [
    { label: 'Padma Bhushan', value: '2018' },
    { label: 'Padma Shri', value: '2009' },
    { label: 'Khel Ratna', value: '2008', note: 'For 2007' },
    { label: 'ICC ODI Player of the Year', value: '2', note: '2008 · 2009' },
    { label: 'ICC Spirit of Cricket', value: '2011' },
  ],
};

const tabs = Object.keys(book);

export default function StatsClient() {
  const [tab, setTab] = useState(tabs[0]);

  return (
    <main>
      <PageHero
        title="The record book"
        accent={['record']}
        backdrop={photo('bat-lifted-blue')}
        position="50% 30%"
        intro="Statistics don’t measure nerve. But they do keep score of what nerve achieved."
      />

      <section className="mx-auto max-w-[1500px] px-4 pb-10 sm:px-8">
        <LayoutGroup>
          <div role="tablist" aria-label="Record categories" className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
            {tabs.map((t) => (
              <button
                key={t}
                role="tab"
                aria-selected={tab === t}
                aria-controls="record-panel"
                onClick={() => setTab(t)}
                className={cn(
                  'relative shrink-0 rounded-full px-6 py-3 text-sm font-bold uppercase tracking-[0.12em] transition-colors',
                  tab === t ? 'text-night' : 'text-chalk hover:text-flood',
                )}
              >
                {tab === t && <motion.span layoutId="stat-tab" className="absolute inset-0 rounded-full bg-gold" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}
                <span className="relative">{t}</span>
              </button>
            ))}
          </div>
        </LayoutGroup>

        <div id="record-panel" role="tabpanel" aria-label={tab} className="mt-10">
          <AnimatePresence mode="wait">
            <motion.dl
              key={tab}
              className="grid border-t border-flood/10 md:grid-cols-2 md:gap-x-16"
              initial="hide"
              animate="show"
              exit="hide"
              variants={{ show: { transition: { staggerChildren: 0.04 } }, hide: {} }}
            >
              {book[tab].map((r) => (
                <motion.div
                  key={r.label}
                  className="group flex items-baseline justify-between gap-6 border-b border-flood/10 py-6"
                  variants={{ hide: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } } }}
                >
                  <dt>
                    <span className="block text-lg font-semibold text-flood">{r.label}</span>
                    {r.note && <span className="text-sm text-dust">{r.note}</span>}
                  </dt>
                  <dd className="font-display text-5xl font-black leading-none text-flood transition-colors duration-300 group-hover:text-gold md:text-6xl">
                    <Counter value={r.value} />
                  </dd>
                </motion.div>
              ))}
            </motion.dl>
          </AnimatePresence>
        </div>
      </section>

      <StatsDashboard />
    </main>
  );
}
