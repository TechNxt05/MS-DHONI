export interface NewsArticle {
  source: { id: string | null; name: string };
  author: string | null;
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  content: string;
}

const FALLBACK_NEWS: NewsArticle[] = [
  {
    source: { id: "tribute", name: "Tribute Desk" },
    author: null,
    title: "MS Dhoni and the art of finishing impossible chases",
    description:
      "A breakdown of Dhoni's match awareness and finishing approach in pressure run chases.",
    url: "https://www.espncricinfo.com/cricketers/ms-dhoni-28081",
    urlToImage:
      "/photos/chase-mode.webp",
    publishedAt: "2026-03-10T10:00:00.000Z",
    content: "Dhoni's finishing ability continues to define modern ODI chases.",
  },
  {
    source: { id: "tribute", name: "Tribute Desk" },
    author: null,
    title: "Reliving the 2011 final six that changed Indian cricket forever",
    description:
      "The Wankhede night remains one of cricket's most emotional championship moments.",
    url: "https://en.wikipedia.org/wiki/2011_Cricket_World_Cup_final",
    urlToImage:
      "/photos/world-cup-final-six-2011.webp",
    publishedAt: "2026-04-02T12:00:00.000Z",
    content: "Dhoni's unbeaten 91 in the final remains all-time iconic.",
  },
  {
    source: { id: "tribute", name: "Tribute Desk" },
    author: null,
    title: "Captain Cool: legacy of calm leadership in high-voltage IPL finishes",
    description:
      "How Dhoni's field placements and bowling changes built CSK's title-winning identity.",
    url: "https://en.wikipedia.org/wiki/MS_Dhoni",
    urlToImage:
      "/photos/csk-keeper-command.webp",
    publishedAt: "2026-04-11T08:30:00.000Z",
    content: "Dhoni's tactical calm has become the CSK blueprint.",
  },
];

// Empty: the page swaps in tribute photography when a story has no image.
const DEFAULT_IMAGE = "";

type GNewsResponse = {
  articles?: Array<{
    title?: string;
    description?: string;
    content?: string;
    url?: string;
    image?: string;
    publishedAt?: string;
    source?: { name?: string; url?: string };
  }>;
};

export async function getDhoniNews(): Promise<NewsArticle[]> {
  const apiKey = process.env.GNEWS_API_KEY;
  if (!apiKey) return FALLBACK_NEWS;

  const params = new URLSearchParams({
    q: process.env.GNEWS_QUERY ?? "MS Dhoni OR Chennai Super Kings",
    lang: "en",
    country: process.env.GNEWS_COUNTRY ?? "in",
    max: process.env.GNEWS_MAX_RESULTS ?? "10",
    sortby: "publishedAt",
    apikey: apiKey,
  });

  try {
    const response = await fetch(
      `https://gnews.io/api/v4/search?${params.toString()}`,
      {
      next: { revalidate: 60 * 20 },
      }
    );
    if (!response.ok) {
      return FALLBACK_NEWS;
    }

    const data = (await response.json()) as GNewsResponse;
    const mapped = (data.articles ?? [])
      .filter((item) => item.url && item.title)
      .map<NewsArticle>((item) => ({
        source: {
          id: null,
          name: item.source?.name ?? "Cricket Source",
        },
        author: null,
        title: item.title ?? "Dhoni update",
        description: item.description ?? "Latest cricket update.",
        url: item.url ?? "https://www.icc-cricket.com/",
        urlToImage: item.image ?? DEFAULT_IMAGE,
        publishedAt: item.publishedAt ?? new Date().toISOString(),
        content: item.content ?? item.description ?? "No content available.",
      }));

    return mapped.length > 0 ? mapped : FALLBACK_NEWS;
  } catch {
    return FALLBACK_NEWS;
  }
}
