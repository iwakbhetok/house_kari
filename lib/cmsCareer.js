import axios from 'axios';
import { lexicalToHtml } from './lexicalToHtml';

export const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL || 'http://localhost:3001';

// Pick a value from a localized field object ({ en: '...', id: '...' }) or plain string.
function loc(field, locale = 'id') {
  if (!field) return '';
  if (typeof field === 'string') return field;
  return field[locale] || field.en || field.id || '';
}

function richTextToPlain(content, locale) {
  const html = lexicalToHtml(content?.[locale] ?? content);
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

/**
 * Transform a Payload career document into the legacy shape the frontend expects
 * (career.jobtype.name_en, career.category.name_en, career.description_en, career.date_end).
 */
export function normalizeCareer(doc) {
  const category = doc.category || {};
  const catName = category.name || {};
  const jobType = doc.jobType || {};

  return {
    id: doc.id,
    title: loc(doc.title, 'id'),
    title_en: loc(doc.title, 'en'),
    description: richTextToPlain(doc.description, 'id'),
    description_en: richTextToPlain(doc.description, 'en'),
    description_chi: richTextToPlain(doc.description, 'en'),
    requirements: richTextToPlain(doc.requirements, 'id'),
    requirements_en: richTextToPlain(doc.requirements, 'en'),
    applyUrl: doc.applyUrl || null,
    date_end: doc.closingDate,
    status: doc.status,
    slug: doc.slug,
    jobtype: {
      id: jobType.id,
      name: loc(jobType.name, 'id'),
      name_en: loc(jobType.name, 'en'),
      name_chi: loc(jobType.name, 'en'),
    },
    category: {
      id: category.id,
      name: loc(catName, 'id'),
      name_en: loc(catName, 'en'),
      name_chi: loc(catName, 'en'),
    },
  };
}

export function normalizeCareerCategory(cat) {
  const name = cat.name || {};
  return {
    id: cat.id,
    name: loc(name, 'id') || loc(name, 'en'),
    name_en: loc(name, 'en'),
    name_chi: loc(name, 'en'),
  };
}

/**
 * Resolve a category identifier (numeric ID string or slug/name) to a Payload category ID.
 * Returns null when not found.
 */
export async function resolveCareerCategoryId(idOrSlug) {
  if (!idOrSlug) return null;
  if (/^\d+$/.test(idOrSlug)) return idOrSlug;
  return null;
}

// Shared Payload query params for career list endpoints
export const CAREER_LIST_PARAMS = {
  'where[status][equals]': 'open',
  locale: 'all',
  depth: 2,
  limit: 100,
  sort: '-closingDate',
};
