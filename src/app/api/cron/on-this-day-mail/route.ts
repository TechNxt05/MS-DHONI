import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { buildDigest } from '@/lib/digest';
import { dayKey, isDayKey } from '@/lib/onThisDay';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Sends the daily "On this day" email. Vercel Cron calls it every morning (see vercel.json)
 * with `Authorization: Bearer $CRON_SECRET`.
 *
 *   ?preview=1   return the email as HTML instead of sending it
 *   ?d=MM-DD     use another day (for testing)
 *
 * Env: CRON_SECRET, GMAIL_USER, GMAIL_APP_PASSWORD, DIGEST_RECIPIENTS (comma-separated), SITE_URL (optional)
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
    return new NextResponse(digest.html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
  }

  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  const recipients = (process.env.DIGEST_RECIPIENTS ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter((s) => /^[^\s@,]+@[^\s@,]+\.[^\s@,]+$/.test(s));
  if (!user || !pass || recipients.length === 0) {
    return NextResponse.json({ success: false, error: 'Email is not configured: set GMAIL_USER, GMAIL_APP_PASSWORD and DIGEST_RECIPIENTS.' }, { status: 503 });
  }

  const transport = nodemailer.createTransport({ service: 'gmail', auth: { user, pass } });
  try {
    // One message, everyone in Bcc, so recipients never see each other's addresses.
    const info = await transport.sendMail({
      from: { name: 'Dhoni: On This Day', address: user },
      to: user,
      bcc: recipients,
      subject: digest.subject,
      html: digest.html,
      text: digest.text,
    });
    return NextResponse.json({ success: true, sent: recipients.length, events: digest.total, id: info.messageId });
  } catch (err) {
    console.error('On-this-day mail failed:', err);
    return NextResponse.json({ success: false, error: 'Sending failed. Check the Gmail app password.' }, { status: 502 });
  }
}
