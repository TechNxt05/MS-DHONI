import type { Metadata } from 'next';
import MomentsClient from './MomentsClient';

export const metadata: Metadata = {
  title: 'Iconic Moments',
  description: 'The innings, decisions and finishes that built the legend of MS Dhoni.',
};

export default function MomentsPage() {
  return <MomentsClient />;
}
