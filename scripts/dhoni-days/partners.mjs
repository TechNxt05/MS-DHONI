#!/usr/bin/env node
/**
 * Builds src/data/partners.json: who Dhoni batted with, from Cricsheet ball-by-ball data.
 * A partnership is every delivery while the same two batters are together, extras included.
 *
 * Usage: node scripts/dhoni-days/partners.mjs <cricsheet-folder>   (same folder as build.mjs)
 */
import { readFileSync, readdirSync, writeFileSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const dataDir = process.argv[2];
if (!dataDir) {
  console.error('Usage: node scripts/dhoni-days/partners.mjs <cricsheet-folder>');
  process.exit(1);
}
const ME = 'MS Dhoni';
const FOCUS = { 'SK Raina': 'Suresh Raina', 'V Kohli': 'Virat Kohli', 'RA Jadeja': 'Ravindra Jadeja' };

const files = new Map();
for (const sub of readdirSync(dataDir)) {
  const dir = join(dataDir, sub);
  if (!statSync(dir).isDirectory()) continue;
  for (const f of readdirSync(dir)) if (f.endsWith('.json')) files.set(f, join(dir, f));
}

const partners = new Map(); // name -> stats
const together = new Map(); // name -> { matches, won, byTeam }
const stat = (name) => {
  if (!partners.has(name)) partners.set(name, { name, stands: 0, runs: 0, balls: 0, fifties: 0, hundreds: 0, best: [] });
  return partners.get(name);
};

for (const file of files.values()) {
  const j = JSON.parse(readFileSync(file, 'utf8'));
  const info = j.info;
  const team = Object.entries(info.players ?? {}).find(([, ps]) => ps.includes(ME))?.[0];
  if (!team) continue;
  const opp = info.teams.find((t) => t !== team);
  const isTest = info.match_type === 'Test';
  const format = info.team_type === 'international' ? (info.match_type === 'T20' ? 'T20I' : info.match_type) : 'IPL';
  const won = info.outcome?.winner === team;

  for (const mate of info.players[team]) {
    if (mate === ME) continue;
    const t = together.get(mate) ?? { matches: 0, won: 0, byTeam: {} };
    t.matches += 1;
    if (won) t.won += 1;
    t.byTeam[team] = (t.byTeam[team] ?? 0) + 1;
    together.set(mate, t);
  }

  for (const inn of j.innings ?? []) {
    if (inn.team !== team || inn.super_over) continue;
    let current = null; // { partner, runs, balls }
    const close = () => {
      if (!current) return;
      const s = stat(current.partner);
      s.stands += 1;
      s.runs += current.runs;
      s.balls += current.balls;
      if (current.runs >= 100) s.hundreds += 1;
      else if (current.runs >= 50) s.fifties += 1;
      s.best.push({ runs: current.runs, balls: current.balls, date: isTest ? info.dates[0] : info.dates.at(-1), format, team, opponent: opp, venue: info.venue, won, unbroken: current.unbroken ?? false });
      current = null;
    };
    for (const over of inn.overs ?? []) {
      for (const d of over.deliveries) {
        const pair = [d.batter, d.non_striker];
        const partner = pair.includes(ME) ? pair.find((p) => p !== ME) : null;
        if (current && current.partner !== partner) close();
        if (partner) {
          current ??= { partner, runs: 0, balls: 0 };
          current.runs += d.runs.total;
          if (!d.extras?.wides && !d.extras?.noballs) current.balls += 1;
          if (d.wickets?.some((w) => w.player_out === ME || w.player_out === partner)) close();
        }
      }
    }
    if (current) current.unbroken = true;
    close();
  }
}

const top = (s) => ({
  ...s,
  best: s.best.sort((a, b) => b.runs - a.runs).slice(0, 5),
  matches: together.get(s.name)?.matches ?? 0,
  wonTogether: together.get(s.name)?.won ?? 0,
  byTeam: together.get(s.name)?.byTeam ?? {},
});

const all = [...partners.values()].sort((a, b) => b.runs - a.runs);
const out = {
  about: 'Partnerships with MS Dhoni computed from Cricsheet ball-by-ball data (ODC-BY). Runs include extras. Coverage: 509 internationals and 277 IPL matches.',
  topPartners: all.slice(0, 12).map((s) => ({ name: s.name, stands: s.stands, runs: s.runs, fifties: s.fifties, hundreds: s.hundreds, best: s.best.sort((a, b) => b.runs - a.runs)[0] })),
  focus: Object.fromEntries(Object.entries(FOCUS).map(([key, full]) => [full, top(partners.get(key))])),
};
writeFileSync(join(root, 'src/data/partners.json'), JSON.stringify(out, null, 1));
for (const p of out.topPartners) console.log(p.name.padEnd(18), p.stands, p.runs, `${p.hundreds}x100 ${p.fifties}x50`, p.best.runs, p.best.date);
for (const [k, v] of Object.entries(out.focus)) console.log(k, v.matches, 'matches', v.wonTogether, 'won', JSON.stringify(v.byTeam), v.stands, 'stands', v.runs, 'runs');
