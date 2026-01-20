'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Trophy, Calendar, MapPin } from 'lucide-react';

const milestones = [
    {
        year: '2004',
        title: 'International Debut',
        description: 'Made his ODI debut against Bangladesh in Chittagong.',
        icon: Calendar,
    },
    {
        year: '2005',
        title: 'The Arrival',
        description: 'Scored 148 vs Pakistan and 183* vs Sri Lanka, announcing himself to the world.',
        icon: Trophy,
    },
    {
        year: '2007',
        title: 'T20 World Cup Glory',
        description: 'Led a young Indian team to victory in the inaugural T20 World Cup in South Africa.',
        icon: Trophy,
    },
    {
        year: '2011',
        title: 'World Cup Champion',
        description: 'The iconic six at Wankhede! India lifts the ODI World Cup after 28 years.',
        icon: Trophy,
    },
    {
        year: '2013',
        title: 'Champions Trophy',
        description: 'Wins the Champions Trophy in England, completing the ICC treble.',
        icon: Trophy,
    },
    {
        year: '2023',
        title: 'Note Perfect IPL Win',
        description: 'Led CSK to their 5th IPL title, solidifying his legacy as the greatest captain.',
        icon: Trophy,
    },
];

export default function CareerTimeline() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start end', 'end start'],
    });

    return (
        <section id="timeline" className="relative py-20 bg-zinc-900 text-white overflow-hidden" ref={containerRef}>
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-csk-yellow mb-2">
                        The Journey
                    </h2>
                    <div className="h-1 w-20 bg-india-blue mx-auto rounded-full" />
                </motion.div>

                <div className="relative">
                    {/* Vertical Line */}
                    <div className="absolute left-1/2 -translate-x-1/2 h-full w-0.5 bg-zinc-700 hidden md:block" />

                    <div className="space-y-12">
                        {milestones.map((milestone, index) => (
                            <TimelineItem key={index} milestone={milestone} index={index} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

function TimelineItem({ milestone, index }: { milestone: any; index: number }) {
    const isEven = index % 2 === 0;

    return (
        <motion.div
            initial={{ opacity: 0, x: isEven ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: index * 0.1 }}
            className="flex flex-col md:flex-row items-center justify-between gap-8 w-full"
        >
            {/* Left Box (Content for Even, Spacer for Odd) */}
            <div className="w-full md:w-[45%] text-center md:text-right">
                {isEven ? (
                    <Content milestone={milestone} align="right" />
                ) : (
                    <div className="hidden md:block" />
                )}
            </div>

            {/* Center Icon */}
            <div className="relative z-10 flex items-center justify-center w-12 h-12 rounded-full bg-csk-yellow text-zinc-900 shadow-lg shadow-csk-yellow/20 shrink-0">
                <milestone.icon className="w-6 h-6" />
            </div>

            {/* Right Box (Spacer for Even, Content for Odd) */}
            <div className="w-full md:w-[45%] text-center md:text-left">
                {!isEven ? (
                    <Content milestone={milestone} align="left" />
                ) : (
                    <div className="hidden md:block" />
                )}
            </div>

            {/* Mobile Content Backup if the above logic hides it */}
            <div className="md:hidden w-full text-center">
                {/* This is a bit duplicative, let's refine the structure below for cleaner code */}
            </div>
        </motion.div>
    );
}

// Helper to keep code clean - refined for the flex strategy above
function Content({ milestone, align }: { milestone: any; align: 'left' | 'right' | 'center' }) {
    return (
        <div className={`p-6 rounded-2xl bg-zinc-800/50 border border-zinc-700 hover:border-csk-yellow/50 transition-colors backdrop-blur-sm
            ${align === 'right' ? 'md:text-right' : 'md:text-left'} text-center`}>
            <span className="inline-block px-3 py-1 mb-2 text-sm font-bold tracking-wider text-black bg-csk-yellow rounded-full">
                {milestone.year}
            </span>
            <h3 className="text-xl font-bold text-white mb-2">{milestone.title}</h3>
            <p className="text-zinc-400 leading-relaxed">{milestone.description}</p>
        </div>
    )
}
