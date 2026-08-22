const WORDS_PER_MINUTE = 225;

/**
 * Estimate reading time (in whole minutes, minimum 1) from plain text.
 * Computed dynamically — not stored in the database.
 */
export function getReadingTime(text: string): number {
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;

  if (wordCount === 0) {
    return 1;
  }

  return Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));
}
