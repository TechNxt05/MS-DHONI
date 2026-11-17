import { getDay, type DayEvent } from './onThisDay';

/**
 * The daily "On this day" email: the same events as /on-this-day, laid out with inline styles
 * and tables so it survives Gmail, Apple Mail and Outlook.
 */

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** /photos/x.webp -> the landscape JPEG cut made by scripts/email-images.mjs. */
const emailImage = (photo: string) => photo.replace(/^\/photos\/(.+)\.webp$/, '/email/$1.jpg');

export const siteUrl = () => (process.env.SITE_URL ?? 'https://ms-dhoni-website-seven.vercel.app').replace(/\/$/, '');

export function dayLabel(key: string) {
  const [m, d] = key.split('-').map(Number);
  return `${d} ${MONTHS[m - 1]}`;
}

function kindLabel(e: DayEvent) {
  if (e.match) return `${e.match.format} · ${e.match.competition}`;
  return { 'test-day': 'Test match day', life: 'Life', career: 'Career', honour: 'Honour', service: 'Army', culture: 'Culture', match: 'Match' }[e.kind];
}

export function buildDigest(key: string) {
  const site = siteUrl();
  const day = getDay(key, 8);
  const label = dayLabel(key);
  const link = `${site}/on-this-day?d=${key}`;
  const [lead, ...rest] = day.events;

  const subject = lead ? `On this day, ${label}: ${lead.title} (${lead.year})` : `On this day, ${label}: a rest day for Thala`;

  const C = { night: '#06070a', pitch: '#0c0e13', flood: '#f4efe3', chalk: '#b9b4a8', dust: '#8a867d', gold: '#fdb913', blue: '#3aa0ee', line: '#23252b' };
  const font = "font-family:'Helvetica Neue',Arial,sans-serif;";
  const display = "font-family:Impact,'Arial Narrow Bold','Helvetica Neue',Arial,sans-serif;text-transform:uppercase;letter-spacing:0.5px;";

  const leadHtml = lead
    ? `
      ${lead.photo ? `<tr><td style="padding:0"><img src="${site}${esc(emailImage(lead.photo))}" width="600" height="338" alt="" style="display:block;width:100%;max-width:600px;height:auto;border:0"></td></tr>` : ''}
      <tr><td style="padding:28px 32px 8px;${font}">
        <div style="${display}font-size:44px;line-height:1;color:${C.gold}">${lead.year}</div>
        <div style="font-size:13px;color:${C.dust};margin-top:6px">${esc(kindLabel(lead))}${!lead.photoExact && lead.photo ? ' · illustrative photo' : ''}</div>
        <div style="${display}font-size:30px;line-height:1.05;color:${C.flood};margin-top:14px">${esc(lead.title)}</div>
        <p style="font-size:16px;line-height:1.6;color:${C.chalk};margin:14px 0 0">${esc(lead.description)}</p>
      </td></tr>`
    : `
      <tr><td style="padding:36px 32px 8px;${font}">
        <div style="${display}font-size:30px;color:${C.flood}">A rest day</div>
        <p style="font-size:16px;line-height:1.6;color:${C.chalk};margin:12px 0 0">No match or milestone is recorded on ${label}. The nearest memories are on ${dayLabel(day.prev)} and ${dayLabel(day.next)}.</p>
      </td></tr>`;

  const restHtml = rest
    .map(
      (e) => `
      <tr><td style="padding:18px 32px;border-top:1px solid ${C.line};${font}">
        <span style="${display}font-size:24px;color:${C.gold}">${e.year}</span>
        <span style="font-size:12px;color:${C.dust};padding-left:8px">${esc(kindLabel(e))}</span>
        <div style="${display}font-size:19px;line-height:1.1;color:${C.flood};margin-top:6px">${esc(e.title)}</div>
        <p style="font-size:14px;line-height:1.55;color:${C.chalk};margin:8px 0 0">${esc(e.description)}</p>
      </td></tr>`,
    )
    .join('');

  const more = day.total > day.events.length ? `<p style="font-size:13px;color:${C.dust};margin:0 32px 12px;${font}">Plus ${day.total - day.events.length} more on the site.</p>` : '';

  const html = `<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="dark"><title>${esc(subject)}</title></head>
<body style="margin:0;padding:0;background:${C.night}">
<div style="display:none;max-height:0;overflow:hidden">${esc(lead ? lead.description.slice(0, 120) : 'A quiet day in the archive.')}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.night}"><tr><td align="center" style="padding:24px 12px">
  <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:${C.pitch};border:1px solid ${C.line};border-radius:18px;overflow:hidden">
    <tr><td style="padding:26px 32px 22px;${font}">
      <div style="${display}font-size:22px;color:${C.flood}">MSD<span style="color:${C.gold}">7</span></div>
      <div style="${display}font-size:40px;line-height:1;color:${C.flood};margin-top:18px">On <span style="color:${C.gold}">${label}</span></div>
      <div style="font-size:14px;color:${C.chalk};margin-top:8px">${day.total ? `${day.total} ${day.total === 1 ? 'memory' : 'memories'} from Dhoni’s career` : 'From the Dhoni archive'}</div>
    </td></tr>
    ${leadHtml}
    ${restHtml}
    <tr><td style="padding:8px 0 4px">${more}</td></tr>
    <tr><td style="padding:8px 32px 32px;${font}">
      <a href="${link}" style="display:inline-block;background:${C.gold};color:${C.night};font-weight:bold;font-size:14px;letter-spacing:1px;text-transform:uppercase;text-decoration:none;padding:14px 24px;border-radius:999px">See the full day</a>
    </td></tr>
  </table>
  <p style="${font}font-size:12px;line-height:1.6;color:${C.dust};max-width:560px;margin:18px auto 0">
    A daily note from a non-commercial MS Dhoni fan tribute. Match figures from Cricsheet scorecards.<br>
    You are receiving this because the site owner added your address. Reply to this email to be removed.
  </p>
</td></tr></table>
</body></html>`;

  const text = [
    `On ${label}`,
    '',
    ...day.events.map((e) => `${e.year} · ${e.title}\n${e.description}\n`),
    day.events.length ? '' : `A rest day. Nearest memories: ${dayLabel(day.prev)} and ${dayLabel(day.next)}.`,
    `See the full day: ${link}`,
    '',
    'Reply to this email to be removed.',
  ].join('\n');

  return { subject, html, text, total: day.total };
}
