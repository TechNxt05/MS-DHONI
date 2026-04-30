'use client';

import { FormEvent, useEffect, useState } from 'react';

interface Pin {
  _id: string;
  name: string;
  city: string;
  country: string;
  message: string;
  lat: number;
  lon: number;
}

export default function FanMapPage() {
  const [pins, setPins] = useState<Pin[]>([]);
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadPins = async () => {
    const res = await fetch('/api/fan-map');
    const data = await res.json();
    if (data.success) setPins(data.data);
  };

  useEffect(() => {
    loadPins();
  }, []);

  const geocode = async () => {
    const q = encodeURIComponent(`${city}, ${country}`);
    const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${q}&format=json&limit=1`);
    const data = await res.json();
    if (!data?.[0]) return null;
    return { lat: Number(data[0].lat), lon: Number(data[0].lon) };
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name || !city || !country || !message) return;
    setSubmitting(true);
    const coords = await geocode();
    if (!coords) {
      setSubmitting(false);
      return;
    }
    await fetch('/api/fan-map', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, city, country, message, ...coords }),
    });
    setName('');
    setCity('');
    setCountry('');
    setMessage('');
    await loadPins();
    setSubmitting(false);
  };

  return (
    <main className="min-h-screen bg-black text-white pt-32 pb-20 px-4">
      <div className="container mx-auto max-w-5xl">
        <h1 className="text-5xl font-black mb-3">Global Fan Map</h1>
        <p className="text-zinc-400 mb-8">Pin your city with a Dhoni tribute. Powered by free OpenStreetMap geocoding.</p>

        <form onSubmit={onSubmit} className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 mb-8 grid gap-4">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your Name" className="rounded-lg p-3 bg-zinc-950 border border-zinc-700" />
          <div className="grid md:grid-cols-2 gap-4">
            <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" className="rounded-lg p-3 bg-zinc-950 border border-zinc-700" />
            <input value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Country" className="rounded-lg p-3 bg-zinc-950 border border-zinc-700" />
          </div>
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Your tribute message" className="rounded-lg p-3 bg-zinc-950 border border-zinc-700" rows={4} />
          <button disabled={submitting} className="rounded-full px-5 py-3 bg-csk-yellow text-black font-black w-fit">
            {submitting ? 'Pinning...' : 'Pin My City'}
          </button>
        </form>

        <div className="grid gap-4">
          {pins.map((pin) => (
            <article key={pin._id} className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
              <p className="font-bold">{pin.name} - {pin.city}, {pin.country}</p>
              <p className="text-zinc-400">{pin.message}</p>
              <p className="text-xs text-zinc-500 mt-1">Lat: {pin.lat.toFixed(3)} | Lon: {pin.lon.toFixed(3)}</p>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
