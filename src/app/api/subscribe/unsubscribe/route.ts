import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Subscriber from '@/models/Subscriber';

export const runtime = 'nodejs';

/**
 * One-click unsubscribe (RFC 8058). Gmail and Apple Mail POST here from their own
 * "Unsubscribe" button, using the List-Unsubscribe header on each daily email.
 */
export async function POST(request: Request) {
  const token = new URL(request.url).searchParams.get('token');
  if (!token || !/^[a-f0-9]{48}$/.test(token)) return NextResponse.json({ success: false }, { status: 400 });
  try {
    await dbConnect();
    await Subscriber.deleteOne({ token });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 503 });
  }
}
