import rawData from "./dhoni365Days.json";

export type EventCategory =
  | "International"
  | "IPL"
  | "Domestic"
  | "Personal"
  | "Milestone"
  | "Award";

export interface DhoniEvent {
  id: string;
  year: number;
  title: string;
  category: EventCategory;
  description: string;
  image: string;
  imageCaption: string;
  venue?: string | null;
  opponent?: string | null;
  tags: string[];
}

export interface DhoniDayData {
  dayOfYear: number;
  date: string; // "MM-DD"
  month: number; // 1-12
  day: number; // 1-31
  formattedDate: string; // e.g. "January 1"
  eventsCount: number;
  events: DhoniEvent[];
}

export const DHONI_CALENDAR: DhoniDayData[] = rawData as DhoniDayData[];

/**
 * Look up events for any date by 1-based month and day (e.g., month=4, day=2 for April 2)
 */
export function getDhoniEventsByDate(month: number, day: number): DhoniDayData | undefined {
  const key = `${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  return DHONI_CALENDAR.find((d) => d.date === key);
}

/**
 * Look up events for today based on current system time
 */
export function getDhoniEventsForToday(): DhoniDayData {
  const now = new Date();
  const m = now.getMonth() + 1;
  const d = now.getDate();
  const found = getDhoniEventsByDate(m, d);
  if (found) return found;
  // Fallback to July 7 (Birthday) if leap-year edge or unmapped
  return getDhoniEventsByDate(7, 7)!;
}

/**
 * Search events by keyword in title, description, venue, opponent, or tags
 */
export function searchDhoniEvents(query: string): DhoniEvent[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  const results: DhoniEvent[] = [];
  for (const day of DHONI_CALENDAR) {
    for (const ev of day.events) {
      if (
        ev.title.toLowerCase().includes(q) ||
        ev.description.toLowerCase().includes(q) ||
        (ev.venue && ev.venue.toLowerCase().includes(q)) ||
        (ev.opponent && ev.opponent.toLowerCase().includes(q)) ||
        ev.tags.some((t) => t.toLowerCase().includes(q))
      ) {
        results.push(ev);
      }
    }
  }
  return results;
}
