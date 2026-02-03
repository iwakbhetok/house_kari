// pages/sitemap.xml.js

const BASE_URL = 'https://housejapanesecurry.com' // ← change this

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

export async function getServerSideProps({ res }) {
  /*
    STATIC ROUTES (from your project)
  */
  const staticPaths = [
    '',
    '/company-history',
    '/company-profile',
    '/contact',
    '/privacy-policy',

    '/article',
    '/article/event',
    '/article/lifestyle',
    '/article/media-release',
    '/article/tips-trick',

    '/product',
    '/recipe',
    '/search-page',
  ]

  /*
    DYNAMIC ROUTES (safe — never crashes)
  */
  const [articles, products, recipes] = await Promise.all([
    safeArray(`${BASE_URL}/api/articles`),
    safeArray(`${BASE_URL}/api/products`),
    safeArray(`${BASE_URL}/api/recipes`),
  ])

  const articlePaths = articles.map(i => `/article/${i.id}`)
  const articleDetailPaths = articles.map(i => `/article-detail/${i.id}`)
  const productPaths = products.map(i => `/product/${i.id}`)
  const recipePaths = recipes.map(i => `/recipe/${i.id}`)

  const allPaths = [
    ...staticPaths,
    ...articlePaths,
    ...articleDetailPaths,
    ...productPaths,
    ...recipePaths,
  ]

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPaths
  .map(
    path => `
  <url>
    <loc>${BASE_URL}${path}</loc>
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
