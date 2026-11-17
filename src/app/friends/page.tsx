import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import partners from '@/data/partners.json';
import PageHero from '@/components/layout/PageHero';
import { Counter, Reveal, SplitReveal } from '@/components/fx/primitives';
import { photo } from '@/lib/photos';
import { portrait } from '@/lib/people';

export const metadata: Metadata = {
  title: 'Friends & Duos',
  description: 'Dhoni with Raina, Kohli and Jadeja, by the numbers and the stories, plus the friends he made across cricket and beyond.',
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const short = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
};
const dayLink = (iso: string) => `/on-this-day?d=${iso.slice(5)}`;

type Stand = { runs: number; balls: number; date: string; format: string; team: string; opponent: string; venue: string; won: boolean; unbroken: boolean };
type Focus = { stands: number; runs: number; fifties: number; hundreds: number; matches: number; wonTogether: number; byTeam: Record<string, number>; best: Stand[] };
const focus = partners.focus as unknown as Record<string, Focus>;

const DISPLAY: Record<string, string> = {
  'SK Raina': 'Suresh Raina',
  'Yuvraj Singh': 'Yuvraj Singh',
  'RA Jadeja': 'Ravindra Jadeja',
  'V Kohli': 'Virat Kohli',
  'SR Tendulkar': 'Sachin Tendulkar',
  'R Dravid': 'Rahul Dravid',
  'RG Sharma': 'Rohit Sharma',
  'G Gambhir': 'Gautam Gambhir',
  'VVS Laxman': 'VVS Laxman',
  'R Ashwin': 'Ravichandran Ashwin',
  'AT Rayudu': 'Ambati Rayudu',
  'KM Jadhav': 'Kedar Jadhav',
};

const duos = [
  {
    name: 'Suresh Raina',
    nick: 'Chinna Thala',
    slug: 'suresh-raina',
    photos: [photo('raina-embrace'), photo('victory-bike-ride'), photo('raina-strategy')],
    story: [
      'Teammates for India from 2005 and for Chennai from the first IPL season in 2008. Fans call Raina “Chinna Thala”: the little Thala.',
      'When Ziva was born in February 2015, Sakshi got the news to Dhoni in Australia through Raina.',
      'On 15 August 2020, minutes after Dhoni’s Instagram post, Raina announced his own retirement: “I choose to join you in this journey.”',
    ],
  },
  {
    name: 'Virat Kohli',
    nick: 'Captain and vice-captain',
    slug: 'virat-kohli',
    photos: [photo('with-kohli'), photo('team-india-walk')],
    story: [
      'Kohli made his ODI debut in Dambulla in August 2008, in a side Dhoni captained, and both were in the XI that won the 2011 World Cup.',
      'He took over the Test captaincy when Dhoni retired from Tests in Australia in 2014, and the white-ball captaincy in January 2017.',
      'Dhoni played on under him until the 2019 World Cup. Their last T20I together, in Bengaluru, brought a 100-run stand.',
    ],
  },
  {
    name: 'Ravindra Jadeja',
    nick: '“Sir” Jadeja',
    slug: 'ravindra-jadeja',
    photos: [photo('csk-trio'), photo('csk-keeper-command')],
    story: [
      'Dhoni’s playful “Sir Jadeja” jokes on Twitter in 2013 gave Jadeja a nickname that stuck.',
      'Chennai teammates since 2012. In 2022 Dhoni handed him the captaincy; eight games later he handed it back.',
      'In the 2023 final, Jadeja hit the last two balls for six and four. Dhoni, the calmest man in the stadium, lifted him off the ground.',
    ],
  },
];

const friends = [
  { slug: 'sachin-tendulkar', name: 'Sachin Tendulkar', line: 'Asked for his view in 2007, Tendulkar recommended Dhoni for the captaincy. Dhoni later led him to the 2011 World Cup.' },
  { slug: 'yuvraj-singh', name: 'Yuvraj Singh', line: 'Unbeaten together on 54 when the six landed at Wankhede in 2011, and 256 together in Cuttack in 2017.' },
  { slug: 'dwayne-bravo', name: 'Dwayne Bravo', line: 'Chennai teammate from 2011. Three IPL finals won side by side: 2011, 2018 and 2021.' },
  { slug: 'michael-hussey', name: 'Michael Hussey', line: 'In the Chennai XI for the franchise’s very first IPL match in 2008, and for the 2011 final win.' },
  { slug: 'gary-kirsten', name: 'Gary Kirsten', line: 'India coach from 2008 to 2011. Captain and coach built the side that won the World Cup.' },
  { slug: 'hardik-pandya', name: 'Hardik Pandya', line: 'Debuted under Dhoni in Adelaide in January 2016, won the Asia Cup with him weeks later, and met him in the 2023 IPL final.' },
  { slug: 'rishabh-pant', name: 'Rishabh Pant', line: 'Debuted in the Bengaluru T20I of February 2017, the night Dhoni hit his first T20I fifty, and later succeeded him behind the stumps.' },
  { slug: 'sushant-singh-rajput', name: 'Sushant Singh Rajput', line: 'Played Dhoni in M.S. Dhoni: The Untold Story (2016), the film that brought his life to cinemas.' },
  { slug: 'abhishek-bachchan', name: 'Abhishek Bachchan', line: 'Co-owners together of Chennaiyin FC in the Indian Super League.' },
];

