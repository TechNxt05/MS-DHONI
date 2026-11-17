'use client';

import { LayoutGroup, motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import PageHero from '@/components/layout/PageHero';
import { MasonryGrid } from '@/components/home/Gallery';
import { photo, photos, type PhotoTag } from '@/lib/photos';
import { cn } from '@/lib/utils';

const filters: { key: PhotoTag | 'all'; label: string }[] = [
  { key: 'all', label: 'Everything' },
  { key: 'india', label: 'India blue' },
  { key: 'csk', label: 'Chennai yellow' },
  { key: 'trophies', label: 'Trophies' },
  { key: 'team', label: 'Teammates' },
  { key: 'commons', label: 'Archive' },
  { key: 'art', label: 'Fan art' },
];

export default function GalleryClient() {
  const [filter, setFilter] = useState<PhotoTag | 'all'>('all');
  const list = useMemo(() => (filter === 'all' ? photos : photos.filter((p) => p.tag === filter)), [filter]);
  const count = (k: PhotoTag | 'all') => (k === 'all' ? photos.length : photos.filter((p) => p.tag === k).length);

  return (
    <main>
      <PageHero
        title="The gallery"
        accent={['gallery']}
        backdrop={photo('floodlit-strike')}
        position="50% 20%"
        intro={`${photos.length} frames from Ranchi to Wankhede to Chepauk. Tap any of them to go full screen.`}
      />
      <section className="mx-auto max-w-[1500px] px-4 pb-28 sm:px-8">
        <LayoutGroup>
          <div role="radiogroup" aria-label="Filter photos" className="no-scrollbar -mx-4 mb-10 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
            {filters.map((f) => (
              <button
                key={f.key}
                role="radio"
                aria-checked={filter === f.key}
                onClick={() => setFilter(f.key)}
                className={cn(
                  'relative shrink-0 rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors',
                  filter === f.key ? 'border-transparent text-night' : 'border-flood/15 text-chalk hover:text-flood',
                )}
              >
                {filter === f.key && <motion.span layoutId="gallery-filter" className="absolute inset-0 rounded-full bg-gold" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}
                <span className="relative">
                  {f.label} <span className="tnum opacity-60">{count(f.key)}</span>
                </span>
              </button>
            ))}
          </div>
        </LayoutGroup>
        <MasonryGrid key={filter} photos={list} initial={24} />
      </section>
    </main>
  );
}
