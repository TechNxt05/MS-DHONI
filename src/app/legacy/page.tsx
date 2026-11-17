import type { Metadata } from 'next';
import LegacyClient from './LegacyClient';

export const metadata: Metadata = {
  title: 'Quotes',
  description: 'What the cricket world says about MS Dhoni, with faces and sources, and his own best lines.',
};

export default function LegacyPage() {
  return <LegacyClient />;
}
