// Outbound click tagging & tracking for marketplace and WhatsApp links.

const PLATFORMS = [
  { name: 'shopee', test: /(^|\.)shopee\./i },
  { name: 'tokopedia', test: /(^|\.)tokopedia\.com$/i },
  { name: 'blibli', test: /(^|\.)blibli\.com$/i },
  { name: 'lazada', test: /(^|\.)lazada\./i },
  { name: 'sayurbox', test: /(^|\.)sayurbox\.com$/i },
  { name: 'whatsapp', test: /(^|\.)(wa\.me|whatsapp\.com)$/i },
];

export function getPlatform(url) {
  try {
    const { hostname } = new URL(url);
    return PLATFORMS.find((p) => p.test.test(hostname))?.name || null;
  } catch {
    return null;
  }
}

// Append UTM params to marketplace URLs (WhatsApp links are left untouched).
export function tagUrl(url, medium = 'website') {
  const platform = getPlatform(url);
  if (!platform || platform === 'whatsapp') return url;
  try {
    const u = new URL(url);
    if (u.searchParams.has('utm_source')) return url;
    const utm = new URLSearchParams({
      utm_source: 'housejapanesecurry.com',
      utm_medium: medium,
      utm_campaign: 'marketplace_clickout',
    }).toString();
    // Append to the original query string so existing params keep their encoding.
    u.search = u.search ? `${u.search}&${utm}` : `?${utm}`;
    return u.toString();
  } catch {
    return url;
  }
}

// Delegated listener: fires one analytics event per marketplace/WhatsApp click-out.
export function installOutboundTracking(capture) {
  const onClick = (e) => {
    const link = e.target?.closest?.('a[href]');
    if (!link) return;
    const platform = getPlatform(link.href);
    if (!platform) return;

    const payload = {
      platform,
      link_url: link.href,
      link_location: link.dataset.trackLocation || 'unknown',
      page_path: window.location.pathname,
    };

    if (typeof window.gtag === 'function') {
      window.gtag('event', 'outbound_click', { ...payload, transport_type: 'beacon' });
    }
    capture?.('outbound_click', payload);
  };

  document.addEventListener('click', onClick, true);
  return () => document.removeEventListener('click', onClick, true);
}
