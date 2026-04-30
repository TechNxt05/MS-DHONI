'use client';

import { useMemo, useState } from 'react';

const templates = [
  'Dhoni: Calm mind. Ruthless finish.',
  'In pressure, others panic. Thala calculates.',
  'Captain Cool is not a style. It is a standard.',
];

export default function SupremacyCardsPage() {
  const [name, setName] = useState('Thala Fan');
  const [template, setTemplate] = useState(templates[0]);

  const cardText = useMemo(() => `${template}\n- ${name}`, [template, name]);

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
    const lines = cardText.split('\n');
    lines.forEach((line, idx) => {
      ctx.fillText(line, 70, 220 + idx * 80);
    });

    ctx.fillStyle = '#94a3b8';
    ctx.font = '28px Arial';
    ctx.fillText('Generated from fan tribute website', 70, 560);

    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = 'dhoni-supremacy-card.png';
    link.click();
  };

  return (
    <main className="min-h-screen bg-black text-white pt-32 pb-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-center mb-4">
          Supremacy <span className="text-csk-yellow">Cards</span>
        </h1>
        <p className="text-zinc-400 text-center mb-10">Create a share-ready Dhoni quote card caption in one click.</p>

        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-6 mb-6">
          <label className="block text-sm text-zinc-400 mb-2">Your fan name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-zinc-700 bg-zinc-950 p-3 mb-4"
          />
          <label className="block text-sm text-zinc-400 mb-2">Template</label>
          <div className="grid gap-2">
            {templates.map((item) => (
              <button
                key={item}
                onClick={() => setTemplate(item)}
                className={`text-left rounded-lg border p-3 ${
                  item === template ? 'border-csk-yellow bg-csk-yellow/10' : 'border-zinc-700 bg-zinc-950'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-csk-yellow/40 bg-gradient-to-r from-zinc-900 to-zinc-950 p-8 mb-5">
          <p className="text-xl md:text-2xl font-bold whitespace-pre-line">{cardText}</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={async () => navigator.clipboard.writeText(cardText)}
            className="px-6 py-3 rounded-full bg-csk-yellow text-black font-black"
          >
            Copy Card Text
          </button>
          <button
            onClick={downloadCard}
            className="px-6 py-3 rounded-full bg-india-blue text-white font-black"
          >
            Download PNG Card
          </button>
        </div>
      </div>
    </main>
  );
}
