'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';

type Scenario = {
  id: string;
  target: string;
  ballsLeft: number;
  options: Array<{ label: string; runs: number; riskOut?: boolean }>;
};

const scenarios: Scenario[] = [
  {
    id: '6off4',
    target: '6 runs needed',
    ballsLeft: 4,
    options: [
      { label: 'Take 2, keep strike moving', runs: 2 },
      { label: 'Go for big six now', runs: 6, riskOut: true },
      { label: 'Take single and read bowler', runs: 1 },
    ],
  },
  {
    id: '12off6',
    target: '12 runs needed',
    ballsLeft: 6,
    options: [
      { label: 'Boundary-first approach', runs: 4 },
      { label: 'Rotate and target final 2 balls', runs: 2 },
      { label: 'All-or-nothing slog', runs: 6, riskOut: true },
    ],
  },
];

export default function PressureModePage() {
  const [selected, setSelected] = useState<Record<string, number>>({});
  const [leaderboardName, setLeaderboardName] = useState('');
  const [leaderboard, setLeaderboard] = useState<Array<{ _id: string; name: string; score: number }>>([]);
  const calmScore = useMemo(
    () =>
      scenarios.reduce((acc, s) => {
        const choice = s.options[selected[s.id] ?? -1];
        if (!choice) return acc;
        if (choice.riskOut) return acc + 2;
        if (choice.runs >= 4) return acc + 4;
        return acc + 6;
      }, 0),
    [selected]
  );

  const loadLeaderboard = async () => {
    const res = await fetch('/api/pressure-scores');
    const data = await res.json();
    if (data.success) setLeaderboard(data.data);
  };

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const submitScore = async () => {
    if (!leaderboardName.trim()) return;
    await fetch('/api/pressure-scores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: leaderboardName.trim(), score: calmScore }),
    });
    setLeaderboardName('');
    await loadLeaderboard();
  };

  return (
    <main className="min-h-screen bg-black text-white pt-32 pb-20 px-4">
      <div className="container mx-auto max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter">
            Pressure <span className="text-csk-yellow">Mode</span>
          </h1>
          <p className="text-zinc-400 mt-4">Finish a chase with Dhoni-style calm decision making.</p>
        </motion.div>

        <div className="space-y-6">
          {scenarios.map((scenario, index) => (
            <section key={scenario.id} className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
              <h2 className="text-2xl font-black mb-2">Scenario {index + 1}</h2>
              <p className="text-zinc-300 mb-1">{scenario.target}</p>
              <p className="text-zinc-500 mb-4">{scenario.ballsLeft} balls left. Crowd is loud. Stay ice-cool.</p>
              <div className="grid gap-3">
                {scenario.options.map((option, idx) => (
                  <button
                    key={option.label}
                    onClick={() => setSelected((prev) => ({ ...prev, [scenario.id]: idx }))}
                    className={`text-left p-4 rounded-xl border transition-colors ${
                      selected[scenario.id] === idx
                        ? 'border-csk-yellow bg-csk-yellow/10'
                        : 'border-zinc-700 bg-zinc-950 hover:border-zinc-500'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </section>
          ))}
        </div>

        <section className="mt-8 rounded-2xl border border-zinc-800 bg-gradient-to-r from-zinc-900 to-zinc-950 p-6 flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-black">Captain Cool Meter</h3>
            <p className="text-zinc-400">Higher means composed and tactical under pressure.</p>
          </div>
          <div className="text-5xl font-black text-csk-yellow">{calmScore}</div>
        </section>
        <section className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
          <h3 className="text-2xl font-black mb-4">Leaderboard</h3>
          <div className="flex gap-3 mb-5">
            <input
              value={leaderboardName}
              onChange={(e) => setLeaderboardName(e.target.value)}
              placeholder="Your name"
              className="rounded-lg p-3 bg-zinc-950 border border-zinc-700 flex-1"
            />
            <button onClick={submitScore} className="rounded-full px-5 bg-csk-yellow text-black font-black">
              Submit
            </button>
          </div>
          <div className="grid gap-2">
            {leaderboard.map((entry, idx) => (
              <div key={entry._id} className="rounded-lg border border-zinc-800 bg-black/20 p-3 flex items-center justify-between">
                <p className="font-semibold">#{idx + 1} {entry.name}</p>
                <p className="text-csk-yellow font-black">{entry.score}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
