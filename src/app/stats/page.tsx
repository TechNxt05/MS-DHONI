import type { Metadata } from 'next';
import StatsClient from './StatsClient';

export const metadata: Metadata = {
  title: 'Numbers & Records',
  description: 'MS Dhoni’s batting, wicketkeeping and captaincy records across Tests, ODIs, T20Is and the IPL.',
};

export default function StatsPage() {
  return <StatsClient />;
}
