import fs from 'fs';
import path from 'path';

export function getGalleryImages() {
    const galleryDir = path.join(process.cwd(), 'public/gallery');
    try {
        const files = fs.readdirSync(galleryDir);
        return files
            .filter(file => /\.(jpg|jpeg|png|webp|avif)$/i.test(file))
            .map(file => `/gallery/${file}`);
    } catch (error) {
        console.error('Error reading gallery directory:', error);
        return [];
    }
}
