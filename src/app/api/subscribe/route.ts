import { randomBytes } from 'node:crypto';
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { siteUrl } from '@/lib/digest';
import { cleanEmail, mailConfigured, mailer, sender } from '@/lib/mailer';
import { readJson } from '@/lib/validate';
import Subscriber from '@/models/Subscriber';

export const runtime = 'nodejs';

const RESEND_AFTER_MS = 10 * 60 * 1000;
const ok = (message: string) => NextResponse.json({ success: true, message });

/**
 * Sign up for the daily email. Double opt-in: we only email a confirmation link here,
 * so nobody can subscribe someone else's address.
 */
export async function POST(request: Request) {
  const body = await readJson(request);
  if (body?.website) return ok('Check your inbox to confirm.'); // honeypot
  const email = cleanEmail(body?.email);
  if (!email) return NextResponse.json({ success: false, error: 'That doesn’t look like an email address.' }, { status: 400 });
  if (!mailConfigured()) {
    return NextResponse.json({ success: false, error: 'Sign-ups open soon. Please try again later.' }, { status: 503 });
  }

  try {
    await dbConnect();
    let sub = await Subscriber.findOne({ email });
    if (sub?.status === 'active') return ok('You’re already on the list. See you tomorrow morning.');
    if (sub?.lastConfirmSentAt && Date.now() - sub.lastConfirmSentAt.getTime() < RESEND_AFTER_MS) {
      return ok('We just sent you a confirmation link. Check your inbox (and spam).');
    }
    sub ??= new Subscriber({ email, token: randomBytes(24).toString('hex') });
    sub.lastConfirmSentAt = new Date();
    await sub.save();

    const link = `${siteUrl()}/subscribe/confirm?token=${sub.token}`;
    await mailer().sendMail({
      from: sender(),
      to: email,
      subject: 'Confirm your daily Dhoni memory',
      text: `Tap to confirm and get one MS Dhoni memory every morning:\n${link}\n\nIf you didn’t ask for this, ignore this email and nothing will happen.`,
      html: `<div style="font-family:Arial,sans-serif;background:#06070a;padding:28px;color:#f4efe3">
  <p style="font-size:22px;font-weight:bold;margin:0">One tap and you’re in.</p>
  <p style="color:#b9b4a8;line-height:1.6">Confirm your address and you’ll get one MS Dhoni memory every morning: the match, the moment, and a video to relive it.</p>
  <p><a href="${link}" style="display:inline-block;background:#fdb913;color:#06070a;font-weight:bold;text-decoration:none;padding:12px 22px;border-radius:999px">Confirm my email</a></p>
  <p style="color:#8a867d;font-size:12px">If you didn’t ask for this, ignore this email and nothing will happen.</p>
</div>`,
    });
    return ok('Almost there: check your inbox and tap the link to confirm.');
  } catch (err) {
    console.error('Subscribe failed:', err);
    return NextResponse.json({ success: false, error: 'Couldn’t sign you up right now. Please try again.' }, { status: 503 });
  }
}
