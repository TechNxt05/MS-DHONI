export interface OnThisDayEvent {
  year: string;
  text: string;
  source: string;
  url: string;
}

const FALLBACK_EVENTS: OnThisDayEvent[] = [
  {
    year: "2007",
    text: "Dhoni lifts the inaugural ICC T20 World Cup as captain of a young India side.",
    source: "Tribute Archive",
    url: "https://www.icc-cricket.com/",
  },
  {
    year: "2011",
    text: "The unbeaten 91* in the World Cup final becomes one of India's greatest sports memories.",
    source: "Tribute Archive",
    url: "https://www.icc-cricket.com/",
  },
  {
    year: "2013",
    text: "Dhoni completes the ICC white-ball treble with Champions Trophy victory.",
    source: "Tribute Archive",
    url: "https://www.icc-cricket.com/",
  },
];

type WikiFeedResponse = {
  events?: Array<{
    year?: number;
    text?: string;
    pages?: Array<{ content_urls?: { desktop?: { page?: string } } }>;
  }>;
};

export async function getOnThisDayDhoniEvents(): Promise<OnThisDayEvent[]> {
  try {
    const today = new Date();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    const res = await fetch(
      `https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/events/${month}/${day}`,
      {
        next: { revalidate: 60 * 60 * 24 },
      }
    );
    if (!res.ok) return FALLBACK_EVENTS;

    const data = (await res.json()) as WikiFeedResponse;
    const filtered = (data.events ?? [])
      .filter((event) =>
        (event.text ?? "").toLowerCase().includes("dhoni") ||
        (event.text ?? "").toLowerCase().includes("chennai super kings")
      )
      .slice(0, 3)
      .map<OnThisDayEvent>((event) => ({
        year: String(event.year ?? "Unknown"),
        text: event.text ?? "Dhoni-related cricket memory.",
        source: "Wikipedia On This Day",
        url:
          event.pages?.[0]?.content_urls?.desktop?.page ??
          "https://en.wikipedia.org/wiki/MS_Dhoni",
      }));

    return filtered.length > 0 ? filtered : FALLBACK_EVENTS;
  } catch {
    return FALLBACK_EVENTS;
  }
}
