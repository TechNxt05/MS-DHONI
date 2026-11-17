'use client';

import { VelocityMarquee } from '@/components/fx/primitives';

const words = ['Captain Cool', '2007', 'Thala', '2011', 'The Finisher', '2013', 'Mahi', '5× IPL', 'Number 7'];

function Ball() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="mx-6 h-6 w-6 shrink-0 md:mx-10 md:h-9 md:w-9">
      <circle cx="12" cy="12" r="11" fill="#a3161a" />
      <path d="M4 5.5c4.5 3.5 4.5 9.5 0 13M20 5.5c-4.5 3.5-4.5 9.5 0 13" stroke="#f4efe3" strokeWidth="1.2" strokeDasharray="1.6 1.4" fill="none" />
    </svg>
  );
}

export default function Ticker() {
  const items = words.map((w, i) => (
    <span key={w} className="flex items-center">
      <span className={i % 2 ? 'text-outline' : 'text-flood'}>{w}</span>
      <Ball />
    </span>
  ));

  return (
    <div aria-hidden className="relative z-10 -mt-px border-y border-flood/10 bg-night py-5 md:py-7">
      <VelocityMarquee
        items={items}
        className="font-display text-[clamp(2.4rem,6vw,5.5rem)] font-black uppercase leading-none tracking-[-0.01em]"
      />
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-night to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-night to-transparent" />
    </div>
  );
}
