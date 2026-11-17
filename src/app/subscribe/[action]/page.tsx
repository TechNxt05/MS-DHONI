import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import dbConnect from '@/lib/db';
import Subscriber from '@/models/Subscriber';

export const metadata: Metadata = { title: 'Daily email', robots: { index: false } };

const TOKEN = /^[a-f0-9]{48}$/;

/**
 * /subscribe/confirm?token=…  and  /subscribe/unsubscribe?token=…
 * Both ask for a button press, so email link-scanners that open links automatically
 * can’t confirm or cancel on someone’s behalf.
 */
export default async function SubscribePage({
  params,
  searchParams,
}: {
  params: Promise<{ action: string }>;
  searchParams: Promise<{ token?: string; done?: string }>;
}) {
  const { action } = await params;
  const { token, done } = await searchParams;
  if (action !== 'confirm' && action !== 'unsubscribe') notFound();
  const valid = !!token && TOKEN.test(token);
  const confirm = action === 'confirm';

  async function act(formData: FormData) {
    'use server';
    const t = String(formData.get('token') ?? '');
    const a = String(formData.get('action') ?? '');
    if (!TOKEN.test(t)) redirect(`/subscribe/${a === 'confirm' ? 'confirm' : 'unsubscribe'}?done=invalid`);
    await dbConnect();
    let result = 'ok';
    if (a === 'confirm') {
      const r = await Subscriber.updateOne({ token: t }, { status: 'active', confirmedAt: new Date() });
      if (r.matchedCount === 0) result = 'invalid';
      redirect(`/subscribe/confirm?done=${result}`);
    } else {
      await Subscriber.deleteOne({ token: t });
      redirect('/subscribe/unsubscribe?done=ok');
    }
  }

  let heading: string;
  let body: string;
  if (done === 'ok') {
    heading = confirm ? 'You’re in.' : 'Done. You’re off the list.';
    body = confirm
      ? 'From tomorrow morning, one MS Dhoni memory lands in your inbox every day: the match, the moment, and a video to relive it.'
      : 'No more daily emails. The calendar is always here whenever you want a memory.';
  } else if (done === 'invalid' || !valid) {
    heading = 'That link has expired.';
    body = confirm ? 'Sign up again from the home page and we’ll send a fresh link.' : 'You may already be unsubscribed.';
  } else {
    heading = confirm ? 'One tap to confirm.' : 'Leave the daily email?';
    body = confirm ? 'Confirm your address to start getting one MS Dhoni memory every morning.' : 'You’ll stop getting the morning email. You can sign up again any time.';
  }

  return (
    <main className="mx-auto flex min-h-[80svh] max-w-[760px] flex-col justify-center px-4 pb-24 pt-36 sm:px-8">
      <h1 className="font-display text-[clamp(3rem,9vw,6rem)] font-black uppercase leading-[0.85] tracking-[-0.02em]">{heading}</h1>
      <p className="mt-6 max-w-[52ch] text-lg text-chalk">{body}</p>
      {!done && valid && (
        <form action={act} className="mt-10">
          <input type="hidden" name="token" value={token} />
          <input type="hidden" name="action" value={action} />
          <button
            type="submit"
            className={`rounded-full px-7 py-4 text-sm font-bold uppercase tracking-[0.12em] transition-colors ${
              confirm ? 'bg-gold text-night hover:bg-flood' : 'border border-flood/25 text-flood hover:border-gold hover:text-gold'
            }`}
          >
            {confirm ? 'Confirm my email' : 'Unsubscribe'}
          </button>
        </form>
      )}
      <Link href="/on-this-day" className="mt-10 text-sm font-semibold text-blue hover:text-gold">
        Open today’s memories
      </Link>
    </main>
  );
}
