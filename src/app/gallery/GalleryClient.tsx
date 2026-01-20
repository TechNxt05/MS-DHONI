'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';

interface GalleryPageProps {
    images: string[];
}

export default function GalleryClient({ images }: GalleryPageProps) {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end end']
    });

    // Parallax transforms for columns with different directions/speeds
    const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
    const y2 = useTransform(scrollYProgress, [0, 1], [0, 100]);
    const y3 = useTransform(scrollYProgress, [0, 1], [0, -150]);
    const y4 = useTransform(scrollYProgress, [0, 1], [0, 50]);

    // Split images into 4 columns
    const chunkedImages = [[], [], [], []];
    images.forEach((img, i) => {
        chunkedImages[i % 4].push(img);
    });

    return (
        <main ref={containerRef} className="min-h-[200vh] bg-black text-white py-32 px-4 overflow-hidden">
            <div className="fixed top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900/40 via-black to-black z-0 pointer-events-none" />

            <div className="relative z-10 container mx-auto mb-32 text-center">
                <motion.h1
                    className="text-8xl md:text-[10rem] font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-csk-yellow to-yellow-600 opacity-20 select-none cursor-default"
                >
                    Moments
                </motion.h1>
                <motion.h2
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-4xl md:text-6xl font-black uppercase tracking-widest -mt-10 md:-mt-24 relative z-20"
                >
                    The <span className="text-csk-yellow">Gallery</span>
                </motion.h2>
            </div>

            <div className="relative z-10 container mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 min-h-screen pb-20">
                <Column images={chunkedImages[0]} y={y1} className="mt-10" />
                <Column images={chunkedImages[1]} y={y2} className="mt-32" />
                <Column images={chunkedImages[2]} y={y3} className="mt-0" />
                <Column images={chunkedImages[3]} y={y4} className="mt-20" />
            </div>
        </main>
    );
}

function Column({ images, y, className = "" }: { images: string[]; y: any; className?: string }) {
    return (
        <motion.div style={{ y }} className={`flex flex-col gap-8 ${className}`}>
            {images.map((src, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "100px" }}
                    transition={{ duration: 0.5 }}
                    className="group relative rounded-xl overflow-hidden shadow-2xl hover:z-20 transform transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(253,185,19,0.3)]"
                >
                    {/* Image - Original Colors */}
                    <div className="relative w-full">
                        <img
                            src={src}
                            alt="Gallery Image"
                            className="w-full h-auto object-contain rounded-xl transition-transform duration-500 ease-in-out group-hover:rotate-1"
                            loading="lazy"
                        />
                    </div>
                </motion.div>
            ))}
        </motion.div>
    )
}
