import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { buildDigest, personalize, siteUrl } from '@/lib/digest';
import { cleanEmail, mailConfigured, mailer, sender } from '@/lib/mailer';
import { dayKey, isDayKey } from '@/lib/onThisDay';
import Subscriber from '@/models/Subscriber';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
// Sends one message per recipient; allow time for a modest list.
export const maxDuration = 60;

/**
 * Sends the daily "On this day" email. Vercel Cron calls it every morning (see vercel.json)
 * with `Authorization: Bearer $CRON_SECRET`.
 *
 *   ?preview=1   return the email as HTML instead of sending it
 *   ?d=MM-DD     use another day (for testing)
 *
 * Recipients: DIGEST_RECIPIENTS (comma-separated, added by the owner) plus confirmed
 * sign-ups from the site, each with a personal unsubscribe link.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const params = new URL(request.url).searchParams;
  const requested = params.get('d');
  if (requested !== null && !isDayKey(requested)) {
    return NextResponse.json({ success: false, error: 'Use ?d=MM-DD.' }, { status: 400 });
  }
  const digest = buildDigest(requested ?? dayKey());

  if (params.get('preview') === '1') {
    return new NextResponse(personalize(digest.html, `${siteUrl()}/subscribe/unsubscribe?token=preview`, true), {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }
  if (!mailConfigured()) {
    return NextResponse.json({ success: false, error: 'Email is not configured: set GMAIL_USER and GMAIL_APP_PASSWORD.' }, { status: 503 });
  }

  // Owner-added addresses first; sign-ups add a personal unsubscribe token.
  const list = new Map<string, string | null>();
  for (const raw of (process.env.DIGEST_RECIPIENTS ?? '').split(',')) {
    const email = cleanEmail(raw);
    if (email) list.set(email, null);
  }
  let dbError = false;
  if (process.env.MONGODB_URI) {
    try {
      await dbConnect();
      const subs = await Subscriber.find({ status: 'active' }, { email: 1, token: 1 }).lean();
      for (const s of subs) if (!list.has(s.email)) list.set(s.email, s.token);
    } catch (err) {
      dbError = true;
      console.error('Could not load subscribers:', err);
    }
  }
  if (list.size === 0) {
    return NextResponse.json({ success: false, error: 'No recipients yet.', dbError }, { status: 200 });
  }

  const site = siteUrl();
  let sent = 0;
  const failed: string[] = [];
  for (const [email, token] of list) {
    const unsubPage = token ? `${site}/subscribe/unsubscribe?token=${token}` : null;
    try {
      await mailer().sendMail({
        from: sender(),
        to: email,
        subject: digest.subject,
        html: personalize(digest.html, unsubPage, true),
        text: personalize(digest.text, unsubPage, false),
        headers: token
          ? {
              'List-Unsubscribe': `<${site}/api/subscribe/unsubscribe?token=${token}>`,
              'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
            }
          : undefined,
      });
      sent += 1;
    } catch (err) {
      failed.push(email.replace(/(^.).*(@.*$)/, '$1***$2'));
      console.error('Send failed:', err);
    }
  }
  return NextResponse.json({ success: failed.length === 0, sent, failed: failed.length, dbError, events: digest.total });
}
