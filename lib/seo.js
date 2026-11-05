// Single source of truth for page titles and meta descriptions.
export const SITE_NAME = 'House Japanese Curry';

export function buildTitle(part) {
  const clean = stripHtml(part);
  return clean ? `${clean} | ${SITE_NAME}` : SITE_NAME;
}

export function stripHtml(html) {
  if (!html) return '';
  return String(html)
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&[lr]dquo;/g, '"')
    .replace(/&[lr]squo;/g, "'")
    .replace(/&#?\w+;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Plain-text description trimmed to ~155 chars on a word boundary.
export function toDescription(html, fallback = '', max = 155) {
  const text = stripHtml(html) || fallback;
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(' ');
  return `${cut.slice(0, lastSpace > 80 ? lastSpace : max).trim()}…`;
}
