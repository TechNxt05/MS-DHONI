'use client';

import { useEffect, useState } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';

const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Bio', href: '/biography' },
    { name: 'Moments', href: '/moments' },
    { name: 'Timeline', href: '/#timeline' },
    { name: 'Stats', href: '/stats' },
    { name: 'Legacy', href: '/legacy' },
    { name: 'Gallery', href: '/#gallery' },
    { name: 'Fan Universe', href: '/fan-universe' },
    { name: 'Awards', href: '/awards' },
    { name: 'News', href: '/news' },
    { name: 'Fans', href: '/fans' },
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeHomeSection, setActiveHomeSection] = useState<'timeline' | 'gallery' | null>(null);
    const { scrollY } = useScroll();
    const pathname = usePathname();
    const getIsActive = (href: string) => {
        if (href === '/') return pathname === '/';
        if (href === '/#timeline') return pathname === '/' && activeHomeSection === 'timeline';
        if (href === '/#gallery') return pathname === '/' && activeHomeSection === 'gallery';
        if (href.startsWith('/#')) return false;
        return pathname === href;
    };

    useMotionValueEvent(scrollY, "change", (latest) => {
        setScrolled(latest > 50);
    });

    useEffect(() => {
        if (pathname !== '/') {
            setActiveHomeSection(null);
            return;
        }

        const timeline = document.getElementById('timeline');
        const gallery = document.getElementById('gallery');
        if (!timeline && !gallery) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
                if (visible.length === 0) return;
                const id = visible[0].target.id;
                if (id === 'timeline' || id === 'gallery') {
                    setActiveHomeSection(id);
                }
            },
            { threshold: [0.35, 0.55, 0.75], rootMargin: '-120px 0px -35% 0px' }
        );

        if (timeline) observer.observe(timeline);
        if (gallery) observer.observe(gallery);

        return () => observer.disconnect();
    }, [pathname]);

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                className="fixed top-6 inset-x-0 z-50 flex justify-center pointer-events-none"
            >
                <div className={`pointer-events-auto transition-all duration-500 ease-out ${scrolled
                    ? 'w-[94%] md:w-auto bg-black/70 backdrop-blur-2xl border border-white/10 rounded-2xl md:rounded-full shadow-[0_0_40px_rgba(0,0,0,0.5)]'
                    : 'w-full bg-transparent border-transparent'
                    }`}>
                    <div className={`px-4 md:px-6 py-3 flex items-center justify-between gap-4 md:gap-6 transition-all duration-500 ${scrolled ? 'h-16' : 'h-24'} max-w-[1400px] mx-auto w-full`}>
                        {/* Logo */}
                        <Link href="/" className="group relative flex items-center gap-2 shrink-0">
                            <div className="absolute inset-0 bg-csk-yellow/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity rounded-full scale-150" />
                            <span className="relative text-2xl md:text-3xl font-black uppercase tracking-tighter text-white italic">
                                MS<span className="text-csk-yellow drop-shadow-[0_0_10px_rgba(253,185,19,0.8)]">D</span><span className="text-india-blue">7</span>
                            </span>
                        </Link>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center gap-1 bg-white/5 rounded-full p-1 border border-white/5 backdrop-blur-md max-w-[72vw] overflow-x-auto no-scrollbar">
                            {navLinks.map((link) => {
                                const isActive = getIsActive(link.href);
                                return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={`relative px-3 py-2 text-[11px] font-bold uppercase tracking-wide transition-all overflow-hidden group rounded-full whitespace-nowrap ${isActive ? 'text-black' : 'text-zinc-300 hover:text-black'
                                        }`}
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
                                    <span className={`absolute inset-0 bg-csk-yellow transition-transform duration-300 origin-center rounded-full ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                                        }`} />
                                </Link>
                                );
                            })}
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
                    className="fixed inset-0 z-40 bg-black/95 backdrop-blur-3xl pt-28 px-6 overflow-y-auto"
                >
                    <div className="flex flex-col items-center gap-5 pb-12">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`text-2xl font-black uppercase tracking-tighter transition-all ${getIsActive(link.href) ? 'text-csk-yellow' : 'text-transparent bg-clip-text bg-gradient-to-r from-zinc-500 to-zinc-700 hover:from-csk-yellow hover:to-white'
                                    }`}
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
