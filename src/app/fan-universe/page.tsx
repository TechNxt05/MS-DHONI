'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Globe2, Sparkles, MessageCircleHeart, MapPinned, Trophy, XCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

type UniverseTab = 'thala' | 'fanmap' | 'cards';

const specialWords = ['MSD', 'MAHI', 'THALA', 'MAHENDRA', 'MAHENDRA SINGH DHONI', 'MS DHONI', 'CAPTAIN', 'WK', 'WICKET KEEPER', 'FINISHER', 'CSK', 'RPS', 'DHONI', 'SURESH RAINA', 'RAINA', 'JADEJA', 'ASHWIN', 'CHENNAI'];
const cardTemplates = [
  'Dhoni: Calm mind. Ruthless finish.',
  'In pressure, others panic. Thala calculates.',
  'Captain Cool is not a style. It is a standard.',
];

export default function FanUniversePage() {
  const [activeTab, setActiveTab] = useState<UniverseTab>('thala');
  const [thalaInput, setThalaInput] = useState('');
  const [thalaResult, setThalaResult] = useState<'success' | 'fail' | null>(null);
  const [pins, setPins] = useState<Array<{ _id: string; name: string; city: string; country: string; message: string; lat: number; lon: number }>>([]);
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [message, setMessage] = useState('');
  const [submittingPin, setSubmittingPin] = useState(false);
  const [cardName, setCardName] = useState('Thala Fan');
  const [template, setTemplate] = useState(cardTemplates[0]);

  const cardText = useMemo(() => `${template}\n- ${cardName}`, [template, cardName]);

  useEffect(() => {
    if (activeTab !== 'fanmap') return;
    const loadPins = async () => {
      const res = await fetch('/api/fan-map');
      const data = await res.json();
      if (data.success) setPins(data.data);
    };
    loadPins();
  }, [activeTab]);

  const checkReason = () => {
    const value = thalaInput.trim();
    if (!value) return;
    const upperInput = value.toUpperCase();
    const isNumber = !isNaN(Number(value));
    const hasSpecialWord = specialWords.some((word) => upperInput.includes(word));
    const digits = value.split('').map(Number).filter((n) => !isNaN(n));
    const sumOfDigits = digits.reduce((acc, num) => acc + num, 0);
    const productOfDigits = digits.reduce((acc, num) => acc * num, 1);
    const numWords = value.split(/\s+/).length;
    const differenceOfDigits = digits.length === 2 ? Math.abs(digits[0] - digits[1]) : -1;

    const success =
      hasSpecialWord ||
      (isNumber &&
        (Number(value) % 7 === 0 ||
          value.length === 7 ||
          sumOfDigits === 7 ||
          productOfDigits === 7 ||
          productOfDigits % 7 === 0 ||
          differenceOfDigits === 7)) ||
      (!isNumber && (value.length === 7 || numWords === 7)) ||
      sumOfDigits === 7;

    setThalaResult(success ? 'success' : 'fail');
    if (success) confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
  };

  const geocode = async () => {
    const q = encodeURIComponent(`${city}, ${country}`);
    const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${q}&format=json&limit=1`);
    const data = await res.json();
    if (!data?.[0]) return null;
    return { lat: Number(data[0].lat), lon: Number(data[0].lon) };
  };

  const submitPin = async (e: FormEvent) => {
    e.preventDefault();
    if (!name || !city || !country || !message) return;
    setSubmittingPin(true);
    const coords = await geocode();
    if (!coords) {
      setSubmittingPin(false);
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
    const res = await fetch('/api/fan-map');
    const data = await res.json();
    if (data.success) setPins(data.data);
    setSubmittingPin(false);
  };

  const downloadCard = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 630;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, '#111827');
    grad.addColorStop(1, '#000000');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#FDB913';
    ctx.font = 'bold 40px Arial';
    ctx.fillText('MS Dhoni Supremacy Card', 70, 90);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 56px Arial';
    cardText.split('\n').forEach((line, idx) => ctx.fillText(line, 70, 220 + idx * 80));
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = 'dhoni-supremacy-card.png';
    link.click();
  };

  return (
    <main className="min-h-screen bg-black text-white pt-32 pb-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-14">
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter">
            Fan <span className="text-csk-yellow">Universe</span>
          </h1>
          <p className="text-zinc-400 mt-4 max-w-3xl mx-auto">
            This is the community wing of the tribute website. The core remains dedicated to Dhoni’s supremacy,
            while this zone turns fan emotion into interactive experiences.
          </p>
        </motion.div>

        <section className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-4 md:p-6 mb-10">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {[
              { key: 'thala', label: 'Thala 7' },
              { key: 'fanmap', label: 'Fan Map' },
              { key: 'cards', label: 'Supremacy Cards' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as UniverseTab)}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-black transition-colors ${
                  activeTab === tab.key ? 'bg-csk-yellow text-black' : 'bg-zinc-800 text-zinc-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'thala' && (
            <div className="mt-5 space-y-5">
              <p className="text-zinc-400 text-sm md:text-base">Type anything. If it relates to 7, you know the reason.</p>
              <input
                type="text"
                value={thalaInput}
                onChange={(e) => setThalaInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && checkReason()}
                placeholder="Type a name, number, or message..."
                className="w-full bg-zinc-950 border border-zinc-700 focus:border-csk-yellow text-white text-base md:text-xl font-bold py-4 px-4 md:px-6 rounded-2xl outline-none"
              />
              <button onClick={checkReason} className="bg-india-blue hover:bg-india-hover text-white font-bold py-3 px-7 rounded-full">
                Check Reason
              </button>
              {thalaResult && (
                <div className={`p-5 rounded-2xl border ${thalaResult === 'success' ? 'bg-csk-yellow/10 border-csk-yellow' : 'bg-red-500/10 border-red-500'}`}>
                  {thalaResult === 'success' ? (
                    <div className="flex items-center gap-3"><Trophy className="text-csk-yellow" /><p>Thala For A Reason!</p></div>
                  ) : (
                    <div className="flex items-center gap-3"><XCircle className="text-red-400" /><p>Not Thala enough... try again.</p></div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'fanmap' && (
            <div className="mt-5">
              <form onSubmit={submitPin} className="rounded-2xl border border-zinc-800 bg-zinc-950/50 p-4 grid gap-3 mb-5">
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your Name" className="rounded-lg p-3 bg-zinc-950 border border-zinc-700" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" className="rounded-lg p-3 bg-zinc-950 border border-zinc-700" />
                  <input value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Country" className="rounded-lg p-3 bg-zinc-950 border border-zinc-700" />
                </div>
                <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Your tribute message" className="rounded-lg p-3 bg-zinc-950 border border-zinc-700" rows={3} />
                <button disabled={submittingPin} className="rounded-full px-5 py-2 bg-csk-yellow text-black font-black w-fit">
                  {submittingPin ? 'Pinning...' : 'Pin My City'}
                </button>
              </form>
              <div className="grid gap-3">
                {pins.map((pin) => (
                  <article key={pin._id} className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-3">
                    <p className="font-bold text-sm md:text-base">{pin.name} - {pin.city}, {pin.country}</p>
                    <p className="text-zinc-400 text-sm">{pin.message}</p>
                  </article>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'cards' && (
            <div className="mt-5">
              <label className="block text-sm text-zinc-400 mb-2">Your fan name</label>
              <input
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 p-3 mb-4"
              />
              <label className="block text-sm text-zinc-400 mb-2">Template</label>
              <div className="grid gap-2 mb-4">
                {cardTemplates.map((item) => (
                  <button key={item} onClick={() => setTemplate(item)} className={`text-left rounded-lg border p-3 ${item === template ? 'border-csk-yellow bg-csk-yellow/10' : 'border-zinc-700 bg-zinc-950'}`}>
                    {item}
                  </button>
                ))}
              </div>
              <div className="rounded-2xl border border-csk-yellow/40 bg-gradient-to-r from-zinc-900 to-zinc-950 p-5 mb-4">
                <p className="text-lg md:text-2xl font-bold whitespace-pre-line">{cardText}</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <button onClick={async () => navigator.clipboard.writeText(cardText)} className="px-5 py-2 rounded-full bg-csk-yellow text-black font-black">Copy Card Text</button>
                <button onClick={downloadCard} className="px-5 py-2 rounded-full bg-india-blue text-white font-black">Download PNG Card</button>
              </div>
            </div>
          )}
        </section>

        <section className="mt-12 rounded-3xl border border-zinc-800 bg-gradient-to-r from-zinc-900 to-zinc-950 p-8">
          <h3 className="text-3xl font-black mb-4">What keeps this tribute-first?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-zinc-300">
            <p className="rounded-xl border border-zinc-800 p-4 bg-black/20"><Sparkles className="inline mr-2 text-csk-yellow" />Every fan feature links back to a real Dhoni legacy moment.</p>
            <p className="rounded-xl border border-zinc-800 p-4 bg-black/20"><Globe2 className="inline mr-2 text-india-blue" />Community layer is optional and does not overshadow biography/stats/timeline.</p>
            <p className="rounded-xl border border-zinc-800 p-4 bg-black/20"><MessageCircleHeart className="inline mr-2 text-rose-400" />Messages are respectful-by-design and tribute themed.</p>
            <p className="rounded-xl border border-zinc-800 p-4 bg-black/20"><MapPinned className="inline mr-2 text-emerald-400" />Future fan map focuses on appreciation, not noise.</p>
          </div>
        </section>
      </div>
    </main>
  );
}
