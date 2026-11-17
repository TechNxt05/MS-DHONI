import type { Metadata } from 'next';
import GalleryClient from './GalleryClient';

export const metadata: Metadata = {
  title: 'Gallery',
  description: 'A visual journey through the career of Captain Cool.',
};

export default function GalleryPage() {
  return <GalleryClient />;
}
