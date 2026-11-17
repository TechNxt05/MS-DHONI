import dataset from '@/data/dhoni-days.json';
import { formats } from './dhoni';

/**
 * Material for /the-greatest: the headings of the 2022 fan deck, expanded.
 * Computed figures come from the Cricsheet-derived dataset (it covers 331 of his 350 ODIs);
 * official career totals come from lib/dhoni.
 */

interface Bat {
  runs: number;
  balls: number;
  notOut: boolean;
}
interface MatchEvent {
  date: string;
  title: string;
  match: {
    format: string;
    team: string;
    opponent: string;
    venue: string;
    competition: string;
    stage: string | null;
    result: string;
    won: boolean | null;
    chasing?: boolean;
    finished?: 'six' | 'four' | 'runs' | null;
    batting: Bat[];
    bestScore: string | null;
    fielding: { catches: number; stumpings: number; runOuts: number };
  } | null;
}

const matches: (MatchEvent & { match: NonNullable<MatchEvent['match']> })[] = [];
for (const events of Object.values((dataset as unknown as { days: Record<string, MatchEvent[]> }).days)) {
  for (const e of events) if (e.match) matches.push(e as MatchEvent & { match: NonNullable<MatchEvent['match']> });
}
matches.sort((a, b) => a.date.localeCompare(b.date));

export const dayLink = (iso: string) => `/on-this-day?d=${iso.slice(5)}`;
export const g = (name: string) => `/greatest/${name}.webp`;

// ---------------------------------------------------------------- The Champion
export interface Trophy {
  year: number;
  title: string;
  role: 'Captain' | 'Player';
  date: string;
  detail: string;
}

export const trophies: Trophy[] = [
  { year: 2007, title: 'ICC World Twenty20', role: 'Captain', date: '2007-09-24', detail: 'Beat Pakistan by 5 runs in Johannesburg. Joginder Sharma bowled the last over.' },
  { year: 2008, title: 'CB Series, Australia', role: 'Captain', date: '2008-03-04', detail: 'Won the best-of-three finals 2–0 against the world champions.' },
  { year: 2009, title: 'Compaq Cup, Sri Lanka', role: 'Captain', date: '2009-09-14', detail: 'His 56 helped beat Sri Lanka by 46 runs in the Colombo final.' },
  { year: 2009, title: 'No. 1 in the ICC Test rankings', role: 'Captain', date: '2009-12-06', detail: 'India reached the top for the first time after an innings win at the Brabourne.' },
  { year: 2010, title: 'Indian Premier League', role: 'Captain', date: '2010-04-25', detail: 'Chennai’s first title, beating Mumbai Indians by 22 runs.' },
  { year: 2010, title: 'Asia Cup', role: 'Captain', date: '2010-06-24', detail: 'Beat Sri Lanka by 81 runs in the Dambulla final.' },
  { year: 2010, title: 'Champions League T20', role: 'Captain', date: '2010-09-26', detail: 'Chennai beat Warriors in Johannesburg.' },
  { year: 2011, title: 'ICC Cricket World Cup', role: 'Captain', date: '2011-04-02', detail: '91* off 79 in the final at Wankhede, finished with a six.' },
  { year: 2011, title: 'Indian Premier League', role: 'Captain', date: '2011-05-28', detail: 'Back-to-back titles, beating Royal Challengers Bangalore by 58 runs.' },
  { year: 2013, title: 'ICC Champions Trophy', role: 'Captain', date: '2013-06-23', detail: 'Beat England by 5 runs at Edgbaston and completed the ICC treble.' },
  { year: 2013, title: 'West Indies Tri-Series', role: 'Captain', date: '2013-07-11', detail: '45* and the last-over hitting that beat Sri Lanka by one wicket.' },
  { year: 2014, title: 'Champions League T20', role: 'Captain', date: '2014-10-04', detail: 'Chennai beat Kolkata Knight Riders by 8 wickets in Bengaluru.' },
  { year: 2016, title: 'Asia Cup (T20)', role: 'Captain', date: '2016-03-06', detail: 'Unbeaten 20 off 6 balls to close out the final against Bangladesh in Mirpur.' },
  { year: 2018, title: 'Indian Premier League', role: 'Captain', date: '2018-05-27', detail: 'The comeback season: Shane Watson’s 117* won the final.' },
  { year: 2018, title: 'Asia Cup', role: 'Player', date: '2018-09-28', detail: 'Under Rohit Sharma; his 36 helped India home by 3 wickets against Bangladesh.' },
  { year: 2021, title: 'Indian Premier League', role: 'Captain', date: '2021-10-15', detail: 'A fourth title, beating Kolkata Knight Riders by 27 runs.' },
  { year: 2023, title: 'Indian Premier League', role: 'Captain', date: '2023-05-29', detail: 'A fifth title, level with the most by any captain.' },
];

