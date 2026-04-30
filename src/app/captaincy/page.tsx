'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Brain, Target } from 'lucide-react';

type Scenario = {
  id: string;
  title: string;
  setup: string;
  options: string[];
  answer: number;
  insight: string;
};

const scenarios: Scenario[] = [
  {
    id: 'powerplay-defend',
    title: 'Defending 12 in the final over',
    setup: 'You are captain. New batter on strike, dew on ground, medium pacer has one over left.',
    options: ['Go yorkers outside off with long-off/long-on', 'Use spinner for surprise', 'Set defensive field and bowl back of length'],
    answer: 0,
    insight: 'Dhoni often preferred clarity over surprise in death overs: executeable plans with trusted bowlers.',
  },
  {
    id: 'chase-order',
    title: 'Chasing 270 in a knockout',
    setup: 'Top order fails early. You are at no. 6. Required rate climbing.',
    options: ['Promote yourself now and absorb pressure', 'Send a hitter and wait', 'Try all-out attack immediately'],
    answer: 0,
    insight: 'In 2011 final style situations, Dhoni stepped up and controlled the tempo personally.',
  },
  {
    id: 'spinner-use',
    title: 'Middle overs, left-right pair settled',
    setup: 'Batters rotating strike well. You need a wicket without leaking boundaries.',
    options: ['Bring part-timer for one over', 'Switch ends for primary spinner and attack stumps', 'Spread field and wait'],
    answer: 1,
    insight: 'Subtle angle changes and wicket-to-wicket pressure were classic Dhoni control methods.',
  },
];

export default function CaptaincyPage() {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const score = useMemo(
    () =>
      scenarios.reduce((acc, s) => acc + (answers[s.id] === s.answer ? 1 : 0), 0),
    [answers]
  );

  return (
    <main className="min-h-screen bg-black text-white pt-32 pb-20 px-4">
      <div className="container mx-auto max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-14">
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter">
            Captaincy <span className="text-csk-yellow">Lab</span>
          </h1>
          <p className="text-zinc-400 mt-4">Test your tactical instinct against Dhoni-style match decisions.</p>
        </motion.div>

        <section className="mb-8 rounded-2xl border border-zinc-800 bg-gradient-to-r from-zinc-900 to-zinc-950 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="rounded-xl border border-zinc-800 bg-black/30 p-4">
              <p className="text-csk-yellow font-black mb-1">Field Craft</p>
              <p className="text-zinc-400">Dhoni built pressure through subtle field shifts and wicket-to-wicket plans.</p>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-black/30 p-4">
              <p className="text-india-blue font-black mb-1">Bowler Trust</p>
              <p className="text-zinc-400">He backed bowlers with clear plans instead of panic changes under pressure.</p>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-black/30 p-4">
              <p className="text-emerald-400 font-black mb-1">Chase Control</p>
              <p className="text-zinc-400">His finishing method prioritized game state over ego strike-rate spikes.</p>
            </div>
          </div>
        </section>

        <div className="space-y-8">
          {scenarios.map((s, i) => (
            <section key={s.id} className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
              <div className="flex items-center justify-between gap-4 mb-3">
                <h2 className="text-2xl font-black">{i + 1}. {s.title}</h2>
                <span className="text-xs uppercase tracking-widest text-india-blue font-bold">Scenario</span>
              </div>
              <p className="text-zinc-400 mb-5">{s.setup}</p>
              <div className="grid gap-3">
                {s.options.map((option, idx) => (
                  <button
                    key={option}
                    onClick={() => setAnswers((prev) => ({ ...prev, [s.id]: idx }))}
                    className={`text-left rounded-xl border p-4 transition-colors ${
                      answers[s.id] === idx
                        ? 'border-csk-yellow bg-csk-yellow/10 text-white'
                        : 'border-zinc-700 bg-zinc-950 text-zinc-300 hover:border-zinc-500'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
              {typeof answers[s.id] === 'number' && (
                <p className="mt-4 text-sm text-zinc-300">
                  {answers[s.id] === s.answer ? 'Correct tactical call. ' : 'Interesting choice. '}
                  <span className="text-csk-yellow">{s.insight}</span>
                </p>
              )}
            </section>
          ))}
        </div>

        <section className="mt-10 rounded-2xl border border-zinc-800 bg-gradient-to-r from-zinc-900 to-zinc-950 p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className="text-2xl font-black">Your Captain Cool Score</h3>
            <p className="text-zinc-400">Higher score means closer to Dhoni-style decision making.</p>
          </div>
          <div className="text-4xl font-black text-csk-yellow">{score}/{scenarios.length}</div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <div className="rounded-xl border border-zinc-800 p-4 bg-zinc-900/40"><ShieldCheck className="text-csk-yellow mb-2" />Calm in chaos</div>
          <div className="rounded-xl border border-zinc-800 p-4 bg-zinc-900/40"><Brain className="text-india-blue mb-2" />Field intelligence</div>
          <div className="rounded-xl border border-zinc-800 p-4 bg-zinc-900/40"><Target className="text-green-400 mb-2" />Execution focus</div>
        </div>
      </div>
    </main>
  );
}