function Portrait({ slug, size }: { slug: string; size: string }) {
  const src = portrait(slug);
  // eslint-disable-next-line @next/next/no-img-element
  return src ? <img src={src} alt="" loading="lazy" decoding="async" className={`${size} shrink-0 rounded-full border border-flood/15 object-cover`} /> : null;
}

export default function FriendsPage() {
  const top = partners.topPartners;
  const maxRuns = top[0].runs;

  return (
    <main>
      <PageHero
        title="Friends & duos"
        accent={['duos']}
        backdrop={photo('training-laughs')}
        position="50% 35%"
        intro="The men he batted beside, the ones he passed the baton to, and the friends he made along the way. Partnership figures are counted ball by ball from the scorecards."
      />

      {duos.map((d, i) => {
        const f = focus[d.name];
        const teams = Object.entries(f.byTeam)
          .map(([t, n]) => `${n} for ${t === 'India' ? 'India' : 'Chennai'}`)
          .join(', ');
        const id = d.name.split(' ')[1].toLowerCase();
        return (
          <section key={d.name} id={id} aria-labelledby={`${id}-title`} className={`scroll-mt-24 border-t border-flood/10 py-24 md:py-32 ${i % 2 ? 'bg-pitch' : ''}`}>
            <div className="mx-auto max-w-[1500px] px-4 sm:px-8">
              <div className="flex flex-wrap items-center gap-6 md:gap-10">
                <div className="flex -space-x-6">
                  <Portrait slug={d.slug} size="h-24 w-24 md:h-32 md:w-32" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photo('portrait-2016').src} alt="" loading="lazy" decoding="async" className="h-24 w-24 shrink-0 rounded-full border border-flood/15 object-cover object-top md:h-32 md:w-32" />
                </div>
                <div>
                  <p className="font-display text-lg font-bold uppercase tracking-[0.1em] text-gold">{d.nick}</p>
                  <SplitReveal
                    id={`${id}-title`}
                    as="h2"
                    text={`Dhoni & ${d.name.split(' ')[1]}`}
                    accent={[d.name.split(' ')[1]]}
                    className="font-display text-[clamp(3rem,8vw,6rem)] font-black uppercase leading-[0.85] tracking-[-0.02em]"
                  />
                </div>
              </div>

              <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { v: String(f.matches), l: 'Matches together', s: teams },
                  { v: String(f.wonTogether), l: 'Won together', s: `${Math.round((100 * f.wonTogether) / f.matches)}% of them` },
                  { v: f.runs.toLocaleString('en-IN'), l: 'Partnership runs', s: `in ${f.stands} stands` },
                  { v: String(f.hundreds + f.fifties), l: 'Stands of 50 or more', s: `${f.hundreds} of them worth 100+` },
                ].map((s) => (
                  <div key={s.l} className="border-t border-flood/15 pt-4">
                    <Counter value={s.v} className="tnum block font-display text-[clamp(3rem,6vw,4.6rem)] font-black leading-none text-gold" />
                    <p className="mt-2 font-semibold text-flood">{s.l}</p>
                    <p className="text-sm text-dust">{s.s}</p>
                  </div>
                ))}
              </div>

              <div className="mt-14 grid gap-12 lg:grid-cols-[1fr_1fr]">
                <div>
                  <ul className="space-y-5 text-lg leading-relaxed text-chalk">
                    {d.story.map((line) => (
                      <li key={line}>
                        <Reveal>{line}</Reveal>
                      </li>
                    ))}
                  </ul>
                  <h3 className="mt-10 font-display text-2xl font-black uppercase">Their biggest stands</h3>
                  <ol className="mt-3 divide-y divide-flood/10 border-y border-flood/10">
                    {f.best.slice(0, 3).map((b) => (
                      <li key={b.date + b.runs} className="flex items-baseline justify-between gap-4 py-3">
                        <span>
                          <span className="font-semibold text-flood">
                            {b.format} vs {b.opponent}
                          </span>
                          <span className="block text-sm text-dust">
                            {b.venue} · {b.won ? 'won' : 'lost'}
                          </span>
                          <Link href={dayLink(b.date)} className="inline-flex items-center gap-1 text-sm font-semibold text-blue hover:text-gold">
                            {short(b.date)}
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          </Link>
                        </span>
                        <span className="tnum font-display text-3xl font-black text-gold">
                          {b.runs}
                          {b.unbroken ? '*' : ''}
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>
                <div className={`grid gap-3 ${d.photos.length === 3 ? 'grid-cols-2 [&>*:first-child]:col-span-2' : 'grid-cols-1'}`}>
                  {d.photos.map((p) => (
                    <Reveal key={p.src}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.src} alt={p.alt} loading="lazy" decoding="async" className="aspect-[16/10] w-full rounded-[24px] border border-flood/10 object-cover object-[50%_30%]" />
                    </Reveal>
                  ))}
                </div>
              </div>
            </div>
          </section>
        );
      })}

      {/* Everyone he batted with */}
      <section aria-labelledby="partners-title" className="border-t border-flood/10 py-24 md:py-32">
        <div className="mx-auto max-w-[1500px] px-4 sm:px-8">
          <SplitReveal
            id="partners-title"
            as="h2"
            text="At the other end"
            accent={['other']}
            className="font-display text-[clamp(3rem,8vw,6rem)] font-black uppercase leading-[0.85] tracking-[-0.02em]"
          />
          <Reveal delay={0.1}>
            <p className="mt-5 max-w-[56ch] text-lg text-chalk">His twelve most productive batting partners, by runs added together for India and in the IPL.</p>
          </Reveal>
          <ol className="mt-12 space-y-3">
            {top.map((p, i) => {
              const name = DISPLAY[p.name] ?? p.name;
              const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
              return (
                <li key={p.name}>
                  <Reveal delay={Math.min(i, 6) * 0.04} className="grid grid-cols-[2.5rem_1fr] items-center gap-4 md:grid-cols-[3rem_14rem_1fr_5rem]">
                    <span className="grid h-10 w-10 place-items-center overflow-hidden rounded-full bg-pitch font-display text-sm font-black text-gold md:h-12 md:w-12">
                      {portrait(slug) ? <Portrait slug={slug} size="h-full w-full" /> : name.split(' ').map((w) => w[0]).join('').slice(0, 2)}
                    </span>
                    <span className="font-semibold text-flood">
                      {name}
                      <span className="block text-xs font-normal text-dust md:hidden">
                        {p.runs.toLocaleString('en-IN')} runs · best {p.best.runs}
                      </span>
                    </span>
                    <span className="col-span-2 h-3 overflow-hidden rounded-full bg-flood/[0.06] md:col-span-1" aria-hidden>
                      <span className="block h-full rounded-full bg-gold" style={{ width: `${(100 * p.runs) / maxRuns}%` }} />
                    </span>
                    <span className="tnum hidden text-right font-display text-2xl font-black text-gold md:block">{p.runs.toLocaleString('en-IN')}</span>
                  </Reveal>
                </li>
              );
            })}
          </ol>
          <p className="mt-6 text-sm text-dust">
            From Cricsheet ball-by-ball data covering 509 of his 538 internationals and 277 IPL matches. Runs include extras.
          </p>
        </div>
      </section>

      {/* Friends across the game and beyond */}
      <section aria-labelledby="friends-title" className="border-t border-flood/10 bg-pitch py-24 md:py-32">
        <div className="mx-auto max-w-[1500px] px-4 sm:px-8">
          <SplitReveal
            id="friends-title"
            as="h2"
            text="Friends of the game, and beyond"
            accent={['beyond']}
            className="font-display text-[clamp(2.8rem,7vw,5.4rem)] font-black uppercase leading-[0.85] tracking-[-0.02em]"
          />
          <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {friends.map((f, i) => (
              <li key={f.slug}>
                <Reveal delay={(i % 3) * 0.06} className="flex h-full gap-5 rounded-[22px] border border-flood/10 bg-night p-6">
                  <Portrait slug={f.slug} size="h-20 w-20" />
                  <div>
                    <p className="font-display text-2xl font-black uppercase leading-none">{f.name}</p>
                    <p className="mt-2 text-chalk">{f.line}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
          <p className="mt-10 text-sm text-dust">
            Portraits from Wikimedia Commons; photographers and licences are on the{' '}
            <Link href="/credits" className="text-blue underline">
              credits page
            </Link>
            .
          </p>
        </div>
      </section>
    </main>
  );
}
