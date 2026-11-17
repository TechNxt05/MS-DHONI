'use client';

import { useSyncExternalStore } from 'react';

const query = '(prefers-reduced-motion: reduce)';
const subscribe = (cb: () => void) => {
  const mq = window.matchMedia(query);
  mq.addEventListener('change', cb);
  return () => mq.removeEventListener('change', cb);
};

/**
 * Hydration-safe replacement for framer-motion's useReducedMotion: it reports `false` while
 * hydrating (matching the server HTML), then the visitor's real preference. Pair with the
 * global <MotionConfig reducedMotion="user"> so transforms never play for those visitors.
 */
export function useReducedMotion() {
  return useSyncExternalStore(subscribe, () => window.matchMedia(query).matches, () => false);
}
