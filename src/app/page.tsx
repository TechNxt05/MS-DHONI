import Hero from '@/components/home/Hero';
import CareerTimeline from '@/components/timeline/CareerTimeline';
import StatsDashboard from '@/components/stats/StatsDashboard';
import HighlightReel from '@/components/home/HighlightReel';
import PhotoRing from '@/components/home/PhotoRing';
import Explore from '@/components/home/Explore';
import OnThisDay from '@/components/home/OnThisDay';
import Gallery from '@/components/home/Gallery';
import Ticker from '@/components/home/Ticker';
import TodayBox from '@/components/home/TodayBox';
import { photos } from '@/lib/photos';

export default function Home() {
  // Photography first on the home page; fan artwork lives in the full gallery.
  const homePhotos = photos.filter((p) => p.tag !== 'art');

  return (
    <main>
      <Hero />
      <Ticker />
      <div className="bg-night px-4 py-14 sm:px-8 md:py-20">
        <div className="mx-auto max-w-[1500px]">
          <TodayBox />
        </div>
      </div>
      <CareerTimeline />
      <StatsDashboard />
      <HighlightReel />
      <PhotoRing />
      <Explore />
      <OnThisDay />
      <Gallery photos={homePhotos} />
    </main>
  );
}
