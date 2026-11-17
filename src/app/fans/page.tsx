import type { Metadata } from 'next';
import FansClient from './FansClient';

export const metadata: Metadata = {
  title: 'Fan Wall',
  description: 'Leave a message for Captain Cool and read tributes from fans around the world.',
};

export default function FansPage() {
  return <FansClient />;
}
