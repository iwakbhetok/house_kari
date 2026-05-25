import axios from 'axios';
import { CMS_URL, normalizeArticle } from '@/lib/cmsArticle';

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    let doc;

    if (/^\d+$/.test(id)) {
      // Numeric ID — fetch by ID
      const response = await axios.get(`${CMS_URL}/api/articles/${id}`, {
        params: { locale: 'all', depth: 2 },
      });
      doc = response.data;
    } else {
      // Slug — query by slug field
      const response = await axios.get(`${CMS_URL}/api/articles`, {
        params: { 'where[slug][equals]': id, locale: 'all', depth: 2, limit: 1 },
      });
      doc = response.data?.docs?.[0];
    }

    if (!doc) return res.status(404).json({ message: 'Article not found' });

    res.status(200).json({ data: normalizeArticle(doc, true) });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch article', error: error.message });
  }
}
