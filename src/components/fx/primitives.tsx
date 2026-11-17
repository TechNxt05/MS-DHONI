'use client';

import {
  motion,
  useInView,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  useAnimationFrame,
  animate,
  type MotionValue,
} from 'framer-motion';
import { useReducedMotion } from '@/lib/motion';
import { useThreeD } from '@/lib/three-pref';
import { useEffect, useRef, useState, type ReactNode, type PointerEvent as ReactPointerEvent } from 'react';
import { cn } from '@/lib/utils';

const EXPO = [0.16, 1, 0.3, 1] as const;

/* ------------------------------------------------------------------ */
/* Scroll progress: a thin gold line at the very top of the viewport.  */
/* ------------------------------------------------------------------ */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 });
  return (
    <motion.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-[70] h-[2px] origin-left bg-gold"
      style={{ scaleX }}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Split heading: each word rises out of a mask, staggered.            */
/* ------------------------------------------------------------------ */
export function SplitReveal({
  id,
  text,
  as: Tag = 'h2',
  className,
  delay = 0,
  stagger = 0.06,
  once = true,
  accent,
}: {
  id?: string;
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  className?: string;
  delay?: number;
  stagger?: number;
  once?: boolean;
  /** Words (exact match, case-insensitive) to paint gold. */
  accent?: string[];
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once, margin: '0px 0px -12% 0px' });
  const reduce = useReducedMotion();
  const words = text.split(' ');
  const accentSet = new Set((accent ?? []).map((w) => w.toLowerCase()));

  return (
    <Tag ref={ref as never} id={id} className={className} aria-label={text}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`} aria-hidden className="inline-block overflow-hidden pb-[0.08em] align-bottom">
          <motion.span
            className={cn('inline-block will-change-transform', accentSet.has(word.toLowerCase().replace(/[^a-z0-9]/g, '')) && 'text-gold')}
            initial={reduce ? false : { y: '110%', rotate: 4 }}
            animate={inView || reduce ? { y: '0%', rotate: 0 } : undefined}
            transition={{ duration: 1, ease: EXPO, delay: delay + i * stagger }}
          >
            {word}
          </motion.span>
          {i < words.length - 1 && ' '}
        </span>
      ))}
    </Tag>
  );
}

/* ------------------------------------------------------------------ */
/* Fade-up block reveal for supporting content.                        */
/* ------------------------------------------------------------------ */
export function Reveal({ children, className, delay = 0, y = 28 }: { children: ReactNode; className?: string; delay?: number; y?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.9, ease: EXPO, delay }}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Count-up number. Accepts strings like "10,773", "50.57", "183*".    */
/* ------------------------------------------------------------------ */
export function Counter({ value, className, duration = 1.8 }: { value: string; className?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' });
  const reduce = useReducedMotion();
  const match = value.match(/^([^\d]*)([\d,]+(?:\.\d+)?)(.*)$/);

  useEffect(() => {
    if (!match || reduce || !inView) return;
    const [, prefix, num, suffix] = match;
    const target = parseFloat(num.replace(/,/g, ''));
    const decimals = num.includes('.') ? num.split('.')[1].length : 0;
    const grouped = num.includes(',');
    const fmt = (n: number) => {
      const fixed = n.toFixed(decimals);
      return prefix + (grouped ? Number(fixed).toLocaleString('en-IN', { minimumFractionDigits: decimals }) : fixed) + suffix;
    };
    const el = ref.current;
    if (!el) return;
    el.textContent = fmt(0);
    // Write straight to the DOM: no React render per animation frame.
    const controls = animate(0, target, { duration, ease: EXPO, onUpdate: (v) => (el.textContent = fmt(v)), onComplete: () => (el.textContent = value) });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduce, value]);

  return (
    <span ref={ref} className={cn('tnum', className)}>
      {value}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Magnetic: the child leans toward the pointer while hovered.         */
/* ------------------------------------------------------------------ */
export function Magnetic({ children, strength = 0.35, className }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(0, { stiffness: 200, damping: 15, mass: 0.4 });
  const y = useSpring(0, { stiffness: 200, damping: 15, mass: 0.4 });
  const onMove = (e: ReactPointerEvent) => {
    if (e.pointerType !== 'mouse' || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };
  return (
    <motion.div ref={ref} className={cn('inline-block', className)} style={{ x, y }} onPointerMove={onMove} onPointerLeave={reset}>
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Tilt: 3D perspective tilt with a moving floodlight glare.           */
/* ------------------------------------------------------------------ */
export function Tilt({
  children,
  className,
  max = 10,
  glare = true,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
  glare?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rx = useSpring(useTransform(py, [0, 1], [max, -max]), { stiffness: 180, damping: 18 });
  const ry = useSpring(useTransform(px, [0, 1], [-max, max]), { stiffness: 180, damping: 18 });
  const gx = useTransform(px, (v) => `${v * 100}%`);
  const gy = useTransform(py, (v) => `${v * 100}%`);
  const glareBg = useTransform(
    [gx, gy] as MotionValue<string>[],
    ([x, y]) => `radial-gradient(circle at ${x} ${y}, rgba(255,240,200,0.28), transparent 55%)`,
  );
  const [active, setActive] = useState(false);
  const threeD = useThreeD();

  const onMove = (e: ReactPointerEvent) => {
    if (e.pointerType !== 'mouse' || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };
  const reset = () => {
    px.set(0.5);
    py.set(0.5);
    setActive(false);
  };

  // With 3D off the card sits flat.
  if (!threeD) return <div className={cn('relative', className)}>{children}</div>;

  return (
    <div style={{ perspective: 1000 }} className={className}>
      <motion.div
        ref={ref}
        onPointerMove={onMove}
        onPointerEnter={() => setActive(true)}
        onPointerLeave={reset}
        style={{ rotateX: rx, rotateY: ry, transformStyle: 'preserve-3d' }}
        className="relative h-full w-full"
      >
        {children}
        {glare && (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[inherit] mix-blend-overlay transition-opacity duration-500"
            style={{ background: glareBg, opacity: active ? 1 : 0 }}
          />
        )}
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Spotlight panel: a gold glow follows the pointer across the panel.  */
/* ------------------------------------------------------------------ */
export function spotlightHandler(e: ReactPointerEvent<HTMLElement>) {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
}

/* ------------------------------------------------------------------ */
/* Velocity marquee: speeds up and skews with scroll velocity.         */
/* ------------------------------------------------------------------ */
export function VelocityMarquee({ items, baseVelocity = -2.5, className }: { items: ReactNode[]; baseVelocity?: number; className?: string }) {
  const reduce = useReducedMotion();
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const factor = useTransform(velocity, [-2000, 0, 2000], [-4, 0, 4], { clamp: false });
  const skew = useTransform(velocity, [-3000, 0, 3000], [8, 0, -8]);
  const x = useTransform(baseX, (v) => `${((((v % 50) + 50) % 50) - 50).toFixed(3)}%`);
  const dir = useRef(1);
  const box = useRef<HTMLDivElement>(null);
  const inView = useInView(box, { margin: '100px 0px' });

  useAnimationFrame((_, delta) => {
    if (reduce || !inView) return;
    let move = dir.current * baseVelocity * (delta / 1000);
    const f = factor.get();
    if (f < 0) dir.current = -1;
    else if (f > 0) dir.current = 1;
    move += dir.current * move * f;
    baseX.set(baseX.get() + move);
  });

  const row = (
    <div className="flex shrink-0 items-center">
      {items.map((item, i) => (
        <div key={i} className="flex items-center">
          {item}
        </div>
      ))}
    </div>
  );

  return (
    <div ref={box} className={cn('flex overflow-hidden whitespace-nowrap', className)}>
      <motion.div className="flex will-change-transform" style={{ x, skewX: skew }}>
        {row}
        {row}
        {row}
        {row}
      </motion.div>
    </div>
  );
}