// ---------------------------------------------------------------- Best wicket keeper
const sum = (k: 'catches' | 'stumpings') => formats.reduce((n, f) => n + f[k], 0);
export const keeping = {
  catches: sum('catches'),
  stumpings: sum('stumpings'),
  byFormat: formats.map((f) => ({ format: f.format, catches: f.catches, stumpings: f.stumpings })),
  ipl: (() => {
    const ipl = matches.filter((m) => m.match.format === 'IPL');
    return {
      matches: ipl.length,
      catches: ipl.reduce((n, m) => n + m.match.fielding.catches, 0),
      stumpings: ipl.reduce((n, m) => n + m.match.fielding.stumpings, 0),
    };
  })(),
  bestDays: [...matches]
    .sort((a, b) => b.match.fielding.catches + b.match.fielding.stumpings - (a.match.fielding.catches + a.match.fielding.stumpings) || a.date.localeCompare(b.date))
    .slice(0, 5)
    .map((m) => ({ date: m.date, format: m.match.format, opponent: m.match.opponent, venue: m.match.venue, ...m.match.fielding })),
};

// ---------------------------------------------------------------- Best finisher
const wonChases = matches.filter((m) => m.match.team === 'India' && m.match.format === 'ODI' && m.match.chasing && m.match.won && m.match.batting.length);
const finishes = matches.filter((m) => m.match.finished);
export const finishing = {
  odiWonChases: (() => {
    const inns = wonChases.length;
    const notOut = wonChases.filter((m) => m.match.batting[0].notOut).length;
    const runs = wonChases.reduce((n, m) => n + m.match.batting[0].runs, 0);
    const balls = wonChases.reduce((n, m) => n + m.match.batting[0].balls, 0);
    return { inns, notOut, runs, average: (runs / Math.max(1, inns - notOut)).toFixed(2), strikeRate: ((100 * runs) / Math.max(1, balls)).toFixed(2) };
  })(),
  winningHits: finishes.length,
  withSix: finishes.filter((m) => m.match.finished === 'six').length,
  byFormat: ['ODI', 'T20I', 'IPL'].map((f) => ({ format: f, count: finishes.filter((m) => m.match.format === f).length })),
  sixes: finishes
    .filter((m) => m.match.finished === 'six')
    .map((m) => ({ date: m.date, format: m.match.format, team: m.match.team, opponent: m.match.opponent, score: m.match.bestScore ?? '' })),
};

// ---------------------------------------------------------------- 2011
export const worldCup2011 = matches
  .filter((m) => m.match.competition === 'ICC Cricket World Cup' && m.date.startsWith('2011'))
  .map((m) => ({ date: m.date, opponent: m.match.opponent, stage: m.match.stage, score: m.match.bestScore, result: m.match.result, venue: m.match.venue }));

// ---------------------------------------------------------------- Captaincy
export const captaincyByFormat = [
  { format: 'Test', matches: 60, won: 27, lost: 18, other: '15 drawn' },
  { format: 'ODI', matches: 200, won: 110, lost: 74, other: '5 tied, 11 no result' },
  { format: 'T20I', matches: 72, won: 41, lost: 28, other: '1 tied, 2 no result' },
];

// ---------------------------------------------------------------- His career, chapter by chapter
export interface Chapter {
  date: string;
  heading: string;
  body: string;
  image: string;
}

