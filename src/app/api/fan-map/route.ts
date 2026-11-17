import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import FanPin from '@/models/FanPin';
import { cleanNumber, cleanText, readJson } from '@/lib/validate';

export async function GET() {
  try {
    await dbConnect();
    const pins = await FanPin.find({}, { name: 1, city: 1, country: 1, message: 1, lat: 1, lon: 1, createdAt: 1 })
      .sort({ createdAt: -1 })
      .limit(200)
      .lean();
    return NextResponse.json({ success: true, data: pins }, { status: 200 });
  } catch {
    return NextResponse.json({ success: false, error: 'Could not load fan pins right now.' }, { status: 503 });
  }
}

export async function POST(request: Request) {
  const body = await readJson(request);
  if (body?.website) return NextResponse.json({ success: true }, { status: 201 });

  const name = cleanText(body?.name, 60);
  const city = cleanText(body?.city, 100);
  const country = cleanText(body?.country, 100);
  const message = cleanText(body?.message, 300);
  const lat = cleanNumber(body?.lat, -90, 90);
  const lon = cleanNumber(body?.lon, -180, 180);

  if (!name || !city || !country || !message || lat === null || lon === null) {
    return NextResponse.json({ success: false, error: 'Fill in every field so we can place your pin.' }, { status: 400 });
  }

  try {
    await dbConnect();
    const pin = await FanPin.create({ name, city, country, message, lat, lon });
    return NextResponse.json({ success: true, data: pin }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: 'Could not save your pin. Please try again.' }, { status: 503 });
  }
}
