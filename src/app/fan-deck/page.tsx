import type { Metadata } from 'next';
import FanDeckClient from './FanDeckClient';

export const metadata: Metadata = {
  title: 'The Fan Deck',
  description: 'A 167-slide fan tribute to MS Dhoni, made in 2022 and rebuilt for the floodlights: the acronym, the search for a replacement, his own words and the film.',
};

export default function FanDeckPage() {
  return <FanDeckClient />;
}
