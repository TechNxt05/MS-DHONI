'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { X } from 'lucide-react';

interface GalleryProps {
    images: string[];
}

export default function Gallery({ images }: GalleryProps) {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [visibleCount, setVisibleCount] = useState(9);

    const displayImages = images.slice(0, visibleCount);

    return (
        <section id="gallery" className="py-24 bg-zinc-900 text-white">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white mb-2">
                        Iconic <span className="text-csk-yellow">Moments</span>
                    </h2>
                    <div className="h-1 w-20 bg-india-blue mx-auto rounded-full" />
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {displayImages.map((src, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }} // Reduced delay for smoother feel
                            className="relative aspect-[4/3] overflow-hidden rounded-xl bg-zinc-800 group cursor-pointer border border-zinc-800"
                            onClick={() => setSelectedImage(src)}
                        >
                            <img
                                src={src}
                                alt={`Gallery Image ${index + 1}`}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <span className="text-white font-bold uppercase tracking-widest translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                    View Full
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {visibleCount < images.length && (
                    <div className="text-center mt-12">
                        <button
                            onClick={() => setVisibleCount(prev => prev + 9)}
                            className="px-8 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-full transition-colors uppercase tracking-widest border border-zinc-700"
                        >
                            Load More
                        </button>
                    </div>
                )}
            </div>

            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm"
                        onClick={() => setSelectedImage(null)}
                    >
                        <button
                            className="absolute top-4 right-4 text-white hover:text-csk-yellow transition-colors"
                            onClick={() => setSelectedImage(null)}
                        >
                            <X className="w-10 h-10" />
                        </button>
                        <motion.img
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                            src={selectedImage}
                            alt="Full screen"
                            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl shadow-csk-yellow/10"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
