'use client';

import { AnimatePresence, motion, useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import PageHero from '@/components/layout/PageHero';
import { Reveal, SplitReveal } from '@/components/fx/primitives';
import { photo, type Photo } from '@/lib/photos';

const chapters: { title: string; body: string[]; photo: Photo }[] = [
  {
    title: 'The beginning',
    photo: photo('storm-sky'),
    body: [
      'Mahendra Singh Dhoni was born on 7 July 1981 in Ranchi, then in Bihar and now in Jharkhand, the youngest of three children of Pan Singh and Devaki Devi. The family’s roots were in Lwali village in Uttarakhand.',
      'At DAV Jawahar Vidya Mandir he kept goal for the football team until his coach, Keshav Banerjee, sent him to keep wicket for the cricket side instead. Between 2001 and 2003 he worked as a Travelling Ticket Examiner at Kharagpur station for Indian Railways.',
    ],
  },
  {
    title: 'Early career',
    photo: photo('keeper-gloves-wide'),
    body: [
      'He kept for Commando Cricket Club from 1995 to 1998, then for Central Coal Fields Limited, where he batted higher and helped the side climb a division. That form earned a place in the Vinoo Mankad Trophy under-16 championship.',
      'He made his Ranji Trophy debut for Bihar in 1999–2000. The breakthrough came on the 2003–04 India A tour of Zimbabwe and Kenya, where his hitting made the selectors pay attention.',
    ],
  },
  {
    title: 'Rise to stardom',
    photo: photo('world-cup-final-six-2011'),
    body: [
      'Dhoni debuted for India in December 2004. In 2007 he was made captain of the T20 side, then the ODI side, and by 2008 he led in all three formats.',
      'Under him India won the 2007 ICC World Twenty20, the 2011 World Cup and the 2013 Champions Trophy: the only captain to win all three.',
    ],
  },
  {
    title: 'Captain Cool',
    photo: photo('keeper-directs-field'),
    body: [
      'His calm under pressure reshaped how Indian teams chased and defended. He took India to No. 1 in the ICC Test rankings for the first time, and his helicopter shot and lightning stumpings became signatures.',
      'In the IPL he led Chennai Super Kings to five titles. The fans call him Thala: the leader.',
    ],
  },
  {
    title: 'Personal life',
    photo: photo('padma-bhushan-2018'),
    body: [
      'Dhoni married Sakshi Singh Rawat on 4 July 2010; they have a daughter, Ziva. He still lives in Ranchi, on a farmhouse full of motorcycles and cars.',
      'He holds the honorary rank of Lieutenant Colonel in the Parachute Regiment of the Territorial Army, and received the Padma Bhushan in that uniform in 2018.',
    ],
  },
  {
    title: 'The legacy',
    photo: photo('bat-raised-milestone'),
    body: [
      'Few names bring as much joy to as many people. His road from a small-town station to the biggest grounds in the world proves the dream is reachable.',
      'He walked away from international cricket on 15 August 2020. For his fans he remains more than a cricketer: Thala, Captain Cool, the forever finisher.',
    ],
  },
];

const facts = [
  { year: '2004', label: 'ODI debut', value: '23 Dec vs Bangladesh' },
  { year: '2005', label: 'Test debut', value: '2 Dec vs Sri Lanka' },
  { year: '2007', label: 'World T20', value: 'Champion captain' },
  { year: '2011', label: 'World Cup final', value: '91* at Wankhede' },
  { year: '2013', label: 'Champions Trophy', value: 'ICC treble complete' },
  { year: '2020', label: 'Retirement', value: 'Announced 15 August' },
];

function Chapter({ index, onActive, children }: { index: number; onActive: (i: number) => void; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: '-45% 0px -45% 0px' });
  useEffect(() => {
    if (inView) onActive(index);
  }, [inView, index, onActive]);
  return (
    <div ref={ref} className="flex min-h-[70vh] flex-col justify-center py-16">
      {children}
    </div>
  );
}

export default function BiographyClient() {
  const [active, setActive] = useState(0);
  const current = chapters[active];

  return (
    <main>
      <PageHero
        title="Ticket collector to trophy collector"
        accent={['trophy']}
        backdrop={photo('portrait-2016')}
        position="50% 20%"
        intro="From the platforms of Kharagpur to the balcony at Wankhede: the life of Mahendra Singh Dhoni."
      />

      {/* Fact strip */}
      <section aria-label="Verified milestones" className="border-y border-flood/10 bg-pitch">
        <ul className="mx-auto grid max-w-[1500px] grid-cols-2 divide-flood/10 px-4 sm:px-8 md:grid-cols-3 md:divide-x lg:grid-cols-6">
          {facts.map((f, i) => (
            <li key={f.year + f.label} className="py-6 md:px-6 md:first:pl-0">
              <Reveal delay={i * 0.05}>
                <p className="tnum font-display text-3xl font-black text-gold">{f.year}</p>
                <p className="mt-1 font-semibold text-flood">{f.label}</p>
                <p className="text-sm text-dust">{f.value}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      {/* Scrollytelling chapters */}
      <section className="mx-auto grid max-w-[1500px] gap-10 px-4 sm:px-8 lg:grid-cols-[1fr_1fr] lg:gap-20">
        <div>
          {chapters.map((c, i) => (
            <Chapter key={c.title} index={i} onActive={setActive}>
              {/* On small screens the photograph sits with its chapter. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={c.photo.src} alt={c.photo.alt} loading="lazy" decoding="async" className="mb-8 aspect-[4/3] w-full rounded-3xl object-cover object-top lg:hidden" />
              <SplitReveal
                as="h2"
                text={c.title}
                className="font-display text-[clamp(2.8rem,5vw,4.5rem)] font-black uppercase leading-[0.88]"
              />
              <div className="mt-6 space-y-5 text-lg leading-relaxed text-chalk">
                {c.body.map((p) => (
                  <Reveal key={p.slice(0, 20)}>
                    <p className="max-w-[60ch]">{p}</p>
                  </Reveal>
                ))}
              </div>
            </Chapter>
          ))}
        </div>

        <div className="relative hidden lg:block">
          <div className="sticky top-0 flex h-screen items-center">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[32px] border border-flood/10 bg-pitch">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.img
                  key={current.photo.src}
                  src={current.photo.src}
                  alt={current.photo.alt}
                  className="absolute inset-0 h-full w-full object-cover object-top"
                  initial={{ opacity: 0, scale: 1.12, clipPath: 'inset(100% 0% 0% 0%)' }}
                  animate={{ opacity: 1, scale: 1, clipPath: 'inset(0% 0% 0% 0%)' }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
                />
              </AnimatePresence>
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-night/90 to-transparent p-6 pt-24">
                <p className="max-w-[30ch] text-sm text-chalk">{current.photo.alt}</p>
                <p className="tnum font-display text-2xl font-black text-gold">
                  {active + 1}/{chapters.length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-flood/10 bg-pitch py-28 md:py-40">
        <Reveal className="mx-auto max-w-[1100px] px-4 text-center sm:px-8">
          <blockquote className="font-display text-[clamp(2.2rem,5vw,4.4rem)] font-black uppercase leading-[0.95] text-flood">
            “I tell my wife she is only the third most important thing in my life. I love my country, I love my parents, and then
            she comes.”
          </blockquote>
          <cite className="mt-8 block text-lg font-semibold not-italic text-gold">Mahendra Singh Dhoni</cite>
        </Reveal>
      </section>
    </main>
  );
}
