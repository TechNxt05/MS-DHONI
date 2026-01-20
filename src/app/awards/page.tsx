'use client';

import { motion } from 'framer-motion';
import { Trophy, Medal, Crown, Star, Award, Shield, Globe, Zap, Users } from 'lucide-react';

const awards = [
    // --- ICC Trophies & Major Titles (Captaincy) ---
    { name: "ICC T20 World Cup 2007", category: "Major Titles", year: "2007", icon: Globe, desc: "Inaugural Champions" },
    { name: "ICC ODI World Cup 2011", category: "Major Titles", year: "2011", icon: Globe, desc: "Ended 28-year wait" },
    { name: "ICC Champions Trophy 2013", category: "Major Titles", year: "2013", icon: Globe, desc: "Completed ICC Treble" },
    { name: "ICC Test Mace 2010", category: "Major Titles", year: "2010", icon: Shield, desc: "World No. 1 Test Team" },
    { name: "ICC Test Mace 2011", category: "Major Titles", year: "2011", icon: Shield, desc: "Retained No. 1 Ranking" },
    { name: "Asia Cup (ODI) 2010", category: "Major Titles", year: "2010", icon: Trophy, desc: "Champions" },
    { name: "Asia Cup (T20) 2016", category: "Major Titles", year: "2016", icon: Trophy, desc: "Champions" },

    // --- IPL & CLT20 Titles ---
    { name: "IPL Champion 2010", category: "League Titles", year: "2010", icon: Crown, desc: "Chennai Super Kings" },
    { name: "IPL Champion 2011", category: "League Titles", year: "2011", icon: Crown, desc: "Back-to-Back Wins" },
    { name: "IPL Champion 2018", category: "League Titles", year: "2018", icon: Crown, desc: "The Comeback" },
    { name: "IPL Champion 2021", category: "League Titles", year: "2021", icon: Crown, desc: "CSK Dominance" },
    { name: "IPL Champion 2023", category: "League Titles", year: "2023", icon: Crown, desc: "5th Title Legend" },
    { name: "CLT20 Winner 2010", category: "League Titles", year: "2010", icon: Star, desc: "Champions League" },
    { name: "CLT20 Winner 2014", category: "League Titles", year: "2014", icon: Star, desc: "Champions League" },

    // --- National Honours ---
    { name: "Padma Bhushan", category: "National Honours", year: "2018", icon: Medal, desc: "3rd Highest Civilian Award" },
    { name: "Padma Shri", category: "National Honours", year: "2009", icon: Medal, desc: "4th Highest Civilian Award" },
    { name: "Rajiv Gandhi Khel Ratna", category: "National Honours", year: "2007", icon: Medal, desc: "Highest Sporting Honour" },
    { name: "Honorary Lt. Colonel", category: "National Honours", year: "2011", icon: Medal, desc: "Territorial Army" },

    // --- ICC Individual Awards ---
    { name: "ICC ODI Player of the Year", category: "Individual Honours", year: "2008", icon: Award, desc: "First Indian to win" },
    { name: "ICC ODI Player of the Year", category: "Individual Honours", year: "2009", icon: Award, desc: "Consecutive Winner" },
    { name: "ICC World ODI XI Captain", category: "Individual Honours", year: "2009", icon: Users, desc: "Leader of World XI" },
    { name: "ICC World ODI XI Captain", category: "Individual Honours", year: "2011", icon: Users, desc: "Leader of World XI" },
    { name: "ICC World ODI XI Captain", category: "Individual Honours", year: "2012", icon: Users, desc: "Leader of World XI" },
    { name: "ICC World ODI XI Captain", category: "Individual Honours", year: "2013", icon: Users, desc: "Leader of World XI" },
    { name: "ICC World ODI XI Captain", category: "Individual Honours", year: "2014", icon: Users, desc: "Leader of World XI" },
    { name: "ICC Spirit of Cricket Award", category: "Individual Honours", year: "2011", icon: Award, desc: "For recalling Ian Bell" },
    { name: "ICC Men's ODI Team of Decade", category: "Individual Honours", year: "2020", icon: Award, desc: "Captain & Wicketkeeper" },
    { name: "ICC Men's T20I Team of Decade", category: "Individual Honours", year: "2020", icon: Award, desc: "Captain & Wicketkeeper" },
    { name: "ICC Spirit of Cricket of Decade", category: "Individual Honours", year: "2020", icon: Award, desc: "Decade Honour" },

    // --- Other Prestigious Awards ---
    { name: "MTV Youth Icon", category: "Other Awards", year: "2006", icon: Zap, desc: "Influence on Youth" },
    { name: "CNN-IBN Indian of the Year", category: "Other Awards", year: "2011", icon: Zap, desc: "Sports Category" },
    { name: "Castrol Indian Cricketer", category: "Other Awards", year: "2011", icon: Zap, desc: "Year Award" },
    { name: "LG People's Choice Award", category: "Other Awards", year: "2013", icon: Zap, desc: "Fan Voted" },
    { name: "De Montfort Doctorate", category: "Honorary Degrees", year: "2011", icon: Award, desc: "Honorary Degree" },

    // --- Man of the Match/Series Highlights (Select) ---
    { name: "Man of the Series", category: "Match Awards", year: "2011", icon: Star, desc: "vs England (ODI)" },
    { name: "Man of the Series", category: "Match Awards", year: "2009", icon: Star, desc: "vs West Indies (ODI)" },
    { name: "Man of the Series", category: "Match Awards", year: "2008", icon: Star, desc: "vs Sri Lanka (ODI)" },
    { name: "Man of the Series", category: "Match Awards", year: "2013", icon: Star, desc: "Tri-Nation Series" },
    { name: "Man of the Match (WC Final)", category: "Match Awards", year: "2011", icon: Crown, desc: "91* vs Sri Lanka" },
    { name: "Man of the Match", category: "Match Awards", year: "2012", icon: Star, desc: "vs Pakistan (ODI 113*)" },
    { name: "Man of the Match", category: "Match Awards", year: "2013", icon: Star, desc: "vs Australia (Test 224)" },
    { name: "Man of the Match", category: "Match Awards", year: "2005", icon: Star, desc: "vs Pakistan (148)" },
    { name: "Man of the Match", category: "Match Awards", year: "2005", icon: Star, desc: "vs Sri Lanka (183*)" },
    { name: "Man of the Match", category: "Match Awards", year: "2008", icon: Star, desc: "vs Australia (CB Series)" },
    { name: "Man of the Match", category: "Match Awards", year: "2009", icon: Star, desc: "vs New Zealand (Test)" },
    { name: "Man of the Match", category: "Match Awards", year: "2010", icon: Star, desc: "vs South Africa (Test)" },
    { name: "Man of the Match", category: "Match Awards", year: "2011", icon: Star, desc: "vs West Indies (Test)" },
    { name: "Man of the Match", category: "Match Awards", year: "2013", icon: Star, desc: "vs Australia (Test)" },
    { name: "Man of the Match IPL Final", category: "Match Awards", year: "2010", icon: Crown, desc: "CSK vs MI" },
    { name: "Man of the Match", category: "Match Awards", year: "2019", icon: Star, desc: "vs Australia (ODI)" },
];

