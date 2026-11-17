'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/lib/motion';
import { ArrowUpRight } from 'lucide-react';
import { captaincy, formats } from '@/lib/dhoni';
import { Counter, Reveal, SplitReveal } from '@/components/fx/primitives';

const cols = [
  { key: 'matches', label: 'Mat' },
  { key: 'runs', label: 'Runs' },
  { key: 'average', label: 'Avg' },
  { key: 'strikeRate', label: 'SR' },
  { key: 'best', label: 'HS' },
  { key: 'hundreds', label: '100' },
  { key: 'fifties', label: '50' },
  { key: 'catches', label: 'Ct' },
  { key: 'stumpings', label: 'St' },
] as const;

export default function StatsDashboard() {
  const reduce = useReducedMotion();
  const totalDismissals = formats.reduce((a, f) => a + f.catches + f.stumpings, 0);

  return (
    <section id="numbers" aria-labelledby="numbers-title" className="relative overflow-hidden bg-night py-28 md:py-40">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[60%] bg-[radial-gradient(ellipse_at_50%_0%,rgba(58,160,238,0.10),transparent_70%)]" />
      <div className="relative mx-auto max-w-[1500px] px-4 sm:px-8">
        <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
          <SplitReveal id="numbers-title"
            as="h2"
            text="The scoreboard never lies"
            accent={['never']}
            className="font-display text-[clamp(3rem,8vw,6rem)] font-black uppercase leading-[0.85] tracking-[-0.02em]"
          />
          <Reveal delay={0.2}>
            <Link href="/stats" className="group inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.14em] text-gold">
              Every record
              <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </Reveal>
        </div>

        {/* The board. */}
        <Reveal className="mt-14" delay={0.1}>
          <div className="overflow-hidden rounded-[28px] border border-flood/10 bg-pitch shadow-[0_40px_80px_-40px_rgba(0,0,0,0.9)]">
            <div className="flex items-center justify-between border-b border-flood/10 px-5 py-4 md:px-8">
              <p className="font-display text-lg font-bold uppercase tracking-[0.18em] text-chalk">MS Dhoni · International career</p>
              <p className="text-xs uppercase tracking-[0.18em] text-dust">Final figures · 2004–2019</p>
            </div>
            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full min-w-[760px] border-collapse text-left">
                <caption className="sr-only">MS Dhoni international batting and wicketkeeping figures by format</caption>
                <thead>
                  <tr className="text-xs uppercase tracking-[0.16em] text-dust">
                    <th scope="col" className="sticky left-0 bg-pitch px-5 py-4 font-semibold md:px-8">Format</th>
                    {cols.map((c) => (
                      <th key={c.key} scope="col" className="px-4 py-4 text-right font-semibold">
                        {c.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {formats.map((f, row) => (
                    <motion.tr
                      key={f.format}
                      className="group border-t border-flood/[0.07] transition-colors hover:bg-gold/[0.06]"
                      initial={reduce ? false : { opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.15 + row * 0.1 }}
                    >
                      <th scope="row" className="sticky left-0 bg-pitch px-5 py-6 font-display text-3xl font-black uppercase transition-colors group-hover:bg-[#15140f] group-hover:text-gold md:px-8 md:text-4xl">
                        {f.format}
                      </th>
                      {cols.map((c) => (
                        <td key={c.key} className="px-4 py-6 text-right font-display text-2xl font-bold text-flood md:text-3xl">
                          <Counter value={String(f[c.key])} />
                        </td>
                      ))}
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Dismissal split: catches against stumpings, by format. */}
            <div className="grid gap-6 border-t border-flood/10 px-5 py-6 md:grid-cols-[auto_1fr] md:items-center md:gap-10 md:px-8">
              <p className="text-sm text-chalk">
                <Counter value={String(totalDismissals)} className="font-display text-3xl font-black text-flood" />{' '}
                dismissals behind the stumps
              </p>
              <div className="space-y-2">
                {formats.map((f) => {
                  const total = f.catches + f.stumpings;
                  return (
                    <div key={f.format} className="flex items-center gap-3 text-xs uppercase tracking-[0.12em] text-dust">
                      <span className="w-10">{f.format}</span>
                      <div className="flex h-2 flex-1 overflow-hidden rounded-full bg-flood/10" role="img" aria-label={`${f.format}: ${f.catches} catches, ${f.stumpings} stumpings`}>
                        <motion.div
                          className="h-full bg-blue"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${(f.catches / 600) * 100}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
                        />
                        <motion.div
                          className="h-full bg-gold"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${(f.stumpings / 600) * 100}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                        />
                      </div>
                      <span className="tnum w-16 text-right text-chalk">{total}</span>
                    </div>
                  );
                })}
                <div className="flex gap-5 pt-1 text-[11px] uppercase tracking-[0.14em] text-dust">
                  <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-blue" /> Catches</span>
                  <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-gold" /> Stumpings</span>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Captaincy, written as a sentence rather than a tile grid. */}
        <Reveal className="mt-20" delay={0.1}>
          <p className="max-w-[22ch] font-display text-[clamp(2.4rem,5.4vw,4.6rem)] font-black uppercase leading-[0.95] text-chalk">
            Captain in <Counter value={String(captaincy.matches)} className="text-flood" /> internationals.{' '}
            <Counter value={String(captaincy.wins)} className="text-gold" /> wins.{' '}
            <span className="text-flood">Every white-ball ICC trophy</span> there was to win.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
