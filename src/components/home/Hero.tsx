'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowDown, Sparkles } from 'lucide-react';
import { useMemo } from 'react';

// Array of high-quality hero images
const heroImages = Array.from({ length: 15 }, (_, i) => `/hero/hero-${i + 1}.jpg`);

function ShuffleGrid({ images }: { images: string[] }) {
    const displayImages = useMemo(() => {
        const sourceImages = images.length > 0 ? images : heroImages;
        return [...sourceImages].sort((a, b) => a.localeCompare(b)).slice(0, 40);
    }, [images]);

    return (
        <div className="absolute inset-0 z-0 overflow-hidden opacity-45">
            <div className="grid grid-cols-2 md:grid-cols-4 grid-rows-5 gap-3 md:gap-4 h-[120vh] w-[120vw] -ml-[10vw] -mt-[10vh] transform -rotate-6">
                {displayImages.map((src, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            y: [0, -20, 0],
                        }}
                        transition={{
                            duration: 5,
                            delay: index * 0.1,
                            repeat: Infinity,
                            repeatType: "reverse",
                            ease: "easeInOut"
                        }}
                        className="relative w-full h-full overflow-hidden rounded-lg brightness-40 hover:brightness-90 transition-all duration-700 group"
                    >
                        <div className="absolute inset-0 bg-csk-yellow/20 opacity-0 group-hover:opacity-100 transition-opacity z-10" />
                        <img
                            src={src}
                            alt="Dhoni Moment"
                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                            loading="eager"
                        />
                    </motion.div>
                ))}
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black" />
        </div>
    );
}

export default function Hero({ images = [] }: { images?: string[] }) {
    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-transparent flex items-center justify-center">
            {/* Animated Masonry Background */}
            <ShuffleGrid images={[...heroImages, ...images]} />

            {/* Content */}
            <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white px-4 max-w-5xl mx-auto py-24 md:py-28">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="space-y-6"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-csk-yellow/40 bg-csk-yellow/10 text-csk-yellow text-xs md:text-sm font-black tracking-wider">
                        <Sparkles className="w-4 h-4" />
                        CAPTAIN COOL ERA
                    </div>
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "100px" }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="h-1 bg-csk-yellow mx-auto mb-6"
                    />

                    <h2 className="text-sm md:text-2xl font-bold uppercase tracking-[0.35em] md:tracking-[0.5em] text-csk-yellow/90 text-shadow-lg">
                        The Unequalled
                    </h2>

                    <h1 className="text-5xl sm:text-6xl md:text-9xl font-black tracking-tighter uppercase mb-6 leading-none">
                        <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-500">
                            MS Dhoni
                        </span>
                    </h1>

                    <motion.h3
                        initial={{ opacity: 0, letterSpacing: "0.2em" }}
                        animate={{ opacity: 1, letterSpacing: "0.5em" }}
                        transition={{ duration: 1.5, delay: 0.2 }}
                        className="text-sm md:text-2xl font-bold uppercase mb-8"
                    >
                        <span className="text-[#FF9933] drop-shadow-[0_0_10px_rgba(255,153,51,0.5)]">Dynamic</span>
                        <span className="text-white mx-2 md:mx-3 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">Hero Of Nation</span>
                        <span className="text-[#138808] drop-shadow-[0_0_10px_rgba(19,136,8,0.5)]">India</span>
                    </motion.h3>

                    <p className="max-w-2xl text-base md:text-2xl text-zinc-300 mx-auto leading-relaxed font-light italic">
                        &quot;I tell my wife she is only the third most important thing in my life. I love my country, I love my parents, and then she comes.&quot;
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                    className="mt-10 md:mt-12 flex flex-col md:flex-row gap-4 md:gap-6 items-center"
                >
                    <Link
                        href="#timeline"
                        className="group relative inline-flex items-center gap-3 px-7 py-3.5 bg-csk-yellow text-black font-black text-base md:text-lg uppercase tracking-wider rounded-full hover:bg-white transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(253,185,19,0.3)] hover:shadow-[0_0_30px_rgba(253,185,19,0.6)]"
                    >
                        The Journey
                        <ArrowDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
                    </Link>

                    <Link
                        href="/biography"
                        className="group inline-flex items-center gap-3 px-7 py-3.5 border border-zinc-700 hover:border-white text-zinc-300 hover:text-white font-bold text-base md:text-lg uppercase tracking-wider rounded-full hover:bg-white/5 transition-all"
                    >
                        Read Biography
                    </Link>
                </motion.div>
            </div>


        </div>
    );
}
