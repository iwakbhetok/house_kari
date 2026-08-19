export const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL || 'http://localhost:3001';

function getDeviceType() {
  const ua = navigator.userAgent;
  if (/Tablet|iPad/i.test(ua)) return 'tablet';
  if (/Mobi|Android/i.test(ua)) return 'mobile';
  return 'desktop';
}

export function createTrafficTracker() {
  let recordId = null;
  let startedAt = 0;
  let clickCount = 0;

  const onClick = () => {
    clickCount += 1;
  };

  const flush = () => {
    if (!recordId) return;
    fetch(`${CMS_URL}/api/web-traffic/${recordId}`, {
      method: 'PATCH',
      keepalive: true,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        duration: Math.floor((Date.now() - startedAt) / 1000),
        clickCount,
      }),
    }).catch(() => {});
    recordId = null;
  };

  const start = (pageUrl) => {
    flush();
    startedAt = Date.now();
    clickCount = 0;
    fetch(`${CMS_URL}/api/web-traffic`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pageUrl,
        referrer: document.referrer || null,
        userAgent: navigator.userAgent,
        deviceType: getDeviceType(),
        duration: 0,
        clickCount: 0,
      }),
    })
      .then((r) => r.json())
      .then((json) => {
        recordId = json?.doc?.id ?? null;
      })
      .catch(() => {});
  };

  document.addEventListener('click', onClick);
  window.addEventListener('beforeunload', flush);

  return {
    start,
    stop: () => {
      flush();
      document.removeEventListener('click', onClick);
      window.removeEventListener('beforeunload', flush);
    },
  };
}
