import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import PressureScore from '@/models/PressureScore';
import { cleanNumber, cleanText, readJson } from '@/lib/validate';

export async function GET() {
  try {
    await dbConnect();
    const scores = await PressureScore.find({}, { name: 1, score: 1, createdAt: 1 }).sort({ score: -1, createdAt: 1 }).limit(20).lean();
    return NextResponse.json({ success: true, data: scores }, { status: 200 });
  } catch {
    return NextResponse.json({ success: false, error: 'Could not load the leaderboard.' }, { status: 503 });
  }
}

export async function POST(request: Request) {
  const body = await readJson(request);
  const name = cleanText(body?.name, 50);
  const score = cleanNumber(body?.score, 0, 100);
  if (!name || score === null) {
    return NextResponse.json({ success: false, error: 'A name and a score from 0 to 100 are required.' }, { status: 400 });
  }
  try {
    await dbConnect();
    const doc = await PressureScore.create({ name, score: Math.round(score) });
    return NextResponse.json({ success: true, data: doc }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: 'Could not submit the score.' }, { status: 503 });
  }
}
