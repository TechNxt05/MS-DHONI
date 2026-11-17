import { photo, type Photo } from './photos';

export interface Milestone {
  year: string;
  title: string;
  detail: string;
  photo: Photo;
}

/** Career arc, in order. Facts are limited to the well-documented record. */
export const milestones: Milestone[] = [
  {
    year: '2004',
    title: 'A duck, then a door opens',
    detail: 'ODI debut on 23 December against Bangladesh in Chattogram. Run out first ball. Nobody remembers that part.',
    photo: photo('helmet-in-hand'),
  },
  {
    year: '2005',
    title: '148, then 183*',
    detail: '148 against Pakistan in Visakhapatnam, then an unbeaten 183 against Sri Lanka in Jaipur: still the highest ODI score by a wicketkeeper.',
    photo: photo('sahara-power-hit'),
  },
  {
    year: '2007',
    title: 'A young side, a new trophy',
    detail: 'Handed the captaincy for the first World Twenty20, he gave Joginder Sharma the final over in Johannesburg. India won the inaugural title.',
    photo: photo('t20-trophy-2007'),
  },
  {
    year: '2009',
    title: 'Number one in Tests',
    detail: 'India reached the top of the ICC Test rankings for the first time, under Dhoni, in December 2009.',
    photo: photo('test-whites'),
  },
  {
    year: '2011',
    title: 'Wankhede, 2 April',
    detail: 'Promoted himself above Yuvraj in the final. 91 not out off 79 balls, finished with a six over long-on. India’s first World Cup in 28 years.',
    photo: photo('world-cup-final-six-2011'),
  },
  {
    year: '2013',
    title: 'The full set',
    detail: 'Champions Trophy at Edgbaston. The only captain to win the World T20, the 50-over World Cup and the Champions Trophy.',
    photo: photo('champions-trophy-2013'),
  },
  {
    year: '2014',
    title: 'Walking away from whites',
    detail: 'Retired from Test cricket mid-series in Melbourne, after 90 Tests and 60 as captain. No farewell tour.',
    photo: photo('keeping-vs-hayden'),
  },
  {
    year: '2018',
    title: 'Padma Bhushan, in uniform',
    detail: 'Received India’s third-highest civilian honour on 2 April 2018, seven years to the day after Wankhede, wearing his Territorial Army uniform.',
    photo: photo('padma-bhushan-2018'),
  },
  {
    year: '2020',
    title: '19:29 hrs',
    detail: '“Consider me as retired from 1929 hrs.” An Instagram post on 15 August ended an international career of 538 matches.',
    photo: photo('gaze-skyward'),
  },
  {
    year: '2023',
    title: 'Five for Chennai',
    detail: 'Led Chennai Super Kings to a fifth IPL title in Ahmedabad, level with the most by any captain.',
    photo: photo('csk-seven-floodlights'),
  },
];

export interface FormatLine {
  format: string;
  matches: number;
  runs: string;
  average: string;
  strikeRate: string;
  best: string;
  hundreds: number;
  fifties: number;
  catches: number;
  stumpings: number;
}

/** Final international career figures. */
export const formats: FormatLine[] = [
  { format: 'Test', matches: 90, runs: '4,876', average: '38.09', strikeRate: '59.11', best: '224', hundreds: 6, fifties: 33, catches: 256, stumpings: 38 },
  { format: 'ODI', matches: 350, runs: '10,773', average: '50.57', strikeRate: '87.56', best: '183*', hundreds: 10, fifties: 73, catches: 321, stumpings: 123 },
  { format: 'T20I', matches: 98, runs: '1,617', average: '37.60', strikeRate: '126.13', best: '56', hundreds: 0, fifties: 2, catches: 57, stumpings: 34 },
];

export const captaincy = { matches: 332, wins: 178, iccTitles: 3, iplTitles: 5 };

export interface Clip {
  slug: string;
  title: string;
  blurb: string;
}

export const clips: Clip[] = [
  { slug: 'the-finishes', title: 'The Finishes', blurb: 'Last overs, full stands, the same unhurried walk to the middle.' },
  { slug: 'art-of-keeping', title: 'The Art of Keeping', blurb: 'Stumpings faster than the replay can freeze them.' },
  { slug: 'last-over-chases', title: 'Last-Over Chases', blurb: 'Taking it deep, then taking it home.' },
  { slug: 'thala-in-yellow', title: 'Thala in Yellow', blurb: 'Chennai nights and the roar that follows him out.' },
  { slug: 'death-over-carnage', title: 'Overs 16 to 20', blurb: 'Where bowlers’ plans go to die.' },
  { slug: 'lightning-hands', title: 'Lightning Hands', blurb: 'Run-outs without looking. Reflexes as tactics.' },
];
