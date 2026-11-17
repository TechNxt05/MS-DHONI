#!/usr/bin/env node
/**
 * Builds src/data/dhoni-days.json: every day of the year Dhoni made a memory on.
 *
 * Match entries are computed from Cricsheet ball-by-ball data (https://cricsheet.org,
 * ODC-BY licence), so every figure is from a real scorecard. Life events are hand-curated
 * in ./life-events.json and limited to well-documented dates.
 *
 * Usage:
 *   1. Download and unzip these archives from https://cricsheet.org/downloads/ into one folder,
 *      one sub-folder each: india_male_json.zip, chennai_super_kings_male_json.zip,
 *      rising_pune_supergiant_male_json.zip, rising_pune_supergiants_male_json.zip,
 *      asia_xi_male_json.zip
 *   2. node scripts/dhoni-days/build.mjs <that-folder>
 */
import { readFileSync, readdirSync, writeFileSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..', '..');
const dataDir = process.argv[2];
if (!dataDir) {
  console.error('Usage: node scripts/dhoni-days/build.mjs <cricsheet-folder>');
  process.exit(1);
}

const ME = 'MS Dhoni';
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// ---------------------------------------------------------------- photos
const photoSrc = readFileSync(join(root, 'src/lib/photos.ts'), 'utf8');
const start = photoSrc.indexOf('= [') + 2;
const allPhotos = JSON.parse(photoSrc.slice(start, photoSrc.indexOf('];', start) + 1));
const slugs = new Set(allPhotos.map((p) => p.src.slice(8, -5)));

const pools = {
  indiaBat: ['helicopter-shot', 'high-follow-through', 'bat-aloft-full-house', 'floodlit-strike', 'odi-big-hit', 'bat-lifted-blue', 'drive-through-cover', 'pull-shot'],
  indiaBatEarly: ['sahara-power-hit', 'sahara-salute'],
  indiaMilestone: ['bat-raised-milestone', 'bat-aloft-full-house', 'bat-lifted-blue'],
  indiaField: ['keeper-directs-field', 'keeper-gloves-wide', 'keeper-gloves-close', 'field-marshal', 'chase-mode', 'walking-out', 'helmet-in-hand', 'star-india-portrait', 'team-india-walk', 'red-room-portrait'],
  test: ['test-whites', 'keeper-gloves-wide', 'keeper-gloves-close'],
  csk: ['csk-walk-out', 'csk-seven-floodlights', 'csk-keeper-command', 'csk-launch', 'csk-trio', 'seven-under-lights'],
  cskRaina: ['raina-strategy', 'raina-embrace', 'raina-boundary-rope', 'victory-bike-ride'],
  title: ['title-celebration'],
};
for (const list of Object.values(pools)) for (const s of list) if (!slugs.has(s)) throw new Error(`Unknown photo ${s}`);

/** Photos that actually show the occasion. Everything else is marked illustrative. */
const exactPhotos = {
  '2007-09-24': 't20-trophy-2007',
  '2011-04-02': 'world-cup-final-six-2011',
  '2013-06-23': 'champions-trophy-2013',
};

function hash(s) {
  let h = 2166136261;
  for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return h >>> 0;
}
const pick = (list, key) => list[hash(key) % list.length];

// ---------------------------------------------------------------- parse
function listFiles() {
  const seen = new Map();
  for (const sub of readdirSync(dataDir)) {
    const dir = join(dataDir, sub);
    if (!statSync(dir).isDirectory()) continue;
    for (const f of readdirSync(dir)) if (f.endsWith('.json')) seen.set(f, join(dir, f));
  }
  return [...seen.values()];
}

function dismissalText(w, bowler) {
  const by = w.fielders?.map((f) => f.name.replace(' (sub)', '')).filter(Boolean)[0];
  switch (w.kind) {
    case 'caught': return by ? `caught by ${by} off ${bowler}` : `caught off ${bowler}`;
    case 'caught and bowled': return `caught and bowled by ${bowler}`;
    case 'bowled': return `bowled by ${bowler}`;
    case 'lbw': return `lbw to ${bowler}`;
    case 'stumped': return `stumped off ${bowler}`;
    case 'run out': return by ? `run out by ${by}` : 'run out';
    case 'hit wicket': return `hit wicket off ${bowler}`;
    default: return w.kind;
  }
}

function competitionOf(info) {
  const name = info.event?.name ?? '';
  if (info.team_type === 'international') {
    const fmt = info.match_type === 'T20' ? 'T20I' : info.match_type;
    return { format: fmt, competition: name || `${fmt} match` };
  }
  if (/premier league/i.test(name)) return { format: 'IPL', competition: name };
  if (/champions league/i.test(name)) return { format: 'CLT20', competition: name };
  return { format: info.match_type, competition: name };
}

function parseMatch(file) {
  const j = JSON.parse(readFileSync(file, 'utf8'));
  const info = j.info;
  const team = Object.entries(info.players ?? {}).find(([, ps]) => ps.includes(ME))?.[0];
  if (!team) return null;
  const opp = info.teams.find((t) => t !== team);
  const { format, competition } = competitionOf(info);
  const isTest = info.match_type === 'Test' || info.match_type === 'MDM';

  const innings = []; // Dhoni's batting innings
  const bowl = { balls: 0, runs: 0, wickets: 0 };
  const field = { catches: 0, stumpings: 0, runOuts: 0 };
  let lastBall = null;
  let lastInningsTeam = null;

  for (const inn of j.innings ?? []) {
    if (inn.super_over) continue;
    let mine = null;
    for (const over of inn.overs ?? []) {
      for (const d of over.deliveries) {
        lastBall = { d, team: inn.team };
        if (inn.team === team && (d.batter === ME || d.non_striker === ME)) {
          mine ??= { runs: 0, balls: 0, fours: 0, sixes: 0, out: null };
        }
        if (d.batter === ME) {
          mine.runs += d.runs.batter;
          if (!d.extras?.wides) mine.balls += 1;
          if (d.runs.batter === 4 && !d.runs.non_boundary) mine.fours += 1;
          if (d.runs.batter === 6 && !d.runs.non_boundary) mine.sixes += 1;
        }
        if (d.bowler === ME) {
          if (!d.extras?.wides && !d.extras?.noballs) bowl.balls += 1;
          bowl.runs += d.runs.batter + (d.extras?.wides ?? 0) + (d.extras?.noballs ?? 0);
        }
        for (const w of d.wickets ?? []) {
          if (w.player_out === ME && mine) mine.out = dismissalText(w, d.bowler);
          if (d.bowler === ME && !['run out', 'retired hurt', 'retired out', 'obstructing the field'].includes(w.kind)) bowl.wickets += 1;
          const byMe = w.fielders?.some((f) => f.name === ME);
          if (w.kind === 'caught' && byMe) field.catches += 1;
          if (w.kind === 'caught and bowled' && d.bowler === ME) field.catches += 1;
          if (w.kind === 'stumped' && byMe) field.stumpings += 1;
          if (w.kind === 'run out' && byMe) field.runOuts += 1;
        }
      }
    }
    if (mine) innings.push(mine);
    lastInningsTeam = inn.team;
  }

  const o = info.outcome ?? {};
  let result;
  let won = null;
  if (o.winner) {
    won = o.winner === team;
    const margin = o.by?.runs ? `${o.by.runs} run${o.by.runs === 1 ? '' : 's'}` : o.by?.wickets ? `${o.by.wickets} wicket${o.by.wickets === 1 ? '' : 's'}` : o.by?.innings ? 'an innings' : '';
    const how = o.by?.innings && o.by?.runs ? `an innings and ${o.by.runs} runs` : margin;
    const method = o.method ? ` (${o.method})` : '';
    if (o.eliminator) result = `${won ? team : opp} won the Super Over after a tie`;
    else if (o.bowl_out) result = `${won ? team : opp} won the bowl-out after a tie`;
    else result = won ? `${team} beat ${opp}${how ? ` by ${how}` : ''}${method}` : `${opp} beat ${team}${how ? ` by ${how}` : ''}${method}`;
    if (o.eliminator || o.bowl_out) won = o.winner === team;
  } else if (o.result === 'draw') result = 'Match drawn';
  else if (o.result === 'tie') result = 'Match tied';
  else if (o.result === 'no result') result = 'No result';
  else result = 'Result not recorded';

  // Did Dhoni hit the winning runs in a successful chase?
  let finished = null;
  if (won && !isTest && lastBall && lastBall.team === team && lastInningsTeam === team && lastBall.d.batter === ME && lastBall.d.runs.batter > 0) {
    finished = lastBall.d.runs.batter === 6 ? 'six' : lastBall.d.runs.batter === 4 ? 'four' : 'runs';
  }

  // Batting second in a limited-overs game means chasing.
  const firstInnings = (j.innings ?? []).find((x) => !x.super_over);
  const chasing = !isTest && !!firstInnings && firstInnings.team !== team;
  const venue = info.city && !info.venue.includes(info.city) ? `${info.venue}, ${info.city}` : info.venue;
  return {
    id: file.split(/[\\/]/).pop().replace('.json', ''),
    dates: info.dates,
    team,
    opp,
    format,
    competition,
    stage: info.event?.stage ?? null,
    matchNumber: info.event?.match_number ?? null,
    season: String(info.season),
    venue,
    isTest,
    innings,
    bowl,
    field,
    won,
    result,
    pom: (info.player_of_match ?? []).includes(ME),
    finished,
    chasing,
  };
}

// ---------------------------------------------------------------- describe
const fmtDate = (iso) => {
  const [y, m, d] = iso.split('-').map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
};
const plural = (n, w) => `${n} ${w}${n === 1 ? '' : 's'}`;
function scoreOf(i) {
  return `${i.runs}${i.out ? '' : '*'}`;
}
function list(parts) {
  if (parts.length <= 1) return parts.join('');
  return `${parts.slice(0, -1).join(', ')} and ${parts.at(-1)}`;
}

function describe(m) {
  const sentences = [];
  const bat = m.innings;
  if (bat.length === 0) sentences.push('Did not bat.');
  else if (m.isTest) {
    const parts = bat.map((i) => `${scoreOf(i)} (${i.balls} balls${i.out ? `, ${i.out}` : ''})`);
    sentences.push(`Batting: ${parts.join(' and ')}.`);
  } else {
    const i = bat[0];
    const bounds = [i.fours && plural(i.fours, 'four'), i.sixes && (i.sixes === 1 ? '1 six' : `${i.sixes} sixes`)].filter(Boolean);
    let s = `Made ${scoreOf(i)} off ${plural(i.balls, 'ball')}${bounds.length ? ` (${list(bounds)})` : ''}`;
    s += i.out ? `, ${i.out}` : '';
    if (m.finished === 'six') s += ', and finished the chase with a six';
    else if (m.finished === 'four') s += ', and hit the winning boundary';
    else if (m.finished) s += ', and hit the winning runs';
    sentences.push(`${s}.`);
  }
  const f = m.field;
  const keep = [f.catches && (f.catches === 1 ? '1 catch' : `${f.catches} catches`), f.stumpings && plural(f.stumpings, 'stumping'), f.runOuts && plural(f.runOuts, 'run-out')].filter(Boolean);
  if (keep.length) sentences.push(`In the field: ${list(keep)}.`);
  if (m.bowl.balls) {
    const overs = `${Math.floor(m.bowl.balls / 6)}${m.bowl.balls % 6 ? `.${m.bowl.balls % 6}` : ''}`;
    sentences.push(`Bowled ${overs} over${m.bowl.balls === 6 ? '' : 's'}: ${m.bowl.wickets}/${m.bowl.runs}.`);
  }
  sentences.push(`${m.result}${m.venue ? ` at ${m.venue}` : ''}.`);
  if (m.pom) sentences.push('Player of the Match.');
  if (m.isTest && m.dates.length > 1) sentences.push(`Played ${fmtDate(m.dates[0])} to ${fmtDate(m.dates.at(-1))}.`);
  return sentences.join(' ');
}

const isFinal = (m) => /^final$/i.test(m.stage ?? '');

function titleOf(m) {
  const stage = m.stage && !/^(group|league)/i.test(m.stage) ? `${m.stage}, ` : '';
  const comp = m.competition.replace(/^ICC /, '');
  if (isFinal(m) && m.won) return `${comp} champions`;
  const best = m.innings.reduce((a, i) => (i.runs > (a?.runs ?? -1) ? i : a), null);
  if (best && best.runs >= 100) return `${scoreOf(best)} vs ${m.opp}`;
  if (m.finished === 'six') return `Finished it with a six vs ${m.opp}`;
  if (best && best.runs >= 50) return `${scoreOf(best)} vs ${m.opp}`;
  return `${stage}${m.format} vs ${m.opp}`;
}

function highlightsOf(m) {
  const h = [];
  const best = Math.max(-1, ...m.innings.map((i) => i.runs));
  if (best >= 100) h.push('hundred');
  else if (best >= 50) h.push('fifty');
  if (m.innings.some((i) => i.runs === 0 && i.out)) h.push('duck');
  if (m.finished) h.push('finisher');
  if (m.field.stumpings + m.field.catches >= 4) h.push('keeping-masterclass');
  if (m.pom) h.push('player-of-the-match');
  if (isFinal(m)) h.push(m.won ? 'final-won' : 'final');
  return h;
}

function weight(m, h) {
  let w = 1;
  if (h.includes('final-won')) w += 10;
  else if (h.includes('final')) w += 4;
  if (h.includes('hundred')) w += 8;
  if (h.includes('fifty')) w += 3;
  if (h.includes('player-of-the-match')) w += 4;
  if (h.includes('finisher')) w += 3;
  if (h.includes('keeping-masterclass')) w += 2;
  if (m.format !== 'IPL' && m.format !== 'CLT20') w += 1;
  return w;
}

function photoFor(m, h, dayIso) {
  if (exactPhotos[dayIso]) return { photo: exactPhotos[dayIso], photoExact: true };
  const year = Number(dayIso.slice(0, 4));
  let pool;
  if (h.includes('final-won')) pool = pools.title;
  else if (m.team === 'Chennai Super Kings') pool = year <= 2021 ? [...pools.csk, ...pools.cskRaina] : pools.csk;
  else if (m.team === 'India' && m.isTest) pool = pools.test;
  else if (m.team === 'India' && (h.includes('hundred') || h.includes('fifty'))) pool = year <= 2013 ? [...pools.indiaMilestone, ...pools.indiaBatEarly] : pools.indiaMilestone;
  else if (m.team === 'India' && m.innings.some((i) => i.runs >= 20)) pool = year <= 2013 ? [...pools.indiaBat, ...pools.indiaBatEarly] : pools.indiaBat;
  else if (m.team === 'India') pool = pools.indiaField;
  else return { photo: null, photoExact: false }; // No photos of him in Pune or Asia XI colours.
  return { photo: pick(pool, m.id), photoExact: false };
}

// ---------------------------------------------------------------- firsts and lasts
function markFirstsAndLasts(matches) {
  const byFormat = new Map();
  for (const m of matches) {
    const key = m.team === 'India' ? m.format : m.team;
    if (!byFormat.has(key)) byFormat.set(key, []);
    byFormat.get(key).push(m);
  }
  const notes = new Map();
  const label = { Test: 'Test', ODI: 'ODI', T20I: 'T20I' };
  // Cricsheet misses a few early games, so a "first" only counts when it matches the record.
  const known = {
    'Test debut': '2005-12-02', 'ODI debut': '2004-12-23', 'T20I debut': '2006-12-01',
    'Last Test for India': '2014-12-26', 'Last ODI for India': '2019-07-09', 'Last T20I for India': '2019-02-27',
    'First match for Chennai Super Kings': '2008-04-19',
  };
  const ok = (note, m) => !known[note] || known[note] === m.dates[0];
  const push = (m, note) => ok(note, m) && notes.set(m.id, [...(notes.get(m.id) ?? []), note]);
  for (const [key, ms] of byFormat) {
    ms.sort((a, b) => a.dates[0].localeCompare(b.dates[0]));
    const first = ms[0];
    const last = ms.at(-1);
    if (label[key]) {
      push(first, `${label[key]} debut`);
      push(last, `Last ${label[key]} for India`);
    } else if (key === 'Chennai Super Kings') {
      push(first, 'First match for Chennai Super Kings');
    } else if (/Pune/.test(key)) {
      push(first, `First match for ${key}`);
    }
  }
  return notes;
}

// ---------------------------------------------------------------- build
const overrides = JSON.parse(readFileSync(join(here, 'match-notes.json'), 'utf8'));
const life = JSON.parse(readFileSync(join(here, 'life-events.json'), 'utf8'));

const matches = listFiles().map(parseMatch).filter(Boolean);
const firsts = markFirstsAndLasts(matches);
const days = {};
const add = (key, e) => (days[key] ??= []).push(e);

for (const m of matches) {
  // A limited-overs game that ran into a reserve day belongs to the day it finished.
  const dayIso = m.isTest ? m.dates[0] : m.dates.at(-1);
  const h = highlightsOf(m);
  const milestoneNotes = firsts.get(m.id) ?? [];
  const note = overrides[m.id];
  if (milestoneNotes.length) h.unshift('milestone');
  const { photo, photoExact } = note?.photo ? { photo: note.photo, photoExact: !!note.photoExact } : photoFor(m, h, dayIso);
  if (photo && !slugs.has(photo)) throw new Error(`Unknown photo ${photo} in match-notes for ${m.id}`);
  const best = m.innings.reduce((a, i) => (i.runs > (a?.runs ?? -1) ? i : a), null);
  add(dayIso.slice(5), {
    date: dayIso,
    year: Number(dayIso.slice(0, 4)),
    kind: 'match',
    title: note?.title ?? (milestoneNotes.length ? `${milestoneNotes[0]}: vs ${m.opp}` : titleOf(m)),
    description: [note?.story, milestoneNotes.length ? `${milestoneNotes.join('. ')}.` : null, describe(m)].filter(Boolean).join(' '),
    highlights: h,
    weight: weight(m, h) + (milestoneNotes.length ? 6 : 0) + (note?.boost ?? 0),
    photo: photo ? `/photos/${photo}.webp` : null,
    photoExact,
    match: {
      format: m.format,
      competition: m.competition,
      stage: m.stage,
      team: m.team,
      opponent: m.opp,
      venue: m.venue,
      dates: m.dates,
      result: m.result,
      won: m.won,
      batting: m.innings.map((i) => ({ runs: i.runs, balls: i.balls, fours: i.fours, sixes: i.sixes, notOut: !i.out, dismissal: i.out })),
      bestScore: best ? scoreOf(best) : null,
      fielding: m.field,
      bowling: m.bowl.balls ? m.bowl : null,
      playerOfMatch: m.pom,
      chasing: m.chasing,
      finished: m.finished,
    },
    source: { name: 'Cricsheet', url: 'https://cricsheet.org/', matchId: m.id },
  });
}

const keepingSummary = (f) => {
  const parts = [f.catches && (f.catches === 1 ? '1 catch' : `${f.catches} catches`), f.stumpings && plural(f.stumpings, 'stumping')].filter(Boolean);
  return parts.length ? `; ${list(parts)}` : '';
};

// Days inside a Test that no other event claims: he was out in the middle, so they count.
const ordinal = ['', 'one', 'two', 'three', 'four', 'five', 'six'];
const testDays = [];
for (const m of matches.filter((x) => x.isTest)) {
  const first = new Date(`${m.dates[0]}T00:00:00Z`);
  const last = new Date(`${m.dates.at(-1)}T00:00:00Z`);
  for (let t = new Date(first), n = 1; t <= last; t.setUTCDate(t.getUTCDate() + 1), n++) {
    const iso = t.toISOString().slice(0, 10);
    if (n === 1) continue;
    testDays.push({ m, iso, n });
  }
}
const claimed = new Set(Object.keys(days));
for (const life1 of life.events) claimed.add(life1.date.slice(5));
for (const { m, iso, n } of testDays) {
  const key = iso.slice(5);
  if (claimed.has(key) && !(days[key] ?? []).some((e) => e.kind === 'test-day')) continue;
  const where = m.venue.split(',').at(-1).trim();
  const { photo } = photoFor(m, [], iso);
  add(key, {
    date: iso,
    year: Number(iso.slice(0, 4)),
    kind: 'test-day',
    title: `Day ${ordinal[n] ?? n} in ${where}`,
    description: `Day ${n} of the Test against ${m.opp} at ${m.venue}. ${m.result}. Dhoni in the match: ${m.innings.length ? m.innings.map((i) => `${scoreOf(i)} (${i.balls})`).join(' and ') : 'did not bat'}${keepingSummary(m.field)}.`,
    highlights: [],
    weight: 0.5,
    photo: photo ? `/photos/${photo}.webp` : null,
    photoExact: false,
    match: null,
    source: { name: 'Cricsheet', url: 'https://cricsheet.org/', matchId: m.id },
  });
}

for (const e of life.events) {
  if (e.photo && !slugs.has(e.photo)) throw new Error(`Unknown photo ${e.photo} in life-events for ${e.date}`);
  add(e.date.slice(5), {
    date: e.date,
    year: Number(e.date.slice(0, 4)),
    kind: e.kind,
    title: e.title,
    description: e.description,
    highlights: e.highlights ?? [],
    weight: e.weight ?? 20,
    photo: e.photo ? `/photos/${e.photo}.webp` : null,
    photoExact: !!e.photoExact,
    match: null,
    source: e.source,
  });
}

const sortedDays = {};
for (const key of Object.keys(days).sort()) {
  sortedDays[key] = days[key].sort((a, b) => b.weight - a.weight || a.year - b.year);
}

// Every calendar day, including 29 February.
const allDays = [];
for (let mo = 1; mo <= 12; mo++) {
  const n = new Date(Date.UTC(2024, mo, 0)).getUTCDate();
  for (let d = 1; d <= n; d++) allDays.push(`${String(mo).padStart(2, '0')}-${String(d).padStart(2, '0')}`);
}
const empty = allDays.filter((k) => !sortedDays[k]);

const out = {
  generated: new Date().toISOString().slice(0, 10),
  about:
    'Every calendar day with a documented MS Dhoni memory. Match entries are computed from Cricsheet ball-by-ball scorecards (ODC-BY); life events are hand-curated from well-documented public records. Photos marked photoExact:false are illustrative, not from that day.',
  coverage: {
    daysWithEvents: allDays.length - empty.length,
    totalDays: allDays.length,
    emptyDays: empty,
    matches: matches.length,
    lifeEvents: life.events.length,
  },
  undated: life.undated,
  days: sortedDays,
};
writeFileSync(join(root, 'src/data/dhoni-days.json'), JSON.stringify(out));
console.log(`matches ${matches.length}, days covered ${out.coverage.daysWithEvents}/${allDays.length}, empty ${empty.length}`);
console.log(empty.join(' '));

// A flat CSV of the same events, one row each, for spreadsheets.
const csvCell = (v) => {
  const s = v === null || v === undefined ? '' : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
const header = ['day', 'date', 'year', 'kind', 'title', 'description', 'format', 'competition', 'team', 'opponent', 'venue', 'result', 'best_score', 'player_of_match', 'highlights', 'photo', 'photo_exact', 'source', 'cricsheet_id'];
const rows = [header.join(',')];
for (const [key, events] of Object.entries(sortedDays)) {
  for (const e of events) {
    rows.push([
      key, e.date, e.year, e.kind, e.title, e.description,
      e.match?.format, e.match?.competition, e.match?.team, e.match?.opponent, e.match?.venue, e.match?.result, e.match?.bestScore, e.match?.playerOfMatch,
      e.highlights.join('|'), e.photo, e.photoExact, e.source.url, e.source.matchId,
    ].map(csvCell).join(','));
  }
}
writeFileSync(join(root, 'src/data/dhoni-days.csv'), `${rows.join('\n')}\n`);
console.log(`csv rows ${rows.length - 1}`);
