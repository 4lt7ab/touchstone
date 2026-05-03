/**
 * Strip markdown markup from a source string and return the rendered text
 * content. Designed for line-clamped previews — table cells, breadcrumbs,
 * snippet excerpts — where the full structural markdown wouldn't clamp
 * gracefully.
 *
 * Handles fenced code, inline code, headings, blockquotes, lists, links,
 * images, emphasis (bold / italic / strikethrough), horizontal rules, and
 * collapses leftover whitespace. Inline HTML tags are dropped, their text
 * kept.
 *
 * Not a parser. Edge cases (nested emphasis runs, footnote definitions,
 * tables) are best-effort. For full-fidelity output, render `Markdown`
 * normally; for a one-line preview, this is the intended escape hatch.
 */
export function markdownToPlainText(source: string): string {
  if (!source) return '';

  let text = source;

  // Normalize newlines.
  text = text.replace(/\r\n?/g, '\n');

  // Fenced code blocks ```lang\n...\n``` — keep inner content, drop fences.
  text = text.replace(/```[^\n]*\n([\s\S]*?)```/g, (_, body: string) => body);

  // Indented code blocks (4 spaces). Strip the leading indent so the body reads.
  text = text.replace(/^(?: {4}|\t)(.+)$/gm, '$1');

  // Inline HTML tags — drop the tag, keep the text.
  text = text.replace(/<\/?[a-zA-Z][^>]*>/g, '');

  // Images ![alt](url) — keep alt.
  text = text.replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1');

  // Reference-style images ![alt][id]
  text = text.replace(/!\[([^\]]*)\]\[[^\]]*\]/g, '$1');

  // Links [text](url) — keep text.
  text = text.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1');

  // Reference-style links [text][id]
  text = text.replace(/\[([^\]]+)\]\[[^\]]*\]/g, '$1');

  // Reference link definitions on their own line: [id]: url "title"
  text = text.replace(/^\s*\[[^\]]+\]:\s+\S+.*$/gm, '');

  // Inline code — keep content.
  text = text.replace(/`+([^`\n]+?)`+/g, '$1');

  // Bold / italic markers — strip ** __ * _ ~~ around text.
  text = text.replace(/(\*\*|__)(.+?)\1/g, '$2');
  text = text.replace(/(\*|_)(?=\S)([^\n*_]+?)(?<=\S)\1/g, '$2');
  text = text.replace(/~~(.+?)~~/g, '$1');

  // Headings — strip leading #.
  text = text.replace(/^\s{0,3}#{1,6}\s+/gm, '');

  // Setext headings underline (=== or ---) on its own line.
  text = text.replace(/^\s*(=+|-+)\s*$/gm, '');

  // Blockquote markers.
  text = text.replace(/^\s*>\s?/gm, '');

  // List markers (-, *, +, 1., 2.) at line start.
  text = text.replace(/^\s*([-*+]|\d+[.)])\s+/gm, '');

  // Horizontal rules and table separators (---, ***, ___, |---|).
  text = text.replace(/^\s*([-*_]\s*){3,}\s*$/gm, '');
  text = text.replace(/^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/gm, '');

  // GFM tables — reduce pipes to spaces, drop leading/trailing pipes.
  text = text.replace(/^\s*\|/gm, '');
  text = text.replace(/\|\s*$/gm, '');
  text = text.replace(/\s*\|\s*/g, ' ');

  // Collapse 3+ newlines to 2, trim line whitespace, then collapse runs.
  text = text
    .split('\n')
    .map((line) => line.replace(/\s+/g, ' ').trim())
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  return text;
}
