'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, CheckCircle2, XCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

const specialWords = ['MSD', 'MAHI', 'THALA', 'MAHENDRA', 'MAHENDRA SINGH DHONI', 'MS DHONI', 'RONALDO', 'CR7', 'CR', 'WEEK', 'CAPTAIN', 'WK', 'WICKET KEEPER', 'FINISHER', 'CSK', 'RPS', 'DHONI', 'SURESH RAINA', 'SURESH', 'RAINA', 'JADEJA', 'ASHWIN', 'CHENNAI'];

export default function ThalaPage() {
    const [input, setInput] = useState('');
    const [result, setResult] = useState<'success' | 'fail' | null>(null);

    const checkReason = () => {
        const value = input.trim();
        if (!value) return;

        let isSuccess = false;
        const upperInput = value.toUpperCase();
        const isNumber = !isNaN(Number(value));

        // Check Logic (Ported from legacy)
        const hasSpecialWord = specialWords.some(word => upperInput.includes(word));
        const digits = value.split('').map(Number).filter(n => !isNaN(n));
        const sumOfDigits = digits.reduce((acc, num) => acc + num, 0);
        const productOfDigits = digits.reduce((acc, num) => acc * num, 1);
        const numWords = value.split(/\s+/).length;
        const differenceOfDigits = digits.length === 2 ? Math.abs(digits[0] - digits[1]) : -1;

        if (
            hasSpecialWord ||
            (isNumber && (Number(value) % 7 === 0 || value.length === 7 || sumOfDigits === 7 || productOfDigits === 7 || productOfDigits % 7 === 0 || differenceOfDigits === 7)) ||
            (!isNumber && (value.length === 7 || numWords === 7)) ||
            sumOfDigits === 7
        ) {
            isSuccess = true;
        }

        setResult(isSuccess ? 'success' : 'fail');

        if (isSuccess) {
            const audio = new Audio('/audio/bole-jo-koyal.mp3'); // We need to add this audio or just skip it
            // For now just confetti
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        }
    };

    return (
        <main className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
            <div className="max-w-2xl w-full text-center space-y-8">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white mb-2">
                        Thala For A <span className="text-csk-yellow">Reason</span>
                    </h1>
                    <p className="text-zinc-400 text-lg">Type anything. If it relates to 7, you know the reason.</p>
                </motion.div>

                <div className="relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && checkReason()}
                        placeholder="Type a name, number, or message..."
                        className="w-full bg-zinc-900 border-2 border-zinc-800 focus:border-csk-yellow text-white text-2xl font-bold py-6 px-8 rounded-2xl outline-none transition-all placeholder:text-zinc-700 text-center uppercase"
                    />
                </div>

                <button
                    onClick={checkReason}
                    className="bg-india-blue hover:bg-india-hover text-white font-bold text-xl py-4 px-12 rounded-full transition-all transform hover:scale-105 active:scale-95"
                >
                    Check Reason
                </button>

                <AnimatePresence>
                    {result && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className={`p-8 rounded-3xl border-2 ${result === 'success'
                                    ? 'bg-csk-yellow/10 border-csk-yellow text-csk-yellow'
                                    : 'bg-red-500/10 border-red-500 text-red-500'
                                }`}
                        >
                            {result === 'success' ? (
                                <div className="flex flex-col items-center gap-4">
                                    <div className="relative">
                                        <Trophy className="w-24 h-24 stroke-[1.5]" />
                                        <motion.span
                                            animate={{ scale: [1, 1.2, 1] }}
                                            transition={{ repeat: Infinity, duration: 2 }}
                                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl font-black"
                                        >
                                            7
                                        </motion.span>
                                    </div>
                                    <h2 className="text-4xl font-black uppercase">Thala For A Reason!</h2>
                                    <p className="text-white"> Everything connects to the legend.</p>

                                    {/* Meme Video Embed can be here */}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-4">
                                    <XCircle className="w-24 h-24 stroke-[1.5]" />
                                    <h2 className="text-4xl font-black uppercase">Not Thala Enough...</h2>
                                    <p className="text-white">Try again. Maybe 7 letters?</p>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </main>
    );
}
