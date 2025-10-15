/**
 * Set cache headers for Astro responses
 * every page is invalidated on every deploy via webhook
 * @param headers - Astro.response.headers
 * @param options - Cache duration options (both browser and CDN required)
 * @example
 * setCacheHeaders(Astro.response.headers, {
 *   browser: { minutes: 5 },
 *   cdn: { hours: 1 }
 * });
 * @example
 * setCacheHeaders(Astro.response.headers, CachePresets.medium);
 */
export function setCacheHeaders(
  headers: (HeadersInit | undefined) & Headers,
  options: {
    browser: Duration;
    cdn: Duration;
  },
) {
  const browserMaxAge = calculateSeconds(options.browser);
  const cdnMaxAge = calculateSeconds(options.cdn);

  headers.set("Cache-Control", `public, max-age=${browserMaxAge}, s-maxage=${cdnMaxAge}`);
}

type Duration =
  | { seconds: number }
  | { minutes: number }
  | { hours: number }
  | { days: number }
  | { months: number }
  | { years: number };

function calculateSeconds(duration: Duration): number {
  if ("seconds" in duration) return duration.seconds;
  if ("minutes" in duration) return duration.minutes * 60;
  if ("hours" in duration) return duration.hours * 3600;
  if ("days" in duration) return duration.days * 86400;
  if ("months" in duration) return duration.months * 2592000; // 30 days
  if ("years" in duration) return duration.years * 31536000;
  return 0;
}

/**
 * Common cache presets for different use cases
 */
export const CachePresets = {
  // Frequently updated content
  short: { browser: { minutes: 5 }, cdn: { minutes: 15 } },

  // Semi-dynamic content
  medium: { browser: { minutes: 5 }, cdn: { hours: 1 } },

  // Stable content
  long: { browser: { minutes: 5 }, cdn: { days: 7 } },

  // Articles with webhook invalidation
  article: { browser: { minutes: 5 }, cdn: { years: 1 } },
} as const;
