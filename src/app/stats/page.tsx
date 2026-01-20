'use client';

import { motion } from 'framer-motion';
import { Trophy, Target, Hash, Crown, Star, Medal, Award, TrendingUp } from 'lucide-react';

const stats = [
    { label: "ODI Matches", value: "350", category: "Matches" },
    { label: "Test Matches", value: "90", category: "Matches" },
    { label: "T20I Matches", value: "98", category: "Matches" },
    { label: "IPL Matches", value: "250+", category: "Matches" },

    { label: "ODI Runs", value: "10,773", category: "Batting" },
    { label: "Test Runs", value: "4,876", category: "Batting" },
    { label: "T20I Runs", value: "1,617", category: "Batting" },
    { label: "IPL Runs", value: "5,000+", category: "Batting" },
    { label: "ODI Centuries", value: "10", category: "Batting" },
    { label: "Test Centuries", value: "6", category: "Batting" },
    { label: "ODI 50s", value: "73", category: "Batting" },
    { label: "Test 50s", value: "33", category: "Batting" },
    { label: "Highest ODI Score", value: "183*", category: "Batting" },
    { label: "Highest Test Score", value: "224", category: "Batting" },
    { label: "Intl. Sixes", value: "359", category: "Batting" },
    { label: "IPL Sixes", value: "239+", category: "Batting" },
    { label: "Not Outs (ODI)", value: "84", category: "Batting" },
    { label: "Average (ODI)", value: "50.57", category: "Batting" },

    { label: "Intl. Stumpings", value: "195", category: "Keeping" },
    { label: "ODI Stumpings", value: "123", category: "Keeping" },
    { label: "Test Stumpings", value: "38", category: "Keeping" },
    { label: "T20I Stumpings", value: "34", category: "Keeping" },
    { label: "Intl. Catches", value: "634", category: "Keeping" },
    { label: "ODI Catches", value: "321", category: "Keeping" },
    { label: "Test Catches", value: "256", category: "Keeping" },
    { label: "T20I Catches", value: "57", category: "Keeping" },
    { label: "IPL Dismissals", value: "180+", category: "Keeping" },

    { label: "Trophies Won", value: "All 3 ICC", category: "Captaincy" },
    { label: "ODI Wins", value: "110", category: "Captaincy" },
    { label: "Test Wins", value: "27", category: "Captaincy" },
    { label: "T20I Wins", value: "41", category: "Captaincy" },
    { label: "IPL Titles", value: "5", category: "Captaincy" },
    { label: "CLT20 Titles", value: "2", category: "Captaincy" },
    { label: "Win % (ODI)", value: "59.52%", category: "Captaincy" },
    { label: "Matches as Captain", value: "332", category: "Captaincy" },

    { label: "ICC Player of Year", value: "2", category: "Awards" },
    { label: "Padma Bhushan", value: "2018", category: "Awards" },
    { label: "Padma Shri", value: "2009", category: "Awards" },
    { label: "Khel Ratna", value: "2007-08", category: "Awards" },
    { label: "Fastest Stumping", value: "0.08s", category: "Records" },
    { label: "Most Not Outs", value: "World Record", category: "Records" },
];

export default function StatsPage() {
    // Group stats by category
    const groupedStats = stats.reduce((acc, stat) => {
        if (!acc[stat.category]) acc[stat.category] = [];
        acc[stat.category].push(stat);
        return acc;
    }, {} as Record<string, typeof stats>);

    return (
        <main className="min-h-screen bg-black text-white pt-32 pb-20 px-4">
            <div className="fixed top-0 left-0 w-full h-full bg-[url('/noise.png')] opacity-5 pointer-events-none z-0" />
            <div className="fixed top-0 left-0 w-full h-full bg-gradient-to-br from-india-blue/10 via-black to-csk-yellow/10 pointer-events-none z-0" />

            <div className="relative z-10 container mx-auto max-w-6xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-20"
                >
                    <h1 className="text-6xl md:text-9xl font-black uppercase tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-r from-csk-yellow to-white">
                        The Numbers
                    </h1>
                    <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
                        "Statistics don't measure passion, but they sure do tell a story of dominance."
                    </p>
                </motion.div>

                <div className="space-y-20">
                    {Object.entries(groupedStats).map(([category, items], categoryIndex) => (
                        <motion.div
                            key={category}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ delay: categoryIndex * 0.1 }}
                        >
                            <div className="flex items-center gap-4 mb-8">
                                <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-zinc-700" />
                                <h2 className="text-3xl font-bold uppercase tracking-widest text-csk-yellow">{category}</h2>
                                <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-zinc-700" />
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                {items.map((stat, i) => (
                                    <div
                                        key={i}
                                        className="relative group p-6 rounded-2xl bg-zinc-900/50 border border-white/5 hover:border-csk-yellow/50 transition-all duration-300 hover:-translate-y-2"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-csk-yellow/5 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity" />
                                        <div className="relative z-10">
                                            <p className="text-sm uppercase tracking-wider text-zinc-500 mb-2">{stat.label}</p>
                                            <p className="text-3xl md:text-4xl font-black text-white group-hover:text-csk-yellow transition-colors">
                                                {stat.value}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </main>
    );
}
