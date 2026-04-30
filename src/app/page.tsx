import Hero from "@/components/home/Hero";
import CareerTimeline from "@/components/timeline/CareerTimeline";
import StatsDashboard from "@/components/stats/StatsDashboard";
import Gallery from "@/components/home/Gallery";
import { getGalleryImages } from "@/lib/gallery";
import Link from "next/link";
import OnThisDay from "@/components/home/OnThisDay";

export default function Home() {
  const galleryImages = getGalleryImages();

  return (
    <main className="min-h-screen bg-black">
      <Hero images={galleryImages} />
      <CareerTimeline />
      <StatsDashboard />
      <section className="py-16 px-4 bg-zinc-950">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white text-center mb-10">
            Dhoni <span className="text-csk-yellow">Supremacy Hub</span>
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
            <span className="px-4 py-2 rounded-full border border-csk-yellow/50 bg-csk-yellow/10 text-csk-yellow text-xs font-black tracking-widest">2007 T20 WC</span>
            <span className="px-4 py-2 rounded-full border border-csk-yellow/50 bg-csk-yellow/10 text-csk-yellow text-xs font-black tracking-widest">2011 ODI WC</span>
            <span className="px-4 py-2 rounded-full border border-csk-yellow/50 bg-csk-yellow/10 text-csk-yellow text-xs font-black tracking-widest">2013 CT</span>
            <span className="px-4 py-2 rounded-full border border-india-blue/50 bg-india-blue/10 text-india-blue text-xs font-black tracking-widest">5x IPL TITLES</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/moments" className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 hover:border-csk-yellow/60 transition-colors">
              <h3 className="text-2xl font-black text-white mb-2">Iconic Moments</h3>
              <p className="text-zinc-400">Relive the chapters that defined Captain Cool.</p>
            </Link>
            <Link href="/captaincy" className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 hover:border-india-blue/60 transition-colors">
              <h3 className="text-2xl font-black text-white mb-2">Captaincy Lab</h3>
              <p className="text-zinc-400">Interactive tactical scenarios based on Dhoni decisions.</p>
            </Link>
            <Link href="/fan-universe" className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 hover:border-csk-yellow/60 transition-colors">
              <h3 className="text-2xl font-black text-white mb-2">Fan Universe</h3>
              <p className="text-zinc-400">Community-first sub-feature without diluting tribute focus.</p>
            </Link>
            <Link href="/pressure-mode" className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 hover:border-csk-yellow/60 transition-colors">
              <h3 className="text-2xl font-black text-white mb-2">Pressure Mode</h3>
              <p className="text-zinc-400">Last-over chase simulator inspired by Dhoni finishing mindset.</p>
            </Link>
            <Link href="/supremacy-cards" className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 hover:border-india-blue/60 transition-colors">
              <h3 className="text-2xl font-black text-white mb-2">Supremacy Cards</h3>
              <p className="text-zinc-400">Generate share-ready Dhoni tribute card captions.</p>
            </Link>
          </div>
        </div>
      </section>
      <OnThisDay />
      <Gallery images={galleryImages} />
    </main>
  );
}
