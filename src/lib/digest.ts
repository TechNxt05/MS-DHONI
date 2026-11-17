import { getDay, type DayEvent } from './onThisDay';
import { eventVideo, youtubeThumb } from './videos';

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

/** Replaced per recipient by personalize(). */
export const UNSUBSCRIBE_SLOT = '%%UNSUBSCRIBE%%';

/** Events in the email: the lead plus a few more; the rest wait on the site. */
const EMAIL_EVENTS = 5;

function kindLabel(e: DayEvent) {
  if (e.match) return `${e.match.format} · ${e.match.competition}`;
  return { 'test-day': 'Test match day', life: 'Life', career: 'Career', honour: 'Honour', service: 'Army', culture: 'Culture', match: 'Match' }[e.kind];
}

const BADGES: Record<string, string> = {
  hundred: 'Hundred',
  fifty: 'Fifty',
  finisher: 'Finished it',
  'player-of-the-match': 'Player of the match',
  'final-won': 'Final won',
  milestone: 'Milestone',
  birthday: 'Birthday',
};

const C = { night: '#06070a', pitch: '#0c0e13', card: '#12151b', flood: '#f4efe3', chalk: '#b9b4a8', dust: '#8a867d', gold: '#fdb913', line: '#23252b', red: '#ff0033' };
const font = "font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;";
const display = "font-family:Impact,'Arial Narrow Bold','Helvetica Neue',Arial,sans-serif;text-transform:uppercase;letter-spacing:0.5px;font-weight:normal;";

