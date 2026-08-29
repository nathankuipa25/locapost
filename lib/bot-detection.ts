// Known bot / crawler / uptime-monitor / scripted-client user agent
// substrings. Not exhaustive, but covers the traffic that would
// otherwise inflate view counts the most: search engine crawlers,
// social-media link-preview fetchers, and common CLI HTTP clients.
const BOT_PATTERNS: RegExp[] = [
  /bot/i,
  /crawler/i,
  /spider/i,
  /slurp/i,
  /facebookexternalhit/i,
  /whatsapp/i,
  /telegrambot/i,
  /discordbot/i,
  /skypeuripreview/i,
  /linkedinbot/i,
  /pinterest/i,
  /ia_archiver/i,
  /curl\//i,
  /wget\//i,
  /python-requests/i,
  /python-urllib/i,
  /node-fetch/i,
  /axios\//i,
  /go-http-client/i,
  /headlesschrome/i,
  /phantomjs/i,
  /pingdom/i,
  /uptimerobot/i,
  /statuscake/i,
];

/**
 * Best-effort check for non-human traffic based on the request's
 * User-Agent header. Used to keep automated requests (crawlers,
 * uptime monitors, preview-link fetchers, scripted clients) from
 * inflating article view counts.
 *
 * This is a heuristic, not a security boundary — a determined bot
 * can spoof its User-Agent to look human. It's paired with a
 * per-visitor cookie and author-exclusion check in the view API
 * route for a reasonable, low-maintenance defense against the most
 * common sources of inflated counts.
 */
export function isLikelyBot(userAgent: string): boolean {
  if (!userAgent.trim()) {
    // No User-Agent at all is unusual for a real browser — treat it
    // as non-human rather than risk counting scripted traffic.
    return true;
  }

  return BOT_PATTERNS.some((pattern) => pattern.test(userAgent));
}
