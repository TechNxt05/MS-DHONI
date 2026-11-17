import type { Metadata } from 'next';
import { photo } from '@/lib/photos';
import { people, portrait } from '@/lib/people';

export const metadata: Metadata = {
  title: 'Photo credits',
  description: 'Sources and licences for the photography used in this tribute.',
};

const commons = [
  { slug: 'portrait-2016', file: 'MS_Dhoni_2016.jpg', author: 'Amardeep Singh', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/' },
  { slug: 'keeping-vs-hayden', file: 'Hayden_and_Dhoni.jpg', author: 'Matt Dawson', license: 'CC BY 2.0', licenseUrl: 'https://creativecommons.org/licenses/by/2.0/' },
  { slug: 'nets-sahara', file: 'MS_Dhoni_2.jpg', author: 'Blnguyen', license: 'CC BY-SA 3.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/' },
  { slug: 'hydration-break', file: 'MS_Dhoni.jpg', author: 'Blnguyen', license: 'CC BY-SA 3.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/' },
  {
    slug: 'padma-bhushan-2018',
    file: 'The_President,_Shri_Ram_Nath_Kovind_presenting_the_Padma_Bhushan_Award_to_Shri_M.S._Dhoni,_at_the_Civil_Investiture_Ceremony-II,_at_Rashtrapati_Bhavan,_in_New_Delhi_on_April_02,_2018.jpg',
    author: 'President’s Secretariat, Government of India',
    license: 'GODL-India',
    licenseUrl: 'https://www.data.gov.in/Godl',
  },
  { slug: 'portrait-2023', file: "MS_Dhoni_(Prabhav_'23_-_RiGI_2023).jpg", author: 'RIGI', license: 'CC BY 3.0', licenseUrl: 'https://creativecommons.org/licenses/by/3.0/' },
];

export default function CreditsPage() {
  return (
    <main className="mx-auto max-w-[1100px] px-4 pb-28 pt-36 sm:px-8 md:pt-44">
      <h1 className="font-display text-[clamp(3.4rem,9vw,7rem)] font-black uppercase leading-[0.85]">Photo credits</h1>
      <p className="mt-6 max-w-[60ch] text-lg text-chalk">
        This is a non-commercial fan tribute. Archive photographs come from Wikimedia Commons under the licences below; they were
        resized and re-encoded for the web. All other photographs, fan artwork and highlight footage remain the property of their
        respective owners.
      </p>

      <ul className="mt-14 divide-y divide-flood/10 border-y border-flood/10">
        {commons.map((c) => {
          const p = photo(c.slug);
          return (
            <li key={c.slug} className="grid gap-5 py-6 sm:grid-cols-[8rem_1fr] sm:items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.src} alt={p.alt} loading="lazy" decoding="async" className="aspect-square w-32 rounded-2xl object-cover object-top" />
              <div>
                <p className="font-semibold text-flood">{p.alt}</p>
                <p className="mt-1 text-sm text-chalk">
                  By {c.author} ·{' '}
                  <a href={c.licenseUrl} target="_blank" rel="noreferrer license" className="text-gold underline">
                    {c.license}
                  </a>{' '}
                  ·{' '}
                  <a href={`https://commons.wikimedia.org/wiki/File:${encodeURIComponent(c.file)}`} target="_blank" rel="noreferrer" className="text-blue underline">
                    Source
                  </a>
                </p>
              </div>
            </li>
          );
        })}
      </ul>
      <h2 className="mt-20 font-display text-4xl font-black uppercase leading-none">Portraits</h2>
      <p className="mt-3 max-w-[60ch] text-chalk">Square crops of each person’s lead image on Wikipedia, from Wikimedia Commons.</p>
      <ul className="mt-8 grid gap-x-8 gap-y-4 border-t border-flood/10 pt-6 sm:grid-cols-2">
        {Object.entries(people).map(([slug, p]) => (
          <li key={slug} className="flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={portrait(slug)!} alt="" loading="lazy" decoding="async" className="h-12 w-12 shrink-0 rounded-full object-cover" />
            <p className="text-sm text-chalk">
              <span className="font-semibold text-flood">{p.name}</span> · {p.author} ·{' '}
              {p.licenseUrl ? (
                <a href={p.licenseUrl} target="_blank" rel="noreferrer license" className="text-gold underline">
                  {p.license}
                </a>
              ) : (
                p.license
              )}{' '}
              ·{' '}
              <a href={p.source} target="_blank" rel="noreferrer" className="text-blue underline">
                Source
              </a>
            </p>
          </li>
        ))}
      </ul>
      <p className="mt-8 text-sm text-dust">
        Earth outlines on the fan globe: Natural Earth via the world-atlas package (public domain).
      </p>
      <p className="mt-3 text-sm text-dust">
        Match figures in “On this day” are computed from ball-by-ball data by{' '}
        <a href="https://cricsheet.org/" target="_blank" rel="noreferrer" className="text-blue underline">
          Cricsheet
        </a>
        , available under the{' '}
        <a href="https://opendatacommons.org/licenses/by/1-0/" target="_blank" rel="noreferrer license" className="text-blue underline">
          Open Data Commons Attribution License
        </a>
        .
      </p>
    </main>
  );
}