/** A red pill button that survives Gmail and Outlook (padding on the cell, not the link). */
function youtubeButton(url: string, text: string) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:18px"><tr>
    <td style="background:${C.red};border-radius:999px;padding:12px 22px;${font}">
      <a href="${url}" style="color:#ffffff;font-size:14px;font-weight:bold;text-decoration:none;display:inline-block">&#9654;&nbsp; ${esc(text)}</a>
    </td></tr></table>`;
}

function badges(e: DayEvent) {
  const list = e.highlights.map((h) => BADGES[h]).filter(Boolean);
  if (!list.length) return '';
  return `<div style="margin-top:12px">${list
    .map(
      (b) =>
        `<span style="display:inline-block;margin:0 6px 6px 0;padding:4px 10px;border:1px solid #4a3c12;border-radius:999px;color:${C.gold};font-size:11px;font-weight:bold;letter-spacing:0.6px;text-transform:uppercase;${font}">${b}</span>`,
    )
    .join('')}</div>`;
}

/** The photo, YouTube video and words for one event. The lead runs full width; the rest are cards. */
function eventCard(e: DayEvent, site: string, lead: boolean) {
  const yt = eventVideo(e);
  const photo = e.photo
    ? `<tr><td style="padding:0;line-height:0"><img src="${site}${esc(emailImage(e.photo))}" width="${lead ? 600 : 536}" alt="${esc(e.title)}" style="display:block;width:100%;height:auto;border:0;${lead ? '' : 'border-radius:14px 14px 0 0;'}"></td></tr>`
    : '';
  const caption = e.photo && !e.photoExact ? `<span style="color:${C.dust}"> · illustrative photo</span>` : '';
  const video = yt.verified
    ? `<a href="${yt.url}" style="display:block;margin-top:20px;text-decoration:none">
        <img src="${youtubeThumb(yt.video.id)}" width="${lead ? 536 : 492}" alt="Play on YouTube: ${esc(yt.video.title)}" style="display:block;width:100%;height:auto;border:0;border-radius:12px">
        <span style="display:block;margin-top:10px;font-size:14px;line-height:1.4;color:${C.flood};font-weight:bold;${font}">${esc(yt.video.title)}</span>
        <span style="display:block;font-size:12px;color:${C.dust};${font}">${esc(yt.video.channel)} on YouTube</span>
      </a>${youtubeButton(yt.url, 'Watch on YouTube')}`
    : youtubeButton(yt.url, 'Find it on YouTube');

  const body = `<tr><td style="padding:${lead ? '26px 32px 30px' : '20px 22px 24px'};${font}">
      <div style="${display}font-size:${lead ? 52 : 34}px;line-height:1;color:${C.gold}">${e.year}</div>
      <div style="font-size:12px;color:${C.dust};margin-top:6px;letter-spacing:0.4px">${esc(kindLabel(e))}${caption}</div>
      <div style="${display}font-size:${lead ? 32 : 23}px;line-height:1.08;color:${C.flood};margin-top:14px">${esc(e.title)}</div>
      ${badges(e)}
      <p style="font-size:${lead ? 16 : 15}px;line-height:1.65;color:${C.chalk};margin:12px 0 0">${esc(e.description)}</p>
      ${video}
    </td></tr>`;

  if (lead) return `${photo}${body}`;
  return `<tr><td style="padding:0 32px 18px">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.card};border:1px solid ${C.line};border-radius:14px">
      ${photo}${body}
    </table>
  </td></tr>`;
}

export function buildDigest(key: string) {
  const site = siteUrl();
  const day = getDay(key, EMAIL_EVENTS);
  const label = dayLabel(key);
  const link = `${site}/on-this-day?d=${key}`;
  const [lead, ...rest] = day.events;

  const subject = lead ? `On this day, ${label}: ${lead.title} (${lead.year})` : `On this day, ${label}: a rest day for Thala`;
  const count = day.total ? `${day.total} ${day.total === 1 ? 'memory' : 'memories'} from his career today.` : 'A quiet day in the archive.';

  const leadHtml = lead
    ? eventCard(lead, site, true)
    : `<tr><td style="padding:12px 32px 28px;${font}">
        <div style="${display}font-size:30px;color:${C.flood}">A rest day</div>
        <p style="font-size:16px;line-height:1.6;color:${C.chalk};margin:12px 0 0">No match or milestone is recorded on ${label}. The nearest memories are on ${dayLabel(day.prev)} and ${dayLabel(day.next)}.</p>
      </td></tr>`;

  const restHtml = rest.length
    ? `<tr><td style="padding:6px 32px 16px;${font}">
        <div style="font-size:12px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;color:${C.gold}">Also on ${label}</div>
      </td></tr>
      ${rest.map((e) => eventCard(e, site, false)).join('')}`
    : '';

  const extra = day.total - day.events.length;
  const more = extra > 0 ? `<p style="font-size:14px;color:${C.chalk};margin:0 0 14px;${font}">Plus ${extra} more ${extra === 1 ? 'memory' : 'memories'} from this date on the site.</p>` : '';

  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="dark"><meta name="supported-color-schemes" content="dark"><title>${esc(subject)}</title></head>
<body style="margin:0;padding:0;background:${C.night}">
<div style="display:none;max-height:0;overflow:hidden">Start your morning with beautiful memories of MS Dhoni. ${lead ? esc(`${lead.year}: ${lead.title}.`) : ''}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.night}"><tr><td align="center" style="padding:24px 12px">
  <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:${C.pitch};border:1px solid ${C.line};border-radius:20px;overflow:hidden">
    <tr><td style="height:5px;line-height:5px;font-size:0;background:${C.gold}">&nbsp;</td></tr>
    <tr><td style="padding:24px 32px 26px;${font}">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
        <td style="${display}font-size:24px;color:${C.flood}">MSD<span style="color:${C.gold}">7</span></td>
        <td align="right" style="font-size:12px;letter-spacing:2px;text-transform:uppercase;color:${C.dust}">Daily memory</td>
      </tr></table>
      <div style="font-size:13px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;color:${C.gold};margin-top:28px">Good morning</div>
      <div style="${display}font-size:46px;line-height:1;color:${C.flood};margin-top:8px">On <span style="color:${C.gold}">${label}</span></div>
      <p style="font-size:16px;line-height:1.55;color:${C.chalk};margin:12px 0 0">Start your morning with beautiful memories of MS Dhoni. ${count}</p>
    </td></tr>
    ${leadHtml}
    ${restHtml}
    <tr><td style="padding:10px 32px 34px;${font}">
      ${more}
      <table role="presentation" cellpadding="0" cellspacing="0"><tr>
        <td style="background:${C.gold};border-radius:999px;padding:14px 26px">
          <a href="${link}" style="color:${C.night};font-weight:bold;font-size:14px;letter-spacing:1px;text-transform:uppercase;text-decoration:none;display:inline-block">See the full day</a>
        </td>
        <td style="padding-left:18px"><a href="${site}" style="color:${C.flood};font-size:14px;font-weight:bold;text-decoration:none">Visit the site &rarr;</a></td>
      </tr></table>
    </td></tr>
    <tr><td style="padding:26px 32px 30px;border-top:1px solid ${C.line};${font}">
      <div style="${display}font-size:26px;line-height:1.05;color:${C.flood}">Some finish matches. <span style="color:${C.gold}">He finished arguments.</span></div>
    </td></tr>
  </table>
  <p style="${font}font-size:12px;line-height:1.6;color:${C.dust};max-width:560px;margin:18px auto 0">
    A daily note from a non-commercial MS Dhoni fan tribute. Match figures from Cricsheet scorecards; videos open on YouTube.<br>
    ${UNSUBSCRIBE_SLOT}
  </p>
</td></tr></table>
</body></html>`;

  const text = [
    'Good morning. Start your morning with beautiful memories of MS Dhoni.',
    '',
    `On ${label}`,
    '',
    ...day.events.map((e) => {
      const yt = eventVideo(e);
      return `${e.year} · ${e.title}\n${e.description}\n${yt.verified ? 'Watch on YouTube' : 'Find it on YouTube'}: ${yt.url}\n`;
    }),
    day.events.length ? '' : `A rest day. Nearest memories: ${dayLabel(day.prev)} and ${dayLabel(day.next)}.`,
    `See the full day: ${link}`,
    '',
    UNSUBSCRIBE_SLOT,
  ].join('\n');

  return { subject, html, text, total: day.total };
}

/** Fill the footer for one recipient: a personal unsubscribe link, or a reply-to-remove note. */
export function personalize(text: string, unsubscribeUrl: string | null, html: boolean) {
  const line = unsubscribeUrl
    ? html
      ? `You signed up on the site. <a href="${unsubscribeUrl}" style="color:#8a867d">Unsubscribe</a> any time.`
      : `Unsubscribe: ${unsubscribeUrl}`
    : 'You are receiving this because the site owner added your address. Reply to this email to be removed.';
  return text.split(UNSUBSCRIBE_SLOT).join(line);
}
