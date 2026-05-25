import axios from 'axios';
import { CMS_URL, normalizeCategory } from '@/lib/cmsArticle';

export default async function handler(req, res) {
  try {
    const response = await axios.get(`${CMS_URL}/api/article-categories`, {
      params: { locale: 'all', limit: 100, sort: 'createdAt' },
    });
    const docs = response.data?.docs || [];
    res.status(200).json({ data: docs.map(normalizeCategory) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch article categories' });
  }
}
