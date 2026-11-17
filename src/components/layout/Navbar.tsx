'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { photo } from '@/lib/photos';
import { setScrollLocked } from '@/components/fx/SmoothScroll';
import { cn } from '@/lib/utils';

const primary = [
  { name: 'Story', href: '/biography' },
  { name: 'Moments', href: '/moments' },
  { name: 'Numbers', href: '/stats' },
  { name: 'Quotes', href: '/legacy' },
  { name: 'Gallery', href: '/gallery' },
  { name: 'Fan Universe', href: '/fan-universe' },
];

const secondary = [
  { name: 'On This Day', href: '/on-this-day' },
  { name: 'The Greatest', href: '/the-greatest' },
  { name: 'Friends & Duos', href: '/friends' },
  { name: 'Fan Deck', href: '/fan-deck' },
  { name: 'Awards', href: '/awards' },
  { name: 'News', href: '/news' },
  { name: 'Fan Wall', href: '/fans' },
];

const all = [{ name: 'Home', href: '/' }, ...primary, ...secondary];
const menuPhoto = photo('csk-seven-floodlights');
const EXPO = [0.16, 1, 0.3, 1] as const;

export default function Navbar() {
  const pathname = usePathname();
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const setOpen = (next: boolean | ((o: boolean) => boolean)) =>
    setOpenOn((typeof next === 'function' ? next(open) : next) ? pathname : null);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 40);
    // Get out of the way while reading down; come back on any upward scroll.
    setHidden(y > 400 && y > prev + 2 && !open);
  });

  useEffect(() => {
    setScrollLocked(open);
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpenOn(null);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      setScrollLocked(false);
    };
  }, [open]);

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-[80]"
        animate={{ y: hidden ? '-110%' : '0%' }}
        transition={{ duration: 0.5, ease: EXPO }}
      >
        <div
          className={cn(
            'mx-auto flex max-w-[1500px] items-center justify-between gap-6 px-4 py-4 transition-[padding] duration-500 sm:px-8',
            scrolled ? 'md:py-3' : 'md:py-6',
          )}
        >
          <Link href="/" className="group relative z-[2] flex items-baseline gap-1 font-display text-3xl font-black uppercase leading-none" aria-label="MS Dhoni tribute, home">
            <span className="text-flood transition-colors group-hover:text-gold">MSD</span>
            <span className="text-gold transition-transform duration-500 group-hover:-rotate-12">7</span>
          </Link>

          <nav
            aria-label="Primary"
            className={cn(
              'hidden items-center gap-1 rounded-full border px-2 py-1.5 transition-colors duration-500 lg:flex',
              scrolled ? 'border-flood/10 bg-night/75 backdrop-blur-xl' : 'border-transparent bg-transparent',
            )}
          >
            {primary.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'relative rounded-full px-4 py-2 text-[13px] font-semibold uppercase tracking-[0.1em] transition-colors duration-300',
                    active ? 'text-night' : 'text-chalk hover:text-flood',
                  )}
                >
                  {active && (
                    <motion.span layoutId="nav-pill" className="absolute inset-0 -z-0 rounded-full bg-gold" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />
                  )}
                  <span className="relative">{link.name}</span>
                </Link>
              );
            })}
          </nav>

          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="site-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="relative z-[2] flex h-12 items-center gap-3 rounded-full border border-flood/15 bg-night/60 pl-5 pr-4 text-sm font-bold uppercase tracking-[0.12em] text-flood backdrop-blur-xl transition-colors hover:border-gold"
          >
            <span className="hidden sm:inline">{open ? 'Close' : 'Menu'}</span>
            <span className="relative block h-3 w-5">
              <span className={cn('absolute left-0 h-[2px] w-5 bg-current transition-all duration-500', open ? 'top-1/2 -translate-y-1/2 rotate-45' : 'top-0')} />
              <span className={cn('absolute left-0 h-[2px] bg-current transition-all duration-500', open ? 'top-1/2 w-5 -translate-y-1/2 -rotate-45' : 'bottom-0 w-3')} />
            </span>
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="site-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            className="fixed inset-0 z-[75] overflow-y-auto bg-night"
            initial={{ clipPath: 'circle(0% at calc(100% - 3.5rem) 2.5rem)' }}
            animate={{ clipPath: 'circle(150% at calc(100% - 3.5rem) 2.5rem)' }}
            exit={{ clipPath: 'circle(0% at calc(100% - 3.5rem) 2.5rem)' }}
            transition={{ duration: 0.8, ease: EXPO }}
          >
            <div className="mx-auto grid min-h-full max-w-[1500px] gap-10 px-4 pb-12 pt-28 sm:px-8 lg:grid-cols-[1.4fr_1fr] lg:items-center">
              <nav aria-label="Site">
                <ul>
                  {all.map((link, i) => (
                    <li key={link.href} className="overflow-hidden">
                      <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: '0%' }}
                        transition={{ duration: 0.8, ease: EXPO, delay: 0.15 + i * 0.04 }}
                      >
                        <Link
                          href={link.href}
                          onClick={() => setOpen(false)}
                          aria-current={isActive(link.href) ? 'page' : undefined}
                          className="group flex items-baseline gap-4 py-1 font-display text-[clamp(2.6rem,7vw,5.5rem)] font-black uppercase leading-[0.95]"
                        >
                          <span
                            className={cn(
                              'transition-[color,transform] duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-3 group-hover:text-gold',
                              isActive(link.href) ? 'text-gold' : 'text-flood',
                            )}
                          >
                            {link.name}
                          </span>
                        </Link>
                      </motion.div>
                    </li>
                  ))}
                </ul>
              </nav>
              <motion.figure
                className="relative hidden aspect-[4/5] overflow-hidden rounded-[28px] lg:block"
                initial={{ opacity: 0, scale: 0.9, rotate: 3 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 1, ease: EXPO, delay: 0.3 }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={menuPhoto.src} alt={menuPhoto.alt} className="h-full w-full object-cover" />
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-night to-transparent p-6 pt-20 font-display text-3xl font-black uppercase leading-none">
                  Definitely not retired from our hearts.
                </figcaption>
              </motion.figure>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
