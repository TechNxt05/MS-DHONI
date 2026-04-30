'use client';

import { motion } from 'framer-motion';
import { Trophy, Clock3, Flame } from 'lucide-react';

const moments = [
  { year: '2005', title: '183* vs Sri Lanka', detail: 'A defining innings in Jaipur that announced a new ODI game-changer.', vibe: 'Arrival Mode' },
  { year: '2007', title: 'T20 World Cup Lift', detail: 'Young squad, fearless calls, and a captaincy era that started with a global title.', vibe: 'Revolution' },
  { year: '2008', title: 'No. 1 ODI Batter Era', detail: 'Dhoni rose to the top of ODI batting rankings and became cricket’s ultimate finisher.', vibe: 'Peak Engine' },
  { year: '2011', title: 'World Cup Final 91*', detail: 'Promoted himself and sealed India’s biggest win in decades with the iconic six.', vibe: 'Immortal' },
  { year: '2013', title: 'ICC Treble Complete', detail: 'Still the only captain to win ICC World T20, ODI World Cup, and Champions Trophy.', vibe: 'Supremacy' },
  { year: '2023', title: '5th IPL Trophy', detail: 'Long-term leadership excellence with another title in the twilight of his career.', vibe: 'Legacy++' },
];

export default function MomentsPage() {
  return (
    <main className="min-h-screen bg-black text-white pt-32 pb-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-14">
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter">
            Iconic <span className="text-csk-yellow">Moments</span>
          </h1>
          <p className="text-zinc-400 mt-4">The innings, decisions, and finishes that built the legend of MS Dhoni.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {moments.map((item, index) => (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 hover:border-csk-yellow/60 transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 text-sm rounded-full bg-csk-yellow text-black font-black">{item.year}</span>
                <span className="text-xs uppercase tracking-wider text-india-blue font-bold">{item.vibe}</span>
              </div>
              <h2 className="text-2xl font-black mb-2">{item.title}</h2>
              <p className="text-zinc-400 leading-relaxed">{item.detail}</p>
            </motion.article>
          ))}
        </div>

        <section className="mt-16 rounded-3xl border border-zinc-800 bg-gradient-to-r from-zinc-900 to-zinc-950 p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(253,185,19,0.12),_transparent_45%)]" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-zinc-800 p-5 bg-black/20 relative z-10">
              <Trophy className="text-csk-yellow mb-3" />
              <h3 className="font-bold text-lg">Big Match Aura</h3>
              <p className="text-sm text-zinc-400 mt-2">When stakes rise, composure rises higher.</p>
            </div>
            <div className="rounded-2xl border border-zinc-800 p-5 bg-black/20 relative z-10">
              <Clock3 className="text-india-blue mb-3" />
              <h3 className="font-bold text-lg">Timing Mastery</h3>
              <p className="text-sm text-zinc-400 mt-2">Dhoni rarely rushes; he controls the chase clock.</p>
            </div>
            <div className="rounded-2xl border border-zinc-800 p-5 bg-black/20 relative z-10">
              <Flame className="text-orange-400 mb-3" />
              <h3 className="font-bold text-lg">Finisher DNA</h3>
              <p className="text-sm text-zinc-400 mt-2">Calculated acceleration in death overs became a template.</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
