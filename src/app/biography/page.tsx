import type { Metadata } from 'next';
import BiographyClient from './BiographyClient';

export const metadata: Metadata = {
  title: 'Biography',
  description: 'From a ticket collector in Kharagpur to India’s most successful captain: the life of MS Dhoni.',
};

export default function BiographyPage() {
  return <BiographyClient />;
}
