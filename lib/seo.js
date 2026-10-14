// Single source for the canonical domain and brand name used in titles,
// meta descriptions, the sitemap and hreflang links.
export const SITE_URL = 'https://housejapanesecurry.com';
export const SITE_NAME = 'House Japanese Curry';

export const buildTitle = (title) => (title ? `${title} | ${SITE_NAME}` : SITE_NAME);

// Plain-text meta description from CMS HTML, cut at a word boundary (~155 chars).
export function metaDescription(html, fallback = '') {
  const text = String(html || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&[lr]dquo;/g, '"')
    .replace(/&[lr]squo;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
  if (!text) return fallback;
  if (text.length <= 155) return text;
  return text.slice(0, 155).replace(/\s+\S*$/, '') + '…';
}

// Absolute URL for a path in a given locale (default locale "en" has no prefix).
export const localeUrl = (locale, path = '/') =>
  `${SITE_URL}${locale && locale !== 'en' ? `/${locale}` : ''}${path === '/' ? '' : path}`;

// GA4 event for clicks that leave the site (marketplaces, WhatsApp).
export function trackOutbound(platform, url, placement) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  window.gtag('event', 'outbound_click', {
    platform,
    link_url: url,
    placement,
  });
}
