import Image from "next/image";
import Hero from "@/components/home/Hero";
import CareerTimeline from "@/components/timeline/CareerTimeline";
import StatsDashboard from "@/components/stats/StatsDashboard";
import Gallery from "@/components/home/Gallery";
import { getGalleryImages } from "@/lib/gallery";

export default function Home() {
  const galleryImages = getGalleryImages();

  return (
    <main className="min-h-screen bg-black">
      <Hero images={galleryImages} />
      <CareerTimeline />
      <StatsDashboard />
      <Gallery images={galleryImages} />
    </main>
  );
}
