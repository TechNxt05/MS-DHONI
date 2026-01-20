import { getGalleryImages } from '@/lib/gallery';
import GalleryClient from './GalleryClient';

export const metadata = {
    title: 'Gallery | MS Dhoni',
    description: 'A visual journey through the career of Captain Cool.',
};

export default function GalleryPage() {
    const images = getGalleryImages();

    // Shuffle images for randomness on load
    const shuffledImages = images.sort(() => Math.random() - 0.5);

    return <GalleryClient images={shuffledImages} />;
}
