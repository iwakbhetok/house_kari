// pages/sitemap.xml.js

import { CMS_URL } from '@/lib/cmsArticle'

const BASE_URL = 'https://housejapanesecurry.com'

/*
  Fetch published docs straight from the CMS (Payload).
  ALWAYS returns an array so the sitemap never crashes.
*/
async function fetchDocs(collection, where) {
  try {
    const params = new URLSearchParams({ limit: '1000', depth: '0', ...where })
    const res = await fetch(`${CMS_URL}/api/${collection}?${params}`, {
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) return []
    const json = await res.json()
    return Array.isArray(json?.docs) ? json.docs : []
  } catch {
    return []
  }
}

const isoDate = (doc) => {
  const d = new Date(doc?.updatedAt || doc?.publishedAt || doc?.createdAt || NaN)
  return Number.isNaN(d.getTime()) ? null : d.toISOString()
}

export async function getServerSideProps({ res }) {
  /*
    STATIC ROUTES (search page intentionally excluded — internal results are noindex)
  */
  const staticPaths = [
    '',
    '/company-history',
    '/company-profile',
    '/contact',
    '/privacy-policy',
    '/rfq',

    '/article',
    '/article/event',
    '/article/media-release',
    '/article/tips-trick',

    '/product',
    '/recipe',
  ].map((path) => ({ path, lastmod: null }))

  /*
    DYNAMIC ROUTES — same URL shapes the site itself links to
  */
  const [articles, products, recipes] = await Promise.all([
    fetchDocs('articles', { 'where[status][equals]': 'published' }),
    fetchDocs('products', { 'where[status][equals]': 'active' }),
    fetchDocs('recipes', { 'where[status][equals]': 'published' }),
  ])

  const articlePaths = articles.map((i) => ({ path: `/article-detail/${i.slug || i.id}`, lastmod: isoDate(i) }))
  const productPaths = products.map((i) => ({ path: `/product/${i.id}`, lastmod: isoDate(i) }))
  // Recipe detail pages resolve by slug only, so skip recipes without one.
  const recipePaths = recipes
    .filter((i) => i.slug)
    .map((i) => ({ path: `/recipe/${i.slug}`, lastmod: isoDate(i) }))

  const allPaths = [
    ...staticPaths,
    ...articlePaths,
    ...productPaths,
    ...recipePaths,
  ]

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPaths
  .map(
    ({ path, lastmod }) => `
  <url>
    <loc>${BASE_URL}${encodeURI(path).replace(/&/g, '&amp;')}</loc>${lastmod ? `
    <lastmod>${lastmod}</lastmod>` : ''}
    <changefreq>weekly</changefreq>
    <priority>${path === '' ? '1.0' : '0.8'}</priority>
  </url>`
  )
  .join('')}
</urlset>`

  res.setHeader('Content-Type', 'text/xml')

  // optional cache (faster production)
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=3600, stale-while-revalidate=600'
  )

  res.write(sitemap)
  res.end()

  return { props: {} }
}

export default function Sitemap() {
  return null
}
