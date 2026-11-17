'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';

const query = '(pointer: fine) and (prefers-reduced-motion: no-preference)';
const subscribe = (cb: () => void) => {
  const mq = window.matchMedia(query);
  mq.addEventListener('change', cb);
  return () => mq.removeEventListener('change', cb);
};

/**
 * A floodlight cursor: a gold dot that tracks 1:1 and a ring that trails with spring lag.
 * Elements opt in to a labelled state with data-cursor="View" (any label text).
 * Only mounts on fine pointers without reduced motion; touch devices keep native behaviour.
 */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const enabled = useSyncExternalStore(subscribe, () => window.matchMedia(query).matches, () => false);
  const [label, setLabel] = useState<string | null>(null);
  const [pressed, setPressed] = useState(false);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add('has-cursor');

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const lag = { ...pos };
    let raf = 0;
    let visible = false;

    const move = (e: PointerEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      if (!raf) raf = requestAnimationFrame(tick);
      if (!visible) {
        visible = true;
        lag.x = pos.x;
        lag.y = pos.y;
        dot.current?.style.setProperty('opacity', '1');
        ring.current?.style.setProperty('opacity', '1');
      }
      const target = (e.target as HTMLElement | null)?.closest<HTMLElement>('[data-cursor], a, button, [role="button"], input, textarea, label');
      setLabel(target?.dataset.cursor ?? null);
      setHovering(Boolean(target));
    };
    const leave = () => {
      visible = false;
      dot.current?.style.setProperty('opacity', '0');
      ring.current?.style.setProperty('opacity', '0');
    };
    const down = () => setPressed(true);
    const up = () => setPressed(false);

    const tick = () => {
      lag.x += (pos.x - lag.x) * 0.18;
      lag.y += (pos.y - lag.y) * 0.18;
      if (dot.current) dot.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      if (ring.current) ring.current.style.transform = `translate3d(${lag.x}px, ${lag.y}px, 0)`;
      // Sleep once the ring has caught up; the next pointer move wakes the loop.
      raf = Math.abs(pos.x - lag.x) + Math.abs(pos.y - lag.y) > 0.1 ? requestAnimationFrame(tick) : 0;
    };

    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerleave', leave);
    window.addEventListener('pointerdown', down);
    window.addEventListener('pointerup', up);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerleave', leave);
      window.removeEventListener('pointerdown', down);
      window.removeEventListener('pointerup', up);
      document.documentElement.classList.remove('has-cursor');
    };
  }, [enabled]);

  if (!enabled) return null;

  const size = label ? 84 : hovering ? 52 : 34;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[100]">
      <div ref={ring} className="absolute left-0 top-0 opacity-0" style={{ transition: 'opacity 300ms' }}>
        <div
          className="flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border text-[11px] font-bold uppercase tracking-[0.14em] text-night"
          style={{
            width: size,
            height: size,
            borderColor: label ? 'transparent' : 'rgba(253,185,19,0.7)',
            background: label ? 'var(--color-gold)' : hovering ? 'rgba(253,185,19,0.08)' : 'transparent',
            scale: pressed ? 0.85 : 1,
            transition: 'width 450ms var(--ease-out-expo), height 450ms var(--ease-out-expo), background 300ms, border-color 300ms, scale 200ms',
          }}
        >
          {label}
        </div>
      </div>
      <div ref={dot} className="absolute left-0 top-0 opacity-0" style={{ transition: 'opacity 300ms' }}>
        <div
          className="-translate-x-1/2 -translate-y-1/2 rounded-full bg-gold"
          style={{ width: label ? 0 : 6, height: label ? 0 : 6, transition: 'width 200ms, height 200ms' }}
        />
      </div>
    </div>
  );
}