export const career: Chapter[] = [
  { date: '2004-12-23', heading: 'The inauspicious beginning', image: 'c2004-keeper', body: 'ODI debut against Bangladesh in Chattogram. He was run out for a duck off his first ball, and the rest of the series was forgettable too.' },
  { date: '2005-04-05', heading: 'The helicopter arrives', image: 'c2005-148', body: 'Promoted to No. 3 against Pakistan in Visakhapatnam, he smashed 148 off 123 balls with 15 fours and 4 sixes: his first international hundred.' },
  { date: '2005-10-31', heading: 'Painting Jaipur the Mahi way', image: 'c2005-183', body: 'Promoted again, he chased down Sri Lanka’s 298 almost alone: 183 not out off 145 balls, 15 fours and 10 sixes. It is still the highest ODI score by a wicketkeeper.' },
  { date: '2006-02-13', heading: 'The Pervez Musharraf comment', image: 'c2006-musharraf', body: 'His 72* off 46 balls won the third ODI in Lahore. Presenting the award, President Musharraf told him the placards said he should get a haircut, “but if you take my advice, you look good in this hairstyle.”' },
  { date: '2006-04-19', heading: 'Rise to No. 1 in the ODI rankings', image: 'c2006-applause', body: 'A 59 against Pakistan in Abu Dhabi lifted the man from Jharkhand to the top of the ICC ODI batting rankings, barely 16 months after his debut.' },
  { date: '2006-12-01', heading: 'Off the mark with a nought', image: 'c2006-t20i', body: 'Like his ODI career, his T20I career began with a duck: bowled by Charl Langeveldt for 0 in India’s first T20 international, in Johannesburg.' },
  { date: '2007-09-24', heading: 'T20 glory', image: 'c2007-huddle', body: 'An energetic, young Dhoni-led side won the inaugural World Twenty20 by beating Pakistan in the final, months after the early exit from the 50-over World Cup.' },
  { date: '2008-03-04', heading: 'The CB Series triumph', image: 'c2008-cb', body: 'India beat Australia 2–0 in the best-of-three finals of the Commonwealth Bank Series. Dhoni’s 36 in the second final pushed the target out of reach.' },
  { date: '2010-06-24', heading: 'Champions of Asia', image: 'c2010-asia', body: 'More silverware: Sri Lanka were beaten by 81 runs in the Asia Cup final in Dambulla. Earlier, his 56 had won a must-win game against Pakistan.' },
  { date: '2011-04-02', heading: 'On top of the world', image: 'c2011-six', body: 'Promoted above Yuvraj in the final, he made 91* and launched Nuwan Kulasekara over long-on to end a 28-year wait for the World Cup.' },
  { date: '2013-06-23', heading: 'Destiny’s child', image: 'c2013-ct', body: 'He arrived at the Champions Trophy under a cloud from the IPL and left it the first captain to hold all three ICC white-ball trophies.' },
  { date: '2013-07-11', heading: 'Oh Dhoni, you beauty', image: 'c2013-eranga', body: 'Fifteen needed off the last over of the tri-series final in Port of Spain, with one wicket left. He hit Shaminda Eranga for six, four and six and won it with two balls to spare.' },
  { date: '2015-03-26', heading: 'Semi-final exit in 2015', image: 'c2015-semi', body: 'Australia ended India’s seven-match winning streak at the SCG. Dhoni fought with 65 off 65 before Glenn Maxwell ran him out.' },
  { date: '2017-01-04', heading: 'The decade-long reign ends', image: 'c2017-handover', body: 'He gave up the ODI and T20I captaincy and handed the baton to Virat Kohli, staying on as a player.' },
  { date: '2017-01-19', heading: 'Rolling back the clock', image: 'c2017-cuttack', body: 'With India 25 for 3 in Cuttack, he and Yuvraj Singh added 256. His 134 off 122 balls clinched the series against England; it was his last ODI hundred.' },
  { date: '2017-02-01', heading: 'End of a long wait', image: 'c2017-t20-fifty', body: 'His maiden T20I fifty, 56 off 36 against England in Bengaluru, came more than ten years after his T20I debut. It was also Rishabh Pant’s first match for India.' },
  { date: '2017-09-03', heading: 'Stumping record', image: 'c2017-stumping', body: 'In Colombo he became the first wicketkeeper to make 100 ODI stumpings, passing Kumar Sangakkara’s 99.' },
  { date: '2018-02-21', heading: 'Second fifty', image: 'c2018-fifty', body: 'A 28-ball 52 not out against South Africa at Centurion: his second T20I fifty, in a losing cause.' },
  { date: '2018-09-25', heading: 'Captain again', image: 'c2018-captain', body: 'With Rohit Sharma rested, he led India against Afghanistan in Dubai: his 200th ODI as captain, and it ended in a tie.' },
  { date: '2019-01-18', heading: 'The redemption act', image: 'c2019-redemption', body: 'After a quiet 2018, three straight fifties in Australia (51, 55* and 87*) made him Player of the Series as India won their first bilateral ODI series there.' },
  { date: '2019-02-27', heading: 'Last T20I innings', image: 'c2019-last-t20i', body: 'His last T20I innings came in Bengaluru: 40 off 23 balls with three sixes against Australia, in a 100-run stand with Virat Kohli.' },
  { date: '2019-07-10', heading: 'The final act', image: 'c2019-runout', body: 'His last international innings was a fighting 50 in the World Cup semi-final in Manchester, ended by Martin Guptill’s direct hit. Four years earlier, he had also been run out in the semi-final India lost.' },
  { date: '2020-08-15', heading: 'Pulling down the curtains', image: 'c2020-curtain', body: 'On Independence Day he posted on Instagram: “Thanks a lot for ur love and support throughout. From 1929 hrs consider me as Retired.” He finished with 10,773 ODI runs at 50.57, with 10 hundreds and 73 fifties.' },
];

// ---------------------------------------------------------------- Records
export const records = [
  { value: '3', label: 'ICC white-ball trophies as captain', note: 'The only captain to win the World T20, the World Cup and the Champions Trophy.' },
  { value: '332', label: 'International matches as captain', note: 'More than any other captain in history.' },
  { value: '195', label: 'International stumpings', note: 'The most by any wicketkeeper: 38 in Tests, 123 in ODIs, 34 in T20Is.' },
  { value: '183*', label: 'Highest ODI score by a wicketkeeper', note: 'Jaipur, 31 October 2005.' },
  { value: '224', label: 'Highest Test score by an Indian keeper', note: 'Chennai, against Australia, 2013.' },
  { value: '84', label: 'Not-outs in ODIs', note: 'The most in ODI history: the finisher’s signature.' },
  { value: '5', label: 'IPL titles as captain', note: 'Level with Rohit Sharma for the most.' },
  { value: '50.57', label: 'ODI average across 10,773 runs', note: 'Made largely from the lower middle order, as the finisher.' },
];
