import type { Metadata } from 'next';
import { dayCoverage, dayKey, getCalendar, isDayKey } from '@/lib/onThisDay';
import CalendarClient from './CalendarClient';

export const metadata: Metadata = {
  title: 'On This Day',
  description: 'Every day of the year with an MS Dhoni memory: 789 matches, debuts, finals, honours and life events, day by day.',
};

export default async function OnThisDayPage({ searchParams }: { searchParams: Promise<{ d?: string }> }) {
  const { d } = await searchParams;
  const today = dayKey();
  return (
    <CalendarClient
      calendar={getCalendar()}
      coverage={{ days: dayCoverage.daysWithEvents, total: dayCoverage.totalDays, matches: dayCoverage.matches }}
      initialDay={isDayKey(d ?? null) ? d! : today}
      today={today}
    />
  );
}
