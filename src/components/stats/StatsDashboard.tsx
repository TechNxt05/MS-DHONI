'use client';

import { motion } from 'framer-motion';
import { Trophy, Disc, Target } from 'lucide-react';

const stats = [
    { label: 'ODI Runs', value: '10,773', icon: Disc, color: 'text-india-blue' },
    { label: 'T20 Words', value: '1,617', icon: Disc, color: 'text-india-blue' },
    { label: 'Test Runs', value: '4,876', icon: Disc, color: 'text-india-blue' },
    { label: 'Stumpings', value: '195', icon: Target, color: 'text-csk-yellow' },
    { label: 'Catches', value: '634', icon: Target, color: 'text-csk-yellow' },
    { label: 'Centuries', value: '16', icon: Trophy, color: 'text-white' },
];

export default function StatsDashboard() {
    return (
        <section id="stats" className="py-24 bg-black text-white">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white mb-2">
                        The <span className="text-india-blue">Numbers</span>
                    </h2>
                    <p className="text-zinc-400">Records that speak for themselves.</p>
                </motion.div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col items-center justify-center text-center hover:bg-zinc-800 transition-colors group"
                        >
                            <stat.icon className={`w-8 h-8 mb-4 ${stat.color} group-hover:scale-110 transition-transform`} />
                            <h3 className="text-3xl font-bold mb-1">{stat.value}</h3>
                            <p className="text-sm text-zinc-500 uppercase tracking-widest">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Placeholder for a more complex chart if needed in future, keeping it clean for now */}
                <div className="mt-16 p-8 rounded-3xl bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-csk-yellow/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="md:w-1/2 text-left">
                            <h3 className="text-2xl font-bold text-white mb-4">Captaincy Record</h3>
                            <p className="text-zinc-400 mb-6">
                                The only captain to win all three major ICC trophies. His leadership style, often described as calm and composed, earned him the nickname 'Captain Cool'.
                            </p>
                            <div className="flex gap-4">
                                <div className="px-4 py-2 bg-zinc-800 rounded-lg border border-zinc-700">
                                    <span className="block text-2xl font-bold text-csk-yellow">332</span>
                                    <span className="text-xs text-zinc-500">Matches</span>
                                </div>
                                <div className="px-4 py-2 bg-zinc-800 rounded-lg border border-zinc-700">
                                    <span className="block text-2xl font-bold text-green-500">178</span>
                                    <span className="text-xs text-zinc-500">Wins</span>
                                </div>
                                <div className="px-4 py-2 bg-zinc-800 rounded-lg border border-zinc-700">
                                    <span className="block text-2xl font-bold text-white">53.61%</span>
                                    <span className="text-xs text-zinc-500">Win Rate</span>
                                </div>
                            </div>
                        </div>
                        {/* Visual decoration */}
                        <div className="md:w-1/2 flex justify-center">
                            <Trophy className="w-32 h-32 text-csk-yellow opacity-20 rotate-12" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
