import axios from 'axios';
import { lexicalToHtml } from './lexicalToHtml';

export const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL || 'http://localhost:3001';

// Pick a value from a localized field object ({ en: '...', id: '...' }) or plain string.
function loc(field, locale = 'id') {
  if (!field) return '';
  if (typeof field === 'string') return field;
  return field[locale] || field.en || field.id || '';
}

/**
 * Transform a Payload article document into the shape the frontend expects.
 * forDetail=true: converts full Lexical content to HTML.
 * forDetail=false: uses the plain-text excerpt for list cards.
 */
export function normalizeArticle(doc, forDetail = false) {
  const cat = doc.category || {};
  const catName = cat.name || {};
  const contentRaw = doc.content || {};
  const excerptRaw = doc.excerpt || {};

  // When locale=all, localized richText comes as { en: {root:...}, id: {root:...} }.
  // When locale=all, localized textarea comes as { en: '...', id: '...' }.
  const textId = forDetail
    ? lexicalToHtml(contentRaw?.id ?? contentRaw)
    : loc(excerptRaw, 'id');
  const textEn = forDetail
    ? lexicalToHtml(contentRaw?.en ?? contentRaw)
    : loc(excerptRaw, 'en');

  return {
    id: doc.id,
    title:     loc(doc.title, 'id'),
    title_en:  loc(doc.title, 'en'),
    title_chi: loc(doc.title, 'en'), // no Chinese locale in CMS; fall back to EN
    text:     textId,
    text_en:  textEn,
    text_chi: textEn,
    image: doc.featuredImage?.url || null, // full absolute URL from Payload
    date:    doc.publishedAt || doc.createdAt,
    penulis: doc.author || 'Admin',
    slug:    doc.slug,
    category: {
      id:       cat.id,
      name:     loc(catName, 'id'),
      name_en:  loc(catName, 'en'),
      name_chi: loc(catName, 'en'),
      slug:     cat.slug,
    },
  };
}

export function normalizeCategory(cat) {
  const name = cat.name || {};
  return {
    id:       cat.id,
    name:     loc(name, 'id') || loc(name, 'en'),
    name_en:  loc(name, 'en'),
    name_chi: loc(name, 'en'),
    slug:     cat.slug,
  };
}

/**
 * Resolve a category identifier (numeric ID string or slug) to a Payload category ID.
 * Returns null when not found.
 */
export async function resolveCategoryId(idOrSlug) {
  if (!idOrSlug) return null;

  // Numeric ID — use it directly
  if (/^\d+$/.test(idOrSlug)) return idOrSlug;

  // Slug — look up in CMS
  try {
    const res = await axios.get(`${CMS_URL}/api/article-categories`, {
      params: { 'where[slug][equals]': idOrSlug, limit: 1, depth: 0 },
    });
    return res.data?.docs?.[0]?.id ?? null;
  } catch {
    return null;
  }
}

// Shared Payload query params for article list endpoints
export const LIST_PARAMS = {
  'where[status][equals]': 'published',
  locale: 'all',
  depth: 2,
  limit: 100,
  sort: '-publishedAt',
};
