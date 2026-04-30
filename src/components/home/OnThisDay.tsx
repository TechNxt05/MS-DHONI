'use client';

import { useEffect, useState } from 'react';
import { CalendarDays, ExternalLink } from 'lucide-react';

interface EventItem {
  year: string;
  text: string;
  source: string;
  url: string;
}

export default function OnThisDay() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/on-this-day');
        const payload = await res.json();
        if (payload.success) setEvents(payload.data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <section className="py-16 px-4 bg-black">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white text-center mb-10">
          On This Day <span className="text-csk-yellow">In Dhoniverse</span>
        </h2>
        {loading ? (
          <p className="text-zinc-500 text-center">Loading daily legacy events...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {events.map((event) => (
              <article key={`${event.year}-${event.text}`} className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
                <p className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-csk-yellow text-black text-xs font-black mb-3">
                  <CalendarDays className="w-4 h-4" /> {event.year}
                </p>
                <p className="text-zinc-300 mb-4 leading-relaxed">{event.text}</p>
                <a href={event.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-india-blue font-bold hover:text-white">
                  {event.source} <ExternalLink className="w-4 h-4" />
                </a>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
