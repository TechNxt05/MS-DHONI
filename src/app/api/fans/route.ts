import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import FanMessage from '@/models/FanMessage';
import { cleanText, readJson } from '@/lib/validate';

export async function GET() {
  try {
    await dbConnect();
    const messages = await FanMessage.find({}, { name: 1, message: 1, createdAt: 1 }).sort({ createdAt: -1 }).limit(100).lean();
    return NextResponse.json({ success: true, data: messages }, { status: 200 });
  } catch {
    return NextResponse.json({ success: false, error: 'Could not load messages right now.' }, { status: 503 });
  }
}

export async function POST(request: Request) {
  const body = await readJson(request);
  // Honeypot: real visitors never see or fill this field.
  if (body?.website) return NextResponse.json({ success: true }, { status: 201 });

  const name = cleanText(body?.name, 50);
  const message = cleanText(body?.message, 500);
  if (!name || !message) {
    return NextResponse.json(
      { success: false, error: 'Add your name (up to 50 characters) and a message (up to 500).' },
      { status: 400 },
    );
  }

  try {
    await dbConnect();
    const doc = await FanMessage.create({ name, message });
    return NextResponse.json(
      { success: true, data: { _id: doc._id, name: doc.name, message: doc.message, createdAt: doc.createdAt } },
      { status: 201 },
    );
  } catch {
    return NextResponse.json({ success: false, error: 'Could not post your message. Please try again.' }, { status: 503 });
  }
}
