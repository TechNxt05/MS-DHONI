'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { usePathname } from 'next/navigation';

let lenisInstance: Lenis | null = null;

/** Scroll to an element or y-offset through Lenis when it is running, natively otherwise. */
/** Smooth-scroll to a target, leaving `offset` px clear at the top (the navbar by default). */
export function scrollToTarget(target: string | number | HTMLElement, offset = 80) {
  if (lenisInstance) {
    lenisInstance.scrollTo(target, { offset: typeof target === 'number' ? 0 : -offset, duration: 1.4 });
    return;
  }
  if (typeof target === 'number') window.scrollTo({ top: target, behavior: 'smooth' });
  else {
    const el = typeof target === 'string' ? document.querySelector(target) : target;
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
  }
}

export function setScrollLocked(locked: boolean) {
  if (lenisInstance) {
    if (locked) lenisInstance.stop();
    else lenisInstance.start();
  }
  document.documentElement.style.overflow = locked ? 'hidden' : '';
}

export default function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      anchors: { offset: -80 },
      // Let inner scrollers (menu, tab bars, strips, side panels) take wheel, trackpad and touch
      // gestures themselves instead of Lenis swallowing them, even while the page is locked.
      allowNestedScroll: true,
    });
    lenisInstance = lenis;

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);

  // New route: start at the top, unless the URL targets a section.
  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash;
      requestAnimationFrame(() => scrollToTarget(id));
      return;
    }
    if (lenisInstance) lenisInstance.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
