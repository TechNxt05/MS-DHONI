import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="relative flex min-h-[100svh] items-center overflow-hidden">
      <p aria-hidden className="text-outline pointer-events-none absolute -right-[5vw] top-1/2 -translate-y-1/2 select-none font-display text-[42vw] font-black leading-none">
        0.08
      </p>
      <div className="relative mx-auto w-full max-w-[1500px] px-4 sm:px-8">
        <h1 className="font-display text-[clamp(4.5rem,15vw,12rem)] font-black uppercase leading-[0.8]">
          Stumped.
        </h1>
        <p className="mt-6 max-w-[42ch] text-lg text-chalk">
          You were out of your crease for 0.08 seconds and this page was gone. It happens to the best batters.
        </p>
        <Link href="/" className="mt-10 inline-flex rounded-full bg-gold px-8 py-4 text-sm font-bold uppercase tracking-[0.12em] text-night transition-colors hover:bg-flood">
          Walk back to the pavilion
        </Link>
      </div>
    </main>
  );
}
