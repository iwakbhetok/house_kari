import axios from 'axios';
import { CMS_URL, normalizeArticle } from '@/lib/cmsArticle';

export default async function handler(req, res) {
  try {
    const response = await axios.get(`${CMS_URL}/api/articles`, {
      params: {
        'where[status][equals]': 'published',
        locale: 'all',
        depth: 2,
        limit: 2,
        sort: '-publishedAt',
      },
    });
    const docs = response.data?.docs || [];
    res.status(200).json({ data: docs.map((doc) => normalizeArticle(doc)) });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch articles', error: error.message });
  }
}
