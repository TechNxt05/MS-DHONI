import Link from 'next/link';
import ThreeDToggle from './ThreeDToggle';

const links = [
  { name: 'Story', href: '/biography' },
  { name: 'Moments', href: '/moments' },
  { name: 'Numbers', href: '/stats' },
  { name: 'On This Day', href: '/on-this-day' },
  { name: 'The Greatest', href: '/the-greatest' },
  { name: 'Friends & Duos', href: '/friends' },
  { name: 'Fan Deck', href: '/fan-deck' },
  { name: 'Awards', href: '/awards' },
  { name: 'Quotes', href: '/legacy' },
  { name: 'Gallery', href: '/gallery' },
  { name: 'Fan Universe', href: '/fan-universe' },
  { name: 'News', href: '/news' },
  { name: 'Fan Wall', href: '/fans' },
  { name: 'Photo credits', href: '/credits' },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-flood/10 bg-night">
      <div className="mx-auto max-w-[1500px] px-4 pb-10 pt-20 sm:px-8">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr]">
          <p className="max-w-[18ch] font-display text-[clamp(2.4rem,5vw,4.2rem)] font-black uppercase leading-[0.9] text-flood">
            Some finish matches. <span className="text-gold">He finished arguments.</span>
          </p>
          <nav aria-label="Footer">
            <ul className="grid grid-cols-2 gap-x-8 gap-y-3 text-chalk">
              {links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="transition-colors hover:text-gold">
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <p aria-hidden className="text-outline pointer-events-none mt-16 select-none text-center font-display text-[22vw] font-black uppercase leading-[0.75] tracking-[-0.03em]">
          Thala
        </p>

        <div className="mt-10 flex flex-col gap-3 border-t border-flood/10 pt-6 text-sm text-dust md:flex-row md:items-center md:justify-between">
          <p>Made by Amritanshu Yadav, a fan. Not affiliated with MS Dhoni, the BCCI or Chennai Super Kings.</p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <ThreeDToggle />
            <p className="tnum">2007 · 2011 · 2013 · © {new Date().getFullYear()}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
