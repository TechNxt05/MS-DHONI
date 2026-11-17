import { NextResponse } from 'next/server';
import { dayKey, getDay, isDayKey } from '@/lib/onThisDay';

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const requested = params.get('d');
  const limit = Math.min(12, Math.max(1, Number(params.get('limit')) || 6));
  if (requested !== null && !isDayKey(requested)) {
    return NextResponse.json({ success: false, error: 'Use ?d=MM-DD, for example ?d=04-02.' }, { status: 400 });
  }
  const key = requested ?? dayKey();
  return NextResponse.json(
    { success: true, data: getDay(key, limit) },
    { headers: { 'Cache-Control': 'public, max-age=3600, s-maxage=86400' } },
  );
}
