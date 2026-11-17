import type { Metadata } from 'next';
import dataset from '@/data/dhoni-days.json';
import AwardsClient from './AwardsClient';

/** Player of the Match awards in the Cricsheet-derived dataset, by format. */
function potmByFormat() {
  const days = (dataset as unknown as { days: Record<string, { match: { format: string; playerOfMatch: boolean } | null }[]> }).days;
  const counts = new Map<string, number>();
  for (const events of Object.values(days)) for (const e of events) if (e.match?.playerOfMatch) counts.set(e.match.format, (counts.get(e.match.format) ?? 0) + 1);
  return ['ODI', 'Test', 'T20I', 'IPL'].filter((x) => counts.has(x)).map((x) => ({ format: x, count: counts.get(x)! }));
}

export const metadata: Metadata = {
  title: 'Awards & Honours',
  description: 'MS Dhoni’s ICC trophies, IPL titles, national honours and individual awards.',
};

export default function AwardsPage() {
  return <AwardsClient potm={potmByFormat()} />;
}