export default function AwardsPage() {
    // Group records by category
    const groupedAwards = awards.reduce((acc, item) => {
        if (!acc[item.category]) acc[item.category] = [];
        acc[item.category].push(item);
        return acc;
    }, {} as Record<string, typeof awards>);

    return (
        <main className="min-h-screen bg-black text-white pt-32 pb-20 px-4">
            <div className="fixed top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-csk-yellow/10 via-black to-black z-0 pointer-events-none" />
            <div className="fixed top-0 left-0 w-full h-full bg-[url('/noise.png')] opacity-5 pointer-events-none z-0" />

            <div className="relative z-10 container mx-auto max-w-6xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-20"
                >
                    <h1 className="text-6xl md:text-9xl font-black uppercase tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-b from-csk-yellow to-yellow-700">
                        Glory
                    </h1>
                    <p className="text-xl text-zinc-400 max-w-2xl mx-auto uppercase tracking-widest">
                        The Trophy Cabinet of a Legend
                    </p>
                </motion.div>

                <div className="space-y-16">
                    {Object.entries(groupedAwards).map(([category, items], categoryIndex) => (
                        <motion.div
                            key={category}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ delay: categoryIndex * 0.1 }}
                        >
                            <div className="flex items-center gap-4 mb-8">
                                <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-csk-yellow/50" />
                                <h2 className="text-2xl font-bold uppercase tracking-widest text-csk-yellow border border-csk-yellow/30 px-6 py-2 rounded-full bg-black/50 backdrop-blur-md">
                                    {category}
                                </h2>
                                <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-csk-yellow/50" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {items.map((award, i) => (
                                    <div
                                        key={i}
                                        className="relative group flex items-start p-6 rounded-xl bg-zinc-900/40 border border-white/5 hover:border-csk-yellow/50 transition-all duration-300 hover:bg-zinc-800/60"
                                    >
                                        <div className="relative z-10 mr-4 mt-1 p-3 rounded-full bg-csk-yellow/10 text-csk-yellow group-hover:bg-csk-yellow group-hover:text-black transition-colors">
                                            <award.icon size={24} />
                                        </div>
                                        <div className="relative z-10">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-bold text-lg text-white group-hover:text-csk-yellow transition-colors">{award.name}</h3>
                                            </div>
                                            <p className="text-sm text-zinc-500 font-mono mb-1">{award.year}</p>
                                            <p className="text-sm text-zinc-400 group-hover:text-white transition-colors">{award.desc}</p>
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
