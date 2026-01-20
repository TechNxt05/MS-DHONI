'use client';

import { useState, useEffect } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Bio', href: '/biography' },
    { name: 'Timeline', href: '/#timeline' },
    { name: 'Stats', href: '/stats' },
    { name: 'Legacy', href: '/legacy' },
    { name: 'Gallery', href: '/#gallery' },
    { name: 'Thala 7', href: '/thala' },
    { name: 'Awards', href: '/awards' },
    { name: 'News', href: '/news' },
    { name: 'Fans', href: '/fans' },
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, "change", (latest) => {
        setScrolled(latest > 50);
    });

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                className="fixed top-6 inset-x-0 z-50 flex justify-center pointer-events-none"
            >
                <div className={`pointer-events-auto transition-all duration-500 ease-out ${scrolled
                    ? 'w-[90%] md:w-auto bg-black/60 backdrop-blur-2xl border border-white/10 rounded-full shadow-[0_0_40px_rgba(0,0,0,0.5)]'
                    : 'w-full bg-transparent border-transparent'
                    }`}>
                    <div className={`px-6 md:px-8 py-3 flex items-center justify-between gap-8 transition-all duration-500 ${scrolled ? 'h-16' : 'h-24'} max-w-[1400px] mx-auto w-full`}>
                        {/* Logo */}
                        <Link href="/" className="group relative flex items-center gap-2 shrink-0">
                            <div className="absolute inset-0 bg-csk-yellow/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity rounded-full scale-150" />
                            <span className="relative text-2xl md:text-3xl font-black uppercase tracking-tighter text-white italic">
                                MS<span className="text-csk-yellow drop-shadow-[0_0_10px_rgba(253,185,19,0.8)]">D</span><span className="text-india-blue">7</span>
                            </span>
                        </Link>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center gap-1 bg-white/5 rounded-full p-1 border border-white/5 backdrop-blur-md">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="relative px-5 py-2 text-xs font-bold uppercase tracking-widest text-zinc-300 hover:text-black transition-all overflow-hidden group rounded-full"
                                    onClick={(e) => {
                                        if (link.href.startsWith('/#') && (window.location.pathname === '/' || window.location.pathname === '')) {
                                            e.preventDefault();
                                            document.querySelector(`#${link.href.split('#')[1]}`)?.scrollIntoView({ behavior: 'smooth' });
                                        } else if (link.href === '/' && (window.location.pathname === '/' || window.location.pathname === '')) {
                                            e.preventDefault();
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                        }
                                    }}
                                >
                                    <span className="relative z-10 group-hover:text-black transition-colors duration-300">{link.name}</span>
                                    <span className="absolute inset-0 bg-csk-yellow transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center rounded-full" />
                                </Link>
                            ))}
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden pointer-events-auto">
                            <button
                                className="text-white p-2 hover:bg-white/10 rounded-full transition-colors"
                                onClick={() => setIsOpen(!isOpen)}
                            >
                                {isOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Menu Overlay */}
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-40 bg-black/95 backdrop-blur-3xl pt-32 px-6"
                >
                    <div className="flex flex-col items-center gap-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-3xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-zinc-500 to-zinc-700 hover:from-csk-yellow hover:to-white transition-all"
                                onClick={() => setIsOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                </motion.div>
            )}
        </>
    );
}
