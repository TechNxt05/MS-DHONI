'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Globe2, Sparkles, MessageCircleHeart, MapPinned } from 'lucide-react';

const fanFeatures = [
  {
    title: 'Fan Corner',
    description: 'Post your message to Captain Cool and read tributes from around the world.',
    href: '/fans',
    cta: 'Open Guestbook',
  },
  {
    title: 'Thala Universe',
    description: 'Meme logic, number seven chaos, and celebratory fan interactions.',
    href: '/thala',
    cta: 'Enter Thala 7',
  },
  {
    title: 'Global Fan Map (Coming Next)',
    description: 'Pin your city and become part of Dhoni’s worldwide digital stand.',
    href: '/fan-map',
    cta: 'Open Fan Map',
  },
];

export default function FanUniversePage() {
  return (
    <main className="min-h-screen bg-black text-white pt-32 pb-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-14">
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter">
            Fan <span className="text-csk-yellow">Universe</span>
          </h1>
          <p className="text-zinc-400 mt-4 max-w-3xl mx-auto">
            This is the community wing of the tribute website. The core remains dedicated to Dhoni’s supremacy,
            while this zone turns fan emotion into interactive experiences.
          </p>
        </motion.div>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {fanFeatures.map((feature, index) => (
            <motion.article
              key={feature.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 hover:border-csk-yellow/50 transition-colors"
            >
              <h2 className="text-2xl font-black mb-2">{feature.title}</h2>
              <p className="text-zinc-400 mb-6">{feature.description}</p>
              <Link href={feature.href} className="inline-flex px-4 py-2 rounded-full bg-csk-yellow text-black font-black">
                {feature.cta}
              </Link>
            </motion.article>
          ))}
        </section>

        <section className="mt-12 rounded-3xl border border-zinc-800 bg-gradient-to-r from-zinc-900 to-zinc-950 p-8">
          <h3 className="text-3xl font-black mb-4">What keeps this tribute-first?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-zinc-300">
            <p className="rounded-xl border border-zinc-800 p-4 bg-black/20"><Sparkles className="inline mr-2 text-csk-yellow" />Every fan feature links back to a real Dhoni legacy moment.</p>
            <p className="rounded-xl border border-zinc-800 p-4 bg-black/20"><Globe2 className="inline mr-2 text-india-blue" />Community layer is optional and does not overshadow biography/stats/timeline.</p>
            <p className="rounded-xl border border-zinc-800 p-4 bg-black/20"><MessageCircleHeart className="inline mr-2 text-rose-400" />Messages are respectful-by-design and tribute themed.</p>
            <p className="rounded-xl border border-zinc-800 p-4 bg-black/20"><MapPinned className="inline mr-2 text-emerald-400" />Future fan map focuses on appreciation, not noise.</p>
          </div>
        </section>
      </div>
    </main>
  );
}
