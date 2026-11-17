import type { Metadata } from 'next';
import NewsClient from './NewsClient';

export const metadata: Metadata = {
  title: 'News',
  description: 'The latest MS Dhoni and Chennai Super Kings stories.',
};

export default function NewsPage() {
  return <NewsClient />;
}
