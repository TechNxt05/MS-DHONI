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
    source: { id: "espncricinfo", name: "ESPNcricinfo" },
    author: "Sports Desk",
    title: "MS Dhoni and the art of finishing impossible chases",
    description:
      "A breakdown of Dhoni's match awareness and finishing approach in pressure run chases.",
    url: "https://www.espncricinfo.com/",
    urlToImage:
      "https://images.unsplash.com/photo-1512719994953-eabf5075e51b?w=1200&q=80",
    publishedAt: "2026-03-10T10:00:00.000Z",
    content: "Dhoni's finishing ability continues to define modern ODI chases.",
  },
  {
    source: { id: "icc", name: "ICC" },
    author: "ICC Editorial",
    title: "Reliving the 2011 final six that changed Indian cricket forever",
    description:
      "The Wankhede night remains one of cricket's most emotional championship moments.",
    url: "https://www.icc-cricket.com/",
    urlToImage:
      "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1200&q=80",
    publishedAt: "2026-04-02T12:00:00.000Z",
    content: "Dhoni's unbeaten 91 in the final remains all-time iconic.",
  },
  {
    source: { id: "iplt20", name: "IPL" },
    author: "IPL Media",
    title: "Captain Cool: legacy of calm leadership in high-voltage IPL finishes",
    description:
      "How Dhoni's field placements and bowling changes built CSK's title-winning identity.",
    url: "https://www.iplt20.com/",
    urlToImage:
      "https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?w=1200&q=80",
    publishedAt: "2026-04-11T08:30:00.000Z",
    content: "Dhoni's tactical calm has become the CSK blueprint.",
  },
];

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=1200&q=80";

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
