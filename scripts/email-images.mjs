#!/usr/bin/env node
/**
 * Email clients cannot crop images and Outlook cannot show WebP, so the daily email uses
 * landscape JPEG cuts of every photo: public/photos/<slug>.webp -> public/email/<slug>.jpg.
 * Run after adding photos: npm run email:images
 */
import { mkdirSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = join(root, 'public/photos');
const out = join(root, 'public/email');
mkdirSync(out, { recursive: true });

/** Portraits whose subject sits lower in the frame: where the crop starts, as a share of the height. */
const TOP = {
  'bat-aloft-full-house': 0.38,
  'floodlit-strike': 0.3,
  'world-cup-final-six-2011': 0.3,
  'walking-out': 0.24,
};

let total = 0;
for (const f of readdirSync(src).filter((x) => x.endsWith('.webp'))) {
  const img = sharp(join(src, f));
  const { width: w, height: h } = await img.metadata();
  // Portraits: keep the upper part of the frame, where the face and the bat are.
  // Landscapes: centre crop.
  const cropH = Math.round((w * 9) / 16);
  const top = TOP[f.replace('.webp', '')] ?? 0.1;
  const piped = cropH < h ? img.extract({ left: 0, top: Math.min(h - cropH, Math.round(h * top)), width: w, height: cropH }) : img;
  const info = await piped
    .resize(1200, 675, { fit: 'cover', position: 'centre' })
    .jpeg({ quality: 68, mozjpeg: true })
    .toFile(join(out, f.replace('.webp', '.jpg')));
  total += info.size;
}
console.log(`email images: ${Math.round(total / 1024)} KB`);
