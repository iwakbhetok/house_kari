// pages/sitemap.xml.js
import { SITE_URL } from '@/lib/seo'

/*
  Safe fetch helper
  ALWAYS returns array
*/
async function safeArray(url) {
  try {
    const res = await fetch(url)
    const json = await res.json()

    if (Array.isArray(json)) return json
    if (Array.isArray(json.data)) return json.data
    if (Array.isArray(json.items)) return json.items

    return []
  } catch {
    return []
  }
}

export async function getServerSideProps({ req, res }) {
  /*
    STATIC ROUTES
    (search results and the empty lifestyle page are deliberately left out)
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
  ]

  /*
    DYNAMIC ROUTES (safe — never crashes)
    Read from this app's own API routes, which proxy the CMS.
  */
  const protocol = req.headers['x-forwarded-proto'] || 'http'
  const apiBase = `${protocol}://${req.headers.host}/api`

  const [articles, products, recipes] = await Promise.all([
    safeArray(`${apiBase}/list-article`),
    safeArray(`${apiBase}/product`),
    safeArray(`${apiBase}/all-recipes`),
  ])

  const articlePaths = articles.filter(i => i.slug).map(i => `/article-detail/${i.slug}`)
  const productPaths = products.filter(i => i.id).map(i => `/product/${i.id}`)
  const recipePaths = recipes.filter(i => i.slug).map(i => `/recipe/${i.slug}`)

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
    path => `
  <url>
    <loc>${SITE_URL}${encodeURI(path)}</loc>
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
