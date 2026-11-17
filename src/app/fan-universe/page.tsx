import type { Metadata } from 'next';
import FanUniverseClient from './FanUniverseClient';
import { isTab } from './tabs';

export const metadata: Metadata = {
  title: 'Fan Universe',
  description: 'Play Pressure Mode and the Captaincy Lab, find your 7, pin your city on the fan globe, and make a tribute card.',
};

export default async function FanUniversePage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const { tab } = await searchParams;
  return <FanUniverseClient initialTab={isTab(tab) ? tab : 'thala'} />;
}
