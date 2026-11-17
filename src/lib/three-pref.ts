'use client';

import { useSyncExternalStore } from 'react';

/**
 * Visitor preference for the live WebGL scenes (the hero ball and the fan globe).
 * On by default; stored per browser. Turning it off swaps in static stand-ins,
 * while every other animation keeps playing.
 */
const KEY = 'msd-3d';
const EVENT = 'msd-3d-change';

// Fallback for browsers that block storage, so the toggle still works for this visit.
let memory = true;

function read(): boolean {
  try {
    const v = localStorage.getItem(KEY);
    return v === null ? memory : v !== 'off';
  } catch {
    return memory;
  }
}

const subscribe = (cb: () => void) => {
  const onStorage = (e: StorageEvent) => e.key === KEY && cb();
  window.addEventListener(EVENT, cb);
  window.addEventListener('storage', onStorage);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener('storage', onStorage);
  };
};

/** True when 3D is enabled. Reports `true` during hydration to match the server HTML. */
export function useThreeD() {
  return useSyncExternalStore(subscribe, read, () => true);
}

export function setThreeD(on: boolean) {
  memory = on;
  try {
    localStorage.setItem(KEY, on ? 'on' : 'off');
  } catch {
    /* storage blocked: the change still applies until reload */
  }
  window.dispatchEvent(new Event(EVENT));
}
