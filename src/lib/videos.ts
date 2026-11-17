/**
 * YouTube videos from official or established channels, each checked through YouTube's oEmbed
 * endpoint (title, channel, embeddable). `date` ties a video to its day in the On This Day data.
 */
export interface YouTubeVideo {
  id: string;
  date: string;
  title: string;
  channel: string;
}

export const youtubeVideos: YouTubeVideo[] = [
  { id: 'R0alThHNb0Y', date: '2011-04-02', title: 'Dhoni finishes off in style!', channel: 'ICC' },
  { id: 'PEUuSm7gHHk', date: '2016-03-23', title: 'MS Dhoni breaks Bangladesh hearts', channel: 'ICC' },
  { id: 'KSCu03wiJZs', date: '2005-10-31', title: 'On this day: Dhoni’s blistering 183 not out vs Sri Lanka', channel: 'Sportstar' },
  { id: '50InqORNvk4', date: '2023-05-29', title: 'CSK win after last-over heroics by Ravindra Jadeja', channel: 'India Today' },
  { id: 'rbqR4QQxPr0', date: '2020-08-15', title: 'MS Dhoni announces international retirement: an ode to Captain Cool', channel: 'Cricbuzz' },
  { id: 'LG0dcDiLkbY', date: '2016-03-23', title: 'Nehra reveals how MS Dhoni ran Bangladesh out in 2016', channel: 'Cricbuzz' },
  { id: '2WuxwQtuWIQ', date: '2019-07-10', title: 'Guptill’s run out of Dhoni was a big moment in the game: Williamson', channel: 'ESPNcricinfo' },
  { id: '8MO6BvYLtMc', date: '2025-06-09', title: 'What did MS Dhoni say after being inducted into the ICC Hall of Fame?', channel: 'HT Cricket' },
];

export const youtubeWatch = (id: string) => `https://www.youtube.com/watch?v=${id}`;
export const youtubeThumb = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

/** Verified videos for a calendar day (YYYY-MM-DD). */
export const videosOn = (date: string) => youtubeVideos.filter((v) => v.date === date);

/** A YouTube search for any event without a verified video. */
export function youtubeSearch(q: string) {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`;
}
