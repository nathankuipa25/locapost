type TiptapTextNode = {
  text?: string;
};

type TiptapContentNode = {
  content?: TiptapTextNode[];
};

type TiptapDoc = {
  content?: TiptapContentNode[];
};

/**
 * Derive a short plain-text preview from a post's Tiptap JSON content,
 * falling back to the plain-text `content` column when JSON is missing
 * or unreadable. Used for article metadata descriptions and feed previews.
 */
export function getDescription(
  contentJson: unknown,
  fallback: string,
  maxLength = 160
): string {
  if (!contentJson || typeof contentJson !== "object") {
    return fallback.slice(0, maxLength);
  }

  const json = contentJson as TiptapDoc;

  const text =
    json.content
      ?.flatMap((node) => node.content ?? [])
      .map((node) => node.text ?? "")
      .join(" ")
      .replace(/\s+/g, " ")
      .trim() || fallback;

  return text.slice(0, maxLength);
}
