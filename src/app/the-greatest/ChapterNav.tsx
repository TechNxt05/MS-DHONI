'use client';

import { useEffect, useRef, useState } from 'react';
import { scrollToTarget } from '@/components/fx/SmoothScroll';

/** Sticky jump bar for the page's chapters; highlights the one in view. */
export default function ChapterNav({ items }: { items: { id: string; label: string }[] }) {
  const [active, setActive] = useState(items[0]?.id);
  const list = useRef<HTMLOListElement>(null);

  // Keep the active pill visible when the bar is wider than the screen.
  useEffect(() => {
    const ol = list.current;
    const pill = ol?.querySelector<HTMLElement>('[aria-current]');
    if (ol && pill) ol.scrollTo({ left: pill.offsetLeft - 16, behavior: 'smooth' });
  }, [active]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (hit) setActive(hit.target.id);
      },
      { rootMargin: '-30% 0px -60% 0px' },
    );
    for (const { id } of items) {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    }
    return () => io.disconnect();
  }, [items]);

  return (
    <nav aria-label="Chapters" className="sticky top-20 z-30 border-y border-flood/10 bg-night/85 backdrop-blur">
      <ol ref={list} className="relative mx-auto flex max-w-[1500px] gap-1 overflow-x-auto px-4 py-2 [scrollbar-width:none] sm:px-8">
        {items.map((it, i) => (
          <li key={it.id} className="shrink-0">
            <a
              href={`#${it.id}`}
              onClick={(e) => {
                e.preventDefault();
                scrollToTarget(`#${it.id}`, 140);
                history.replaceState(null, '', `#${it.id}`);
              }}
              aria-current={active === it.id ? 'true' : undefined}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                active === it.id ? 'bg-gold text-night' : 'text-chalk hover:text-gold'
              }`}
            >
              <span className="tnum text-xs opacity-70">{String(i + 1).padStart(2, '0')}</span>
              {it.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
