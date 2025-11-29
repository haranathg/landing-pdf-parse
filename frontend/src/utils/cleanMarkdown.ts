/**
 * Cleans markdown content for user-friendly display
 * Removes HTML tags, markdown syntax, and other technical artifacts
 */
export function cleanMarkdownForDisplay(markdown: string): string {
  if (!markdown) return '';

  let cleaned = markdown;

  // Remove HTML tags like <table>, <tr>, <td>, <div>, etc.
  cleaned = cleaned.replace(/<[^>]+>/g, ' ');

  // Remove markdown image syntax ![alt](url)
  cleaned = cleaned.replace(/!\[[^\]]*\]\([^)]*\)/g, '[Image]');

  // Remove markdown link syntax [text](url) but keep the text
  cleaned = cleaned.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1');

  // Remove markdown headers (# ## ### etc)
  cleaned = cleaned.replace(/^#{1,6}\s+/gm, '');

  // Remove markdown bold/italic markers
  cleaned = cleaned.replace(/\*\*([^*]+)\*\*/g, '$1');
  cleaned = cleaned.replace(/\*([^*]+)\*/g, '$1');
  cleaned = cleaned.replace(/__([^_]+)__/g, '$1');
  cleaned = cleaned.replace(/_([^_]+)_/g, '$1');

  // Remove markdown code blocks
  cleaned = cleaned.replace(/```[^`]*```/g, '[Code]');
  cleaned = cleaned.replace(/`([^`]+)`/g, '$1');

  // Remove markdown horizontal rules
  cleaned = cleaned.replace(/^[-*_]{3,}$/gm, '');

  // Remove markdown list markers
  cleaned = cleaned.replace(/^\s*[-*+]\s+/gm, '• ');
  cleaned = cleaned.replace(/^\s*\d+\.\s+/gm, '');

  // Remove markdown blockquotes
  cleaned = cleaned.replace(/^>\s*/gm, '');

  // Remove pipe characters from tables
  cleaned = cleaned.replace(/\|/g, ' ');

  // Clean up extra whitespace
  cleaned = cleaned.replace(/\s+/g, ' ');
  cleaned = cleaned.trim();

  return cleaned;
}

/**
 * Gets a short preview of the markdown content
 */
export function getMarkdownPreview(markdown: string, maxLength: number = 200): string {
  const cleaned = cleanMarkdownForDisplay(markdown);
  if (cleaned.length <= maxLength) return cleaned;
  return cleaned.substring(0, maxLength).trim();
}
